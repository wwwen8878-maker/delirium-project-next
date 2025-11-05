import { SavedAssessment, AssessmentState, AssessmentFormData } from './types'

const STORAGE_KEYS = {
  ASSESSMENT_HISTORY: 'delirium_assessment_history',
  CURRENT_FORM: 'delirium_current_form',
} as const

// Local Storage Utilities
export class AssessmentStorage {
  private static isClient(): boolean {
    return typeof window !== 'undefined'
  }

  static saveAssessment(assessment: SavedAssessment): void {
    if (!this.isClient()) return

    try {
      const history = this.getAssessmentHistory()
      history.unshift(assessment) // Add to beginning

      // Keep only last 50 assessments
      if (history.length > 50) {
        history.splice(50)
      }

      localStorage.setItem(STORAGE_KEYS.ASSESSMENT_HISTORY, JSON.stringify(history))
    } catch (error) {
      console.warn('Failed to save assessment:', error)
    }
  }

  static getAssessmentHistory(): SavedAssessment[] {
    if (!this.isClient()) return []

    try {
      const data = localStorage.getItem(STORAGE_KEYS.ASSESSMENT_HISTORY)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.warn('Failed to load assessment history:', error)
      return []
    }
  }

  static saveCurrentForm(formData: Partial<AssessmentFormData>): void {
    if (!this.isClient()) return

    try {
      const dataToSave = {
        ...formData,
        timestamp: Date.now()
      }
      localStorage.setItem(STORAGE_KEYS.CURRENT_FORM, JSON.stringify(dataToSave))
    } catch (error) {
      console.warn('Failed to save current form:', error)
    }
  }

  static getCurrentForm(): Partial<AssessmentFormData> | null {
    if (!this.isClient()) return null

    try {
      const data = localStorage.getItem(STORAGE_KEYS.CURRENT_FORM)
      if (!data) return null

      const parsed = JSON.parse(data)
      // Check if data is older than 24 hours
      if (Date.now() - parsed.timestamp > 24 * 60 * 60 * 1000) {
        this.clearCurrentForm()
        return null
      }

      delete parsed.timestamp
      return parsed
    } catch (error) {
      console.warn('Failed to load current form:', error)
      return null
    }
  }

  static clearCurrentForm(): void {
    if (!this.isClient()) return

    try {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_FORM)
    } catch (error) {
      console.warn('Failed to clear current form:', error)
    }
  }

  static clearHistory(): void {
    if (!this.isClient()) return

    try {
      localStorage.removeItem(STORAGE_KEYS.ASSESSMENT_HISTORY)
    } catch (error) {
      console.warn('Failed to clear assessment history:', error)
    }
  }

  static deleteAssessment(assessmentId: string): void {
    if (!this.isClient()) return

    try {
      const history = this.getAssessmentHistory()
      const filtered = history.filter(item => item.id !== assessmentId)
      localStorage.setItem(STORAGE_KEYS.ASSESSMENT_HISTORY, JSON.stringify(filtered))
    } catch (error) {
      console.warn('Failed to delete assessment:', error)
    }
  }

  static getInitialState(): AssessmentState {
    return {
      currentForm: this.getCurrentForm() || {},
      currentResult: null,
      isCalculating: false,
      history: this.getAssessmentHistory(),
    }
  }

  // Export data for user download
  static exportData(): string {
    const history = this.getAssessmentHistory()
    return JSON.stringify({
      exportDate: new Date().toISOString(),
      assessments: history,
      totalAssessments: history.length
    }, null, 2)
  }

  // Import data from user upload
  static importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData)
      if (data.assessments && Array.isArray(data.assessments)) {
        localStorage.setItem(STORAGE_KEYS.ASSESSMENT_HISTORY, JSON.stringify(data.assessments))
        return true
      }
      return false
    } catch (error) {
      console.warn('Failed to import data:', error)
      return false
    }
  }
}

// Auto-save functionality with debouncing
export class AutoSave {
  private timeoutId: NodeJS.Timeout | null = null
  private readonly delay: number

  constructor(delayMs: number = 1000) {
    this.delay = delayMs
  }

  save(formData: Partial<AssessmentFormData>): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId)
    }

    this.timeoutId = setTimeout(() => {
      AssessmentStorage.saveCurrentForm(formData)
    }, this.delay)
  }

  clear(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId)
      this.timeoutId = null
    }
  }
}