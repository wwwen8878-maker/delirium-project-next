'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  BookOpen, 
  Users, 
  Heart,
  Brain,
  Shield,
  Lightbulb,
  AlertCircle,
  MessageCircle,
  Activity,
  Send,
  HelpCircle,
  LayoutList
} from 'lucide-react';
import Link from 'next/link';
import { SmartAssistant } from '@/components/smart-assistant';
import { Breadcrumb } from '@/components/breadcrumb';

// 术前时间线详细内容
const PREOP_TIMELINE = [
  {
    phase: '3days',
    title: '术前3天',
    subtitle: '知识准备阶段',
    icon: '📅',
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    tasks: [
      {
        title: '了解谵妄基础知识',
        description: '什么是谵妄？为什么需要预防？了解基本概念和重要性',
        icon: BookOpen,
        action: '打开AI助手学习',
        actionType: 'learn'
      },
      {
        title: '开始认知训练',
        description: '进行简单的记忆训练、注意力训练，保持大脑活跃',
        icon: Brain,
        action: '查看训练建议',
        actionType: 'learn'
      },
      {
        title: '调整作息规律',
        description: '保持规律的睡眠时间，避免熬夜，为手术做好身体准备',
        icon: Clock,
        action: '查看作息建议',
        actionType: 'learn'
      },
      {
        title: '营养准备',
        description: '保证充足营养，特别是蛋白质和维生素的摄入',
        icon: Heart,
        action: '查看营养建议',
        actionType: 'learn'
      }
    ],
    tips: [
      '建议与家属一起学习，互相提醒',
      '可以记录下重要的知识点',
      '有任何疑问随时咨询AI助手'
    ]
  },
  {
    phase: '2days',
    title: '术前2天',
    subtitle: '准备确认阶段',
    icon: '📋',
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    tasks: [
      {
        title: '熟悉术前准备清单',
        description: '确认术前检查完成情况，了解手术流程',
        icon: CheckCircle2,
        action: '查看准备清单',
        actionType: 'learn'
      },
      {
        title: '与医护团队沟通',
        description: '了解手术计划，确认术后护理安排，询问注意事项',
        icon: Users,
        action: '查看沟通要点',
        actionType: 'learn'
      },
      {
        title: '心理准备',
        description: '保持积极心态，减轻焦虑情绪，可进行深呼吸等放松练习',
        icon: Heart,
        action: '查看心理准备建议',
        actionType: 'learn'
      },
      {
        title: '家属准备',
        description: '确认陪护人员，准备住院用品，了解医院环境',
        icon: Users,
        action: '查看家属准备指南',
        actionType: 'learn'
      }
    ],
    tips: [
      '建议提前准备住院所需物品',
      '与医生确认所有疑问',
      '家属了解术后护理要点'
    ]
  },
  {
    phase: '1day',
    title: '术前1天',
    subtitle: '最后确认阶段',
    icon: '✅',
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    tasks: [
      {
        title: '确认准备清单',
        description: '再次确认所有术前准备是否完成，检查物品准备',
        icon: CheckCircle2,
        action: '核对清单',
        actionType: 'checklist'
      },
      {
        title: '复习预防要点',
        description: '回顾谵妄预防的关键措施，确保记住要点',
        icon: BookOpen,
        action: '复习知识',
        actionType: 'learn'
      },
      {
        title: '保证充足睡眠',
        description: '前一晚保证8小时充足睡眠，避免紧张失眠',
        icon: Clock,
        action: '查看助眠建议',
        actionType: 'learn'
      },
      {
        title: '准备术后支持',
        description: '确认术后早期活动计划，准备眼镜、助听器等辅助用品',
        icon: Activity,
        action: '查看支持建议',
        actionType: 'learn'
      }
    ],
    tips: [
      '睡前避免过度兴奋',
      '准备好术后所需物品',
      '保持平静心态'
    ]
  },
  {
    phase: 'today',
    title: '手术当天',
    subtitle: '实施阶段',
    icon: '🏥',
    color: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    tasks: [
      {
        title: '保持冷静',
        description: '按照医护指导配合，信任医护团队，保持平静',
        icon: Heart,
        action: '查看心理调节方法',
        actionType: 'learn'
      },
      {
        title: '积极配合',
        description: '配合术前准备，如实告知身体状况，遵守医嘱',
        icon: CheckCircle2,
        action: '了解配合要点',
        actionType: 'learn'
      },
      {
        title: '术后早期活动',
        description: '手术后尽早下床活动，促进恢复，降低谵妄风险',
        icon: Activity,
        action: '查看活动建议',
        actionType: 'track'
      },
      {
        title: '持续监测',
        description: '术后开始使用每日健康记录，及时发现问题',
        icon: Activity,
        action: '开始每日记录',
        actionType: 'track',
        link: '/symptom-tracker'
      }
    ],
    tips: [
      '术后第一天即可开始每日健康记录',
      '家属密切观察患者状态',
      '如有异常及时通知医护'
    ]
  }
];

const LEARNING_MODULES = [
  {
    id: 'intro',
    title: '谵妄基础认知',
    icon: '📚',
    description: '5分钟了解什么是谵妄',
    duration: '5分钟',
    color: 'from-blue-500 to-cyan-500',
    completed: false
  },
  {
    id: 'prevention',
    title: '预防行动指南',
    icon: '✅',
    description: '系统化的预防措施',
    duration: '8分钟',
    color: 'from-green-500 to-emerald-500',
    completed: false
  },
  {
    id: 'family',
    title: '家属协作',
    icon: '👨‍👩‍👧',
    description: '家属如何有效参与',
    duration: '10分钟',
    color: 'from-purple-500 to-pink-500',
    completed: false
  },
  {
    id: 'symptom',
    title: '症状识别',
    icon: '👁️',
    description: '掌握早期识别要点',
    duration: '6分钟',
    color: 'from-orange-500 to-red-500',
    completed: false
  }
];

export default function PreoperativeEducationPage() {
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);
  const [showAssistant, setShowAssistant] = useState(false);
  const [activeTab, setActiveTab] = useState<'learn' | 'timeline' | 'qa'>('learn');
  const [chatInput, setChatInput] = useState('');
  const [completedModules, setCompletedModules] = useState<Set<string>>(new Set());
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const openAssistant = (action: string) => {
    if (action === 'learn' || action === 'checklist') {
      setShowAssistant(true);
      setTimeout(() => {
        const event = new CustomEvent('openAIAssistant');
        window.dispatchEvent(event);
      }, 100);
    }
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    setShowAssistant(true);
    setTimeout(() => {
      const event = new CustomEvent('sendAIMessage', { detail: chatInput });
      window.dispatchEvent(event);
      setChatInput('');
    }, 100);
  };

  const handleModuleClick = (moduleId: string) => {
    const module = LEARNING_MODULES.find(m => m.id === moduleId);
    if (module) {
      setShowAssistant(true);
      setTimeout(() => {
        const event = new CustomEvent('openAIAssistant');
        window.dispatchEvent(event);
        setTimeout(() => {
          const messageEvent = new CustomEvent('sendAIMessage', { 
            detail: `我想学习：${module.title}。请以互动的方式，系统地为我讲解${module.description}，要实用易懂。` 
          });
          window.dispatchEvent(messageEvent);
        }, 200);
      }, 100);
    }
  };

  useEffect(() => {
    const handleModuleComplete = (e: CustomEvent) => {
      const moduleId = e.detail;
      setCompletedModules(prev => new Set([...prev, moduleId]));
    };

    window.addEventListener('moduleComplete', handleModuleComplete as EventListener);
    return () => {
      window.removeEventListener('moduleComplete', handleModuleComplete as EventListener);
    };
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 via-blue-50/30 to-white">
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="max-w-7xl mx-auto">
          {/* 面包屑导航 */}
          <Breadcrumb items={[{ label: '术前科普' }]} />

          <div className="flex flex-col lg:flex-row gap-6">
            {/* 左侧主内容区 */}
            <div className="flex-1 lg:w-2/3">
              {/* 页面标题 */}
              <div className="text-center mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
                <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/90 backdrop-blur-md border-2 border-blue-200 shadow-lg mb-6 hover:shadow-xl transition-all duration-300">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md animate-pulse">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-gray-800">
                    术前科普与准备指南
                  </span>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
                  术前谵妄预防
                  <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mt-2 animate-gradient">
                    专业引导流程
                  </span>
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  按照术前3天、2天、1天、手术当天的时间线，系统化完成谵妄预防准备工作
                </p>
              </div>

              {/* 重要提示 */}
              <Card className="mb-8 border-2 border-yellow-300 bg-gradient-to-r from-yellow-50 to-amber-50 shadow-lg hover:shadow-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 animate-bounce">
                      <AlertCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-yellow-900 mb-2 text-lg">重要提示</h3>
                      <p className="text-sm text-yellow-800 leading-relaxed">
                        本指南基于循证医学证据，旨在帮助您和家属做好术前准备。所有建议仅供参考，
                        请务必与您的主治医生讨论，制定个性化预防方案。术后跟踪请使用
                        <Link href="/symptom-tracker" className="underline font-medium mx-1 hover:text-yellow-900 transition-colors">
                          每日健康记录
                        </Link>
                        功能。
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 时间线 */}
              <div className="space-y-8 mb-12">
                {PREOP_TIMELINE.map((phase, index) => (
                  <Card
                    key={phase.phase}
                    ref={(el) => { sectionRefs.current[phase.phase] = el; }}
                    className={`border-2 ${phase.borderColor} ${phase.bgColor} hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 group animate-in fade-in slide-in-from-bottom-8 duration-700`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardContent className="p-6 md:p-8">
                      {/* 阶段标题 */}
                      <div className="flex items-start justify-between mb-8">
                        <div className="flex items-center gap-6 flex-1">
                          <div className={`w-20 h-20 bg-gradient-to-br ${phase.color} rounded-3xl flex items-center justify-center shadow-xl text-4xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                            {phase.icon}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-4 mb-3 flex-wrap">
                              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                                {phase.title}
                              </h2>
                              {index === 0 && (
                                <span className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full text-xs font-bold shadow-md animate-pulse">
                                  建议从这里开始
                                </span>
                              )}
                            </div>
                            <p className="text-lg text-gray-600 font-medium">{phase.subtitle}</p>
                          </div>
                        </div>
                      </div>

                      {/* 任务列表 */}
                      <div className="grid md:grid-cols-2 gap-5 mb-6">
                        {phase.tasks.map((task, taskIndex) => {
                          const IconComponent = task.icon;
                          return (
                            <Card
                              key={taskIndex}
                              className="bg-white/90 backdrop-blur-sm border-2 border-gray-200 hover:border-gray-400 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-[1.02] group/card cursor-pointer"
                              style={{ animationDelay: `${(index * 100) + (taskIndex * 50)}ms` }}
                            >
                              <CardContent className="p-6">
                                <div className="flex items-start gap-5">
                                  <div className={`w-14 h-14 bg-gradient-to-br ${phase.color} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover/card:scale-110 group-hover/card:rotate-6 transition-all duration-300`}>
                                    <IconComponent className="w-7 h-7 text-white" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-gray-900 mb-2.5 text-lg leading-tight">
                                      {task.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-5 leading-relaxed">
                                      {task.description}
                                    </p>
                                    {task.link ? (
                                      <Button
                                        asChild
                                        variant="outline"
                                        size="sm"
                                        className="w-full group/btn hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white hover:border-transparent transition-all duration-300"
                                      >
                                        <Link href={task.link}>
                                          {task.action}
                                          <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                                        </Link>
                                      </Button>
                                    ) : (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full group/btn hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white hover:border-transparent transition-all duration-300"
                                        onClick={() => openAssistant(task.actionType)}
                                      >
                                        {task.action}
                                        <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>

                      {/* 贴心提示 */}
                      <div className={`border-l-4 ${phase.borderColor} pl-6 py-4 bg-white/70 backdrop-blur-sm rounded-r-xl shadow-sm`}>
                        <div className="flex items-start gap-3 mb-3">
                          <Lightbulb className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5 animate-pulse" />
                          <span className="font-bold text-gray-900 text-base">贴心提示</span>
                        </div>
                        <ul className="space-y-2">
                          {phase.tips.map((tip, tipIndex) => (
                            <li 
                              key={tipIndex} 
                              className="text-sm text-gray-700 flex items-start gap-3 leading-relaxed"
                            >
                              <span className="text-blue-500 mt-1.5 font-bold">•</span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* 快速入口卡片 */}
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                <Link href="/ai-assessment" className="group">
                  <Card className="h-full border-2 border-blue-200 hover:border-blue-400 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                        <Brain className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="font-bold text-gray-900 mb-2 text-lg">AI风险评估</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        约5分钟评估您的谵妄风险
                      </p>
                      <Button variant="outline" size="sm" className="w-full group-hover:bg-blue-500 group-hover:text-white transition-colors">
                        开始评估
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/symptom-tracker" className="group">
                  <Card className="h-full border-2 border-green-200 hover:border-green-400 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                        <Activity className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="font-bold text-gray-900 mb-2 text-lg">每日健康记录</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        术后每天1分钟记录，持续跟踪
                      </p>
                      <Button variant="outline" size="sm" className="w-full group-hover:bg-green-500 group-hover:text-white transition-colors">
                        开始记录
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </CardContent>
                  </Card>
                </Link>

                <Card
                  className="h-full border-2 border-purple-200 hover:border-purple-400 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group"
                  onClick={() => {
                    setShowAssistant(true);
                    setTimeout(() => {
                      const event = new CustomEvent('openAIAssistant');
                      window.dispatchEvent(event);
                    }, 100);
                  }}
                >
                  <CardContent className="p-6 text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                      <MessageCircle className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2 text-lg">AI科普助手</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      随时提问，获取专业解答
                    </p>
                    <Button variant="outline" size="sm" className="w-full group-hover:bg-purple-500 group-hover:text-white transition-colors">
                      打开助手
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* 总结卡片 */}
              <Card className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-[1.02]">
                <CardContent className="p-10 text-center">
                  <h2 className="text-4xl font-bold mb-8">记住三个关键</h2>
                  <div className="grid md:grid-cols-3 gap-8 mt-8">
                    <div className="transform hover:scale-110 transition-all duration-300">
                      <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                        <Shield className="w-10 h-10" />
                      </div>
                      <h3 className="font-bold text-xl mb-3">术前准备</h3>
                      <p className="text-white/90 text-sm leading-relaxed">
                        系统化学习，做好知识储备
                      </p>
                    </div>
                    <div className="transform hover:scale-110 transition-all duration-300">
                      <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                        <Activity className="w-10 h-10" />
                      </div>
                      <h3 className="font-bold text-xl mb-3">术后监测</h3>
                      <p className="text-white/90 text-sm leading-relaxed">
                        每日记录，及时发现问题
                      </p>
                    </div>
                    <div className="transform hover:scale-110 transition-all duration-300">
                      <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                        <Users className="w-10 h-10" />
                      </div>
                      <h3 className="font-bold text-xl mb-3">医护协作</h3>
                      <p className="text-white/90 text-sm leading-relaxed">
                        与医护团队保持沟通
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 右侧固定边栏 */}
            <div className="lg:w-80 lg:sticky lg:top-6 h-fit space-y-6">
              {/* 导航标签 */}
              <Card className="border-2 border-gray-200 shadow-lg">
                <CardContent className="p-0">
                  <div className="flex border-b border-gray-200">
                    <button
                      onClick={() => setActiveTab('qa')}
                      className={`flex-1 px-4 py-3 text-sm font-medium transition-all duration-300 ${
                        activeTab === 'qa'
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <HelpCircle className="w-4 h-4" />
                        问答
                      </div>
                    </button>
                    <button
                      onClick={() => setActiveTab('timeline')}
                      className={`flex-1 px-4 py-3 text-sm font-medium transition-all duration-300 border-x border-gray-200 ${
                        activeTab === 'timeline'
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <LayoutList className="w-4 h-4" />
                        时间线
                      </div>
                    </button>
                    <button
                      onClick={() => setActiveTab('learn')}
                      className={`flex-1 px-4 py-3 text-sm font-medium transition-all duration-300 ${
                        activeTab === 'learn'
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        学习
                      </div>
                    </button>
                  </div>
                </CardContent>
              </Card>

              {/* 系统化学习 */}
              {activeTab === 'learn' && (
                <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 shadow-xl animate-in fade-in slide-in-from-right duration-500">
                  <CardContent className="p-6">
                    <div className="text-center mb-6 space-y-3">
                      <div className="flex justify-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                          <BookOpen className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">系统化学习</h3>
                      <p className="text-sm text-gray-600">
                        AI陪伴引导，系统掌握谵妄预防知识
                      </p>
                      
                      {/* 学习进度 */}
                      <div className="mt-5">
                        <div className="bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
                          <div 
                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-1000 ease-out shadow-sm"
                            style={{ width: `${(completedModules.size / LEARNING_MODULES.length) * 100}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-600 mt-2 font-medium">
                          已完成 {completedModules.size}/{LEARNING_MODULES.length} 个模块
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {LEARNING_MODULES.map((module, index) => {
                        const isCompleted = completedModules.has(module.id);
                        return (
                          <button
                            key={module.id}
                            onClick={() => handleModuleClick(module.id)}
                            className="w-full group animate-in fade-in slide-in-from-right duration-500"
                            style={{ animationDelay: `${index * 100}ms` }}
                          >
                            <div className={`relative bg-gradient-to-r ${module.color} p-5 rounded-xl text-white text-left hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.03] overflow-hidden`}>
                              {/* 背景动画 */}
                              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                              
                              {/* 完成标记 */}
                              {isCompleted && (
                                <div className="absolute top-3 right-3 bg-white/30 backdrop-blur-sm rounded-full p-1.5 animate-in zoom-in duration-300">
                                  <CheckCircle2 className="w-5 h-5 text-white" />
                                </div>
                              )}
                              
                              <div className="relative flex items-start justify-between gap-3">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <span className="text-3xl transform group-hover:scale-110 transition-transform">{module.icon}</span>
                                    <div>
                                      <h4 className="font-bold text-lg">{module.title}</h4>
                                      {isCompleted && (
                                        <span className="text-xs bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full mt-1 inline-block animate-in fade-in">
                                          已完成 ✓
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <p className="text-sm text-white/90 mb-3 leading-relaxed">
                                    {module.description}
                                  </p>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium">
                                      ⏱️ {module.duration}
                                    </span>
                                    <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium">
                                      🤖 AI互动
                                    </span>
                                  </div>
                                </div>
                                <div className="text-2xl opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                                  →
                                </div>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* 时间线导航 */}
              {activeTab === 'timeline' && (
                <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 shadow-xl animate-in fade-in slide-in-from-right duration-500">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <LayoutList className="w-5 h-5 text-green-600" />
                      时间线导航
                    </h3>
                    <div className="space-y-3">
                      {PREOP_TIMELINE.map((phase, index) => (
                        <button
                          key={phase.phase}
                          onClick={() => {
                            sectionRefs.current[phase.phase]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          }}
                          className="w-full text-left p-4 rounded-xl bg-white/70 hover:bg-white border-2 border-gray-200 hover:border-green-400 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 bg-gradient-to-br ${phase.color} rounded-xl flex items-center justify-center text-2xl shadow-md group-hover:scale-110 transition-transform`}>
                              {phase.icon}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold text-gray-900">{phase.title}</h4>
                              <p className="text-xs text-gray-600 mt-0.5">{phase.subtitle}</p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* 问答输入 */}
              {activeTab === 'qa' && (
                <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-xl animate-in fade-in slide-in-from-right duration-500">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <HelpCircle className="w-5 h-5 text-blue-600" />
                      快速问答
                    </h3>
                    <div className="space-y-4">
                      <div className="bg-white/70 rounded-xl p-4 border-2 border-blue-200">
                        <textarea
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage();
                            }
                          }}
                          placeholder="输入您的问题..."
                          className="w-full min-h-[100px] p-3 border-none bg-transparent resize-none focus:outline-none text-sm text-gray-700 placeholder-gray-400"
                        />
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200">
                          <p className="text-xs text-gray-500">
                            按Enter 发送・Shift + Enter 换行
                          </p>
                          <Button
                            onClick={handleSendMessage}
                            disabled={!chatInput.trim()}
                            size="sm"
                            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-110"
                          >
                            <Send className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* AI助手组件 */}
      <SmartAssistant />
    </main>
  );
}
