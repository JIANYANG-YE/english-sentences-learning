'use client';

import React from 'react';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { LearningMode } from '@/types/learning';
import { useTheme } from '@/hooks/useTheme';

interface ModeNavigationProps {
  className?: string;
  currentMode?: LearningMode;
  courseId?: string;
  lessonId?: string;
}

export default function ModeNavigation({ 
  className = '',
  currentMode: propCurrentMode,
  courseId: propCourseId,
  lessonId: propLessonId
}: ModeNavigationProps) {
  const params = useParams();
  const { id: paramCourseId, lessonId: paramLessonId } = params;
  const pathname = usePathname();
  const { isDark } = useTheme();
  
  // 使用属性值或从参数中获取
  const courseId = propCourseId || paramCourseId;
  const lessonId = propLessonId || paramLessonId;
  
  // 提取当前学习模式
  const getCurrentMode = (): LearningMode | null => {
    // 如果提供了当前模式属性，优先使用
    if (propCurrentMode) return propCurrentMode;
    
    const pathParts = pathname.split('/');
    const mode = pathParts[pathParts.length - 1];
    
    if (['chinese-to-english', 'english-to-chinese', 'grammar', 'listening', 'notes'].includes(mode)) {
      return mode as LearningMode;
    }
    
    return null;
  };
  
  const currentMode = getCurrentMode();
  
  // 定义学习模式
  const modes: {id: LearningMode; label: string; icon: JSX.Element}[] = [
    {
      id: 'chinese-to-english',
      label: '中译英',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
      )
    },
    {
      id: 'english-to-chinese',
      label: '英译中',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
      )
    },
    {
      id: 'grammar',
      label: '语法',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      id: 'listening',
      label: '听力',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.465a5 5 0 001.897-7.72m-3.732 10.535a9 9 0 0110.607-14.206" />
        </svg>
      )
    },
    {
      id: 'notes',
      label: '笔记',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      )
    }
  ];
  
  // 如果不在学习模式页面，返回空
  if (!currentMode) return null;
  
  return (
    <div className={`fixed bottom-0 left-0 right-0 z-20 ${className} ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      <div className="border-t border-gray-700">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          {modes.map((mode) => {
            const isActive = currentMode === mode.id;
            
            return (
              <Link 
                key={mode.id} 
                href={`/courses/${courseId}/lessons/${lessonId}/${mode.id}`}
                className={`flex-1 flex flex-col items-center py-3 ${
                  isActive 
                    ? isDark ? 'text-blue-400' : 'text-blue-600' 
                    : isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className={`relative ${isActive ? 'text-blue-400' : ''}`}>
                  {mode.icon}
                  {isActive && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
                  )}
                </div>
                <span className="text-xs mt-1">{mode.label}</span>
              </Link>
            );
          })}
          
          <Link 
            href={`/courses/${courseId}/lessons/${lessonId}`}
            className={`flex-1 flex flex-col items-center py-3 ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            <span className="text-xs mt-1">全文</span>
          </Link>
        </div>
      </div>
    </div>
  );
} 