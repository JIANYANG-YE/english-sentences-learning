'use client';

import React from 'react';
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import { useTheme } from '@/hooks/useTheme';
import { THEMES } from '@/lib/constants';

interface ThemeToggleProps {
  className?: string;
}

/**
 * 主题切换按钮组件
 * 根据当前主题显示太阳或月亮图标
 */
export default function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
        isDark 
          ? 'text-yellow-400 hover:bg-gray-700 focus:ring-yellow-500/30' 
          : 'text-gray-600 hover:bg-gray-100 focus:ring-primary/30'
      } ${className}`}
      aria-label={`切换至${isDark ? '浅色' : '深色'}模式`}
      title={`切换至${isDark ? '浅色' : '深色'}模式`}
    >
      {isDark ? (
        <SunIcon className="w-5 h-5" />
      ) : (
        <MoonIcon className="w-5 h-5" />
      )}
    </button>
  );
} 