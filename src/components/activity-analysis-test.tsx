"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Activity, AlertCircle, CheckCircle2, Brain } from 'lucide-react';

interface ActivityAnalysisTestProps {
  onComplete: (result: { independence: string; activityScore: number }) => void;
  onCancel: () => void;
}

export function ActivityAnalysisTest({ onComplete, onCancel }: ActivityAnalysisTestProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // 开始分析
  const startAnalysis = async () => {
    setIsAnalyzing(true);

    // 模拟AI分析（实际应用中这里应该调用后端API分析用户的历史数据）
    await new Promise(resolve => setTimeout(resolve, 3000));

    // 生成模拟分析结果
    const result = {
      independence: ['高度独立', '基本独立', '需要协助'][Math.floor(Math.random() * 3)],
      activityScore: Math.floor(Math.random() * 20) + 75 // 75-95
    };

    setIsAnalyzing(false);
    onComplete(result);
  };

  return (
    <Card className="border-2 border-blue-200">
      <CardContent className="p-8">
        <div className="text-center space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
              <Activity className="w-12 h-12 text-white" />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                活动模式分析
              </h3>
              <p className="text-gray-600">
                基于您的历史数据进行AI分析
              </p>
            </div>
          </div>

          {/* 说明 */}
          <Card className="border border-gray-200 bg-purple-50">
            <CardContent className="p-6 text-left">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Brain className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">分析内容</h4>
                    <ul className="text-sm text-gray-700 space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-purple-600">•</span>
                        <span>日常活动频率和规律性分析</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-600">•</span>
                        <span>身体功能独立性的综合评估</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-600">•</span>
                        <span>基于问卷回答和健康记录的活动模式识别</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-600">•</span>
                        <span>术后恢复潜力的预测评估</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-4 border-t border-purple-200">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">数据来源</h4>
                    <p className="text-sm text-gray-700">
                      AI将综合分析您之前填写的问卷答案、健康日记记录以及活动习惯，生成个性化的活动能力评估报告。
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 分析进度（如果正在分析） */}
          {isAnalyzing && (
            <div className="space-y-4">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-gray-900 mb-2">
                    AI正在分析您的活动模式...
                  </p>
                  <p className="text-sm text-gray-600">
                    正在评估日常活动、身体功能和独立性水平
                  </p>
                </div>
              </div>

              {/* 模拟进度步骤 */}
              <div className="space-y-2 text-left max-w-md mx-auto">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-700">分析问卷回答数据</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-700">处理健康日记记录</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-purple-100 rounded-lg animate-pulse">
                  <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm text-gray-700">生成活动能力评估报告</span>
                </div>
              </div>
            </div>
          )}

          {/* 开始分析按钮 */}
          {!isAnalyzing && (
            <div className="space-y-4">
              <Button
                onClick={startAnalysis}
                size="lg"
                className="h-16 px-12 text-xl bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
              >
                <Activity className="w-6 h-6 mr-3" />
                开始活动分析
              </Button>

              <Button
                onClick={onCancel}
                variant="ghost"
                className="mt-4"
              >
                返回
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}




