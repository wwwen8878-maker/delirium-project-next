import { useState, useEffect, useCallback, useMemo } from 'react'
import { AssessmentFormData, AssessmentResult, AssessmentState } from '../types'
import { AssessmentStorage, AutoSave } from '../storage'
import { AssessmentFormSchema } from '../types'
import { ZodError, ZodIssue } from 'zod'

export function useAssessment() {
  const [state, setState] = useState<AssessmentState>(() => AssessmentStorage.getInitialState())
  const [errors, setErrors] = useState<Partial<Record<keyof AssessmentFormData, string>>>({})
  
  // 修复: 使用 useMemo 避免 autoSave 在每次渲染时重新创建
  const autoSave = useMemo(() => new AutoSave(2000), []) // Auto-save every 2 seconds

  // Auto-save form data
  useEffect(() => {
    if (Object.keys(state.currentForm).length > 0) {
      autoSave.save(state.currentForm)
    }
  }, [state.currentForm, autoSave])

  // Clean up auto-save on unmount
  useEffect(() => {
    return () => autoSave.clear()
  }, [autoSave])

  const validateField = useCallback((field: keyof AssessmentFormData, value: unknown) => {
    try {
      // Create a partial schema for this field
      const fieldSchema = AssessmentFormSchema.shape[field]

      if (field === 'comorbidities' || field === 'medications') {
        // Handle array fields
        fieldSchema.parse(state.currentForm[field] || [])
      } else {
        fieldSchema.parse(value)
      }

      // Clear error if validation passes
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    } catch (error: unknown) { // 修复: 使用 unknown 替换 any
      // 修复: 检查 error 是否为 ZodError 实例
      if (error instanceof ZodError) { 
        setErrors(prev => ({
          ...prev,
          // 修复: 使用 .issues 替换 .errors
          [field]: error.issues?.[0]?.message || '验证失败'
        }))
      }
    }
  }, [state.currentForm])

  const updateForm = useCallback((field: keyof AssessmentFormData, value: string | boolean, validate = true) => {
    setState(prev => ({
      ...prev,
      currentForm: {
        ...prev.currentForm,
        [field]: value
      }
    }))

    // Clear error for this field if exists
    if (errors[field as keyof AssessmentFormData]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field as keyof AssessmentFormData]
        return newErrors
      })
    }

    // Validate individual field if requested
    if (validate) {
      validateField(field, value)
    }
  }, [errors, validateField]) // 修复: 添加 validateField 依赖

  const handleArrayField = useCallback((field: 'comorbidities' | 'medications', value: string, checked: boolean) => {
    setState(prev => ({
      ...prev,
      currentForm: {
        ...prev.currentForm,
        [field]: checked
          ? [...(prev.currentForm[field] || []), value]
: (prev.currentForm[field] || []).filter((item: string) => item !== value)
      }
    }))
  }, [])

  const validateForm = useCallback((): boolean => {
    try {
      AssessmentFormSchema.parse(state.currentForm)
      setErrors({})
      return true
    } catch (error: unknown) { // 修复: 使用 unknown 替换 any
      const validationErrors: Partial<Record<keyof AssessmentFormData, string>> = {}
      if (error instanceof ZodError) { // 修复: 检查 error 是否为 ZodError 实例
        // 修复: 使用 .issues 替换 .errors
        error.issues.forEach((err: ZodIssue) => { // 修复: 明确 err 类型
          const path = err.path?.[0] as keyof AssessmentFormData
          if (path) {
            validationErrors[path] = err.message
          }
        })
      }
      setErrors(validationErrors)
      return false
    }
  }, [state.currentForm])

  const calculateRisk = useCallback(async (): Promise<AssessmentResult> => {
    setState(prev => ({ ...prev, isCalculating: true }))

    // Simulate calculation delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    const formData = state.currentForm as AssessmentFormData
    let score = 0

    // Age scoring
    const age = formData.age
    if (age >= 65) score += 3
    else if (age >= 50) score += 2
    else if (age >= 35) score += 1

    // Gender scoring
    if (formData.gender === 'female') score += 1

    // Education scoring
    const educationScores: Record<string, number> = {
      '小学及以下': 2,
      '初中': 1
    }
    score += educationScores[formData.education] || 0

    // Cognitive assessment
    if (formData.mmseScore) {
      const mmse = parseInt(formData.mmseScore)
      if (mmse < 24) score += 3
      else if (mmse < 27) score += 2
    }
    if (formData.mocaScore) {
      const moca = parseInt(formData.mocaScore)
      if (moca < 23) score += 3
      else if (moca < 26) score += 2
    }

    // Surgery type scoring
    const surgeryScores: Record<string, number> = {
      '心脏手术': 3,
      '神经外科': 3,
      '骨科大手术': 2,
      '腹部大手术': 2
    }
    score += surgeryScores[formData.surgeryType] || 0

    // Surgery urgency
    if (formData.surgeryUrgency === '急诊手术') score += 2

    // Surgery duration
    if (formData.estimatedDuration === '超过4小时') score += 2
    else if (formData.estimatedDuration === '2-4小时') score += 1

    // Comorbidities
    score += Math.min(formData.comorbidities.length, 3)

    // Medications
    const highRiskMeds = formData.medications.filter((med: string) =>
      med === '苯二氮卓类药物' || med === '阿片类药物' || med === '抗胆碱药物'
    ).length
    score += highRiskMeds

    // Lifestyle
    if (formData.alcoholUse === '经常饮酒') score += 1
    if (formData.smokingHistory === '正在吸烟') score += 1

    // Functional status
    if (formData.adlScore) {
      const adl = parseInt(String(formData.adlScore))
      if (adl < 4) score += 2
    }
    if (formData.frailtyScore) {
      const frailty = parseInt(String(formData.frailtyScore))
      if (frailty >= 3) score += 2
    }

    // Sensory impairments
    if (formData.visionImpairment) score += 1
    if (formData.hearingImpairment) score += 1
    if (formData.sleepDisorders) score += 1
    if (formData.depression) score += 1
    if (formData.anxiety) score += 1

    let riskLevel: '低风险' | '中等风险' | '高风险' = '低风险'
    let probability = ''

    if (score >= 15) {
      riskLevel = '高风险'
      probability = '大于30%'
    } else if (score >= 8) {
      riskLevel = '中等风险'
      probability = '15-30%'
    } else {
      riskLevel = '低风险'
      probability = '小于15%'
    }

    const recommendations = []
    if (score >= 15) {
      recommendations.push('强烈建议术前进行认知评估和优化')
      recommendations.push('考虑多学科协作制定预防策略')
      recommendations.push('术后应密切监测认知状态')
      recommendations.push('建议家属参与全程护理')
    } else if (score >= 8) {
      recommendations.push('建议术前认知筛查')
      recommendations.push('实施基础预防措施')
      recommendations.push('加强术后观察')
    } else {
      recommendations.push('常规预防措施即可')
      recommendations.push('保持正常术前准备')
    }

    const result: AssessmentResult = { totalScore: score, riskLevel, probability, recommendations }

    setState(prev => ({ ...prev, currentResult: result, isCalculating: false }))

    // Save to history
    const savedAssessment = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      formData,
      result
    }
    AssessmentStorage.saveAssessment(savedAssessment)

    // Update history in state
    setState(prev => ({
      ...prev,
      history: [savedAssessment, ...prev.history.slice(0, 49)]
    }))

    return result
  }, [state.currentForm]) // 修复: 移除 state.history 依赖

  const resetForm = useCallback(() => {
    AssessmentStorage.clearCurrentForm()
    setState(prev => ({
      ...prev,
      currentForm: {},
      currentResult: null
    }))
    setErrors({})
    autoSave.clear()
  }, [autoSave])

  const loadSavedForm = useCallback((id: string) => {
    const assessment = state.history.find(item => item.id === id)
    if (assessment) {
      setState(prev => ({
        ...prev,
        currentForm: assessment.formData,
        currentResult: assessment.result
      }))
    }
  }, [state.history])

  return {
    state,
    errors,
    updateForm,
    handleArrayField,
    validateForm,
    calculateRisk,
    resetForm,
    loadSavedForm,
  }
}
