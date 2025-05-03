/**
 * 课程包服务
 * 用于课程包的导入、导出和处理
 */
import { get, post, put } from '@/lib/api';
import {
  CoursePackage,
  CourseImportOptions,
  CourseExportOptions,
  ImportResult,
  ExportResult,
  ContentTransformOptions,
  SentenceAlignmentOptions,
  ModeContent,
  ModeContentItem,
  CourseData,
  LessonData
} from '@/types/courses/packageTypes';
import { ExtendedCourse } from '@/types/courses/courseTypes';
import { LearningMode } from '@/types/learning';
import { ContentBlockType, ContentBlock, SentencePair } from '@/types/courses/contentTypes';

/**
 * 导入课程包
 * @param file 课程包文件
 * @param options 导入选项
 */
export async function importCoursePackage(
  file: File,
  options: CourseImportOptions = {}
): Promise<ImportResult> {
  const formData = new FormData();
  formData.append('file', file);
  
  if (options) {
    formData.append('options', JSON.stringify(options));
  }
  
  return post<ImportResult>('/api/courses/import', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

/**
 * 导出课程包
 * @param courseIds 要导出的课程ID列表
 * @param options 导出选项
 */
export async function exportCoursePackage(
  courseIds: string[],
  options: CourseExportOptions = {}
): Promise<ExportResult> {
  return post<ExportResult>('/api/courses/export', {
    courseIds,
    options,
  });
}

/**
 * 从文本内容创建课程
 * @param content 文本内容
 * @param options 转换选项
 */
export async function createCourseFromText(
  content: string,
  options: ContentTransformOptions
): Promise<ImportResult> {
  return post<ImportResult>('/api/courses/transform/text', {
    content,
    options,
  });
}

/**
 * 从文件创建课程
 * @param file 文件
 * @param options 转换选项
 */
export async function createCourseFromFile(
  file: File,
  options: ContentTransformOptions
): Promise<ImportResult> {
  const formData = new FormData();
  formData.append('file', file);
  
  if (options) {
    formData.append('options', JSON.stringify(options));
  }
  
  return post<ImportResult>('/api/courses/transform/file', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

/**
 * 对齐中英文句子
 * @param englishText 英文文本
 * @param chineseText 中文文本
 * @param options 对齐选项
 */
export async function alignSentences(
  englishText: string,
  chineseText: string,
  options: SentenceAlignmentOptions = { method: 'hybrid' }
): Promise<{ sentencePairs: { english: string; chinese: string }[] }> {
  return post<{ sentencePairs: { english: string; chinese: string }[] }>(
    '/api/courses/align',
    {
      englishText,
      chineseText,
      options,
    }
  );
}

/**
 * 获取课程包元数据
 * @param packageId 课程包ID
 */
export async function getCoursePackageMetadata(packageId: string): Promise<CoursePackage['metadata']> {
  return get<CoursePackage['metadata']>(`/api/courses/packages/${packageId}/metadata`);
}

/**
 * 获取课程包中的课程列表
 * @param packageId 课程包ID
 */
export async function getCoursePackageCourses(packageId: string): Promise<ExtendedCourse[]> {
  return get<ExtendedCourse[]>(`/api/courses/packages/${packageId}/courses`);
}

/**
 * 将课程内容处理为特定学习模式格式
 * @param lessonId 课时ID
 * @param mode 学习模式
 */
export async function getLessonContentForMode(
  lessonId: string,
  mode: LearningMode
): Promise<ModeContent> {
  return get<ModeContent>(`/api/lessons/${lessonId}/content?mode=${mode}`);
}

/**
 * 检验课程包是否有效
 * @param file 课程包文件
 */
export async function validateCoursePackage(file: File): Promise<{
  valid: boolean;
  metadata?: CoursePackage['metadata'];
  errors?: string[];
}> {
  const formData = new FormData();
  formData.append('file', file);
  
  return post<{
    valid: boolean;
    metadata?: CoursePackage['metadata'];
    errors?: string[];
  }>('/api/courses/packages/validate', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

/**
 * 生成课程内容的音频
 * @param lessonId 课时ID
 */
export async function generateLessonAudio(lessonId: string): Promise<{
  success: boolean;
  generatedCount: number;
  errors?: string[];
}> {
  return post<{
    success: boolean;
    generatedCount: number;
    errors?: string[];
  }>(`/api/lessons/${lessonId}/generate-audio`, {});
}

/**
 * 课程包处理服务
 * 提供课程包的创建、导入、导出、转换和管理功能
 */

class CoursePackageService {
  /**
   * 从材料创建课程包
   * @param materialId 材料ID
   * @param options 创建选项
   * @returns 创建的课程包ID
   */
  async createFromMaterial(
    materialId: string, 
    options: {
      title: string;
      description?: string;
      level?: string;
      type?: string;
      tags?: string[];
      isFree?: boolean;
      price?: number;
      coverImage?: string;
    }
  ): Promise<string> {
    try {
      // 1. 获取材料分析结果
      const analysisData = await this.fetchMaterialAnalysis(materialId);
      
      // 2. 创建课程包结构
      const coursePackage: CoursePackage = {
        metadata: {
          packageId: `pkg-${Date.now()}`,
          version: '1.0.0',
          createdAt: new Date().toISOString(),
          courseCount: 1,
          totalLessons: 1,
          totalContentBlocks: 0,
          totalSentencePairs: 0,
          format: 'standard'
        },
        courses: [this.buildCourseFromAnalysis(analysisData)]
      };
      
      // 3. 保存课程包
      const courseId = await this.saveCoursePackage(coursePackage);
      
      return courseId;
    } catch (error) {
      console.error('从材料创建课程包失败：', error);
      throw new Error(`创建课程包失败: ${(error as Error).message}`);
    }
  }
  
  /**
   * 导入课程包
   * @param file 课程包文件（JSON或ZIP）
   * @param options 导入选项
   * @returns 导入结果
   */
  async importPackage(file: File | Blob, options: CourseImportOptions = {}): Promise<ImportResult> {
    try {
      // 检查文件类型
      const isZip = file.type === 'application/zip' || (file as File).name?.endsWith('.zip');
      
      if (isZip) {
        // 处理ZIP包
        return await this.importZipPackage(file, options);
      } else {
        // 处理JSON包
        return await this.importJsonPackage(file, options);
      }
    } catch (error) {
      console.error('导入课程包失败：', error);
      throw new Error(`导入课程包失败: ${(error as Error).message}`);
    }
  }
  
  /**
   * 导出课程包
   * @param courseId 课程ID
   * @param options 导出选项
   * @returns 导出结果
   */
  async exportPackage(courseId: string, options: CourseExportOptions = {}): Promise<ExportResult> {
    try {
      // 1. 获取课程数据
      const coursePackage = await this.fetchCoursePackage(courseId);
      
      // 2. 根据选项准备导出数据
      const exportData = {
        ...coursePackage,
        exportedAt: new Date().toISOString(),
        exportVersion: '1.0.0'
      };
      
      // 3. 根据格式导出
      if (options.format === 'binary' && options.includeMedia) {
        // 处理二进制导出，包含媒体文件
        return await this.exportAsZip(exportData, options);
      } else {
        // 默认JSON导出
        return await this.exportAsJson(exportData, options);
      }
    } catch (error) {
      console.error('导出课程包失败：', error);
      throw new Error(`导出课程包失败: ${(error as Error).message}`);
    }
  }
  
  /**
   * 转换课程内容到特定学习模式
   * @param courseId 课程ID
   * @param lessonId 课时ID
   * @param mode 学习模式
   * @param options 转换选项
   * @returns 转换后的内容
   */
  async transformContent(
    courseId: string, 
    lessonId: string, 
    mode: LearningMode,
    options: ContentTransformOptions = { format: 'txt' }
  ): Promise<ModeContent> {
    try {
      // 1. 获取课时数据
      const lesson = await this.fetchLesson(courseId, lessonId);
      
      // 2. 根据学习模式和选项进行转换
      let modeContent: ModeContent;
      
      switch (mode) {
        case 'chinese-to-english':
          modeContent = this.transformToChineseToEnglish(lesson, options);
          break;
        case 'english-to-chinese':
          modeContent = this.transformToEnglishToChinese(lesson, options);
          break;
        case 'listening':
          modeContent = this.transformToListening(lesson, options);
          break;
        case 'grammar':
          modeContent = this.transformToGrammar(lesson, options);
          break;
        case 'notes':
          modeContent = this.transformToNotes(lesson, options);
          break;
        default:
          // 默认原始内容
          modeContent = this.transformToOriginal(lesson, options);
          break;
      }
      
      return {
        lessonId: lesson.id,
        mode: mode,
        title: lesson.title,
        description: lesson.description,
        contentItems: modeContent.contentItems
      };
    } catch (error) {
      console.error('转换课程内容失败：', error);
      throw new Error(`转换内容失败: ${(error as Error).message}`);
    }
  }
  
  /**
   * 对齐中英文句子
   * @param englishText 英文文本
   * @param chineseText 中文文本
   * @param options 对齐选项
   * @returns 对齐的句子对
   */
  async alignSentences(
    englishText: string, 
    chineseText: string, 
    options: SentenceAlignmentOptions = { method: 'hybrid' }
  ): Promise<SentencePair[]> {
    try {
      // 调用句子对齐API
      const response = await fetch('/api/courses/align', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          englishText,
          chineseText,
          options
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '句子对齐失败');
      }
      
      const result = await response.json();
      
      // 将API结果转换为SentencePair数组
      return result.sentencePairs.map((pair: any, index: number) => ({
        id: `sentence-${index}`,
        english: pair.english,
        chinese: pair.chinese,
        confidence: pair.confidence
      }));
    } catch (error) {
      console.error('句子对齐失败：', error);
      throw new Error(`句子对齐失败: ${(error as Error).message}`);
    }
  }
  
  /**
   * 根据学习者级别自动调整课程内容
   * @param courseId 课程ID
   * @param targetLevel 目标难度级别 ('beginner'|'intermediate'|'advanced')
   * @returns 调整后的课程包ID
   */
  async adaptCourseToLevel(courseId: string, targetLevel: 'beginner' | 'intermediate' | 'advanced'): Promise<string> {
    try {
      // 1. 获取原始课程包
      const originalPackage = await this.fetchCoursePackage(courseId);
      
      // 2. 创建新的课程包元数据
      const newPackage: CoursePackage = {
        metadata: {
          ...originalPackage.metadata,
          packageId: `pkg-${Date.now()}`,
          createdAt: new Date().toISOString(),
          format: 'adapted',
          adaptedLevel: targetLevel
        },
        courses: []
      };
      
      // 3. 遍历原课程并根据目标级别调整内容
      for (const courseData of originalPackage.courses) {
        const adaptedCourse = await this.adaptCourseData(courseData, targetLevel);
        newPackage.courses.push(adaptedCourse);
      }
      
      // 4. 保存新课程包
      const newPackageId = await this.saveCoursePackage(newPackage);
      
      return newPackageId;
    } catch (error) {
      console.error('调整课程级别失败：', error);
      throw new Error(`调整课程级别失败: ${(error as Error).message}`);
    }
  }
  
  /**
   * 根据学习者级别调整课程数据
   * @param courseData 原始课程数据
   * @param targetLevel 目标难度级别
   * @returns 调整后的课程数据
   */
  private async adaptCourseData(courseData: CourseData, targetLevel: string): Promise<CourseData> {
    // 创建新课程数据的副本
    const adaptedCourse: CourseData = {
      course: {
        ...courseData.course,
        id: `course-${Date.now()}`,
        title: `${courseData.course.title} (${targetLevel})`,
        level: targetLevel,
        updatedAt: new Date().toISOString(),
      },
      lessons: []
    };
    
    // 遍历并调整每个课时
    for (const lesson of courseData.lessons) {
      const adaptedLesson = await this.adaptLessonData(lesson, targetLevel);
      adaptedCourse.lessons.push(adaptedLesson);
    }
    
    return adaptedCourse;
  }
  
  /**
   * 根据学习者级别调整课时数据
   * @param lesson 原始课时数据
   * @param targetLevel 目标难度级别
   * @returns 调整后的课时数据
   */
  private async adaptLessonData(lesson: LessonData, targetLevel: string): Promise<LessonData> {
    // 创建新课时数据的副本
    const adaptedLesson: LessonData = {
      ...lesson,
      id: `lesson-${Date.now()}`,
      title: lesson.title,
      contentBlocks: []
    };
    
    // 遍历并调整每个内容块
    for (const block of lesson.contentBlocks) {
      const adaptedBlock = await this.adaptContentBlock(block, targetLevel);
      adaptedLesson.contentBlocks.push(adaptedBlock);
    }
    
    // 根据难度调整课时内容
    switch (targetLevel) {
      case 'beginner':
        // 初学者：添加更多基础解释，增加简单示例
        adaptedLesson.contentBlocks = this.addBeginnersSupport(adaptedLesson.contentBlocks);
        break;
      case 'intermediate':
        // 中级：保持原有结构，适当增加难度和解释
        adaptedLesson.contentBlocks = this.enhanceForIntermediate(adaptedLesson.contentBlocks);
        break;
      case 'advanced':
        // 高级：增加高级语言点和更复杂的练习
        adaptedLesson.contentBlocks = this.enhanceForAdvanced(adaptedLesson.contentBlocks);
        break;
    }
    
    return adaptedLesson;
  }
  
  /**
   * 根据学习者级别调整内容块
   * @param block 原始内容块
   * @param targetLevel 目标难度级别
   * @returns 调整后的内容块
   */
  private async adaptContentBlock(block: ContentBlock, targetLevel: string): Promise<ContentBlock> {
    // 创建新内容块的副本
    const adaptedBlock: ContentBlock = {
      ...block,
      id: `block-${Date.now()}-${block.id}`,
    };
    
    // 根据内容块类型进行特定调整
    if (block.type === ContentBlockType.SENTENCES) {
      adaptedBlock.content = await this.adaptSentenceContent(block.content, targetLevel);
    } else if (block.type === ContentBlockType.VOCABULARY) {
      adaptedBlock.content = await this.adaptVocabularyContent(block.content, targetLevel);
    }
    
    return adaptedBlock;
  }
  
  /**
   * 调整句子内容
   * @param content 原始句子内容
   * @param targetLevel 目标难度级别
   * @returns 调整后的句子内容
   */
  private async adaptSentenceContent(content: any, targetLevel: string): Promise<any> {
    // 对句子进行难度调整
    const adaptedPairs = content.pairs.map((pair: SentencePair) => {
      const adaptedPair = { ...pair, id: `pair-${Date.now()}-${pair.id}` };
      
      // 针对不同级别的调整
      switch (targetLevel) {
        case 'beginner':
          // 简化句子，增加音标和基础词汇解释
          adaptedPair.phonetics = this.generatePhonetics(pair.english);
          adaptedPair.simplified = this.simplifySentence(pair.english);
          break;
        case 'intermediate':
          // 保持原句，增加短语和习惯用法解释
          adaptedPair.phrases = this.extractPhrases(pair.english);
          break;
        case 'advanced':
          // 保持原句，增加高级表达和同义替换
          adaptedPair.synonyms = this.generateSynonyms(pair.english);
          adaptedPair.advancedUsage = this.generateAdvancedUsage(pair.english);
          break;
      }
      
      return adaptedPair;
    });
    
    return { ...content, pairs: adaptedPairs };
  }
  
  /**
   * 调整词汇内容
   * @param content 原始词汇内容
   * @param targetLevel 目标难度级别
   * @returns 调整后的词汇内容
   */
  private async adaptVocabularyContent(content: any, targetLevel: string): Promise<any> {
    // 对词汇进行难度调整
    const adaptedWords = content.words.map((word: any) => {
      const adaptedWord = { ...word };
      
      // 针对不同级别的调整
      switch (targetLevel) {
        case 'beginner':
          // 增加音标和基础例句
          adaptedWord.phonetic = this.generatePhonetics(word.word);
          adaptedWord.examples = this.generateSimpleExamples(word.word);
          break;
        case 'intermediate':
          // 增加常用搭配和中等难度例句
          adaptedWord.collocations = this.generateCollocations(word.word);
          adaptedWord.examples = this.generateIntermediateExamples(word.word);
          break;
        case 'advanced':
          // 增加高级用法、同义词和反义词
          adaptedWord.synonymsAndAntonyms = this.generateSynonymsAndAntonyms(word.word);
          adaptedWord.advancedUsage = this.generateAdvancedWordUsage(word.word);
          break;
      }
      
      return adaptedWord;
    });
    
    return { ...content, words: adaptedWords };
  }
  
  /**
   * 为初学者添加支持内容
   * @param blocks 原始内容块数组
   * @returns 增强后的内容块数组
   */
  private addBeginnersSupport(blocks: ContentBlock[]): ContentBlock[] {
    // 创建新的内容块数组
    const enhancedBlocks = [...blocks];
    
    // 添加语法解释块
    const grammarBlock: ContentBlock = {
      id: `block-grammar-${Date.now()}`,
      type: ContentBlockType.GRAMMAR,
      order: blocks.length + 1,
      content: {
        title: '基础语法要点',
        explanations: [
          {
            id: `grammar-exp-1-${Date.now()}`,
            title: '句子结构',
            content: '英语句子的基本结构是主语+谓语+宾语 (S+V+O)。'
          },
          {
            id: `grammar-exp-2-${Date.now()}`,
            title: '时态',
            content: '本课中使用的主要时态是一般现在时，表示经常性、习惯性的动作或状态。'
          }
        ]
      }
    };
    
    // 添加练习块
    const practiceBlock: ContentBlock = {
      id: `block-practice-${Date.now()}`,
      type: ContentBlockType.EXERCISE,
      order: blocks.length + 2,
      content: {
        title: '基础练习',
        exercises: [
          {
            id: `exercise-1-${Date.now()}`,
            type: 'multiple-choice',
            question: '选择正确的翻译',
            options: ['选项1', '选项2', '选项3', '选项4'],
            answer: 0
          }
        ]
      }
    };
    
    enhancedBlocks.push(grammarBlock);
    enhancedBlocks.push(practiceBlock);
    
    return enhancedBlocks;
  }
  
  /**
   * 为中级学习者增强内容
   * @param blocks 原始内容块数组
   * @returns 增强后的内容块数组
   */
  private enhanceForIntermediate(blocks: ContentBlock[]): ContentBlock[] {
    // 创建新的内容块数组
    const enhancedBlocks = [...blocks];
    
    // 添加短语和习惯用法块
    const phrasesBlock: ContentBlock = {
      id: `block-phrases-${Date.now()}`,
      type: ContentBlockType.PHRASES,
      order: blocks.length + 1,
      content: {
        title: '常用短语和习惯用法',
        phrases: [
          {
            id: `phrase-1-${Date.now()}`,
            phrase: '示例短语1',
            meaning: '短语含义',
            examples: ['示例句1', '示例句2']
          }
        ]
      }
    };
    
    // 添加中级练习块
    const practiceBlock: ContentBlock = {
      id: `block-practice-${Date.now()}`,
      type: ContentBlockType.EXERCISE,
      order: blocks.length + 2,
      content: {
        title: '中级练习',
        exercises: [
          {
            id: `exercise-1-${Date.now()}`,
            type: 'fill-in-blank',
            question: '填空练习',
            context: '这是一个__的填空练习。',
            answer: '示例'
          }
        ]
      }
    };
    
    enhancedBlocks.push(phrasesBlock);
    enhancedBlocks.push(practiceBlock);
    
    return enhancedBlocks;
  }
  
  /**
   * 为高级学习者增强内容
   * @param blocks 原始内容块数组
   * @returns 增强后的内容块数组
   */
  private enhanceForAdvanced(blocks: ContentBlock[]): ContentBlock[] {
    // 创建新的内容块数组
    const enhancedBlocks = [...blocks];
    
    // 添加高级表达块
    const advancedBlock: ContentBlock = {
      id: `block-advanced-${Date.now()}`,
      type: ContentBlockType.ADVANCED_EXPRESSIONS,
      order: blocks.length + 1,
      content: {
        title: '高级表达',
        expressions: [
          {
            id: `expression-1-${Date.now()}`,
            expression: '示例高级表达1',
            explanation: '表达解释',
            usage: '使用场景',
            examples: ['示例句1', '示例句2']
          }
        ]
      }
    };
    
    // 添加高级练习块
    const practiceBlock: ContentBlock = {
      id: `block-practice-${Date.now()}`,
      type: ContentBlockType.EXERCISE,
      order: blocks.length + 2,
      content: {
        title: '高级练习',
        exercises: [
          {
            id: `exercise-1-${Date.now()}`,
            type: 'translation',
            question: '翻译练习',
            context: '这是一个需要翻译的复杂段落...',
            expectedTranslation: 'This is a complex paragraph that needs to be translated...'
          }
        ]
      }
    };
    
    enhancedBlocks.push(advancedBlock);
    enhancedBlocks.push(practiceBlock);
    
    return enhancedBlocks;
  }
  
  // 工具方法 - 实际应用中可以调用NLP API或使用预训练模型
  private generatePhonetics(text: string): string {
    return '[示例音标]';
  }
  
  private simplifySentence(text: string): string {
    return text.split(' ').slice(0, Math.ceil(text.split(' ').length * 0.7)).join(' ') + '.';
  }
  
  private extractPhrases(text: string): {phrase: string, meaning: string}[] {
    return [{ phrase: '示例短语', meaning: '短语含义' }];
  }
  
  private generateSynonyms(text: string): string[] {
    return ['同义表达1', '同义表达2'];
  }
  
  private generateAdvancedUsage(text: string): {context: string, usage: string}[] {
    return [{ context: '正式场合', usage: '高级用法示例' }];
  }
  
  private generateSimpleExamples(word: string): string[] {
    return [`这是包含"${word}"的简单例句。`];
  }
  
  private generateIntermediateExamples(word: string): string[] {
    return [`这是包含"${word}"的中等难度例句。`];
  }
  
  private generateCollocations(word: string): string[] {
    return [`${word} + 常见搭配`];
  }
  
  private generateSynonymsAndAntonyms(word: string): {synonyms: string[], antonyms: string[]} {
    return {
      synonyms: ['同义词1', '同义词2'],
      antonyms: ['反义词1', '反义词2']
    };
  }
  
  private generateAdvancedWordUsage(word: string): {context: string, example: string}[] {
    return [{ context: '学术场合', example: `在学术论文中，"${word}"常用于...` }];
  }
  
  // 私有辅助方法
  
  /**
   * 获取材料分析结果
   */
  private async fetchMaterialAnalysis(materialId: string): Promise<any> {
    // 在实际应用中，这里应该调用API获取分析结果
    // 现在返回模拟数据
    return {
      materialId,
      paragraphs: 15,
      sentences: 85,
      english: Array(10).fill(0).map((_, i) => `This is example sentence ${i+1}`),
      chinese: Array(10).fill(0).map((_, i) => `这是示例句子 ${i+1}`),
      vocabulary: Array(25).fill(0).map((_, i) => ({
        word: `word-${i+1}`,
        translation: `翻译-${i+1}`
      }))
    };
  }
  
  /**
   * 从分析结果构建课程结构
   */
  private buildCourseFromAnalysis(analysisData: any): CourseData {
    // 基于分析数据创建课程
    // 这里简化处理，实际应用中需要更复杂的内容组织
    
    // 示例：创建单课时内容
    const lessons: LessonData[] = [{
      id: `lesson-${Date.now()}`,
      courseId: `course-${Date.now()}`,
      title: '第一课',
      description: '自动生成的课程内容',
      order: 1,
      duration: 60,
      contentBlocks: this.createContentBlocks(analysisData)
    }];
    
    return {
      course: {
        id: `course-${Date.now()}`,
        title: '自动生成课程',
        description: '从材料自动生成的课程',
        level: 'beginner',
        language: 'en',
        targetLanguage: 'zh-CN',
        imageUrl: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        authorId: 'system',
        status: 'published',
        category: 'general',
        tags: []
      },
      lessons: lessons
    };
  }
  
  /**
   * 创建内容块
   */
  private createContentBlocks(analysisData: any): ContentBlock[] {
    const blocks: ContentBlock[] = [];
    
    // 添加标题块
    blocks.push({
      id: `block-heading-1`,
      type: ContentBlockType.HEADING,
      order: 0,
      content: {
        text: '课程内容',
        level: 1
      }
    });
    
    // 将分析的英文和中文句子转换为句子块
    const sentencePairs: SentencePair[] = analysisData.english.map((english: string, index: number) => ({
      id: `pair-${index}`,
      english,
      chinese: analysisData.chinese[index] || '',
    }));
    
    blocks.push({
      id: `block-sentences-1`,
      type: ContentBlockType.SENTENCES,
      order: 1,
      content: {
        pairs: sentencePairs
      }
    });
    
    // 如果有词汇，添加词汇块
    if (analysisData.vocabulary && analysisData.vocabulary.length > 0) {
      blocks.push({
        id: `block-vocabulary-1`,
        type: ContentBlockType.VOCABULARY,
        order: 2,
        content: {
          words: analysisData.vocabulary.map((item: any) => ({
            word: item.word,
            definition: {
              english: item.word,
              chinese: item.translation
            },
            examples: []
          }))
        }
      });
    }
    
    return blocks;
  }
  
  /**
   * 保存课程包
   */
  private async saveCoursePackage(coursePackage: CoursePackage): Promise<string> {
    // 在实际应用中，这里应该调用API将课程包保存到数据库
    // 现在简单返回ID
    return coursePackage.metadata.packageId;
  }
  
  /**
   * 获取课程包
   */
  private async fetchCoursePackage(courseId: string): Promise<CoursePackage> {
    // 在实际应用中，这里应该调用API获取课程包
    // 现在返回模拟数据
    return {
      metadata: {
        packageId: courseId,
        version: '1.0.0',
        createdAt: new Date().toISOString(),
        courseCount: 1,
        totalLessons: 1,
        totalContentBlocks: 0,
        totalSentencePairs: 0,
        format: 'standard'
      },
      courses: [
        {
          course: {
            id: courseId,
            title: '示例课程',
            description: '这是一个示例课程',
            level: 'beginner',
            language: 'en',
            targetLanguage: 'zh-CN',
            imageUrl: '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            authorId: 'system',
            status: 'published',
            category: 'general',
            tags: []
          },
          lessons: []
        }
      ]
    };
  }
  
  /**
   * 获取课时
   */
  private async fetchLesson(courseId: string, lessonId: string): Promise<LessonData> {
    // 在实际应用中，这里应该调用API获取课时
    // 现在返回模拟数据
    return {
      id: lessonId,
      courseId: courseId,
      title: '示例课时',
      description: '这是一个示例课时',
      order: 1,
      duration: 60,
      contentBlocks: []
    };
  }
  
  /**
   * 导入JSON格式课程包
   */
  private async importJsonPackage(file: File | Blob, options: CourseImportOptions): Promise<ImportResult> {
    // 读取JSON文件
    const fileContent = await file.text();
    const packageData = JSON.parse(fileContent);
    
    // 保存课程包
    const courseId = await this.saveCoursePackage(packageData);
    
    // 返回导入结果
    return {
      success: true,
      packageId: packageData.metadata.packageId,
      coursesImported: 1,
      lessonsImported: packageData.courses[0].lessons.length,
      contentBlocksImported: packageData.courses[0].lessons.reduce((total: number, lesson: any) => 
        total + (lesson.contentBlocks?.length || 0), 0),
      sentencePairsImported: 0 // 实际应用中需要计算
    };
  }
  
  /**
   * 导入ZIP格式课程包
   */
  private async importZipPackage(file: File | Blob, options: CourseImportOptions): Promise<ImportResult> {
    // 实际应用中需要使用JSZip等库解压并处理ZIP内容
    // 现在返回模拟结果
    return {
      success: true,
      packageId: `pkg-${Date.now()}`,
      coursesImported: 1,
      lessonsImported: 10,
      contentBlocksImported: 50,
      sentencePairsImported: 200
    };
  }
  
  /**
   * 导出为JSON格式
   */
  private async exportAsJson(data: any, options: CourseExportOptions): Promise<ExportResult> {
    // 实际应用中需要处理JSON序列化和下载
    // 现在返回模拟结果
    return {
      success: true,
      packageId: data.metadata.packageId,
      fileUrl: `/api/courses/download?id=${data.metadata.packageId}&format=json`,
      fileSize: 1024 * 50, // 模拟50KB
      coursesExported: 1,
      lessonsExported: 10,
      contentBlocksExported: 50,
      sentencePairsExported: 200,
      format: 'json',
      compression: 'none',
      encrypted: false
    };
  }
  
  /**
   * 导出为ZIP格式
   */
  private async exportAsZip(data: any, options: CourseExportOptions): Promise<ExportResult> {
    // 实际应用中需要使用JSZip等库创建ZIP并添加所有资源
    // 现在返回模拟结果
    return {
      success: true,
      packageId: data.metadata.packageId,
      fileUrl: `/api/courses/download?id=${data.metadata.packageId}&format=binary`,
      fileSize: 1024 * 500, // 模拟500KB
      coursesExported: 1,
      lessonsExported: 10,
      contentBlocksExported: 50,
      sentencePairsExported: 200,
      format: 'binary',
      compression: 'gzip',
      encrypted: false
    };
  }
  
  /**
   * 将课时内容转换为中译英模式
   * @private
   */
  private transformToChineseToEnglish(lesson: LessonData, options: ContentTransformOptions): ModeContent {
    const contentItems = lesson.contentBlocks.map(block => {
      // 检查block类型并安全获取sentencePairs
      const pairs = block.type === 'sentences' ? (block.content as any).pairs || [] : [];
      return pairs.map((pair: any) => ({
        id: `c2e-${pair.id || this.generateUUID()}`,
        type: 'chinese-to-english',
        content: {
          prompt: pair.chinese,
          answer: pair.english,
          audioUrl: pair.englishAudio || '',  // 修改为单个字符串
          keywords: this.extractKeywordsFromText(pair.english)
        },
        metadata: {
          blockId: block.id,
          difficulty: this.calculateTextDifficulty(pair.english)
        }
      }));
    }).flat();
    
    return {
      lessonId: lesson.id,
      mode: 'chinese-to-english',
      title: lesson.title,
      description: lesson.description,
      contentItems
    };
  }
  
  /**
   * 将课时内容转换为英译中模式
   * @private
   */
  private transformToEnglishToChinese(lesson: LessonData, options: ContentTransformOptions): ModeContent {
    const contentItems = lesson.contentBlocks.map(block => {
      // 检查block类型并安全获取sentencePairs
      const pairs = block.type === 'sentences' ? (block.content as any).pairs || [] : [];
      return pairs.map((pair: any) => ({
        id: `e2c-${pair.id || this.generateUUID()}`,
        type: 'english-to-chinese',
        content: {
          prompt: pair.english,
          answer: pair.chinese,
          audioUrl: pair.englishAudio || '',  // 修改为单个字符串
          hints: this.generateHintsForText(pair.chinese),
          difficulty: this.calculateTextDifficulty(pair.english) as 'easy' | 'medium' | 'hard'
        },
        metadata: {
          blockId: block.id
        }
      }));
    }).flat();
    
    return {
      lessonId: lesson.id,
      mode: 'english-to-chinese',
      title: lesson.title,
      description: lesson.description,
      contentItems
    };
  }
  
  /**
   * 将课时内容转换为听力模式
   * @private
   */
  private transformToListening(lesson: LessonData, options: ContentTransformOptions): ModeContent {
    const contentItems = lesson.contentBlocks.map(block => {
      if (block.type !== 'sentences') return null;
      
      const audioUrl = this.getBlockAudioUrl(block);
      const englishSentences = this.combineBlockSentences(block, 'english');
      const chineseSentences = this.combineBlockSentences(block, 'chinese');
      const questions = this.generateListeningQuestions(block);
      
      return {
        id: this.generateUUID(),
        type: 'listening',
        content: {
          audioUrl: audioUrl[0] || '',  // 使用数组中的第一个音频或空字符串
          transcript: englishSentences,
          translation: chineseSentences,
          questions
        },
        metadata: {
          blockId: block.id,
          duration: this.calculateAudioDuration(audioUrl)
        }
      };
    }).filter(item => item !== null);

    return {
      lessonId: lesson.id,
      mode: 'listening',
      title: lesson.title,
      description: lesson.description,
      contentItems: contentItems as any[]
    };
  }
  
  /**
   * 将课时内容转换为语法模式
   * @private
   */
  private transformToGrammar(lesson: LessonData, options: ContentTransformOptions): ModeContent {
    const grammarPoints = this.extractGrammarPoints(lesson);
    
    const contentItems = grammarPoints.map(point => ({
      id: `grammar-${generateUUID()}`,
      type: 'grammar',
      content: {
        sentence: point.sentence,
        translation: point.translation,
        explanation: point.explanation,
        grammarPoint: point.point,
        examples: point.examples
      },
      metadata: {
        level: point.level,
        category: point.category
      }
    }));
    
    return {
      lessonId: lesson.id,
      mode: 'grammar',
      title: lesson.title,
      description: lesson.description,
      contentItems
    };
  }
  
  /**
   * 将课时内容转换为笔记模式
   * @private
   */
  private transformToNotes(lesson: LessonData, options: ContentTransformOptions): ModeContent {
    const sections = lesson.contentBlocks.map(block => ({
      title: block.title || `段落 ${block.order}`,
      content: this.combineBlockSentences(block, 'both')
    }));
    
    const contentItems = [{
      id: `notes-${lesson.id}`,
      type: 'notes',
      content: {
        title: lesson.title,
        content: sections.map(s => s.content).join('\n\n'),
        sections
      },
      metadata: {
        wordCount: this.countWords(sections.map(s => s.content).join(' ')),
        readingTime: this.estimateReadingTime(sections.map(s => s.content).join(' '))
      }
    }];
    
    return {
      lessonId: lesson.id,
      mode: 'notes',
      title: lesson.title,
      description: lesson.description,
      contentItems
    };
  }
  
  /**
   * 将课时内容转换为原始模式
   * @private
   */
  private transformToOriginal(lesson: LessonData, options: ContentTransformOptions): ModeContent {
    // 转换为符合ModeContentItem类型的内容
    const contentItems = lesson.contentBlocks.map(block => {
      if (block.type === 'sentences') {
        // 针对句子块创建NotesContent类型的内容
        return {
          id: this.generateUUID(),
          type: 'notes',
          content: {
            title: `Section ${block.metadata?.order || ''}`,
            content: this.combineBlockSentences(block, 'english'),
            sections: [{
              title: '译文',
              content: this.combineBlockSentences(block, 'chinese')
            }]
          },
          metadata: {
            blockId: block.id
          }
        };
      } else if (block.type === 'heading') {
        // 针对标题块创建NotesContent类型的内容
        return {
          id: this.generateUUID(),
          type: 'notes',
          content: {
            title: (block.content as any).text || '',
            content: '',
            sections: []
          },
          metadata: {
            blockId: block.id
          }
        };
      } 
      // 其他类型默认为笔记内容
      return {
        id: this.generateUUID(),
        type: 'notes',
        content: {
          title: '内容',
          content: JSON.stringify(block.content),
          sections: []
        },
        metadata: {
          blockId: block.id
        }
      };
    });

    return {
      lessonId: lesson.id,
      mode: 'original',
      title: lesson.title,
      description: lesson.description,
      contentItems
    };
  }
  
  // 其他工具方法
  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  
  /**
   * 从文本中提取关键词
   * @private
   */
  private extractKeywordsFromText(text: string): string[] {
    // 简单实现，实际应用中应使用NLP库
    const words = text.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/);
    const stopWords = ['the', 'a', 'an', 'in', 'on', 'at', 'to', 'for', 'with', 'by'];
    return words
      .filter(word => word.length > 2 && !stopWords.includes(word))
      .slice(0, 5);
  }
  
  /**
   * 计算文本难度
   * @private
   */
  private calculateTextDifficulty(text: string): string {
    // 简单实现，实际应用中应使用更复杂的算法
    const words = text.split(/\s+/);
    const avgWordLength = words.join('').length / words.length;
    
    if (words.length < 5 || avgWordLength < 4) {
      return 'easy';
    } else if (words.length < 12 || avgWordLength < 5.5) {
      return 'medium';
    } else {
      return 'hard';
    }
  }
  
  /**
   * 为文本生成提示
   * @private
   */
  private generateHintsForText(text: string): string[] {
    // 简单实现，生成中文提示
    const characters = text.split('');
    const firstChars = characters.filter(char => /[\u4e00-\u9fa5]/.test(char)).slice(0, 3);
    return firstChars.map(char => `包含"${char}"的词`);
  }

  /**
   * 获取内容块的音频URL
   * @private
   */
  private getBlockAudioUrl(block: any): string[] {
    if (block.type !== 'sentences' || !block.content.pairs) return [];
    return block.content.pairs.map((pair: any) => pair.englishAudio).filter(Boolean);
  }

  /**
   * 提取语法点
   * @private
   */
  private extractGrammarPoints(block: any): Array<{
    sentence: string;
    translation: string;
    point: string;
    explanation: string;
    level: string;
    category: string;
  }> {
    if (block.type === 'grammar' && block.content.points) {
      return block.content.points.map((point: any) => ({
        sentence: point.sentence || '',
        translation: point.translation || '',
        point: point.rule || '',
        explanation: point.explanation || '',
        level: point.level || 'intermediate',
        category: point.category || 'grammar'
      }));
    }
    return [];
  }

  /**
   * 获取句子的语法内容
   * @private
   */
  private getSentenceGrammar(block: any, index: number): string {
    return block.type === 'sentences' && 
           block.content.pairs && 
           block.content.pairs[index] && 
           block.content.pairs[index].grammar || '';
  }

  /**
   * 合并内容块中的句子
   * @private
   */
  private combineBlockSentences(block: any, language: 'english' | 'chinese'): string {
    if (block.type !== 'sentences' || !block.content.pairs) return '';
    const key = language === 'english' ? 'english' : 'chinese';
    return block.content.pairs.map((pair: any) => pair[key]).join(' ');
  }

  /**
   * 生成听力问题
   * @private
   */
  private generateListeningQuestions(block: any): { question: string; options: string[]; answer: string }[] {
    if (block.type !== 'sentences' || !block.content.pairs) return [];
    // 简单实现，实际应用中应使用更复杂的算法
    return [];
  }

  /**
   * 计算音频时长
   * @private
   */
  private calculateAudioDuration(audioUrls: string[]): number {
    // 简单实现，实际应用中应根据音频文件获取真实时长
    return audioUrls.length * 3; // 假设每个音频平均3秒
  }

  /**
   * 统计单词数量
   * @private
   */
  private countWords(text: string): number {
    if (!text) return 0;
    // 简单实现，按空格分割计算单词数
    return text.split(/\s+/).filter(word => word.length > 0).length;
  }

  /**
   * 估计阅读时间
   * @private
   */
  private estimateReadingTime(text: string): number {
    // 假设平均阅读速度为每分钟200单词
    const wordCount = this.countWords(text);
    return Math.ceil(wordCount / 200);
  }
}

// 导出服务实例
export const coursePackageService = new CoursePackageService();
export default coursePackageService; 