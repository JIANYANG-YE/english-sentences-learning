import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTokenFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // 验证用户身份
    const payload = await getTokenFromRequest(request);
    
    if (!payload) {
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      );
    }
    
    // 获取用户信息
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      include: {
        profile: true,
        membership: true,
      }
    });
    
    if (!user) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      );
    }
    
    // 排除敏感信息
    const { password, ...userWithoutPassword } = user;
    
    // 获取学习数据
    const learningData = await prisma.learningData.findFirst({
      where: { userId: user.id }
    });
    
    // 获取课程统计
    const enrolledCourses = await prisma.userCourse.count({
      where: { userId: user.id }
    });
    
    const completedCourses = await prisma.userCourse.count({
      where: { 
        userId: user.id,
        completed: true
      }
    });
    
    // 获取最近学习的课程
    const recentCourses = await prisma.userCourse.findMany({
      where: { userId: user.id },
      orderBy: { lastAccessedAt: 'desc' },
      take: 3,
      include: {
        course: true
      }
    });
    
    // 计算学习统计
    const completedLessons = await prisma.userLearningProgress.count({
      where: {
        userId: user.id,
        completed: true,
        sentenceId: null // 只计算课时级别的进度
      }
    });
    
    return NextResponse.json({
      user: userWithoutPassword,
      learningData,
      stats: {
        enrolledCourses,
        completedCourses,
        completedLessons,
        totalLearningTime: learningData?.progress || 0
      },
      recentCourses: recentCourses.map(uc => ({
        id: uc.course.id,
        title: uc.course.title,
        progress: uc.progress,
        lastAccessed: uc.lastAccessedAt
      }))
    });
    
  } catch (error) {
    console.error('获取用户信息失败:', error);
    return NextResponse.json(
      { error: '获取用户信息失败' },
      { status: 500 }
    );
  }
} 