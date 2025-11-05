/**
 * 患者端后端API集成
 * 替代LocalStorage，使用真实HTTP + WebSocket
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// ========== 评估API ==========

export async function submitAssessment(data: {
  patientId: string;
  patientName: string;
  age: number;
  gender: string;
  phone?: string;
  surgeryType?: string;
  surgeryDate?: string;
  riskScore: number;
  riskLevel: string;
  factors: any[];
  personalizedAdvice: string[];
}) {
  const response = await fetch(`${API_BASE_URL}/api/patient/assessment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error('提交评估失败');
  }

  return response.json();
}

// ========== 症状API ==========

export async function submitSymptom(data: {
  patientId: string;
  date: string;
  cognition: number;
  sleep: number;
  mood: number;
  appetite: number;
  notes?: string;
}) {
  const response = await fetch(`${API_BASE_URL}/api/patient/symptom`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error('提交症状失败');
  }

  return response.json();
}

// ========== 消息API ==========

export async function fetchMessages(patientId: string) {
  const response = await fetch(`${API_BASE_URL}/api/patient/messages?patientId=${patientId}`);
  
  if (!response.ok) {
    throw new Error('获取消息失败');
  }

  const data = await response.json();
  return data.messages;
}

export async function markMessageRead(messageId: string) {
  const response = await fetch(`${API_BASE_URL}/api/patient/message/read`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messageId })
  });

  if (!response.ok) {
    throw new Error('标记消息失败');
  }

  return response.json();
}

// ========== 求助API ==========

export async function sendHelpRequest(patientId: string, message: string) {
  const response = await fetch(`${API_BASE_URL}/api/patient/help`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ patientId, message })
  });

  if (!response.ok) {
    throw new Error('发送求助失败');
  }

  return response.json();
}





