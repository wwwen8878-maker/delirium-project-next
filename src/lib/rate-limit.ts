/**
 * 简单的内存速率限制器
 * 防止API滥用
 */

interface RateLimitConfig {
  interval: number; // 时间窗口（毫秒）
  uniqueTokenPerInterval: number; // 同时追踪的唯一标识符数量
}

interface TokenBucket {
  count: number;
  resetTime: number;
}

const tokenBuckets = new Map<string, TokenBucket>();

export function rateLimit(config: RateLimitConfig) {
  const { interval, uniqueTokenPerInterval } = config;

  return {
    check: async (limit: number, token: string): Promise<void> => {
      const now = Date.now();
      const bucket = tokenBuckets.get(token);

      if (!bucket) {
        // 首次请求
        tokenBuckets.set(token, {
          count: 1,
          resetTime: now + interval,
        });
        return;
      }

      // 检查是否需要重置
      if (now > bucket.resetTime) {
        bucket.count = 1;
        bucket.resetTime = now + interval;
        return;
      }

      // 检查是否超过限制
      if (bucket.count >= limit) {
        throw new Error('Rate limit exceeded');
      }

      // 增加计数
      bucket.count++;

      // 清理旧的token（保持内存占用可控）
      if (tokenBuckets.size > uniqueTokenPerInterval) {
        const sortedTokens = Array.from(tokenBuckets.entries())
          .sort((a, b) => a[1].resetTime - b[1].resetTime);
        
        // 删除最旧的20%
        const toDelete = Math.floor(sortedTokens.length * 0.2);
        for (let i = 0; i < toDelete; i++) {
          tokenBuckets.delete(sortedTokens[i][0]);
        }
      }
    },
  };
}

/**
 * 获取客户端IP地址
 */
export function getClientIp(request: Request): string {
  // 尝试从各种header中获取真实IP
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');

  if (cfConnectingIp) return cfConnectingIp;
  if (realIp) return realIp;
  if (forwarded) return forwarded.split(',')[0].trim();

  return 'unknown';
}

