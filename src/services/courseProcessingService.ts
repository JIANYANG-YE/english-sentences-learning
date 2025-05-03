/**
 * 课程处理服务
 * 负责分析、分解和处理课程内容
 */

import { analyzeSentenceDifficulty } from '@/utils/sentenceAnalysis';
import { extractKeywords } from '@/utils/textProcessing';
import { identifyGrammarPoints } from '@/utils/grammarAnalysis';

interface ProcessingOptions {
  language: string;
  targetLanguage: string;
  segmentationType: 'sentence' | 'paragraph' | 'auto';
  processingLevel: 'basic' | 'standard' | 'advanced';
}

interface SentenceData {
  english: string;
  chinese: string;
  difficulty?: number;
  keywords?: string[];
  grammarPoints?: string[];
  tags?: string[];
}

interface LessonData {
  title?: string;
  subtitle?: string;
  description?: string;
  content: any;
  sentences?: SentenceData[];
}

interface ProcessedContent {
  title: string;
  description: string;
  language: string;
  targetLanguage: string;
  lessons: LessonData[];
  metadata: {
    sentenceCount: number;
    avgDifficulty: number;
    processingLevel: string;
  };
}

/**
 * 处理课程原始内容
 * @param rawContent 原始内容
 * @param options 处理选项
 * @returns 处理后的课程内容
 */
export async function processCourseContent(
  rawContent: string,
  options: ProcessingOptions
): Promise<ProcessedContent> {
  try {
    // 1. 根据内容类型决定处理策略
    const contentType = detectContentType(rawContent);
    
    // 2. 分解内容为章节/课时
    const segmentedContent = segmentContent(rawContent, contentType, options.segmentationType);
    
    // 3. 处理每个章节内容
    const processedLessons = await Promise.all(
      segmentedContent.lessons.map(async (lesson) => {
        return await processLesson(lesson, options);
      })
    );
    
    // 4. 计算整体元数据
    const sentenceCount = processedLessons.reduce(
      (count, lesson) => count + (lesson.sentences?.length || 0),
      0
    );
    
    const totalDifficulty = processedLessons.reduce(
      (sum, lesson) => sum + lesson.sentences?.reduce((s, sentence) => s + (sentence.difficulty || 3), 0) || 0,
      0
    );
    
    const avgDifficulty = sentenceCount > 0 ? totalDifficulty / sentenceCount : 3;
    
    // 5. 返回处理后的内容
    return {
      title: segmentedContent.title || '未命名课程',
      description: segmentedContent.description || '课程描述',
      language: options.language,
      targetLanguage: options.targetLanguage,
      lessons: processedLessons,
      metadata: {
        sentenceCount,
        avgDifficulty,
        processingLevel: options.processingLevel,
      },
    };
  } catch (error) {
    console.error('处理课程内容失败:', error);
    throw new Error(`处理课程内容失败: ${(error as Error).message}`);
  }
}

/**
 * 检测内容类型
 */
function detectContentType(content: string): 'book' | 'article' | 'script' | 'dialog' | 'general' {
  // 简单的内容类型检测逻辑
  if (content.includes('CHAPTER') || content.includes('Chapter')) {
    return 'book';
  } else if (content.includes('EXT.') || content.includes('INT.')) {
    return 'script';
  } else if (content.match(/^[A-Z]+:/gm)) {
    return 'dialog';
  } else if (content.length > 5000) {
    return 'article';
  } else {
    return 'general';
  }
}

/**
 * 将内容分割为课时
 */
function segmentContent(
  content: string,
  contentType: 'book' | 'article' | 'script' | 'dialog' | 'general',
  segmentationType: 'sentence' | 'paragraph' | 'auto'
): { title?: string; description?: string; lessons: any[] } {
  let title = '';
  let description = '';
  let lessons: any[] = [];

  // 根据内容类型使用不同的分割策略
  switch (contentType) {
    case 'book':
      // 提取标题（通常是第一行或开头部分）
      const lines = content.split('\n');
      title = lines[0]?.trim() || '未命名书籍';
      
      // 按章节分割
      const chapterPattern = /(?:CHAPTER|Chapter)\s+\w+(?:\s*[\-:])?\s*(.*?)(?=\n)/g;
      let match;
      let lastIndex = 0;
      const chapters = [];
      
      while ((match = chapterPattern.exec(content)) !== null) {
        const chapterTitle = match[1] || `Chapter ${chapters.length + 1}`;
        const chapterStartIndex = match.index;
        
        if (chapters.length > 0) {
          // 设置上一章的内容
          chapters[chapters.length - 1].content = content.substring(
            chapters[chapters.length - 1].startIndex,
            chapterStartIndex
          ).trim();
        }
        
        chapters.push({
          title: chapterTitle,
          startIndex: chapterStartIndex,
        });
        
        lastIndex = chapterPattern.lastIndex;
      }
      
      // 设置最后一章的内容
      if (chapters.length > 0) {
        chapters[chapters.length - 1].content = content.substring(
          chapters[chapters.length - 1].startIndex
        ).trim();
      } else {
        // 如果没有找到章节，将整个内容作为一个课时
        chapters.push({
          title: '第1章',
          content: content,
        });
      }
      
      lessons = chapters.map((chapter, index) => ({
        title: chapter.title,
        subtitle: `第${index + 1}章`,
        content: chapter.content,
      }));
      break;
      
    case 'article':
      title = extractTitle(content) || '未命名文章';
      description = extractSummary(content);
      
      // 按段落分割（如果内容很长，可能需要进一步合并段落）
      const paragraphs = content.split(/\n\s*\n/);
      
      // 如果段落太多，根据内容长度进行合并
      if (paragraphs.length > 20) {
        lessons = combineContentIntoLessons(paragraphs, 2000); // 2000字左右一课
      } else {
        lessons = paragraphs.map((para, index) => ({
          title: `段落 ${index + 1}`,
          content: para.trim(),
        }));
      }
      break;
      
    case 'script':
      title = extractTitle(content) || '未命名剧本';
      
      // 按场景分割
      const scenePattern = /(?:EXT|INT)\..*?(?=(?:EXT|INT)\.|\Z)/gs;
      const scenes = [];
      
      while ((match = scenePattern.exec(content)) !== null) {
        scenes.push(match[0].trim());
      }
      
      // 合并场景为合适的课时
      lessons = combineContentIntoLessons(scenes, 1500);
      break;
      
    case 'dialog':
      title = extractTitle(content) || '未命名对话';
      
      // 按对话分段
      const dialogPattern = /^[A-Z]+:.*?(?=^[A-Z]+:|\Z)/gms;
      const dialogs = [];
      
      while ((match = dialogPattern.exec(content)) !== null) {
        dialogs.push(match[0].trim());
      }
      
      // 每5-10个对话为一课
      lessons = combineContentIntoLessons(dialogs, 10, true);
      break;
      
    default:
      // 一般内容：根据分割类型分段
      title = extractTitle(content) || '未命名内容';
      
      if (segmentationType === 'sentence') {
        const sentences = splitIntoSentences(content);
        
        // 每10-15个句子为一课
        lessons = combineContentIntoLessons(sentences, 15, true);
      } else {
        const paragraphs = content.split(/\n\s*\n/);
        
        // 每3-5段为一课
        lessons = combineContentIntoLessons(paragraphs, 5, true);
      }
      break;
  }

  return {
    title,
    description,
    lessons,
  };
}

/**
 * 处理单个课时内容
 */
async function processLesson(
  lesson: any,
  options: ProcessingOptions
): Promise<LessonData> {
  // 1. 将内容分割为句子
  const sentencePairs = await extractSentencePairs(lesson.content, options.language, options.targetLanguage);
  
  // 2. 分析每个句子
  const processedSentences = await Promise.all(
    sentencePairs.map(async (pair) => {
      // 分析句子难度
      const difficulty = await analyzeSentenceDifficulty(pair.english);
      
      // 提取关键词
      const keywords = await extractKeywords(pair.english);
      
      // 识别语法点
      const grammarPoints = await identifyGrammarPoints(pair.english);
      
      return {
        english: pair.english,
        chinese: pair.chinese,
        difficulty,
        keywords,
        grammarPoints,
        tags: []
      };
    })
  );
  
  // 3. 根据处理级别执行额外分析
  let enhancedContent = lesson.content;
  
  if (options.processingLevel === 'advanced') {
    // 为高级处理添加更多分析和内容增强
    enhancedContent = await enhanceContentWithExplanations(lesson.content, processedSentences);
  }
  
  // 4. 返回处理后的课时
  return {
    title: lesson.title,
    subtitle: lesson.subtitle,
    description: lesson.description || generateLessonDescription(processedSentences),
    content: enhancedContent,
    sentences: processedSentences,
  };
}

/**
 * 从内容中提取标题
 */
function extractTitle(content: string): string {
  // 简单的标题提取逻辑
  const lines = content.split('\n');
  return lines[0]?.trim() || '';
}

/**
 * 从内容中提取摘要
 */
function extractSummary(content: string): string {
  // 简单的摘要提取逻辑：取前2-3段作为摘要
  const paragraphs = content.split(/\n\s*\n/);
  return paragraphs.slice(0, 2).join(' ').substring(0, 200) + '...';
}

/**
 * 将内容组合为适当大小的课时
 */
function combineContentIntoLessons(
  contentPieces: string[],
  targetSize: number,
  countMode = false
): any[] {
  const lessons = [];
  let currentLesson: string[] = [];
  let currentSize = 0;
  
  contentPieces.forEach((piece, index) => {
    const pieceSize = countMode ? 1 : piece.length;
    
    // 如果当前课时已经达到目标大小，或者是最后一块内容
    if (currentSize + pieceSize > targetSize && currentLesson.length > 0 || index === contentPieces.length - 1) {
      // 将最后一块加入当前课时
      if (index === contentPieces.length - 1) {
        currentLesson.push(piece);
      }
      
      // 为新课时创建标题
      const lessonNumber = lessons.length + 1;
      
      lessons.push({
        title: `课时 ${lessonNumber}`,
        subtitle: `第${lessonNumber}部分`,
        content: currentLesson.join('\n\n'),
      });
      
      // 重置当前课时
      currentLesson = [];
      currentSize = 0;
      
      // 如果不是最后一块，将当前内容作为新课时的第一块
      if (index !== contentPieces.length - 1) {
        currentLesson.push(piece);
        currentSize = pieceSize;
      }
    } else {
      // 将内容添加到当前课时
      currentLesson.push(piece);
      currentSize += pieceSize;
    }
  });
  
  // 处理边缘情况：如果还有剩余内容没有被加入课时
  if (currentLesson.length > 0) {
    const lessonNumber = lessons.length + 1;
    
    lessons.push({
      title: `课时 ${lessonNumber}`,
      subtitle: `第${lessonNumber}部分`,
      content: currentLesson.join('\n\n'),
    });
  }
  
  return lessons;
}

/**
 * 将文本分割为句子
 */
function splitIntoSentences(text: string): string[] {
  // 句子分割正则
  const sentencePattern = /[^.!?]+[.!?]+/g;
  const sentences = [];
  let match;
  
  while ((match = sentencePattern.exec(text)) !== null) {
    sentences.push(match[0].trim());
  }
  
  return sentences;
}

/**
 * 抽取句子对（英文-中文）
 * 注意：这里需要对接翻译服务或其他方式获取翻译
 */
async function extractSentencePairs(
  content: string,
  sourceLanguage: string,
  targetLanguage: string
): Promise<{ english: string; chinese: string }[]> {
  // 分割为句子
  const sentences = splitIntoSentences(content);
  
  // TODO: 实际项目中这里应该调用翻译API
  // 这里使用模拟翻译
  return Promise.all(
    sentences.map(async (sentence) => {
      if (sourceLanguage === 'en' && targetLanguage === 'zh-CN') {
        // 英文到中文
        return {
          english: sentence,
          chinese: await mockTranslation(sentence, 'en', 'zh-CN'),
        };
      } else if (sourceLanguage === 'zh-CN' && targetLanguage === 'en') {
        // 中文到英文
        return {
          chinese: sentence,
          english: await mockTranslation(sentence, 'zh-CN', 'en'),
        };
      } else {
        // 默认返回原句
        return {
          english: sourceLanguage === 'en' ? sentence : 'Sample English sentence',
          chinese: sourceLanguage === 'zh-CN' ? sentence : '示例中文句子',
        };
      }
    })
  );
}

/**
 * 增强内容，添加解释说明
 */
async function enhanceContentWithExplanations(
  content: string,
  sentences: SentenceData[]
): Promise<any> {
  // 在实际应用中，这里可以添加更多丰富的注释、解释和上下文
  // 简单模拟增强内容
  return {
    original: content,
    sentences: sentences.map((sentence) => ({
      ...sentence,
      explanation: `This sentence demonstrates the use of ${sentence.grammarPoints?.join(', ') || 'basic grammar'}.`,
      keywordExplanations: sentence.keywords?.map(keyword => ({
        word: keyword,
        definition: `Definition for ${keyword}`,
        examples: [`Example using ${keyword}`],
      })),
    })),
  };
}

/**
 * 为课时生成描述
 */
function generateLessonDescription(sentences: SentenceData[]): string {
  const totalSentences = sentences.length;
  const avgDifficulty = sentences.reduce((sum, s) => sum + (s.difficulty || 3), 0) / totalSentences;
  
  const mainKeywords = new Set<string>();
  sentences.forEach((s) => {
    s.keywords?.slice(0, 3).forEach((kw) => mainKeywords.add(kw));
  });
  
  return `本课时包含${totalSentences}个句子，平均难度${avgDifficulty.toFixed(1)}（满分5分）。主要涵盖 ${Array.from(mainKeywords).join(', ')} 等知识点。`;
}

/**
 * 模拟翻译功能
 * 在实际应用中应替换为真实的翻译API调用
 */
async function mockTranslation(
  text: string,
  from: string,
  to: string
): Promise<string> {
  // 简单模拟翻译结果
  if (from === 'en' && to === 'zh-CN') {
    return `[${text.substring(0, 20)}...的中文翻译]`;
  } else if (from === 'zh-CN' && to === 'en') {
    return `[English translation of ${text.substring(0, 20)}...]`;
  }
  return text;
} 