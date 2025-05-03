/**
 * 句子相关类型定义
 */

// 句子难度等级
export type SentenceDifficulty = 'beginner' | 'intermediate' | 'advanced';

// 句子基本信息
export interface Sentence {
  id: string;
  english: string;
  chinese: string;
  difficulty: SentenceDifficulty;
  tags: string[];
  source?: {
    book: string;
    lesson: number;
  };
  audioUrl?: string;
  examples?: string[];
  grammarPoints?: GrammarPoint[];
  vocabulary?: VocabularyItem[];
  createdAt: string;
  updatedAt: string;
}

/**
 * 语法点类型定义
 */
export interface GrammarPoint {
  id: string;
  name: string;
  description: string;
  example: string;
  examples?: string[];
  syntaxTree?: string;
  relatedPoints?: string[]; // 相关语法点ID
}

/**
 * 词汇项类型定义
 */
export interface VocabularyItem {
  word: string;
  definition: string;
  translation: string;
  partOfSpeech: string;
  pronunciation: string;
  examples: string[];
  synonyms?: string[];
  antonyms?: string[];
  notes?: string;
}

/**
 * 句子集类型定义
 */
export interface SentenceCollection {
  id: string;
  title: string;
  description: string;
  tags: string[];
  sentences: string[]; // 句子ID数组
  level?: SentenceDifficulty;
  icon?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 句子学习进度类型定义
 */
export interface SentenceLearningProgress {
  userId: string;
  sentenceId: string;
  status: 'new' | 'learning' | 'reviewing' | 'mastered';
  familiarity: number; // 0-100 熟悉度
  confidenceLevel?: number; // 1-5 自信度
  nextReviewDate?: string;
  lastReviewedAt?: string;
  reviewCount: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 句子笔记类型定义
 */
export interface SentenceNote {
  id: string;
  userId: string;
  sentenceId: string;
  content: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * 语法分析结果类型定义
 */
export interface GrammarAnalysis {
  sentenceId: string;
  components: {
    type: 'subject' | 'predicate' | 'object' | 'complement' | 'modifier' | 'other';
    text: string;
    translation?: string;
    explanation: string;
  }[];
  structure: string; // 如 "SVO", "SVC" 等
  explanation: string;
  syntaxTree: SyntaxTreeNode;
}

/**
 * 语法树节点
 */
export interface SyntaxTreeNode {
  id: string;
  type: string; // 例如：'NP', 'VP', 'PP' 等
  text: string;
  translation?: string;
  explanation?: string;
  children?: SyntaxTreeNode[];
}

/**
 * 练习记录
 */
export interface PracticeRecord {
  userId: string;
  sentenceId: string;
  timestamp: string;
  correct: boolean;
  timeSpent: number; // 毫秒
  practiceType: 'translation' | 'listening' | 'speaking' | 'fill-in-blank';
}

/**
 * 句子查询过滤条件
 */
export interface SentenceFilters {
  search?: string;
  difficulty?: SentenceDifficulty | 'all';
  tags?: string[];
  grammarPoints?: string[];
  status?: 'new' | 'learning' | 'reviewing' | 'mastered' | 'all';
  sortBy?: 'newest' | 'difficulty' | 'familiarity' | 'mastery';
  source?: {
    book?: string;
    lesson?: number;
  };
}

/**
 * 句子学习记录
 */
export interface SentenceStudyRecord {
  userId: string;
  sentenceId: string;
  timestamp: string;
  studyMode: 'reading' | 'listening' | 'grammar-analysis' | 'vocabulary';
  timeSpent: number; // 毫秒
} 