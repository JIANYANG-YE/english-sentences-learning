/**
 * 课程类型定义文件 
 * 用于定义不同类型的课程（书籍、电影、教材等）
 */

import { CourseLevel } from '../core';

// 课程类型
export type CourseType = 'book' | 'movie' | 'textbook' | 'article' | 'dialogue' | 'speech';

// 基础课程接口
export interface CourseBase {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  type: CourseType;
  level: CourseLevel;
  price: number;
  isFree: boolean;
  isFeatured: boolean;
  tags: string[];
  category: string[];
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

// 书籍类型课程
export interface BookCourse extends CourseBase {
  type: 'book';
  author: string;
  publisher?: string;
  publishYear: number;
  isbn?: string;
  pages?: number;
  genre?: string[];
}

// 电影类型课程
export interface MovieCourse extends CourseBase {
  type: 'movie';
  director: string;
  cast: string[];
  releaseYear: number;
  duration: number; // 分钟
  genre?: string[];
  rating?: string; // 电影分级
}

// 教材类型课程
export interface TextbookCourse extends CourseBase {
  type: 'textbook';
  author: string;
  publisher?: string;
  publishYear: number;
  edition?: string;
  subject?: string;
  grade?: string;
}

// 文章类型课程
export interface ArticleCourse extends CourseBase {
  type: 'article';
  author: string;
  source?: string;
  publicationDate?: string;
  topic?: string[];
}

// 对话类型课程
export interface DialogueCourse extends CourseBase {
  type: 'dialogue';
  scenario: string;
  speakers: number;
  difficulty: string;
  topics: string[];
}

// 演讲类型课程
export interface SpeechCourse extends CourseBase {
  type: 'speech';
  speaker: string;
  event?: string;
  date?: string;
  topic?: string[];
  duration: number; // 分钟
}

// 综合课程类型（联合类型）
export type ExtendedCourse = 
  | BookCourse 
  | MovieCourse 
  | TextbookCourse 
  | ArticleCourse
  | DialogueCourse
  | SpeechCourse;

// 课程类型守卫函数，用于类型判断
export function isBookCourse(course: ExtendedCourse): course is BookCourse {
  return course.type === 'book';
}

export function isMovieCourse(course: ExtendedCourse): course is MovieCourse {
  return course.type === 'movie';
}

export function isTextbookCourse(course: ExtendedCourse): course is TextbookCourse {
  return course.type === 'textbook';
}

export function isArticleCourse(course: ExtendedCourse): course is ArticleCourse {
  return course.type === 'article';
}

export function isDialogueCourse(course: ExtendedCourse): course is DialogueCourse {
  return course.type === 'dialogue';
}

export function isSpeechCourse(course: ExtendedCourse): course is SpeechCourse {
  return course.type === 'speech';
} 