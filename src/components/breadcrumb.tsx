'use client'

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  const allItems = [
    { label: '首页', href: '/' },
    ...items
  ];

  return (
    <nav 
      aria-label="面包屑导航" 
      className={`flex items-center gap-2 text-sm mb-6 ${className}`}
    >
      <ol className="flex items-center gap-2 flex-wrap">
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1;
          const isFirst = index === 0;
          
          return (
            <li key={index} className="flex items-center gap-2">
              {isFirst ? (
                <Link 
                  href={item.href || '#'} 
                  className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors"
                  aria-label="返回首页"
                >
                  <Home className="w-4 h-4" />
                  <span className="sr-only">首页</span>
                </Link>
              ) : item.href && !isLast ? (
                <Link 
                  href={item.href} 
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span 
                  className={`font-medium ${isLast ? 'text-gray-900' : 'text-gray-600'}`}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}
              
              {!isLast && (
                <ChevronRight 
                  className="w-4 h-4 text-gray-400" 
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}


