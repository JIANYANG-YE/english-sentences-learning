/**
 * 课程包类型定义
 */
export interface CoursePackage {
  id: string;
  title: string;
  description: string;
  price: number;
  isFree: boolean;
  isFeatured: boolean;
  level: 'beginner' | 'intermediate' | 'advanced';
  coverImage: string;
  totalLessons: number;
  completedLessons?: number;
  progress?: number;
  rating: number;
  ratingCount: number;
  features: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * 书籍类型定义
 */
export interface Book {
  id: string;
  title: string;
  description: string;
  level: 'beginner' | 'elementary' | 'intermediate' | 'advanced';
  coverImage: string;
  author: string;
  publisher?: string;
  publishYear?: number;
  totalChapters: number;
  totalLessons: number;
  language: string;
  tags: string[];
  lessons: Lesson[];
  createdAt: string;
  updatedAt: string;
}

/**
 * 类别类型定义
 */
export interface Category {
  id: string;
  name: string;
  description: string;
  icon?: string;
  slug: string;
  parentId?: string;
  order?: number;
  courseCount?: number;
  children?: Category[];
  createdAt: string;
  updatedAt: string;
}

/**
 * 课程类型定义 - 全功能版本，包含所有课程相关属性
 */
export interface Course {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'all-levels';
  category: string[];
  tags: string[];
  price: number;
  isFree: boolean;
  isFeatured: boolean;
  duration: number; // 课程总时长（分钟）
  totalLessons: number;
  author: {
    id: string;
    name: string;
    avatar?: string;
    bio?: string;
  };
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  rating: number;
  ratingCount: number;
  enrollmentCount: number;
  completionRate: number;
  lessons: Lesson[];
  requirements?: string[];
  targetAudience?: string[];
  features: CourseFeature[];
}

/**
 * 课程特点
 */
export interface CourseFeature {
  id: string;
  icon: string;
  title: string;
  description: string;
}

/**
 * 课程章节
 */
export interface CourseSection {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  order: number;
  lessonIds: string[];
  duration: number; // 章节总时长（分钟）
}

/**
 * 课程课时
 */
export interface Lesson {
  id: string;
  courseId: string;
  sectionId?: string;
  title: string;
  description: string;
  content: {
    english: string;
    chinese: string;
  };
  duration: number; // 课时时长（分钟）
  order: number;
  videoUrl?: string;
  audioUrl?: string;
  attachments?: {
    id: string;
    name: string;
    url: string;
    type: 'pdf' | 'image' | 'audio' | 'video' | 'document';
    size: number;
  }[];
  exercises: Exercise[];
  sentenceIds: string[]; // 相关句子ID列表
  grammarPoints: string[]; // 相关语法点ID列表
  isPreview: boolean; // 是否为预览课时
  subtitle?: string;
  progress?: number;
  lastStudied?: string | null;
  notes?: LessonNote[];
}

/**
 * 练习题
 */
export interface Exercise {
  id: string;
  lessonId: string;
  type: 'multiple-choice' | 'fill-blank' | 'matching' | 'reordering' | 'true-false' | 'open-ended';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  timeLimit?: number; // 秒
}

/**
 * 用户课程进度
 */
export interface CourseProgress {
  userId: string;
  courseId: string;
  enrolledAt: string;
  lastAccessedAt: string;
  completedLessons: string[]; // 已完成课时ID列表
  completedExercises: string[]; // 已完成练习ID列表
  currentLessonId?: string; // 当前学习的课时ID
  progress: number; // 总进度百分比 0-100
  certificateIssued: boolean; // 是否已发放证书
  certificateUrl?: string;
  notes: LessonNote[]; // 学习笔记
}

/**
 * 课时笔记
 */
export interface LessonNote {
  id: string;
  userId: string;
  courseId: string;
  lessonId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
}

/**
 * 用户课程评价
 */
export interface CourseReview {
  id: string;
  userId: string;
  courseId: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
  updatedAt: string;
  helpfulCount: number; // 有帮助的数量
  replyCount: number; // 回复数量
  isVerifiedPurchase: boolean; // 是否为已验证购买
}

/**
 * 课程搜索过滤条件
 */
export interface CourseFilters {
  search?: string;
  category?: string[];
  level?: ('beginner' | 'intermediate' | 'advanced' | 'all-levels')[];
  priceRange?: {
    min: number;
    max: number;
  };
  isFree?: boolean;
  tags?: string[];
  rating?: number; // 最低评分
  sortBy?: 'popularity' | 'price-low-high' | 'price-high-low' | 'rating' | 'newest';
}

/**
 * 课程单元类型定义
 */
export interface CourseUnit {
  id: string;
  courseId: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
  completed?: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * 语法点类型定义
 */
export interface GrammarPoint {
  id: string;
  title: string;
  explanation: string;
  example: string;
  sentences: string[];
  syntaxTree?: string;
}

/**
 * 词汇项类型定义
 */
export interface VocabularyItem {
  id: string;
  word: string;
  definition: string;
  partOfSpeech: string;
  pronunciation: string;
  examples: string[];
  related?: string[];
}

/**
 * 简化课程类型 - 用于展示的简化版本
 */
export interface SimpleCourse {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  level: string;
  lessonsCount: number;
  price: string;
  rating: number;
  reviewsCount: number;
  lessons?: Lesson[];
}

/**
 * 简化课程集合
 */
export type SimpleCourseData = Record<string, SimpleCourse>;

/**
 * 简化课程内容
 */
export interface SimpleLessonContent {
  english: string;
  chinese: string;
  vocabulary?: {
    word: string;
    meaning: string;
    example: string;
  }[];
  grammarPoints?: {
    point: string;
    explanation: string;
  }[];
  keyPhrases?: {
    phrase: string;
    meaning: string;
    example: string;
  }[];
}

/**
 * 笔记
 */
export interface Note {
  id: string;
  timestamp: string;
  highlight: string;
  note: string;
  type: string;
  paragraphIndex: number;
}

// 向后兼容导出，确保现有代码不会因为类型变更而出错
export * from './contentTypes';
export * from './courseTypes';
export * from './packageTypes'; 