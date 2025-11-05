"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mic, MicOff, CheckCircle2, AlertCircle } from 'lucide-react';

interface VoiceAnalysisTestProps {
  onComplete: (result: { emotion: string; clarity: number; speed: number }) => void;
  onCancel: () => void;
}

export function VoiceAnalysisTest({ onComplete, onCancel }: VoiceAnalysisTestProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedSeconds, setRecordedSeconds] = useState(0);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 提示文本列表
  const prompts = [
    "请介绍一下您自己，包括您的姓名和年龄。",
    "请描述一下您最近的睡眠情况。",
    "请说说您对即将进行的手术有什么想法。"
  ];
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);

  // 开始录音
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordedSeconds(0);

      // 计时器
      timerRef.current = setInterval(() => {
        setRecordedSeconds(prev => {
          if (prev >= 30) {
            stopRecording();
            return 30;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (error) {
      alert('无法访问麦克风，请检查权限设置');
    }
  };

  // 停止录音
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setHasRecorded(true);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  // 分析录音
  const analyzeRecording = async () => {
    setIsAnalyzing(true);

    // 模拟AI分析（实际应用中这里应该发送音频到后端API）
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 生成模拟分析结果
    const result = {
      emotion: ['平静', '轻微焦虑', '正常'][Math.floor(Math.random() * 3)],
      clarity: Math.floor(Math.random() * 30) + 70, // 70-100
      speed: Math.floor(Math.random() * 20) + 120 // 120-140 字/分钟
    };

    setIsAnalyzing(false);
    onComplete(result);
  };

  // 重录
  const retryRecording = () => {
    setHasRecorded(false);
    setRecordedSeconds(0);
    audioChunksRef.current = [];
    setCurrentPromptIndex(0);
  };

  // 清理
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <Card className="border-2 border-blue-200">
      <CardContent className="p-8">
        <div className="text-center space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
              isRecording 
                ? 'bg-red-500 animate-pulse' 
                : 'bg-gradient-to-br from-blue-500 to-purple-600'
            }`}>
              {isRecording ? (
                <Mic className="w-12 h-12 text-white" />
              ) : (
                <MicOff className="w-12 h-12 text-white" />
              )}
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                语音情感分析
              </h3>
              <p className="text-gray-600">
                {isRecording 
                  ? `正在录音... ${recordedSeconds}秒`
                  : hasRecorded
                  ? '录音完成'
                  : '准备录音'
                }
              </p>
            </div>
          </div>

          {/* 提示文本 */}
          {!hasRecorded && (
            <Card className="border border-gray-200 bg-blue-50">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-left">
                      <h4 className="font-semibold text-gray-900 mb-2">请朗读以下内容：</h4>
                      <p className="text-lg text-gray-700 font-medium">
                        {prompts[currentPromptIndex]}
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        提示 {currentPromptIndex + 1}/{prompts.length}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 录音控制 */}
          {!hasRecorded && (
            <div className="flex gap-4 justify-center">
              {!isRecording ? (
                <Button
                  onClick={startRecording}
                  size="lg"
                  className="h-16 px-12 text-xl bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700"
                >
                  <Mic className="w-6 h-6 mr-3" />
                  开始录音
                </Button>
              ) : (
                <Button
                  onClick={stopRecording}
                  size="lg"
                  className="h-16 px-12 text-xl bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700"
                >
                  <MicOff className="w-6 h-6 mr-3" />
                  停止录音
                </Button>
              )}
            </div>
          )}

          {/* 录音完成后的操作 */}
          {hasRecorded && (
            <div className="space-y-4">
              <Card className="border border-green-200 bg-green-50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                    <p className="text-green-800 font-medium">
                      录音已完成（{recordedSeconds}秒），点击下方按钮进行分析
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-4 justify-center">
                <Button
                  onClick={retryRecording}
                  variant="outline"
                  size="lg"
                  className="h-12 px-8"
                >
                  重新录音
                </Button>
                <Button
                  onClick={analyzeRecording}
                  disabled={isAnalyzing}
                  size="lg"
                  className="h-12 px-8 bg-gradient-to-r from-blue-500 to-purple-600"
                >
                  {isAnalyzing ? 'AI分析中...' : '开始AI分析'}
                </Button>
              </div>
            </div>
          )}

          {/* 取消按钮 */}
          <Button
            onClick={onCancel}
            variant="ghost"
            className="mt-4"
          >
            返回
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}




