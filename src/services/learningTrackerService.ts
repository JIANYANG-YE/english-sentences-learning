'use client';

import { DailyLearningData, WeeklyHeatmapData } from '@/components/learning/LearningHeatmap';
import { LearningPosition } from '@/components/learning/LearningInterfaceManager';

// 学习活动类型
export type LearningActivityType = 
  | 'course_view'        // 查看课程
  | 'lesson_view'        // 查看章节
  | 'lesson_complete'    // 完成章节
  | 'quiz_attempt'       // 尝试测验
  | 'quiz_complete'      // 完成测验
  | 'translation'        // 翻译练习
  | 'grammar'            // 语法练习
  | 'listening'          // 听力练习
  | 'speaking'           // 口语练习
  | 'note_taking';       // 笔记记录

// 学习活动记录
export interface LearningActivity {
  id: string;
  userId: string;
  timestamp: number;
  activityType: LearningActivityType;
  resourceId?: string;        // 课程或章节ID
  resourceType?: string;      // 资源类型（course, lesson, quiz等）
  durationSeconds?: number;   // 活动持续时间（秒）
  progress?: number;          // 活动进度（0-100）
  correct?: boolean;          // 正确/错误（针对测验和练习）
  metadata?: Record<string, any>; // 其他元数据
}

// 学习会话记录
export interface LearningSession {
  id: string;
  userId: string;
  startTime: number;
  endTime?: number;
  activities: LearningActivity[];
  totalDurationSeconds?: number;
  completedItems?: number;
  deviceInfo?: string;
}

// 本地存储键
const ACTIVITY_HISTORY_KEY = 'english_learning_activity_history';
const SESSION_HISTORY_KEY = 'english_learning_session_history';
const POSITION_HISTORY_KEY = 'english_learning_position_history';
const CURRENT_SESSION_KEY = 'english_learning_current_session';

// 生成唯一ID的辅助函数
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

/**
 * 学习追踪服务
 * 记录和分析用户的学习活动
 */
class LearningTrackerService {
  // 当前活动的学习会话
  private currentSession: LearningSession | null = null;
  
  // 会话超时时间（毫秒）
  private sessionTimeoutMs: number = 30 * 60 * 1000; // 30分钟
  
  constructor() {
    if (typeof window !== 'undefined') {
      // 尝试从本地存储恢复当前会话
      this.loadCurrentSession();
    }
  }
  
  // 保存学习活动记录
  public recordActivity(userId: string, activityData: Omit<LearningActivity, 'id' | 'userId' | 'timestamp'>): void {
    // 检查会话是否过期
    this.checkSessionStatus(userId);
    
    // 创建活动记录
    const activity: LearningActivity = {
      id: generateId(),
      userId,
      timestamp: Date.now(),
      ...activityData
    };
    
    // 添加到当前会话
    if (this.currentSession) {
      this.currentSession.activities.push(activity);
      this.saveCurrentSession();
    } else {
      // 如果没有当前会话，创建一个新的
      this.startNewSession(userId, activity);
    }
    
    // 保存到活动历史记录
    this.saveActivityToHistory(activity);
  }
  
  // 保存学习位置
  public savePosition(userId: string, position: LearningPosition): void {
    if (typeof window === 'undefined') return;
    
    try {
      // 获取已保存的位置记录
      const positionsJson = localStorage.getItem(`${POSITION_HISTORY_KEY}_${userId}`);
      let positions: LearningPosition[] = positionsJson ? JSON.parse(positionsJson) : [];
      
      // 查找是否有相同课程和章节的记录
      const existingIndex = positions.findIndex(
        p => p.courseId === position.courseId && p.lessonId === position.lessonId
      );
      
      if (existingIndex >= 0) {
        // 更新现有记录
        positions[existingIndex] = position;
      } else {
        // 添加新记录
        positions.push(position);
      }
      
      // 限制保存的记录数量
      if (positions.length > 100) {
        positions = positions.slice(-100);
      }
      
      // 保存回本地存储
      localStorage.setItem(`${POSITION_HISTORY_KEY}_${userId}`, JSON.stringify(positions));
      
      // 记录活动
      this.recordActivity(userId, {
        activityType: 'lesson_view',
        resourceId: position.lessonId,
        resourceType: 'lesson',
        metadata: {
          courseId: position.courseId,
          position: position.position,
          mode: position.mode
        }
      });
    } catch (error) {
      console.error('保存学习位置时出错:', error);
    }
  }
  
  // 获取学习位置
  public getPosition(userId: string, courseId: string, lessonId: string): LearningPosition | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const positionsJson = localStorage.getItem(`${POSITION_HISTORY_KEY}_${userId}`);
      if (!positionsJson) return null;
      
      const positions: LearningPosition[] = JSON.parse(positionsJson);
      return positions.find(
        p => p.courseId === courseId && p.lessonId === lessonId
      ) || null;
    } catch (error) {
      console.error('获取学习位置时出错:', error);
      return null;
    }
  }
  
  // 获取用户最近的学习位置列表
  public getRecentPositions(userId: string, limit: number = 5): LearningPosition[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const positionsJson = localStorage.getItem(`${POSITION_HISTORY_KEY}_${userId}`);
      if (!positionsJson) return [];
      
      const positions: LearningPosition[] = JSON.parse(positionsJson);
      
      // 按时间戳排序，最新的在前
      return positions
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, limit);
    } catch (error) {
      console.error('获取最近学习位置时出错:', error);
      return [];
    }
  }
  
  // 开始一个新的学习会话
  public startNewSession(userId: string, initialActivity?: LearningActivity): LearningSession {
    // 如果有未结束的会话，先结束它
    this.endCurrentSession();
    
    // 创建新会话
    const session: LearningSession = {
      id: generateId(),
      userId,
      startTime: Date.now(),
      activities: initialActivity ? [initialActivity] : []
    };
    
    this.currentSession = session;
    this.saveCurrentSession();
    
    return session;
  }
  
  // 结束当前会话
  public endCurrentSession(): void {
    if (!this.currentSession) return;
    
    // 更新会话结束时间和总时长
    this.currentSession.endTime = Date.now();
    if (this.currentSession.startTime) {
      this.currentSession.totalDurationSeconds = 
        Math.floor((this.currentSession.endTime - this.currentSession.startTime) / 1000);
    }
    
    // 计算完成的项目数
    this.currentSession.completedItems = this.currentSession.activities.filter(
      a => a.activityType.includes('complete')
    ).length;
    
    // 保存到会话历史记录
    this.saveSessionToHistory(this.currentSession);
    
    // 清除当前会话
    localStorage.removeItem(CURRENT_SESSION_KEY);
    this.currentSession = null;
  }
  
  // 获取用户每日学习数据
  public getDailyLearningData(userId: string, days: number = 30): DailyLearningData[] {
    if (typeof window === 'undefined') return [];
    
    try {
      // 获取活动历史记录
      const activitiesJson = localStorage.getItem(`${ACTIVITY_HISTORY_KEY}_${userId}`);
      if (!activitiesJson) return [];
      
      const activities: LearningActivity[] = JSON.parse(activitiesJson);
      
      // 计算日期范围
      const endDate = new Date();
      endDate.setHours(23, 59, 59, 999);
      
      const startDate = new Date(endDate);
      startDate.setDate(startDate.getDate() - days);
      startDate.setHours(0, 0, 0, 0);
      
      // 筛选在日期范围内的活动
      const relevantActivities = activities.filter(
        a => a.timestamp >= startDate.getTime() && a.timestamp <= endDate.getTime()
      );
      
      // 按日期分组活动
      const activityByDay: Record<string, LearningActivity[]> = {};
      
      relevantActivities.forEach(activity => {
        const date = new Date(activity.timestamp);
        const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD
        
        if (!activityByDay[dateString]) {
          activityByDay[dateString] = [];
        }
        
        activityByDay[dateString].push(activity);
      });
      
      // 计算每日学习数据
      const dailyData: DailyLearningData[] = [];
      let currentStreak = 0;
      
      // 遍历每一天
      for (let i = 0; i <= days; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        const dateString = date.toISOString().split('T')[0];
        
        const dayActivities = activityByDay[dateString] || [];
        
        if (dayActivities.length > 0) {
          currentStreak++;
        } else {
          currentStreak = 0;
        }
        
        // 计算学习时间（分钟）
        const minutesSpent = Math.round(
          dayActivities.reduce((sum, activity) => sum + (activity.durationSeconds || 0), 0) / 60
        );
        
        // 计算完成的活动数量
        const activitiesCompleted = dayActivities.filter(
          a => a.activityType.includes('complete')
        ).length;
        
        // 计算学习的章节数量
        const uniqueLessons = new Set(
          dayActivities
            .filter(a => a.resourceType === 'lesson')
            .map(a => a.resourceId)
        ).size;
        
        dailyData.push({
          date: dateString,
          minutesSpent,
          activitiesCompleted,
          lessonsStudied: uniqueLessons,
          streak: currentStreak
        });
      }
      
      return dailyData;
    } catch (error) {
      console.error('获取每日学习数据时出错:', error);
      return [];
    }
  }
  
  // 获取周时间分布热力图数据
  public getWeeklyHeatmapData(userId: string, weeks: number = 4): WeeklyHeatmapData {
    if (typeof window === 'undefined') return {};
    
    try {
      // 获取活动历史记录
      const activitiesJson = localStorage.getItem(`${ACTIVITY_HISTORY_KEY}_${userId}`);
      if (!activitiesJson) return {};
      
      const activities: LearningActivity[] = JSON.parse(activitiesJson);
      
      // 计算日期范围
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - (weeks * 7));
      
      // 筛选在日期范围内的活动
      const relevantActivities = activities.filter(
        a => a.timestamp >= startDate.getTime() && a.timestamp <= endDate.getTime()
      );
      
      // 初始化周热力图数据
      const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
      const heatmapData: WeeklyHeatmapData = {};
      
      weekDays.forEach(day => {
        heatmapData[day] = Array(24).fill(0);
      });
      
      // 统计每个时间段的学习时间
      relevantActivities.forEach(activity => {
        const date = new Date(activity.timestamp);
        const dayOfWeek = date.getDay(); // 0是周日，1-6是周一到周六
        const dayName = weekDays[dayOfWeek === 0 ? 6 : dayOfWeek - 1]; // 调整为周一到周日
        const hour = date.getHours();
        
        // 累加学习时间（分钟）
        const minutes = Math.round((activity.durationSeconds || 0) / 60);
        heatmapData[dayName][hour] += minutes;
      });
      
      return heatmapData;
    } catch (error) {
      console.error('获取周时间分布数据时出错:', error);
      return {};
    }
  }
  
  // 获取学习会话历史
  public getSessionHistory(userId: string, limit: number = 10): LearningSession[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const sessionsJson = localStorage.getItem(`${SESSION_HISTORY_KEY}_${userId}`);
      if (!sessionsJson) return [];
      
      const sessions: LearningSession[] = JSON.parse(sessionsJson);
      
      // 按时间排序，最新的在前
      return sessions
        .sort((a, b) => b.startTime - a.startTime)
        .slice(0, limit);
    } catch (error) {
      console.error('获取会话历史时出错:', error);
      return [];
    }
  }
  
  // 检查会话状态，如果会话已过期则结束它
  private checkSessionStatus(userId: string): void {
    if (!this.currentSession) {
      // 如果没有当前会话，尝试从存储中恢复
      this.loadCurrentSession();
    }
    
    if (this.currentSession) {
      const now = Date.now();
      const lastActivityTime = this.getLastActivityTime();
      
      // 如果会话已过期或用户不匹配，结束当前会话
      if ((now - lastActivityTime > this.sessionTimeoutMs) || 
          this.currentSession.userId !== userId) {
        this.endCurrentSession();
      }
    }
  }
  
  // 获取最后一个活动的时间
  private getLastActivityTime(): number {
    if (!this.currentSession || this.currentSession.activities.length === 0) {
      return this.currentSession?.startTime || 0;
    }
    
    const activities = this.currentSession.activities;
    return activities[activities.length - 1].timestamp;
  }
  
  // 从本地存储加载当前会话
  private loadCurrentSession(): void {
    if (typeof window === 'undefined') return;
    
    try {
      const sessionJson = localStorage.getItem(CURRENT_SESSION_KEY);
      if (sessionJson) {
        this.currentSession = JSON.parse(sessionJson);
      }
    } catch (error) {
      console.error('加载当前会话时出错:', error);
      this.currentSession = null;
    }
  }
  
  // 保存当前会话到本地存储
  private saveCurrentSession(): void {
    if (typeof window === 'undefined' || !this.currentSession) return;
    
    try {
      localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(this.currentSession));
    } catch (error) {
      console.error('保存当前会话时出错:', error);
    }
  }
  
  // 保存活动到历史记录
  private saveActivityToHistory(activity: LearningActivity): void {
    if (typeof window === 'undefined') return;
    
    try {
      const key = `${ACTIVITY_HISTORY_KEY}_${activity.userId}`;
      const activitiesJson = localStorage.getItem(key);
      let activities: LearningActivity[] = activitiesJson ? JSON.parse(activitiesJson) : [];
      
      activities.push(activity);
      
      // 限制历史记录大小
      if (activities.length > 1000) {
        activities = activities.slice(-1000);
      }
      
      localStorage.setItem(key, JSON.stringify(activities));
    } catch (error) {
      console.error('保存活动历史记录时出错:', error);
    }
  }
  
  // 保存会话到历史记录
  private saveSessionToHistory(session: LearningSession): void {
    if (typeof window === 'undefined') return;
    
    try {
      const key = `${SESSION_HISTORY_KEY}_${session.userId}`;
      const sessionsJson = localStorage.getItem(key);
      let sessions: LearningSession[] = sessionsJson ? JSON.parse(sessionsJson) : [];
      
      sessions.push(session);
      
      // 限制历史记录大小
      if (sessions.length > 100) {
        sessions = sessions.slice(-100);
      }
      
      localStorage.setItem(key, JSON.stringify(sessions));
    } catch (error) {
      console.error('保存会话历史记录时出错:', error);
    }
  }
  
  // 清除用户的所有跟踪数据（用于注销或隐私请求）
  public clearUserData(userId: string): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(`${ACTIVITY_HISTORY_KEY}_${userId}`);
      localStorage.removeItem(`${SESSION_HISTORY_KEY}_${userId}`);
      localStorage.removeItem(`${POSITION_HISTORY_KEY}_${userId}`);
      
      // 如果当前会话是这个用户的，也清除它
      if (this.currentSession?.userId === userId) {
        localStorage.removeItem(CURRENT_SESSION_KEY);
        this.currentSession = null;
      }
    } catch (error) {
      console.error('清除用户数据时出错:', error);
    }
  }
}

export const learningTrackerService = new LearningTrackerService(); 