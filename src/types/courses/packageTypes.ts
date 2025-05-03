/**
 * 课程包类型定义
 * 用于定义课程包的数据结构，支持导入导出功能
 */

import { ExtendedCourse } from './courseTypes';
import { ContentBlock, SentencePair } from './contentTypes';

// 课程包元数据
export interface CoursePackageMetadata {
  version: string;
  createdAt: string;
  packageId: string;
  courseCount: number;
  totalLessons: number;
  totalContentBlocks: number;
  totalSentencePairs: number;
  format: 'standard' | 'compact';
  compression?: 'none' | 'gzip' | 'brotli';
  encryption?: boolean;
  checksum?: string;
}

// 课程包结构
export interface CoursePackage {
  metadata: CoursePackageMetadata;
  courses: CourseData[];
}

// 课程数据结构
export interface CourseData {
  course: ExtendedCourse;
  lessons: LessonData[];
}

// 课时数据结构
export interface LessonData {
  id: string;
  courseId: string;
  title: string;
  description: string;
  order: number;
  duration: number;
  videoUrl?: string;
  audioUrl?: string;
  contentBlocks: ContentBlock[];
}

// 课程导入选项
export interface CourseImportOptions {
  replaceExisting?: boolean;
  importMedia?: boolean;
  validateContent?: boolean;
  generateAudio?: boolean;
  importProgress?: boolean;
}

// 课程导出选项
export interface CourseExportOptions {
  includeMedia?: boolean;
  format?: 'json' | 'csv' | 'xml' | 'binary';
  compression?: 'none' | 'gzip' | 'brotli';
  lessons?: string[]; // 要导出的特定课时ID
  optimize?: boolean; // 优化文件大小
  password?: string; // 加密密码
}

// 导入结果
export interface ImportResult {
  success: boolean;
  packageId?: string;
  coursesImported: number;
  lessonsImported: number;
  contentBlocksImported: number;
  sentencePairsImported: number;
  errors?: {
    message: string;
    code: string;
    context?: string;
  }[];
  warnings?: {
    message: string;
    code: string;
    context?: string;
  }[];
}

// 导出结果
export interface ExportResult {
  success: boolean;
  packageId?: string;
  fileUrl?: string;
  fileSize?: number;
  coursesExported: number;
  lessonsExported: number;
  contentBlocksExported: number;
  sentencePairsExported: number;
  format: 'json' | 'csv' | 'xml' | 'binary';
  compression: 'none' | 'gzip' | 'brotli';
  encrypted: boolean;
  errors?: {
    message: string;
    code: string;
    context?: string;
  }[];
}

// 内容转换格式
export type ContentTransformFormat = 
  | 'txt' 
  | 'docx' 
  | 'pdf' 
  | 'srt' // 字幕文件
  | 'html'
  | 'markdown';

// 内容转换选项
export interface ContentTransformOptions {
  format: ContentTransformFormat;
  splitStrategy?: 'paragraph' | 'sentence' | 'line' | 'custom';
  customSplitRegex?: string;
  languageDetection?: boolean;
  translateMissingContent?: boolean;
  extractMetadata?: boolean;
  detectDialogues?: boolean;
}

// 句子对齐选项
export interface SentenceAlignmentOptions {
  method: 'length-based' | 'semantic' | 'neural' | 'hybrid';
  minConfidence?: number; // 0-1
  manualVerification?: boolean;
  fallbackStrategy?: 'skip' | 'machine-translation' | 'placeholder';
}

// 学习模式内容项的内容类型
export interface ChineseToEnglishContent {
  prompt: string;
  answer: string;
  audioUrl?: string;
  keywords?: (string | { word: string; meaning?: string; example?: string })[];
}

export interface EnglishToChineseContent {
  prompt: string;
  answer: string;
  audioUrl?: string;
  hints?: string[];
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface GrammarContent {
  sentence: string;
  translation: string;
  explanation: string;
  grammarPoint: string;
  examples: { english: string; chinese: string }[];
}

export interface ListeningContent {
  audioUrl: string;
  transcript: string;
  translation?: string;
  questions?: { question: string; options: string[]; answer: string }[];
}

export interface NotesContent {
  title: string;
  content: string;
  sections: { title: string; content: string }[];
}

// 适用于各种学习模式的内容提取函数的结果
export interface ModeContent {
  lessonId: string;
  mode: string;
  title: string;
  description: string;
  contentItems: ModeContentItem[];
}

// 学习模式内容项
export interface ModeContentItem {
  id: string;
  type: string;
  content: 
    | ChineseToEnglishContent 
    | EnglishToChineseContent 
    | GrammarContent 
    | ListeningContent 
    | NotesContent; 
  metadata?: Record<string, unknown>;
} 