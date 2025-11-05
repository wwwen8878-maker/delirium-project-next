'use client'

import { cn } from '@/lib/utils'

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'spinner' | 'pulse' | 'dots' | 'skeleton'
  className?: string
  text?: string
}

export function Loading({
  size = 'md',
  variant = 'spinner',
  className,
  text
}: LoadingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  const renderLoader = () => {
    switch (variant) {
      case 'spinner':
        return (
          <div className={cn('animate-spin rounded-full border-2 border-gray-300 border-t-blue-600', sizeClasses[size], className)} />
        )
      case 'pulse':
        return (
          <div className={cn('animate-pulse rounded-full bg-blue-600', sizeClasses[size], className)} />
        )
      case 'dots':
        return (
          <div className={cn('flex space-x-1', className)}>
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={cn(
                  'bg-blue-600 rounded-full animate-bounce',
                  size === 'sm' ? 'w-2 h-2' : size === 'lg' ? 'w-4 h-4' : 'w-3 h-3'
                )}
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        )
      case 'skeleton':
        return (
          <div className={cn('skeleton-loading', className)}>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        )
      default:
        return <div className={cn('animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 w-8 h-8', className)} />
    }
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      {renderLoader()}
      {text && <p className="text-sm text-gray-600">{text}</p>}
    </div>
  )
}

export function PageLoading({ text = "正在加载..." }: { text?: string }) {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center space-y-4">
        <Loading size="lg" variant="dots" />
        <p className="text-gray-700 font-medium">{text}</p>
      </div>
    </div>
  )
}

export function LoadingCard({ lines = 3, className }: { lines?: number, className?: string }) {
  return (
    <div className={cn('bg-white rounded-xl shadow-sm border p-6 space-y-3', className)}>
      {[...Array(lines)].map((_, i) => (
        <div key={i} className="skeleton-loading h-4 rounded"></div>
      ))}
    </div>
  )
}
