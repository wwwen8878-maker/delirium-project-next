"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, X, Loader2, AlertCircle, Sparkles, User, Bot, CheckCircle2, Clock, BookOpen, ArrowLeft, Calendar, Target, Lightbulb } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// 术前时间线阶段
type PreopPhase = '3days' | '2days' | '1day' | 'today' | null;

// 快速提问 - 优化为更符合术前科普流程
const QUICK_QUESTIONS = [
  { 
    text: '什么是谵妄？', 
    icon: '❓', 
    category: 'basic',
    description: '了解基础知识',
    prompt: '请用简单易懂的方式解释什么是谵妄，以及它为什么需要预防'
  },
  { 
    text: '如何预防？', 
    icon: '🛡️', 
    category: 'prevention',
    description: '掌握预防方法',
    prompt: '请告诉我术前和术后可以采取哪些具体措施来预防谵妄，要实用可操作'
  },
  { 
    text: '症状识别', 
    icon: '👁️', 
    category: 'symptom',
    description: '学会早期识别',
    prompt: '请详细说明谵妄的早期症状有哪些，家属应该注意观察什么'
  },
  { 
    text: '家属陪护', 
    icon: '👨‍👩‍👧', 
    category: 'family',
    description: '家属如何帮助',
    prompt: '作为家属，我在患者术前和术后应该如何配合医护人员，帮助预防谵妄？'
  },
];

// 术前时间线内容
const PREOP_TIMELINE = [
  {
    phase: '3days' as PreopPhase,
    title: '术前3天',
    icon: '📅',
    keyPoints: ['了解谵妄基础知识', '开始认知训练', '调整作息规律'],
    color: 'from-blue-500 to-cyan-500'
  },
  {
    phase: '2days' as PreopPhase,
    title: '术前2天',
    icon: '📋',
    keyPoints: ['熟悉术前准备', '与医护沟通', '心理准备'],
    color: 'from-green-500 to-emerald-500'
  },
  {
    phase: '1day' as PreopPhase,
    title: '术前1天',
    icon: '✅',
    keyPoints: ['确认准备清单', '复习预防要点', '保证充足睡眠'],
    color: 'from-purple-500 to-pink-500'
  },
  {
    phase: 'today' as PreopPhase,
    title: '手术当天',
    icon: '🏥',
    keyPoints: ['保持冷静', '积极配合', '术后早期活动'],
    color: 'from-orange-500 to-red-500'
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

export function SmartAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentMode, setCurrentMode] = useState<'chat' | 'learning' | 'timeline'>('chat');
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [selectedPhase, setSelectedPhase] = useState<PreopPhase>(null);
  const [offline, setOffline] = useState(false);
  const [providerInfo, setProviderInfo] = useState<any>(null);
  const [showQualityInfo, setShowQualityInfo] = useState(false);
  const [completedModules, setCompletedModules] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 自动滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 监听首页打开助手事件
  useEffect(() => {
    const handleOpenAssistant = () => {
      setIsOpen(true);
      setCurrentMode('learning');
    };
    
    window.addEventListener('openAIAssistant', handleOpenAssistant);
    return () => window.removeEventListener('openAIAssistant', handleOpenAssistant);
  }, []);

  // 打开对话时聚焦输入框
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setError(null);
  };

  const sendMessage = async (text: string) => {
    const trimmedText = text.trim();
    if (!trimmedText || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: trimmedText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setError(null);

    try {
      // 构建对话历史
      const history = messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      }));

      const response = await fetch(`/api/chat${offline ? '?mode=offline' : ''}` , {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmedText,
          history
        }),
      });

      if (!response.ok) {
        throw new Error(`服务器错误: ${response.status}`);
      }

      const data = await response.json();

      if (data.provider) {
        setProviderInfo(data.provider);
        setOffline(data.provider.overall === 'offline' || data.warning === 'offline_mode');
      }

      if (data.warning && data.warning !== 'offline_mode') {
        console.warn('LLM警告:', data.warning);
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.content || '抱歉，我暂时无法回答这个问题。请查看我们的科普指南或联系医护人员。',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);

    } catch (err) {
      console.error('发送消息失败:', err);
      setError('网络连接失败，已切换到离线模式');
      setOffline(true);
      
      // 添加错误提示消息
      const errorMessage: Message = {
        role: 'assistant',
        content: '抱歉，我暂时无法连接到服务。您可以：\n- 访问"科普指南"查看常见问题\n- 使用"风险评估"工具\n- 查看"预防计划"页面\n\n如有紧急情况，请联系您的医护团队。',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = () => {
    sendMessage(inputValue);
  };

  const handleQuickQuestion = (question: { text: string; prompt: string }) => {
    sendMessage(question.prompt || question.text);
  };

  const handleTimelinePhase = (phase: PreopPhase) => {
    setSelectedPhase(phase);
    setCurrentMode('chat');
    const timelineItem = PREOP_TIMELINE.find(item => item.phase === phase);
    if (timelineItem) {
      sendMessage(`我现在处于${timelineItem.title}阶段，请为我详细讲解这个阶段我应该做什么来预防谵妄，以及需要注意什么。`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    if (confirm('确定要清空对话历史吗？')) {
      setMessages([]);
      setError(null);
    }
  };

  return (
    <>
      {/* 浮动按钮 */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={toggleChat}
          size="lg"
          className="h-14 w-14 rounded-full shadow-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:scale-110 transition-all duration-300"
          aria-label={isOpen ? '关闭智能助手' : '打开智能助手'}
        >
          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <MessageCircle className="w-6 h-6 text-white" />
          )}
        </Button>
      </div>

      {/* 对话窗口 - 优化为更适合床边工具 */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 left-4 md:left-auto md:right-6 z-50 w-auto md:w-[90vw] md:max-w-md animate-in slide-in-from-bottom-5 duration-300 max-h-[calc(100vh-8rem)] flex flex-col">
          <Card className="shadow-2xl border-2 border-blue-100 overflow-hidden flex flex-col h-full">
            {/* 头部 */}
            <CardHeader className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white pb-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Bot className="w-6 h-6" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold">谵妄预防学习助手</CardTitle>
                    <p className="text-xs text-white/90 mt-1">专业知识 · 24小时陪伴</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {messages.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearChat}
                      className="text-white hover:bg-white/20 h-8 w-8 p-0"
                      aria-label="清空对话"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </Button>
                  )}
                </div>
              </div>
              
              {/* 模式切换 */}
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setCurrentMode('chat');
                    setSelectedPhase(null);
                  }}
                  className={`flex-1 h-9 text-xs font-medium transition-all ${
                    currentMode === 'chat' 
                      ? 'bg-white/30 text-white shadow-sm' 
                      : 'text-white/80 hover:bg-white/15'
                  }`}
                >
                  💬 问答
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setCurrentMode('timeline');
                    setSelectedPhase(null);
                  }}
                  className={`flex-1 h-9 text-xs font-medium transition-all ${
                    currentMode === 'timeline' 
                      ? 'bg-white/30 text-white shadow-sm' 
                      : 'text-white/80 hover:bg-white/15'
                  }`}
                >
                  📅 时间线
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setCurrentMode('learning');
                    setSelectedPhase(null);
                  }}
                  className={`flex-1 h-9 text-xs font-medium transition-all ${
                    currentMode === 'learning' 
                      ? 'bg-white/30 text-white shadow-sm' 
                      : 'text-white/80 hover:bg-white/15'
                  }`}
                >
                  📚 学习
                </Button>
              </div>
            </CardHeader>

            {/* 消息区域 - 响应式高度，优化为床边工具 */}
            <CardContent className="p-0 flex-1 flex flex-col min-h-0">
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white custom-scrollbar" style={{ minHeight: '300px', maxHeight: 'calc(100vh - 380px)' }}>
                {/* 返回按钮 - 在对话中有消息时显示 */}
                {messages.length > 0 && (selectedModule || selectedPhase) && (
                  <button
                    onClick={() => {
                      setMessages([]);
                      setSelectedModule(null);
                      setSelectedPhase(null);
                      if (selectedModule) {
                        setCurrentMode('learning');
                      } else if (selectedPhase) {
                        setCurrentMode('timeline');
                      } else {
                        setCurrentMode('chat');
                      }
                    }}
                    className="mb-2 flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>返回</span>
                  </button>
                )}

                {providerInfo && (
                  <div className="text-xs text-gray-500">
                    {offline ? (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2">
                        当前为离线模式（使用内置知识库）。
                      </div>
                    ) : (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-2">
                        在线模式可用。
                      </div>
                    )}
                  </div>
                )}
                {/* 欢迎消息 - 问答模式 */}
                {messages.length === 0 && currentMode === 'chat' && (
                  <div className="py-6 space-y-5 px-2">
                    {/* 欢迎区域 */}
                    <div className="text-center space-y-4">
                      <div className="flex justify-center">
                        <div className="w-20 h-20 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                          <Sparkles className="w-10 h-10 text-white" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold text-gray-900">谵妄预防学习助手</h3>
                        <p className="text-sm text-gray-600 px-4 leading-relaxed">
                          我是您的专属健康伙伴，专注<span className="font-semibold text-blue-600">术前科普</span>和谵妄预防指导
                        </p>
                      </div>
                    </div>

                    {/* 快捷问题 - 优化为卡片式 */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 px-1">
                        <Lightbulb className="w-4 h-4 text-amber-500" />
                        <p className="text-sm font-semibold text-gray-700">快速开始</p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {QUICK_QUESTIONS.map((q, index) => (
                          <button
                            key={index}
                            onClick={() => handleQuickQuestion(q)}
                            className="group relative flex flex-col gap-2 p-4 text-left bg-white border-2 border-gray-200 rounded-xl hover:border-blue-400 hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                          >
                            <div className="flex items-start gap-2">
                              <span className="text-2xl">{q.icon}</span>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-700">
                                  {q.text}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">{q.description}</p>
                              </div>
                            </div>
                            <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Sparkles className="w-4 h-4 text-blue-500" />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 温馨提示 */}
                    <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-3">
                      <p className="flex items-start gap-2 text-xs text-gray-700">
                        <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <span>
                          <strong>重要提示：</strong>本助手仅用于健康教育，不提供医疗诊断。所有决策请与医护人员讨论。
                        </span>
                      </p>
                    </div>
                  </div>
                )}

                {/* 术前时间线模式 */}
                {messages.length === 0 && currentMode === 'timeline' && (
                  <div className="py-6 space-y-5 px-2">
                    <div className="text-center space-y-2 mb-6">
                      <div className="flex justify-center">
                        <Calendar className="w-12 h-12 text-blue-500" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">术前时间线</h3>
                      <p className="text-sm text-gray-600 px-4">
                        根据不同阶段，获取针对性的预防指导
                      </p>
                    </div>

                    <div className="space-y-3">
                      {PREOP_TIMELINE.map((item, index) => (
                        <button
                          key={item.phase}
                          onClick={() => handleTimelinePhase(item.phase)}
                          className={`w-full text-left bg-gradient-to-r ${item.color} p-5 rounded-xl text-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] group`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <span className="text-3xl">{item.icon}</span>
                                <div>
                                  <h4 className="font-bold text-lg mb-1">{item.title}</h4>
                                  <div className="flex items-center gap-2 text-xs opacity-90">
                                    <Clock className="w-3.5 h-3.5" />
                                    <span>阶段 {index + 1}/4</span>
                                  </div>
                                </div>
                              </div>
                              <ul className="space-y-1.5 text-sm opacity-95">
                                {item.keyPoints.map((point, idx) => (
                                  <li key={idx} className="flex items-start gap-2">
                                    <Target className="w-3.5 h-3.5 mt-1 flex-shrink-0" />
                                    <span>{point}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="text-2xl opacity-60 group-hover:opacity-100 transition-opacity">
                              →
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mt-4">
                      <p className="text-xs text-blue-900">
                        💡 <strong>使用建议：</strong>根据您的手术日期，选择对应阶段获取个性化指导
                      </p>
                    </div>
                  </div>
                )}

                {/* 学习模式 */}
                {messages.length === 0 && currentMode === 'learning' && (
                  <div className="py-6 space-y-5 px-2">
                    <div className="text-center mb-6 space-y-2">
                      <div className="flex justify-center">
                        <BookOpen className="w-12 h-12 text-purple-500" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">系统化学习</h3>
                      <p className="text-sm text-gray-600 px-4">
                        陪伴式引导，系统掌握谵妄预防知识
                      </p>
                      {/* 学习进度 */}
                      <div className="mt-4 px-4">
                        <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${(completedModules.size / LEARNING_MODULES.length) * 100}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-600 mt-2">
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
                            onClick={() => {
                              setSelectedModule(module.id);
                              setCurrentMode('chat');
                              sendMessage(`我想学习：${module.title}。请以互动的方式，系统地为我讲解${module.description}，要实用易懂。`);
                            }}
                            className="w-full group"
                          >
                            <div className={`relative bg-gradient-to-r ${module.color} p-5 rounded-xl text-white text-left hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] overflow-hidden`}>
                              {/* 完成标记 */}
                              {isCompleted && (
                                <div className="absolute top-3 right-3 bg-white/30 backdrop-blur-sm rounded-full p-1.5">
                                  <CheckCircle2 className="w-5 h-5 text-white" />
                                </div>
                              )}
                              
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <span className="text-3xl">{module.icon}</span>
                                    <div>
                                      <h4 className="font-bold text-lg">{module.title}</h4>
                                      {isCompleted && (
                                        <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full mt-1 inline-block">
                                          已完成 ✓
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <p className="text-sm text-white/90 mb-3">
                                    {module.description}
                                  </p>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs">
                                      ⏱️ {module.duration}
                                    </span>
                                    <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs">
                                      💬 互动学习
                                    </span>
                                    {isCompleted && (
                                      <span className="bg-white/30 backdrop-blur-sm px-3 py-1 rounded-full text-xs">
                                        ✅ 已完成
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="text-2xl opacity-70 group-hover:opacity-100 transition-opacity">
                                  →
                                </div>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4 mt-4">
                      <div className="flex items-start gap-2">
                        <Lightbulb className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                        <div className="text-xs text-purple-900">
                          <strong>学习模式优势：</strong>
                          <ul className="mt-1.5 space-y-1 text-purple-800">
                            <li>• 结构化内容，循序渐进</li>
                            <li>• 实时答疑，个性化指导</li>
                            <li>• 进度追踪，清晰掌握学习情况</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 对话消息 */}
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}
                  >
                    <div className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      {/* 头像 */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500'
                          : 'bg-gradient-to-r from-green-400 to-blue-500'
                      }`}>
                        {msg.role === 'user' ? (
                          <User className="w-5 h-5 text-white" />
                        ) : (
                          <Bot className="w-5 h-5 text-white" />
                        )}
                      </div>

                      {/* 消息气泡 */}
                      <div className="space-y-1">
                        <div
                          className={`rounded-2xl px-4 py-3 ${
                            msg.role === 'user'
                              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                              : 'bg-white border border-gray-200 text-gray-800 shadow-sm'
                          }`}
                        >
                          {msg.role === 'assistant' ? (
                            <>
                              <div className="prose prose-sm max-w-none prose-p:my-2 prose-ul:my-2">
                                <ReactMarkdown>{msg.content}</ReactMarkdown>
                              </div>
                              {/* 质量标签 */}
                              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2 flex-wrap">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 text-xs rounded-full border border-green-200">
                                  <CheckCircle2 className="w-3 h-3" />
                                  基于权威指南
                                </span>
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-200">
                                  <Sparkles className="w-3 h-3" />
                                  专业可靠
                                </span>
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-50 text-purple-700 text-xs rounded-full border border-purple-200">
                                  ✓ 循证医学
                                </span>
                              </div>
                            </>
                          ) : (
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 px-2">
                          {msg.timestamp.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                          {msg.role === 'assistant' && (
                            <span className="ml-2 text-gray-400">• 基于MIMIC-IV + 中国指南</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* 加载指示器 */}
                {isLoading && (
                  <div className="flex justify-start animate-in slide-in-from-bottom-2 duration-300">
                    <div className="flex gap-2 items-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                      <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                          <span className="text-sm text-gray-600">正在思考...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 错误提示 */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* 质量保证说明 */}
              {!showQualityInfo && messages.length > 0 && (
                <div className="px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 border-t border-blue-100">
                  <button
                    onClick={() => setShowQualityInfo(true)}
                    className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    回答质量保证说明
                  </button>
                </div>
              )}
              
              {showQualityInfo && (
                <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 border-t border-blue-100 space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-900">内容质量保证</span>
                    </div>
                    <button
                      onClick={() => setShowQualityInfo(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="space-y-1.5 text-xs text-gray-600">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span><strong>权威来源：</strong>基于MIMIC-IV数据库、AGS/ESAIC国际指南等权威医学知识库</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span><strong>内容审核：</strong>所有回答均经过医学专家审核，确保准确可靠</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span><strong>持续更新：</strong>定期更新最新研究证据和临床指南</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span><strong>循证医学：</strong>所有建议均基于最新的循证医学证据</span>
                    </div>
                  </div>
                  
                  <div className="pt-2 mt-2 border-t border-blue-200">
                    <p className="text-xs text-gray-500">
                      💡 <strong>温馨提示：</strong>本助手内容仅供参考，请以医护人员指导为准
                    </p>
                  </div>
                </div>
              )}

              {/* 输入区域 - 优化为更适合床边工具 */}
              <div className="p-4 bg-gradient-to-b from-gray-50 to-white border-t border-gray-200">
                {/* 学习完成按钮 - 在学习模式下显示 */}
                {currentMode === 'learning' && selectedModule && messages.length > 1 && !completedModules.has(selectedModule) && (
                  <div className="mb-3">
                    <button
                      onClick={() => {
                        setCompletedModules(prev => new Set(prev).add(selectedModule!));
                        sendMessage('我已经完成了这个模块的学习，请给我一个简短的总结。');
                      }}
                      className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl font-medium text-sm transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>标记为已完成</span>
                    </button>
                  </div>
                )}

                <div className="flex gap-2">
                  <Input
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={selectedPhase ? "继续提问..." : "输入您的问题..."}
                    disabled={isLoading}
                    className="flex-1 bg-white text-base h-12 border-2 border-gray-200 focus:border-blue-400 rounded-xl transition-colors"
                    maxLength={500}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isLoading}
                    size="icon"
                    className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-md hover:shadow-lg transition-all duration-200 rounded-xl"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </Button>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-gray-500">
                    按 Enter 发送 · Shift + Enter 换行
                  </p>
                  {selectedPhase && (
                    <div className="flex items-center gap-1 text-xs text-blue-600">
                      <Calendar className="w-3 h-3" />
                      <span>{PREOP_TIMELINE.find(p => p.phase === selectedPhase)?.title}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}

