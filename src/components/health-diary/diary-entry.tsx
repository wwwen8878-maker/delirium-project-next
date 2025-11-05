// 健康日记条目组件

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { HealthDiaryEntry, MoodLevel } from '@/lib/types/enhanced';
import {
  Edit,
  Trash2,
  Heart,
  Moon,
  Pill,
  FileText,
  Calendar,
  Clock
} from 'lucide-react';

interface DiaryEntryProps {
  entry: HealthDiaryEntry;
  onEdit?: (entry: HealthDiaryEntry) => void;
  onDelete?: (entryId: string) => void;
  formatDate: (date: string) => string;
  getMoodColor: (mood: MoodLevel) => string;
  className?: string;
}

export function DiaryEntry({
  entry,
  onEdit,
  onDelete,
  formatDate,
  getMoodColor,
  className = ''
}: DiaryEntryProps) {
  const moodLabels = {
    excellent: '优秀',
    good: '良好',
    fair: '一般',
    poor: '不佳',
  };

  const sleepQualityLabels = {
    1: '很差',
    2: '较差',
    3: '一般',
    4: '良好',
    5: '很好',
  };

  return (
    <Card className={`group hover:shadow-lg transition-all duration-300 ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="font-medium text-gray-900">
                {formatDate(entry.date)}
              </span>
            </div>
            <Badge className={getMoodColor(entry.mood)}>
              {moodLabels[entry.mood]}
            </Badge>
          </div>

          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(entry)}
                className="h-8 w-8 p-0 hover:bg-blue-50"
              >
                <Edit className="w-4 h-4 text-blue-600" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(entry.id)}
                className="h-8 w-8 p-0 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 text-red-600" />
              </Button>
            )}
          </div>
        </div>

        {entry.updatedAt && (
          <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
            <Clock className="w-3 h-3" />
            <span>最后编辑：{new Date(entry.updatedAt).toLocaleString('zh-CN')}</span>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* 睡眠质量 */}
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <Moon className="w-5 h-5 text-purple-600" />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">睡眠质量</span>
              <span className="text-sm text-gray-600">
                {entry.sleepQuality} 分 - {sleepQualityLabels[entry.sleepQuality as keyof typeof sleepQualityLabels]}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-purple-400 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(entry.sleepQuality / 5) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* 症状 */}
        {entry.symptoms.length > 0 && (
          <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
            <Heart className="w-5 h-5 text-red-600 mt-0.5" />
            <div className="flex-1">
              <span className="text-sm font-medium text-gray-700 mb-2 block">症状记录</span>
              <div className="flex flex-wrap gap-2">
                {entry.symptoms.map((symptom, index) => (
                  <Badge key={index} variant="outline" className="text-red-700 border-red-200">
                    {symptom}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 用药记录 */}
        {entry.medication.length > 0 && (
          <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
            <Pill className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <span className="text-sm font-medium text-gray-700 mb-2 block">用药记录</span>
              <div className="flex flex-wrap gap-2">
                {entry.medication.map((med, index) => (
                  <Badge key={index} variant="outline" className="text-blue-700 border-blue-200">
                    {med}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 备注 */}
        {entry.notes && (
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <FileText className="w-5 h-5 text-gray-600 mt-0.5" />
            <div className="flex-1">
              <span className="text-sm font-medium text-gray-700 mb-1 block">备注</span>
              <p className="text-sm text-gray-600 leading-relaxed">{entry.notes}</p>
            </div>
          </div>
        )}

        {/* 创建时间 */}
        <div className="text-xs text-gray-400 pt-2 border-t border-gray-100">
          创建于：{new Date(entry.createdAt).toLocaleString('zh-CN')}
        </div>
      </CardContent>
    </Card>
  );
}
