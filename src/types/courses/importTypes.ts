/**
 * 内容导入系统类型定义
 * 定义了用于智能内容导入系统的各种接口和类型
 */

export type ImportSourceType = 'file' | 'url' | 'text';
export type ContentSplittingStrategy = 'auto' | 'fixed' | 'none';
export type ImportStatus = 'pending' | 'processing' | 'completed' | 'failed';

/**
 * 导入源定义
 */
export interface ImportSource {
  id: string;
  type: ImportSourceType;
  path?: string;        // 用于文件类型
  url?: string;         // 用于URL类型
  content?: string;     // 用于文本类型
  metadata?: Record<string, any>;
}

/**
 * 批量导入选项
 */
export interface BatchImportOptions {
  parallelLimit: number;       // 并行处理限制
  continueOnError: boolean;    // 遇到错误时是否继续
  qualityCheck: boolean;       // 是否进行质量检查
  autoCategories: boolean;     // 是否自动分类
  contentSplitting: ContentSplittingStrategy; // 内容拆分策略
  maxSentencesPerLesson: number; // 每节课最大句子数
  targetCourseId?: string;     // 目标课程ID
}

/**
 * 内容分析结果
 */
export interface ContentAnalysisResult {
  language: string;
  wordCount: number;
  sentenceCount: number;
  paragraphCount: number;
  estimatedLessons: number;
  contentQuality?: {
    score: number;
    issues: string[];
  };
  suggestedTags?: string[];
  suggestedCategories?: string[];
  suggestedSplitting?: {
    points: number[];
    reasons: string[];
  };
}

/**
 * 导入作业状态
 */
export interface ImportJobStatus {
  jobId: string;
  status: ImportStatus;
  progress: number;
  startTime: number;
  endTime?: number;
  errors?: Array<{
    sourceId: string;
    error: string;
  }>;
  results?: Array<{
    sourceId: string;
    courseId?: string;
    lessonIds?: string[];
  }>;
}

/**
 * 内容质量检测结果
 */
export interface ContentQualityResult {
  score: number;
  issues: Array<{
    type: 'grammar' | 'spelling' | 'readability' | 'structure';
    description: string;
    severity: 'low' | 'medium' | 'high';
    position?: {
      start: number;
      end: number;
    };
    suggestion?: string;
  }>;
  metrics: {
    readabilityScore: number;
    grammarScore: number;
    spellingScore: number;
    structureScore: number;
  };
}

/**
 * 资源生成配置
 */
export interface ResourceGenerationOptions {
  generateVocabulary: boolean;
  generateQuizzes: boolean;
  generateSummaries: boolean;
  difficultyLevel?: 'beginner' | 'intermediate' | 'advanced';
}

/**
 * 导入结果
 */
export interface ImportResult {
  sourceId: string;
  courseId?: string;
  lessonIds?: string[];
  analysis: ContentAnalysisResult;
  resources?: {
    vocabularyList?: string[];
    quizzes?: any[];
    summaries?: string[];
  };
} 