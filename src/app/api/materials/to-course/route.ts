import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { ProcessingMethod } from '@/types/materials';
import { ContentBlock, SentencePair } from '@/types/materials';

// 验证请求体的schema
const toCourseRequestSchema = z.object({
  materialId: z.string().uuid("材料ID必须是有效的UUID"),
  title: z.string().min(1, "标题不能为空"),
  description: z.string().optional(),
  level: z.enum(['beginner', 'intermediate', 'advanced', 'all-levels']).optional(),
  category: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  price: z.number().nonnegative("价格不能为负数").optional(),
  isFree: z.boolean().optional(),
  options: z.object({
    generateAudio: z.boolean().optional(),
    createExercises: z.boolean().optional(),
    extractVocabulary: z.boolean().optional(),
    identifyGrammarPoints: z.boolean().optional(),
    lessonSplitMethod: z.enum(['paragraph', 'page', 'custom']).optional(),
    maxSentencesPerLesson: z.number().int().positive().optional(),
  }).optional(),
});

// 模拟从材料获取内容的函数
const getProcessedContent = async (materialId: string): Promise<string> => {
  // 在实际项目中，应该从数据库或存储服务获取处理过的材料内容
  console.log(`获取材料ID: ${materialId} 的处理内容`);
  
  // 模拟延迟
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // 返回模拟的处理内容
  return `
  Lesson 1: Introduction to Chinese
  
  Welcome to your first Chinese lesson. Today we will learn some basic greetings and phrases.
  
  1. Hello / Hi
  English: Hello
  Chinese: 你好
  Pinyin: Nǐ hǎo
  
  2. How are you?
  English: How are you?
  Chinese: 你好吗？
  Pinyin: Nǐ hǎo ma?
  
  3. I'm fine, thank you.
  English: I'm fine, thank you.
  Chinese: 我很好，谢谢。
  Pinyin: Wǒ hěn hǎo, xiè xiè.
  
  4. What's your name?
  English: What's your name?
  Chinese: 你叫什么名字？
  Pinyin: Nǐ jiào shénme míngzì?
  
  5. My name is...
  English: My name is...
  Chinese: 我的名字是...
  Pinyin: Wǒ de míngzì shì...
  `;
};

// 创建内容块
const createContentBlocks = (text: string): ContentBlock[] => {
  const lines = text.split('\n').map(line => line.trim());
  const blocks: ContentBlock[] = [];
  
  let currentType: 'heading' | 'paragraph' | 'dialogue' = 'paragraph';
  let currentContent: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // 跳过空行
    if (!line) {
      if (currentContent.length > 0) {
        // 保存当前块
        blocks.push({
          id: uuidv4(),
          type: currentType,
          content: currentContent.join('\n')
        });
        currentContent = [];
      }
      continue;
    }
    
    // 检测标题
    if (line.startsWith('Lesson ') || /^[0-9]+\./.test(line) === false && line.length < 50 && !line.includes(':')) {
      if (currentContent.length > 0) {
        // 保存之前的块
        blocks.push({
          id: uuidv4(),
          type: currentType,
          content: currentContent.join('\n')
        });
        currentContent = [];
      }
      
      blocks.push({
        id: uuidv4(),
        type: 'heading',
        content: line
      });
      currentType = 'paragraph';
      continue;
    }
    
    // 检测对话或句对
    if (line.startsWith('English:') && i + 1 < lines.length && lines[i + 1].startsWith('Chinese:')) {
      if (currentContent.length > 0) {
        // 保存之前的块
        blocks.push({
          id: uuidv4(),
          type: currentType,
          content: currentContent.join('\n')
        });
        currentContent = [];
      }
      
      // 创建句子对
      const sentencePair: SentencePair = {
        id: uuidv4(),
        english: line.replace('English:', '').trim(),
        chinese: lines[i + 1].replace('Chinese:', '').trim(),
      };
      
      // 如果有拼音，加上拼音
      if (i + 2 < lines.length && lines[i + 2].startsWith('Pinyin:')) {
        sentencePair.pinyin = lines[i + 2].replace('Pinyin:', '').trim();
        i += 2;  // 跳过已处理的行
      } else {
        i += 1;  // 只跳过一行
      }
      
      // 查看是否已有对话块
      const lastBlock = blocks[blocks.length - 1];
      if (lastBlock && lastBlock.type === 'dialogue') {
        // 添加到现有对话块
        (lastBlock.content as SentencePair[]).push(sentencePair);
      } else {
        // 创建新对话块
        blocks.push({
          id: uuidv4(),
          type: 'dialogue',
          content: [sentencePair]
        });
      }
      continue;
    }
    
    // 普通段落
    currentContent.push(line);
  }
  
  // 保存最后一个块
  if (currentContent.length > 0) {
    blocks.push({
      id: uuidv4(),
      type: currentType,
      content: currentContent.join('\n')
    });
  }
  
  return blocks;
};

// 创建课时内容
const createLessons = (blocks: ContentBlock[], options?: any) => {
  let lessons = [];
  let currentLessonBlocks: ContentBlock[] = [];
  let currentSentenceCount = 0;
  const maxSentencesPerLesson = options?.maxSentencesPerLesson || 10;
  
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    
    // 如果这是标题且不是第一个块，可能是新课时的开始
    if (block.type === 'heading' && i > 0 && block.content.toString().toLowerCase().includes('lesson')) {
      if (currentLessonBlocks.length > 0) {
        // 创建之前的课时
        lessons.push(createLesson(currentLessonBlocks, options));
        currentLessonBlocks = [];
        currentSentenceCount = 0;
      }
    }
    
    // 如果是对话框，计算句子对数量
    if (block.type === 'dialogue') {
      const pairs = block.content as SentencePair[];
      currentSentenceCount += pairs.length;
      
      // 如果当前课时已经有足够的句子，创建新课时
      if (currentSentenceCount > maxSentencesPerLesson && currentLessonBlocks.length > 0) {
        lessons.push(createLesson(currentLessonBlocks, options));
        currentLessonBlocks = [];
        currentSentenceCount = pairs.length;
      }
    }
    
    currentLessonBlocks.push(block);
  }
  
  // 创建最后一个课时
  if (currentLessonBlocks.length > 0) {
    lessons.push(createLesson(currentLessonBlocks, options));
  }
  
  return lessons;
};

// 创建单个课时
const createLesson = (blocks: ContentBlock[], options?: any) => {
  let title = "Unnamed Lesson";
  
  // 寻找标题
  const headingBlock = blocks.find(block => block.type === 'heading');
  if (headingBlock) {
    title = headingBlock.content.toString();
  }
  
  // 提取句子对
  const sentencePairs: SentencePair[] = [];
  blocks.forEach(block => {
    if (block.type === 'dialogue') {
      sentencePairs.push(...(block.content as SentencePair[]));
    }
  });
  
  // 计算词汇量
  const vocabularyCount = new Set(
    sentencePairs.flatMap(pair => 
      pair.chinese.split(/\s+/).filter(word => word)
    )
  ).size;
  
  return {
    id: uuidv4(),
    title,
    blocks,
    sentencePairs,
    sentenceCount: sentencePairs.length,
    vocabularyCount,
    duration: Math.round(sentencePairs.length * 1.5), // 估计每个句子平均1.5分钟
    audioGenerated: options?.generateAudio || false
  };
};

export async function POST(request: NextRequest) {
  try {
    // 1. 解析请求体
    const body = await request.json();
    
    // 2. 验证请求参数
    const validation = toCourseRequestSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: '无效的请求参数', details: validation.error.format() },
        { status: 400 }
      );
    }

    const { materialId, title, description, level, category, tags, price, isFree, options } = validation.data;
    
    // 3. 获取处理过的材料内容
    const processedContent = await getProcessedContent(materialId);
    
    // 4. 创建内容块
    const contentBlocks = createContentBlocks(processedContent);
    
    // 5. 创建课时
    const lessons = createLessons(contentBlocks, options);
    
    // 6. 创建课程
    const course = {
      id: uuidv4(),
      title,
      description: description || "",
      coverImage: "https://placehold.co/600x400?text=Course+Cover",
      level: level || "beginner",
      category: category || ["Chinese Learning"],
      tags: tags || ["beginner", "chinese", "language"],
      price: price || 0,
      isFree: isFree !== undefined ? isFree : true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lessons: lessons.map((lesson, index) => ({
        id: lesson.id,
        title: lesson.title,
        description: `Lesson ${index + 1} of ${title}`,
        order: index + 1,
        contentBlocks: lesson.blocks,
        sentencePairs: lesson.sentencePairs,
        sentenceCount: lesson.sentenceCount,
        vocabularyCount: lesson.vocabularyCount,
        duration: lesson.duration,
        isPreview: index === 0, // 第一课为预览
      })),
      totalLessons: lessons.length,
      totalSentences: lessons.reduce((sum, lesson) => sum + lesson.sentenceCount, 0),
      totalVocabulary: lessons.reduce((sum, lesson) => sum + lesson.vocabularyCount, 0),
      duration: lessons.reduce((sum, lesson) => sum + lesson.duration, 0),
    };
    
    // 7. 在数据库中保存课程（这里省略，实际项目中需要实现）
    
    // 8. 返回创建的课程
    return NextResponse.json({
      success: true,
      course: {
        id: course.id,
        title: course.title,
        description: course.description,
        coverImage: course.coverImage,
        totalLessons: course.totalLessons,
        totalSentences: course.totalSentences,
        totalVocabulary: course.totalVocabulary,
        duration: course.duration,
        level: course.level,
        createdAt: course.createdAt
      },
      importProgress: {
        materialId,
        courseId: course.id,
        status: 'completed',
        progress: 100,
        currentStep: '课程创建完成',
        startedAt: new Date(Date.now() - 5000).toISOString(),
        completedAt: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('创建课程错误:', error);
    return NextResponse.json(
      { error: '处理请求时发生错误' },
      { status: 500 }
    );
  }
} 