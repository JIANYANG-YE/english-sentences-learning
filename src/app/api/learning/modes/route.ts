import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { ContentBlock, SentencePair, LearningModeContent } from '@/types/materials';

// 验证请求体的schema
const modeRequestSchema = z.object({
  contentBlockId: z.string().uuid("内容块ID必须是有效的UUID").optional(),
  lessonId: z.string().uuid("课时ID必须是有效的UUID").optional(),
  mode: z.enum(['chinese-to-english', 'english-to-chinese', 'listening', 'grammar', 'notes']),
  options: z.object({
    difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
    hideHints: z.boolean().optional(),
    audioSpeed: z.number().min(0.5).max(2).optional(),
    includeExplanations: z.boolean().optional(),
  }).optional(),
}).refine(data => data.contentBlockId || data.lessonId, {
  message: "必须提供contentBlockId或lessonId",
  path: ["contentBlockId"],
});

// 模拟获取内容块的函数
const getContentBlock = async (blockId: string): Promise<ContentBlock> => {
  // 在实际项目中，应该从数据库获取内容块
  console.log(`获取内容块ID: ${blockId}`);
  
  // 模拟返回的内容块
  return {
    id: blockId,
    type: 'dialogue',
    content: [
      {
        id: uuidv4(),
        english: "Hello",
        chinese: "你好",
        pinyin: "Nǐ hǎo",
        confidence: 0.98
      },
      {
        id: uuidv4(),
        english: "How are you?",
        chinese: "你好吗？",
        pinyin: "Nǐ hǎo ma?",
        confidence: 0.95
      },
      {
        id: uuidv4(),
        english: "I'm fine, thank you.",
        chinese: "我很好，谢谢。",
        pinyin: "Wǒ hěn hǎo, xiè xiè.",
        confidence: 0.96
      }
    ]
  };
};

// 模拟获取课时的函数
const getLesson = async (lessonId: string): Promise<{
  id: string;
  title: string;
  contentBlocks: ContentBlock[];
}> => {
  // 在实际项目中，应该从数据库获取课时
  console.log(`获取课时ID: ${lessonId}`);
  
  // 生成几个模拟内容块
  const blocks: ContentBlock[] = [
    {
      id: uuidv4(),
      type: 'heading',
      content: 'Lesson 1: Basic Greetings'
    },
    {
      id: uuidv4(),
      type: 'paragraph',
      content: 'In this lesson, we will learn some basic greetings in Chinese.'
    },
    {
      id: uuidv4(),
      type: 'dialogue',
      content: [
        {
          id: uuidv4(),
          english: "Hello",
          chinese: "你好",
          pinyin: "Nǐ hǎo",
          confidence: 0.98
        },
        {
          id: uuidv4(),
          english: "How are you?",
          chinese: "你好吗？",
          pinyin: "Nǐ hǎo ma?",
          confidence: 0.95
        }
      ]
    },
    {
      id: uuidv4(),
      type: 'dialogue',
      content: [
        {
          id: uuidv4(),
          english: "I'm fine, thank you.",
          chinese: "我很好，谢谢。",
          pinyin: "Wǒ hěn hǎo, xiè xiè.",
          confidence: 0.96
        },
        {
          id: uuidv4(),
          english: "And you?",
          chinese: "你呢？",
          pinyin: "Nǐ ne?",
          confidence: 0.97
        }
      ]
    }
  ];
  
  return {
    id: lessonId,
    title: 'Basic Greetings',
    contentBlocks: blocks
  };
};

// 转换为中译英模式
const convertToChineseToEnglish = (blocks: ContentBlock[], options?: any): LearningModeContent => {
  const convertedBlocks = blocks.map(block => {
    if (block.type === 'dialogue') {
      const pairs = block.content as SentencePair[];
      return {
        id: block.id,
        type: 'quiz',
        content: pairs.map(pair => ({
          id: pair.id,
          question: pair.chinese,
          questionAudio: pair.audio?.chineseUrl,
          correctAnswer: pair.english,
          pinyin: options?.hideHints ? undefined : pair.pinyin,
          difficulty: pairToDifficulty(pair, options?.difficulty || 'medium')
        }))
      };
    }
    return {
      id: block.id,
      type: block.type,
      content: block.content
    };
  });
  
  return {
    mode: 'chinese-to-english',
    blocks: convertedBlocks,
    metadata: {
      difficulty: options?.difficulty || 'medium',
      totalQuestions: convertedBlocks
        .filter(b => b.type === 'quiz')
        .reduce((sum, b) => sum + (Array.isArray(b.content) ? b.content.length : 0), 0)
    }
  };
};

// 转换为英译中模式
const convertToEnglishToChinese = (blocks: ContentBlock[], options?: any): LearningModeContent => {
  const convertedBlocks = blocks.map(block => {
    if (block.type === 'dialogue') {
      const pairs = block.content as SentencePair[];
      return {
        id: block.id,
        type: 'quiz',
        content: pairs.map(pair => ({
          id: pair.id,
          question: pair.english,
          questionAudio: pair.audio?.englishUrl,
          correctAnswer: pair.chinese,
          pinyin: options?.hideHints ? undefined : pair.pinyin,
          difficulty: pairToDifficulty(pair, options?.difficulty || 'medium')
        }))
      };
    }
    return {
      id: block.id,
      type: block.type,
      content: block.content
    };
  });
  
  return {
    mode: 'english-to-chinese',
    blocks: convertedBlocks,
    metadata: {
      difficulty: options?.difficulty || 'medium',
      totalQuestions: convertedBlocks
        .filter(b => b.type === 'quiz')
        .reduce((sum, b) => sum + (Array.isArray(b.content) ? b.content.length : 0), 0)
    }
  };
};

// 转换为听力模式
const convertToListening = (blocks: ContentBlock[], options?: any): LearningModeContent => {
  const convertedBlocks = blocks.map(block => {
    if (block.type === 'dialogue') {
      const pairs = block.content as SentencePair[];
      return {
        id: block.id,
        type: 'listening',
        content: pairs.map(pair => ({
          id: pair.id,
          audio: pair.audio?.englishUrl || pair.audio?.chineseUrl,
          languages: {
            english: pair.english,
            chinese: pair.chinese
          },
          pinyin: options?.hideHints ? undefined : pair.pinyin,
          audioSpeed: options?.audioSpeed || 1.0,
          showTranscript: false,
          difficulty: pairToDifficulty(pair, options?.difficulty || 'medium')
        }))
      };
    }
    return {
      id: block.id,
      type: block.type,
      content: block.content
    };
  });
  
  return {
    mode: 'listening',
    blocks: convertedBlocks,
    metadata: {
      difficulty: options?.difficulty || 'medium',
      audioSpeed: options?.audioSpeed || 1.0,
      totalAudios: convertedBlocks
        .filter(b => b.type === 'listening')
        .reduce((sum, b) => sum + (Array.isArray(b.content) ? b.content.length : 0), 0)
    }
  };
};

// 转换为语法模式
const convertToGrammar = (blocks: ContentBlock[], options?: any): LearningModeContent => {
  const convertedBlocks = blocks.map(block => {
    if (block.type === 'dialogue') {
      const pairs = block.content as SentencePair[];
      return {
        id: block.id,
        type: 'grammar',
        content: pairs.map(pair => ({
          id: pair.id,
          chinese: pair.chinese,
          english: pair.english,
          pinyin: pair.pinyin,
          grammarPoints: pair.grammarPoints || [],
          explanation: options?.includeExplanations ? generateGrammarExplanation(pair) : undefined
        }))
      };
    }
    return {
      id: block.id,
      type: block.type,
      content: block.content
    };
  });
  
  return {
    mode: 'grammar',
    blocks: convertedBlocks,
    metadata: {
      includeExplanations: options?.includeExplanations || false,
      totalSentences: convertedBlocks
        .filter(b => b.type === 'grammar')
        .reduce((sum, b) => sum + (Array.isArray(b.content) ? b.content.length : 0), 0)
    }
  };
};

// 转换为笔记模式
const convertToNotes = (blocks: ContentBlock[]): LearningModeContent => {
  const convertedBlocks = blocks.map(block => {
    if (block.type === 'dialogue') {
      const pairs = block.content as SentencePair[];
      return {
        id: block.id,
        type: 'notes',
        content: pairs.map(pair => ({
          id: pair.id,
          chinese: pair.chinese,
          english: pair.english,
          pinyin: pair.pinyin,
          notes: pair.notes || '',
          vocabulary: pair.vocabulary || []
        }))
      };
    }
    return {
      id: block.id,
      type: block.type,
      content: block.content
    };
  });
  
  return {
    mode: 'notes',
    blocks: convertedBlocks,
    metadata: {
      editable: true,
      totalSentences: convertedBlocks
        .filter(b => b.type === 'notes')
        .reduce((sum, b) => sum + (Array.isArray(b.content) ? b.content.length : 0), 0)
    }
  };
};

// 根据难度级别调整句子对的难度
const pairToDifficulty = (pair: SentencePair, targetDifficulty: string): any => {
  // 可以根据多种因素为句子对分配难度：
  // - 句子长度
  // - 词汇复杂度
  // - 语法结构
  // - 生词比例
  
  let difficulty: any = {
    level: targetDifficulty,
    points: 0,
  };
  
  // 根据句子长度计算基础分数
  const chineseLength = pair.chinese.length;
  const englishWordCount = pair.english.split(/\s+/).length;
  
  if (targetDifficulty === 'easy') {
    // 简单级别：提供更多提示，较短的句子
    difficulty.points = 5;
    difficulty.hints = {
      showPinyin: true,
      showFirstCharacter: true,
      showWordBank: true
    };
  } else if (targetDifficulty === 'medium') {
    // 中等级别：有限的提示
    difficulty.points = 10;
    difficulty.hints = {
      showPinyin: chineseLength > 10,
      showFirstCharacter: false,
      showWordBank: true
    };
  } else {
    // 困难级别：几乎没有提示
    difficulty.points = 15;
    difficulty.hints = {
      showPinyin: false,
      showFirstCharacter: false,
      showWordBank: false
    };
  }
  
  return difficulty;
};

// 生成语法解释
const generateGrammarExplanation = (pair: SentencePair): string => {
  // 在实际应用中，这应该是基于NLP或预定义规则的实际语法分析
  // 这里只是一个简单的模拟
  
  const explanation = `
句子结构分析：
- 中文: ${pair.chinese}
- 拼音: ${pair.pinyin}
- 英文: ${pair.english}

这是一个${pair.chinese.includes('吗') ? '疑问句' : '陈述句'}。
${pair.chinese.includes('谢谢') ? '这个句子包含"谢谢"，是一个常用礼貌用语。' : ''}
${pair.chinese.includes('我') ? '"我"(wǒ)是第一人称代词，相当于英语中的"I"。' : ''}
${pair.chinese.includes('你') ? '"你"(nǐ)是第二人称代词，相当于英语中的"you"。' : ''}
${pair.chinese.includes('很') ? '"很"(hěn)是一个程度副词，通常用于形容词前，但在翻译成英语时往往不需要单独翻译。' : ''}
`;

  return explanation.trim();
};

export async function POST(request: NextRequest) {
  try {
    // 1. 解析请求体
    const body = await request.json();
    
    // 2. 验证请求参数
    const validation = modeRequestSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: '无效的请求参数', details: validation.error.format() },
        { status: 400 }
      );
    }

    const { contentBlockId, lessonId, mode, options } = validation.data;
    
    // 3. 获取内容块或课时
    let blocks: ContentBlock[] = [];
    let contextTitle = '';
    
    if (contentBlockId) {
      const block = await getContentBlock(contentBlockId);
      blocks = [block];
      contextTitle = `Content Block ${contentBlockId}`;
    } else if (lessonId) {
      const lesson = await getLesson(lessonId);
      blocks = lesson.contentBlocks;
      contextTitle = lesson.title;
    }
    
    // 4. 根据学习模式转换内容
    let modeContent: LearningModeContent;
    
    switch (mode) {
      case 'chinese-to-english':
        modeContent = convertToChineseToEnglish(blocks, options);
        break;
      case 'english-to-chinese':
        modeContent = convertToEnglishToChinese(blocks, options);
        break;
      case 'listening':
        modeContent = convertToListening(blocks, options);
        break;
      case 'grammar':
        modeContent = convertToGrammar(blocks, options);
        break;
      case 'notes':
        modeContent = convertToNotes(blocks);
        break;
      default:
        return NextResponse.json(
          { error: `不支持的学习模式: ${mode}` },
          { status: 400 }
        );
    }
    
    // 5. 返回转换后的内容
    return NextResponse.json({
      success: true,
      mode,
      context: {
        id: contentBlockId || lessonId,
        title: contextTitle,
        type: contentBlockId ? 'contentBlock' : 'lesson'
      },
      content: modeContent
    });
    
  } catch (error) {
    console.error('转换学习模式错误:', error);
    return NextResponse.json(
      { error: '处理请求时发生错误' },
      { status: 500 }
    );
  }
} 