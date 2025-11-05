'use client';

import { Shield, Info, ExternalLink } from "lucide-react";
import Link from "next/link";

export function PrivacyNotice() {
  return (
    <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-start gap-3">
        <Shield className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <Info className="h-4 w-4" />
            数据隐私保护
          </h3>
          <p className="text-sm text-blue-800 mb-2">
            您填写的所有信息<strong>仅保存在您的浏览器本地</strong>，不会上传至服务器或被第三方访问。
            数据完全由您掌控，清除浏览器缓存将永久删除数据。
          </p>
          <Link 
            href="/privacy" 
            className="text-sm text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1 hover:underline"
          >
            查看完整隐私政策
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}


























