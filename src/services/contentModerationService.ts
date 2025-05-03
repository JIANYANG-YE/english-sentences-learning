import apiService from './apiService';
import { stateManager } from './stateManagementService';
import communicationService from './componentCommunication';

// 内容类型
export type ContentType = 'post' | 'comment' | 'resource' | 'profile' | 'message';

// 内容严重程度
export type SeverityLevel = 'low' | 'medium' | 'high' | 'critical';

// 违规类型
export enum ViolationType {
  SPAM = 'spam',
  HARASSMENT = 'harassment',
  HATE_SPEECH = 'hate_speech',
  INAPPROPRIATE = 'inappropriate',
  SENSITIVE = 'sensitive_content',
  MISLEADING = 'misleading',
  COPYRIGHT = 'copyright',
  PERSONAL_INFO = 'personal_info',
  MALICIOUS_LINK = 'malicious_link',
  OTHER = 'other'
}

// 内容审核结果
export interface ModerationResult {
  isApproved: boolean;
  score: number; // 0-1，1表示完全安全
  violations: Array<{
    type: ViolationType;
    severity: SeverityLevel;
    confidence: number; // 0-1，置信度
    details?: string;
  }>;
  needsHumanReview: boolean;
  reviewReason?: string;
  moderatedContent?: string; // 可选，过滤后的内容
}

// 审核请求接口
export interface ModerationRequest {
  contentId?: string;
  contentType: ContentType;
  content: string;
  userId: string;
  metadata?: Record<string, any>;
  autoFilter?: boolean; // 是否自动过滤敏感内容
}

// 敏感词列表类型
type SensitiveWordList = {
  [key in SeverityLevel]: string[];
};

/**
 * 内容审核服务
 */
class ContentModerationService {
  private sensitiveWords: SensitiveWordList = {
    low: [],
    medium: [],
    high: [],
    critical: []
  };
  
  private urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;
  private emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi;
  private phoneRegex = /(\+\d{1,3}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/gi;
  
  private isInitialized = false;
  private pendingReviews: ModerationRequest[] = [];
  
  constructor() {
    this.initialize();
  }
  
  /**
   * 初始化审核服务
   */
  private async initialize(): Promise<void> {
    try {
      this.loadSensitiveWords();
      this.isInitialized = true;
      
      // 发布初始化完成事件
      communicationService.publish(
        'moderationServiceInitialized',
        { timestamp: new Date().toISOString() },
        'ContentModerationService',
        'community'
      );
      
      console.log('内容审核服务初始化完成');
    } catch (error) {
      console.error('内容审核服务初始化失败:', error);
      
      // 稍后重试
      setTimeout(() => this.initialize(), 5000);
    }
  }
  
  /**
   * 加载敏感词列表
   */
  private async loadSensitiveWords(): Promise<void> {
    try {
      // 在实际项目中，应该从API获取敏感词列表
      // 这里使用模拟数据示例
      const mockResponse = {
        low: ['不适当', '不合适', '轻微', '可疑'],
        medium: ['令人反感', '不恰当', '垃圾信息', '广告'],
        high: ['侮辱', '歧视', '欺骗', '恶意'],
        critical: ['暴力', '攻击', '极端', '威胁']
      };
      
      this.sensitiveWords = mockResponse;
    } catch (error) {
      console.error('加载敏感词列表失败:', error);
      throw error;
    }
  }
  
  /**
   * 审核内容
   * @param request 审核请求
   * @returns 审核结果
   */
  public async moderateContent(request: ModerationRequest): Promise<ModerationResult> {
    // 确保服务已初始化
    if (!this.isInitialized) {
      this.pendingReviews.push(request);
      throw new Error('内容审核服务尚未初始化');
    }
    
    try {
      // 在实际项目中，可以调用外部AI审核API
      // 这里使用本地实现示例
      
      // 1. 检查敏感词
      const sensitiveWordResult = this.checkSensitiveWords(request.content);
      
      // 2. 检查个人信息
      const personalInfoResult = this.checkPersonalInfo(request.content);
      
      // 3. 检查恶意链接
      const maliciousLinkResult = this.checkMaliciousLinks(request.content);
      
      // 4. 合并所有违规内容
      const violations = [
        ...sensitiveWordResult.violations,
        ...personalInfoResult.violations,
        ...maliciousLinkResult.violations
      ];
      
      // 5. 计算总体安全分数
      const avgScore = (
        sensitiveWordResult.score * 0.5 + 
        personalInfoResult.score * 0.3 + 
        maliciousLinkResult.score * 0.2
      );
      
      // 6. 判断是否需要人工审核
      const needsHumanReview = 
        violations.some(v => v.severity === 'high' || v.severity === 'critical') ||
        violations.length > 3;
        
      // 7. 如果配置了自动过滤，则过滤敏感内容
      let moderatedContent = request.content;
      if (request.autoFilter) {
        moderatedContent = this.filterContent(request.content, violations);
      }
      
      // 8. 构建结果
      const result: ModerationResult = {
        isApproved: violations.length === 0 || 
                     (violations.every(v => v.severity === 'low') && violations.length <= 2),
        score: avgScore,
        violations,
        needsHumanReview,
        reviewReason: needsHumanReview ? 
          '内容可能包含严重违规信息，需要人工审核' : undefined,
        moderatedContent: request.autoFilter ? moderatedContent : undefined
      };
      
      // 9. 如果需要人工审核，发送通知
      if (needsHumanReview) {
        this.notifyHumanReviewNeeded(request, result);
      }
      
      // 10. 记录审核结果
      this.logModerationResult(request, result);
      
      return result;
    } catch (error) {
      console.error('内容审核失败:', error);
      
      // 失败时返回默认拒绝结果
      return {
        isApproved: false,
        score: 0,
        violations: [{
          type: ViolationType.OTHER,
          severity: 'medium',
          confidence: 1,
          details: '内容审核过程中发生错误'
        }],
        needsHumanReview: true,
        reviewReason: '审核过程失败，需要人工检查'
      };
    }
  }
  
  /**
   * 检查敏感词
   * @param content 内容
   * @returns 审核结果
   */
  private checkSensitiveWords(content: string): {
    score: number;
    violations: ModerationResult['violations'];
  } {
    const violations: ModerationResult['violations'] = [];
    let score = 1.0;
    
    // 检查内容中的敏感词
    Object.entries(this.sensitiveWords).forEach(([severity, words]) => {
      words.forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        const matches = content.match(regex);
        
        if (matches && matches.length > 0) {
          // 根据敏感词数量和严重程度降低分数
          switch (severity as SeverityLevel) {
            case 'low':
              score -= matches.length * 0.05;
              break;
            case 'medium':
              score -= matches.length * 0.1;
              break;
            case 'high':
              score -= matches.length * 0.2;
              break;
            case 'critical':
              score -= matches.length * 0.3;
              break;
          }
          
          violations.push({
            type: ViolationType.INAPPROPRIATE,
            severity: severity as SeverityLevel,
            confidence: 0.85,
            details: `内容包含敏感词: "${word}" (出现${matches.length}次)`
          });
        }
      });
    });
    
    // 确保分数在0-1范围内
    score = Math.max(0, Math.min(1, score));
    
    return { score, violations };
  }
  
  /**
   * 检查个人信息
   * @param content 内容
   * @returns 审核结果
   */
  private checkPersonalInfo(content: string): {
    score: number;
    violations: ModerationResult['violations'];
  } {
    const violations: ModerationResult['violations'] = [];
    let score = 1.0;
    
    // 检查可能的电子邮件地址
    const emailMatches = content.match(this.emailRegex);
    if (emailMatches && emailMatches.length > 0) {
      score -= 0.3;
      violations.push({
        type: ViolationType.PERSONAL_INFO,
        severity: 'high',
        confidence: 0.9,
        details: `内容包含电子邮件地址，不建议在公共场合分享`
      });
    }
    
    // 检查可能的电话号码
    const phoneMatches = content.match(this.phoneRegex);
    if (phoneMatches && phoneMatches.length > 0) {
      score -= 0.3;
      violations.push({
        type: ViolationType.PERSONAL_INFO,
        severity: 'high',
        confidence: 0.85,
        details: `内容包含电话号码，不建议在公共场合分享`
      });
    }
    
    // 确保分数在0-1范围内
    score = Math.max(0, Math.min(1, score));
    
    return { score, violations };
  }
  
  /**
   * 检查恶意链接
   * @param content 内容
   * @returns 审核结果
   */
  private checkMaliciousLinks(content: string): {
    score: number;
    violations: ModerationResult['violations'];
  } {
    const violations: ModerationResult['violations'] = [];
    let score = 1.0;
    
    // 提取所有URL
    const urlMatches = content.match(this.urlRegex);
    if (urlMatches && urlMatches.length > 0) {
      // 这里应该实际检查链接安全性
      // 在实际项目中，可以调用安全API检查链接
      // 这里仅做示例
      
      // 假设10%的链接可能有风险
      if (Math.random() < 0.1) {
        score -= 0.25;
        violations.push({
          type: ViolationType.MALICIOUS_LINK,
          severity: 'medium',
          confidence: 0.7,
          details: `内容包含可疑链接，请谨慎访问`
        });
      }
    }
    
    // 确保分数在0-1范围内
    score = Math.max(0, Math.min(1, score));
    
    return { score, violations };
  }
  
  /**
   * 过滤内容
   * @param content 原始内容
   * @param violations 违规内容
   * @returns 过滤后的内容
   */
  private filterContent(content: string, violations: ModerationResult['violations']): string {
    let filteredContent = content;
    
    // 过滤敏感词
    const sensitiveViolations = violations.filter(v => 
      v.type === ViolationType.INAPPROPRIATE || 
      v.type === ViolationType.HATE_SPEECH
    );
    
    // 从详情中提取敏感词
    sensitiveViolations.forEach(violation => {
      if (violation.details) {
        const match = violation.details.match(/"([^"]+)"/);
        if (match && match[1]) {
          const sensitiveWord = match[1];
          // 替换敏感词为星号
          const replacement = '*'.repeat(sensitiveWord.length);
          const regex = new RegExp(`\\b${sensitiveWord}\\b`, 'gi');
          filteredContent = filteredContent.replace(regex, replacement);
        }
      }
    });
    
    // 过滤个人信息
    const personalInfoViolations = violations.filter(v => v.type === ViolationType.PERSONAL_INFO);
    if (personalInfoViolations.length > 0) {
      // 替换电子邮件
      filteredContent = filteredContent.replace(this.emailRegex, '[电子邮件已过滤]');
      
      // 替换电话号码
      filteredContent = filteredContent.replace(this.phoneRegex, '[电话号码已过滤]');
    }
    
    return filteredContent;
  }
  
  /**
   * 通知需要人工审核
   * @param request 审核请求
   * @param result 审核结果
   */
  private notifyHumanReviewNeeded(request: ModerationRequest, result: ModerationResult): void {
    // 发布需要人工审核的消息
    communicationService.publish(
      'humanReviewNeeded',
      {
        request,
        result,
        timestamp: new Date().toISOString()
      },
      'ContentModerationService',
      'community'
    );
    
    console.log('内容需要人工审核:', request.contentId);
    
    // 在实际项目中，这里可能会发送通知给社区管理员
  }
  
  /**
   * 记录审核结果
   * @param request 审核请求
   * @param result 审核结果
   */
  private logModerationResult(request: ModerationRequest, result: ModerationResult): void {
    // 在实际项目中，这里应该将审核结果保存到服务器
    console.log('内容审核结果:', {
      contentId: request.contentId,
      contentType: request.contentType,
      userId: request.userId,
      isApproved: result.isApproved,
      score: result.score,
      violationsCount: result.violations.length,
      needsHumanReview: result.needsHumanReview,
      timestamp: new Date().toISOString()
    });
  }
  
  /**
   * 人工审核内容
   * @param contentId 内容ID
   * @param isApproved 是否批准
   * @param moderatorId 审核员ID
   * @param reason 原因
   */
  public async humanReview(
    contentId: string,
    isApproved: boolean,
    moderatorId: string,
    reason?: string
  ): Promise<void> {
    // 在实际项目中，这里应该调用API来更新审核状态
    console.log('人工审核结果:', {
      contentId,
      isApproved,
      moderatorId,
      reason,
      timestamp: new Date().toISOString()
    });
    
    // 发布人工审核完成事件
    communicationService.publish(
      'humanReviewCompleted',
      {
        contentId,
        isApproved,
        moderatorId,
        reason,
        timestamp: new Date().toISOString()
      },
      'ContentModerationService',
      'community'
    );
  }
  
  /**
   * 更新敏感词列表
   * @param newWords 新敏感词列表
   */
  public updateSensitiveWords(newWords: SensitiveWordList): void {
    this.sensitiveWords = newWords;
    console.log('敏感词列表已更新');
  }
  
  /**
   * 添加敏感词
   * @param word 敏感词
   * @param severity 严重程度
   */
  public addSensitiveWord(word: string, severity: SeverityLevel): void {
    if (!this.sensitiveWords[severity].includes(word)) {
      this.sensitiveWords[severity].push(word);
      console.log(`已添加敏感词 "${word}" (${severity})`);
    }
  }
  
  /**
   * 移除敏感词
   * @param word 敏感词
   * @param severity 严重程度
   */
  public removeSensitiveWord(word: string, severity: SeverityLevel): void {
    const index = this.sensitiveWords[severity].indexOf(word);
    if (index !== -1) {
      this.sensitiveWords[severity].splice(index, 1);
      console.log(`已移除敏感词 "${word}" (${severity})`);
    }
  }
  
  /**
   * 批量处理待审核内容
   */
  public async processPendingReviews(): Promise<void> {
    if (!this.isInitialized || this.pendingReviews.length === 0) {
      return;
    }
    
    console.log(`开始处理${this.pendingReviews.length}个待审核内容`);
    
    const pendingReviews = [...this.pendingReviews];
    this.pendingReviews = [];
    
    for (const request of pendingReviews) {
      try {
        await this.moderateContent(request);
      } catch (error) {
        console.error('处理待审核内容失败:', error);
        this.pendingReviews.push(request);
      }
    }
    
    console.log('待审核内容处理完成');
  }
}

// 创建单例实例
const contentModerationService = new ContentModerationService();

export default contentModerationService; 