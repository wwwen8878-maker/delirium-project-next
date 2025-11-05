'use client';

import { MedicalTeamConnection } from '@/components/medical-team-connection';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Users, ArrowLeft, Shield, Activity, Bell, Zap, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Breadcrumb } from '@/components/breadcrumb';

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
      ease: [0.22, 1, 0.36, 1]
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
      ease: [0.22, 1, 0.36, 1]
    }
  },
  hover: {
    y: -8,
    scale: 1.02,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

export default function MedicalTeamPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-100/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl"></div>
          </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto py-12 sm:py-16 lg:py-20">
          {/* 面包屑导航 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="mb-8 sm:mb-12"
          >
            <Breadcrumb items={[{ label: '我的医护团队' }]} />
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
                <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 bg-gradient-to-br from-orange-500 via-red-500 to-rose-600 rounded-3xl sm:rounded-[2rem] flex items-center justify-center shadow-xl shadow-orange-500/20">
                  <Users className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 text-white" />
                </div>
                <motion.div
                  className="absolute -top-1 -right-1 w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
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
                  <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </motion.div>
              </motion.div>
            </motion.div>

            <motion.h1 
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 mb-6 sm:mb-8 tracking-tight"
            >
              <span className="block">我的医护团队</span>
            </motion.h1>

            <motion.p 
              variants={itemVariants}
              className="text-lg sm:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light"
            >
              您的<span className="font-semibold text-gray-900">专属医护团队</span>，
              <span className="font-semibold text-blue-600">实时监控</span>您的健康状态，
              <span className="font-semibold text-green-600">主动提供</span>关怀和指导
            </motion.p>
          </motion.div>

          {/* Feature Cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid md:grid-cols-3 gap-6 sm:gap-8 mb-16 sm:mb-20"
          >
            {[
              {
                icon: Activity,
                title: "实时监控",
                description: "医护团队可实时查看您的评估记录和健康数据",
                gradient: "from-blue-500 to-cyan-500",
                bgGradient: "from-blue-50 to-cyan-50",
                delay: 0.1
              },
              {
                icon: Bell,
                title: "主动预警",
                description: "AI检测到异常时自动提醒医护团队，确保及时干预",
                gradient: "from-green-500 to-emerald-500",
                bgGradient: "from-green-50 to-emerald-50",
                delay: 0.2
              },
              {
                icon: Shield,
                title: "双向沟通",
                description: "接收医护指导，一键求助反馈，建立有效沟通渠道",
                gradient: "from-purple-500 to-indigo-500",
                bgGradient: "from-purple-50 to-indigo-50",
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
                  <CardContent className="p-8 sm:p-10 relative z-10">
                    <motion.div
                      className={`w-14 h-14 sm:w-16 sm:h-16 mb-6 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg`}
                      whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <feature.icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                    </motion.div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                      {feature.description}
                </p>
              </CardContent>
            </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
          <MedicalTeamConnection />
          </motion.div>

          {/* Collaboration Workflow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mt-16 sm:mt-20 lg:mt-24"
          >
            <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50/80 via-purple-50/80 to-pink-50/80 backdrop-blur-sm">
              <CardContent className="p-8 sm:p-10">
                <h3 className="font-bold text-gray-900 mb-6 sm:mb-8 text-center text-2xl sm:text-3xl">
                  <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 inline-block mr-2 text-blue-600" />
                  医患协作闭环
            </h3>
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 sm:gap-6">
                  {[
                    { step: 1, text: '您记录症状', color: 'blue' },
                    { step: 2, text: 'AI自动分析', color: 'purple' },
                    { step: 3, text: '医护实时监控', color: 'orange' },
                    { step: 4, text: '主动关怀干预', color: 'green' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.2, duration: 0.5 }}
                        className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br ${
                          item.color === 'blue' ? 'from-blue-500 to-blue-600' :
                          item.color === 'purple' ? 'from-purple-500 to-purple-600' :
                          item.color === 'orange' ? 'from-orange-500 to-orange-600' :
                          'from-green-500 to-green-600'
                        } text-white rounded-full flex items-center justify-center text-lg sm:text-xl font-bold shadow-lg`}
                      >
                        {item.step}
                      </motion.div>
                      <span className="text-base sm:text-lg font-medium text-gray-700 whitespace-nowrap">
                        {item.text}
                      </span>
                      {index < 3 && (
                        <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 hidden md:block" />
                      )}
              </div>
                  ))}
              </div>
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8 }}
                  className="text-center text-sm sm:text-base text-gray-600 mt-8 pt-6 border-t border-gray-200/50"
                >
                  形成完整的<span className="font-semibold text-gray-900">医患协作闭环</span>，
                  确保您的健康状态得到<span className="font-semibold text-blue-600">及时监测</span>和
                  <span className="font-semibold text-green-600">专业干预</span>
                </motion.p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </main>
  );
}