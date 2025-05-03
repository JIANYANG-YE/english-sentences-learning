import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getUserCapabilityModel } from '@/lib/progressTracker';
import { getLearningContent } from '@/lib/modeAdapters';

// 定义请求查询参数验证模式
const querySchema = z.object({
  mode: z.enum(['chinese-to-english', 'english-to-chinese', 'grammar', 'listening', 'notes']),
  level: z.enum(['beginner', 'intermediate', 'advanced']).optional()
    .transform(val => val || undefined),
  focusAreas: z.string().optional()
    .transform(val => val ? val.split(',') : undefined),
  audioSpeed: z.string().optional()
    .transform(val => val ? parseFloat(val) : 1.0),
  showTranslation: z.string().optional()
    .transform(val => val === 'true'),
  limit: z.string().optional()
    .transform(val => val ? parseInt(val) : undefined),
  skipIds: z.string().optional()
    .transform(val => val ? val.split(',') : undefined)
});

// 处理GET请求，获取个性化的课程内容
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 获取课程ID
    const lessonId = params.id;
    
    // 解析查询参数
    const { searchParams } = new URL(request.url);
    const queryResult = querySchema.safeParse(Object.fromEntries(searchParams));
    
    if (!queryResult.success) {
      return NextResponse.json(
        { error: '无效的查询参数', details: queryResult.error.format() },
        { status: 400 }
      );
    }
    
    const query = queryResult.data;
    
    // 从请求头或Cookie中获取用户ID
    const userId = request.headers.get('x-user-id') || 'anonymous';
    
    // 获取用户能力模型
    const userCapabilityModel = await getUserCapabilityModel(userId);
    
    // 获取个性化的学习内容
    const content = await getLearningContent(
      lessonId,
      query.mode,
      {
        userLevel: query.level || userCapabilityModel.level || 'intermediate',
        focusAreas: query.focusAreas || userCapabilityModel.weakAreas || [],
        userPreferences: {
          audioSpeed: query.audioSpeed || userCapabilityModel.preferences?.audioSpeed || 1.0,
          showTranslation: query.showTranslation || false
        },
        limit: query.limit,
        skipIds: query.skipIds
      }
    );
    
    // 返回个性化的内容
    return NextResponse.json(content);
    
  } catch (error) {
    // 错误处理
    console.error('Error fetching personalized content:', error);
    
    return NextResponse.json(
      { error: '获取个性化内容失败', details: (error as Error).message },
      { status: 500 }
    );
  }
}

// 处理POST请求，支持用户偏好学习内容的反馈
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 获取课程ID
    const lessonId = params.id;
    
    // 解析请求体
    const body = await request.json();
    
    // 验证请求体
    const feedbackSchema = z.object({
      userId: z.string(),
      mode: z.enum(['chinese-to-english', 'english-to-chinese', 'grammar', 'listening', 'notes']),
      contentItemId: z.string(),
      feedbackType: z.enum(['too-easy', 'appropriate', 'too-difficult', 'error', 'helpful']),
      comment: z.string().optional(),
      timeSpent: z.number().optional()
    });
    
    const validationResult = feedbackSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: '无效的反馈数据', details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    const feedback = validationResult.data;
    
    // 处理用户反馈，更新用户模型
    // 这里简化处理，实际应用中可能需要更复杂的逻辑
    await updateUserModelWithFeedback(
      feedback.userId,
      lessonId,
      feedback.mode,
      feedback.contentItemId,
      feedback.feedbackType,
      feedback.timeSpent,
      feedback.comment
    );
    
    // 返回成功响应
    return NextResponse.json({
      success: true,
      message: '感谢您的反馈，我们将用它来改进您的学习体验'
    });
    
  } catch (error) {
    // 错误处理
    console.error('Error processing feedback:', error);
    
    return NextResponse.json(
      { error: '处理反馈失败', details: (error as Error).message },
      { status: 500 }
    );
  }
}

// 根据用户反馈更新用户模型
async function updateUserModelWithFeedback(
  userId: string,
  lessonId: string,
  mode: string,
  contentItemId: string,
  feedbackType: string,
  timeSpent?: number,
  comment?: string
): Promise<void> {
  // 在实际应用中，这里会更新数据库中的用户模型
  // 这里仅提供示例实现
  console.log('更新用户模型:', {
    userId,
    lessonId,
    mode,
    contentItemId,
    feedbackType,
    timeSpent,
    comment
  });
  
  // 模拟数据库保存
  return Promise.resolve();
} 