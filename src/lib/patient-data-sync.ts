/**
 * 患者端数据同步模块
 * 将患者数据同步到医护端（通过LocalStorage）
 */

export interface PatientAssessmentData {
  patientId: string;
  patientName: string;
  age: number;
  gender: string;
  surgeryType: string;
  timestamp: string;
  riskScore: number;
  riskLevel: '低风险' | '中等风险' | '高风险';
  factors: Array<{
    name: string;
    value: any;
    weight: number;
    isRisk: boolean;
  }>;
  personalizedAdvice: string[];
  nextSteps: string[];
  status: 'pending' | 'reviewed' | 'intervened';
}

export interface SymptomRecord {
  patientId: string;
  patientName: string;
  date: string;
  timestamp: string;
  cognition: number; // 1-5
  sleep: number;
  mood: number;
  appetite: number;
  notes: string;
  aiAnalysis: string;
  riskLevel: 'normal' | 'warning' | 'alert';
}

export interface MedicalMessage {
  id: string;
  patientId: string;
  from: 'nurse' | 'doctor' | 'system';
  sender: string;
  content: string;
  timestamp: string;
  type: 'info' | 'reminder' | 'alert' | 'feedback';
  read: boolean;
}

/**
 * 同步患者评估数据到医护端
 */
export function syncAssessmentToMedical(data: PatientAssessmentData): void {
  try {
    const key = 'medical_patient_assessments';
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    
    // 避免重复
    const index = existing.findIndex((item: PatientAssessmentData) => 
      item.patientId === data.patientId && item.timestamp === data.timestamp
    );
    
    if (index === -1) {
      existing.push(data);
      localStorage.setItem(key, JSON.stringify(existing));
      
      // 触发事件通知医护端
      const event = new CustomEvent('newPatientAssessment', { detail: data });
      window.dispatchEvent(event);
      
      // 评估数据已同步至医护端
    }
  } catch (error) {
    console.error('❌ 同步评估数据失败:', error);
  }
}

/**
 * 同步症状记录到医护端
 */
export function syncSymptomToMedical(data: SymptomRecord): void {
  try {
    const key = 'medical_symptom_records';
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    existing.push(data);
    localStorage.setItem(key, JSON.stringify(existing));
    
    // 如果是预警级别，触发紧急通知
    if (data.riskLevel === 'alert') {
      const alertKey = 'medical_alerts';
      const alerts = JSON.parse(localStorage.getItem(alertKey) || '[]');
      alerts.push({
        id: `alert_${Date.now()}`,
        patientId: data.patientId,
        patientName: data.patientName,
        type: 'symptom_alert',
        severity: 'high',
        content: `${data.patientName} 症状异常：${data.aiAnalysis}`,
        timestamp: data.timestamp,
        read: false
      });
      localStorage.setItem(alertKey, JSON.stringify(alerts));
      
      // 触发紧急事件
      const event = new CustomEvent('symptomAlert', { detail: data });
      window.dispatchEvent(event);
      
      // 症状预警已触发
    } else {
      // 普通记录也通知
      const event = new CustomEvent('newSymptomRecord', { detail: data });
      window.dispatchEvent(event);
      
      // 症状记录已同步至医护端
    }
  } catch (error) {
    console.error('❌ 同步症状记录失败:', error);
  }
}

/**
 * 患者端获取医护消息
 */
export function getMedicalMessages(patientId: string): MedicalMessage[] {
  try {
    const key = `medical_messages_${patientId}`;
    const messages = JSON.parse(localStorage.getItem(key) || '[]');
    return messages;
  } catch (error) {
    console.error('❌ 获取医护消息失败:', error);
    return [];
  }
}

/**
 * 标记消息已读
 */
export function markMessageAsRead(patientId: string, messageId: string): void {
  try {
    const key = `medical_messages_${patientId}`;
    const messages = JSON.parse(localStorage.getItem(key) || '[]');
    const updated = messages.map((msg: MedicalMessage) =>
      msg.id === messageId ? { ...msg, read: true } : msg
    );
    localStorage.setItem(key, JSON.stringify(updated));
  } catch (error) {
    console.error('❌ 标记消息失败:', error);
  }
}

/**
 * 发送求助消息到医护端
 */
export function sendHelpRequest(patientId: string, patientName: string, message: string): void {
  try {
    const key = 'medical_help_requests';
    const requests = JSON.parse(localStorage.getItem(key) || '[]');
    requests.push({
      id: `help_${Date.now()}`,
      patientId,
      patientName,
      message,
      timestamp: new Date().toISOString(),
      status: 'pending',
      priority: 'high'
    });
    localStorage.setItem(key, JSON.stringify(requests));
    
    // 触发事件
    const event = new CustomEvent('newHelpRequest', { 
      detail: { patientId, patientName, message } 
    });
    window.dispatchEvent(event);
    
    // 求助请求已发送至医护端
  } catch (error) {
    console.error('❌ 发送求助失败:', error);
  }
}

/**
 * 获取患者的完整数据（用于医护端）
 */
export function getPatientFullData(patientId: string) {
  const assessments = JSON.parse(localStorage.getItem('medical_patient_assessments') || '[]');
  const symptoms = JSON.parse(localStorage.getItem('medical_symptom_records') || '[]');
  const messages = JSON.parse(localStorage.getItem(`medical_messages_${patientId}`) || '[]');
  
  return {
    assessments: assessments.filter((a: any) => a.patientId === patientId),
    symptoms: symptoms.filter((s: any) => s.patientId === patientId),
    messages
  };
}

/**
 * 模拟医护端发送消息给患者
 * （在真实环境中，这会是API调用）
 */
export function simulateMedicalSendMessage(
  patientId: string,
  from: 'nurse' | 'doctor' | 'system',
  sender: string,
  content: string,
  type: 'info' | 'reminder' | 'alert' | 'feedback' = 'info'
): void {
  const key = `medical_messages_${patientId}`;
  const messages = JSON.parse(localStorage.getItem(key) || '[]');
  
  const newMessage: MedicalMessage = {
    id: `msg_${Date.now()}`,
    patientId,
    from,
    sender,
    content,
    timestamp: new Date().toISOString(),
    type,
    read: false
  };
  
  messages.push(newMessage);
  localStorage.setItem(key, JSON.stringify(messages));
  
  // 医护消息已发送
}

