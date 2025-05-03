/**
 * 用户相关类型定义
 */

import { CoreUser } from '@/types/core';

// 用户信息类型
export interface UserProfile extends CoreUser {
  bio?: string;
  country?: string;
  language?: string;
  timezone?: string;
  phone?: string;
  birthday?: string;
  avatarUrl?: string;
  preferences?: UserPreferences;
  social?: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    github?: string;
  };
  capabilities?: UserCapability;
}

// 用户偏好设置
export interface UserPreferences {
  theme?: 'light' | 'dark' | 'system';
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  audioSpeed?: number;
  autoPlay?: boolean;
  showTranslations?: boolean;
  fontSize?: 'small' | 'medium' | 'large';
  learningGoals?: {
    wordsPerDay?: number;
    sentencesPerDay?: number;
    minutesPerDay?: number;
  };
}

// 用户能力模型
export interface UserCapability {
  level: 'beginner' | 'intermediate' | 'advanced';
  vocabularySize: number;
  grammarScore: number;
  listeningScore: number;
  speakingScore: number;
  readingScore: number;
  writingScore: number;
  lastEvaluated?: string;
  weakAreas?: string[];
  strongAreas?: string[];
}

// 用户仪表盘数据
export interface UserDashboardData {
  user: UserProfile;
  statistics: {
    wordsLearned: number;
    sentencesLearned: number;
    coursesCompleted: number;
    totalStudyHours: number;
    averageDailyMinutes: number;
    learningStreak: number;
    lastActive: string;
  };
  checkIns: Array<{
    date: string;
    duration: number;
    activitiesCompleted: number;
  }>;
  progress: {
    daily: Array<{
      date: string;
      wordsLearned: number;
      sentencesLearned: number;
      minutesStudied: number;
    }>;
    weekly: {
      wordsLearned: number;
      sentencesLearned: number;
      minutesStudied: number;
      compareLastWeek: number;
    };
    monthly: {
      wordsLearned: number;
      sentencesLearned: number;
      minutesStudied: number;
      compareLastMonth: number;
    };
  };
  goals: {
    wordsPerDay: {
      target: number;
      current: number;
    };
    sentencesPerDay: {
      target: number;
      current: number;
    };
    minutesPerDay: {
      target: number;
      current: number;
    };
  };
  recentLearning: Array<{
    courseId: string;
    title: string;
    lastAccessed: string;
    progress: number;
    imageUrl: string;
  }>;
  nextReview: {
    due: number;
    overdue: number;
    upcomingToday: number;
    nextSession: string;
  };
}

// 用户学习分析
export interface UserLearningAnalytics {
  userId: string;
  timeSpent: {
    total: number;
    byDay: Record<string, number>;
    byWeek: Record<string, number>;
    byMonth: Record<string, number>;
  };
  activities: {
    reading: number;
    listening: number;
    speaking: number;
    writing: number;
    grammar: number;
    vocabulary: number;
  };
  progress: {
    byCategory: Record<string, number>;
    byLevel: Record<string, number>;
  };
  retention: {
    vocabularyRetention: number;
    grammarRetention: number;
    reviewEfficiency: number;
  };
  milestones: Array<{
    id: string;
    title: string;
    description: string;
    achievedAt: string;
    iconUrl: string;
  }>;
}

// 用户能力模型
export interface UserCapabilityModel {
  userId: string;
  overallLevel: 'beginner' | 'intermediate' | 'advanced';
  skills: {
    vocabulary: { level: number; score: number };
    grammar: { level: number; score: number };
    listening: { level: number; score: number };
    speaking: { level: number; score: number };
    reading: { level: number; score: number };
    writing: { level: number; score: number };
  };
  weakAreas: string[];
  strongAreas: string[];
  recommendations: {
    courses: string[];
    activities: string[];
    focus: string[];
  };
  preferences: {
    learningStyles: string[];
    topicsOfInterest: string[];
    audioSpeed: number;
  };
}

// 用户基本信息
export interface User {
  id: string;
  username: string;
  email: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  bio?: string;
  role: 'basic' | 'premium' | 'admin' | 'teacher';
  verified?: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  preferences: UserPreferences;
  stats: UserStats;
  membership?: Membership;
}

// 用户学习统计
export interface UserStats {
  totalLearningTime: number; // 总学习时间（分钟）
  totalSentencesLearned: number; // 已学习句子总数
  sentencesMastered: number; // 已掌握句子数
  lessonsCompleted: number; // 已完成课程数
  streakDays: number; // 连续学习天数
  lastStudyDate?: string; // 最后学习日期
  averageDailyTime: number; // 平均每日学习时间（分钟）
  totalExercises: number; // 总练习数
  correctExercises: number; // 正确练习数
  vocabularyMastered: number; // 已掌握词汇数
  grammarPointsMastered: number; // 已掌握语法点数
  points: number; // 积分
  level: number; // 用户等级
  experiencePoints: number; // 经验值
  weeklyProgress: WeeklyProgress[]; // 每周学习进度
}

// 每周学习进度
export interface WeeklyProgress {
  weekStartDate: string; // 周开始日期
  totalTime: number; // 总学习时间（分钟）
  sentencesLearned: number; // 学习的句子数
  grammarPointsLearned: number; // 学习的语法点数
  dailyActivity: {
    date: string;
    timeSpent: number; // 学习时间（分钟）
    sentencesReviewed: number; // 复习的句子数
  }[];
}

// 会员信息
export interface Membership {
  type: 'free' | 'basic' | 'premium';
  status: 'active' | 'expired' | 'cancelled' | 'pending';
  startDate: string;
  endDate?: string;
  autoRenew: boolean;
  paymentMethod?: string;
  subscriptionId?: string;
  lastPaymentDate?: string;
  nextPaymentDate?: string;
  transactionHistory: {
    id: string;
    date: string;
    amount: number;
    currency: string;
    status: 'success' | 'failed' | 'pending' | 'refunded';
  }[];
}

// 学习计划
export interface StudyPlan {
  id: string;
  userId: string;
  name: string;
  description?: string;
  goal: string;
  targetDate?: string;
  coursePackages: string[]; // 课程包ID列表
  lessons: string[]; // 课时ID列表
  dailyMinutes: number; // 每日学习时间
  daysPerWeek: number; // 每周学习天数
  schedule: {
    [day: string]: string[]; // 星期几: 时间段列表
  };
  progress: number; // 0-100
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// 学习日历事件
export interface CalendarEvent {
  id: string;
  userId: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  isCompleted: boolean;
  type: 'lesson' | 'review' | 'exercise' | 'exam' | 'custom';
  relatedId?: string; // 相关联的课程、练习等ID
  reminder: boolean;
  reminderTime: number; // 提前多少分钟提醒
}

// 签到记录
export interface CheckIn {
  userId: string;
  date: string;
  streak: number; // 当前连续签到天数
  completed: boolean; // 是否已完成签到
  rewards: {
    points: number;
    experience: number;
    items?: RewardItem[];
  };
}

// 奖励物品
export interface RewardItem {
  id: string;
  name: string;
  type: 'currency' | 'booster' | 'avatar' | 'theme' | 'badge';
  description: string;
  value: number;
  expiresAt?: string;
  used: boolean;
}

// 用户成就
export interface Achievement {
  id: string;
  userId: string;
  type: string; // 成就类型
  title: string;
  description: string;
  icon: string;
  earnedAt: string;
  progress: number; // 0-100
  completed: boolean;
  rewards?: RewardItem[];
}

// 好友关系
export interface Friendship {
  id: string;
  userId: string;
  friendId: string;
  status: 'pending' | 'accepted' | 'rejected' | 'blocked';
  createdAt: string;
  updatedAt: string;
}

// 用户通知
export interface Notification {
  id: string;
  userId: string;
  title: string;
  content: string;
  type: 'system' | 'achievement' | 'reminder' | 'course' | 'social';
  isRead: boolean;
  createdAt: string;
  link?: string;
  priority: 'low' | 'medium' | 'high';
}

// 用户笔记
export interface UserNote {
  id: string;
  userId: string;
  title: string;
  content: string;
  tags: string[];
  associatedSentences?: string[]; // sentenceId数组
  associatedLessons?: string[]; // lessonId数组
  createdAt: string;
  updatedAt: string;
  isPinned: boolean;
  color?: string;
}

// 错题集
export interface ErrorCollection {
  userId: string;
  sentenceId: string;
  errorCount: number;
  lastError: string;
  errorTypes: string[]; // 如'grammar', 'vocabulary', 'listening'等
  addedAt: string;
  notes?: string;
}

// 用户学习目标
export interface UserGoal {
  id: string;
  userId: string;
  title: string;
  description?: string;
  targetDate?: string;
  status: 'active' | 'completed' | 'abandoned';
  progress: number; // 0-100
  type: 'daily' | 'weekly' | 'monthly' | 'custom';
  createdAt: string;
  updatedAt: string;
  metrics: {
    type: 'time' | 'sentences' | 'lessons' | 'grammar_points';
    target: number;
    current: number;
  }[];
}

// 导出仪表盘相关类型
export * from './dashboard'; 