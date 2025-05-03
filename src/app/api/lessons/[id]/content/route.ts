import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { LearningMode } from '@/types/learning';
import { getLessonContentForMode } from '@/lib/modeAdapters';
import { SentencePair, ContentBlock } from '@/types/courses/contentTypes';

// 模拟课时数据
const mockLesson = {
  id: 'lesson-001',
  title: '爱上英语',
  description: '这是第一课，介绍为什么要学习英语以及如何爱上英语学习。',
  contentBlocks: [
    // 标题内容块
    {
      id: 'block-001',
      type: 'heading' as const,
      lessonId: 'lesson-001',
      order: 1,
      level: 1 as const,
      sentencePair: {
        id: 'pair-001',
        english: 'Fall in Love with English',
        chinese: '爱上英语',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    // 段落内容块
    {
      id: 'block-002',
      type: 'paragraph' as const,
      lessonId: 'lesson-001',
      order: 2,
      sentencePairs: [
        {
          id: 'pair-002',
          english: 'I hated English in middle school. I couldn\'t understand why I needed to learn a foreign language.',
          chinese: '我在中学时讨厌英语。我不理解为什么我需要学习一门外语。',
          audioUrl: '/api/audio/pair-002.mp3',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          metadata: {
            difficulty: 'intermediate' as const,
            grammarPoints: ['past-tense', 'modals'],
          },
        },
        {
          id: 'pair-003',
          english: 'It seemed so useless. My English teacher was very strict, and English class was boring.',
          chinese: '它似乎毫无用处。我的英语老师非常严格，英语课很无聊。',
          audioUrl: '/api/audio/pair-003.mp3',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          metadata: {
            difficulty: 'beginner' as const,
            grammarPoints: ['past-tense', 'adjectives'],
          },
        },
        {
          id: 'pair-004',
          english: 'I always got poor grades in English tests.',
          chinese: '我在英语考试中总是得低分。',
          audioUrl: '/api/audio/pair-004.mp3',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          metadata: {
            difficulty: 'beginner' as const,
            grammarPoints: ['past-tense', 'adverbs'],
          },
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    // 对话内容块
    {
      id: 'block-003',
      type: 'dialog' as const,
      lessonId: 'lesson-001',
      order: 3,
      speakers: ['Teacher', 'Student'],
      dialogPairs: [
        {
          id: 'dialog-001',
          speakerIndex: 0,
          sentencePair: {
            id: 'pair-005',
            english: 'Why do you think learning English is important?',
            chinese: '你认为学习英语为什么重要？',
            audioUrl: '/api/audio/pair-005.mp3',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        },
        {
          id: 'dialog-002',
          speakerIndex: 1,
          sentencePair: {
            id: 'pair-006',
            english: 'It helps me connect with people from different countries.',
            chinese: '它帮助我与来自不同国家的人交流。',
            audioUrl: '/api/audio/pair-006.mp3',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
};

// 查询参数验证
const querySchema = z.object({
  mode: z.enum(['chinese-to-english', 'english-to-chinese', 'grammar', 'listening', 'notes']),
});

/**
 * GET /api/lessons/[id]/content
 * 获取指定学习模式的课时内容
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const lessonId = params.id;
    const { searchParams } = new URL(request.url);

    // 验证查询参数
    const parsedQuery = querySchema.safeParse(Object.fromEntries(searchParams.entries()));

    if (!parsedQuery.success) {
      return NextResponse.json(
        { error: '无效的查询参数', details: parsedQuery.error.format() },
        { status: 400 }
      );
    }

    const { mode } = parsedQuery.data;

    // 在实际应用中，这里会从数据库获取课时内容
    // 目前使用模拟数据
    // const lesson = await getLesson(lessonId);
    const lesson = mockLesson;

    if (!lesson) {
      return NextResponse.json(
        { error: '课时不存在' },
        { status: 404 }
      );
    }

    // 将课时内容转换为适合特定学习模式的格式
    const modeContent = getLessonContentForMode(
      lesson.title,
      lesson.description,
      lessonId,
      lesson.contentBlocks as ContentBlock[],
      mode as LearningMode
    );

    return NextResponse.json(modeContent);
  } catch (error) {
    console.error('获取课时内容失败:', error);
    return NextResponse.json(
      { error: '获取课时内容失败', details: (error as Error).message },
      { status: 500 }
    );
  }
} 