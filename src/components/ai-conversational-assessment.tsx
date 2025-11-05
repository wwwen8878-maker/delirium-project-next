"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Bot, User, ArrowRight, CheckCircle2, AlertCircle, Circle, Mic, Camera, FileText } from 'lucide-react';
import { syncAssessmentToMedical, PatientAssessmentData } from '@/lib/patient-data-sync';

/**
 * 焦虑程度滑动条 - Apple HIG & Fluent Design风格
 */
function AnxietySlider({ 
  value, 
  onChange, 
  onConfirm 
}: { 
  value: number; 
  onChange: (value: number) => void;
  onConfirm: (value: number) => void;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const sliderRef = useRef<HTMLDivElement>(null);
  const currentValueRef = useRef<number>(value); // 使用 ref 存储最新值

  useEffect(() => {
    setLocalValue(value);
    currentValueRef.current = value;
  }, [value]);

  const handleMouseDown = () => {
    setIsDragging(true);
    setShowTooltip(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement> | MouseEvent | TouchEvent) => {
    if (!isDragging || !sliderRef.current) return;
    
    const rect = sliderRef.current.getBoundingClientRect();
    let x = 0;
    if ('clientX' in e) {
      x = e.clientX;
    } else if ('touches' in e && e.touches.length > 0) {
      x = e.touches[0].clientX;
    }
    const percentage = Math.max(0, Math.min(1, (x - rect.left) / rect.width));
    const newValue = Math.round(percentage * 10);
    
    setLocalValue(newValue);
    currentValueRef.current = newValue; // 同步更新 ref
    onChange(newValue);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setShowTooltip(false);
    onConfirm(currentValueRef.current); // 使用 ref 中的最新值
  };

  useEffect(() => {
    if (isDragging) {
      const handleMouseMoveGlobal = (e: MouseEvent) => handleMouseMove(e);
      const handleMouseUpGlobal = () => handleMouseUp();
      
      window.addEventListener('mousemove', handleMouseMoveGlobal);
      window.addEventListener('mouseup', handleMouseUpGlobal);
      window.addEventListener('touchmove', (e: TouchEvent) => {
        e.preventDefault();
        handleMouseMove(e);
      }, { passive: false });
      window.addEventListener('touchend', handleMouseUpGlobal);
      
      return () => {
        window.removeEventListener('mousemove', handleMouseMoveGlobal);
        window.removeEventListener('mouseup', handleMouseUpGlobal);
        window.removeEventListener('touchmove', handleMouseMove as any);
        window.removeEventListener('touchend', handleMouseUpGlobal);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging]);

  const percentage = (localValue / 10) * 100;

  return (
    <div className="relative" ref={sliderRef}>
      {/* Slider Track */}
      <div className="relative h-2 bg-gray-200 rounded-full">
        {/* Active Track */}
        <div 
          className="absolute h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-150"
          style={{ width: `${percentage}%` }}
        />
        
        {/* Thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 cursor-grab active:cursor-grabbing transition-all duration-200"
          style={{ left: `${percentage}%` }}
          onMouseDown={handleMouseDown}
          onTouchStart={() => {
            setIsDragging(true);
            setShowTooltip(true);
          }}
        >
          <div 
            className={`w-6 h-6 rounded-full bg-white border-2 border-blue-500 shadow-lg transition-all duration-200 ${
              isDragging 
                ? 'scale-125 shadow-2xl shadow-blue-500/50 ring-4 ring-blue-500/20' 
                : 'hover:scale-110 hover:shadow-xl'
            }`}
          />
        </div>
      </div>

      {/* Tooltip - Floating Label */}
      {showTooltip && (
        <div
          className={`absolute bottom-full mb-3 left-1/2 -translate-x-1/2 pointer-events-none transition-all duration-200 ${
            showTooltip 
              ? 'opacity-100 scale-100' 
              : 'opacity-0 scale-95'
          }`}
          style={{ left: `${percentage}%` }}
        >
          <div className="bg-gray-900 text-white px-3 py-1.5 rounded-lg text-sm font-semibold whitespace-nowrap shadow-lg">
            {localValue}
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
          </div>
        </div>
      )}

      {/* Footnote Labels */}
      <div className="flex justify-between mt-2">
        <span className="text-xs text-gray-500">0</span>
        <span className="text-xs text-gray-500">10</span>
      </div>
    </div>
  );
}

interface AssessmentQuestion {
  id: string;
  type: 'choice' | 'yesno' | 'scale';
  question: string;
  aiPrompt: string;
  options?: string[];
  weight: number;
  // 新增：条件触发逻辑
  condition?: (answers: Record<string, any>) => boolean;
  // 新增：跟进问题生成器（类似Akinator逻辑）
  followUpQuestions?: (answer: any, answers: Record<string, any>) => AssessmentQuestion[];
  // 新增：优先级（核心问题优先）
  priority: 'core' | 'followup';
}

interface AssessmentResult {
  score: number;
  riskLevel: '低风险' | '中等风险' | '高风险';
  personalizedAdvice: string[];
  nextSteps: string[];
  detailedAnswers: Record<string, any>; // 包含所有详细回答
}

// 核心问题集（必须回答）
const CORE_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 'age',
    type: 'choice',
    question: '您的年龄段是？',
    aiPrompt: '年龄是谵妄的重要风险因素，65岁以上是高危人群',
    options: ['小于50岁', '50-64岁', '65-74岁', '75岁以上'],
    weight: 3,
    priority: 'core',
    followUpQuestions: (answer, answers) => {
      const followUps: AssessmentQuestion[] = [];
      // 如果年龄较大，询问更多细节
      if (answer === '75岁以上' || answer === '65-74岁') {
        followUps.push({
          id: 'age_living_situation',
          type: 'choice',
          question: '您目前的生活状况是？',
          aiPrompt: '独居或养老院居住会增加风险',
          options: ['与家人同住', '独居', '养老院', '其他'],
          weight: 2,
          priority: 'followup'
        });
      }
      return followUps;
    }
  },
  {
    id: 'surgery',
    type: 'choice',
    question: '您将要接受的手术类型是？',
    aiPrompt: '不同手术类型的谵妄风险不同，心脏和神经外科手术风险较高',
    options: ['心脏手术', '神经外科', '骨科大手术', '腹部手术', '其他手术'],
    weight: 3,
    priority: 'core',
    followUpQuestions: (answer, answers) => {
      const followUps: AssessmentQuestion[] = [];
      // 高风险手术类型需要更详细信息
      if (answer === '心脏手术' || answer === '神经外科') {
        followUps.push({
          id: 'surgery_duration',
          type: 'choice',
          question: '预计手术时长是？',
          aiPrompt: '手术时间越长，风险越高',
          options: ['小于2小时', '2-4小时', '超过4小时'],
          weight: 2,
          priority: 'followup'
        });
        followUps.push({
          id: 'surgery_urgency',
          type: 'choice',
          question: '手术紧急程度是？',
          aiPrompt: '急诊手术风险明显增加',
          options: ['择期手术', '限期手术', '急诊手术'],
          weight: 2,
          priority: 'followup'
        });
      }
      return followUps;
    }
  },
  {
    id: 'cognitive',
    type: 'choice',
    question: '最近您的记忆力如何？',
    aiPrompt: '认知功能下降会增加谵妄风险',
    options: ['记忆力很好', '偶尔忘事', '经常忘事', '记忆力明显下降'],
    weight: 4,
    priority: 'core',
    followUpQuestions: (answer, answers) => {
      const followUps: AssessmentQuestion[] = [];
      // 如果记忆力有问题，深入询问
      if (answer === '经常忘事' || answer === '记忆力明显下降') {
        followUps.push({
          id: 'cognitive_detail',
          type: 'choice',
          question: '您主要会忘记什么？',
          aiPrompt: '不同类型的遗忘提示不同的认知问题',
          options: ['忘记近期事件', '忘记人名或物品名称', '忘记熟悉的路线', '上述都有'],
          weight: 3,
          priority: 'followup'
        });
        followUps.push({
          id: 'cognitive_duration',
          type: 'choice',
          question: '这种记忆力问题持续了多久？',
          aiPrompt: '持续时间有助于判断严重程度',
          options: ['不到3个月', '3-6个月', '6-12个月', '超过1年'],
          weight: 2,
          priority: 'followup'
        });
      }
      return followUps;
    }
  },
  {
    id: 'sleep',
    type: 'choice',
    question: '您最近的睡眠质量如何？',
    aiPrompt: '睡眠障碍会显著增加谵妄风险',
    options: ['睡眠良好', '偶尔失眠', '经常失眠', '严重睡眠问题'],
    weight: 2,
    priority: 'core',
    followUpQuestions: (answer, answers) => {
      const followUps: AssessmentQuestion[] = [];
      if (answer === '经常失眠' || answer === '严重睡眠问题') {
        followUps.push({
          id: 'sleep_pattern',
          type: 'choice',
          question: '您的睡眠问题主要是？',
          aiPrompt: '不同的睡眠问题需要不同的干预策略',
          options: ['难以入睡', '易醒/多梦', '早醒', '昼夜颠倒'],
          weight: 2,
          priority: 'followup'
        });
        followUps.push({
          id: 'sleep_medication',
          type: 'yesno',
          question: '您是否在服用助眠药物？',
          aiPrompt: '某些助眠药物可能增加谵妄风险',
          weight: 1,
          priority: 'followup'
        });
      }
      return followUps;
    }
  },
  {
    id: 'chronic',
    type: 'choice',
    question: '您有多少种慢性疾病？',
    aiPrompt: '多重慢性病是谵妄的独立危险因素',
    options: ['没有', '1-2种', '3-4种', '5种以上'],
    weight: 2,
    priority: 'core',
    followUpQuestions: (answer, answers) => {
      const followUps: AssessmentQuestion[] = [];
      if (answer !== '没有') {
        followUps.push({
          id: 'chronic_types',
          type: 'choice',
          question: '您有哪些慢性疾病？（多选将被解析）',
          aiPrompt: '某些疾病组合风险更高',
          options: ['高血压', '糖尿病', '心脏病', '肾脏疾病', '肺部疾病', '神经疾病', '其他'],
          weight: 2,
          priority: 'followup'
        });
      }
      return followUps;
    }
  },
  {
    id: 'vision',
    type: 'yesno',
    question: '您是否有视力或听力障碍？',
    aiPrompt: '感官障碍会增加术后定向障碍的风险',
    weight: 1,
    priority: 'core',
    followUpQuestions: (answer) => {
      const followUps: AssessmentQuestion[] = [];
      if (answer === '是') {
        followUps.push({
          id: 'vision_detail',
          type: 'choice',
          question: '具体是哪种障碍？',
          aiPrompt: '不同障碍的影响不同',
          options: ['视力障碍（需要眼镜）', '严重视力障碍', '听力障碍（需要助听器）', '严重听力障碍', '两者都有'],
          weight: 1,
          priority: 'followup'
        });
      }
      return followUps;
    }
  },
  {
    id: 'living',
    type: 'yesno',
    question: '术后会有家人陪伴照顾吗？',
    aiPrompt: '家属陪伴可降低43%的谵妄风险',
    weight: 2,
    priority: 'core',
    followUpQuestions: (answer) => {
      const followUps: AssessmentQuestion[] = [];
      if (answer === '否') {
        followUps.push({
          id: 'living_alternative',
          type: 'choice',
          question: '如果无法家人陪伴，是否有其他支持？',
          aiPrompt: '了解替代支持方案',
          options: ['有护工/保姆', '有朋友/邻居', '医院护理', '完全独自'],
          weight: 2,
          priority: 'followup'
        });
      } else if (answer === '是') {
        followUps.push({
          id: 'living_duration',
          type: 'choice',
          question: '家属陪伴的时长预计是？',
          aiPrompt: '更长的陪伴时间效果更好',
          options: ['部分时间', '每天大部分时间', '全天陪伴'],
          weight: 1,
          priority: 'followup'
        });
      }
      return followUps;
    }
  },
  {
    id: 'anxiety',
    type: 'scale',
    question: '您对这次手术的焦虑程度？',
    aiPrompt: '术前焦虑会影响术后恢复',
    weight: 2,
    priority: 'core',
    followUpQuestions: (answer) => {
      const followUps: AssessmentQuestion[] = [];
      if (answer >= 7) {
        followUps.push({
          id: 'anxiety_source',
          type: 'choice',
          question: '您主要的担忧来源是？',
          aiPrompt: '了解焦虑来源有助于针对性干预',
          options: ['手术风险', '术后疼痛', '恢复过程', '经济负担', '其他'],
          weight: 1,
          priority: 'followup'
        });
      }
      return followUps;
    }
  }
];

/**
 * 评估项目完成度状态列表 - Apple HIG风格
 * 使用清晰的状态显示，而非误导性的百分比
 */
function AssessmentCompletionStatus() {
  const [visibleItems, setVisibleItems] = useState<number[]>([]);

  const assessmentItems = [
    { id: 'questionnaire', name: '基础问卷', completed: true, icon: FileText },
    { id: 'voice', name: '语音分析', completed: false, icon: Mic },
    { id: 'facial', name: '面部识别', completed: false, icon: Camera },
    { id: 'activity', name: '活动监测', completed: false, icon: AlertCircle },
  ];

  useEffect(() => {
    // 逐项滑入动画：每个项目延迟50ms
    assessmentItems.forEach((_, index) => {
      setTimeout(() => {
        setVisibleItems(prev => [...prev, index]);
      }, index * 50);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-white rounded-xl p-6 text-left border border-gray-200">
      <h4 className="font-bold text-gray-900 mb-4">
        评估项目完成度
      </h4>
      
      <div className="space-y-3">
        {assessmentItems.map((item, index) => {
          const Icon = item.icon;
          const isVisible = visibleItems.includes(index);
          const isCompleted = item.completed;
          
          return (
            <div
              key={item.id}
              className={`flex items-center gap-3 transition-all duration-500 ease-out ${
                isVisible 
                  ? 'opacity-100 translate-x-0' 
                  : 'opacity-0 -translate-x-4'
              }`}
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <div className="flex-shrink-0">
                {isCompleted ? (
                  <div 
                    className="text-green-600"
                    style={isVisible ? {
                      animation: 'pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s'
                    } : {}}
                  >
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                ) : (
                  <Circle className="w-5 h-5 text-gray-400 fill-none" strokeDasharray="3,3" />
                )}
              </div>
              
              <Icon className={`w-4 h-4 flex-shrink-0 ${
                isCompleted ? 'text-green-600' : 'text-gray-400'
              }`} />
              
              <span className="flex-1 text-sm font-medium text-gray-900">
                {item.name}
              </span>
              
              <span className={`text-xs ${
                isCompleted ? 'text-green-600' : 'text-gray-500'
              }`}>
                {isCompleted ? '已完成' : '未完成'}
              </span>
            </div>
          );
        })}
      </div>
      
      {/* 提示文案 */}
      <p className="text-xs text-gray-500 mt-4 leading-relaxed">
        提示：完成所有评估项目（语音、面部、活动）将极大提升AI风险评估的准确性。
      </p>
    </div>
  );
}

export function AIConversationalAssessment({ onComplete }: { onComplete?: (result: AssessmentResult) => void }) {
  // 动态问题队列（初始为核心问题）
  const [questionQueue, setQuestionQueue] = useState<AssessmentQuestion[]>(CORE_QUESTIONS);
  const [answeredIds, setAnsweredIds] = useState<Set<string>>(new Set());
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isCalculating, setIsCalculating] = useState(false);
  const [showAIResponse, setShowAIResponse] = useState(false);
  const [result, setResult] = useState<AssessmentResult | null>(null);

  // 计算总问题数（已回答 + 待回答）
  const totalQuestions = questionQueue.length;
  const progress = totalQuestions > 0 ? ((answeredIds.size) / totalQuestions) * 100 : 0;
  const currentQuestion = questionQueue[currentStep];

  // 将 calculateResult 移到 useCallback 中，确保可以访问最新状态
  const calculateResult = useCallback(async () => {
    setIsCalculating(true);

    // 计算分数 - 使用所有已回答的问题（包括跟进问题）
    let totalScore = 0;
    let maxScore = 0;

    questionQueue.forEach((q) => {
      if (answeredIds.has(q.id)) {
        maxScore += q.weight * 3; // 假设最高分是3
        const answer = answers[q.id];
        
        if (q.type === 'choice') {
          const index = q.options?.indexOf(answer) || 0;
          totalScore += index * q.weight;
        } else if (q.type === 'yesno') {
          totalScore += (answer === '是' ? q.weight * 2 : 0);
        } else if (q.type === 'scale') {
          totalScore += answer * q.weight / 3;
        }
      }
    });

    const scorePercentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;
    const riskLevel = scorePercentage < 30 ? '低风险' : scorePercentage < 60 ? '中等风险' : '高风险';

    // 基于详细回答生成个性化建议（使用所有收集到的信息）
    const advice: string[] = [];
    const nextSteps: string[] = [];

    // 睡眠相关问题
    if (answers.sleep === '经常失眠' || answers.sleep === '严重睡眠问题') {
      let sleepAdvice = '改善睡眠质量：术前保证每晚7-8小时睡眠';
      if (answers.sleep_pattern) {
        if (answers.sleep_pattern === '难以入睡') {
          sleepAdvice += '。建议睡前1小时避免电子设备，尝试阅读或听轻音乐';
        } else if (answers.sleep_pattern === '易醒/多梦') {
          sleepAdvice += '。建议保持卧室安静、黑暗，温度适宜';
        } else if (answers.sleep_pattern === '昼夜颠倒') {
          sleepAdvice += '。建议逐步调整作息，每天提前30分钟入睡';
        }
      }
      if (answers.sleep_medication === '是') {
        sleepAdvice += '。请与医生讨论助眠药物的使用，某些药物可能增加术后风险';
      }
      advice.push(sleepAdvice);
      nextSteps.push('睡眠管理计划');
    }
    
    // 认知相关问题
    if (answers.cognitive === '经常忘事' || answers.cognitive === '记忆力明显下降') {
      let cognitiveAdvice = '认知训练：每天进行简单的记忆练习';
      if (answers.cognitive_detail) {
        if (answers.cognitive_detail === '忘记近期事件') {
          cognitiveAdvice += '。建议使用备忘录或日记记录重要事件';
        } else if (answers.cognitive_detail === '忘记人名或物品名称') {
          cognitiveAdvice += '。建议制作照片标签，帮助记忆';
        } else if (answers.cognitive_detail === '忘记熟悉的路线') {
          cognitiveAdvice += '。建议术前熟悉医院环境，由家人陪同熟悉路线';
        }
      }
      if (answers.cognitive_duration) {
        if (answers.cognitive_duration === '超过1年') {
          cognitiveAdvice += '。建议术前进行专业认知评估';
        }
      }
      advice.push(cognitiveAdvice);
      nextSteps.push('认知训练游戏');
    }

    // 家属陪伴问题
    if (answers.living === '否') {
      let livingAdvice = '⚠️ 重要：强烈建议安排家属陪护，可降低43%风险';
      if (answers.living_alternative) {
        if (answers.living_alternative === '完全独自') {
          livingAdvice += '。如果确实无法安排家人，请考虑聘请专业护工';
        } else if (answers.living_alternative === '医院护理') {
          livingAdvice += '。可以与医护人员沟通，确保获得足够的关注';
        }
      }
      advice.push(livingAdvice);
      nextSteps.push('家属陪护指南');
    } else if (answers.living === '是' && answers.living_duration) {
      if (answers.living_duration === '部分时间') {
        advice.push('建议家属尽量延长陪伴时间，尤其是术后前3天最关键');
      }
    }

    // 感官障碍问题
    if (answers.vision === '是') {
      let visionAdvice = '确保术后佩戴眼镜和助听器，保持感官功能';
      if (answers.vision_detail) {
        if (answers.vision_detail.includes('严重')) {
          visionAdvice += '。术前请检查并确保设备正常工作，准备备用设备';
        }
      }
      advice.push(visionAdvice);
    }

    // 焦虑问题
    if (answers.anxiety >= 7) {
      let anxietyAdvice = '焦虑管理：尝试深呼吸、冥想等放松技巧';
      if (answers.anxiety_source) {
        if (answers.anxiety_source === '手术风险') {
          anxietyAdvice += '。建议与主刀医生详细沟通，了解手术方案和预期效果';
        } else if (answers.anxiety_source === '术后疼痛') {
          anxietyAdvice += '。现代麻醉和镇痛技术可以有效控制疼痛，请相信医疗团队';
        } else if (answers.anxiety_source === '恢复过程') {
          anxietyAdvice += '。建议制定详细的恢复计划，设定小目标逐步达成';
        }
      }
      advice.push(anxietyAdvice);
      nextSteps.push('焦虑缓解训练');
    }

    // 手术相关问题
    if (answers.surgery_duration === '超过4小时') {
      advice.push('长时间手术需要特别注意：术前充分休息，术后早期活动');
    }
    if (answers.surgery_urgency === '急诊手术') {
      advice.push('急诊手术风险相对较高，请密切关注术后早期症状，有任何异常及时告知医护团队');
    }

    // 年龄相关问题
    if (answers.age === '75岁以上' || answers.age === '65-74岁') {
      if (answers.age_living_situation === '独居') {
        advice.push('高龄独居需要特别关注，强烈建议安排陪护或考虑短期住院康复');
      }
    }

    // 慢性疾病问题
    if (answers.chronic_types) {
      const chronicTypes = Array.isArray(answers.chronic_types) 
        ? answers.chronic_types 
        : [answers.chronic_types];
      if (chronicTypes.includes('糖尿病')) {
        advice.push('血糖控制：术前请与内分泌科医生沟通，确保血糖稳定');
      }
      if (chronicTypes.includes('心脏病')) {
        advice.push('心脏监护：术后需要密切监测心率、血压等指标');
      }
      if (chronicTypes.length >= 3) {
        advice.push('多重慢性病管理：请确保所有慢性疾病在术前都处于稳定状态');
      }
    }

    // 通用建议
    advice.push('术前3天开始：每天记录睡眠、情绪和身体状态');
    advice.push('带熟悉的物品：照片、音乐等');
    nextSteps.push('开始每日健康记录');

    const assessmentResult: AssessmentResult = {
      score: Math.round(scorePercentage),
      riskLevel,
      personalizedAdvice: advice,
      nextSteps,
      detailedAnswers: answers // 保存所有详细回答
    };

    setResult(assessmentResult);
    setIsCalculating(false);
    
    // 同步数据到医护端
    const syncData: PatientAssessmentData = {
      patientId: 'P001', // 实际应用中从用户登录获取
      patientName: '患者',
      age: parseInt(answers.age as string) || 70,
      gender: '女',
      surgeryType: answers.surgery as string || '骨科大手术',
      timestamp: new Date().toISOString(),
      riskScore: assessmentResult.score,
      riskLevel: assessmentResult.riskLevel,
      factors: questionQueue
        .filter(q => answeredIds.has(q.id))
        .map(q => ({
          name: q.question,
          value: answers[q.id],
          weight: q.weight,
          isRisk: true
        })),
      personalizedAdvice: assessmentResult.personalizedAdvice,
      nextSteps: assessmentResult.nextSteps,
      status: 'pending'
    };
    
    syncAssessmentToMedical(syncData);
  }, [questionQueue, answeredIds, answers]);

  useEffect(() => {
    if (showAIResponse) {
      const timer = setTimeout(() => {
        setShowAIResponse(false);
        if (currentStep < questionQueue.length - 1) {
          setCurrentStep(currentStep + 1);
        } else {
          calculateResult();
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showAIResponse, currentStep, questionQueue.length, calculateResult]);

  const handleAnswer = (answer: any) => {
    const newAnswers = { ...answers, [currentQuestion.id]: answer };
    setAnswers(newAnswers);
    setAnsweredIds(new Set([...answeredIds, currentQuestion.id]));
    setShowAIResponse(true);

    // Akinator逻辑：根据回答生成跟进问题
    if (currentQuestion.followUpQuestions) {
      const followUps = currentQuestion.followUpQuestions(answer, newAnswers);
      if (followUps.length > 0) {
        // 将跟进问题插入到队列中（在当前问题的后面）
        setQuestionQueue(prev => {
          const newQueue = [...prev];
          // 移除已存在的跟进问题（避免重复）
          const existingIds = new Set(newQueue.map(q => q.id));
          const uniqueFollowUps = followUps.filter(q => !existingIds.has(q.id));
          // 插入到当前位置之后
          newQueue.splice(currentStep + 1, 0, ...uniqueFollowUps);
          return newQueue;
        });
      }
    }
  };

  if (result) {
    return (
      <div className="space-y-6">
        <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              <div className="flex flex-col items-center gap-4">
                <div className="flex justify-center items-center gap-6">
                  {result.riskLevel === '低风险' && (
                    <>
                      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-[checkmarkPop_0.8s_ease-out]">
                        <CheckCircle2 className="w-12 h-12 text-green-600" />
                      </div>
                      {/* 友好插画 - 放松微笑的人 */}
                      <div className="animate-[breath_3s_ease-in-out_infinite]">
                        <div className="text-6xl">
                          😊
                        </div>
                      </div>
                    </>
                  )}
                  {result.riskLevel === '中等风险' && (
                    <>
                      <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center animate-[checkmarkPop_0.8s_ease-out]">
                        <AlertCircle className="w-12 h-12 text-yellow-600" />
                      </div>
                      {/* 友好插画 - 关注图标 */}
                      <div className="animate-[breath_3s_ease-in-out_infinite]">
                        <div className="text-6xl">
                          💡
                        </div>
                      </div>
                    </>
                  )}
                  {result.riskLevel === '高风险' && (
                    <>
                      {/* 使用温和的支持图标，移除红色警告图标 */}
                      <div className="animate-[breath_3s_ease-in-out_infinite]">
                        <div className="text-6xl">
                          🤝
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
                  评估完成！
                  {result.riskLevel === '低风险' && (
                    <div className="animate-[breath_3s_ease-in-out_infinite]">
                      <span className="text-3xl">✨</span>
                    </div>
                  )}
                </h3>
                <p className="text-xl text-gray-600">
                  {result.riskLevel === '高风险' ? (
                    <>我们建议您与医护团队密切合作，制定个性化的预防方案</>
                  ) : (
                    <>您的谵妄风险等级：<span className="font-bold text-blue-600">{result.riskLevel}</span></>
                  )}
                </p>
              </div>

              {/* 评估项目完成度 - Apple HIG风格 */}
              <AssessmentCompletionStatus />

              <div className="bg-white rounded-xl p-6 text-left">
                <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Bot className="w-5 h-5 text-blue-600" />
                  为您量身定制的预防建议
                </h4>
                <div className="space-y-3">
                  {result.personalizedAdvice.map((advice, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {index + 1}
                      </div>
                      <p className="text-sm text-gray-700">{advice}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 text-left">
                <h4 className="font-bold text-gray-900 mb-3">
                  📋 推荐您接下来做：
                </h4>
                <div className="space-y-2">
                  {result.nextSteps.map((step, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-purple-600" />
                      <span className="text-sm text-gray-700">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={() => {
                    setQuestionQueue(CORE_QUESTIONS);
                    setAnsweredIds(new Set());
                    setCurrentStep(0);
                    setAnswers({});
                    setResult(null);
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  重新评估
                </Button>
                <Button 
                  onClick={() => {
                    // 调用 onComplete 进入多模态评估步骤
                    if (onComplete && result) {
                      onComplete(result);
                    }
                  }}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500"
                >
                  继续其他评估项目
                </Button>
              </div>
              <div className="text-center mt-4">
                <Button 
                  onClick={() => window.location.href = '/health-diary'}
                  variant="ghost"
                  className="text-sm text-gray-500"
                >
                  或先查看健康日记
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isCalculating) {
    return (
      <Card className="border-2 border-blue-200 shadow-xl">
        <CardContent className="p-12">
          <div className="text-center space-y-8">
            {/* 增强的加载动画 */}
            <motion.div 
              className="flex justify-center relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
            >
              <div className="relative">
                <motion.div
                  className="w-20 h-20 border-4 border-blue-100 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                  className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-blue-600 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Bot className="w-10 h-10 text-blue-600" />
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                正在为您分析情况...
              </h3>
              <p className="text-gray-600 mb-6">
                基于循证医学为您生成个性化建议
              </p>

              {/* 分析步骤提示 */}
              <div className="space-y-2 max-w-md mx-auto text-left">
                <motion.div 
                  className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm text-gray-700">已收集您的回答</span>
                </motion.div>
                <motion.div 
                  className="flex items-center gap-3 p-3 bg-purple-100 rounded-lg"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <motion.div 
                    className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin flex-shrink-0"
                  />
                  <span className="text-sm text-gray-700 font-medium">生成个性化建议...</span>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!currentQuestion) {
    return (
      <Card>
        <CardContent className="p-12">
          <div className="text-center">
            <p className="text-gray-600">正在加载问题...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
      <div className="space-y-6">
        {/* 进度条 */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">评估进度</span>
            <span className="font-medium text-blue-600">
              {answeredIds.size}/{totalQuestions}
              {questionQueue.length > CORE_QUESTIONS.length && (
                <span className="text-xs text-purple-600 ml-1">
                  (正在深入了解您的情况...)
                </span>
              )}
            </span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>

      {/* 对话卡片 */}
      <Card className="border-2 border-blue-200">
        <CardContent className="p-6 space-y-6">
          {/* AI提问 */}
          <div className="flex gap-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4">
                <p className="text-gray-900 font-medium mb-2">
                  {currentQuestion.question}
                </p>
                <p className="text-sm text-gray-600">
                  💡 {currentQuestion.aiPrompt}
                </p>
              </div>
            </div>
          </div>

          {/* 用户回答 */}
          {showAIResponse && answers[currentQuestion.id] && (
            <div className="flex gap-4 justify-end animate-in slide-in-from-right">
              <div className="flex-1 max-w-md">
                <div className="bg-blue-600 text-white rounded-2xl p-4">
                  <p className="font-medium">
                    {typeof answers[currentQuestion.id] === 'number' 
                      ? `${answers[currentQuestion.id]}/10` 
                      : answers[currentQuestion.id]}
                  </p>
                </div>
              </div>
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-6 h-6 text-white" />
              </div>
            </div>
          )}

          {/* AI反馈 */}
          {showAIResponse && (
            <div className="flex gap-4 animate-in slide-in-from-left">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="bg-green-50 rounded-2xl p-4">
                  <p className="text-green-900 font-medium">
                    ✓ 已记录，继续下一题...
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 选项按钮 */}
          {!showAIResponse && (
            <div className="space-y-3">
              {currentQuestion.type === 'choice' && currentQuestion.options?.map((option, index) => (
                <Button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  variant="outline"
                  className="w-full justify-start text-left h-auto py-4 px-6 hover:bg-blue-50 hover:border-blue-400 transition-all"
                >
                  <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-3 text-sm font-bold">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span>{option}</span>
                </Button>
              ))}

              {currentQuestion.type === 'yesno' && (
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={() => handleAnswer('是')}
                    variant="outline"
                    className="h-16 text-lg hover:bg-green-50 hover:border-green-400"
                  >
                    ✓ 是
                  </Button>
                  <Button
                    onClick={() => handleAnswer('否')}
                    variant="outline"
                    className="h-16 text-lg hover:bg-red-50 hover:border-red-400"
                  >
                    ✗ 否
                  </Button>
                </div>
              )}

              {currentQuestion.type === 'scale' && (
                <div className="mt-6 mb-8">
                  <label className="block text-base font-semibold text-gray-900 mb-6">
                    术前焦虑程度 (0-10分)
                  </label>
                  <AnxietySlider 
                    value={answers[currentQuestion.id] ?? 5}
                    onChange={(value) => {
                      setAnswers({ ...answers, [currentQuestion.id]: value });
                    }}
                    onConfirm={(value) => handleAnswer(value)}
                  />
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 提示信息 */}
      <div className="text-center text-sm text-gray-500">
        💡 我们会根据您的回答，为您提供更精准的建议
      </div>
    </div>
  );
}


