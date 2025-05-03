import { get, post } from '@/lib/api';

/**
 * 学习进度数据
 */
export interface LearningProgress {
  userId: string;
  courseId: string;
  lessonId: string;
  mode: string;
  completedItems: number;
  totalItems: number;
  correctCount: number;
  incorrectCount: number;
  timeSpent: number; // 以秒为单位
  lastPosition: number;
  lastAccessAt: string;
  completedAt?: string;
}

/**
 * 学习会话数据
 */
export interface LearningSession {
  id: string;
  userId: string;
  startTime: string;
  endTime: string;
  duration: number; // 以秒为单位
  courseId?: string;
  lessonId?: string;
  mode?: string;
  itemsCompleted: number;
  correctCount: number;
  errorCount: number;
  difficulty: 'easy' | 'medium' | 'hard';
  focusLevel: number; // 1-10
  device: string;
  location?: string;
}

/**
 * 词汇掌握数据
 */
export interface VocabularyMastery {
  userId: string;
  word: string;
  translation: string;
  recognitionLevel: number; // 1-5
  productionLevel: number; // 1-5
  exposure: number;
  lastReviewed: string;
  nextReviewDue: string;
  courseIds: string[];
  tags: string[];
}

/**
 * 学习目标数据
 */
export interface LearningGoal {
  id: string;
  userId: string;
  type: 'daily' | 'weekly' | 'monthly' | 'course';
  metric: 'time' | 'words' | 'sentences' | 'courses' | 'lessons';
  target: number;
  current: number;
  startDate: string;
  endDate?: string;
  status: 'active' | 'completed' | 'failed';
  relatedCourseId?: string;
}

/**
 * 学习分析服务
 * 提供学习数据的跟踪、分析和生成洞察
 */
class LearningAnalyticsService {
  /**
   * 记录学习进度
   * @param progress 学习进度数据
   */
  async saveProgress(progress: Omit<LearningProgress, 'lastAccessAt'>): Promise<LearningProgress> {
    try {
      const progressWithTime = {
        ...progress,
        lastAccessAt: new Date().toISOString()
      };
      
      return await post<LearningProgress>('/api/analytics/progress', progressWithTime);
    } catch (error) {
      console.error('保存学习进度失败:', error);
      throw new Error(`保存学习进度失败: ${(error as Error).message}`);
    }
  }

  /**
   * 记录学习会话
   * @param session 学习会话数据
   */
  async saveSession(session: Omit<LearningSession, 'id'>): Promise<LearningSession> {
    try {
      return await post<LearningSession>('/api/analytics/sessions', session);
    } catch (error) {
      console.error('保存学习会话失败:', error);
      throw new Error(`保存学习会话失败: ${(error as Error).message}`);
    }
  }

  /**
   * 更新词汇掌握度
   * @param mastery 词汇掌握数据
   */
  async updateVocabularyMastery(mastery: VocabularyMastery): Promise<VocabularyMastery> {
    try {
      return await post<VocabularyMastery>('/api/analytics/vocabulary', mastery);
    } catch (error) {
      console.error('更新词汇掌握度失败:', error);
      throw new Error(`更新词汇掌握度失败: ${(error as Error).message}`);
    }
  }

  /**
   * 获取用户的课程学习进度
   * @param userId 用户ID
   * @param courseId 课程ID
   */
  async getCourseProgress(userId: string, courseId: string): Promise<{
    overall: number;
    byLesson: { lessonId: string; progress: number }[];
    startedAt: string;
    lastAccessAt: string;
    estimatedTimeToComplete: number;
  }> {
    try {
      return await get(`/api/analytics/progress/${userId}/courses/${courseId}`);
    } catch (error) {
      console.error('获取课程进度失败:', error);
      throw new Error(`获取课程进度失败: ${(error as Error).message}`);
    }
  }

  /**
   * 获取用户的所有学习目标
   * @param userId 用户ID
   */
  async getUserGoals(userId: string): Promise<LearningGoal[]> {
    try {
      return await get<LearningGoal[]>(`/api/analytics/goals?userId=${userId}`);
    } catch (error) {
      console.error('获取学习目标失败:', error);
      throw new Error(`获取学习目标失败: ${(error as Error).message}`);
    }
  }

  /**
   * 创建新学习目标
   * @param goal 学习目标数据
   */
  async createGoal(goal: Omit<LearningGoal, 'id'>): Promise<LearningGoal> {
    try {
      return await post<LearningGoal>('/api/analytics/goals', goal);
    } catch (error) {
      console.error('创建学习目标失败:', error);
      throw new Error(`创建学习目标失败: ${(error as Error).message}`);
    }
  }

  /**
   * 获取用户的学习统计数据
   * @param userId 用户ID
   * @param timeframe 时间范围
   */
  async getUserStats(userId: string, timeframe: 'day' | 'week' | 'month' | 'year' | 'all' = 'all'): Promise<{
    totalTimeSpent: number;
    totalSessions: number;
    wordsLearned: number;
    sentencesReviewed: number;
    averageAccuracy: number;
    activeDays: number;
    strongestAreas: { area: string; score: number }[];
    weakestAreas: { area: string; score: number }[];
    learningTrend: { date: string; timeSpent: number; itemsCompleted: number }[];
  }> {
    try {
      return await get(`/api/analytics/stats/${userId}?timeframe=${timeframe}`);
    } catch (error) {
      console.error('获取学习统计失败:', error);
      throw new Error(`获取学习统计失败: ${(error as Error).message}`);
    }
  }

  /**
   * 获取用户的词汇掌握数据
   * @param userId 用户ID
   * @param filter 过滤条件
   */
  async getVocabularyMastery(
    userId: string,
    filter?: {
      level?: number;
      courseId?: string;
      tags?: string[];
      searchQuery?: string;
    }
  ): Promise<VocabularyMastery[]> {
    try {
      let url = `/api/analytics/vocabulary/${userId}`;
      const params = new URLSearchParams();
      
      if (filter) {
        if (filter.level) params.append('level', filter.level.toString());
        if (filter.courseId) params.append('courseId', filter.courseId);
        if (filter.tags && filter.tags.length) params.append('tags', filter.tags.join(','));
        if (filter.searchQuery) params.append('q', filter.searchQuery);
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      return await get<VocabularyMastery[]>(url);
    } catch (error) {
      console.error('获取词汇掌握数据失败:', error);
      throw new Error(`获取词汇掌握数据失败: ${(error as Error).message}`);
    }
  }

  /**
   * 获取学习会话历史
   * @param userId 用户ID
   * @param limit 限制返回数量
   * @param offset 偏移量
   */
  async getSessionHistory(userId: string, limit: number = 10, offset: number = 0): Promise<{
    total: number;
    sessions: LearningSession[];
  }> {
    try {
      return await get(`/api/analytics/sessions/${userId}?limit=${limit}&offset=${offset}`);
    } catch (error) {
      console.error('获取学习会话历史失败:', error);
      throw new Error(`获取学习会话历史失败: ${(error as Error).message}`);
    }
  }

  /**
   * 生成个性化学习洞察
   * @param userId 用户ID
   */
  async generateInsights(userId: string): Promise<{
    productivityInsights: { insight: string; confidence: number }[];
    vocabularyInsights: { insight: string; confidence: number }[];
    habitInsights: { insight: string; confidence: number }[];
    recommendedActions: { action: string; reason: string; priority: number }[];
  }> {
    try {
      return await get(`/api/analytics/insights/${userId}`);
    } catch (error) {
      console.error('生成学习洞察失败:', error);
      throw new Error(`生成学习洞察失败: ${(error as Error).message}`);
    }
  }

  /**
   * 预测完成课程所需时间
   * @param userId 用户ID
   * @param courseId 课程ID
   */
  async predictCompletionTime(userId: string, courseId: string): Promise<{
    estimatedDays: number;
    estimatedHours: number;
    confidence: number;
    factorsConsidered: string[];
    completionDate: string;
  }> {
    try {
      return await get(`/api/analytics/predict/completion/${userId}/${courseId}`);
    } catch (error) {
      console.error('预测完成时间失败:', error);
      throw new Error(`预测完成时间失败: ${(error as Error).message}`);
    }
  }

  /**
   * 获取学习时间分布
   * @param userId 用户ID
   * @param timeframe 时间范围
   */
  async getTimeDistribution(userId: string, timeframe: 'week' | 'month' = 'week'): Promise<{
    byHourOfDay: { hour: number; minutes: number }[];
    byDayOfWeek: { day: number; minutes: number }[];
    mostProductiveTime: { start: string; end: string };
    suggestedSchedule: { day: string; timeSlots: { start: string; end: string; reason: string }[] }[];
  }> {
    try {
      return await get(`/api/analytics/time-distribution/${userId}?timeframe=${timeframe}`);
    } catch (error) {
      console.error('获取时间分布失败:', error);
      throw new Error(`获取时间分布失败: ${(error as Error).message}`);
    }
  }

  /**
   * 分析学习效率
   * @param userId 用户ID
   */
  async analyzeEfficiency(userId: string): Promise<{
    overallEfficiency: number; // 1-100
    timeEfficiency: number;
    retentionRate: number;
    errorRate: number;
    focusScore: number;
    improvementAreas: { area: string; score: number; suggestion: string }[];
    comparison: { metric: string; user: number; average: number; percentile: number }[];
  }> {
    try {
      return await get(`/api/analytics/efficiency/${userId}`);
    } catch (error) {
      console.error('分析学习效率失败:', error);
      throw new Error(`分析学习效率失败: ${(error as Error).message}`);
    }
  }

  /**
   * 获取复习建议
   * @param userId 用户ID
   */
  async getReviewRecommendations(userId: string): Promise<{
    urgentItems: { type: string; id: string; content: string; reason: string }[];
    dueForReview: { type: string; id: string; content: string; dueDate: string }[];
    weakAreas: { area: string; items: { id: string; content: string }[] }[];
  }> {
    try {
      return await get(`/api/analytics/review-recommendations/${userId}`);
    } catch (error) {
      console.error('获取复习建议失败:', error);
      throw new Error(`获取复习建议失败: ${(error as Error).message}`);
    }
  }

  /**
   * 生成进度报告
   * @param userId 用户ID
   * @param timeframe 时间范围
   */
  async generateProgressReport(userId: string, timeframe: 'week' | 'month'): Promise<{
    summary: {
      timeSpent: number;
      sessionsCompleted: number;
      wordsLearned: number;
      sentencesReviewed: number;
      coursesProgressed: { courseId: string; title: string; progress: number }[];
    };
    goals: {
      achieved: { goal: string; achievedDate: string }[];
      inProgress: { goal: string; progress: number; remaining: string }[];
    };
    strengths: string[];
    areasForImprovement: string[];
    nextSteps: string[];
    comparisonToPrevious: { metric: string; current: number; previous: number; change: number }[];
  }> {
    try {
      return await get(`/api/analytics/progress-report/${userId}?timeframe=${timeframe}`);
    } catch (error) {
      console.error('生成进度报告失败:', error);
      throw new Error(`生成进度报告失败: ${(error as Error).message}`);
    }
  }

  /**
   * 获取用户的个性化学习统计数据
   * @param userId 用户ID
   * @param timeRange 时间范围
   */
  async getUserLearningStats(userId: string, timeRange: 'day' | 'week' | 'month' | 'year' = 'week'): Promise<{
    totalTimeSpent: number;
    timeGoalCompletion: number;
    learningItemsCompleted: number;
    completionRate: number;
    averageAccuracy: number;
    highestAccuracy: number;
    streakDays: number;
    longestStreak: number;
    lastWeekDays: number;
  }> {
    try {
      // 在实际应用中，这里应该调用API
      // return await get(`/api/analytics/personalized-stats/${userId}?timeRange=${timeRange}`);
      
      // 模拟数据
      return {
        totalTimeSpent: 347,
        timeGoalCompletion: 78,
        learningItemsCompleted: 42,
        completionRate: 86,
        averageAccuracy: 91,
        highestAccuracy: 98,
        streakDays: 5,
        longestStreak: 14,
        lastWeekDays: 5
      };
    } catch (error) {
      console.error('获取个性化学习统计失败:', error);
      throw new Error(`获取个性化学习统计失败: ${(error as Error).message}`);
    }
  }

  /**
   * 获取用户的学习趋势数据
   * @param userId 用户ID
   * @param timeRange 时间范围
   */
  async getLearningTrends(userId: string, timeRange: 'day' | 'week' | 'month' | 'year' = 'week'): Promise<{
    timeSpentData: { date: string; value: number }[];
    completionData: { date: string; value: number }[];
    accuracyData: { date: string; value: number }[];
    focusData: { date: string; value: number }[];
  }> {
    try {
      // 在实际应用中，这里应该调用API
      // return await get(`/api/analytics/learning-trends/${userId}?timeRange=${timeRange}`);
      
      // 模拟数据
      let dates: string[] = [];
      let dataPoints = 0;
      
      switch (timeRange) {
        case 'day':
          dates = Array.from({ length: 24 }, (_, i) => `${i}:00`);
          dataPoints = 24;
          break;
        case 'week':
          dates = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
          dataPoints = 7;
          break;
        case 'month':
          dates = Array.from({ length: 30 }, (_, i) => `${i + 1}日`);
          dataPoints = 30;
          break;
        case 'year':
          dates = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
          dataPoints = 12;
          break;
      }
      
      // 生成模拟学习时间数据 (分钟)
      const timeSpentData = dates.map((date, index) => ({
        date,
        value: Math.floor(Math.random() * 60) + 20 + (index % 3 === 0 ? 30 : 0)
      }));
      
      // 生成模拟完成项目数据
      const completionData = dates.map((date, index) => ({
        date,
        value: Math.floor(Math.random() * 8) + 3 + (index % 2 === 0 ? 5 : 0)
      }));
      
      // 生成模拟准确率数据
      const accuracyData = dates.map((date, index) => ({
        date,
        value: Math.floor(Math.random() * 15) + 80 + (index === dataPoints - 1 ? 5 : 0)
      }));
      
      // 生成模拟专注度数据
      const focusData = dates.map((date, index) => ({
        date,
        value: Math.floor(Math.random() * 4) + 6 + (index % 3 === 1 ? 2 : 0)
      }));
      
      return {
        timeSpentData,
        completionData,
        accuracyData,
        focusData
      };
    } catch (error) {
      console.error('获取学习趋势数据失败:', error);
      throw new Error(`获取学习趋势数据失败: ${(error as Error).message}`);
    }
  }

  /**
   * 获取用户的学习强度数据
   * @param userId 用户ID
   * @param timeRange 时间范围
   */
  async getLearningIntensity(userId: string, timeRange: 'day' | 'week' | 'month' | 'year' = 'week'): Promise<{
    dailyIntensity: { current: number; max: number; average: number };
    focusDuration: { current: number; max: number; average: number };
    efficiency: { current: number; max: number; average: number };
    retention: { current: number; max: number; average: number };
    intensityDistribution?: {
      dayOfWeek: number;
      hourOfDay: number;
      intensity: number;
    }[];
  }> {
    try {
      // 在实际应用中，这里应该调用API
      // return await get(`/api/analytics/learning-intensity/${userId}?timeRange=${timeRange}`);
      
      // 模拟数据
      return {
        dailyIntensity: { current: 76, max: 100, average: 68 },
        focusDuration: { current: 42, max: 60, average: 35 },
        efficiency: { current: 84, max: 95, average: 75 },
        retention: { current: 72, max: 90, average: 65 },
        intensityDistribution: Array.from({ length: 7*12 }, (_, i) => ({
          dayOfWeek: Math.floor(i / 12),
          hourOfDay: i % 12 + 8,
          intensity: Math.floor(Math.random() * 100)
        }))
      };
    } catch (error) {
      console.error('获取学习强度数据失败:', error);
      throw new Error(`获取学习强度数据失败: ${(error as Error).message}`);
    }
  }

  /**
   * 获取用户的技能掌握地图
   * @param userId 用户ID
   */
  async getSkillMasteryMap(userId: string): Promise<{
    overallMastery: number;
    skills: {
      name: string;
      mastery: number;
      recentProgress: number;
    }[];
    masteryDistribution: {
      excellent: number;
      good: number;
      average: number;
      needsWork: number;
    };
    recommendations: string[];
  }> {
    try {
      // 在实际应用中，这里应该调用API
      // return await get(`/api/analytics/skill-mastery/${userId}`);
      
      // 模拟数据
      const skills = [
        { name: '日常会话', mastery: 87, recentProgress: 3 },
        { name: '商务英语', mastery: 65, recentProgress: 7 },
        { name: '阅读理解', mastery: 78, recentProgress: 2 },
        { name: '听力技能', mastery: 53, recentProgress: 5 },
        { name: '语法结构', mastery: 72, recentProgress: -2 },
        { name: '写作表达', mastery: 45, recentProgress: 8 },
        { name: '词汇量', mastery: 68, recentProgress: 4 },
        { name: '发音准确度', mastery: 58, recentProgress: 6 },
        { name: '口语流利度', mastery: 42, recentProgress: 9 },
        { name: '专业术语', mastery: 31, recentProgress: 12 }
      ];
      
      const recommendations = [
        '建议增加口语练习频率，提高流利度',
        '专业术语掌握较弱，可以尝试主题式学习',
        '写作表达需要加强，建议每天练习短文写作',
        '听力理解有提升空间，可以尝试无字幕视频练习'
      ];
      
      return {
        overallMastery: 62,
        skills,
        masteryDistribution: {
          excellent: 1,
          good: 3,
          average: 3,
          needsWork: 3
        },
        recommendations
      };
    } catch (error) {
      console.error('获取技能掌握地图失败:', error);
      throw new Error(`获取技能掌握地图失败: ${(error as Error).message}`);
    }
  }
}

// 导出服务实例
export const learningAnalyticsService = new LearningAnalyticsService();
export default learningAnalyticsService; 