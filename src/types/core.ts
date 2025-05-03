/**
 * 核心类型定义
 */

// 用户角色类型
export type UserRole = 'user' | 'admin';

// 课程难度类型
export type CourseLevel = 'beginner' | 'intermediate' | 'advanced';

// 习题类型
export type ExerciseType = 'multiple-choice' | 'fill-blank' | 'essay';

// 排序方向类型
export type SortOrder = 'asc' | 'desc';

// 用户类型
export interface CoreUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// 课程类型
export interface CoreCourse {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  price: number;
  discount?: number;
  level: CourseLevel;
  duration: number; // 分钟为单位
  lessons: CoreLesson[];
  createdAt: string;
  updatedAt: string;
  authorId: string;
  author?: CoreUser;
  tags: string[];
}

// 课程章节类型
export interface CoreLesson {
  id: string;
  title: string;
  description: string;
  videoUrl?: string;
  duration: number; // 分钟为单位
  order: number;
  courseId: string;
  createdAt: string;
  updatedAt: string;
  content?: string;
  exercises: CoreExercise[];
}

// 习题类型
export interface CoreExercise {
  id: string;
  question: string;
  lessonId: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  type: ExerciseType;
  createdAt: string;
  updatedAt: string;
}

// 用户课程进度
export interface CoreProgress {
  id: string;
  userId: string;
  courseId: string;
  lessonId: string;
  completed: boolean;
  lastAccessedAt: string;
  progress: number; // 0-100 表示进度百分比
  createdAt: string;
  updatedAt: string;
}

// 用户笔记
export interface CoreNote {
  id: string;
  userId: string;
  lessonId?: string;
  courseId?: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

// 分页响应
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// API请求响应
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// 搜索参数
export interface SearchParams {
  query?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: SortOrder;
  filters?: Record<string, unknown>;
} 