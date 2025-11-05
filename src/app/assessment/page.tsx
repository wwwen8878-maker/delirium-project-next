'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function AssessmentPage() {
  const router = useRouter();

  useEffect(() => {
    // 自动重定向到新的AI评估页面
    router.replace('/ai-assessment');
  }, [router]);

  return (
    <main className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-600 mb-4">正在跳转到AI智能评估...</p>
          <Button asChild variant="outline">
            <Link href="/ai-assessment">
              <ArrowLeft className="w-4 h-4 mr-2" />
              立即前往
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
