/**
 * 患者端WebSocket客户端
 * 实时接收医护消息
 */

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080/ws';

type EventCallback = (...args: any[]) => void;

class PatientWebSocketClient {
  private ws: WebSocket | null = null;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private listeners: Map<string, EventCallback[]> = new Map();
  private patientId: string | null = null;

  connect(patientId: string) {
    this.patientId = patientId;

    if (this.ws?.readyState === WebSocket.OPEN) return;

    this.ws = new WebSocket(WS_URL);

    this.ws.onopen = () => {
      // WebSocket已连接

      // 注册患者身份
      this.send({
        type: 'register',
        role: 'patient',
        userId: patientId
      });

      this.startHeartbeat();
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.handleMessage(data);
      } catch (error) {
        console.error('解析WebSocket消息失败:', error);
      }
    };

    this.ws.onclose = () => {
      console.warn('WebSocket已断开，5秒后重连...');
      this.reconnectTimer = setTimeout(() => {
        if (this.patientId) {
          this.connect(this.patientId);
        }
      }, 5000);
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket错误:', error);
    };
  }

  private handleMessage(data: any) {
    const { type } = data;

    // 触发监听器
    const listeners = this.listeners.get(type) || [];
    listeners.forEach(fn => fn(data));

    // 新消息通知
    if (type === 'new_message') {
      this.showNotification(data.message);
    }

    // 预警解除通知
    if (type === 'alert_resolved') {
      // 预警已解除
    }
  }

  private showNotification(message: any) {
    // 浏览器通知（需要权限）
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`${message.senderName}发来消息`, {
        body: message.content,
        icon: '/favicon.ico',
        tag: message.messageId
      });
    }

    // 触发自定义事件（让页面组件监听）
    const event = new CustomEvent('newMedicalMessage', { detail: message });
    window.dispatchEvent(event);
  }

  private startHeartbeat() {
    setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.send({ type: 'ping' });
      }
    }, 30000);
  }

  send(data: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  on(type: string, callback: EventCallback) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, []);
    }
    this.listeners.get(type)!.push(callback);
  }

  disconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }
    this.ws?.close();
    this.ws = null;
  }
}

export const patientWsClient = new PatientWebSocketClient();





