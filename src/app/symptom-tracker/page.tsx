'use client';

import { SmartSymptomTracker } from '@/components/smart-symptom-tracker';
import { Button } from '@/components/ui/button';
import { Breadcrumb } from '@/components/breadcrumb';
import { Card, CardContent } from '@/components/ui/card';
import { Activity, ArrowLeft, Calendar, TrendingUp, AlertCircle, Zap, Bot, Link2, Shield, CheckCircle2, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const
    }
  }
};

const featureCardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const
    }
  },
  hover: {
    y: -8,
    scale: 1.02,
    transition: {
      duration: 0.3,
      ease: "easeOut" as const
    }
  }
};

export default function SymptomTrackerPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('symptom_records');
    if (saved) {
      setRecords(JSON.parse(saved));
    }
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-blue-100/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 sm:w-96 sm:h-96 bg-green-100/30 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto py-6 sm:py-8 md:py-12 lg:py-16 xl:py-20">
          {/* 面包屑导航 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" as const }}
            className="mb-4 sm:mb-6 md:mb-8"
          >
            <Breadcrumb items={[{ label: '每日健康记录' }]} />
          </motion.div>

          {/* Hero Section */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center mb-16 sm:mb-20 lg:mb-24"
          >
            <motion.div variants={itemVariants} className="flex justify-center mb-6 sm:mb-8">
              <motion.div
                className="relative"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 rounded-3xl sm:rounded-[2rem] flex items-center justify-center shadow-xl shadow-emerald-500/20">
                  <Activity className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 text-white" />
              </div>
                <motion.div
                  className="absolute -top-1 -right-1 w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.8, 1]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </motion.div>
              </motion.div>
            </motion.div>

            <motion.h1 
              variants={itemVariants}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 md:mb-8 tracking-tight px-2"
            >
              <span className="block">每日健康记录</span>
            </motion.h1>

            <motion.p 
              variants={itemVariants}
              className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light px-4"
            >
              每天仅需<span className="font-semibold text-gray-900">1分钟</span>，
              <span className="font-semibold text-blue-600">科学监测</span>异常模式，
              数据<span className="font-semibold text-green-600">实时同步</span>医护团队
            </motion.p>
          </motion.div>

          {/* Feature Cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-12 md:mb-16 lg:mb-20 px-2"
          >
            {[
              {
                icon: Zap,
                title: "快速记录",
                description: "Emoji直观评分，1分钟完成日常监测",
                gradient: "from-orange-500 to-amber-500",
                bgGradient: "from-orange-50 to-amber-50",
                delay: 0.1
              },
              {
                icon: Bot,
                title: "AI智能分析",
                description: "基于循证医学，智能识别异常模式",
                gradient: "from-purple-500 to-indigo-500",
                bgGradient: "from-purple-50 to-indigo-50",
                delay: 0.2
              },
              {
                icon: Link2,
                title: "医护同步",
                description: "实时推送医护端，确保及时干预",
                gradient: "from-blue-500 to-cyan-500",
                bgGradient: "from-blue-50 to-cyan-50",
                delay: 0.3
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={featureCardVariants}
                whileHover="hover"
                className="relative group"
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white/80 backdrop-blur-sm overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                  <CardContent className="p-5 sm:p-6 md:p-8 lg:p-10 relative z-10">
                    <motion.div
                      className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mb-4 sm:mb-5 md:mb-6 rounded-xl sm:rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg`}
                      whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                    </motion.div>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
            </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Toggle Buttons */}
          {records.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" as const }}
              className="flex justify-center mb-6 sm:mb-8 md:mb-10 lg:mb-12 px-2"
            >
              <div className="inline-flex gap-1.5 sm:gap-2 p-1 sm:p-1.5 bg-gray-100/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-inner w-full max-w-md sm:max-w-none">
                <Button
                  variant={!showHistory ? 'default' : 'ghost'}
                  size="lg"
                  onClick={() => setShowHistory(false)}
                  className={`flex-1 sm:flex-none rounded-lg sm:rounded-xl transition-all duration-300 h-11 sm:h-12 text-sm sm:text-base ${
                    !showHistory 
                      ? 'shadow-md bg-white text-gray-900' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                  }`}
                >
                  <Activity className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">今日记录</span>
                  <span className="sm:hidden">今日</span>
                </Button>
                <Button
                  variant={showHistory ? 'default' : 'ghost'}
                  size="lg"
                  onClick={() => setShowHistory(true)}
                  className={`flex-1 sm:flex-none rounded-lg sm:rounded-xl transition-all duration-300 h-11 sm:h-12 text-sm sm:text-base ${
                    showHistory 
                      ? 'shadow-md bg-white text-gray-900' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                  }`}
                >
                  <Calendar className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">历史记录（{records.length}天）</span>
                  <span className="sm:hidden">历史（{records.length}）</span>
                </Button>
              </div>
            </motion.div>
          )}

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" as const }}
            className="px-2 sm:px-0"
          >
            {!showHistory ? (
              <SmartSymptomTracker />
            ) : (
              <div className="space-y-6">
              {records.length === 0 ? (
                  <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-12 sm:p-16 text-center">
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Calendar className="w-16 h-16 sm:w-20 sm:h-20 text-gray-300 mx-auto mb-6" />
                        <p className="text-lg sm:text-xl text-gray-600 mb-6">还没有历史记录</p>
                    <Button
                      onClick={() => setShowHistory(false)}
                      variant="outline"
                          size="lg"
                          className="rounded-xl hover:bg-gray-50 transition-all duration-300"
                    >
                      开始今日记录
                    </Button>
                      </motion.div>
                  </CardContent>
                </Card>
              ) : (
                records.slice().reverse().map((record, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                    >
                      <Card className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${
                        record.riskLevel === 'alert' ? 'bg-gradient-to-br from-red-50 to-red-100/50' :
                        record.riskLevel === 'warning' ? 'bg-gradient-to-br from-amber-50 to-yellow-100/50' :
                        'bg-gradient-to-br from-green-50 to-emerald-100/50'
                      }`}>
                        <CardContent className="p-4 sm:p-6 md:p-8">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
                            <div className="flex-1">
                              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
                                {record.date || new Date(record.timestamp).toLocaleDateString('zh-CN', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </h3>
                              <p className="text-xs sm:text-sm md:text-base text-gray-500">
                                {new Date(record.timestamp).toLocaleTimeString('zh-CN', { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </p>
                            </div>
                            <div className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold shadow-sm flex-shrink-0 ${
                              record.riskLevel === 'alert' ? 'bg-red-100 text-red-800 border border-red-200' :
                              record.riskLevel === 'warning' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                              'bg-green-100 text-green-800 border border-green-200'
                            }`}>
                              {record.riskLevel === 'alert' ? '⚠️ 需要关注' :
                               record.riskLevel === 'warning' ? '📋 轻度异常' :
                               '✅ 状态良好'}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6">
                            {[
                              { key: 'cognition', label: '认知', emojis: ['😊', '😐', '😕', '😵'] },
                              { key: 'sleep', label: '睡眠', emojis: ['😴', '😑', '😪', '😫'] },
                              { key: 'mood', label: '情绪', emojis: ['😄', '😌', '😰', '😤'] },
                              { key: 'appetite', label: '食欲', emojis: ['🍽️', '🍚', '🥄', '🚫'] }
                            ].map((item) => {
                              const value = record[item.key as keyof typeof record] as number;
                              const emoji = value >= 4 ? item.emojis[0] : 
                                           value >= 3 ? item.emojis[1] : 
                                           value >= 2 ? item.emojis[2] : item.emojis[3];
                              return (
                                <div key={item.key} className="text-center p-2 sm:p-3 bg-white/60 rounded-lg sm:rounded-xl">
                                  <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">{emoji}</div>
                                  <div className="text-xs font-medium text-gray-600">{item.label}</div>
                                </div>
                              );
                            })}
                          </div>

                          {record.aiAnalysis && (
                            <div className="bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl p-4 sm:p-5 border border-gray-200/50">
                              <p className="text-xs sm:text-sm md:text-base text-gray-700 leading-relaxed">
                                <strong className="text-gray-900">分析：</strong>
                                {record.aiAnalysis}
                              </p>
                            </div>
                          )}
                    </CardContent>
                  </Card>
                    </motion.div>
                ))
              )}
            </div>
          )}
          </motion.div>

          {/* Trust Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" as const }}
            className="mt-8 sm:mt-12 md:mt-16 lg:mt-20 px-2 sm:px-0"
          >
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50/80 to-indigo-50/80 backdrop-blur-sm">
              <CardContent className="p-5 sm:p-6 md:p-8 lg:p-10">
                <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 md:gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-blue-100 rounded-xl sm:rounded-2xl flex items-center justify-center">
                      <Shield className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex-1 space-y-3 sm:space-y-4">
                    <h4 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
                      记录建议
                    </h4>
                    <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm md:text-base text-gray-700 leading-relaxed">
                      <li className="flex items-start gap-2 sm:gap-3">
                        <span className="text-blue-600 font-semibold mt-1 flex-shrink-0">•</span>
                        <span>建议每天<strong className="text-gray-900">固定时间</strong>记录（如早晨9点），保持数据连续性</span>
                      </li>
                      <li className="flex items-start gap-2 sm:gap-3">
                        <span className="text-blue-600 font-semibold mt-1 flex-shrink-0">•</span>
                        <span>请<strong className="text-gray-900">如实反映</strong>当时状态，不要美化，确保分析准确性</span>
                      </li>
                      <li className="flex items-start gap-2 sm:gap-3">
                        <span className="text-blue-600 font-semibold mt-1 flex-shrink-0">•</span>
                        <span>连续记录<strong className="text-gray-900">3天以上</strong>，分析结果更加准确可靠</span>
                      </li>
                      <li className="flex items-start gap-2 sm:gap-3">
                        <span className="text-blue-600 font-semibold mt-1 flex-shrink-0">•</span>
                        <span>如发现异常，请<strong className="text-gray-900">及时联系</strong>医护人员，切勿延误</span>
                      </li>
                    </ul>
                    <div className="pt-3 sm:pt-4 border-t border-blue-200/50">
                      <p className="text-xs sm:text-sm text-gray-600 flex items-start sm:items-center gap-2">
                        <Shield className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 mt-0.5 sm:mt-0" />
                        <span>您的数据采用端到端加密技术，符合HIPAA医疗隐私保护标准，仅您和授权的医护团队可见</span>
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </main>
  );
}