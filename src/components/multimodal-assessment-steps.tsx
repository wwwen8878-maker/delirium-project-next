"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mic, Camera, Activity, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { VoiceAnalysisTest } from './voice-analysis-test';
import { FaceRecognitionTest } from './face-recognition-test';
import { ActivityAnalysisTest } from './activity-analysis-test';

interface MultimodalStep {
  id: number;
  title: string;
  description: string;
  icon: typeof Mic;
  buttonText: string;
  permissionType: 'microphone' | 'camera' | 'none';
}

const MULTIMODAL_STEPS: MultimodalStep[] = [
  {
    id: 2,
    title: '语音情感分析',
    description: '通过分析您的语音语调，帮助了解情绪状态和认知水平',
    icon: Mic,
    buttonText: '开始语音分析',
    permissionType: 'microphone'
  },
  {
    id: 3,
    title: '面部表情识别',
    description: '通过分析面部表情特征，辅助评估您的情绪和认知状态',
    icon: Camera,
    buttonText: '开始面部识别',
    permissionType: 'camera'
  },
  {
    id: 4,
    title: '活动模式分析',
    description: '通过分析日常活动模式，评估您的身体功能和独立性',
    icon: Activity,
    buttonText: '开始活动分析',
    permissionType: 'none'
  }
];

/**
 * 综合风险评估进度条
 */
function MultimodalProgressBar({ currentStep, completedSteps }: { currentStep: number; completedSteps: number[] }) {
  const totalSteps = 4;
  const progress = ((currentStep - 1) / totalSteps) * 100;

  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">综合风险评估进度</h2>
        <span className="text-sm text-gray-600">{currentStep}/{totalSteps}</span>
      </div>
      
      <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="absolute h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500 ease-in-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* 步骤图标 */}
      <div className="flex items-center justify-between mt-4">
        {[1, 2, 3, 4].map((step) => {
          const isCompleted = completedSteps.includes(step);
          const isCurrent = currentStep === step;
          const isPast = step < currentStep;

          let Icon;
          let bgColor;
          let textColor;
          let borderColor;

          if (step === 1) {
            Icon = CheckCircle2;
          } else if (step === 2) {
            Icon = Mic;
          } else if (step === 3) {
            Icon = Camera;
          } else {
            Icon = Activity;
          }

          if (isCompleted || isPast) {
            bgColor = 'bg-green-500';
            textColor = 'text-white';
            borderColor = 'border-green-500';
          } else if (isCurrent) {
            bgColor = 'bg-blue-500';
            textColor = 'text-white';
            borderColor = 'border-blue-500';
          } else {
            bgColor = 'bg-gray-200';
            textColor = 'text-gray-400';
            borderColor = 'border-gray-200';
          }

          return (
            <div key={step} className="flex flex-col items-center flex-1">
              <div className={`w-12 h-12 rounded-full ${bgColor} ${borderColor} border-2 flex items-center justify-center transition-all duration-500 ease-in-out ${isCurrent ? 'scale-110' : ''}`}>
                <Icon className={`w-6 h-6 ${textColor}`} />
              </div>
              <span className={`text-xs mt-2 ${isCurrent || isCompleted ? 'text-gray-900 font-semibold' : 'text-gray-500'}`}>
                {step === 1 ? '基础问卷' : step === 2 ? '语音分析' : step === 3 ? '面部识别' : '活动分析'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * 综合评估步骤页面组件
 */
export function MultimodalAssessmentSteps({ onComplete }: { onComplete?: () => void }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([1]); // 基础问卷已完成
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('left');
  const [showTest, setShowTest] = useState(false); // 是否显示测试界面

  const currentStep = MULTIMODAL_STEPS[currentStepIndex];
  const StepIcon = currentStep?.icon;

  const handleStartStep = async () => {
    // 请求权限（如果需要）
    if (currentStep.permissionType === 'microphone') {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (error) {
        alert('需要麦克风权限才能进行语音分析');
        return;
      }
    } else if (currentStep.permissionType === 'camera') {
      try {
        await navigator.mediaDevices.getUserMedia({ video: true });
      } catch (error) {
        alert('需要摄像头权限才能进行面部识别');
        return;
      }
    }

    // 显示测试界面
    setShowTest(true);
  };

  // 测试完成后的处理
  const handleTestComplete = (result: any) => {
    // 标记当前步骤为已完成
    setCompletedSteps(prev => {
      if (!prev.includes(currentStep.id)) {
        return [...prev, currentStep.id];
      }
      return prev;
    });

    // 隐藏测试界面
    setShowTest(false);

    // 如果是最后一步，完成所有评估
    if (currentStepIndex === MULTIMODAL_STEPS.length - 1) {
      // 所有步骤完成，调用完成回调
      if (onComplete) {
        onComplete();
      }
      return;
    }

    // 否则进入下一步
    const nextIndex = currentStepIndex + 1;
    
    // 触发转场动画
    setIsTransitioning(true);
    setSlideDirection('left');

    setTimeout(() => {
      setCurrentStepIndex(nextIndex);
      setIsTransitioning(false);
      setSlideDirection('left');
    }, 500);
  };

  // 取消测试，返回步骤页面
  const handleTestCancel = () => {
    setShowTest(false);
  };

  if (!currentStep) {
    return null;
  }

  // 如果显示测试界面，渲染对应的测试组件
  if (showTest) {
    return (
      <div className="min-h-screen py-12 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* 返回按钮 */}
            <Button asChild variant="ghost" className="mb-6">
              <Link href="/ai-assessment">
                <ArrowLeft className="w-4 h-4 mr-2" />
                返回评估
              </Link>
            </Button>

            {/* 进度条 */}
            <MultimodalProgressBar 
              currentStep={currentStep.id} 
              completedSteps={completedSteps}
            />

            {/* 测试组件 */}
            {currentStep.id === 2 && (
              <VoiceAnalysisTest 
                onComplete={handleTestComplete}
                onCancel={handleTestCancel}
              />
            )}
            {currentStep.id === 3 && (
              <FaceRecognitionTest 
                onComplete={handleTestComplete}
                onCancel={handleTestCancel}
              />
            )}
            {currentStep.id === 4 && (
              <ActivityAnalysisTest 
                onComplete={handleTestComplete}
                onCancel={handleTestCancel}
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* 返回按钮 */}
          <Button asChild variant="ghost" className="mb-6">
            <Link href="/ai-assessment">
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回评估
            </Link>
          </Button>

          {/* 进度条 */}
          <MultimodalProgressBar 
            currentStep={currentStep.id} 
            completedSteps={completedSteps}
          />

          {/* 步骤内容卡片 */}
          <div className="relative overflow-hidden min-h-[400px]">
            <Card 
              key={currentStep.id}
              className={`border-2 border-blue-200 transition-all duration-500 ease-in-out ${
                isTransitioning && slideDirection === 'left'
                  ? '-translate-x-full opacity-0'
                  : isTransitioning && slideDirection === 'right'
                  ? 'translate-x-full opacity-0'
                  : 'translate-x-0 opacity-100'
              }`}
            >
              <CardContent className="p-8 md:p-12">
                <div className="text-center space-y-8">
                  {/* 图标和标题 */}
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-xl">
                      <StepIcon className="w-12 h-12 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                        步骤 {currentStep.id}/4
                      </h2>
                      <h3 className="text-2xl md:text-3xl font-semibold text-gray-700">
                        {currentStep.title}
                      </h3>
                    </div>
                  </div>

                  {/* 描述 */}
                  <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
                    {currentStep.description}
                  </p>

                  {/* 说明卡片 */}
                  <Card className="border border-gray-200 bg-gray-50">
                    <CardContent className="p-6 text-left">
                      <div className="space-y-3">
                        {currentStep.id === 2 && (
                          <>
                            <div className="flex items-start gap-3">
                              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-1">语音分析说明</h4>
                                <p className="text-sm text-gray-700 leading-relaxed">
                                  请在一个安静的环境中，按照提示说几句话。我们会分析您的语音特征，包括语速、语调、清晰度等，来评估情绪状态。
                                </p>
                              </div>
                            </div>
                          </>
                        )}
                        
                        {currentStep.id === 3 && (
                          <>
                            <div className="flex items-start gap-3">
                              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-1">面部识别说明</h4>
                                <p className="text-sm text-gray-700">
                                  请面向摄像头，保持自然表情。系统将分析您的面部表情特征，帮助评估情绪状态和认知水平。
                                </p>
                              </div>
                            </div>
                          </>
                        )}

                        {currentStep.id === 4 && (
                          <>
                            <div className="flex items-start gap-3">
                              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-1">活动分析说明</h4>
                                <p className="text-sm text-gray-700 leading-relaxed">
                                  基于您之前的记录和问卷回答，我们会分析您的活动模式，评估身体功能和日常独立性水平。
                                </p>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* 主按钮 - 单一焦点 */}
                  <div className="pt-6">
                    <Button
                      onClick={handleStartStep}
                      size="lg"
                      className="h-16 px-12 text-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-xl transition-transform hover:scale-105"
                    >
                      <StepIcon className="w-6 h-6 mr-3" />
                      {currentStep.buttonText}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
    );
}

