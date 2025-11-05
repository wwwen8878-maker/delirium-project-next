'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { ThemeToggle } from "@/components/theme-toggle";
import { AccessibilitySettings } from "@/components/accessibility-settings";
import { Menu, X } from 'lucide-react';
import { NavigationItems } from '@/lib/brand-constants';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200/50 shadow-sm">
      <div className="container mx-auto px-4 h-14 md:h-16 flex items-center justify-between">
        <div className="flex items-center">
          <Link
            href="/"
            className="text-lg md:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 transform"
          >
            智护心脑
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1" aria-label="主导航">
          {NavigationItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300 group hover:scale-105 transform flex items-center gap-2 ${
                  isActive
                    ? 'text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                {item.icon && <item.icon className="w-4 h-4" />}
                <span className="relative z-10">{item.label}</span>
                {!isActive && (
                  <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r ${item.color} transition-all duration-300 group-hover:w-full rounded-full`} />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 md:gap-3">
          <AccessibilitySettings />
          <ThemeToggle />

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 hover:scale-105 transform shadow-sm"
            aria-label="切换菜单"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5 text-gray-600" />
            ) : (
              <Menu className="h-5 w-5 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200/50 bg-white/95 backdrop-blur-sm shadow-lg">
          <nav className="container mx-auto px-4 py-4" aria-label="移动端导航">
            <div className="flex flex-col space-y-2">
              {NavigationItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 group hover:scale-102 transform flex items-center gap-2 ${
                      isActive
                        ? 'text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50/80'
                    }`}
                    onClick={closeMenu}
                  >
                    {item.icon && <item.icon className="w-4 h-4" />}
                    <span className="relative z-10">{item.label}</span>
                    {!isActive && (
                      <div className={`absolute bottom-2 left-4 w-0 h-0.5 bg-gradient-to-r ${item.color} transition-all duration-300 group-hover:w-8 rounded-full`} />
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
