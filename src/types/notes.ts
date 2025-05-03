/**
 * 笔记相关类型定义
 */

// 笔记类型
export type NoteType = 'important' | 'difficult' | 'insight' | 'question' | 'vocabulary';

// 笔记接口
export interface Note {
  id: string;
  lessonId: string;
  userId?: string;
  timestamp: string;
  highlight: string;
  note: string;
  type: NoteType;
  paragraphIndex: number;
}

// 笔记类型配置
export interface NoteTypeConfig {
  id: NoteType;
  name: string;
  color: string;
  emoji: string;
}

// 笔记统计信息
export interface NoteStats {
  total: number;
  byType: {
    type: string;
    name: string;
    emoji: string;
    count: number;
  }[];
  byParagraph: {
    paragraphIndex: number;
    count: number;
  }[];
}

// 导出格式
export type ExportFormat = 'markdown' | 'json';

// 笔记类型预设
export const noteTypes: NoteTypeConfig[] = [
  { 
    id: 'important', 
    name: '重要', 
    color: 'bg-yellow-500/30 border-yellow-500',
    emoji: '⭐'
  },
  { 
    id: 'difficult', 
    name: '难点', 
    color: 'bg-red-500/30 border-red-500',
    emoji: '🔴'
  },
  { 
    id: 'insight', 
    name: '感悟', 
    color: 'bg-green-500/30 border-green-500',
    emoji: '💡'
  },
  { 
    id: 'question', 
    name: '疑问', 
    color: 'bg-blue-500/30 border-blue-500',
    emoji: '❓'
  },
  { 
    id: 'vocabulary', 
    name: '词汇', 
    color: 'bg-purple-500/30 border-purple-500',
    emoji: '📚'
  }
]; 