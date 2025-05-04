import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTokenFromRequest } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const lessonId = params.id;
    
    if (!lessonId) {
      return NextResponse.json(
        { error: '课时ID必须提供' },
        { status: 400 }
      );
    }
    
    // 获取课时详情及其所属课程
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        course: true,
        section: true,
        sentences: {
          orderBy: {
            order: 'asc'
          }
        }
      }
    });
    
    if (!lesson) {
      return NextResponse.json(
        { error: '课时不存在' },
        { status: 404 }
      );
    }
    
    // 检查用户是否有权限访问该课时内容
    let hasAccess = lesson.course.isFree; // 免费课程所有人都可以访问
    let userProgress = null;
    
    // 获取当前用户（如果已认证）
    const payload = await getTokenFromRequest(request);
    
    if (payload) {
      const userId = payload.id;
      
      // 检查是否是课程作者
      if (lesson.course.authorId === userId) {
        hasAccess = true;
      } else {
        // 检查用户会员状态
        const userWithMembership = await prisma.user.findUnique({
          where: { id: userId },
          include: { membership: true }
        });
        
        // 会员可以访问会员专属课程
        if (userWithMembership?.membership?.status === 'active' && lesson.course.requiresMembership) {
          hasAccess = true;
        }
        
        // 检查用户是否已购买该课程
        if (!hasAccess) {
          const userCourseAccess = await prisma.userCourseAccess.findFirst({
            where: {
              userId,
              courseId: lesson.courseId
            }
          });
          
          if (userCourseAccess) {
            hasAccess = true;
          }
        }
      }
      
      // 获取用户对当前课时的学习进度
      userProgress = await prisma.userLearningProgress.findFirst({
        where: {
          userId,
          lessonId
        }
      });
      
      // 获取课程中的其他课时
      const otherLessons = await prisma.lesson.findMany({
        where: {
          courseId: lesson.courseId,
          id: {
            not: lessonId
          }
        },
        select: {
          id: true,
          title: true,
          order: true,
          sectionId: true
        },
        orderBy: {
          order: 'asc'
        }
      });
      
      // 如果用户有权限访问课程，记录/更新用户课程关系
      if (hasAccess) {
        // 检查用户课程记录是否存在
        const userCourse = await prisma.userCourse.findUnique({
          where: {
            userId_courseId: {
              userId,
              courseId: lesson.courseId
            }
          }
        });
        
        if (userCourse) {
          // 更新最后访问时间
          await prisma.userCourse.update({
            where: {
              userId_courseId: {
                userId,
                courseId: lesson.courseId
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
              courseId: lesson.courseId,
              progress: 0,
              lastAccessedAt: new Date()
            }
          });
        }
        
        // 如果没有进度记录，创建一个新的进度记录
        if (!userProgress) {
          userProgress = await prisma.userLearningProgress.create({
            data: {
              userId,
              lessonId,
              progress: 0,
              accuracy: 0,
              completionTime: 0,
              completed: false
            }
          });
        }
      }
      
      // 准备返回的数据
      const response: any = {
        ...lesson,
        sentences: lesson.sentences.map((sentence: { 
          id: string; 
          keywords: string; 
          grammarPoints: string; 
          tags: string;
          [key: string]: any;  
        }) => ({
          ...sentence,
          // 解析JSON字符串字段
          keywords: sentence.keywords ? JSON.parse(sentence.keywords) : [],
          grammarPoints: sentence.grammarPoints ? JSON.parse(sentence.grammarPoints) : [],
          tags: sentence.tags ? JSON.parse(sentence.tags) : []
        })),
        course: {
          id: lesson.course.id,
          title: lesson.course.title,
          description: lesson.course.description,
          level: lesson.course.level,
          isFree: lesson.course.isFree,
          requiresMembership: lesson.course.requiresMembership
        },
        otherLessons,
        userProgress,
        hasAccess
      };
      
      if (!hasAccess) {
        // 如果用户没有权限，只返回有限的句子内容（作为预览）
        response.sentences = response.sentences.slice(0, 3);
        response.isLocked = true;
        response.accessMessage = '此课时需要购买课程或会员资格才能完整访问';
      } else {
        response.isLocked = false;
      }
      
      return NextResponse.json(response);
    } else {
      // 未认证用户的处理逻辑
      // 只返回课时的基本信息和有限的内容预览
      const limitedResponse = {
        id: lesson.id,
        title: lesson.title,
        subtitle: lesson.subtitle,
        description: lesson.description,
        coverImage: lesson.coverImage,
        course: {
          id: lesson.course.id,
          title: lesson.course.title,
          level: lesson.course.level,
          isFree: lesson.course.isFree
        },
        section: lesson.section,
        // 只返回少量句子作为预览
        sentences: lesson.sentences
          .slice(0, 3)
          .map((sentence: { 
            id: string; 
            keywords: string; 
            grammarPoints: string; 
            tags: string;
            [key: string]: any;  
          }) => ({
            ...sentence,
            // 解析JSON字符串字段
            keywords: sentence.keywords ? JSON.parse(sentence.keywords) : [],
            grammarPoints: sentence.grammarPoints ? JSON.parse(sentence.grammarPoints) : [],
            tags: sentence.tags ? JSON.parse(sentence.tags) : []
          })),
        isLocked: true,
        accessMessage: '请登录后访问完整课程内容'
      };
      
      return NextResponse.json(limitedResponse);
    }
    
  } catch (error) {
    console.error('获取课时详情失败:', error);
    return NextResponse.json(
      { error: '获取课时详情失败' },
      { status: 500 }
    );
  }
} 