'use client';

import { useState } from 'react';
import { AIConversationalAssessment } from '@/components/ai-conversational-assessment';
import { MultimodalAssessmentSteps } from '@/components/multimodal-assessment-steps';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, ArrowLeft, AlertCircle, CheckCircle2, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Breadcrumb } from '@/components/breadcrumb';

export default function AIAssessmentPage() {
  const [started, setStarted] = useState(false);
  const [showMultimodal, setShowMultimodal] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [allCompleted, setAllCompleted] = useState(false);

  if (!started) {
    return (
      <main className={`min-h-screen py-12 transition-opacity duration-500 ease-in-out ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* 面包屑导航 */}
            <Breadcrumb items={[{ label: '科学风险评估' }]} />

            {/* 介绍卡片 */}
            <Card className="border-2 border-blue-200 mb-8">
              <CardContent className="p-8 md:p-12">
                <div className="text-center space-y-6">
                  <div className="flex justify-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-xl">
                      <Brain className="w-10 h-10 text-white" />
                    </div>
                  </div>

                  <div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                      科学风险评估
                    </h1>
                    <p className="text-xl text-gray-600 leading-relaxed">
                      通过对话式科学评估，约5分钟快速了解您的谵妄风险
                    </p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6 text-left">
                    <div className="bg-blue-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                          <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="font-bold text-gray-900">对话式评估</h3>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        不是传统问卷，而是像聊天一样自然轻松的对话
                      </p>
                    </div>

                    <div className="bg-green-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                          <CheckCircle2 className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="font-bold text-gray-900">个性化建议</h3>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        根据您的具体情况，为您量身定制预防建议
                      </p>
                    </div>

                    <div className="bg-purple-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                          <Brain className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="font-bold text-gray-900">医护同步</h3>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        评估结果会同步给您的医护团队，便于他们了解您的情况
                      </p>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-6">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div className="text-left">
                        <h4 className="font-bold text-yellow-900 mb-2">重要提示</h4>
                        <p className="text-sm text-yellow-800">
                          本评估仅供健康教育参考，不能替代医生诊断。请将结果与您的主治医生讨论，制定个性化预防方案。
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => {
                      setIsTransitioning(true);
                      // 等待淡出动画完成后切换到评估页面
                      setTimeout(() => {
                        setStarted(true);
                        // 再等待一小段时间让新页面淡入
                        setTimeout(() => {
                          setIsTransitioning(false);
                        }, 50);
                      }, 500); // 500ms 淡出动画时间
                    }}
                    size="lg"
                    className="h-16 px-12 text-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-xl transition-transform hover:scale-105"
                  >
                    <Brain className="w-6 h-6 mr-3" />
                    开始科学评估 (约5分钟)
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={`min-h-screen py-12 bg-gradient-to-b from-gray-50 to-white transition-all duration-500 ease-in-out ${started && !isTransitioning ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* 面包屑导航 */}
          <Breadcrumb items={[{ label: '科学风险评估' }]} />

          {/* 标题 */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              科学风险评估进行中
            </h1>
            <p className="text-gray-600">
              请根据实际情况如实回答，我们会为您详细解读每个问题
            </p>
          </div>

          {/* 所有评估完成页面 */}
          {allCompleted ? (
            <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-white">
              <CardContent className="p-12">
                <div className="text-center space-y-6">
                  <div className="flex justify-center">
                    <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center animate-[checkmarkPop_0.8s_ease-out]">
                      <CheckCircle2 className="w-16 h-16 text-white" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                      所有评估已完成！
                    </h2>
                    <p className="text-xl text-gray-600 mb-8">
                      您的多模态风险评估数据已收集完成
                    </p>
                  </div>
                  <div className="flex gap-4 justify-center">
                    <Button 
                      asChild
                      variant="outline"
                      size="lg"
                      className="h-14 px-8"
                    >
                      <Link href="/">
                        返回首页
                      </Link>
                    </Button>
                    <Button 
                      asChild
                      size="lg"
                      className="h-14 px-8 bg-gradient-to-r from-blue-500 to-purple-600"
                    >
                      <Link href="/health-diary">
                        查看健康日记
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : showMultimodal ? (
            <MultimodalAssessmentSteps 
              onComplete={() => {
                // 所有评估完成
                setIsTransitioning(true);
                setTimeout(() => {
                  setAllCompleted(true);
                  setIsTransitioning(false);
                }, 500);
              }}
            />
          ) : (
            <AIConversationalAssessment 
              onComplete={(result) => {
                // 完成基础问卷后，进入多模态评估步骤
                setIsTransitioning(true);
                setTimeout(() => {
                  setShowMultimodal(true);
                  setIsTransitioning(false);
                }, 500);
              }}
            />
          )}
        </div>
      </div>
    </main>
  );
}

