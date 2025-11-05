import { useEffect, useState } from 'react';

interface UseCountAnimationOptions {
  end: number;
  duration: number;
  start?: number;
  decimals?: number;
}

export function useCountAnimation({
  end,
  duration,
  start = 0,
  decimals = 0
}: UseCountAnimationOptions) {
  const [current, setCurrent] = useState(start);

  useEffect(() => {
    let startTime: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      // 使用缓动函数使动画更自然
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const value = start + (end - start) * easeOutQuart;

      setCurrent(decimals === 0 ? Math.floor(value) : parseFloat(value.toFixed(decimals)));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration, start, decimals]);

  return current;
}
