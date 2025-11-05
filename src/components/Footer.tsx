'use client'

import * as React from 'react';
import Link from 'next/link';
import { Heart, Shield, Award } from 'lucide-react';
import { MicroSurvey } from "@/components/micro-survey";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid gap-6 md:gap-8 md:grid-cols-4">
          {/* 品牌区 */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Heart className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-base md:text-lg font-bold text-gray-900">
                  智护心脑
                </h3>
                <span className="text-xs text-gray-500 font-medium">健康服务平台</span>
              </div>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              术后谵妄多模态健康管理平台，为患者提供科学、可靠的预防和筛查服务。
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                医疗AI
              </span>
              <span className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full">
                科学验证
              </span>
            </div>
          </div>

          {/* 产品特色 */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-600" />
              平台特色
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• 基于循证医学证据</li>
              <li>• AI智能化分析</li>
              <li>• 临床验证数据</li>
              <li>• 用户友好的设计</li>
            </ul>
          </div>

          {/* 快速链接 */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Award className="h-4 w-4 text-blue-600" />
              服务项目
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/assessment" className="text-gray-600 hover:text-blue-600 transition-colors">风险评估</Link></li>
              <li><Link href="/guide" className="text-gray-600 hover:text-blue-600 transition-colors">科普宣教</Link></li>
              <li><Link href="/evidence-guide" className="text-gray-600 hover:text-blue-600 transition-colors">证据等级说明</Link></li>
              <li><Link href="/research-background" className="text-gray-600 hover:text-blue-600 transition-colors">研究背景</Link></li>
              <li><Link href="/roadmap" className="text-gray-600 hover:text-blue-600 transition-colors">产品路线图</Link></li>
            </ul>
          </div>

          {/* 联系与反馈 */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">用户反馈</h4>
            <MicroSurvey />
            <p className="text-xs text-gray-500 mt-2">
              您的反馈将帮助我们持续改进服务质量
            </p>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-6 md:mt-8 pt-6 md:pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs md:text-sm text-gray-600 text-center md:text-left">
              © 2025 智护心脑 - 术后谵妄多模态健康管理平台. All Rights Reserved.
            </p>
            <div className="flex flex-wrap gap-2 md:gap-4 text-xs md:text-sm text-gray-600 justify-center">
              <Link href="/disclaimer" className="hover:text-blue-600 transition-colors font-medium">免责声明</Link>
              <span>•</span>
              <Link href="/privacy" className="hover:text-blue-600 transition-colors">隐私政策</Link>
              <span>•</span>
              <span>健康教育平台</span>
              <span>•</span>
              <span>数据安全保障</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
