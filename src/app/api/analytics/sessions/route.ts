import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

// 学习会话数据验证模式
const sessionSchema = z.object({
  userId: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  duration: z.number(),
  courseId: z.string().optional(),
  lessonId: z.string().optional(),
  mode: z.string().optional(),
  itemsCompleted: z.number(),
  correctCount: z.number(),
  errorCount: z.number(),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  focusLevel: z.number().min(1).max(10),
  device: z.string(),
  location: z.string().optional()
});

// 数据存储（未来可替换为实际数据库）
type SessionData = z.infer<typeof sessionSchema> & { id: string };
let sessionsData: SessionData[] = [];

/**
 * GET /api/analytics/sessions
 * 获取所有会话数据或按用户ID筛选
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    
    let filteredSessions = sessionsData;
    
    if (userId) {
      filteredSessions = sessionsData.filter(item => item.userId === userId);
    }
    
    // 按时间降序排序（最新的会话在前）
    filteredSessions.sort((a, b) => 
      new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
    );
    
    const paginatedSessions = filteredSessions.slice(offset, offset + limit);
    
    return NextResponse.json({
      total: filteredSessions.length,
      sessions: paginatedSessions
    }, { status: 200 });
  } catch (error) {
    console.error('获取学习会话失败:', error);
    return NextResponse.json(
      { error: '获取学习会话失败' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/analytics/sessions
 * 保存学习会话数据
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 验证请求数据
    const result = sessionSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: '无效的会话数据', details: result.error.format() },
        { status: 400 }
      );
    }
    
    const sessionData = result.data;
    
    // 生成唯一ID
    const newSession: SessionData = {
      ...sessionData,
      id: uuidv4()
    };
    
    // 添加到会话数据集合
    sessionsData.push(newSession);
    
    // 计算学习统计数据
    calculateUserLearningStats(newSession.userId);
    
    return NextResponse.json(newSession, { status: 201 });
  } catch (error) {
    console.error('保存学习会话失败:', error);
    return NextResponse.json(
      { error: '保存学习会话失败' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/analytics/sessions/[userId]/stats
 * 获取用户会话统计数据
 */
export async function getSessionStats(userId: string, timeframe: string = 'week') {
  try {
    // 筛选用户会话数据
    const userSessions = sessionsData.filter(session => session.userId === userId);
    
    if (!userSessions.length) {
      return {
        totalSessions: 0,
        totalDuration: 0,
        averageDuration: 0,
        totalItemsCompleted: 0,
        averageCorrectRate: 0,
        mostActiveDays: [],
        activityByHour: []
      };
    }
    
    // 计算时间范围
    const now = new Date();
    let startDate = new Date();
    
    switch (timeframe) {
      case 'day':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate = new Date(0); // 从历史最早时间开始
    }
    
    // 筛选时间范围内的会话
    const filteredSessions = userSessions.filter(
      session => new Date(session.startTime) >= startDate
    );
    
    // 计算统计数据
    const totalSessions = filteredSessions.length;
    const totalDuration = filteredSessions.reduce((sum, session) => sum + session.duration, 0);
    const averageDuration = totalSessions > 0 ? totalDuration / totalSessions : 0;
    const totalItemsCompleted = filteredSessions.reduce((sum, session) => sum + session.itemsCompleted, 0);
    
    const totalCorrect = filteredSessions.reduce((sum, session) => sum + session.correctCount, 0);
    const totalAnswered = filteredSessions.reduce(
      (sum, session) => sum + session.correctCount + session.errorCount, 0
    );
    const averageCorrectRate = totalAnswered > 0 ? (totalCorrect / totalAnswered) * 100 : 0;
    
    // 按日期和小时统计活动
    const activityByDay: { [key: string]: number } = {};
    const activityByHour: { [key: number]: number } = {};
    
    filteredSessions.forEach(session => {
      const date = new Date(session.startTime).toISOString().split('T')[0];
      const hour = new Date(session.startTime).getHours();
      
      activityByDay[date] = (activityByDay[date] || 0) + session.duration;
      activityByHour[hour] = (activityByHour[hour] || 0) + session.duration;
    });
    
    // 找出最活跃的日期（按学习时长）
    const mostActiveDays = Object.entries(activityByDay)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([date, duration]) => ({ date, duration }));
    
    // 转换小时活动为数组
    const activityByHourArray = Array.from({ length: 24 }, (_, hour) => ({
      hour,
      duration: activityByHour[hour] || 0
    }));
    
    return {
      totalSessions,
      totalDuration,
      averageDuration,
      totalItemsCompleted,
      averageCorrectRate,
      mostActiveDays,
      activityByHour: activityByHourArray
    };
  } catch (error) {
    console.error('计算会话统计数据失败:', error);
    throw new Error('计算会话统计数据失败');
  }
}

/**
 * 计算用户学习统计数据
 * @param userId 用户ID
 */
async function calculateUserLearningStats(userId: string) {
  try {
    // 获取用户所有会话
    const userSessions = sessionsData.filter(session => session.userId === userId);
    
    // 这里可以实现更多复杂的统计计算
    // 例如学习模式偏好、最佳学习时间等
    
    // 未来可以将计算结果存储到数据库
    return true;
  } catch (error) {
    console.error('计算学习统计数据失败:', error);
    return false;
  }
} 