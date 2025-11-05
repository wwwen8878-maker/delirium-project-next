// 增强功能类型定义

export interface HealthDiaryEntry {
  id: string;
  date: string;
  mood: 'excellent' | 'good' | 'fair' | 'poor';
  symptoms: string[];
  sleepQuality: number; // 1-5
  medication: string[];
  notes: string;
  createdAt: string;
  updatedAt?: string;
}

export interface RiskFactor {
  name: string;
  value: number;
  maxValue: number;
  category: 'age' | 'cognitive' | 'surgery' | 'comorbidity' | 'medication' | 'lifestyle';
  description: string;
  color: string;
}

export interface RiskVisualization {
  overallScore: number;
  riskFactors: RiskFactor[];
  trend: 'improving' | 'stable' | 'worsening';
  prediction: {
    nextWeek: number;
    nextMonth: number;
    confidence: number;
  };
  lastUpdated: string;
}

export interface PreventionPlan {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  frequency: 'daily' | 'weekly' | 'monthly' | 'once';
  completed: boolean;
  dueDate: string;
  category: 'lifestyle' | 'medication' | 'monitoring' | 'education' | 'exercise' | 'diet';
  progress: number; // 0-100
  createdAt: string;
  completedAt?: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  role: 'patient' | 'spouse' | 'child' | 'sibling' | 'caregiver' | 'parent';
  permissions: ('view' | 'edit' | 'manage')[];
  contactInfo: {
    email?: string;
    phone?: string;
  };
  avatar?: string;
  joinedAt: string;
  lastActive: string;
}

export interface AssessmentFormData {
  // 基本信息
  age?: string;
  gender?: string;
  education?: string;
  // 医疗信息
  surgeryType?: string;
  surgeryUrgency?: string;
  estimationDuration?: string;
  comorbidities?: string[];
  medications?: string[];
  alcoholUse?: string;
  smokingHistory?: string;
  // 评估数据
  mmseScore?: string;
  mocaScore?: string;
  adlScore?: string;
  frailtyScore?: string;
  // 风险因素
  visionImpairment?: boolean;
  hearingImpairment?: boolean;
  sleepDisorders?: boolean;
  depression?: boolean;
  anxiety?: boolean;
  // 其他动态字段
  [key: string]: unknown;
}

export interface AssessmentResult {
  totalScore: number;
  riskLevel: '低风险' | '中等风险' | '高风险';
  probability: string;
  recommendations: string[];
  diaryInsights?: {
    moodStability: number;
    symptomFrequency: number;
    sleepQuality: number;
    medicationAdherence: boolean;
    emotionalHealth: number;
  };
  personalizedFactors?: string[];
  trendAnalysis?: {
    trend: 'improving' | 'stable' | 'worsening';
    confidence: number;
  };
  preventivePlan?: {
    urgentActions: string[];
    dailyTasks: string[];
    monitoringFrequency: 'daily' | 'weekly' | 'hourly';
  };
}

export interface AssessmentSession {
  id: string;
  userId: string;
  startTime: string;
  endTime?: string;
  currentStep: number;
  totalSteps: number;
  formData: AssessmentFormData;
  isCompleted: boolean;
  result?: AssessmentResult;
}

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: 'patient' | 'family' | 'caregiver';
  preferences: {
    language: 'zh-CN' | 'zh-TW' | 'en';
    notifications: boolean;
    theme: 'light' | 'dark' | 'auto';
  };
  familyMembers: FamilyMember[];
  createdAt: string;
}

// 评估类型
export type RiskLevel = '低风险' | '中等风险' | '高风险';

// 工具类型
export type MoodLevel = 'excellent' | 'good' | 'fair' | 'poor';
export type RiskTrend = 'improving' | 'stable' | 'worsening';
export type PlanPriority = 'high' | 'medium' | 'low';
export type PlanFrequency = 'daily' | 'weekly' | 'monthly' | 'once';
export type PlanCategory = 'lifestyle' | 'medication' | 'monitoring' | 'education' | 'exercise' | 'diet';

// API响应类型
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// 图表数据类型
export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
  category?: string;
}

export interface RiskTrendData {
  period: string;
  overallRisk: number;
  factors: Record<string, number>;
}

// 通知类型
export interface NotificationItem {
  id: string;
  type: 'reminder' | 'alert' | 'info' | 'achievement';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  priority: 'low' | 'medium' | 'high';
}
