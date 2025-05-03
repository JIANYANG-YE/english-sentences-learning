import { LearningMode } from '@/types/learning';

/**
 * 课程内容类型定义
 * 用于定义课程内容的结构化组织，包括内容块和句子对等
 */

/**
 * 基本的语句对
 */
export interface SentencePair {
  id: string;
  english: string;
  chinese: string;
  pinyin?: string;
  audioUrl?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
  grammarPoints?: {
    point: string;
    explanation: string;
  }[];
}

/**
 * 内容块类型
 */
export enum ContentBlockType {
  HEADING = 'heading',
  PARAGRAPH = 'paragraph',
  DIALOG = 'dialog',
  IMAGE = 'image',
  AUDIO = 'audio',
  VIDEO = 'video',
  SENTENCES = 'sentences',
  EXERCISE = 'exercise',
  VOCABULARY = 'vocabulary',
  GRAMMAR = 'grammar',
  LIST = 'list',
  QUOTE = 'quote',
  CODE = 'code',
  TABLE = 'table'
}

/**
 * 内容块基础接口
 */
export interface ContentBlockBase {
  id: string;
  type: ContentBlockType;
  order: number;
  metadata?: Record<string, unknown>;
}

/**
 * 标题内容块
 */
export interface HeadingBlock extends ContentBlockBase {
  type: ContentBlockType.HEADING;
  content: {
    text: string;
    level: 1 | 2 | 3 | 4 | 5 | 6;
  };
}

/**
 * 段落内容块
 */
export interface ParagraphBlock extends ContentBlockBase {
  type: ContentBlockType.PARAGRAPH;
  content: {
    english: string;
    chinese: string;
    pinyin?: string;
  };
}

/**
 * 对话内容块
 */
export interface DialogBlock extends ContentBlockBase {
  type: ContentBlockType.DIALOG;
  content: {
    speakers: {
      id: string;
      name: string;
      avatar?: string;
    }[];
    lines: {
      speakerId: string;
      english: string;
      chinese: string;
      pinyin?: string;
      audioUrl?: string;
    }[];
  };
}

/**
 * 图片内容块
 */
export interface ImageBlock extends ContentBlockBase {
  type: ContentBlockType.IMAGE;
  content: {
    url: string;
    alt: string;
    caption?: {
      english: string;
      chinese: string;
    };
    width?: number;
    height?: number;
  };
}

/**
 * 音频内容块
 */
export interface AudioBlock extends ContentBlockBase {
  type: ContentBlockType.AUDIO;
  content: {
    url: string;
    duration: number; // 秒数
    transcript?: {
      english: string;
      chinese: string;
    };
  };
}

/**
 * 视频内容块
 */
export interface VideoBlock extends ContentBlockBase {
  type: ContentBlockType.VIDEO;
  content: {
    url: string;
    duration: number; // 秒数
    poster?: string;
    transcript?: {
      english: string;
      chinese: string;
    };
  };
}

/**
 * 句子内容块
 */
export interface SentencesBlock extends ContentBlockBase {
  type: ContentBlockType.SENTENCES;
  content: {
    pairs: SentencePair[];
  };
}

/**
 * 练习内容块
 */
export interface ExerciseBlock extends ContentBlockBase {
  type: ContentBlockType.EXERCISE;
  content: {
    instructions: {
      english: string;
      chinese: string;
    };
    questions: {
      id: string;
      type: 'multiple-choice' | 'fill-blank' | 'matching' | 'reordering';
      question: string;
      options?: string[];
      answer: string | string[];
      explanation?: string;
    }[];
  };
}

/**
 * 词汇内容块
 */
export interface VocabularyBlock extends ContentBlockBase {
  type: ContentBlockType.VOCABULARY;
  content: {
    words: {
      word: string;
      phonetic?: string;
      partOfSpeech?: string;
      definition: {
        english: string;
        chinese: string;
      };
      examples: {
        english: string;
        chinese: string;
      }[];
    }[];
  };
}

/**
 * 语法内容块
 */
export interface GrammarBlock extends ContentBlockBase {
  type: ContentBlockType.GRAMMAR;
  content: {
    point: string;
    explanation: {
      english: string;
      chinese: string;
    };
    examples: {
      english: string;
      chinese: string;
      pinyin?: string;
    }[];
    notes?: string;
  };
}

/**
 * 列表内容块
 */
export interface ListBlock extends ContentBlockBase {
  type: ContentBlockType.LIST;
  content: {
    style: 'ordered' | 'unordered';
    items: {
      english: string;
      chinese: string;
    }[];
  };
}

/**
 * 引用内容块
 */
export interface QuoteBlock extends ContentBlockBase {
  type: ContentBlockType.QUOTE;
  content: {
    text: {
      english: string;
      chinese: string;
    };
    source?: string;
    author?: string;
  };
}

/**
 * 代码内容块
 */
export interface CodeBlock extends ContentBlockBase {
  type: ContentBlockType.CODE;
  content: {
    code: string;
    language: string;
    explanation?: {
      english: string;
      chinese: string;
    };
  };
}

/**
 * 表格内容块
 */
export interface TableBlock extends ContentBlockBase {
  type: ContentBlockType.TABLE;
  content: {
    headers: {
      english: string;
      chinese: string;
    }[];
    rows: {
      cells: {
        english: string;
        chinese: string;
      }[];
    }[];
    caption?: {
      english: string;
      chinese: string;
    };
  };
}

/**
 * 内容块联合类型
 */
export type ContentBlock =
  | HeadingBlock
  | ParagraphBlock
  | DialogBlock
  | ImageBlock
  | AudioBlock
  | VideoBlock
  | SentencesBlock
  | ExerciseBlock
  | VocabularyBlock
  | GrammarBlock
  | ListBlock
  | QuoteBlock
  | CodeBlock
  | TableBlock;

/**
 * 课程内容 - 适用于不同学习模式
 */
export interface LessonContent {
  id: string;
  lessonId: string;
  mode: LearningMode;
  blocks: ContentBlock[];
  createdAt: string;
  updatedAt: string;
}

/**
 * 用户进度每个项目
 */
export interface ProgressItem {
  id: string;
  contentType: string; // 'sentence', 'exercise', 'block', etc.
  contentId: string;
  completed: boolean;
  score?: number;
  attempts: number;
  lastAttemptAt: string;
  timeSpent: number; // 秒数
}

/**
 * 用户阅读进度
 */
export interface ReadingProgress {
  userId: string;
  lessonId: string;
  lastPosition: {
    blockId: string;
    scrollY: number;
  };
  readPercentage: number; // 0-100
  lastUpdatedAt: string;
}

/**
 * 对话对句子接口
 */
export interface DialogPair {
  id: string;
  speakerIndex: number;
  english: string;
  chinese: string;
  pinyin?: string;
  audioUrl?: string;
}

/**
 * 类型守卫函数
 */
export function isHeadingBlock(block: ContentBlock): block is HeadingBlock {
  return block.type === ContentBlockType.HEADING;
}

export function isParagraphBlock(block: ContentBlock): block is ParagraphBlock {
  return block.type === ContentBlockType.PARAGRAPH;
}

export function isDialogBlock(block: ContentBlock): block is DialogBlock {
  return block.type === ContentBlockType.DIALOG;
}

export function isImageBlock(block: ContentBlock): block is ImageBlock {
  return block.type === ContentBlockType.IMAGE;
}

export function isAudioBlock(block: ContentBlock): block is AudioBlock {
  return block.type === ContentBlockType.AUDIO;
}

export function isVideoBlock(block: ContentBlock): block is VideoBlock {
  return block.type === ContentBlockType.VIDEO;
}

export function isSentencesBlock(block: ContentBlock): block is SentencesBlock {
  return block.type === ContentBlockType.SENTENCES;
}

export function isExerciseBlock(block: ContentBlock): block is ExerciseBlock {
  return block.type === ContentBlockType.EXERCISE;
}

export function isVocabularyBlock(block: ContentBlock): block is VocabularyBlock {
  return block.type === ContentBlockType.VOCABULARY;
}

export function isGrammarBlock(block: ContentBlock): block is GrammarBlock {
  return block.type === ContentBlockType.GRAMMAR;
}

export function isListBlock(block: ContentBlock): block is ListBlock {
  return block.type === ContentBlockType.LIST;
}

export function isQuoteBlock(block: ContentBlock): block is QuoteBlock {
  return block.type === ContentBlockType.QUOTE;
}

export function isCodeBlock(block: ContentBlock): block is CodeBlock {
  return block.type === ContentBlockType.CODE;
}

export function isTableBlock(block: ContentBlock): block is TableBlock {
  return block.type === ContentBlockType.TABLE;
} 