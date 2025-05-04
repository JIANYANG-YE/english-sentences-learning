import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTokenFromRequest } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const courseId = params.id;
    
    if (!courseId) {
      return NextResponse.json(
        { error: '课程ID必须提供' },
        { status: 400 }
      );
    }
    
    // 获取课程详情
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        sections: {
          orderBy: {
            order: 'asc'
          }
        },
        lessons: {
          orderBy: {
            order: 'asc'
          },
          include: {
            section: true
          }
        }
      }
    });
    
    if (!course) {
      return NextResponse.json(
        { error: '课程不存在' },
        { status: 404 }
      );
    }
    
    // 检查请求用户是否有权限访问该课程
    let hasAccess = course.isFree; // 免费课程所有人都可以访问
    
    // 获取当前用户（如果已认证）
    const payload = await getTokenFromRequest(request);
    
    if (payload) {
      const userId = payload.id;
      
      // 检查是否是课程作者
      if (course.authorId === userId) {
        hasAccess = true;
      } else {
        // 检查用户会员状态
        const userWithMembership = await prisma.user.findUnique({
          where: { id: userId },
          include: { membership: true }
        });
        
        // 会员可以访问会员专属课程
        if (userWithMembership?.membership?.status === 'active' && course.requiresMembership) {
          hasAccess = true;
        }
        
        // 检查用户是否已购买该课程
        if (!hasAccess) {
          const userCourseAccess = await prisma.userCourseAccess.findFirst({
            where: {
              userId,
              courseId
            }
          });
          
          if (userCourseAccess) {
            hasAccess = true;
          }
        }
      }
      
      // 如果用户有权限访问课程，记录/更新用户课程关系
      if (hasAccess) {
        const userCourse = await prisma.userCourse.findUnique({
          where: {
            userId_courseId: {
              userId,
              courseId
            }
          }
        });
        
        if (userCourse) {
          // 更新最后访问时间
          await prisma.userCourse.update({
            where: {
              userId_courseId: {
                userId,
                courseId
              }
            },
            data: {
              lastAccessedAt: new Date()
            }
          });
        } else {
          // 创建新的用户课程记录
          await prisma.userCourse.create({
            data: {
              userId,
              courseId,
              progress: 0,
              lastAccessedAt: new Date()
            }
          });
        }
      }
    }
    
    // 根据用户访问权限返回数据
    const response: any = {
      ...course,
      // 解析JSON字符串类型的字段
      tags: course.tags ? JSON.parse(course.tags) : []
    };
    
    if (!hasAccess) {
      // 如果用户没有权限，只返回有限信息
      delete response.lessons;
      response.sections = response.sections.slice(0, 1); // 只返回第一个小节
      response.isLocked = true;
      response.accessMessage = '此课程需要购买或会员资格才能访问';
    } else {
      response.isLocked = false;
      
      // 如果用户已认证，获取学习进度信息
      if (payload) {
        const lessonProgresses = await prisma.userLearningProgress.findMany({
          where: {
            userId: payload.id,
            lessonId: {
              in: course.lessons.map((lesson: { id: string }) => lesson.id)
            }
          }
        });
        
        // 计算总体进度
        if (course.lessons.length > 0) {
          const completedLessons = new Set(
            lessonProgresses
              .filter((progress: { completed: boolean }) => progress.completed)
              .map((progress: { lessonId: string }) => progress.lessonId)
          );
          
          response.userProgress = {
            completedLessons: completedLessons.size,
            totalLessons: course.lessons.length,
            progressPercentage: Math.round((completedLessons.size / course.lessons.length) * 100)
          };
        }
      }
    }
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('获取课程详情失败:', error);
    return NextResponse.json(
      { error: '获取课程详情失败' },
      { status: 500 }
    );
  }
} 