"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, AlertCircle, CheckCircle2, X } from 'lucide-react';

interface FaceRecognitionTestProps {
  onComplete: (result: { emotion: string; confidence: number }) => void;
  onCancel: () => void;
}

export function FaceRecognitionTest({ onComplete, onCancel }: FaceRecognitionTestProps) {
  const [isCapturing, setIsCapturing] = useState(false);
  const [hasCaptured, setHasCaptured] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // 启动摄像头
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 }
        } 
      });
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCapturing(true);
      }
    } catch (error) {
      alert('无法访问摄像头，请检查权限设置');
      onCancel();
    }
  };

  // 拍照
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      if (context) {
        context.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg');
        setCapturedImage(imageData);
        setHasCaptured(true);
        stopCamera();
      }
    }
  };

  // 停止摄像头
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCapturing(false);
  };

  // 分析照片
  const analyzePhoto = async () => {
    setIsAnalyzing(true);

    // 模拟AI分析（实际应用中这里应该发送图片到后端API）
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 生成模拟分析结果
    const result = {
      emotion: ['平静', '轻微紧张', '正常'][Math.floor(Math.random() * 3)],
      confidence: Math.floor(Math.random() * 20) + 80 // 80-100
    };

    setIsAnalyzing(false);
    onComplete(result);
  };

  // 重拍
  const retryCapture = () => {
    setHasCaptured(false);
    setCapturedImage(null);
    startCamera();
  };

  // 初始化摄像头
  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <Card className="border-2 border-blue-200">
      <CardContent className="p-8">
        <div className="text-center space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Camera className="w-12 h-12 text-white" />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                面部表情识别
              </h3>
              <p className="text-gray-600">
                {hasCaptured ? '照片已拍摄' : '请面向摄像头'}
              </p>
            </div>
          </div>

          {/* 说明 */}
          {!hasCaptured && (
            <Card className="border border-gray-200 bg-blue-50">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-left">
                    <h4 className="font-semibold text-gray-900 mb-1">拍摄说明</h4>
                    <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                      <li>请面向摄像头，保持自然表情</li>
                      <li>确保光线充足，面部清晰可见</li>
                      <li>保持表情自然，不要刻意做表情</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 视频预览或拍摄的照片 */}
          <div className="relative">
            {!hasCaptured ? (
              <div className="relative bg-gray-900 rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full max-w-md mx-auto"
                />
                <canvas ref={canvasRef} className="hidden" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="border-4 border-blue-500 rounded-lg w-64 h-80">
                    <div className="absolute top-2 left-2 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-lg"></div>
                    <div className="absolute top-2 right-2 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-lg"></div>
                    <div className="absolute bottom-2 left-2 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-lg"></div>
                    <div className="absolute bottom-2 right-2 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-lg"></div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative">
                {capturedImage && (
                  <img 
                    src={capturedImage} 
                    alt="Captured" 
                    className="w-full max-w-md mx-auto rounded-lg"
                  />
                )}
                <div className="absolute top-4 right-4">
                  <div className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>拍摄成功</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 控制按钮 */}
          {!hasCaptured && isCapturing && (
            <Button
              onClick={capturePhoto}
              size="lg"
              className="h-16 px-12 text-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              <Camera className="w-6 h-6 mr-3" />
              拍摄照片
            </Button>
          )}

          {/* 拍摄完成后的操作 */}
          {hasCaptured && (
            <div className="space-y-4">
              <Card className="border border-green-200 bg-green-50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                    <p className="text-green-800 font-medium">
                      照片已拍摄，点击下方按钮进行分析
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-4 justify-center">
                <Button
                  onClick={retryCapture}
                  variant="outline"
                  size="lg"
                  className="h-12 px-8"
                >
                  重新拍摄
                </Button>
                <Button
                  onClick={analyzePhoto}
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
            onClick={() => {
              stopCamera();
              onCancel();
            }}
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




