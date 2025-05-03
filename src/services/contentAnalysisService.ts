import { ContentAnalysisResult, ContentQualityResult } from '@/types/courses/importTypes';

/**
 * 内容分析服务
 * 
 * 提供内容质量评估、主题分类和结构分析功能
 */
export class ContentAnalysisService {
  /**
   * 分析内容
   * 
   * @param content 要分析的内容
   * @returns 内容分析结果
   */
  async analyzeContent(content: string | File): Promise<ContentAnalysisResult> {
    // 如果是文件，先读取内容
    let textContent: string;
    
    if (content instanceof File) {
      textContent = await this.readFileContent(content);
    } else {
      textContent = content;
    }
    
    // 基本统计
    const stats = this.calculateBasicStats(textContent);
    
    // 内容质量评估
    const qualityResult = await this.assessContentQuality(textContent);
    
    // 主题识别
    const topics = await this.identifyTopics(textContent);
    
    // 内容结构分析
    const structure = await this.analyzeStructure(textContent);
    
    // 关键词提取
    const keywords = await this.extractKeywords(textContent);
    
    // 难度估计
    const difficulty = this.estimateDifficulty(textContent, stats);
    
    // 建议的标签
    const suggestedTags = [...topics.slice(0, 3), difficulty.level];
    
    return {
      wordCount: stats.wordCount,
      sentenceCount: stats.sentenceCount,
      paragraphCount: stats.paragraphCount,
      charCount: stats.charCount,
      avgSentenceLength: stats.avgSentenceLength,
      estimatedReadTime: stats.estimatedReadTime,
      estimatedLessons: stats.estimatedLessons,
      contentQuality: qualityResult,
      topics,
      suggestedTags,
      keywords,
      difficulty,
      structure
    };
  }
  
  /**
   * 读取文件内容
   * 
   * @param file 要读取的文件
   * @returns 文件内容
   */
  private async readFileContent(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        if (e.target?.result) {
          resolve(e.target.result as string);
        } else {
          reject(new Error('读取文件失败'));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('读取文件失败'));
      };
      
      reader.readAsText(file);
    });
  }
  
  /**
   * 计算基本统计数据
   * 
   * @param content 内容文本
   * @returns 基本统计结果
   */
  private calculateBasicStats(content: string): {
    wordCount: number;
    sentenceCount: number;
    paragraphCount: number;
    charCount: number;
    avgSentenceLength: number;
    estimatedReadTime: number;
    estimatedLessons: number;
  } {
    // 移除多余空白
    const normalizedContent = content.trim().replace(/\s+/g, ' ');
    
    // 字符数
    const charCount = content.length;
    
    // 单词数（基于空格分割，仅适用于英文）
    const wordCount = normalizedContent.split(/\s+/).filter(Boolean).length;
    
    // 句子数（基于句号、问号、感叹号）
    const sentenceCount = (normalizedContent.match(/[.!?]+\s/g) || []).length + 1;
    
    // 段落数（基于空行）
    const paragraphCount = (content.split(/\n\s*\n/).filter(Boolean).length) || 1;
    
    // 平均句子长度
    const avgSentenceLength = wordCount / sentenceCount;
    
    // 估计阅读时间（假设平均阅读速度为200词/分钟）
    const estimatedReadTime = Math.ceil(wordCount / 200);
    
    // 估计课程数（假设每课30个句子）
    const estimatedLessons = Math.ceil(sentenceCount / 30);
    
    return {
      wordCount,
      sentenceCount,
      paragraphCount,
      charCount,
      avgSentenceLength,
      estimatedReadTime,
      estimatedLessons
    };
  }
  
  /**
   * 评估内容质量
   * 
   * @param content 内容文本
   * @returns 质量评估结果
   */
  private async assessContentQuality(content: string): Promise<ContentQualityResult> {
    // 这里应该调用语言模型API进行内容质量评估
    // 目前使用模拟数据
    
    const issues: { 
      type: 'grammar' | 'spelling' | 'readability' | 'structure'; 
      description: string; 
      severity: 'low' | 'medium' | 'high';
      position?: { start: number; end: number; };
      suggestion?: string;
    }[] = [];
    
    let score = 85;
    
    // 模拟一些基本检查
    if (content.length < 500) {
      issues.push({
        type: 'structure',
        description: '内容过短',
        severity: 'medium'
      });
      score -= 15;
    }
    
    // 检查重复句子
    const sentences = content.split(/[.!?]+\s/).filter(Boolean);
    const uniqueSentences = new Set(sentences);
    if (uniqueSentences.size < sentences.length * 0.9) {
      issues.push({
        type: 'structure',
        description: '存在重复内容',
        severity: 'high'
      });
      score -= 10;
    }
    
    // 检查句子长度变化
    const sentenceLengths = sentences.map(s => s.length);
    const avgLength = sentenceLengths.reduce((a, b) => a + b, 0) / sentenceLengths.length;
    const allSimilarLength = sentenceLengths.every(len => Math.abs(len - avgLength) < avgLength * 0.3);
    
    if (allSimilarLength && sentences.length > 10) {
      issues.push({
        type: 'readability',
        description: '句子长度缺乏变化',
        severity: 'low'
      });
      score -= 5;
    }
    
    // 常见拼写错误检测（简化版）
    const commonErrors = ['teh', 'recieve', 'seperate', 'definately', 'occured'];
    for (const error of commonErrors) {
      if (content.toLowerCase().includes(error)) {
        issues.push({
          type: 'spelling',
          description: `可能的拼写错误: "${error}"`,
          severity: 'medium',
          suggestion: this.getSpellingCorrection(error)
        });
        score -= 3;
      }
    }
    
    // 确保分数在0-100范围内
    score = Math.max(0, Math.min(100, score));
    
    return {
      score,
      issues,
      readability: this.calculateReadabilityScore(content)
    };
  }
  
  /**
   * 获取拼写纠正建议
   */
  private getSpellingCorrection(word: string): string {
    const corrections: Record<string, string> = {
      'teh': 'the',
      'recieve': 'receive',
      'seperate': 'separate',
      'definately': 'definitely',
      'occured': 'occurred'
    };
    
    return corrections[word] || '';
  }
  
  /**
   * 计算可读性得分
   * 
   * @param content 内容文本
   * @returns 可读性得分（0-100）
   */
  private calculateReadabilityScore(content: string): number {
    // 简化版的可读性计算，实际应用中可以使用Flesch-Kincaid或其他标准算法
    const sentences = content.split(/[.!?]+\s/).filter(Boolean);
    const words = content.split(/\s+/).filter(Boolean);
    
    // 平均句子长度
    const avgSentenceLength = words.length / sentences.length;
    
    // 平均词长
    const avgWordLength = content.length / words.length;
    
    // 越短的句子和词越容易理解，得分越高
    let readabilityScore = 100 - (avgSentenceLength * 1.5) - (avgWordLength * 5);
    
    // 确保分数在0-100范围内
    readabilityScore = Math.max(0, Math.min(100, readabilityScore));
    
    return readabilityScore;
  }
  
  /**
   * 识别主题
   * 
   * @param content 内容文本
   * @returns 识别的主题数组
   */
  private async identifyTopics(content: string): Promise<string[]> {
    // 这里应该调用NLP API进行主题识别
    // 目前使用模拟数据
    
    // 常见学习主题
    const potentialTopics = [
      '日常对话', '旅游', '商务', '学术', '文化', '技术',
      '医疗', '法律', '文学', '历史', '科学', '艺术',
      '体育', '娱乐', '美食', '教育', '环境', '政治'
    ];
    
    // 简单模拟：基于关键词匹配随机选择2-4个主题
    const contentLower = content.toLowerCase();
    const matchedTopics = potentialTopics.filter(topic => {
      // 简单检查主题关键词是否在文本中出现
      return contentLower.includes(topic.toLowerCase());
    });
    
    // 如果没有匹配到，随机返回1-3个主题
    if (matchedTopics.length === 0) {
      const randomTopics = [];
      const numTopics = Math.floor(Math.random() * 3) + 1;
      for (let i = 0; i < numTopics; i++) {
        const randomIndex = Math.floor(Math.random() * potentialTopics.length);
        randomTopics.push(potentialTopics[randomIndex]);
      }
      return randomTopics;
    }
    
    return matchedTopics.slice(0, 4);
  }
  
  /**
   * 分析内容结构
   * 
   * @param content 内容文本
   * @returns 结构分析结果
   */
  private async analyzeStructure(content: string): Promise<{
    sections: { title: string; level: number; }[];
    hasClearStructure: boolean;
  }> {
    // 分析内容结构，识别标题、小节等
    const lines = content.split('\n').filter(Boolean);
    const sections = [];
    let hasStructure = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // 尝试识别标题（简化检测，实际应用中需要更复杂的算法）
      if (
        line.length < 100 && 
        (line.endsWith(':') || 
         /^[A-Z\d][\w\s]{2,50}$/.test(line) || 
         /^[#]+\s/.test(line))
      ) {
        // 推测标题级别（简化版）
        let level = 1;
        if (line.startsWith('#')) {
          level = (line.match(/^#+/) || ['#'])[0].length;
        } else if (line.length > 30) {
          level = 2;
        }
        
        sections.push({
          title: line.replace(/^[#]+\s/, '').replace(/:$/, ''),
          level
        });
        
        hasStructure = true;
      }
    }
    
    return {
      sections,
      hasClearStructure: hasStructure && sections.length > 1
    };
  }
  
  /**
   * 提取关键词
   * 
   * @param content 内容文本
   * @returns 关键词数组
   */
  private async extractKeywords(content: string): Promise<string[]> {
    // 这里应该调用NLP API进行关键词提取
    // 目前使用简化的TF-IDF类似方法
    
    // 分词（简化版，仅适用于英文）
    const words = content
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3) // 忽略短词
      .filter(word => !this.isStopWord(word)); // 忽略停用词
    
    // 计算词频
    const wordFreq: Record<string, number> = {};
    for (const word of words) {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    }
    
    // 按频率排序
    const sortedWords = Object.entries(wordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(entry => entry[0]);
    
    return sortedWords;
  }
  
  /**
   * 判断是否为停用词
   * 
   * @param word 单词
   * @returns 是否为停用词
   */
  private isStopWord(word: string): boolean {
    // 英文常见停用词
    const stopWords = [
      'the', 'and', 'that', 'have', 'for', 'not', 'with', 'you', 'this',
      'but', 'his', 'from', 'they', 'she', 'will', 'what', 'there', 'all',
      'been', 'when', 'who', 'would', 'about', 'their', 'like', 'some',
      'more', 'them', 'into', 'which', 'just', 'than', 'then', 'where',
      'very', 'over', 'only', 'also', 'most', 'such', 'through', 'same',
      'take', 'while', 'should', 'those', 'still', 'every', 'these', 'other'
    ];
    
    return stopWords.includes(word);
  }
  
  /**
   * 估计内容难度
   * 
   * @param content 内容文本
   * @param stats 基本统计数据
   * @returns 难度估计结果
   */
  private estimateDifficulty(content: string, stats: {
    avgSentenceLength: number;
    wordCount: number;
  }): {
    level: string;
    score: number;
    factors: { name: string; impact: number }[];
  } {
    let difficultyScore = 50; // 中等难度基准
    const factors = [];
    
    // 基于平均句子长度
    if (stats.avgSentenceLength > 25) {
      difficultyScore += 15;
      factors.push({ name: '长句子', impact: 15 });
    } else if (stats.avgSentenceLength < 10) {
      difficultyScore -= 10;
      factors.push({ name: '短句子', impact: -10 });
    }
    
    // 基于词汇多样性（独特词汇占比）
    const words = content.toLowerCase().split(/\s+/).filter(Boolean);
    const uniqueWords = new Set(words);
    const lexicalDiversity = uniqueWords.size / words.length;
    
    if (lexicalDiversity > 0.7) {
      difficultyScore += 20;
      factors.push({ name: '丰富词汇', impact: 20 });
    } else if (lexicalDiversity < 0.4) {
      difficultyScore -= 15;
      factors.push({ name: '简单词汇', impact: -15 });
    }
    
    // 检测长词占比
    const longWords = words.filter(word => word.length > 8);
    const longWordRatio = longWords.length / words.length;
    
    if (longWordRatio > 0.1) {
      difficultyScore += 15;
      factors.push({ name: '长词', impact: 15 });
    }
    
    // 确定难度级别
    let level = '中级';
    if (difficultyScore < 30) {
      level = '初级';
    } else if (difficultyScore > 70) {
      level = '高级';
    }
    
    // 确保分数在0-100范围内
    difficultyScore = Math.max(0, Math.min(100, difficultyScore));
    
    return {
      level,
      score: difficultyScore,
      factors
    };
  }
}

// 创建单例实例
export const contentAnalysisService = new ContentAnalysisService(); 