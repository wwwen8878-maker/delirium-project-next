import { z } from 'zod'

// Assessment Form Schema
export const AssessmentFormSchema = z.object({
  // 基本信息
  age: z.string().min(1, '年龄不能为空').regex(/^\d+$/, '年龄必须是数字').transform(val => parseInt(val)).refine(val => val >= 18 && val <= 120, '年龄必须在18-120岁之间'),
  gender: z.enum(['male', 'female']),
  education: z.enum([
    '研究生及以上', '本科', '大专', '高中', '初中', '小学及以下'
  ]),

  // 认知评估
  mmseScore: z.string().optional().refine(val => !val || (/^\d+$/.test(val) && parseInt(val) >= 0 && parseInt(val) <= 30), 'MMSE评分必须是0-30之间的整数'),
  mocaScore: z.string().optional().refine(val => !val || (/^\d+$/.test(val) && parseInt(val) >= 0 && parseInt(val) <= 30), 'MoCA评分必须是0-30之间的整数'),

  // 手术信息
  surgeryType: z.enum([
    '心脏手术', '神经外科', '骨科大手术', '腹部大手术', '胸外科', '泌尿外科', '妇科手术', '小手术'
  ]),
  surgeryUrgency: z.enum(['急诊手术', '限期手术', '择期手术']),
  estimatedDuration: z.enum(['小于2小时', '2-4小时', '超过4小时']),

  // 既往史 - 数组会单独处理
  comorbidities: z.array(z.string()).default([]),
  medications: z.array(z.string()).default([]),
  alcoholUse: z.enum(['从不饮酒', '偶尔饮酒', '经常饮酒']),
  smokingHistory: z.enum(['从不吸烟', '已戒烟', '正在吸烟']),

  // 功能状态
  adlScore: z.string().regex(/^\d+$/, 'ADL评分必须是数字').transform(val => parseInt(val)).refine(val => val >= 0 && val <= 6, 'ADL评分必须是0-6之间的整数'),
  frailtyScore: z.string().regex(/^\d+$/, '衰弱评分必须是数字').transform(val => parseInt(val)).refine(val => val >= 0 && val <= 5, '衰弱评分必须是0-5之间的整数'),

  // 其他风险因素
  visionImpairment: z.boolean().default(false),
  hearingImpairment: z.boolean().default(false),
  sleepDisorders: z.boolean().default(false),
  depression: z.boolean().default(false),
  anxiety: z.boolean().default(false),
})

export type AssessmentFormData = z.infer<typeof AssessmentFormSchema>

// Assessment Result Types
export interface AssessmentResult {
  totalScore: number;
  riskLevel: '低风险' | '中等风险' | '高风险';
  probability: string;
  recommendations: string[];
}

// Local Storage Types
export interface SavedAssessment {
  id: string;
  timestamp: string;
  formData: AssessmentFormData;
  result: AssessmentResult;
}

export interface AssessmentState {
  currentForm: Partial<AssessmentFormData>;
  currentResult: AssessmentResult | null;
  isCalculating: boolean;
  history: SavedAssessment[];
}

// API Response Types
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
