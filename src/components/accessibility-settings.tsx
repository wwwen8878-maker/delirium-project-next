'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Settings, Type, Contrast, Check } from "lucide-react";

type FontSize = 'default' | 'large' | 'x-large';
type ContrastMode = 'normal' | 'high';

export function AccessibilitySettings() {
  const [fontSize, setFontSize] = useState<FontSize>('default');
  const [contrastMode, setContrastMode] = useState<ContrastMode>('normal');
  const [isOpen, setIsOpen] = useState(false);

  // 从 localStorage 加载设置
  useEffect(() => {
    const savedFontSize = localStorage.getItem('fontSize') as FontSize;
    const savedContrast = localStorage.getItem('contrastMode') as ContrastMode;
    
    if (savedFontSize) setFontSize(savedFontSize);
    if (savedContrast) setContrastMode(savedContrast);
  }, []);

  // 应用字体大小
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('font-size-default', 'font-size-large', 'font-size-x-large');
    root.classList.add(`font-size-${fontSize}`);
    localStorage.setItem('fontSize', fontSize);
  }, [fontSize]);

  // 应用对比度模式
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('contrast-normal', 'contrast-high');
    root.classList.add(`contrast-${contrastMode}`);
    localStorage.setItem('contrastMode', contrastMode);
  }, [contrastMode]);

  const fontSizeOptions: { value: FontSize; label: string; preview: string }[] = [
    { value: 'default', label: '默认', preview: '正常字号 16px' },
    { value: 'large', label: '大字号', preview: '大字号 18px' },
    { value: 'x-large', label: '特大字号', preview: '特大字号 20px' },
  ];

  const contrastOptions: { value: ContrastMode; label: string; description: string }[] = [
    { value: 'normal', label: '标准对比度', description: '适合大多数用户' },
    { value: 'high', label: '高对比度', description: '增强视觉对比，便于阅读' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="relative"
          aria-label="辅助功能设置"
        >
          <Settings className="h-5 w-5" />
          {(fontSize !== 'default' || contrastMode !== 'normal') && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-blue-600 rounded-full" />
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Settings className="h-6 w-6 text-blue-600" />
            辅助功能设置
          </DialogTitle>
          <DialogDescription>
            调整字体大小和对比度，提升阅读体验
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* 字体大小设置 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Type className="h-5 w-5 text-blue-600" />
              <Label className="text-lg font-semibold">字体大小</Label>
            </div>
            <div className="grid gap-3">
              {fontSizeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFontSize(option.value)}
                  className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                    fontSize === option.value
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  role="radio"
                  aria-checked={fontSize === option.value}
                >
                  <div className="text-left">
                    <div className="font-medium text-gray-900">{option.label}</div>
                    <div className="text-sm text-gray-600">{option.preview}</div>
                  </div>
                  {fontSize === option.value && (
                    <Check className="h-5 w-5 text-blue-600" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* 对比度设置 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Contrast className="h-5 w-5 text-blue-600" />
              <Label className="text-lg font-semibold">对比度模式</Label>
            </div>
            <div className="grid gap-3">
              {contrastOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setContrastMode(option.value)}
                  className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                    contrastMode === option.value
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  role="radio"
                  aria-checked={contrastMode === option.value}
                >
                  <div className="text-left">
                    <div className="font-medium text-gray-900">{option.label}</div>
                    <div className="text-sm text-gray-600">{option.description}</div>
                  </div>
                  {contrastMode === option.value && (
                    <Check className="h-5 w-5 text-blue-600" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* 预览区域 */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 mb-2 font-medium">效果预览：</p>
            <p className="text-gray-900">
              这是一段示例文字，用于预览当前的字体大小和对比度设置。
              您可以根据自己的需求调整上述设置，以获得最佳的阅读体验。
            </p>
          </div>

          {/* 重置按钮 */}
          <div className="flex justify-between items-center pt-4 border-t">
            <p className="text-sm text-gray-600">
              设置将自动保存到本地浏览器
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setFontSize('default');
                setContrastMode('normal');
              }}
            >
              恢复默认
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


























