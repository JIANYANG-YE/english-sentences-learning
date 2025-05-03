'use client';

import React, { useState } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { THEMES } from '@/lib/constants';
import AdvancedThemeSettings from './AdvancedThemeSettings';

/**
 * 主题设置组件
 * 允许用户选择浅色、深色或跟随系统主题，并提供高级设置选项
 */
export default function ThemeSettings() {
  const { theme, setTheme, isDark } = useTheme();
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="space-y-6">
      <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'} border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <h3 className="text-lg font-medium mb-4">主题设置</h3>
        
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <input
              type="radio"
              id="theme-light"
              name="theme"
              value={THEMES.LIGHT}
              checked={theme === THEMES.LIGHT}
              onChange={() => setTheme(THEMES.LIGHT)}
              className="h-4 w-4 text-primary focus:ring-primary-light"
            />
            <label htmlFor="theme-light" className="text-sm font-medium">
              <span className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
                浅色
              </span>
            </label>
          </div>
          
          <div className="flex items-center gap-2">
            <input
              type="radio"
              id="theme-dark"
              name="theme"
              value={THEMES.DARK}
              checked={theme === THEMES.DARK}
              onChange={() => setTheme(THEMES.DARK)}
              className="h-4 w-4 text-primary focus:ring-primary-light"
            />
            <label htmlFor="theme-dark" className="text-sm font-medium">
              <span className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
                深色
              </span>
            </label>
          </div>
          
          <div className="flex items-center gap-2">
            <input
              type="radio"
              id="theme-system"
              name="theme"
              value={THEMES.SYSTEM}
              checked={theme === THEMES.SYSTEM || !theme}
              onChange={() => setTheme(THEMES.SYSTEM)}
              className="h-4 w-4 text-primary focus:ring-primary-light"
            />
            <label htmlFor="theme-system" className="text-sm font-medium">
              <span className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
                </svg>
                跟随系统
              </span>
            </label>
          </div>
          
          <div className="pt-2 mt-4 border-t border-gray-200 dark:border-gray-700">
            <button 
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="mt-2 text-sm flex items-center gap-1 text-primary hover:text-primary-dark transition-colors"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-4 w-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              {showAdvanced ? '隐藏高级设置' : '显示高级设置'}
            </button>
          </div>
        </div>
      </div>
      
      {/* 高级设置 */}
      {showAdvanced && <AdvancedThemeSettings />}
    </div>
  );
} 