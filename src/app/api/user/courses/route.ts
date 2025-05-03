import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * 获取用户课程列表
 * GET /api/user/courses
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // 验证用户是否已登录
    if (!session?.user) {
      return new NextResponse('未授权', { status: 401 });
    }

    const userId = session.user.id;
    
    // 查询用户的会员状态
    const membership = await prisma.membership.findUnique({
      where: { userId },
      select: { type: true, status: true, endDate: true },
    });
    
    const hasMembership = membership?.status === 'active' && 
      (membership.type === 'premium' || membership.type === 'basic') &&
      (!membership.endDate || new Date(membership.endDate) > new Date());
    
    // 获取用户可以访问的课程
    const userCourses = await prisma.userCourse.findMany({
      where: { userId },
      include: {
        course: {
          include: {
            sections: true,
            lessons: {
              select: {
                id: true,
                title: true,
                subtitle: true,
                order: true,
              },
              orderBy: {
                order: 'asc',
              },
            },
          },
        },
      },
      orderBy: {
        lastAccessedAt: 'desc',
      },
    });
    
    // 获取用户的课程访问权限记录
    const courseAccesses = await prisma.userCourseAccess.findMany({
      where: {
        userId,
        isActive: true,
      },
      select: {
        courseId: true,
        packageId: true,
      },
    });
    
    const accessibleCourseIds = courseAccesses
      .filter(access => access.courseId)
      .map(access => access.courseId);
    
    const accessiblePackageIds = courseAccesses
      .filter(access => access.packageId)
      .map(access => access.packageId);
    
    // 查找用户可以访问但尚未添加到用户课程中的所有课程
    const availableCourses = await prisma.course.findMany({
      where: {
        OR: [
          { id: { in: accessibleCourseIds } },
          { packageId: { in: accessiblePackageIds } },
          { isFree: true },
          { requiresMembership: true, AND: [{ hasMembership: true }] },
        ],
        NOT: {
          id: { in: userCourses.map(uc => uc.courseId) },
        },
        publishStatus: 'published',
      },
      include: {
        sections: true,
        lessons: {
          select: {
            id: true,
            title: true,
            subtitle: true,
            order: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
    });
    
    // 获取用户的学习进度数据
    const userProgress = await prisma.userLearningProgress.findMany({
      where: {
        userId,
        lessonId: {
          in: [
            ...userCourses.flatMap(uc => uc.course.lessons.map(l => l.id)),
            ...availableCourses.flatMap(c => c.lessons.map(l => l.id)),
          ],
        },
      },
      select: {
        lessonId: true,
        attempts: true,
        correct: true,
        completedAt: true,
        timeSpent: true,
      },
    });
    
    // 将进度数据映射到课程上
    const progressByLessonId = userProgress.reduce((acc, progress) => {
      if (progress.lessonId) {
        acc[progress.lessonId] = progress;
      }
      return acc;
    }, {} as Record<string, any>);
    
    // 处理用户已添加的课程
    const enrolledCourses = userCourses.map(userCourse => {
      const course = userCourse.course;
      
      // 计算总进度
      const totalLessons = course.lessons.length;
      const completedLessons = course.lessons.filter(
        lesson => progressByLessonId[lesson.id]?.completedAt
      ).length;
      
      const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
      
      return {
        id: course.id,
        title: course.title,
        description: course.description,
        coverImage: course.coverImage,
        level: course.level,
        category: course.category,
        tags: course.tags,
        isFree: course.isFree,
        requiresMembership: course.requiresMembership,
        totalLessons,
        completedLessons,
        progress,
        lastAccessedAt: userCourse.lastAccessedAt,
        sections: course.sections,
        lessons: course.lessons.map(lesson => ({
          ...lesson,
          progress: progressByLessonId[lesson.id] 
            ? Math.round((progressByLessonId[lesson.id].correct / progressByLessonId[lesson.id].attempts) * 100) || 0
            : 0,
          completed: !!progressByLessonId[lesson.id]?.completedAt,
          timeSpent: progressByLessonId[lesson.id]?.timeSpent || 0,
        })),
        enrolled: true,
      };
    });
    
    // 处理可访问但未添加的课程
    const unenrolledCourses = availableCourses.map(course => {
      return {
        id: course.id,
        title: course.title,
        description: course.description,
        coverImage: course.coverImage,
        level: course.level,
        category: course.category,
        tags: course.tags,
        isFree: course.isFree,
        requiresMembership: course.requiresMembership,
        totalLessons: course.lessons.length,
        completedLessons: 0,
        progress: 0,
        sections: course.sections,
        lessons: course.lessons,
        enrolled: false,
      };
    });
    
    // 合并所有课程
    const allCourses = [...enrolledCourses, ...unenrolledCourses];
    
    return NextResponse.json({
      courses: allCourses,
      membership: membership ? {
        type: membership.type,
        status: membership.status,
        active: hasMembership,
        expiresAt: membership.endDate,
      } : null,
    });
  } catch (error) {
    console.error('获取用户课程失败:', error);
    return new NextResponse('服务器错误', { status: 500 });
  }
}

/**
 * 添加课程到用户的课程列表
 * POST /api/user/courses
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // 验证用户是否已登录
    if (!session?.user) {
      return new NextResponse('未授权', { status: 401 });
    }

    const data = await request.json();
    
    // 验证必要参数
    if (!data.courseId) {
      return new NextResponse('缺少课程ID', { status: 400 });
    }
    
    const userId = session.user.id;
    const courseId = data.courseId;
    
    // 验证课程是否存在
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: {
        id: true,
        isFree: true,
        requiresMembership: true,
        packageId: true,
      },
    });
    
    if (!course) {
      return new NextResponse('课程不存在', { status: 404 });
    }
    
    // 验证用户是否有权访问此课程
    let hasAccess = false;
    
    // 免费课程直接可访问
    if (course.isFree) {
      hasAccess = true;
    } else {
      // 检查用户会员状态
      if (course.requiresMembership) {
        const membership = await prisma.membership.findUnique({
          where: { userId },
          select: { type: true, status: true, endDate: true },
        });
        
        if (membership?.status === 'active' && 
            (membership.type === 'premium' || membership.type === 'basic') &&
            (!membership.endDate || new Date(membership.endDate) > new Date())) {
          hasAccess = true;
        }
      }
      
      // 检查用户是否购买了此课程或包含此课程的课程包
      if (!hasAccess) {
        const courseAccess = await prisma.userCourseAccess.findFirst({
          where: {
            userId,
            OR: [
              { courseId },
              { packageId: course.packageId, packageId: { not: null } },
            ],
            isActive: true,
          },
        });
        
        if (courseAccess) {
          hasAccess = true;
        }
      }
    }
    
    if (!hasAccess) {
      return new NextResponse('无权访问此课程', { status: 403 });
    }
    
    // 添加课程到用户课程列表
    const userCourse = await prisma.userCourse.upsert({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
      update: {
        lastAccessedAt: new Date(),
      },
      create: {
        userId,
        courseId,
        enrolledAt: new Date(),
        lastAccessedAt: new Date(),
      },
    });
    
    return NextResponse.json({ success: true, enrolledAt: userCourse.enrolledAt });
  } catch (error) {
    console.error('添加用户课程失败:', error);
    return new NextResponse('服务器错误', { status: 500 });
  }
} 