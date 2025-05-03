import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { processCourseContent } from '@/services/courseProcessingService';

// 获取所有课程
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    // 验证用户权限
    if (!session?.user || !['admin', 'teacher'].includes(session.user.role)) {
      return new NextResponse('无权限访问', { status: 403 });
    }

    const courses = await prisma.course.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        sections: {
          orderBy: {
            order: 'asc',
          },
        },
        lessons: {
          select: {
            id: true,
            title: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    return NextResponse.json(courses);
  } catch (error) {
    console.error('获取课程列表失败:', error);
    return new NextResponse('服务器错误', { status: 500 });
  }
}

// 创建新课程
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // 验证用户权限
    if (!session?.user || !['admin', 'teacher'].includes(session.user.role)) {
      return new NextResponse('无权限访问', { status: 403 });
    }

    const data = await request.json();
    
    // 基本验证
    if (!data.title || !data.description) {
      return new NextResponse('缺少必要字段', { status: 400 });
    }

    // 处理课程内容（如果提供）
    let processedContent = null;
    if (data.rawContent) {
      processedContent = await processCourseContent(data.rawContent, {
        language: data.language || 'en',
        targetLanguage: data.targetLanguage || 'zh-CN',
        segmentationType: data.segmentationType || 'sentence',
        processingLevel: data.processingLevel || 'standard',
      });
    }

    // 创建课程
    const course = await prisma.course.create({
      data: {
        title: data.title,
        description: data.description,
        coverImage: data.coverImage,
        level: data.level || 'beginner',
        category: data.category || 'general',
        tags: data.tags || [],
        price: data.price || 0,
        isFree: data.isFree !== undefined ? data.isFree : true,
        isFeatured: data.isFeatured || false,
        requiresMembership: data.requiresMembership || false,
        publishStatus: data.publishStatus || 'draft',
        authorId: session.user.id,
      },
    });

    // 如果有处理好的内容，创建章节和课时
    if (processedContent) {
      // 创建默认章节
      const section = await prisma.section.create({
        data: {
          title: '第一章',
          description: '课程默认章节',
          order: 1,
          courseId: course.id,
        },
      });

      // 创建课时及其内容
      for (let i = 0; i < processedContent.lessons.length; i++) {
        const lessonContent = processedContent.lessons[i];
        
        // 创建课时
        const lesson = await prisma.lesson.create({
          data: {
            title: lessonContent.title || `课时 ${i + 1}`,
            subtitle: lessonContent.subtitle,
            description: lessonContent.description,
            content: JSON.stringify(lessonContent.content),
            order: i + 1,
            courseId: course.id,
            sectionId: section.id,
          },
        });

        // 创建句子
        if (lessonContent.sentences && lessonContent.sentences.length > 0) {
          for (let j = 0; j < lessonContent.sentences.length; j++) {
            const sentence = lessonContent.sentences[j];
            
            await prisma.sentence.create({
              data: {
                english: sentence.english,
                chinese: sentence.chinese,
                lessonId: lesson.id,
                order: j + 1,
                difficulty: sentence.difficulty || 3,
                keywords: sentence.keywords || [],
                grammarPoints: sentence.grammarPoints || [],
                tags: sentence.tags || [],
              },
            });
          }
        }
      }

      // 更新课程总课时数
      await prisma.course.update({
        where: { id: course.id },
        data: { totalLessons: processedContent.lessons.length },
      });
    }

    return NextResponse.json({ id: course.id, success: true });
  } catch (error) {
    console.error('创建课程失败:', error);
    return new NextResponse('服务器错误', { status: 500 });
  }
} 