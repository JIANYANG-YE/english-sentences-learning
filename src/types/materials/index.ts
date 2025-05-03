/**
 * 学习材料相关类型定义
 */

// 材料类型枚举
export enum MaterialType {
  DOCUMENT = 'document',
  VIDEO = 'video',
  AUDIO = 'audio',
  IMAGE = 'image',
  PDF = 'pdf',
  TEXT = 'text',
  SUBTITLE = 'subtitle',
  OTHER = 'other'
}

// 材料来源枚举
export enum MaterialSource {
  USER_UPLOAD = 'user_upload',
  EXTERNAL_SERVICE = 'external_service',
  SYSTEM = 'system'
}

// 材料状态枚举
export enum MaterialStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  PROCESSED = 'processed',
  FAILED = 'failed',
  DELETED = 'deleted'
}

// 处理方法枚举
export enum ProcessingMethod {
  OCR = 'ocr',
  TEXT_EXTRACTION = 'text_extraction',
  TRANSCRIPTION = 'transcription',
  TRANSLATION = 'translation',
  SENTENCE_ALIGNMENT = 'sentence_alignment',
  MANUAL = 'manual'
}

// 基础材料接口
export interface Material {
  id: string;
  userId: string;
  title: string;
  description?: string;
  type: MaterialType;
  source: MaterialSource;
  status: MaterialStatus;
  url: string;
  fileSize: number;
  fileName: string;
  fileType: string; // MIME类型
  tags?: string[];
  uploadedAt: string;
  lastModifiedAt: string;
  metadata?: Record<string, any>;
}

// 材料上传请求参数
export interface MaterialUploadParams {
  title: string;
  description?: string;
  type: MaterialType;
  tags?: string[];
  file: File;
  metadata?: Record<string, any>;
}

// 预签名URL请求参数
export interface PresignedUrlRequestParams {
  fileName: string;
  fileType: string;
  fileSize: number;
  type: MaterialType;
  metadata?: Record<string, any>;
}

// 预签名URL响应
export interface PresignedUrlResponse {
  url: string;
  materialId: string;
  fields?: Record<string, string>;
  expires: number;
}

// 材料处理请求参数
export interface MaterialProcessingParams {
  materialId: string;
  processingMethod: ProcessingMethod;
  options?: {
    targetLanguage?: string;
    extractionMethod?: string;
    ocrEngine?: string;
    transcriptionModel?: string;
    alignmentThreshold?: number;
  };
}

// 材料处理结果
export interface MaterialProcessingResult {
  materialId: string;
  processingMethod: ProcessingMethod;
  status: 'success' | 'failed';
  result?: {
    extractedText?: string;
    extractedSentences?: Array<{
      text: string;
      language: string;
      confidence: number;
    }>;
    alignedSentences?: Array<{
      source: string;
      target: string;
      confidence: number;
    }>;
    transcription?: string;
    translation?: string;
    metadata?: Record<string, any>;
  };
  error?: string;
  processingTime?: number;
  processedAt: string;
}

// 材料转换为课程参数
export interface MaterialToCourseParams {
  materialId: string;
  title: string;
  description?: string;
  level?: 'beginner' | 'intermediate' | 'advanced' | 'all-levels';
  category?: string[];
  tags?: string[];
  price?: number;
  isFree?: boolean;
  options?: {
    generateAudio?: boolean;
    createExercises?: boolean;
    extractVocabulary?: boolean;
    identifyGrammarPoints?: boolean;
    lessonSplitMethod?: 'paragraph' | 'page' | 'custom';
    maxSentencesPerLesson?: number;
  };
}

// 材料导入进度
export interface MaterialImportProgress {
  materialId: string;
  courseId?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  currentStep: string;
  error?: string;
  startedAt: string;
  completedAt?: string;
}

// 内容块类型
export interface ContentBlock {
  id: string;
  type: 'heading' | 'paragraph' | 'dialogue' | 'quote' | 'list' | 'image' | 'audio';
  content: string | SentencePair[];
  metadata?: Record<string, any>;
}

// 句子对类型
export interface SentencePair {
  id: string;
  english: string;
  chinese: string;
  pinyin?: string;
  audio?: {
    englishUrl?: string;
    chineseUrl?: string;
  };
  confidence?: number;
  notes?: string;
  vocabulary?: Array<{
    word: string;
    meaning: string;
    partOfSpeech?: string;
  }>;
  grammarPoints?: string[];
}

// 学习模式转换参数
export interface LearningModeConversionParams {
  contentBlockId: string;
  mode: 'chinese-to-english' | 'english-to-chinese' | 'listening' | 'grammar' | 'notes';
  options?: {
    difficulty?: 'easy' | 'medium' | 'hard';
    hideHints?: boolean;
    audioSpeed?: number;
    includeExplanations?: boolean;
  };
}

// 学习模式内容
export interface LearningModeContent {
  mode: string;
  blocks: Array<{
    id: string;
    type: string;
    content: any;
    options?: Record<string, any>;
  }>;
  metadata?: Record<string, any>;
} 