'use client'

import { ErrorBoundary as ReactErrorBoundary, FallbackProps } from 'react-error-boundary'
import React, { ErrorInfo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw } from 'lucide-react'

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-destructive/10 rounded-full w-fit">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-xl">出错了</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-center">
            抱歉，应用程序遇到了一个错误。这可能是临时性的网络问题或代码错误。
          </p>

          <details className="text-sm text-muted-foreground">
            <summary className="cursor-pointer hover:text-foreground">
              技术细节（点击展开）
            </summary>
            <pre className="mt-2 p-3 bg-muted rounded-md text-xs overflow-auto">
              {error.message}
            </pre>
          </details>

          <div className="flex gap-3 justify-center pt-4">
            <Button
              onClick={resetErrorBoundary}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              重试
            </Button>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
            >
              刷新页面
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center pt-4 border-t">
            如果问题持续，请联系技术支持团队
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

function logError(error: Error, errorInfo: ErrorInfo) {
  // In a real app, you'd send this to your error reporting service
  console.error('Error caught by boundary:', error, errorInfo)
}

export function ErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={logError}
    >
      {children}
    </ReactErrorBoundary>
  )
}
