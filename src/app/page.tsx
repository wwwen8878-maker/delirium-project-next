'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Sparkles, Shield, Heart, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { BrandIcons, BrandColors, BrandStyles } from "@/lib/brand-constants";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* 英雄区域 */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-gradient-to-br from-green-200/30 to-blue-200/30 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-8">
              {/* 标签 */}
              <div className={`inline-flex items-center gap-3 px-6 py-3 ${BrandStyles.borderRadius.full} bg-white/80 backdrop-blur-sm border ${BrandColors.assessment.border} ${BrandStyles.shadow.sm}`}>
                <div className={`w-8 h-8 bg-gradient-to-r ${BrandColors.primary.gradient} ${BrandStyles.borderRadius.full} flex items-center justify-center`}>
                  <BrandIcons.heart className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-semibold text-gray-800">
                  为手术患者及家属提供专业支持
                </span>
              </div>

              {/* 主标题 */}
              <div className="space-y-6">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                  科学预防谵妄
                  <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mt-2">
                    守护术后健康
                  </span>
                </h1>

                <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
                  <strong className="text-gray-900">约5分钟科学评估</strong> · 
                  <strong className="text-gray-900">1分钟每日记录</strong> · 
                  <strong className="text-gray-900">24小时医护连接</strong>
                  <br />
                  <span className="text-gray-600">系统预防，及早发现，有效降低谵妄风险</span>
                </p>
              </div>

              {/* 快速入口 */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className={`h-14 px-8 text-lg bg-gradient-to-r ${BrandColors.primary.gradient} ${BrandColors.primary.hover} ${BrandStyles.shadow.lg} hover:${BrandStyles.shadow.xl} ${BrandStyles.transition} ${BrandStyles.hover.scale}`}>
                  <Link href="/ai-assessment">
                    <BrandIcons.assessment className="w-5 h-5 mr-2" />
                    开始风险评估 (约5分钟)
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className={`h-14 px-8 text-lg border-2 hover:${BrandColors.assessment.bg} ${BrandStyles.transition} ${BrandStyles.hover.scale}`}>
                  <Link href="/symptom-tracker">
                    <BrandIcons.symptomTracker className="w-5 h-5 mr-2" />
                    每日健康记录
                  </Link>
                </Button>
              </div>

              {/* 信任标识 */}
              <div className="flex flex-wrap justify-center gap-6 text-sm">
                <div className="flex items-center gap-2 text-gray-700">
                  <BrandIcons.check className={`w-4 h-4 ${BrandColors.success.text}`} />
                  <span>循证医学支持</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <BrandIcons.check className={`w-4 h-4 ${BrandColors.success.text}`} />
                  <span>医护实时监控</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <BrandIcons.check className={`w-4 h-4 ${BrandColors.success.text}`} />
                  <span>数据隐私保护</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 核心功能卡片 - 3+1模式 */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* 标题 */}
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent">
                五大核心功能
              </h2>
              <p className="text-xl text-gray-600">
                科学评估 · 医患协作 · 系统预防
              </p>
            </div>

            {/* 功能网格 */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* 功能1: 术前科普 */}
              <Link href="/preoperative-education">
                <Card className="h-full border-2 border-indigo-200 hover:border-indigo-400 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group">
                  <CardContent className="p-8">
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-16 h-16 bg-gradient-to-br ${BrandColors.preoperativeEducation.gradient} ${BrandStyles.borderRadius.lg} flex items-center justify-center ${BrandStyles.shadow.lg} group-hover:scale-110 ${BrandStyles.transition}`}>
                          <BrandIcons.preoperativeEducation className="w-8 h-8 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-gray-900 mb-1">
                            术前科普
                          </h3>
                          <p className="text-sm text-indigo-600 font-medium">
                            📅 系统化准备
                          </p>
                        </div>
                        <ArrowRight className="w-6 h-6 text-indigo-600 group-hover:translate-x-2 transition-transform" />
                      </div>

                      <p className="text-gray-700 leading-relaxed">
                        术前3天到手术当天的专业引导流程，系统化完成谵妄预防准备工作
                      </p>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                          <span>时间线引导（术前3/2/1天）</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                          <span>任务清单与贴心提示</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                          <span>集成科普助手随时学习</span>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">适用阶段</span>
                          <span className="font-medium text-gray-900">术前准备</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              {/* 功能2: AI智能评估 */}
              <Link href="/ai-assessment">
                <Card className="h-full border-2 border-blue-200 hover:border-blue-400 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group">
                  <CardContent className="p-8">
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-16 h-16 bg-gradient-to-br ${BrandColors.assessment.gradient} ${BrandStyles.borderRadius.lg} flex items-center justify-center ${BrandStyles.shadow.lg} group-hover:scale-110 ${BrandStyles.transition}`}>
                          <BrandIcons.assessment className="w-8 h-8 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-gray-900 mb-1">
                            科学风险评估
                          </h3>
                          <p className="text-sm text-blue-600 font-medium">
                            ⏱️ 约需5分钟
                          </p>
                        </div>
                        <ArrowRight className="w-6 h-6 text-blue-600 group-hover:translate-x-2 transition-transform" />
                      </div>

                      <p className="text-gray-700 leading-relaxed">
                        对话式科学评估，快速了解您的谵妄风险等级，获得个性化预防建议
                      </p>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                          <span>实时解读，通俗易懂</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                          <span>个性化风险报告</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                          <span>自动同步医护团队</span>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">适用人群</span>
                          <span className="font-medium text-gray-900">即将手术的患者</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              {/* 功能2: 智能症状追踪 */}
              <Link href="/symptom-tracker">
                <Card className="h-full border-2 border-green-200 hover:border-green-400 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group">
                  <CardContent className="p-8">
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-16 h-16 bg-gradient-to-br ${BrandColors.symptomTracker.gradient} ${BrandStyles.borderRadius.lg} flex items-center justify-center ${BrandStyles.shadow.lg} group-hover:scale-110 ${BrandStyles.transition}`}>
                          <BrandIcons.symptomTracker className="w-8 h-8 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-gray-900 mb-1">
                            每日症状追踪
                          </h3>
                          <p className="text-sm text-green-600 font-medium">
                            ⏱️ 每天1分钟
                          </p>
                        </div>
                        <ArrowRight className="w-6 h-6 text-green-600 group-hover:translate-x-2 transition-transform" />
                      </div>

                      <p className="text-gray-700 leading-relaxed">
                        简单易用的Emoji评分，科学分析异常模式，及时预警提醒医护
                      </p>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                          <span>认知、睡眠、情绪、食欲</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                          <span>科学识别异常模式</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                          <span>红黄绿预警机制</span>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">适用场景</span>
                          <span className="font-medium text-gray-900">术后每日监测</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              {/* 功能3: AI科普助手 */}
              <Card className="h-full border-2 border-purple-200 hover:border-purple-400 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group"
                onClick={() => {
                  const event = new CustomEvent('openAIAssistant');
                  window.dispatchEvent(event);
                }}>
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 bg-gradient-to-br ${BrandColors.learningAssistant.gradient} ${BrandStyles.borderRadius.lg} flex items-center justify-center ${BrandStyles.shadow.lg} group-hover:scale-110 ${BrandStyles.transition}`}>
                        <BrandIcons.learningAssistant className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">
                          科普学习助手
                        </h3>
                        <p className="text-sm text-purple-600 font-medium">
                          💬 24小时在线
                        </p>
                      </div>
                      <ArrowRight className="w-6 h-6 text-purple-600 group-hover:translate-x-2 transition-transform" />
                    </div>

                    <p className="text-gray-700 leading-relaxed">
                      双模式学习助手：随时问答 + 结构化学习，让您轻松掌握谵妄预防知识
                    </p>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle2 className="w-4 h-4 text-purple-600" />
                        <span>问答模式：即时解答疑问</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle2 className="w-4 h-4 text-purple-600" />
                        <span>学习模式：系统化课程</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle2 className="w-4 h-4 text-purple-600" />
                        <span>通俗易懂，专业可靠</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">访问方式</span>
                        <span className="font-medium text-gray-900">点击右下角按钮</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 功能4: 医护互联 */}
              <Link href="/medical-team">
                <Card className="h-full border-2 border-orange-200 hover:border-orange-400 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group">
                  <CardContent className="p-8">
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-16 h-16 bg-gradient-to-br ${BrandColors.medicalTeam.gradient} ${BrandStyles.borderRadius.lg} flex items-center justify-center ${BrandStyles.shadow.lg} group-hover:scale-110 ${BrandStyles.transition}`}>
                          <BrandIcons.medicalTeam className="w-8 h-8 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-gray-900 mb-1">
                            医护互联
                          </h3>
                          <p className="text-sm text-orange-600 font-medium">
                            🔗 实时连接
                          </p>
                        </div>
                        <ArrowRight className="w-6 h-6 text-orange-600 group-hover:translate-x-2 transition-transform" />
                      </div>

                      <p className="text-gray-700 leading-relaxed">
                        您的专属医护团队，实时查看您的状态，主动关怀和指导
                      </p>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle2 className="w-4 h-4 text-orange-600" />
                          <span>医护团队在线状态</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle2 className="w-4 h-4 text-orange-600" />
                          <span>实时消息通知</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle2 className="w-4 h-4 text-orange-600" />
                          <span>一键紧急求助</span>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">连接状态</span>
                          <span className="font-medium text-green-600 flex items-center gap-1">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            实时同步
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 工作流程 */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 text-gray-900">
                如何使用？
              </h2>
              <p className="text-xl text-gray-600">
                四步完成谵妄预防准备
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* 步骤1 */}
              <div className="text-center space-y-4">
                <div className="relative inline-block">
                  <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full flex items-center justify-center shadow-xl mx-auto">
                    <span className="text-3xl font-bold text-white">1</span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <BrandIcons.preoperativeEducation className="w-4 h-4 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  术前科普准备
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  按照术前3/2/1天时间线，系统化完成知识准备和预防措施
                </p>
              </div>

              {/* 步骤2 */}
              <div className="text-center space-y-4">
                <div className="relative inline-block">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-xl mx-auto">
                    <span className="text-3xl font-bold text-white">2</span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <BrandIcons.assessment className="w-4 h-4 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  科学风险评估
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  约5分钟对话式评估，了解您的风险等级和预防重点
                </p>
              </div>

              {/* 步骤3 */}
              <div className="text-center space-y-4">
                <div className="relative inline-block">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-xl mx-auto">
                    <span className="text-3xl font-bold text-white">3</span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <BrandIcons.learningAssistant className="w-4 h-4 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  科普学习陪伴
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  学习助手全程陪伴，通过对话和课程学习预防知识
                </p>
              </div>

              {/* 步骤4 */}
              <div className="text-center space-y-4">
                <div className="relative inline-block">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-xl mx-auto">
                    <span className="text-3xl font-bold text-white">4</span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <BrandIcons.symptomTracker className="w-4 h-4 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  每日健康记录
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  术后每天1分钟记录，科学监测异常，医护实时关注
                </p>
              </div>
            </div>

            {/* 连接线 */}
            <div className="hidden md:block relative mt-12">
              <div className="flex justify-center">
                <div className="w-full max-w-4xl relative">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 rounded-full"></div>
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white border-2 border-purple-500 rounded-full"></div>
                </div>
              </div>
              <div className="text-center mt-8">
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-100 to-red-100 rounded-full border-2 border-orange-300">
                  <BrandIcons.medicalTeam className="w-5 h-5 text-orange-600" />
                  <span className="font-bold text-orange-900">全程医护监控</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 为什么选择我们 */}
      <section className="py-20 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 text-gray-900">
                为什么选择我们？
              </h2>
              <p className="text-xl text-gray-600">
                科学评估 + 医患协作 + 循证医学
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-2 border-blue-100 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">科学评估体系</h3>
                  <p className="text-gray-600 leading-relaxed">
                    不是简单的问卷调查，而是对话式评估、科学分析、个性化建议的完整体系
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-green-100 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                    <BrandIcons.medicalTeam className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">医患协作闭环</h3>
                  <p className="text-gray-600 leading-relaxed">
                    患者记录自动同步医护端，医护主动干预，形成完整的预防-监测-干预闭环
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-purple-100 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">循证医学支持</h3>
                  <p className="text-gray-600 leading-relaxed">
                    基于最新临床指南和研究证据，所有建议均有科学依据，真实有效
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* 效果数据 */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-12 md:p-16 text-white text-center shadow-2xl relative overflow-hidden">
              {/* 背景装饰 */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
              </div>
              
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 md:mb-12">
                  平台效果数据
                </h2>
                <div className="grid md:grid-cols-4 gap-6 md:gap-8">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                    <div className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2">30-40%</div>
                    <div className="text-white/95 font-medium mb-1">谵妄率降低</div>
                    <div className="text-xs text-white/70">基于39项RCT研究</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                    <div className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2">约5分钟</div>
                    <div className="text-white/95 font-medium">完成评估</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                    <div className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2">1分钟</div>
                    <div className="text-white/95 font-medium">每日记录</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                    <div className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2">24h</div>
                    <div className="text-white/95 font-medium">医护监控</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-4xl font-bold text-gray-900">
              准备好开始了吗？
            </h2>
            <p className="text-xl text-gray-600">
              现在就开始您的谵妄预防之旅
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="h-16 px-10 text-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-xl transition-all duration-300 transform hover:scale-105">
                <Link href="/ai-assessment">
                  <BrandIcons.assessment className="w-6 h-6 mr-3" />
                  开始风险评估 (约5分钟)
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-16 px-10 text-xl border-2 hover:bg-blue-50 transition-all duration-300 transform hover:scale-105">
                <Link href="/medical-team">
                  <BrandIcons.medicalTeam className="w-6 h-6 mr-3" />
                  查看我的医护
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
