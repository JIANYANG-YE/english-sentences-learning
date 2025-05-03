import { get, post } from '@/lib/api';

/**
 * 学习位置信息接口
 */
export interface LearningPosition {
  userId: string;
  courseId: string;
  lessonId: string;
  mode: string;
  position: number; // 当前学习位置（如句子索引）
  timestamp: string; // 最后学习时间戳
  contextData?: {
    // 额外的上下文数据，如当前学习模式的特定状态
    [key: string]: any;
  };
}

/**
 * 课程续学信息
 */
export interface CourseResumeInfo {
  courseId: string;
  title: string;
  lessonId: string;
  lessonTitle: string;
  mode: string;
  progress: number;
  lastPosition: number;
  lastStudied: string;
  estimatedTimeToComplete: number; // 预计完成剩余内容所需时间（分钟）
}

/**
 * 续学推荐
 */
export interface LearningRecommendation {
  type: 'continue' | 'review' | 'new';
  courseId: string;
  lessonId: string;
  mode: string;
  title: string;
  description: string;
  reason: string;
  priority: number; // 优先级 1-10
}

// 本地存储键前缀
const STORAGE_KEY_PREFIX = 'eng_learn_';

/**
 * 续学服务
 * 管理用户的学习位置和提供智能续学功能
 */
class ResumeLearningService {
  // 缓存
  private positionsCache: Map<string, LearningPosition> = new Map();
  private inProgressCache: Map<string, CourseResumeInfo[]> = new Map();
  private recommendationsCache: Map<string, {data: LearningRecommendation[], timestamp: number}> = new Map();
  
  /**
   * 保存学习位置
   * @param position 学习位置信息
   */
  async savePosition(position: Omit<LearningPosition, 'timestamp'>): Promise<LearningPosition> {
    if (!position.userId || !position.courseId || !position.lessonId) {
      console.error('保存学习位置失败: 缺少必要参数');
      throw new Error('保存学习位置需要提供userId, courseId和lessonId');
    }
    
    try {
      const positionWithTime: LearningPosition = {
        ...position,
        timestamp: new Date().toISOString()
      };
      
      // 更新缓存
      const cacheKey = this.getPositionCacheKey(position.userId, position.courseId, position.lessonId);
      this.positionsCache.set(cacheKey, positionWithTime);
      
      // 尝试API保存
      const response = await post<LearningPosition>('/api/learning/position', positionWithTime);
      
      // 学习位置更新后清除相关缓存
      this.clearUserRelatedCache(position.userId);
      
      return response;
    } catch (error) {
      console.error('保存学习位置到API失败:', error);
      // 如果API调用失败，保存到本地存储
      const positionWithTime: LearningPosition = {
        ...position,
        timestamp: new Date().toISOString()
      };
      this.savePositionToLocalStorage(positionWithTime);
      return positionWithTime;
    }
  }

  /**
   * 获取最近的学习位置
   * @param userId 用户ID
   * @param courseId 课程ID
   * @param lessonId 课时ID (可选)
   */
  async getLastPosition(userId: string, courseId: string, lessonId?: string): Promise<LearningPosition | null> {
    if (!userId || !courseId) {
      console.error('获取学习位置失败: 缺少必要参数');
      return null;
    }
    
    // 检查缓存
    const cacheKey = this.getPositionCacheKey(userId, courseId, lessonId);
    if (this.positionsCache.has(cacheKey)) {
      return this.positionsCache.get(cacheKey) || null;
    }
    
    try {
      let url = `/api/learning/position?userId=${encodeURIComponent(userId)}&courseId=${encodeURIComponent(courseId)}`;
      if (lessonId) {
        url += `&lessonId=${encodeURIComponent(lessonId)}`;
      }
      
      const position = await get<LearningPosition>(url);
      
      // 更新缓存
      if (position) {
        this.positionsCache.set(cacheKey, position);
      }
      
      return position;
    } catch (error) {
      console.error('从API获取学习位置失败:', error);
      // 如果API调用失败，尝试从本地存储获取
      const localPosition = this.getPositionFromLocalStorage(userId, courseId, lessonId);
      
      // 更新缓存
      if (localPosition) {
        this.positionsCache.set(cacheKey, localPosition);
      }
      
      return localPosition;
    }
  }

  /**
   * 获取用户的学习推荐
   * @param userId 用户ID
   * @param limit 推荐数量
   * @param forceFresh 强制刷新缓存
   */
  async getRecommendations(userId: string, limit: number = 3, forceFresh: boolean = false): Promise<LearningRecommendation[]> {
    if (!userId) {
      console.error('获取学习推荐失败: 缺少用户ID');
      return [];
    }
    
    const cacheKey = `recommendations_${userId}_${limit}`;
    
    // 检查缓存是否有效（10分钟内有效）
    if (!forceFresh && this.recommendationsCache.has(cacheKey)) {
      const cached = this.recommendationsCache.get(cacheKey);
      if (cached && (Date.now() - cached.timestamp < 10 * 60 * 1000)) {
        return cached.data;
      }
    }
    
    try {
      const response = await get<LearningRecommendation[]>(
        `/api/learning/recommendations?userId=${encodeURIComponent(userId)}&limit=${limit}`
      );
      
      // 更新缓存
      this.recommendationsCache.set(cacheKey, {
        data: response,
        timestamp: Date.now()
      });
      
      return response;
    } catch (error) {
      console.error('从API获取学习推荐失败:', error);
      
      // 尝试使用缓存（即使已过期）
      if (this.recommendationsCache.has(cacheKey)) {
        const cached = this.recommendationsCache.get(cacheKey);
        if (cached) {
          console.log('使用过期缓存的推荐数据');
          return cached.data;
        }
      }
      
      // 生成后备推荐
      const fallbackRecommendations = this.generateFallbackRecommendations(userId);
      
      // 更新缓存
      this.recommendationsCache.set(cacheKey, {
        data: fallbackRecommendations,
        timestamp: Date.now()
      });
      
      return fallbackRecommendations;
    }
  }

  /**
   * 获取所有进行中的课程信息
   * @param userId 用户ID
   * @param forceFresh 强制刷新缓存
   */
  async getInProgressCourses(userId: string, forceFresh: boolean = false): Promise<CourseResumeInfo[]> {
    if (!userId) {
      console.error('获取进行中课程失败: 缺少用户ID');
      return [];
    }
    
    const cacheKey = `inprogress_${userId}`;
    
    // 检查缓存
    if (!forceFresh && this.inProgressCache.has(cacheKey)) {
      return this.inProgressCache.get(cacheKey) || [];
    }
    
    try {
      const courses = await get<CourseResumeInfo[]>(
        `/api/learning/in-progress?userId=${encodeURIComponent(userId)}`
      );
      
      // 更新缓存
      this.inProgressCache.set(cacheKey, courses);
      
      return courses;
    } catch (error) {
      console.error('从API获取进行中课程失败:', error);
      
      // 尝试通过本地存储生成进行中课程列表
      const localCourses = this.generateInProgressCoursesFromStorage(userId);
      
      // 更新缓存
      this.inProgressCache.set(cacheKey, localCourses);
      
      return localCourses;
    }
  }

  /**
   * 生成一个课程的续学URL
   * @param courseId 课程ID
   * @param lessonId 课时ID
   * @param mode 学习模式
   * @param position 位置
   */
  generateResumeUrl(courseId: string, lessonId: string, mode: string, position: number = 0): string {
    if (!courseId || !lessonId || !mode) {
      console.error('生成续学URL失败: 缺少必要参数');
      return '/my-courses'; // 返回到课程列表页面
    }
    
    let url = `/courses/${encodeURIComponent(courseId)}/lessons/${encodeURIComponent(lessonId)}/${encodeURIComponent(mode)}`;
    if (position > 0) {
      url += `?position=${position}`;
    }
    return url;
  }
  
  /**
   * 清除与指定用户相关的所有缓存
   * @param userId 用户ID
   */
  public clearUserRelatedCache(userId: string): void {
    if (!userId) return;
    
    // 清除推荐缓存
    for (const key of this.recommendationsCache.keys()) {
      if (key.includes(userId)) {
        this.recommendationsCache.delete(key);
      }
    }
    
    // 清除进行中课程缓存
    this.inProgressCache.delete(`inprogress_${userId}`);
    
    // 清除位置缓存（可能影响性能，可考虑精确清除）
    for (const key of this.positionsCache.keys()) {
      if (key.includes(userId)) {
        this.positionsCache.delete(key);
      }
    }
  }

  // 私有方法: 保存位置到本地存储
  private savePositionToLocalStorage(position: LearningPosition): void {
    if (!position.userId || !position.courseId || !position.lessonId) return;
    
    try {
      const key = `${STORAGE_KEY_PREFIX}position_${position.userId}_${position.courseId}_${position.lessonId}`;
      localStorage.setItem(key, JSON.stringify(position));
      
      // 也保存一个课程级别的最新位置
      const courseKey = `${STORAGE_KEY_PREFIX}latest_${position.userId}_${position.courseId}`;
      localStorage.setItem(courseKey, position.lessonId);
    } catch (e) {
      console.error('保存到本地存储失败:', e);
    }
  }

  // 私有方法: 从本地存储获取位置
  private getPositionFromLocalStorage(userId: string, courseId: string, lessonId?: string): LearningPosition | null {
    try {
      if (lessonId) {
        // 如果提供了lessonId，直接获取特定位置
        const key = `${STORAGE_KEY_PREFIX}position_${userId}_${courseId}_${lessonId}`;
        const storedPosition = localStorage.getItem(key);
        return storedPosition ? JSON.parse(storedPosition) as LearningPosition : null;
      } else {
        // 否则，获取课程的最新位置
        const courseKey = `${STORAGE_KEY_PREFIX}latest_${userId}_${courseId}`;
        const latestLessonId = localStorage.getItem(courseKey);
        
        if (latestLessonId) {
          const key = `${STORAGE_KEY_PREFIX}position_${userId}_${courseId}_${latestLessonId}`;
          const storedPosition = localStorage.getItem(key);
          return storedPosition ? JSON.parse(storedPosition) as LearningPosition : null;
        }
      }
      
      return null;
    } catch (e) {
      console.error('从本地存储获取失败:', e);
      return null;
    }
  }

  // 私有方法: 生成后备推荐
  private generateFallbackRecommendations(userId: string): LearningRecommendation[] {
    // 从本地存储获取最近的学习记录
    const recentLearning: LearningRecommendation[] = [];
    
    try {
      // 遍历本地存储查找学习记录
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.includes(`${STORAGE_KEY_PREFIX}position_${userId}`)) {
          const position = JSON.parse(localStorage.getItem(key) || '{}') as LearningPosition;
          
          // 检查数据完整性
          if (position.courseId && position.lessonId && position.timestamp) {
            // 按时间戳排序，找出最近的记录
            recentLearning.push({
              type: 'continue',
              courseId: position.courseId,
              lessonId: position.lessonId,
              mode: position.mode,
              title: '继续上次学习',
              description: '从你上次离开的地方继续',
              reason: '基于本地保存的学习记录',
              priority: this.calculatePriority(position.timestamp)
            });
          }
        }
      }
    } catch (e) {
      console.error('生成后备推荐失败:', e);
    }
    
    // 按优先级排序
    recentLearning.sort((a, b) => b.priority - a.priority);
    
    return recentLearning.slice(0, 3); // 最多返回3个推荐
  }
  
  // 私有方法: 从本地存储生成进行中课程列表
  private generateInProgressCoursesFromStorage(userId: string): CourseResumeInfo[] {
    const courses: Map<string, Partial<CourseResumeInfo>> = new Map();
    
    try {
      // 从本地存储中搜集课程信息
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.includes(`${STORAGE_KEY_PREFIX}position_${userId}`)) {
          const position = JSON.parse(localStorage.getItem(key) || '{}') as LearningPosition;
          
          if (!position.courseId || !position.lessonId) continue;
          
          // 提取课程ID和上次学习时间
          const { courseId, lessonId, mode, timestamp, position: lastPosition } = position;
          
          // 如果没有记录或找到更新的记录，则更新
          if (!courses.has(courseId) || 
              (timestamp && courses.get(courseId)?.lastStudied && 
               new Date(timestamp) > new Date(courses.get(courseId)?.lastStudied || ''))) {
            
            courses.set(courseId, {
              courseId,
              lessonId,
              mode,
              lastPosition: lastPosition || 0,
              lastStudied: timestamp,
              // 以下字段需要从其他地方获取，这里使用占位值
              title: `课程 ${courseId}`,
              lessonTitle: `课时 ${lessonId}`,
              progress: 0,
              estimatedTimeToComplete: 0
            });
          }
        }
      }
    } catch (e) {
      console.error('从本地存储生成进行中课程列表失败:', e);
    }
    
    // 转换为数组并按最近学习时间排序
    return Array.from(courses.values())
      .filter(course => course.lastStudied) // 确保有学习记录
      .sort((a, b) => {
        const dateA = a.lastStudied ? new Date(a.lastStudied).getTime() : 0;
        const dateB = b.lastStudied ? new Date(b.lastStudied).getTime() : 0;
        return dateB - dateA;
      }) as CourseResumeInfo[];
  }
  
  // 私有方法: 计算推荐优先级
  private calculatePriority(timestamp: string): number {
    // 基于时间计算优先级：最近的学习记录优先级更高
    const now = new Date();
    const studyTime = new Date(timestamp);
    const hoursSince = (now.getTime() - studyTime.getTime()) / (1000 * 60 * 60);
    
    if (hoursSince < 24) return 10; // 24小时内学习的内容
    if (hoursSince < 72) return 8; // 3天内学习的内容
    if (hoursSince < 168) return 6; // 一周内学习的内容
    if (hoursSince < 336) return 4; // 两周内学习的内容
    return 2; // 更早之前学习的内容
  }
  
  // 生成位置缓存键
  private getPositionCacheKey(userId: string, courseId: string, lessonId?: string): string {
    return lessonId 
      ? `position_${userId}_${courseId}_${lessonId}`
      : `position_${userId}_${courseId}`;
  }
}

export default new ResumeLearningService(); 