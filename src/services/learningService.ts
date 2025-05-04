import { prisma } from '@/lib/prisma';
import type { User, Lesson, Sentence, UserLearningProgress } from '@/types/prisma';

export interface LearningProgressData {
  userId: string;
  lessonId: string;
  sentenceId?: string;
  progress: number;
  accuracy: number;
  completionTime?: number;
  completed: boolean;
  notes?: string;
}

export interface LearningRecommendation {
  lessonId: string;
  confidence: number;
  reason: string;
}

/**
 * 学习服务
 * 提供学习进度跟踪、数据分析和个性化推荐功能
 */
export class LearningService {
  /**
   * 记录用户学习进度
   */
  async recordProgress(data: LearningProgressData): Promise<UserLearningProgress> {
    // 查找是否已存在进度记录
    const existingProgress = await prisma.userLearningProgress.findFirst({
      where: {
        userId: data.userId,
        lessonId: data.lessonId,
        ...(data.sentenceId ? { sentenceId: data.sentenceId } : {})
      }
    });

    if (existingProgress) {
      // 更新现有记录
      return prisma.userLearningProgress.update({
        where: { id: existingProgress.id },
        data: {
          progress: data.progress,
          accuracy: data.accuracy,
          completionTime: data.completionTime,
          completed: data.completed,
          notes: data.notes,
          updatedAt: new Date()
        }
      });
    } else {
      // 创建新记录
      return prisma.userLearningProgress.create({
        data: {
          userId: data.userId,
          lessonId: data.lessonId,
          sentenceId: data.sentenceId,
          progress: data.progress,
          accuracy: data.accuracy,
          completionTime: data.completionTime || 0,
          completed: data.completed,
          notes: data.notes
        }
      });
    }
  }

  /**
   * 获取用户在特定课程的学习进度
   */
  async getCourseProgress(userId: string, courseId: string) {
    // 获取课程的所有课时
    const lessons = await prisma.lesson.findMany({
      where: { courseId }
    });

    // 获取用户对这些课时的进度
    const progressRecords = await prisma.userLearningProgress.findMany({
      where: {
        userId,
        lessonId: { in: lessons.map((lesson: Lesson) => lesson.id) }
      }
    });

    // 计算总体进度
    const totalLessons = lessons.length;
    if (totalLessons === 0) return 0;

    // 获取已完成课时数
    const completedLessons = new Set();
    progressRecords.forEach((record: UserLearningProgress) => {
      if (record.completed) {
        completedLessons.add(record.lessonId);
      }
    });

    return {
      totalLessons,
      completedLessons: completedLessons.size,
      progressPercentage: Math.round((completedLessons.size / totalLessons) * 100)
    };
  }

  /**
   * 获取用户的整体学习统计数据
   */
  async getUserLearningStats(userId: string) {
    // 获取用户所有进度记录
    const progressRecords = await prisma.userLearningProgress.findMany({
      where: { userId, completed: true }
    });

    // 获取用户学习的句子数
    const sentencesLearned = new Set();
    progressRecords.forEach((record: UserLearningProgress) => {
      if (record.sentenceId) {
        sentencesLearned.add(record.sentenceId);
      }
    });

    // 获取用户完成的课时数
    const lessonsCompleted = new Set();
    progressRecords.forEach((record: UserLearningProgress) => {
      if (record.lessonId) {
        lessonsCompleted.add(record.lessonId);
      }
    });

    // 计算平均准确率
    const totalAccuracy = progressRecords.reduce((sum: number, record: UserLearningProgress) => sum + record.accuracy, 0);
    const averageAccuracy = progressRecords.length > 0 
      ? Math.round((totalAccuracy / progressRecords.length) * 100) / 100
      : 0;

    // 计算总学习时间（分钟）
    const totalLearningTime = progressRecords.reduce((sum: number, record: UserLearningProgress) => sum + (record.completionTime || 0), 0);

    // 获取最近7天的学习记录
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    
    const recentRecords = progressRecords.filter(record => 
      record.updatedAt && new Date(record.updatedAt) >= lastWeek
    );

    // 计算最近7天的学习天数
    const learningDaySet = new Set();
    recentRecords.forEach((record: UserLearningProgress) => {
      if (record.updatedAt) {
        const dateStr = new Date(record.updatedAt).toDateString();
        learningDaySet.add(dateStr);
      }
    });

    return {
      sentencesLearned: sentencesLearned.size,
      lessonsCompleted: lessonsCompleted.size,
      averageAccuracy,
      totalLearningTime,
      learningDaysLastWeek: learningDaySet.size,
      learningStreak: this.calculateLearningStreak(userId, progressRecords)
    };
  }

  /**
   * 计算学习连续天数
   */
  private calculateLearningStreak(userId: string, progressRecords: UserLearningProgress[]): number {
    // 按日期分组
    const dateMap = new Map<string, boolean>();
    
    progressRecords.forEach(record => {
      if (record.updatedAt) {
        const dateStr = new Date(record.updatedAt).toDateString();
        dateMap.set(dateStr, true);
      }
    });

    // 将日期转换为数组并排序
    const dates = Array.from(dateMap.keys())
      .map(dateStr => new Date(dateStr))
      .sort((a, b) => b.getTime() - a.getTime()); // 降序排列

    if (dates.length === 0) return 0;

    // 检查今天是否有学习
    const today = new Date().toDateString();
    const hasLearningToday = dateMap.has(today);
    
    if (!hasLearningToday) return 0;

    // 计算连续学习天数
    let streak = 1; // 从今天开始计算
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    for (let i = 1; i <= 365; i++) { // 最多检查过去一年
      const checkDate = new Date();
      checkDate.setDate(checkDate.getDate() - i);
      const checkDateStr = checkDate.toDateString();
      
      if (dateMap.has(checkDateStr)) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  /**
   * 获取用户个性化学习推荐
   */
  async getLearningRecommendations(userId: string, count: number = 3): Promise<LearningRecommendation[]> {
    // 获取用户已完成的课时
    const completedLessons = await prisma.userLearningProgress.findMany({
      where: {
        userId,
        completed: true
      },
      select: {
        lessonId: true
      }
    });
    
    const completedLessonIds = completedLessons.map(item => item.lessonId);
    
    // 获取用户尚未完成的课时，优先推荐已开始但未完成的课时
    const inProgressLessons = await prisma.userLearningProgress.findMany({
      where: {
        userId,
        completed: false,
        lessonId: {
          notIn: completedLessonIds
        }
      },
      include: {
        lesson: true
      },
      orderBy: {
        progress: 'desc' // 优先推荐进度较高的课时
      },
      take: count
    });
    
    const recommendations: LearningRecommendation[] = inProgressLessons.map(progress => ({
      lessonId: progress.lessonId,
      confidence: 0.9,
      reason: '继续完成已开始的学习'
    }));
    
    // 如果推荐不足，添加用户尚未开始的课时
    if (recommendations.length < count) {
      // 获取用户已开始课程的课时列表
      const startedLessonCourseIds = await prisma.userLearningProgress.findMany({
        where: {
          userId
        },
        include: {
          lesson: {
            select: {
              courseId: true
            }
          }
        }
      });
      
      const startedCourseIds = [...new Set(startedLessonCourseIds
        .filter(item => item.lesson)
        .map(item => item.lesson.courseId))];
      
      // 在用户已开始的课程中，查找尚未开始的下一课时
      const nextLessons = await prisma.lesson.findMany({
        where: {
          courseId: {
            in: startedCourseIds
          },
          id: {
            notIn: [...completedLessonIds, ...inProgressLessons.map(l => l.lessonId)]
          }
        },
        orderBy: [
          {
            courseId: 'asc'
          },
          {
            order: 'asc'
          }
        ],
        take: count - recommendations.length
      });
      
      recommendations.push(...nextLessons.map(lesson => ({
        lessonId: lesson.id,
        confidence: 0.8,
        reason: '建议学习课程的下一课时'
      })));
    }
    
    // 如果推荐仍不足，添加基于难度的推荐
    if (recommendations.length < count) {
      // 获取用户平均准确率
      const progressRecords = await prisma.userLearningProgress.findMany({
        where: { userId }
      });
      
      const avgAccuracy = progressRecords.length > 0
        ? progressRecords.reduce((sum, record) => sum + record.accuracy, 0) / progressRecords.length
        : 0.5; // 默认值
      
      // 基于用户准确率选择合适难度的课时
      const targetDifficulty = avgAccuracy > 0.8 ? 4 : (avgAccuracy > 0.6 ? 3 : 2);
      
      // 查找合适难度的句子较多的课时
      const suitableLessons = await prisma.lesson.findMany({
        where: {
          id: {
            notIn: [...completedLessonIds, ...recommendations.map(r => r.lessonId)]
          }
        },
        include: {
          sentences: {
            where: {
              difficulty: targetDifficulty
            }
          }
        },
        orderBy: {
          createdAt: 'desc' // 优先推荐较新的内容
        },
        take: count - recommendations.length
      });
      
      // 按匹配句子数量排序
      suitableLessons.sort((a, b) => b.sentences.length - a.sentences.length);
      
      recommendations.push(...suitableLessons.map(lesson => ({
        lessonId: lesson.id,
        confidence: 0.7,
        reason: '根据您的水平推荐的合适难度内容'
      })));
    }
    
    return recommendations.slice(0, count);
  }
} 