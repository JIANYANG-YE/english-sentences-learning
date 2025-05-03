/**
 * 智能内容管理服务
 * 负责内容的智能分析、筛选、转换和优化
 */
import { get, post } from '@/lib/api';
import { 
  ContentBlock, 
  SentencePair,
  MaterialType
} from '@/types/materials';
import { 
  ContentTransformOptions,
  ContentFormat
} from '@/types/courses/packageTypes';

export interface ContentAnalysisResult {
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  contentStructure: {
    paragraphCount: number;
    sentenceCount: number;
    averageSentenceLength: number;
    dialogueCount: number;
  };
  topicTags: string[];
  keyVocabulary: {
    word: string;
    translation: string;
    frequency: number;
  }[];
  grammarPoints: string[];
  readability: number;
  recommendedLevel: string;
}

export interface ContentOptimizationOptions {
  targetDifficulty: 'beginner' | 'intermediate' | 'advanced';
  simplifyLanguage: boolean;
  enhanceVocabulary: boolean;
  adjustLength: 'shorten' | 'expand' | 'none';
  focusAreas: string[];
  preserveKeyElements: boolean;
}

export interface ContentOptimizationResult {
  enhancedContent: string;
  changesSummary: {
    vocabularyChanges: number;
    grammarChanges: number;
    structureChanges: number;
  };
  readabilityChange: number;
}

export interface BilingualPair {
  source: string;
  target: string;
  alignment?: number[][];
}

export interface ContentKeyword {
  keyword: string;
  translation?: string;
  relevance: number;
}

interface EnhancedContent {
  originalContent: string;
  enhancedContent: string;
  changes: Array<{
    type: 'simplification' | 'enhancement' | 'addition' | 'removal';
    original?: string;
    replacement?: string;
    reason: string;
  }>;
  additionalResources: Array<{
    type: 'vocabulary' | 'grammar' | 'exercise' | 'cultural_note';
    content: string;
  }>;
}

/**
 * 智能内容服务类
 */
class IntelligentContentService {
  /**
   * 分析内容的难度、话题和语言特点
   * @param content 要分析的内容文本
   */
  async analyzeContent(content: string): Promise<ContentAnalysisResult> {
    try {
      const response = await post<ContentAnalysisResult>('/api/content/analyze', { content });
      return response;
    } catch (error) {
      console.error('内容分析失败:', error);
      throw new Error(`内容分析失败: ${(error as Error).message}`);
    }
  }

  /**
   * 根据学习目标优化内容
   * @param content 原始内容
   * @param options 优化选项
   */
  async optimizeContent(content: string, options: ContentOptimizationOptions): Promise<ContentOptimizationResult> {
    try {
      const response = await post<ContentOptimizationResult>('/api/content/optimize', { 
        content,
        options
      });
      return response;
    } catch (error) {
      console.error('内容优化失败:', error);
      throw new Error(`内容优化失败: ${(error as Error).message}`);
    }
  }

  /**
   * 将文本内容转换为结构化的内容块
   * @param content 原始文本内容
   */
  async structureContent(content: string): Promise<ContentBlock[]> {
    try {
      const response = await post<ContentBlock[]>('/api/content/structure', { content });
      return response;
    } catch (error) {
      console.error('内容结构化失败:', error);
      throw new Error(`内容结构化失败: ${(error as Error).message}`);
    }
  }

  /**
   * 智能分割长文本为适合学习的小段落
   * @param content 原始内容
   * @param maxLength 每段最大长度
   */
  async splitContent(content: string, maxLength?: number): Promise<string[]> {
    try {
      const response = await post<string[]>('/api/content/split', { 
        content,
        maxLength
      });
      return response;
    } catch (error) {
      console.error('内容分割失败:', error);
      throw new Error(`内容分割失败: ${(error as Error).message}`);
    }
  }

  /**
   * 提取中英文对照句子
   * @param content 内容文本
   */
  async extractBilingualPairs(content: string): Promise<SentencePair[]> {
    try {
      const response = await post<SentencePair[]>('/api/content/extract-bilingual', { content });
      return response;
    } catch (error) {
      console.error('提取双语句对失败:', error);
      throw new Error(`提取双语句对失败: ${(error as Error).message}`);
    }
  }

  /**
   * 根据内容自动生成练习题
   * @param content 内容文本
   * @param types 练习题类型
   */
  async generateExercises(
    content: string, 
    types: Array<'vocabulary' | 'grammar' | 'comprehension' | 'translation'> = ['vocabulary', 'grammar', 'comprehension']
  ): Promise<any> {
    try {
      const response = await post('/api/content/generate-exercises', { 
        content,
        types
      });
      return response;
    } catch (error) {
      console.error('生成练习题失败:', error);
      throw new Error(`生成练习题失败: ${(error as Error).message}`);
    }
  }

  /**
   * 格式转换（例如，HTML到Markdown等）
   * @param content 要转换的内容
   * @param fromFormat 源格式
   * @param toFormat 目标格式
   */
  async convertFormat(
    content: string, 
    fromFormat: ContentFormat, 
    toFormat: ContentFormat
  ): Promise<string> {
    try {
      const response = await post<{convertedContent: string}>('/api/content/convert-format', { 
        content,
        fromFormat,
        toFormat
      });
      return response.convertedContent;
    } catch (error) {
      console.error('格式转换失败:', error);
      throw new Error(`格式转换失败: ${(error as Error).message}`);
    }
  }

  /**
   * 从内容中提取关键词和主题
   * @param content 内容文本
   */
  async extractKeywords(content: string): Promise<ContentKeyword[]> {
    try {
      const response = await post<ContentKeyword[]>('/api/content/extract-keywords', { content });
      return response;
    } catch (error) {
      console.error('提取关键词失败:', error);
      throw new Error(`提取关键词失败: ${(error as Error).message}`);
    }
  }

  /**
   * 将内容适配到指定难度级别
   * @param content 原始内容
   * @param targetLevel 目标难度级别
   */
  async adaptContentToLevel(
    content: string, 
    targetLevel: 'beginner' | 'intermediate' | 'advanced'
  ): Promise<{
    adaptedContent: string;
    originalDifficulty: string;
    adjustments: Array<{type: string; description: string}>;
  }> {
    try {
      const response = await post<any>('/api/content/adapt-level', { 
        content,
        targetLevel
      });
      return response;
    } catch (error) {
      console.error('内容难度调整失败:', error);
      throw new Error(`内容难度调整失败: ${(error as Error).message}`);
    }
  }
}

export default new IntelligentContentService(); 