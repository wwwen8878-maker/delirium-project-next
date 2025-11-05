import { NextRequest, NextResponse } from 'next/server';
import { chat, getProviderStatus } from '@/lib/llm-service';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

// 速率限制器：每个IP每分钟最多15次请求
const limiter = rateLimit({
  interval: 60 * 1000, // 1分钟
  uniqueTokenPerInterval: 500, // 同时追踪500个IP
});

/**
 * 聊天API路由
 * POST /api/chat
 */
export async function POST(request: NextRequest) {
  try {
    // 速率限制检查
    const ip = getClientIp(request);
    try {
      await limiter.check(15, ip); // 每分钟最多15次
    } catch {
      return NextResponse.json(
        { error: '请求过于频繁，请稍后再试（每分钟最多15次）' },
        { status: 429 }
      );
    }

    const { message, history } = await request.json();

    // 输入验证
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: '消息不能为空' },
        { status: 400 }
      );
    }

    // 长度限制
    if (message.length > 500) {
      return NextResponse.json(
        { error: '消息过长，请控制在500字以内' },
        { status: 400 }
      );
    }

    // 历史记录限制
    const convHistory = Array.isArray(history)
      ? history.slice(-20).map((m: any) => ({
          role: (m?.role === 'assistant' ? 'assistant' : 'user') as 'assistant' | 'user',
          content: typeof m?.content === 'string' ? m.content : ''
        }))
      : [];

    // 调用LLM服务
    const startTime = Date.now();
    const url = new URL(request.url);
    const modeParam = (url.searchParams.get('mode') as 'auto' | 'offline' | null) || 'auto';
    const provider = getProviderStatus();

    const response = await chat(message, convHistory, { mode: modeParam });
    const duration = Date.now() - startTime;

    if (response.error) {
      console.warn('LLM服务警告:', response.error);
    }

    // 记录请求（开发环境）
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Chat API] IP: ${ip}, Duration: ${duration}ms, Length: ${message.length}`);
    }

    return NextResponse.json({
      success: true,
      content: response.content,
      warning: response.error,
      provider,
      modeUsed: modeParam,
      timestamp: new Date().toISOString(),
      debug: process.env.NODE_ENV === 'development' ? {
        duration: `${duration}ms`,
        messageLength: message.length,
      } : undefined,
    });

  } catch (error) {
    console.error('聊天API错误:', error);
    return NextResponse.json(
      {
        error: '服务暂时不可用，请稍后再试',
        details: process.env.NODE_ENV === 'development' 
          ? (error instanceof Error ? error.message : '未知错误')
          : undefined
      },
      { status: 500 }
    );
  }
}

/**
 * 健康检查
 * GET /api/chat
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: '智能助手API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
}

