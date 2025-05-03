import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// 进度数据验证模式
const progressSchema = z.object({
  userId: z.string(),
  courseId: z.string(),
  lessonId: z.string(),
  mode: z.string(),
  completedItems: z.number(),
  totalItems: z.number(),
  correctCount: z.number(),
  incorrectCount: z.number(),
  timeSpent: z.number(),
  lastPosition: z.number(),
  lastAccessAt: z.string()
});

// 数据存储（未来可替换为实际数据库）
type ProgressData = z.infer<typeof progressSchema>;
let progressData: ProgressData[] = [];

/**
 * GET /api/analytics/progress
 * 获取所有学习进度数据或按用户ID筛选
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (userId) {
      const userProgress = progressData.filter(item => item.userId === userId);
      return NextResponse.json(userProgress, { status: 200 });
    }
    
    return NextResponse.json(progressData, { status: 200 });
  } catch (error) {
    console.error('获取学习进度失败:', error);
    return NextResponse.json(
      { error: '获取学习进度失败' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/analytics/progress
 * 保存学习进度数据
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 验证请求数据
    const result = progressSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: '无效的进度数据', details: result.error.format() },
        { status: 400 }
      );
    }
    
    const newProgress = result.data;
    
    // 检查是否存在相同课程和课时的进度记录
    const existingIndex = progressData.findIndex(
      item => 
        item.userId === newProgress.userId && 
        item.courseId === newProgress.courseId && 
        item.lessonId === newProgress.lessonId &&
        item.mode === newProgress.mode
    );
    
    if (existingIndex !== -1) {
      // 更新现有记录
      progressData[existingIndex] = newProgress;
    } else {
      // 添加新记录
      progressData.push(newProgress);
    }
    
    return NextResponse.json(newProgress, { status: 201 });
  } catch (error) {
    console.error('保存学习进度失败:', error);
    return NextResponse.json(
      { error: '保存学习进度失败' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/analytics/progress
 * 删除学习进度数据
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const courseId = searchParams.get('courseId');
    const lessonId = searchParams.get('lessonId');
    
    if (!userId) {
      return NextResponse.json(
        { error: '必须提供userId参数' },
        { status: 400 }
      );
    }
    
    // 根据提供的参数筛选要删除的数据
    if (userId && courseId && lessonId) {
      progressData = progressData.filter(
        item => !(item.userId === userId && item.courseId === courseId && item.lessonId === lessonId)
      );
    } else if (userId && courseId) {
      progressData = progressData.filter(
        item => !(item.userId === userId && item.courseId === courseId)
      );
    } else if (userId) {
      progressData = progressData.filter(item => item.userId !== userId);
    }
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('删除学习进度失败:', error);
    return NextResponse.json(
      { error: '删除学习进度失败' },
      { status: 500 }
    );
  }
} 