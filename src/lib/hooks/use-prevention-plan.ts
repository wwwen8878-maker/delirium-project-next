// 预防计划生成和管理Hook

import { useState, useEffect, useCallback } from 'react';
import { PreventionPlan, RiskLevel, PlanCategory, PlanPriority, PlanFrequency } from '@/lib/types/enhanced';
import { useEnhancedAssessment } from './use-enhanced-assessment';
import { enhancedStorage } from '@/lib/storage/enhanced-storage';

interface EnhancedAssessmentResult {
  totalScore: number;
  riskLevel: '低风险' | '中等风险' | '高风险';
  probability: string;
  recommendations: string[];
  diaryInsights: {
    moodStability: number;
    symptomFrequency: number;
    sleepQuality: number;
    medicationAdherence: boolean;
    emotionalHealth: number;
  };
  personalizedFactors: string[];
  trendAnalysis: {
    trend: 'improving' | 'stable' | 'worsening';
    confidence: number;
  };
  preventivePlan: {
    urgentActions: string[];
    dailyTasks: string[];
    monitoringFrequency: 'daily' | 'hourly' | 'weekly';
  };
}

export interface UsePreventionPlanReturn {
  // 数据状态
  plans: PreventionPlan[];
  activePlans: PreventionPlan[];
  completedPlans: PreventionPlan[];
  todayPlans: PreventionPlan[];
  isLoading: boolean;

  // 操作方法
  generatePlans: (assessmentResult: EnhancedAssessmentResult) => Promise<void>;
  addCustomPlan: (planData: Omit<PreventionPlan, 'id' | 'createdAt'>) => Promise<void>;
  updatePlanProgress: (planId: string, progress: number) => Promise<void>;
  completePlan: (planId: string) => Promise<void>;
  deletePlan: (planId: string) => Promise<void>;

  // 统计方法
  getCompletionRate: () => number;
  getPlansByCategory: (category: PlanCategory) => PreventionPlan[];
  getPlansByPriority: (priority: PlanPriority) => PreventionPlan[];

  // 推荐生成
  generateRecommendations: (riskLevel: RiskLevel) => PreventionPlan[];
}

export function usePreventionPlan(): UsePreventionPlanReturn {
  const [plans, setPlans] = useState<PreventionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 初始化加载数据
  useEffect(() => {
    const loadPlans = () => {
      try {
        const storedPlans = enhancedStorage.preventionPlans.getAllPlans();
        setPlans(storedPlans);
      } catch (error) {
        console.error('加载预防计划失败:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPlans();
  }, []);

  // 生成基于评估结果的预防计划
  const generatePlans = useCallback(async (assessmentResult: EnhancedAssessmentResult) => {
    try {
      const basePlans = generateRecommendations(assessmentResult.riskLevel);
      const enhancedPlans = enhancePlansWithInsights(basePlans, assessmentResult);

      // 添加生成的计划到列表中
      const existingIds = new Set(plans.map(p => p.id));
      const newPlans = enhancedPlans.filter(p => !existingIds.has(p.id));

      const allPlans = [...plans, ...newPlans];
      setPlans(allPlans);

      // 保存到存储
      newPlans.forEach(plan => enhancedStorage.preventionPlans.savePlan(plan));

    } catch (error) {
      console.error('生成预防计划失败:', error);
      throw new Error('生成预防计划失败，请稍后重试');
    }
  }, [plans]);

  // 添加自定义计划
  const addCustomPlan = useCallback(async (planData: Omit<PreventionPlan, 'id' | 'createdAt'>) => {
    try {
      const newPlan: PreventionPlan = {
        ...planData,
        id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
      };

      const updatedPlans = [...plans, newPlan];
      setPlans(updatedPlans);
      enhancedStorage.preventionPlans.savePlan(newPlan);

    } catch (error) {
      console.error('添加自定义计划失败:', error);
      throw new Error('添加计划失败，请稍后重试');
    }
  }, [plans]);

  // 更新计划进度
  const updatePlanProgress = useCallback(async (planId: string, progress: number) => {
    try {
      const updatedPlans = plans.map(plan =>
        plan.id === planId
          ? { ...plan, progress: Math.max(0, Math.min(100, progress)) }
          : plan
      );
      setPlans(updatedPlans);

      const plan = updatedPlans.find(p => p.id === planId);
      if (plan) {
        enhancedStorage.preventionPlans.savePlan(plan);
      }

    } catch (error) {
      console.error('更新计划进度失败:', error);
      throw new Error('更新进度失败，请稍后重试');
    }
  }, [plans]);

  // 完成计划
  const completePlan = useCallback(async (planId: string) => {
    try {
      await updatePlanProgress(planId, 100);
      enhancedStorage.preventionPlans.completePlan(planId);

    } catch (error) {
      console.error('完成计划失败:', error);
      throw new Error('完成计划失败，请稍后重试');
    }
  }, [updatePlanProgress]);

  // 删除计划
  const deletePlan = useCallback(async (planId: string) => {
    try {
      enhancedStorage.preventionPlans.deletePlan(planId);
      setPlans(prev => prev.filter(plan => plan.id !== planId));

    } catch (error) {
      console.error('删除计划失败:', error);
      throw new Error('删除计划失败，请稍后重试');
    }
  }, []);

  // 获取完成率
  const getCompletionRate = useCallback(() => {
    if (plans.length === 0) return 0;
    const completedCount = plans.filter(plan => plan.completed).length;
    return Math.round((completedCount / plans.length) * 100);
  }, [plans]);

  // 按类别过滤计划
  const getPlansByCategory = useCallback((category: PlanCategory) => {
    return plans.filter(plan => plan.category === category);
  }, [plans]);

  // 按优先级过滤计划
  const getPlansByPriority = useCallback((priority: PlanPriority) => {
    return plans.filter(plan => plan.priority === priority);
  }, [plans]);

  // 生成基础推荐计划
  const generateRecommendations = useCallback((riskLevel: RiskLevel): PreventionPlan[] => {
    const recommendations = [];

    // 高风险推荐
    if (riskLevel === '高风险') {
      recommendations.push(
        {
          id: 'icu_monitoring',
          title: '强化术后监测',
          description: '安排专业医护人员进行24小时认知状态监测',
          priority: 'high' as const,
          frequency: 'daily' as const,
          category: 'monitoring' as const,
          completed: false,
          progress: 0,
          createdAt: new Date().toISOString(),
          dueDate: getNextDays(1),
        },
        {
          id: 'family_training',
          title: '家属培训课程',
          description: '学习谵妄早期识别和紧急干预方法',
          priority: 'high' as const,
          frequency: 'once' as const,
          category: 'education' as const,
          completed: false,
          progress: 0,
          createdAt: new Date().toISOString(),
          dueDate: getNextDays(3),
        },
        {
          id: 'medication_review',
          title: '药物调整评估',
          description: '咨询医生重新评估用药方案，减少谵妄风险药物',
          priority: 'high' as const,
          frequency: 'weekly' as const,
          category: 'medication' as const,
          completed: false,
          progress: 0,
          createdAt: new Date().toISOString(),
          dueDate: getNextDays(2),
        }
      );
    }

    // 中等风险推荐
    else if (riskLevel === '中等风险') {
      recommendations.push(
        {
          id: 'regular_checkups',
          title: '定期认知评估',
          description: '每隔12小时进行一次简单认知状态检查',
          priority: 'medium' as const,
          frequency: 'daily' as const,
          category: 'monitoring' as const,
          completed: false,
          progress: 0,
          createdAt: new Date().toISOString(),
          dueDate: getNextDays(7),
        },
        {
          id: 'environment_optimization',
          title: '环境优化调整',
          description: '保持病房安静、光线适宜，提供熟悉物品',
          priority: 'medium' as const,
          frequency: 'daily' as const,
          category: 'lifestyle' as const,
          completed: false,
          progress: 0,
          createdAt: new Date().toISOString(),
          dueDate: getNextDays(1),
        }
      );
    }

    // 低风险推荐
    else {
      recommendations.push(
        {
          id: 'baseline_monitoring',
          title: '基础健康监测',
          description: '观察一般健康状态，无需特殊干预',
          priority: 'low' as const,
          frequency: 'weekly' as const,
          category: 'monitoring' as const,
          completed: false,
          progress: 0,
          createdAt: new Date().toISOString(),
          dueDate: getNextDays(14),
        }
      );
    }

    return recommendations;
  }, []);

  // 增强计划与评估洞察
  const enhancePlansWithInsights = (
    basePlans: PreventionPlan[],
    assessmentResult: EnhancedAssessmentResult
  ): PreventionPlan[] => {
    const enhancedPlans = [...basePlans];

    // 基于情绪健康的计划增强
    if (assessmentResult.diaryInsights.emotionalHealth < 3) {
      enhancedPlans.push({
        id: 'emotional_support_plan',
        title: '情绪健康支持计划',
        description: '每日进行情绪记录，为期30天的情绪管理干预',
        priority: 'medium' as const,
        frequency: 'daily' as const,
        category: 'lifestyle' as const,
        completed: false,
        progress: 0,
        createdAt: new Date().toISOString(),
        dueDate: getNextDays(30),
      });
    }

    // 基于睡眠质量的计划增强
    if (assessmentResult.diaryInsights.sleepQuality < 3) {
      enhancedPlans.push({
        id: 'sleep_improvement_plan',
        title: '睡眠改善计划',
        description: '优化睡眠环境，建立规律作息习惯',
        priority: 'medium' as const,
        frequency: 'daily' as const,
        category: 'lifestyle' as const,
        completed: false,
        progress: 0,
        createdAt: new Date().toISOString(),
        dueDate: getNextDays(21),
      });
    }

    // 基于症状频率的计划增强
    if (assessmentResult.diaryInsights.symptomFrequency > 2) {
      enhancedPlans.push({
        id: 'symptom_management_plan',
        title: '症状管理计划',
        description: '加强症状追踪，早期发现并干预',
        priority: 'high' as const,
        frequency: 'daily' as const,
        category: 'monitoring' as const,
        completed: false,
        progress: 0,
        createdAt: new Date().toISOString(),
        dueDate: getNextDays(7),
      });
    }

    return enhancedPlans;
  };

  // 计算天数辅助函数
  const getNextDays = (days: number): string => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  };

  // 计算各种状态的计划
  const activePlans = plans.filter(plan => !plan.completed);
  const completedPlans = plans.filter(plan => plan.completed);
  const todayPlans = enhancedStorage.preventionPlans.getTodayPlans();

  return {
    // 数据状态
    plans,
    activePlans,
    completedPlans,
    todayPlans,
    isLoading,

    // 操作方法
    generatePlans,
    addCustomPlan,
    updatePlanProgress,
    completePlan,
    deletePlan,

    // 统计方法
    getCompletionRate,
    getPlansByCategory,
    getPlansByPriority,

    // 推荐生成
    generateRecommendations,
  };
}
