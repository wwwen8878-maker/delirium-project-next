/**
 * 品牌视觉系统常量
 * 统一管理图标、配色和品牌风格
 */

import { 
  Brain, 
  Activity, 
  BookOpen, 
  MessageCircle, 
  Users, 
  Heart, 
  CheckCircle2, 
  Shield,
  Sparkles,
  ArrowRight,
  AlertCircle,
  Calendar,
  Clock,
  Zap,
  Link2,
  Bot,
  Moon,
  Utensils,
  Target,
  Lightbulb,
  Send,
  X,
  Loader2,
  User,
  Mic,
  Camera,
  FileText,
  TrendingUp
} from 'lucide-react';

// ==================== 图标映射 ====================
// 确保相同功能使用相同图标，保持一致性

export const BrandIcons = {
  // 核心功能图标
  home: null, // 首页不使用图标
  preoperativeEducation: BookOpen,
  assessment: Brain,
  symptomTracker: Activity,
  medicalTeam: Users,
  learningAssistant: MessageCircle,
  
  // 通用图标
  heart: Heart,
  check: CheckCircle2,
  shield: Shield,
  sparkles: Sparkles,
  arrowRight: ArrowRight,
  alert: AlertCircle,
  calendar: Calendar,
  clock: Clock,
  target: Target,
  lightbulb: Lightbulb,
  user: User,
  bot: Bot,
  
  // 功能图标
  zap: Zap,
  link: Link2,
  moon: Moon,
  utensils: Utensils,
  mic: Mic,
  camera: Camera,
  fileText: FileText,
  trendingUp: TrendingUp,
  send: Send,
  close: X,
  loader: Loader2,
} as const;

// ==================== 品牌配色系统 ====================
// 统一的渐变配色方案

export const BrandColors = {
  // 主品牌色（蓝色-紫色渐变）
  primary: {
    gradient: 'from-blue-500 to-purple-600',
    hover: 'hover:from-blue-600 hover:to-purple-700',
    light: 'from-blue-50 to-purple-50',
    bg: 'bg-blue-500',
    text: 'text-blue-600',
  },
  
  // 功能配色
  assessment: {
    gradient: 'from-blue-500 to-purple-600',
    hover: 'hover:from-blue-600 hover:to-purple-700',
    border: 'border-blue-200',
    bg: 'bg-blue-50',
  },
  
  preoperativeEducation: {
    gradient: 'from-indigo-500 to-blue-600',
    hover: 'hover:from-indigo-600 hover:to-blue-700',
    border: 'border-indigo-200',
    bg: 'bg-indigo-50',
  },
  
  symptomTracker: {
    gradient: 'from-green-500 to-emerald-600',
    hover: 'hover:from-green-600 hover:to-emerald-700',
    border: 'border-green-200',
    bg: 'bg-green-50',
  },
  
  learningAssistant: {
    gradient: 'from-purple-500 to-pink-600',
    hover: 'hover:from-purple-600 hover:to-pink-700',
    border: 'border-purple-200',
    bg: 'bg-purple-50',
  },
  
  medicalTeam: {
    gradient: 'from-orange-500 to-red-600',
    hover: 'hover:from-orange-600 hover:to-red-700',
    border: 'border-orange-200',
    bg: 'bg-orange-50',
  },
  
  // 状态配色
  success: {
    gradient: 'from-green-500 to-emerald-600',
    bg: 'bg-green-500',
    text: 'text-green-600',
    light: 'bg-green-50',
  },
  
  warning: {
    gradient: 'from-amber-500 to-yellow-600',
    bg: 'bg-amber-500',
    text: 'text-amber-600',
    light: 'bg-amber-50',
  },
  
  alert: {
    gradient: 'from-red-500 to-rose-600',
    bg: 'bg-red-500',
    text: 'text-red-600',
    light: 'bg-red-50',
  },
  
  // 中性色
  neutral: {
    gradient: 'from-gray-500 to-slate-600',
    bg: 'bg-gray-500',
    text: 'text-gray-600',
    light: 'bg-gray-50',
  },
} as const;

// ==================== 品牌样式常量 ====================

export const BrandStyles = {
  // 圆角
  borderRadius: {
    sm: 'rounded-lg',
    md: 'rounded-xl',
    lg: 'rounded-2xl',
    xl: 'rounded-3xl',
    full: 'rounded-full',
  },
  
  // 阴影
  shadow: {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    '2xl': 'shadow-2xl',
  },
  
  // 过渡效果
  transition: 'transition-all duration-300',
  transitionFast: 'transition-all duration-200',
  transitionSlow: 'transition-all duration-500',
  
  // 悬停效果
  hover: {
    scale: 'hover:scale-105',
    lift: 'hover:-translate-y-1',
    shadow: 'hover:shadow-xl',
  },
  
  // 渐变背景装饰
  backgroundDecorations: {
    topRight: 'bg-gradient-to-br from-blue-200/30 to-purple-200/30',
    bottomLeft: 'bg-gradient-to-br from-green-200/30 to-blue-200/30',
  },
} as const;

// ==================== 导航配置 ====================

export const NavigationItems = [
  { 
    href: '/', 
    label: '首页', 
    icon: null, 
    color: BrandColors.primary.gradient 
  },
  { 
    href: '/preoperative-education', 
    label: '术前科普', 
    icon: BrandIcons.preoperativeEducation, 
    color: BrandColors.preoperativeEducation.gradient 
  },
  { 
    href: '/ai-assessment', 
    label: '科学评估', 
    icon: BrandIcons.assessment, 
    color: BrandColors.assessment.gradient 
  },
  { 
    href: '/symptom-tracker', 
    label: '每日记录', 
    icon: BrandIcons.symptomTracker, 
    color: BrandColors.symptomTracker.gradient 
  },
  { 
    href: '/medical-team', 
    label: '我的医护', 
    icon: BrandIcons.medicalTeam, 
    color: BrandColors.medicalTeam.gradient 
  },
  { 
    href: '/privacy', 
    label: '隐私政策', 
    icon: null, 
    color: BrandColors.neutral.gradient 
  },
] as const;

