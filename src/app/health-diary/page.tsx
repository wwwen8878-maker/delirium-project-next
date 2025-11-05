'use client';

import { SmartSymptomTracker } from '@/components/smart-symptom-tracker';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HealthDiaryPage() {
  const router = useRouter();

  useEffect(() => {
    // 自动重定向到新的症状追踪页面
    router.replace('/symptom-tracker');
  }, [router]);

  return (
    <main className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-600 mb-4">正在跳转到新版健康记录...</p>
          <Button asChild variant="outline">
            <Link href="/symptom-tracker">
              <ArrowLeft className="w-4 h-4 mr-2" />
              立即前往
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
