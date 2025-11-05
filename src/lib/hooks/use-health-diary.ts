// 健康日记数据管理Hook

import { useState, useEffect, useCallback } from 'react';
import { HealthDiaryEntry, MoodLevel } from '@/lib/types/enhanced';
import { enhancedStorage } from '@/lib/storage/enhanced-storage';

export interface UseHealthDiaryReturn {
  // 数据状态
  entries: HealthDiaryEntry[];
  currentEntry: HealthDiaryEntry | null;
  isLoading: boolean;

  // 操作方法
  createEntry: (entry: Omit<HealthDiaryEntry, 'id' | 'createdAt'>) => Promise<void>;
  updateEntry: (id: string, updates: Partial<HealthDiaryEntry>) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  getEntryByDate: (date: string) => HealthDiaryEntry | null;
  getRecentEntries: (days?: number) => HealthDiaryEntry[];

  // 统计方法
  getMoodTrend: (days?: number) => { date: string; mood: MoodLevel; moodScore: number }[];
  getSymptomFrequency: (days?: number) => Record<string, number>;
  getAverageSleepQuality: (days?: number) => number;

  // 工具方法
  formatDate: (date: string) => string;
  getMoodScore: (mood: MoodLevel) => number;
  getMoodColor: (mood: MoodLevel) => string;
}

export function useHealthDiary(): UseHealthDiaryReturn {
  const [entries, setEntries] = useState<HealthDiaryEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState<HealthDiaryEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 初始化加载数据
  useEffect(() => {
    const loadEntries = () => {
      try {
        const allEntries = enhancedStorage.healthDiary.getAllEntries();
        setEntries(allEntries);
      } catch (error) {
        console.error('加载健康日记失败:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadEntries();
  }, []);

  // 创建新日记条目
  const createEntry = useCallback(async (entryData: Omit<HealthDiaryEntry, 'id' | 'createdAt'>) => {
    try {
      const newEntry: HealthDiaryEntry = {
        ...entryData,
        id: `diary_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
      };

      enhancedStorage.healthDiary.saveEntry(newEntry);
      setEntries(prev => [newEntry, ...prev]);
      setCurrentEntry(newEntry);
    } catch (error) {
      console.error('创建日记条目失败:', error);
      throw new Error('创建日记失败，请稍后重试');
    }
  }, []);

  // 更新日记条目
  const updateEntry = useCallback(async (id: string, updates: Partial<HealthDiaryEntry>) => {
    try {
      const existingEntry = entries.find(entry => entry.id === id);
      if (!existingEntry) {
        throw new Error('日记条目不存在');
      }

      const updatedEntry: HealthDiaryEntry = {
        ...existingEntry,
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      enhancedStorage.healthDiary.saveEntry(updatedEntry);
      setEntries(prev => prev.map(entry => entry.id === id ? updatedEntry : entry));
      setCurrentEntry(updatedEntry);
    } catch (error) {
      console.error('更新日记条目失败:', error);
      throw new Error('更新日记失败，请稍后重试');
    }
  }, [entries]);

  // 删除日记条目
  const deleteEntry = useCallback(async (id: string) => {
    try {
      enhancedStorage.healthDiary.deleteEntry(id);
      setEntries(prev => prev.filter(entry => entry.id !== id));
      if (currentEntry?.id === id) {
        setCurrentEntry(null);
      }
    } catch (error) {
      console.error('删除日记条目失败:', error);
      throw new Error('删除日记失败，请稍后重试');
    }
  }, [currentEntry]);

  // 根据日期获取日记
  const getEntryByDate = useCallback((date: string): HealthDiaryEntry | null => {
    return entries.find(entry => entry.date === date) || null;
  }, [entries]);

  // 获取最近的日记条目
  const getRecentEntries = useCallback((days: number = 7): HealthDiaryEntry[] => {
    return enhancedStorage.healthDiary.getRecentEntries(days);
  }, []);

  // 获取情绪趋势数据
  const getMoodTrend = useCallback((days: number = 30) => {
    const recentEntries = getRecentEntries(days);
    return recentEntries.map(entry => ({
      date: entry.date,
      mood: entry.mood,
      moodScore: getMoodScore(entry.mood),
    }));
  }, [getRecentEntries]);

  // 获取症状频率统计
  const getSymptomFrequency = useCallback((days: number = 30) => {
    const recentEntries = getRecentEntries(days);
    const symptomCount: Record<string, number> = {};

    recentEntries.forEach(entry => {
      entry.symptoms.forEach(symptom => {
        symptomCount[symptom] = (symptomCount[symptom] || 0) + 1;
      });
    });

    return symptomCount;
  }, [getRecentEntries]);

  // 获取平均睡眠质量
  const getAverageSleepQuality = useCallback((days: number = 30) => {
    const recentEntries = getRecentEntries(days);
    if (recentEntries.length === 0) return 0;

    const total = recentEntries.reduce((sum, entry) => sum + entry.sleepQuality, 0);
    return Math.round((total / recentEntries.length) * 10) / 10; // 保留一位小数
  }, [getRecentEntries]);

  // 格式化日期显示
  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return '今天';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return '昨天';
    } else {
      return date.toLocaleDateString('zh-CN', {
        month: 'long',
        day: 'numeric',
      });
    }
  }, []);

  // 获取情绪评分
  const getMoodScore = useCallback((mood: MoodLevel): number => {
    const scores = {
      excellent: 5,
      good: 4,
      fair: 3,
      poor: 2,
    };
    return scores[mood];
  }, []);

  // 获取情绪颜色
  const getMoodColor = useCallback((mood: MoodLevel): string => {
    const colors = {
      excellent: 'text-green-600 bg-green-100',
      good: 'text-blue-600 bg-blue-100',
      fair: 'text-yellow-600 bg-yellow-100',
      poor: 'text-red-600 bg-red-100',
    };
    return colors[mood];
  }, []);

  return {
    // 数据状态
    entries,
    currentEntry,
    isLoading,

    // 操作方法
    createEntry,
    updateEntry,
    deleteEntry,
    getEntryByDate,
    getRecentEntries,

    // 统计方法
    getMoodTrend,
    getSymptomFrequency,
    getAverageSleepQuality,

    // 工具方法
    formatDate,
    getMoodScore,
    getMoodColor,
  };
}
