// 增强评估Hook - 集成健康日记数据

import { useState, useEffect, useMemo } from 'react';
import { useHealthDiary } from './use-health-diary';
import { enhancedStorage } from '@/lib/storage/enhanced-storage';
import { PreventionPlan, AssessmentFormData } from '@/lib/types/enhanced';

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

interface AssessmentDiaryInsights {
  averageMoodScore: number;
  moodVolatility: number;
  symptomTrends: Record<string, number>;
  sleepConsistency: number;
  medicationTracking: boolean;
  recentEmotionalHealth: number;
  activityLevel: number;
  socialEngagement: number;
}

export function useEnhancedAssessment() {
  const { entries, getMoodTrend, getSymptomFrequency, getAverageSleepQuality } = useHealthDiary();
  const [diaryInsights, setDiaryInsights] = useState<AssessmentDiaryInsights | null>(null);

  // 计算健康日记洞察数据
  useEffect(() => {
    if (entries.length > 0) {
      const moodTrend = getMoodTrend(30);
      const symptomFreq = getSymptomFrequency(30);
      const avgSleep = getAverageSleepQuality(30);

      // 计算平均情绪分数 (1-5)
      const avgMoodScore = moodTrend.length > 0
        ? (moodTrend.reduce((sum, item) => sum + item.moodScore, 0) / moodTrend.length)
        : 3;

      // 计算情绪波动性
      const moodVolatility = moodTrend.length > 1
        ? moodTrend.reduce((sum, item, index, arr) => {
            if (index > 0) {
              const diff = Math.abs(item.moodScore - arr[index - 1].moodScore);
              return sum + diff;
            }
            return sum;
          }, 0) / (moodTrend.length - 1)
        : 0;

      // 计算睡眠一致性 (低波动 = 高一致性)
      const sleepScores = entries.slice(0, 30).map(entry => entry.sleepQuality);
      const sleepConsistency = sleepScores.length > 1
        ? 1 / (1 + sleepScores.reduce((sum, score, index, arr) => {
            if (index > 0) {
              return sum + Math.pow(score - arr[index - 1], 2);
            }
            return sum;
          }, 0) / sleepScores.length) * 5
        : 3;

      // 检查用药追踪
      const medicationTracking = entries.some(entry => entry.medication.length > 0);

      // 计算近期情绪健康 (最近7天的权重更高)
      const recentEntries = entries.slice(0, 7);
      const recentEmotionalHealth = recentEntries.length > 0
        ? recentEntries.reduce((sum, entry) => {
            const weights = {'excellent': 5, 'good': 4, 'fair': 3, 'poor': 2};
            return sum + weights[entry.mood as keyof typeof weights];
          }, 0) / recentEntries.length
        : 3;

      // 计算活动水平 (基于症状记录的活跃度推断)
      const activeSymptomReporting = entries.filter(entry => entry.symptoms.length > 0).length;
      const activityLevel = entries.length > 0 ? (activeSymptomReporting / entries.length) * 5 : 0;

      setDiaryInsights({
        averageMoodScore: Math.round(avgMoodScore * 10) / 10,
        moodVolatility: Math.round(moodVolatility * 10) / 10,
        symptomTrends: symptomFreq,
        sleepConsistency: Math.round(sleepConsistency * 10) / 10,
        medicationTracking,
        recentEmotionalHealth: Math.round(recentEmotionalHealth * 10) / 10,
        activityLevel: Math.round(activityLevel * 10) / 10,
        socialEngagement: 3, // 默认中等社交参与度
      });
    }
  }, [entries, getMoodTrend, getSymptomFrequency, getAverageSleepQuality]);

  // 基于日记洞察增强风险计算
  const calculateEnhancedRisk = useMemo(() =>
    (baseScore: number, formData: AssessmentFormData): EnhancedAssessmentResult => {
      let adjustedScore = baseScore;

      // 基于日记数据调整评分
      if (diaryInsights) {
        // 情绪稳定性调整
        if (diaryInsights.moodVolatility > 1.5) {
          adjustedScore += 2; // 情绪波动大增加风险
        } else if (diaryInsights.moodVolatility < 0.5) {
          adjustedScore -= 1; // 情绪稳定减少风险
        }

        // 睡眠一致性调整
        if (diaryInsights.sleepConsistency < 3) {
          adjustedScore += 2; // 睡眠不规律增加风险
        }

        // 用药追踪调整
        if (diaryInsights.medicationTracking && (formData.medications?.length || 0) > 0) {
          adjustedScore -= 1; // 规范用药追踪减少风险
        }

        // 近期情绪健康调整
        if (diaryInsights.recentEmotionalHealth < 3) {
          adjustedScore += 1; // 近期情绪不佳增加风险
        }

        // 症状报告活跃度
        if (diaryInsights.activityLevel > 3) {
          adjustedScore += 1; // 频繁自觉症状可能需要更多关注
        }
      }

      // 确保分数在合理范围内
      adjustedScore = Math.max(0, Math.min(30, adjustedScore));

      // 确定风险等级
      let riskLevel: '低风险' | '中等风险' | '高风险' = '低风险';
      let probability = '';

      if (adjustedScore >= 15) {
        riskLevel = '高风险';
        probability = '大于30%';
      } else if (adjustedScore >= 8) {
        riskLevel = '中等风险';
        probability = '15-30%';
      } else {
        riskLevel = '低风险';
        probability = '小于15%';
      }

      // 构建日记洞察数据
      const diaryInsightsData = {
        moodStability: diaryInsights?.recentEmotionalHealth || 3,
        symptomFrequency: diaryInsights?.activityLevel || 0,
        sleepQuality: diaryInsights?.sleepConsistency || 3,
        medicationAdherence: diaryInsights?.medicationTracking || false,
        emotionalHealth: diaryInsights?.recentEmotionalHealth || 3,
      };

      // 生成个性化建议
      const personalizedFactors = [];
      if (diaryInsights) {
        if (diaryInsights.moodVolatility > 1.5) {
          personalizedFactors.push('情绪波动较大，建议加强心理支持');
        }
        if (diaryInsights.sleepConsistency < 3) {
          personalizedFactors.push('睡眠规律需要改善');
        }
        if (diaryInsights.recentEmotionalHealth < 3) {
          personalizedFactors.push('近期情绪健康需要关注');
        }
        if (!diaryInsights.medicationTracking) {
          personalizedFactors.push('建议建立用药记录习惯');
        }
      }

      // 生成预防计划
      const preventivePlan = {
        urgentActions: [] as string[],
        dailyTasks: [] as string[],
        monitoringFrequency: 'daily' as 'daily' | 'hourly' | 'weekly',
      };

      if (riskLevel === '高风险') {
        preventivePlan.urgentActions.push('立即咨询多学科医疗团队');
        preventivePlan.urgentActions.push('启动强化预防措施');
        preventivePlan.monitoringFrequency = 'hourly';
      } else if (riskLevel === '中等风险') {
        preventivePlan.urgentActions.push('加强术前认知评估');
        preventivePlan.urgentActions.push('制定个性化预防方案');
      } else {
        preventivePlan.dailyTasks.push('保持健康生活习惯');
        preventivePlan.dailyTasks.push('定期健康监测');
      }

      // 标准风险等级建议
      const standardRecommendations = [];
      if (riskLevel === '高风险') {
        standardRecommendations.push('强烈建议术前进行认知评估和优化');
        standardRecommendations.push('考虑多学科协作制定预防策略');
        standardRecommendations.push('术后应密切监测认知状态');
        standardRecommendations.push('建议家属参与全程护理');
      } else if (riskLevel === '中等风险') {
        standardRecommendations.push('建议术前认知筛查');
        standardRecommendations.push('实施基础预防措施');
        standardRecommendations.push('加强术后观察');
      } else {
        standardRecommendations.push('常规预防措施即可');
        standardRecommendations.push('保持正常术前准备');
      }

      // 添加个性化建议
      const allRecommendations = [...standardRecommendations, ...personalizedFactors];

      // 判断趋势
      const trend = adjustedScore > baseScore ? 'worsening' : adjustedScore < baseScore ? 'improving' : 'stable';
      const confidence = 0.8; // 基于日记数据的置信度

      return {
        totalScore: adjustedScore,
        riskLevel,
        probability,
        recommendations: allRecommendations,
        diaryInsights: diaryInsightsData,
        personalizedFactors,
        trendAnalysis: {
          trend,
          confidence,
        },
        preventivePlan,
      };
    },
    [diaryInsights]
  );

  // 自动生成预防计划
  const generatePreventivePlan = (assessmentResult: EnhancedAssessmentResult): PreventionPlan[] => {
    const plans: PreventionPlan[] = [];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    // 基于情绪健康
    if (assessmentResult.diaryInsights.emotionalHealth < 3) {
      plans.push({
        id: 'emotional-support',
        title: '情绪健康支持',
        description: '每日进行情绪记录和放松练习',
        priority: 'high',
        frequency: 'daily',
        category: 'lifestyle',
        completed: false,
        dueDate: tomorrow.toISOString().split('T')[0],
        progress: 0,
        createdAt: new Date().toISOString(),
      });
    }

    // 基于睡眠质量
    if (assessmentResult.diaryInsights.sleepQuality < 3) {
      plans.push({
        id: 'sleep-management',
        title: '睡眠管理改善',
        description: '建立规律作息时间，优化睡眠环境',
        priority: 'medium',
        frequency: 'daily',
        category: 'lifestyle',
        completed: false,
        dueDate: tomorrow.toISOString().split('T')[0],
        progress: 0,
        createdAt: new Date().toISOString(),
      });
    }

    // 基于健康监测
    plans.push({
      id: 'health-monitoring',
      title: '定期健康监测',
      description: '每日记录健康状态，包括情绪、睡眠和症状',
      priority: 'medium',
      frequency: 'daily',
      category: 'monitoring',
      completed: false,
      dueDate: tomorrow.toISOString().split('T')[0],
      progress: 0,
      createdAt: new Date().toISOString(),
    });

    // 基于风险等级
    if (assessmentResult.riskLevel === '高风险') {
      plans.push({
        id: 'intensive-care',
        title: '强化护理策略',
        description: '家属参与全程护理，密切关注认知状态变化',
        priority: 'high',
        frequency: 'daily',
        category: 'monitoring',
        completed: false,
        dueDate: tomorrow.toISOString().split('T')[0],
        progress: 0,
        createdAt: new Date().toISOString(),
      });
    }

    return plans;
  };

  // 获取家庭协作数据
  const getFamilyCollaborationData = () => {
    const members = enhancedStorage.family.getAllMembers();
    const recentEntries = entries.slice(0, 7); // 最近7天

    return {
      activeMembers: members.length,
      recentActivity: recentEntries.length,
      sharedEntries: recentEntries.filter(entry => entry.updatedAt).length,
      participationRate: members.length > 0 ? (recentEntries.length / (members.length * 7)) * 100 : 0,
    };
  };

  return {
    diaryInsights,
    calculateEnhancedRisk,
    generatePreventivePlan,
    getFamilyCollaborationData,
    hasDiaryData: entries.length > 0,
    diaryEntryCount: entries.length,
  };
}
