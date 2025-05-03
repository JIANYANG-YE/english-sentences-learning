/**
 * 组件类型定义
 */

import { ReactNode } from 'react';
import type { CoreUser, CoreCourse, CoreLesson, CoreExercise } from './core';

// 通用组件Props
export interface BaseProps {
  className?: string;
  children?: ReactNode;
}

// 错误边界组件Props
export interface ErrorBoundaryProps extends BaseProps {
  fallback?: ReactNode;
}

// 学习内容模态框Props
export interface LearningContentModalProps extends BaseProps {
  isOpen: boolean;
  onClose: () => void;
  content: CoreLesson;
  user?: CoreUser;
}

// 学习工具栏Props
export interface LearningToolbarProps extends BaseProps {
  onModeChange: (mode: string) => void;
  onSpeedChange: (speed: number) => void;
  onVolumeChange: (volume: number) => void;
  currentMode: string;
  currentSpeed: number;
  currentVolume: number;
}

// 学习模式选择器Props
export interface LearningModeSelectorProps extends BaseProps {
  currentMode: string;
  onModeChange: (mode: string) => void;
  modes: Array<{
    id: string;
    name: string;
    description: string;
    icon: ReactNode;
  }>;
}

// 学习内容预览Props
export interface LearningContentPreviewProps extends BaseProps {
  content: CoreLesson;
  onStart: () => void;
  onClose: () => void;
}

// 句子卡片Props
export interface SentenceCardProps extends BaseProps {
  sentence: {
    id: string;
    content: string;
    translation: string;
    grammar: string;
    examples: string[];
  };
  onSelect: (id: string) => void;
  isSelected?: boolean;
}

// 分类导航Props
export interface CategoryNavProps extends BaseProps {
  categories: Array<{
    id: string;
    name: string;
    count: number;
  }>;
  currentCategory?: string;
  onSelect: (id: string) => void;
}

// 句子过滤器Props
export interface SentenceFiltersProps extends BaseProps {
  filters: {
    grammar: string[];
    difficulty: string[];
    length: string[];
  };
  onFilterChange: (filters: Record<string, string[]>) => void;
}

// 语法分析卡片Props
export interface GrammarAnalysisCardProps extends BaseProps {
  grammar: {
    type: string;
    explanation: string;
    examples: string[];
  };
}

// 句子语法树Props
export interface SentenceSyntaxTreeProps extends BaseProps {
  sentence: {
    content: string;
    structure: {
      type: string;
      children: Array<{
        type: string;
        content: string;
      }>;
    };
  };
} 