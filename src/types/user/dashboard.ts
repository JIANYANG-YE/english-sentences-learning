/**
 * 仪表盘相关类型定义
 */

import { RewardItem } from '@/types/user';

// 签到记录
export interface CheckIn {
  userId: string;
  date: string;
  streak: number;
  completed: boolean;
  rewards: {
    points: number;
    experience: number;
    items?: RewardItem[];
  };
}

// 用户学习统计
export interface LearningStats {
  daily: {
    labels: string[];
    data: number[];
  };
  weekly: {
    labels: string[];
    data: number[];
  };
  monthly: {
    labels: string[];
    data: number[];
  };
}

// 最近学习的课程
export interface RecentCourse {
  id: string;
  title: string;
  coverImage: string;
  progress: number;
  lastStudied: string;
  lastAccessed?: string;
}

// 用户仪表盘数据
export interface UserDashboardData {
  user: {
    id: string;
    email: string;
    displayName: string;
    avatar?: string;
    role: 'basic' | 'premium' | 'admin' | 'teacher';
    createdAt: string;
    lastLogin?: string;
    membership?: {
      type: string;
      startDate: string;
      endDate?: string;
      autoRenewal: boolean;
    };
    stats: {
      level: number;
      experience: number;
      totalPoints: number;
      streakDays: number;
      lastStreak: string;
      lessonsCompleted: number;
      sentencesMastered: number;
      vocabularyMastered: number;
      totalExercises: number;
      correctExercises: number;
      totalLearningTime: number;
      totalWords: number;
      totalSentences: number;
      totalHours: number;
      monthlyWords: number;
      monthlySentences: number;
      reviewDue: number;
    };
  };
  checkIns: CheckIn[];
  recentLearning: RecentCourse[];
  learningStats: LearningStats;
}

// 日历数据
export interface CalendarData {
  monthName: string;
  days: Array<{
    date: string;
    hasActivity: boolean;
    points: number;
  }>;
}

// 每日目标
export interface DailyGoal {
  id: string;
  title: string;
  target: number;
  current: number;
  unit: string;
}

// 用户活动
export interface UserActivity {
  id: string;
  type: 'practice' | 'study' | 'note' | 'error';
  title: string;
  date: string;
  detail: string;
  points: number;
} 