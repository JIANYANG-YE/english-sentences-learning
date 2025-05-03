/**
 * 类型定义
 * 
 * 注意：为避免模块重导出带来的类型名称冲突，
 * 请直接从具体的类型模块导入类型，例如：
 * 
 * import { User } from '@/types/auth';
 * import { Sentence } from '@/types/sentences';
 * import { Course } from '@/types/courses';
 * 
 * 本文件仅导出核心类型以保持向后兼容性
 */

// 导出核心类型
export type {
  CoreUser,
  CoreCourse,
  CoreLesson,
  CoreExercise,
  CoreProgress,
  CoreNote,
  PaginatedResponse,
  ApiResponse,
  SearchParams,
  UserRole,
  CourseLevel,
  ExerciseType,
  SortOrder,
} from '@/types/core';

// 导出句子相关类型
export type {
  Sentence,
  SentenceDifficulty,
  GrammarPoint,
  VocabularyItem
} from '@/types/sentences';

// 导出课程相关类型
export type {
  Book,
  Category
} from '@/types/courses';

// 向后兼容的类型别名
import type {
  CoreUser as User,
  CoreCourse as Course,
  CoreLesson as Lesson,
  CoreExercise as Exercise,
  CoreProgress as Progress,
  CoreNote as Note,
} from '@/types/core';

export type {
  User,
  Course,
  Lesson,
  Exercise,
  Progress,
  Note,
};

// 重新导出学习相关类型
export * from './learning';
export * from './courses';
export * from './user';
export * from './auth';
export * from './sentences';
export * from './materials'; 