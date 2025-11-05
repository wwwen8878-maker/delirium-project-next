'use client'

import * as React from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function MicroSurvey() {
  const [feedback, setFeedback] = React.useState<'positive' | 'negative' | null>(null);
  const [submitted, setSubmitted] = React.useState(false);

  const handleFeedback = (type: 'positive' | 'negative') => {
    setFeedback(type);
    setSubmitted(true);
    
    // 这里可以添加实际的反馈提交逻辑
    // 用户反馈已记录
    
    // 3秒后重置状态
    setTimeout(() => {
      setSubmitted(false);
      setFeedback(null);
    }, 3000);
  };

  if (submitted) {
    return (
      <div className="p-3 bg-green-50 rounded-lg border border-green-200">
        <p className="text-sm text-green-700 font-medium">
          感谢您的反馈！
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-sm text-gray-700 font-medium">
        这个平台对您有帮助吗？
      </p>
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          className="flex-1 hover:bg-green-50 hover:border-green-300 transition-colors"
          onClick={() => handleFeedback('positive')}
        >
          <ThumbsUp className="h-4 w-4 mr-1" />
          有帮助
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="flex-1 hover:bg-red-50 hover:border-red-300 transition-colors"
          onClick={() => handleFeedback('negative')}
        >
          <ThumbsDown className="h-4 w-4 mr-1" />
          需改进
        </Button>
      </div>
    </div>
  );
}




















