/**
 * 智能内容导入服务
 * 提供了高级内容导入功能，包括批量处理、自动分类、质量检测等
 */
import { get, post } from '@/lib/api';
import { 
  CourseImportOptions, 
  ImportResult, 
  ContentTransformOptions 
} from '@/types/courses/packageTypes';
import { MaterialType, ProcessingMethod } from '@/types/materials';
import { 
  ImportSource, 
  BatchImportOptions, 
  ContentAnalysisResult, 
  ImportJobStatus,
  ContentQualityResult,
  ResourceGenerationOptions
} from '@/types/courses/importTypes';

/**
 * 处理结果类型
 * 定义了内容处理管道各阶段的结果
 */
interface ProcessingPipelineResult {
  stage: 'extract' | 'analyze' | 'transform' | 'align' | 'split' | 'tag' | 'complete';
  progress: number;
  data?: any;
  error?: string;
}

/**
 * AI增强提取选项
 */
interface AIEnhancedExtractionOptions {
  useFallbackOCR?: boolean;
  enhanceAudioTranscription?: boolean;
  detectLanguages?: boolean;
  extractMetadata?: boolean;
  cleanupFormatting?: boolean;
}

/**
 * 内容筛选条件
 */
interface ContentFilterOptions {
  minQualityScore?: number;
  languageFilter?: string[];
  excludeTopics?: string[];
  minSentenceCount?: number;
  maxSentenceCount?: number;
  contentTypes?: string[];
  dateRange?: {
    start?: Date;
    end?: Date;
  };
}

/**
 * 智能内容导入器
 * 负责处理复杂的内容导入场景，提供批量导入、内容分析、质量检测等功能
 */
class IntelligentImportService {
  /**
   * 分析内容
   * 对导入内容进行智能分析，检测语言、结构、质量等
   */
  async analyzeContent(content: string | File): Promise<ContentAnalysisResult> {
    try {
      const formData = new FormData();
      
      if (typeof content === 'string') {
        formData.append('content', content);
        formData.append('type', 'text');
      } else {
        formData.append('file', content);
        formData.append('type', 'file');
      }
      
      return post<ContentAnalysisResult>('/api/courses/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (error) {
      console.error('内容分析失败:', error);
      throw new Error(`内容分析失败: ${(error as Error).message}`);
    }
  }
  
  /**
   * 批量导入
   * 支持同时处理多个导入源，如多个文件或URL
   */
  async batchImport(sources: ImportSource[], options: BatchImportOptions = {}): Promise<string> {
    try {
      const response = await post<{jobId: string}>('/api/courses/batch-import', {
        sources,
        options
      });
      
      return response.jobId;
    } catch (error) {
      console.error('批量导入失败:', error);
      throw new Error(`批量导入失败: ${(error as Error).message}`);
    }
  }
  
  /**
   * 获取批量导入任务状态
   */
  async getImportJobStatus(jobId: string): Promise<ImportJobStatus> {
    try {
      return get<ImportJobStatus>(`/api/courses/import-jobs/${jobId}`);
    } catch (error) {
      console.error('获取导入任务状态失败:', error);
      throw new Error(`获取导入任务状态失败: ${(error as Error).message}`);
    }
  }
  
  /**
   * 检测内容质量
   * 检查拼写错误、语法问题、格式一致性等
   */
  async checkContentQuality(content: string): Promise<ContentQualityResult> {
    try {
      return post<ContentQualityResult>('/api/courses/quality-check', { content });
    } catch (error) {
      console.error('内容质量检测失败:', error);
      throw new Error(`内容质量检测失败: ${(error as Error).message}`);
    }
  }
  
  /**
   * 智能标签生成
   * 基于内容自动生成标签和分类
   */
  async generateTags(content: string): Promise<{
    tags: string[];
    categories: string[];
    topics: string[];
    level: string;
    estimatedDuration: number;
  }> {
    try {
      return post<any>('/api/courses/generate-tags', { content });
    } catch (error) {
      console.error('生成标签失败:', error);
      throw new Error(`生成标签失败: ${(error as Error).message}`);
    }
  }
  
  /**
   * 内容智能分割
   * 根据内容自动确定最佳课程分割点
   */
  async suggestContentSplitting(content: string): Promise<{
    suggestedLessons: Array<{
      title: string;
      startPosition: number;
      endPosition: number;
      sentenceCount: number;
    }>;
  }> {
    try {
      return post<any>('/api/courses/suggest-splitting', { content });
    } catch (error) {
      console.error('内容分割失败:', error);
      throw new Error(`内容分割失败: ${(error as Error).message}`);
    }
  }
  
  /**
   * 处理URL导入
   * 从网页URL提取内容并导入
   */
  async importFromUrl(url: string, options: ContentTransformOptions = { format: 'html' }): Promise<ImportResult> {
    try {
      return post<ImportResult>('/api/courses/import-url', {
        url,
        options
      });
    } catch (error) {
      console.error('从URL导入失败:', error);
      throw new Error(`从URL导入失败: ${(error as Error).message}`);
    }
  }
  
  /**
   * 智能预处理和清理
   * 清理文本中的无关内容，规范化格式
   */
  async preprocessContent(content: string, options: {
    removeHeaders?: boolean;
    removeFooters?: boolean;
    removeAds?: boolean;
    cleanFormatting?: boolean;
    extractMainContent?: boolean;
  } = {}): Promise<string> {
    try {
      const response = await post<{processedContent: string}>('/api/courses/preprocess', {
        content,
        options
      });
      
      return response.processedContent;
    } catch (error) {
      console.error('内容预处理失败:', error);
      throw new Error(`内容预处理失败: ${(error as Error).message}`);
    }
  }
  
  /**
   * 自动生成配套学习资源
   * 根据导入内容自动生成词汇表、练习题等
   */
  async generateSupplementaryResources(courseId: string, options: ResourceGenerationOptions = {}): Promise<{
    vocabularyId?: string;
    exercisesId?: string;
    summaryId?: string;
    quizzesId?: string;
  }> {
    try {
      return post<any>(`/api/courses/${courseId}/generate-resources`, options);
    } catch (error) {
      console.error('生成配套资源失败:', error);
      throw new Error(`生成配套资源失败: ${(error as Error).message}`);
    }
  }
  
  /**
   * AI增强内容提取
   * 使用先进的AI技术从各种格式中提取和结构化内容
   */
  async extractContentWithAI(file: File, options: AIEnhancedExtractionOptions = {}): Promise<{
    text: string;
    metadata: Record<string, any>;
    languages: Array<{code: string; confidence: number}>;
    structureHints: Array<{type: string; position: number}>;
  }> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      if (options) {
        formData.append('options', JSON.stringify(options));
      }
      
      return post<any>('/api/courses/extract-with-ai', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (error) {
      console.error('AI内容提取失败:', error);
      throw new Error(`AI内容提取失败: ${(error as Error).message}`);
    }
  }
  
  /**
   * 高级内容处理管道
   * 设置和执行一个复杂的内容处理流程
   */
  async runProcessingPipeline(
    content: string | File,
    stages: Array<'extract' | 'analyze' | 'transform' | 'align' | 'split' | 'tag'>,
    options: Record<string, any> = {},
    progressCallback?: (result: ProcessingPipelineResult) => void
  ): Promise<ImportResult> {
    try {
      // 初始化管道
      const pipelineId = await this.initPipeline(content, stages, options);
      
      // 轮询管道状态
      const result = await this.pollPipelineStatus(pipelineId, progressCallback);
      
      return result;
    } catch (error) {
      console.error('处理管道执行失败:', error);
      throw new Error(`处理管道执行失败: ${(error as Error).message}`);
    }
  }
  
  /**
   * 初始化处理管道
   */
  private async initPipeline(
    content: string | File,
    stages: string[],
    options: Record<string, any>
  ): Promise<string> {
    const formData = new FormData();
    
    if (typeof content === 'string') {
      formData.append('content', content);
      formData.append('type', 'text');
    } else {
      formData.append('file', content);
      formData.append('type', 'file');
    }
    
    formData.append('stages', JSON.stringify(stages));
    formData.append('options', JSON.stringify(options));
    
    const response = await post<{pipelineId: string}>('/api/courses/pipeline/init', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.pipelineId;
  }
  
  /**
   * 轮询处理管道状态
   */
  private async pollPipelineStatus(
    pipelineId: string, 
    progressCallback?: (result: ProcessingPipelineResult) => void
  ): Promise<ImportResult> {
    let isComplete = false;
    let result: ImportResult | null = null;
    
    while (!isComplete) {
      const status: ProcessingPipelineResult = await get(`/api/courses/pipeline/status/${pipelineId}`);
      
      if (progressCallback) {
        progressCallback(status);
      }
      
      if (status.stage === 'complete') {
        isComplete = true;
        result = status.data;
      } else if (status.error) {
        throw new Error(status.error);
      } else {
        // 延迟后再次检查
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    if (!result) {
      throw new Error('处理管道未返回结果');
    }
    
    return result;
  }
  
  /**
   * 内容过滤器
   * 根据各种条件筛选内容
   */
  async filterContent(courseIds: string[], options: ContentFilterOptions): Promise<string[]> {
    try {
      const response = await post<{filteredIds: string[]}>('/api/courses/filter', {
        courseIds,
        options
      });
      
      return response.filteredIds;
    } catch (error) {
      console.error('内容过滤失败:', error);
      throw new Error(`内容过滤失败: ${(error as Error).message}`);
    }
  }
  
  /**
   * 批量执行质量检查和修复
   * 对多个内容项目执行质量检查并尝试自动修复问题
   */
  async batchQualityCheck(
    courseIds: string[], 
    autoFix: boolean = false
  ): Promise<Array<{
    courseId: string;
    qualityScore: number;
    issues: Array<{type: string; description: string; fixed: boolean}>;
    fixedIssuesCount: number;
  }>> {
    try {
      return post<any>('/api/courses/batch-quality-check', {
        courseIds,
        autoFix
      });
    } catch (error) {
      console.error('批量质量检查失败:', error);
      throw new Error(`批量质量检查失败: ${(error as Error).message}`);
    }
  }
  
  /**
   * 内容去重
   * 检测和处理相似或重复的内容
   */
  async detectDuplicateContent(courseIds: string[]): Promise<Array<{
    groupId: string;
    similarityScore: number;
    items: Array<{courseId: string; title: string}>;
  }>> {
    try {
      return post<any>('/api/courses/detect-duplicates', { courseIds });
    } catch (error) {
      console.error('重复内容检测失败:', error);
      throw new Error(`重复内容检测失败: ${(error as Error).message}`);
    }
  }
}

// 导出服务实例
export const intelligentImportService = new IntelligentImportService(); 