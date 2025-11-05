"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Brain, Moon, Heart, Utensils, AlertTriangle, 
  Camera, Mic, CheckCircle2, Sparkles, TrendingUp, Clock, Shield
} from 'lucide-react';
import { syncSymptomToMedical, SymptomRecord } from '@/lib/patient-data-sync';
import { motion, AnimatePresence } from 'framer-motion';

interface DailyRecord {
  date: string;
  cognition: number; // 1-5
  sleep: number;
  mood: number;
  appetite: number;
  notes: string;
  aiAnalysis?: string;
  riskLevel?: 'normal' | 'warning' | 'alert';
}

const emojiButtonVariants = {
  rest: { scale: 1, y: 0 },
  hover: { 
    scale: 1.05, 
    y: -4,
    transition: {
      duration: 0.2,
      ease: [0.22, 1, 0.36, 1]
    }
  },
  tap: { scale: 0.95 },
  selected: {
    scale: 1.1,
    y: -6,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

export function SmartSymptomTracker() {
  const [currentRecord, setCurrentRecord] = useState<Partial<DailyRecord>>({
    date: new Date().toLocaleDateString('zh-CN'),
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const updateField = (field: keyof DailyRecord, value: any) => {
    setCurrentRecord({ ...currentRecord, [field]: value });
  };

  const analyzeRecord = async () => {
    setIsAnalyzing(true);

    // 模拟AI分析
    await new Promise(resolve => setTimeout(resolve, 2500));

    const { cognition = 5, sleep = 5, mood = 5, appetite = 5 } = currentRecord;
    const avgScore = (cognition + sleep + mood + appetite) / 4;

    let aiAnalysis = '';
    let riskLevel: 'normal' | 'warning' | 'alert' = 'normal';

    // 基于循证医学的评估标准
    if (avgScore >= 4) {
      riskLevel = 'normal';
      aiAnalysis = '✅ 今日认知功能、睡眠质量、情绪状态及食欲情况均处于良好水平。建议继续维持当前生活习惯，规律作息，保持社交活动，定期进行认知训练。';
    } else if (avgScore >= 3) {
      riskLevel = 'warning';
      aiAnalysis = '⚠️ 检测到轻度异常模式。';
      
      const issues = [];
      if (cognition < 3) issues.push('认知功能轻度下降，可能存在注意力不集中或记忆力减退');
      if (sleep < 3) issues.push('睡眠质量欠佳，可能存在入睡困难或睡眠中断');
      if (mood < 3) issues.push('情绪状态波动，可能存在焦虑或情绪低落');
      if (appetite < 3) issues.push('食欲减退，可能存在消化功能异常');
      
      aiAnalysis += ` 主要观察：${issues.join('；')}。`;
      aiAnalysis += ' 建议：加强日常监测，增加非药物干预措施，如认知训练、放松技巧、营养支持等。已通知您的医护团队关注。';
    } else {
      riskLevel = 'alert';
      aiAnalysis = '🚨 检测到明显异常！';
      
      const issues = [];
      if (cognition < 2) issues.push('认知功能明显下降，可能存在谵妄风险或认知障碍');
      if (sleep < 2) issues.push('严重睡眠障碍，可能影响日间功能');
      if (mood < 2) issues.push('情绪极度低落，可能存在抑郁或焦虑障碍');
      if (appetite < 2) issues.push('严重食欲不振，可能影响营养状态');
      
      aiAnalysis += ` 主要问题：${issues.join('；')}。`;
      aiAnalysis += ' 建议：立即联系医护人员进行专业评估，必要时采取医疗干预措施。医护团队已收到紧急提醒。';
    }

    setCurrentRecord({
      ...currentRecord,
      aiAnalysis,
      riskLevel
    });

    setIsAnalyzing(false);
    setShowResult(true);

    // 模拟保存到本地
    const fullRecord = {
      ...currentRecord,
      aiAnalysis,
      riskLevel,
      timestamp: new Date().toISOString()
    };
    
    const existingRecords = JSON.parse(localStorage.getItem('symptom_records') || '[]');
    existingRecords.push(fullRecord);
    localStorage.setItem('symptom_records', JSON.stringify(existingRecords));
    
    // 同步到医护端
    const syncData: SymptomRecord = {
      patientId: 'P001',
      patientName: '患者',
      date: currentRecord.date || new Date().toLocaleDateString('zh-CN'),
      timestamp: fullRecord.timestamp,
      cognition: cognition || 3,
      sleep: sleep || 3,
      mood: mood || 3,
      appetite: appetite || 3,
      notes: currentRecord.notes || '',
      aiAnalysis: aiAnalysis || '',
      riskLevel: riskLevel || 'normal'
    };
    
    syncSymptomToMedical(syncData);
  };

  const resetForm = () => {
    setCurrentRecord({ date: new Date().toLocaleDateString('zh-CN') });
    setShowResult(false);
  };

  if (showResult) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <Card className={`border-0 shadow-2xl overflow-hidden ${
            currentRecord.riskLevel === 'alert' ? 'bg-gradient-to-br from-red-50 to-red-100/50' :
            currentRecord.riskLevel === 'warning' ? 'bg-gradient-to-br from-amber-50 to-yellow-100/50' :
            'bg-gradient-to-br from-green-50 to-emerald-100/50'
          }`}>
            <CardContent className="p-4 sm:p-6 md:p-8 lg:p-12">
              <div className="space-y-4 sm:space-y-6 md:space-y-8">
                <motion.div 
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <motion.div 
                    className="flex justify-center mb-6"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 200, 
                      damping: 15,
                      delay: 0.3
                    }}
                  >
                {currentRecord.riskLevel === 'normal' && (
                      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center shadow-xl shadow-green-500/30">
                        <CheckCircle2 className="w-12 h-12 sm:w-14 sm:h-14 text-white" />
                  </div>
                )}
                {currentRecord.riskLevel === 'warning' && (
                      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-3xl flex items-center justify-center shadow-xl shadow-amber-500/30">
                        <AlertTriangle className="w-12 h-12 sm:w-14 sm:h-14 text-white" />
                  </div>
                )}
                {currentRecord.riskLevel === 'alert' && (
                      <motion.div 
                        className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-red-500 to-rose-600 rounded-3xl flex items-center justify-center shadow-xl shadow-red-500/30"
                        animate={{ 
                          scale: [1, 1.05, 1],
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <AlertTriangle className="w-12 h-12 sm:w-14 sm:h-14 text-white" />
                      </motion.div>
                    )}
                  </motion.div>

                  <motion.h3 
                    className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    {currentRecord.riskLevel === 'alert' ? '需要医疗关注' :
                     currentRecord.riskLevel === 'warning' ? '轻度异常提示' :
                     '状态良好'}
                  </motion.h3>

                  <motion.div 
                    className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 text-left shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <p className="text-sm sm:text-base md:text-lg text-gray-800 leading-relaxed">
                  {currentRecord.aiAnalysis}
                </p>
                  </motion.div>
                </motion.div>

            {currentRecord.riskLevel === 'alert' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-red-100/80 backdrop-blur-sm border-2 border-red-300 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg"
                  >
                    <h4 className="font-bold text-red-900 mb-3 sm:mb-4 flex items-center gap-2 text-base sm:text-lg">
                      <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
                  紧急建议
                </h4>
                    <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm md:text-base text-red-800">
                      <p className="flex items-start gap-2">
                        <span className="font-semibold flex-shrink-0">•</span>
                        <span>立即联系您的医护团队进行专业评估</span>
                      </p>
                      <p className="flex items-start gap-2">
                        <span className="font-semibold flex-shrink-0">•</span>
                        <span>确保有家人或护理人员陪伴</span>
                      </p>
                      <p className="flex items-start gap-2">
                        <span className="font-semibold flex-shrink-0">•</span>
                        <span>如有严重不适或紧急情况，请立即拨打急救电话（120）</span>
                      </p>
                </div>
                    <Button 
                      className="w-full mt-4 sm:mt-6 bg-red-600 hover:bg-red-700 text-white h-11 sm:h-12 rounded-lg sm:rounded-xl shadow-lg transition-all duration-300 text-sm sm:text-base touch-manipulation"
                      size="lg"
                    >
                  一键联系医护人员
                </Button>
                  </motion.div>
                )}

                <motion.div 
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <Button 
                    onClick={resetForm} 
                    variant="outline"
                    size="lg"
                    className="rounded-lg sm:rounded-xl hover:bg-gray-50 transition-all duration-300 h-11 sm:h-12 text-sm sm:text-base touch-manipulation"
                  >
                继续记录明天
              </Button>
                  <Button 
                    onClick={() => window.location.href = '/symptom-tracker?history=true'}
                    size="lg"
                    className="rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg transition-all duration-300 h-11 sm:h-12 text-sm sm:text-base touch-manipulation"
                  >
                查看历史记录
              </Button>
                </motion.div>

                <motion.div 
                  className="text-center text-xs sm:text-sm text-gray-600 flex items-center justify-center gap-2 flex-wrap px-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <Shield className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span>数据已加密保存并同步至医护端</span>
                </motion.div>
          </div>
        </CardContent>
      </Card>
        </motion.div>
      </AnimatePresence>
    );
  }

  if (isAnalyzing) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
          <CardContent className="p-8 sm:p-12 md:p-16">
            <div className="text-center space-y-8">
              {/* 加载动画 - 更优雅的设计 */}
              <motion.div 
                className="flex justify-center relative"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, type: "spring" }}
              >
                <div className="relative">
                  <motion.div
                    className="w-20 h-20 sm:w-24 sm:h-24 border-4 border-blue-100 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  />
                  <motion.div
                    className="absolute inset-0 w-20 h-20 sm:w-24 sm:h-24 border-4 border-transparent border-t-blue-600 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Brain className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
                  </motion.div>
                </div>
              </motion.div>

              {/* 加载步骤提示 */}
              <div className="space-y-4 max-w-md mx-auto">
                <motion.h3 
                  className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  正在科学分析您的记录
                </motion.h3>
                <motion.p 
                  className="text-sm sm:text-base md:text-lg text-gray-600 mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  基于循证医学标准，对比历史数据，识别异常模式
                </motion.p>

                {/* 分析步骤指示 */}
                <div className="space-y-3 text-left">
                  <motion.div 
                    className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-sm text-gray-700">已收集您的症状数据</span>
                  </motion.div>
                  <motion.div 
                    className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-sm text-gray-700">正在对比历史记录</span>
                  </motion.div>
                  <motion.div 
                    className="flex items-center gap-3 p-3 bg-purple-100 rounded-lg"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <motion.div 
                      className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin flex-shrink-0"
                    />
                    <span className="text-sm text-gray-700 font-medium">生成个性化分析报告...</span>
                  </motion.div>
                </div>
            </div>
          </div>
        </CardContent>
      </Card>
      </motion.div>
    );
  }

  const assessmentSections = [
    {
      key: 'cognition' as const,
      icon: Brain,
      title: '认知功能状态',
      question: '今天认人和记事情清楚吗？',
      description: '评估认人、记事的清晰程度，以及注意力、记忆力等情况',
      color: 'purple',
      options: [
        { value: 5, label: '很清楚', emoji: '😊', desc: '认人清楚，记忆清晰' },
        { value: 4, label: '较清楚', emoji: '🙂', desc: '大部分时间清晰' },
        { value: 3, label: '一般', emoji: '😐', desc: '偶有混淆' },
        { value: 2, label: '有点糊涂', emoji: '😕', desc: '经常混淆' },
        { value: 1, label: '很糊涂', emoji: '😵', desc: '严重认知障碍' }
      ]
    },
    {
      key: 'sleep' as const,
      icon: Moon,
      title: '睡眠质量',
      question: '昨晚睡得怎么样？',
      description: '评估睡眠时长、连续性、深度及日间功能影响',
      color: 'blue',
      options: [
        { value: 5, label: '很好', emoji: '😴', desc: '睡眠充足，质量好' },
        { value: 4, label: '较好', emoji: '😌', desc: '睡眠基本正常' },
        { value: 3, label: '一般', emoji: '😑', desc: '睡眠质量一般' },
        { value: 2, label: '不好', emoji: '😪', desc: '睡眠不足或中断' },
        { value: 1, label: '很差', emoji: '😫', desc: '严重睡眠障碍' }
      ]
    },
    {
      key: 'mood' as const,
      icon: Heart,
      title: '情绪心理状态',
      question: '今天心情如何？',
      description: '评估情绪稳定性、焦虑、抑郁等心理状态',
      color: 'red',
      options: [
        { value: 5, label: '很开心', emoji: '😄', desc: '情绪积极稳定' },
        { value: 4, label: '较好', emoji: '🙂', desc: '情绪较稳定' },
        { value: 3, label: '平静', emoji: '😌', desc: '情绪平稳' },
        { value: 2, label: '焦虑', emoji: '😰', desc: '存在焦虑情绪' },
        { value: 1, label: '烦躁', emoji: '😤', desc: '情绪极度不稳定' }
      ]
    },
    {
      key: 'appetite' as const,
      icon: Utensils,
      title: '食欲营养状态',
      question: '今天吃饭正常吗？',
      description: '评估食欲、进食量及营养摄入情况',
      color: 'green',
      options: [
        { value: 5, label: '很好', emoji: '🍽️', desc: '食欲正常' },
        { value: 4, label: '较好', emoji: '🥘', desc: '食欲尚可' },
        { value: 3, label: '一般', emoji: '🍚', desc: '食欲一般' },
        { value: 2, label: '不好', emoji: '🥄', desc: '食欲减退' },
        { value: 1, label: '很差', emoji: '🚫', desc: '严重食欲不振' }
      ]
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 p-4 sm:p-6 md:p-8 border-b border-gray-100">
          <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
              <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
              今日症状快速记录
            </CardTitle>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-sm md:text-base text-gray-600">
            <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span>每天仅需<strong className="text-gray-900">1分钟</strong>，</span>
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span><strong className="text-blue-600">科学识别</strong>异常模式，</span>
            <Shield className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span>数据<strong className="text-green-600">自动同步</strong>医护端</span>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8 md:space-y-10 lg:space-y-12">
          {assessmentSections.map((section, sectionIndex) => (
            <motion.div
              key={section.key}
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label className="text-base sm:text-lg md:text-xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3 flex-wrap">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br ${
                    section.color === 'purple' ? 'from-purple-500 to-purple-600' :
                    section.color === 'blue' ? 'from-blue-500 to-blue-600' :
                    section.color === 'red' ? 'from-red-500 to-red-600' :
                    'from-green-500 to-green-600'
                  } rounded-lg sm:rounded-xl flex items-center justify-center shadow-md flex-shrink-0`}>
                    <section.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <span>{section.title}</span>
            </Label>
                <p className="text-sm sm:text-base md:text-lg text-gray-700 ml-0 sm:ml-10 md:ml-14">{section.question}</p>
                <p className="text-xs sm:text-sm text-gray-500 ml-0 sm:ml-10 md:ml-14">{section.description}</p>
              </div>
              <div className="grid grid-cols-5 gap-2 sm:gap-3 md:gap-4">
                {section.options.map((option, optionIndex) => {
                  const isSelected = currentRecord[section.key] === option.value;
                  return (
                    <motion.button
                      key={option.value}
                      onClick={() => {
                        updateField(section.key, option.value);
                        // 添加触觉反馈（如果设备支持）
                        if ('vibrate' in navigator) {
                          navigator.vibrate(10);
                        }
                      }}
                      variants={emojiButtonVariants}
                      initial="rest"
                      whileHover="hover"
                      whileTap="tap"
                      animate={isSelected ? "selected" : "rest"}
                      className={`relative group h-20 sm:h-24 md:h-28 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 overflow-hidden touch-manipulation ${
                        isSelected
                          ? section.color === 'purple' ? 'bg-gradient-to-br from-purple-500 to-purple-600 border-purple-600 shadow-xl shadow-purple-500/30 ring-2 ring-purple-300 ring-offset-2' :
                            section.color === 'blue' ? 'bg-gradient-to-br from-blue-500 to-blue-600 border-blue-600 shadow-xl shadow-blue-500/30 ring-2 ring-blue-300 ring-offset-2' :
                            section.color === 'red' ? 'bg-gradient-to-br from-red-500 to-red-600 border-red-600 shadow-xl shadow-red-500/30 ring-2 ring-red-300 ring-offset-2' :
                            'bg-gradient-to-br from-green-500 to-green-600 border-green-600 shadow-xl shadow-green-500/30 ring-2 ring-green-300 ring-offset-2'
                          : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md active:scale-95'
                      }`}
                    >
                      {/* 选中时的背景光晕效果 */}
                      {isSelected && (
                        <motion.div
                          className={`absolute inset-0 opacity-0 ${
                            section.color === 'purple' ? 'bg-purple-400' :
                            section.color === 'blue' ? 'bg-blue-400' :
                            section.color === 'red' ? 'bg-red-400' :
                            'bg-green-400'
                          }`}
                          animate={{ opacity: [0, 0.3, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 2 }}
                        />
                      )}
                      <div className="flex flex-col items-center justify-center h-full p-1.5 sm:p-2 relative z-10">
                        <motion.span 
                          className="text-2xl sm:text-3xl md:text-4xl mb-0.5 sm:mb-1 transition-transform duration-300"
                          animate={isSelected ? { scale: [1, 1.15, 1] } : {}}
                          transition={{ duration: 0.3 }}
                        >
                          {option.emoji}
                        </motion.span>
                        <span className={`text-[10px] sm:text-xs font-semibold text-center leading-tight transition-colors ${
                          isSelected ? 'text-white' : 'text-gray-700'
                        }`}>
                          {option.label}
                        </span>
                      </div>
                      {isSelected && (
                        <motion.div
                          className="absolute top-2 right-2 z-20"
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: "spring", stiffness: 500, damping: 25 }}
                        >
                          <div className="w-6 h-6 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          </div>
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          ))}

          {/* 其他备注 */}
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-4"
          >
            <Label className="text-base sm:text-lg md:text-xl font-bold text-gray-900 flex items-center gap-2 flex-wrap">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <span>其他情况记录（可选）</span>
            </Label>
            <div className="relative">
              <Textarea
                placeholder="可记录其他症状或异常情况，如：头晕、疼痛、幻觉、行为异常等..."
                value={currentRecord.notes || ''}
                onChange={(e) => updateField('notes', e.target.value)}
                className="min-h-24 sm:min-h-32 rounded-lg sm:rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 text-sm sm:text-base resize-none"
                maxLength={500}
              />
              <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                {(currentRecord.notes || '').length}/500
              </div>
            </div>
            <div className="flex gap-2 sm:gap-3">
              <Button 
                variant="outline" 
                size="lg"
                className="flex-1 rounded-lg sm:rounded-xl hover:bg-gray-50 transition-all duration-300 h-11 sm:h-12 text-sm sm:text-base"
              >
                <Camera className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">添加照片</span>
                <span className="sm:hidden">照片</span>
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="flex-1 rounded-lg sm:rounded-xl hover:bg-gray-50 transition-all duration-300 h-11 sm:h-12 text-sm sm:text-base"
              >
                <Mic className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">语音记录</span>
                <span className="sm:hidden">语音</span>
              </Button>
            </div>
          </motion.div>

          {/* 提交按钮 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
          <Button
            onClick={analyzeRecord}
            disabled={!currentRecord.cognition || !currentRecord.sleep || !currentRecord.mood || !currentRecord.appetite}
                className="w-full h-12 sm:h-14 md:h-16 text-base sm:text-lg md:text-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white rounded-lg sm:rounded-xl md:rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 font-semibold touch-manipulation relative overflow-hidden group"
                size="lg"
              >
                {/* 按钮点击波纹效果 */}
                <motion.div
                  className="absolute inset-0 bg-white/20"
                  initial={{ scale: 0, opacity: 0 }}
                  whileTap={{ scale: 2, opacity: [0, 0.3, 0] }}
                  transition={{ duration: 0.6 }}
                />
                <div className="relative flex items-center justify-center">
                  <Brain className="w-5 h-5 sm:w-6 sm:h-6 mr-2 flex-shrink-0" />
                  <span className="hidden sm:inline">科学分析并提交记录</span>
                  <span className="sm:hidden">分析并提交</span>
                </div>
              </Button>
            </motion.div>

            {/* 完成度提示 */}
            {(!currentRecord.cognition || !currentRecord.sleep || !currentRecord.mood || !currentRecord.appetite) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 text-center"
              >
                <p className="text-xs sm:text-sm text-amber-600 flex items-center justify-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>请完成所有四项评估后再提交</span>
                </p>
                <div className="flex justify-center gap-1 mt-2">
                  {['cognition', 'sleep', 'mood', 'appetite'].map((key) => (
                    <div
                      key={key}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        currentRecord[key as keyof DailyRecord]
                          ? 'bg-green-500 scale-125'
                          : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>

          <motion.div 
            className="text-center text-xs sm:text-sm text-gray-500 flex items-center justify-center gap-2 flex-wrap px-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <Shield className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="text-center">数据采用端到端加密技术，符合HIPAA医疗隐私保护标准，仅您和授权的医护团队可见</span>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}