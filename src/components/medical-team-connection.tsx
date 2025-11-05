"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, Bell, MessageCircle, AlertTriangle, CheckCircle2, 
  Clock, Send, Phone, Video, Stethoscope, Activity, Zap, Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  from: 'nurse' | 'doctor' | 'system';
  sender: string;
  content: string;
  time: string;
  type: 'info' | 'reminder' | 'alert' | 'feedback';
  read: boolean;
}

interface TeamMember {
  id: string;
  name: string;
  role: '主治医生' | '责任护士' | '麻醉医生';
  avatar: string;
  status: 'online' | 'offline';
  department: string;
}

const MOCK_TEAM: TeamMember[] = [
  {
    id: '1',
    name: '李医生',
    role: '主治医生',
    avatar: '👨‍⚕️',
    status: 'online',
    department: '骨科'
  },
  {
    id: '2',
    name: '张护士',
    role: '责任护士',
    avatar: '👩‍⚕️',
    status: 'online',
    department: '骨科'
  },
  {
    id: '3',
    name: '王医生',
    role: '麻醉医生',
    avatar: '👨‍⚕️',
    status: 'offline',
    department: '麻醉科'
  }
];

const MOCK_MESSAGES: Message[] = [
  {
    id: '1',
    from: 'nurse',
    sender: '张护士',
    content: '您好！我是您的责任护士张护士。术前准备期间有任何问题都可以联系我。',
    time: '今天 09:00',
    type: 'info',
    read: true
  },
  {
    id: '2',
    from: 'system',
    sender: '系统提醒',
    content: '✅ 您的风险评估已发送给医护团队，张护士已查看',
    time: '今天 09:15',
    type: 'info',
    read: true
  },
  {
    id: '3',
    from: 'nurse',
    sender: '张护士',
    content: '看到您的评估结果了。明天手术当天请记得带上眼镜和助听器哦！',
    time: '今天 10:30',
    type: 'reminder',
    read: false
  },
  {
    id: '4',
    from: 'system',
    sender: '智能提醒',
    content: '⚠️ 检测到您昨晚睡眠质量欠佳，已提醒医护团队关注',
    time: '今天 08:00',
    type: 'alert',
    read: false
  }
];

const memberCardVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (index: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: index * 0.1,
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1]
    }
  }),
  hover: {
    y: -4,
    scale: 1.02,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

const messageCardVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: index * 0.05,
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1]
    }
  }),
  hover: {
    y: -2,
    transition: {
      duration: 0.2,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

export function MedicalTeamConnection() {
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [unreadCount, setUnreadCount] = useState(2);
  const [showMessageDetail, setShowMessageDetail] = useState(false);

  const markAsRead = (messageId: string) => {
    setMessages(messages.map(msg => 
      msg.id === messageId ? { ...msg, read: true } : msg
    ));
    setUnreadCount(Math.max(0, unreadCount - 1));
  };

  const markAllAsRead = () => {
    setMessages(messages.map(msg => ({ ...msg, read: true })));
    setUnreadCount(0);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* 医护团队卡片 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 p-6 sm:p-8 border-b border-gray-100">
            <CardTitle className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900">我的医护团队</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    您的专属医护团队，7×24小时守护您的健康
                  </p>
                </div>
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 px-4 py-2 text-sm shadow-lg">
                  <motion.div
                    className="w-2 h-2 bg-white rounded-full mr-2"
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <Activity className="w-3 h-3 mr-1" />
                  实时连接
                </Badge>
              </motion.div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 sm:p-8">
            <div className="grid gap-4 sm:gap-6">
              {MOCK_TEAM.map((member, index) => (
                <motion.div
                  key={member.id}
                  custom={index}
                  variants={memberCardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  whileHover="hover"
                  className="flex items-center justify-between p-5 sm:p-6 bg-gradient-to-r from-white to-blue-50/50 rounded-2xl border-2 border-blue-100/50 hover:border-blue-200 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center gap-4 sm:gap-6">
                    <div className="relative">
                      <motion.div
                        className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center text-3xl sm:text-4xl shadow-md"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        {member.avatar}
                      </motion.div>
                      <motion.div
                        className={`absolute -bottom-1 -right-1 w-6 h-6 sm:w-7 sm:h-7 rounded-full border-3 border-white shadow-lg ${
                          member.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                        }`}
                        animate={
                          member.status === 'online' 
                            ? { scale: [1, 1.2, 1] }
                            : {}
                        }
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 text-lg sm:text-xl mb-1">
                        {member.name}
                      </h4>
                      <p className="text-sm sm:text-base text-gray-600 mb-1">
                        {member.role} · {member.department}
                      </p>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          member.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                        }`} />
                        <span className="text-xs sm:text-sm text-gray-500">
                          {member.status === 'online' ? '在线' : '离线'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 sm:gap-3">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-11 w-11 sm:h-12 sm:w-12 p-0 rounded-xl border-2 hover:border-blue-500 hover:bg-blue-50 transition-all duration-300"
                      >
                        <MessageCircle className="w-5 h-5 text-gray-600" />
                      </Button>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-11 w-11 sm:h-12 sm:w-12 p-0 rounded-xl border-2 hover:border-green-500 hover:bg-green-50 transition-all duration-300"
                        disabled={member.status === 'offline'}
                      >
                        <Phone className="w-5 h-5 text-gray-600" />
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 消息通知 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-purple-50 via-pink-50 to-rose-50 p-6 sm:p-8 border-b border-gray-100">
            <CardTitle className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Bell className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900">消息通知</h3>
                  {unreadCount > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Badge className="bg-red-500 text-white border-0 mt-2 shadow-lg">
                        {unreadCount}条新消息
                      </Badge>
                    </motion.div>
                  )}
                </div>
              </div>
              {unreadCount > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={markAllAsRead}
                  className="hover:bg-white/50 transition-all duration-300 rounded-xl"
                >
                  全部已读
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 sm:p-8 space-y-3 sm:space-y-4">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  custom={index}
                  variants={messageCardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  whileHover="hover"
                  className={`p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                    !message.read 
                      ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-md' 
                      : 'bg-white border-gray-100 hover:border-gray-200'
                  }`}
                  onClick={() => {
                    if (!message.read) markAsRead(message.id);
                  }}
                >
                  <div className="flex items-start gap-4">
                    <motion.div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md ${
                        message.type === 'alert' ? 'bg-gradient-to-br from-red-100 to-red-200' :
                        message.type === 'reminder' ? 'bg-gradient-to-br from-amber-100 to-yellow-200' :
                        message.type === 'feedback' ? 'bg-gradient-to-br from-green-100 to-emerald-200' :
                        'bg-gradient-to-br from-blue-100 to-indigo-200'
                      }`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      {message.type === 'alert' && <AlertTriangle className="w-6 h-6 text-red-600" />}
                      {message.type === 'reminder' && <Clock className="w-6 h-6 text-amber-600" />}
                      {message.type === 'feedback' && <CheckCircle2 className="w-6 h-6 text-green-600" />}
                      {message.type === 'info' && <Stethoscope className="w-6 h-6 text-blue-600" />}
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                        <span className="font-bold text-gray-900 text-base sm:text-lg">
                          {message.sender}
                        </span>
                        <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">
                          {message.time}
                        </span>
                      </div>
                      <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                        {message.content}
                      </p>
                      {!message.read && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="mt-3"
                        >
                          <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300 text-xs">
                            未读
                          </Badge>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>

      {/* 快速操作 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 p-6 sm:p-8 border-b border-gray-100">
            <CardTitle className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Send className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">快速联系</h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-1 leading-relaxed">
                  如遇生命危险，请立即拨打120或前往急诊。本功能非急救服务。
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 sm:p-8">
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              {/* Primary Action: 高优咨询 */}
              <motion.div
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button className="w-full h-24 sm:h-28 flex-col bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 hover:from-blue-600 hover:via-blue-700 hover:to-indigo-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl">
                  <AlertTriangle className="w-7 h-7 sm:w-8 sm:h-8 mb-2" />
                  <span className="font-semibold text-base sm:text-lg">高优咨询</span>
                  <span className="text-xs opacity-90 mt-1">紧急问题优先处理</span>
                </Button>
              </motion.div>
              
              {/* Secondary Action: 咨询问题 */}
              <motion.div
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="outline" 
                  className="w-full h-24 sm:h-28 flex-col bg-white border-2 border-blue-500 text-blue-600 hover:bg-blue-50 hover:border-blue-600 transition-all duration-300 rounded-2xl"
                >
                  <MessageCircle className="w-7 h-7 sm:w-8 sm:h-8 mb-2" />
                  <span className="font-semibold text-base sm:text-lg">咨询问题</span>
                  <span className="text-xs text-gray-500 mt-1">一般问题咨询</span>
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button variant="outline" className="w-full h-24 sm:h-28 flex-col bg-white border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 rounded-2xl">
                  <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8 mb-2 text-gray-600" />
                  <span className="font-semibold text-base sm:text-lg text-gray-900">状态反馈</span>
                  <span className="text-xs text-gray-500 mt-1">反馈当前状态</span>
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button variant="outline" className="w-full h-24 sm:h-28 flex-col bg-white border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 rounded-2xl">
                  <Video className="w-7 h-7 sm:w-8 sm:h-8 mb-2 text-gray-600" />
                  <span className="font-semibold text-base sm:text-lg text-gray-900">视频会诊</span>
                  <span className="text-xs text-gray-500 mt-1">远程医疗咨询</span>
                </Button>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 数据同步状态 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-2xl p-6 sm:p-8 border-2 border-blue-100/50 shadow-xl"
      >
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <motion.div
              className="w-4 h-4 bg-green-500 rounded-full"
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [1, 0.7, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <div>
              <p className="font-bold text-gray-900 text-base sm:text-lg">数据实时同步中</p>
              <p className="text-sm text-gray-600">您的记录已自动发送至医护团队</p>
            </div>
          </div>
          <Badge variant="outline" className="bg-white border-2 border-blue-300 px-4 py-2">
            <Activity className="w-4 h-4 mr-2 text-blue-600" />
            <span className="text-blue-600 font-semibold">实时监控</span>
          </Badge>
        </div>

        <div className="grid grid-cols-3 gap-4 sm:gap-6">
          {[
            { value: '5次', label: '医护查看', color: 'blue' },
            { value: '3条', label: '收到指导', color: 'green' },
            { value: '100%', label: '连接稳定', color: 'purple' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="bg-white rounded-xl p-4 sm:p-6 shadow-md text-center hover:shadow-lg transition-all duration-300"
            >
              <motion.div
                className={`text-2xl sm:text-3xl font-bold mb-2 ${
                  stat.color === 'blue' ? 'text-blue-600' :
                  stat.color === 'green' ? 'text-green-600' :
                  'text-purple-600'
                }`}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                {stat.value}
              </motion.div>
              <div className="text-xs sm:text-sm text-gray-600 font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}