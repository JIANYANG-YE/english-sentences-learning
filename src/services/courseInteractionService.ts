/**
 * 课程交互服务
 * 负责处理用户与课程的交互，如收藏、评分、笔记等
 */

import { CourseNote } from '@/components/learning/CourseNoteEditor';

// 模拟本地存储
const FAVORITES_STORAGE_KEY = 'user_course_favorites';
const RATINGS_STORAGE_KEY = 'user_course_ratings';
const NOTES_STORAGE_KEY = 'user_course_notes';

export interface CourseRating {
  userId: string;
  courseId: string;
  rating: number;  // 1-5
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CourseFavorite {
  userId: string;
  courseId: string;
  addedAt: string;
  category?: string;
}

class CourseInteractionService {
  /**
   * 获取本地存储中的数据
   */
  private getFromStorage<T>(key: string): T[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error(`读取${key}失败:`, error);
      return [];
    }
  }
  
  /**
   * 保存数据到本地存储
   */
  private saveToStorage<T>(key: string, data: T[]): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`保存${key}失败:`, error);
    }
  }
  
  /**
   * 检查课程是否已被收藏
   */
  isFavorite(userId: string, courseId: string): boolean {
    const favorites = this.getFromStorage<CourseFavorite>(FAVORITES_STORAGE_KEY);
    return favorites.some(f => f.userId === userId && f.courseId === courseId);
  }
  
  /**
   * 获取用户的所有收藏课程
   */
  getUserFavorites(userId: string): CourseFavorite[] {
    const favorites = this.getFromStorage<CourseFavorite>(FAVORITES_STORAGE_KEY);
    return favorites.filter(f => f.userId === userId);
  }
  
  /**
   * 添加课程到收藏
   */
  addToFavorites(userId: string, courseId: string, category?: string): void {
    // 首先检查是否已收藏
    if (this.isFavorite(userId, courseId)) return;
    
    const favorites = this.getFromStorage<CourseFavorite>(FAVORITES_STORAGE_KEY);
    const newFavorite: CourseFavorite = {
      userId,
      courseId,
      addedAt: new Date().toISOString(),
      category
    };
    
    favorites.push(newFavorite);
    this.saveToStorage(FAVORITES_STORAGE_KEY, favorites);
  }
  
  /**
   * 从收藏中移除课程
   */
  removeFromFavorites(userId: string, courseId: string): void {
    const favorites = this.getFromStorage<CourseFavorite>(FAVORITES_STORAGE_KEY);
    const updatedFavorites = favorites.filter(
      f => !(f.userId === userId && f.courseId === courseId)
    );
    
    this.saveToStorage(FAVORITES_STORAGE_KEY, updatedFavorites);
  }
  
  /**
   * 获取课程的用户评分
   */
  getCourseRating(userId: string, courseId: string): CourseRating | null {
    const ratings = this.getFromStorage<CourseRating>(RATINGS_STORAGE_KEY);
    return ratings.find(r => r.userId === userId && r.courseId === courseId) || null;
  }
  
  /**
   * 获取课程的所有评分
   */
  getAllCourseRatings(courseId: string): CourseRating[] {
    const ratings = this.getFromStorage<CourseRating>(RATINGS_STORAGE_KEY);
    return ratings.filter(r => r.courseId === courseId);
  }
  
  /**
   * 计算课程的平均评分
   */
  calculateAverageRating(courseId: string): {
    average: number;
    count: number;
    distribution: number[];
  } {
    const ratings = this.getAllCourseRatings(courseId);
    
    if (ratings.length === 0) {
      return { average: 0, count: 0, distribution: [0, 0, 0, 0, 0] };
    }
    
    const sum = ratings.reduce((acc, rating) => acc + rating.rating, 0);
    const average = sum / ratings.length;
    
    // 计算评分分布 (1-5星的数量)
    const distribution = [0, 0, 0, 0, 0];
    ratings.forEach(rating => {
      if (rating.rating >= 1 && rating.rating <= 5) {
        distribution[rating.rating - 1]++;
      }
    });
    
    return {
      average,
      count: ratings.length,
      distribution
    };
  }
  
  /**
   * 为课程评分
   */
  rateCourse(userId: string, courseId: string, rating: number, comment?: string): CourseRating {
    if (rating < 1 || rating > 5) {
      throw new Error('评分必须在1到5之间');
    }
    
    const ratings = this.getFromStorage<CourseRating>(RATINGS_STORAGE_KEY);
    const existingRatingIndex = ratings.findIndex(
      r => r.userId === userId && r.courseId === courseId
    );
    
    const now = new Date().toISOString();
    
    // 更新现有评分或添加新评分
    if (existingRatingIndex !== -1) {
      ratings[existingRatingIndex].rating = rating;
      ratings[existingRatingIndex].comment = comment;
      ratings[existingRatingIndex].updatedAt = now;
      this.saveToStorage(RATINGS_STORAGE_KEY, ratings);
      return ratings[existingRatingIndex];
    } else {
      const newRating: CourseRating = {
        userId,
        courseId,
        rating,
        comment,
        createdAt: now,
        updatedAt: now
      };
      
      ratings.push(newRating);
      this.saveToStorage(RATINGS_STORAGE_KEY, ratings);
      return newRating;
    }
  }
  
  /**
   * 获取用户的所有笔记
   */
  getUserNotes(userId: string): CourseNote[] {
    // 在实际应用中，我们需要将userId附加到笔记上
    // 这里我们假设所有笔记都属于当前用户
    return this.getFromStorage<CourseNote>(NOTES_STORAGE_KEY);
  }
  
  /**
   * 获取特定课程的笔记
   */
  getCourseNotes(courseId: string): CourseNote[] {
    const notes = this.getFromStorage<CourseNote>(NOTES_STORAGE_KEY);
    return notes.filter(note => note.courseId === courseId);
  }
  
  /**
   * 获取特定课时的笔记
   */
  getLessonNotes(courseId: string, lessonId: string): CourseNote[] {
    const notes = this.getFromStorage<CourseNote>(NOTES_STORAGE_KEY);
    return notes.filter(note => note.courseId === courseId && note.lessonId === lessonId);
  }
  
  /**
   * 保存笔记
   */
  saveNote(note: CourseNote): CourseNote {
    const notes = this.getFromStorage<CourseNote>(NOTES_STORAGE_KEY);
    const existingNoteIndex = notes.findIndex(n => n.id === note.id);
    
    if (existingNoteIndex !== -1) {
      // 更新现有笔记
      notes[existingNoteIndex] = {
        ...note,
        updatedAt: new Date().toISOString()
      };
    } else {
      // 添加新笔记
      notes.push({
        ...note,
        createdAt: note.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    
    this.saveToStorage(NOTES_STORAGE_KEY, notes);
    return note;
  }
  
  /**
   * 删除笔记
   */
  deleteNote(noteId: string): boolean {
    const notes = this.getFromStorage<CourseNote>(NOTES_STORAGE_KEY);
    const updatedNotes = notes.filter(note => note.id !== noteId);
    
    if (updatedNotes.length !== notes.length) {
      this.saveToStorage(NOTES_STORAGE_KEY, updatedNotes);
      return true;
    }
    
    return false; // 没有找到要删除的笔记
  }
  
  /**
   * 搜索笔记
   */
  searchNotes(query: string): CourseNote[] {
    if (!query.trim()) return [];
    
    const notes = this.getFromStorage<CourseNote>(NOTES_STORAGE_KEY);
    const lowerQuery = query.toLowerCase();
    
    return notes.filter(note => 
      note.content.toLowerCase().includes(lowerQuery) ||
      note.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }
}

export default new CourseInteractionService(); 