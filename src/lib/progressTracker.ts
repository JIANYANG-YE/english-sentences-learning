/**
 * 用户进度跟踪系统
 * 负责记录用户学习活动和管理学习进度
 */
import { LearningMode } from '@/types/learning';

// 用户能力模型类型
interface UserCapabilityModel {
  level: 'beginner' | 'intermediate' | 'advanced';
  strengths: string[];
  weaknesses: string[];
  completedLessons: string[];
}

// 学习模式分析结果类型
interface LearningPatternAnalysis {
  totalActivities: number;
  lastActivity?: LearningActivity;
  preferredMode?: LearningMode;
  averageTimePerSession?: number;
  completionRate?: number;
}

// 定义用户类型
interface User {
  id: string;
  progress: Record<string, Record<string, LessonProgress>>;
  settings?: UserSettings;
  activities?: LearningActivity[];
  recommendations?: ContentRecommendation[];
  reports?: Record<string, Record<string, LearningReport>>;
  capabilities?: UserCapabilityModel;
}

// 用户设置类型
interface UserSettings {
  autoPlayAudio: boolean;
  showTranslation: boolean;
  fontSize: 'small' | 'medium' | 'large';
  speechRate: number;
}

// 学习活动类型
interface LearningActivity {
  lessonId: string;
  mode: LearningMode;
  activityType: 'start' | 'complete' | 'review';
  timestamp: string;
  data?: Record<string, unknown>;
}

// 课程进度类型
interface LessonProgress {
  completedItems: string[];
  currentItemId?: string;
  score?: number;
  timeSpent: number;
  lastUpdated: string;
  progressPercentage: number;
  completed?: boolean;
  completedAt?: string;
}

// 学习报告类型
interface LearningReport {
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  statistics: {
    completionTime: number;
    accuracy: number;
    progress: number;
    [key: string]: unknown;
  };
  generatedAt?: string;
}

// 内容推荐类型
interface ContentRecommendation {
  lessonId: string;
  mode: LearningMode;
  title: string;
  reason: string;
  confidence: number;
}

// 模拟数据库操作函数
// 实际项目中，这些函数应该连接到真实的数据库
async function getUserFromDb(userId: string): Promise<User> {
  // 这里应该是从数据库获取用户数据
  // 以下是模拟实现
  const storedData = localStorage.getItem(`user_${userId}`);
  if (storedData) {
    return JSON.parse(storedData);
  }
  return {
    id: userId,
    progress: {},
    settings: {
      autoPlayAudio: true,
      showTranslation: false,
      fontSize: 'medium',
      speechRate: 1.0
    }
  };
}

async function updateUserProgressInDb(userId: string, data: Partial<User>): Promise<void> {
  // 这里应该是更新数据库中的用户数据
  // 以下是模拟实现
  const user = await getUserFromDb(userId);
  const updatedUser = { ...user, ...data };
  localStorage.setItem(`user_${userId}`, JSON.stringify(updatedUser));
}

// 记录用户学习活动
export async function logLearningActivity(
  userId: string,
  lessonId: string,
  mode: LearningMode,
  activityType: 'start' | 'complete' | 'review',
  data: Record<string, unknown> = {}
): Promise<void> {
  try {
    const timestamp = new Date().toISOString();
    
    const activity: LearningActivity = {
      lessonId,
      mode,
      activityType,
      timestamp,
      data
    };
    
    const user = await getUserFromDb(userId);
    const activities = user.activities || [];
    activities.push(activity);
    
    await updateUserProgressInDb(userId, { activities });
    
    // 实时分析学习模式
    await analyzeUserLearningPattern(userId);
    
  } catch (error) {
    console.error('记录学习活动失败:', error);
    // 采用降级策略，记录到本地存储
    try {
      if (typeof localStorage !== 'undefined') {
        const key = `learning_activity_${userId}_${lessonId}_${mode}_${Date.now()}`;
        localStorage.setItem(key, JSON.stringify({
          activityType,
          timestamp: new Date().toISOString(),
          data
        }));
      }
    } catch (e) {
      console.error('本地存储失败:', e);
    }
  }
}

// 更新用户进度
export async function updateUserProgress(
  userId: string,
  lessonId: string,
  mode: LearningMode,
  progress: {
    completedItems: string[];
    currentItemId?: string;
    score?: number;
    timeSpent?: number;
  }
): Promise<void> {
  try {
    // 获取当前用户数据
    const user = await getUserFromDb(userId);
    
    // 如果用户没有进度记录，创建一个新的
    if (!user.progress) {
      user.progress = {};
    }
    
    // 如果用户没有当前课程的进度记录，创建一个新的
    if (!user.progress[lessonId]) {
      user.progress[lessonId] = {};
    }
    
    // 获取现有进度或创建新进度
    const existingProgress = user.progress[lessonId][mode] || {
      completedItems: [],
      timeSpent: 0,
      lastUpdated: new Date().toISOString(),
      progressPercentage: 0
    };
    
    // 更新进度
    user.progress[lessonId][mode] = {
      ...existingProgress,
      completedItems: progress.completedItems,
      currentItemId: progress.currentItemId,
      score: progress.score,
      timeSpent: existingProgress.timeSpent + (progress.timeSpent || 0),
      lastUpdated: new Date().toISOString()
    };
    
    // 计算课程完成百分比
    const progressPercentage = await calculateProgressPercentage(
      userId,
      lessonId,
      mode
    );
    
    user.progress[lessonId][mode].progressPercentage = progressPercentage;
    
    // 检查是否完成课时
    if (progressPercentage >= 90) {
      user.progress[lessonId][mode].completed = true;
      user.progress[lessonId][mode].completedAt = new Date().toISOString();
      
      // 记录完成事件
      await logLearningActivity(userId, lessonId, mode, 'complete', {
        progressPercentage,
        timeSpent: user.progress[lessonId][mode].timeSpent
      });
      
      // 生成学习报告
      await generateLearningReport(userId, lessonId, mode);
      
      // 更新用户能力模型
      await updateUserCapabilityModel(userId, lessonId, mode, progress);
      
      // 推荐下一个学习内容
      const recommendations = await getNextContentRecommendations(userId, lessonId, mode);
      user.recommendations = recommendations;
    }
    
    // 保存更新后的用户数据
    await updateUserProgressInDb(userId, { progress: user.progress });
    
  } catch (error) {
    console.error('更新用户进度失败:', error);
    throw new Error(`更新用户进度失败: ${(error as Error).message}`);
  }
}

// 计算课程完成百分比
async function calculateProgressPercentage(
  userId: string,
  lessonId: string,
  mode: LearningMode
): Promise<number> {
  // 从API获取课程内容项数量
  // 实际应用中这里应该是一个API调用
  // 以下是模拟实现
  const contentItemCount = 10; // 假设总共有10个内容项
  
  // 获取用户的进度
  const user = await getUserFromDb(userId);
  
  // 计算已完成的内容项数量
  const completedCount = user.progress?.[lessonId]?.[mode]?.completedItems?.length || 0;
  
  // 计算完成百分比
  return Math.round((completedCount / contentItemCount) * 100);
}

// 分析用户学习模式
async function analyzeUserLearningPattern(userId: string): Promise<LearningPatternAnalysis> {
  // 获取用户的所有学习活动
  const user = await getUserFromDb(userId);
  
  // 分析学习模式
  // 实际应用中可能需要更复杂的分析
  const activities = user.activities || [];
  
  // 简单返回一些统计信息
  return {
    totalActivities: activities.length,
    lastActivity: activities[activities.length - 1]
  };
}

// 获取用户学习活动
async function getUserLearningActivities(
  userId: string,
  lessonId?: string,
  mode?: LearningMode
): Promise<LearningActivity[]> {
  // 从数据库获取用户学习活动
  // 实际应用中这里应该是一个数据库查询
  // 以下是模拟实现
  const user = await getUserFromDb(userId);
  const activities = user.activities || [];
  
  // 如果指定了lessonId和mode，过滤相关活动
  if (lessonId && mode) {
    return activities.filter(
      activity => activity.lessonId === lessonId && activity.mode === mode
    );
  } else if (lessonId) {
    return activities.filter(activity => activity.lessonId === lessonId);
  }
  
  return activities;
}

// 生成学习报告
async function generateLearningReport(
  userId: string,
  lessonId: string,
  mode: LearningMode
): Promise<LearningReport> {
  try {
    // 获取用户在该课时的所有活动
    const activities = await getUserLearningActivities(userId, lessonId, mode);
    
    // 分析学习数据
    const learningPatterns = await analyzeUserLearningPattern(userId);
    
    // 识别强项和弱项
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    
    // 默认返回一些基本信息
    const report: LearningReport = {
      strengths: ['努力完成学习课程'],
      weaknesses: ['需要更多练习来巩固所学知识'],
      recommendations: ['继续学习下一课程', '复习难点内容'],
      statistics: {
        completionTime: calculateTotalTime(activities),
        accuracy: 0.8, // 假设的准确率
        progress: 100 // 完成度百分比
      }
    };
    
    await saveUserLearningReport(userId, lessonId, mode, report);
    
    return report;
  } catch (error) {
    console.error('生成学习报告失败:', error);
    return {
      strengths: [],
      weaknesses: [],
      recommendations: [],
      statistics: {
        completionTime: 0,
        accuracy: 0,
        progress: 0
      }
    };
  }
}

// 保存用户学习报告
async function saveUserLearningReport(
  userId: string,
  lessonId: string,
  mode: LearningMode,
  report: LearningReport
): Promise<void> {
  // 在实际应用中，这里会保存报告到数据库
  // 以下是模拟实现
  const user = await getUserFromDb(userId);
  
  if (!user.reports) {
    user.reports = {};
  }
  
  if (!user.reports[lessonId]) {
    user.reports[lessonId] = {};
  }
  
  user.reports[lessonId][mode] = {
    ...report,
    generatedAt: new Date().toISOString()
  };
  
  await updateUserProgressInDb(userId, { reports: user.reports });
}

// 计算活动总时间
function calculateTotalTime(activities: LearningActivity[]): number {
  // 计算所有活动的总时间
  // 实际应用中可能需要更复杂的计算
  return activities.reduce((total, activity) => {
    return total + ((activity.data?.timeSpent as number) || 0);
  }, 0);
}

// 更新用户能力模型
async function updateUserCapabilityModel(
  userId: string,
  lessonId: string,
  mode: LearningMode,
  progress: {
    completedItems: string[];
    currentItemId?: string;
    score?: number;
    timeSpent?: number;
  }
): Promise<void> {
  // 在实际应用中，这里会更新用户能力模型
  // 简单实现
  const user = await getUserFromDb(userId);
  
  if (!user.capabilities) {
    user.capabilities = {
      level: 'beginner',
      strengths: [],
      weaknesses: [],
      completedLessons: []
    };
  }
  
  // 添加完成的课程
  if (!user.capabilities.completedLessons.includes(lessonId)) {
    user.capabilities.completedLessons.push(lessonId);
  }
  
  // 根据完成课程数量更新用户级别
  const completedCount = user.capabilities.completedLessons.length;
  if (completedCount > 20) {
    user.capabilities.level = 'advanced';
  } else if (completedCount > 10) {
    user.capabilities.level = 'intermediate';
  } else {
    user.capabilities.level = 'beginner';
  }
  
  await updateUserProgressInDb(userId, { capabilities: user.capabilities });
}

// 获取推荐的下一个学习内容
async function getNextContentRecommendations(
  userId: string,
  currentLessonId: string,
  currentMode: LearningMode
): Promise<ContentRecommendation[]> {
  // 在实际应用中，这里会基于用户学习历史和能力模型推荐下一个内容
  // 简单实现
  return [
    {
      lessonId: `lesson-${parseInt(currentLessonId.split('-')[1] || '0') + 1}`,
      mode: currentMode,
      title: '下一课',
      reason: '继续当前学习路径',
      confidence: 0.9
    },
    {
      lessonId: currentLessonId,
      mode: currentMode === 'chinese-to-english' ? 'english-to-chinese' : 'chinese-to-english',
      title: '当前课程反向模式',
      reason: '从不同角度学习同一内容',
      confidence: 0.8
    },
    {
      lessonId: currentLessonId,
      mode: 'grammar',
      title: '语法详解',
      reason: '加深对所学内容的理解',
      confidence: 0.7
    }
  ];
}

// 获取用户能力模型
export async function getUserCapabilityModel(userId: string): Promise<UserCapabilityModel> {
  const user = await getUserFromDb(userId);
  return user.capabilities || {
    level: 'beginner',
    strengths: [],
    weaknesses: [],
    completedLessons: []
  };
} 