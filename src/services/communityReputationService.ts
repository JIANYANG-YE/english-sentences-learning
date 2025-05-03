import { stateManager } from './stateManagementService';
import apiService from './apiService';
import communicationService from './componentCommunication';

// 声誉等级枚举
export enum ReputationLevel {
  NEWCOMER = 'newcomer',    // 新手
  LEARNER = 'learner',      // 学习者
  CONTRIBUTOR = 'contributor', // 贡献者
  MENTOR = 'mentor',        // 导师
  EXPERT = 'expert'         // 专家
}

// 声誉变更类型枚举
export enum ReputationChangeType {
  ANSWER_UPVOTE = 'answer_upvote',         // 回答被点赞
  QUESTION_UPVOTE = 'question_upvote',     // 问题被点赞
  CONTENT_CREATION = 'content_creation',   // 创建内容
  DAILY_LOGIN = 'daily_login',             // 每日登录
  STREAK_BONUS = 'streak_bonus',           // 连续学习奖励
  ACCEPTED_ANSWER = 'accepted_answer',     // 回答被采纳
  ANSWER_DOWNVOTE = 'answer_downvote',     // 回答被踩
  QUESTION_DOWNVOTE = 'question_downvote', // 问题被踩
  REPORTED_CONTENT = 'reported_content',   // 内容被举报
  ADMIN_ADJUSTMENT = 'admin_adjustment',   // 管理员调整
  POST_CREATED = 'post_created',           // 创建帖子
  POST_UPVOTED = 'post_upvoted',           // 帖子被赞
  POST_DOWNVOTED = 'post_downvoted',       // 帖子被踩
  COMMENT_CREATED = 'comment_created',     // 创建评论
  COMMENT_UPVOTED = 'comment_upvoted',     // 评论被赞
  RESOURCE_SHARED = 'resource_shared',     // 分享资源
  QUESTION_ANSWERED = 'question_answered', // 回答问题
  ANSWER_ACCEPTED = 'answer_accepted',     // 回答被接受
  VIOLATION_CONFIRMED = 'violation_confirmed', // 违规确认
  HELPFUL_FLAG = 'helpful_flag',           // 有用的标记
  ACHIEVEMENT_UNLOCKED = 'achievement_unlocked' // 成就解锁
}

// 声誉变更记录
export interface ReputationChange {
  id: string;
  userId: string;
  type: ReputationChangeType;
  amount: number;
  timestamp: string; // ISO日期字符串
  details?: {
    contentId?: string;
    contentType?: string;
    reason?: string;
  };
}

// 用户声誉信息
export interface UserReputation {
  userId: string;
  score: number;
  level: ReputationLevel;
  changes: ReputationChange[];
  privileges: string[];
  lastUpdated: string; // ISO日期字符串
}

// 声誉阈值配置
interface ReputationThresholds {
  [ReputationLevel.NEWCOMER]: number;
  [ReputationLevel.LEARNER]: number;
  [ReputationLevel.CONTRIBUTOR]: number;
  [ReputationLevel.MENTOR]: number;
  [ReputationLevel.EXPERT]: number;
}

// 声誉变更分数配置
interface ReputationChangeScores {
  [ReputationChangeType.POST_CREATED]: number;
  [ReputationChangeType.POST_UPVOTED]: number;
  [ReputationChangeType.POST_DOWNVOTED]: number;
  [ReputationChangeType.COMMENT_CREATED]: number;
  [ReputationChangeType.COMMENT_UPVOTED]: number;
  [ReputationChangeType.RESOURCE_SHARED]: number;
  [ReputationChangeType.QUESTION_ANSWERED]: number;
  [ReputationChangeType.ANSWER_ACCEPTED]: number;
  [ReputationChangeType.REPORTED_CONTENT]: number;
  [ReputationChangeType.VIOLATION_CONFIRMED]: number;
  [ReputationChangeType.HELPFUL_FLAG]: number;
  [ReputationChangeType.ACHIEVEMENT_UNLOCKED]: number;
}

// 特权配置
interface PrivilegeConfig {
  name: string;
  description: string;
  requiredScore: number;
}

// 声誉相关接口
interface ReputationData {
  currentScore: number;
  level: ReputationLevel;
  nextLevelScore: number;
  progressToNextLevel: number;
  recentChanges: Array<{
    id: string;
    date: Date;
    type: ReputationChangeType;
    amount: number;
    description: string;
  }>;
  privileges: Array<{
    id: string;
    name: string;
    description: string;
    requiredLevel: ReputationLevel;
    unlocked: boolean;
  }>;
}

/**
 * 社区声誉服务
 */
class CommunityReputationService {
  private apiUrl = '/api/community/reputation';
  
  // 声誉等级阈值
  private reputationThresholds: ReputationThresholds = {
    [ReputationLevel.NEWCOMER]: 0,
    [ReputationLevel.LEARNER]: 50,
    [ReputationLevel.CONTRIBUTOR]: 200,
    [ReputationLevel.MENTOR]: 500,
    [ReputationLevel.EXPERT]: 1000
  };
  
  // 声誉变更点数
  private reputationChangeScores: ReputationChangeScores = {
    [ReputationChangeType.POST_CREATED]: 5,
    [ReputationChangeType.POST_UPVOTED]: 10,
    [ReputationChangeType.POST_DOWNVOTED]: -2,
    [ReputationChangeType.COMMENT_CREATED]: 2,
    [ReputationChangeType.COMMENT_UPVOTED]: 5,
    [ReputationChangeType.RESOURCE_SHARED]: 10,
    [ReputationChangeType.QUESTION_ANSWERED]: 7,
    [ReputationChangeType.ANSWER_ACCEPTED]: 15,
    [ReputationChangeType.REPORTED_CONTENT]: -5,
    [ReputationChangeType.VIOLATION_CONFIRMED]: -20,
    [ReputationChangeType.HELPFUL_FLAG]: 3,
    [ReputationChangeType.ACHIEVEMENT_UNLOCKED]: 20
  };
  
  // 特权列表
  private privileges: PrivilegeConfig[] = [
    {
      name: 'create_post',
      description: '创建讨论帖',
      requiredScore: 0
    },
    {
      name: 'comment',
      description: '评论讨论帖',
      requiredScore: 0
    },
    {
      name: 'upvote',
      description: '点赞内容',
      requiredScore: 10
    },
    {
      name: 'downvote',
      description: '踩内容',
      requiredScore: 50
    },
    {
      name: 'share_resource',
      description: '分享学习资源',
      requiredScore: 30
    },
    {
      name: 'upload_files',
      description: '上传文件',
      requiredScore: 100
    },
    {
      name: 'create_poll',
      description: '创建投票',
      requiredScore: 150
    },
    {
      name: 'flag_content',
      description: '标记违规内容',
      requiredScore: 50
    },
    {
      name: 'create_guide',
      description: '创建学习指南',
      requiredScore: 300
    },
    {
      name: 'edit_tags',
      description: '编辑标签',
      requiredScore: 500
    },
    {
      name: 'moderate_comments',
      description: '管理评论',
      requiredScore: 750
    }
  ];
  
  // 声誉缓存
  private reputationCache: Map<string, UserReputation> = new Map();
  
  constructor() {
    // 初始化服务
    this.initialize();
    
    // 监听可能影响声誉的事件
    this.setupEventListeners();
  }
  
  /**
   * 初始化服务
   */
  private async initialize(): Promise<void> {
    try {
      console.log('正在初始化社区声誉服务...');
      
      // 在实际项目中，应该从API加载配置
      
      // 发布初始化完成事件
      communicationService.publish(
        'reputationServiceInitialized',
        { timestamp: new Date().toISOString() },
        'CommunityReputationService',
        'community'
      );
    } catch (error) {
      console.error('社区声誉服务初始化失败:', error);
    }
  }
  
  /**
   * 设置事件监听器
   */
  private setupEventListeners(): void {
    // 监听各种可能影响声誉的事件
    communicationService.subscribe(
      'postCreated',
      (payload) => {
        const { userId, postId } = payload.data;
        this.addReputationChange(
          userId,
          ReputationChangeType.POST_CREATED,
          this.reputationChangeScores[ReputationChangeType.POST_CREATED],
          { contentId: postId, contentType: 'post' }
        );
      },
      'community'
    );
    
    communicationService.subscribe(
      'postUpvoted',
      (payload) => {
        const { authorId, postId } = payload.data;
        this.addReputationChange(
          authorId,
          ReputationChangeType.POST_UPVOTED,
          this.reputationChangeScores[ReputationChangeType.POST_UPVOTED],
          { contentId: postId, contentType: 'post' }
        );
      },
      'community'
    );
    
    communicationService.subscribe(
      'postDownvoted',
      (payload) => {
        const { authorId, postId } = payload.data;
        this.addReputationChange(
          authorId,
          ReputationChangeType.POST_DOWNVOTED,
          this.reputationChangeScores[ReputationChangeType.POST_DOWNVOTED],
          { contentId: postId, contentType: 'post' }
        );
      },
      'community'
    );
    
    communicationService.subscribe(
      'commentCreated',
      (payload) => {
        const { userId, commentId } = payload.data;
        this.addReputationChange(
          userId,
          ReputationChangeType.COMMENT_CREATED,
          this.reputationChangeScores[ReputationChangeType.COMMENT_CREATED],
          { contentId: commentId, contentType: 'comment' }
        );
      },
      'community'
    );
    
    communicationService.subscribe(
      'resourceShared',
      (payload) => {
        const { userId, resourceId } = payload.data;
        this.addReputationChange(
          userId,
          ReputationChangeType.RESOURCE_SHARED,
          this.reputationChangeScores[ReputationChangeType.RESOURCE_SHARED],
          { contentId: resourceId, contentType: 'resource' }
        );
      },
      'community'
    );
    
    communicationService.subscribe(
      'contentReported',
      (payload) => {
        const { contentAuthorId, contentId, contentType } = payload.data;
        // 仅在确认违规后才扣减声誉
        if (payload.data.isConfirmed) {
          this.addReputationChange(
            contentAuthorId,
            ReputationChangeType.VIOLATION_CONFIRMED,
            this.reputationChangeScores[ReputationChangeType.VIOLATION_CONFIRMED],
            { contentId, contentType, reason: payload.data.reason }
          );
        }
      },
      'community'
    );
  }
  
  /**
   * 获取用户声誉
   * @param userId 用户ID
   * @returns 用户声誉信息
   */
  async getUserReputation(userId: string): Promise<ReputationData> {
    try {
      const response = await apiService.get(`${this.apiUrl}/${userId}`);
      return response.data;
    } catch (error) {
      console.error('获取用户声誉失败:', error);
      throw error;
    }
  }
  
  /**
   * 更新用户声誉（添加或减少分数）
   * @param userId 用户ID
   * @param changeType 变更类型
   * @param amount 变更数量（正数增加，负数减少）
   * @param description 变更描述（可选）
   * @returns 更新后的声誉信息
   */
  async updateReputation(
    userId: string,
    changeType: ReputationChangeType,
    amount: number,
    description?: string
  ): Promise<ReputationData> {
    try {
      const response = await apiService.post(`${this.apiUrl}/${userId}/update`, {
        changeType,
        amount,
        description: description || this.getDefaultDescription(changeType, amount)
      });
      return response.data;
    } catch (error) {
      console.error('更新用户声誉失败:', error);
      throw error;
    }
  }
  
  /**
   * 根据变更类型和数量生成默认描述
   * @param changeType 变更类型
   * @param amount 变更数量
   * @returns 默认描述文本
   */
  private getDefaultDescription(changeType: ReputationChangeType, amount: number): string {
    switch (changeType) {
      case ReputationChangeType.ANSWER_UPVOTE:
        return '您的回答获得了赞同';
      case ReputationChangeType.QUESTION_UPVOTE:
        return '您的问题获得了赞同';
      case ReputationChangeType.CONTENT_CREATION:
        return '创建了新内容';
      case ReputationChangeType.DAILY_LOGIN:
        return '每日登录奖励';
      case ReputationChangeType.STREAK_BONUS:
        return '连续学习奖励';
      case ReputationChangeType.ACCEPTED_ANSWER:
        return '您的回答被采纳为最佳答案';
      case ReputationChangeType.ANSWER_DOWNVOTE:
        return '您的回答收到了反对';
      case ReputationChangeType.QUESTION_DOWNVOTE:
        return '您的问题收到了反对';
      case ReputationChangeType.REPORTED_CONTENT:
        return '您的内容被举报并确认违规';
      case ReputationChangeType.ADMIN_ADJUSTMENT:
        return '管理员调整声誉分数';
      default:
        return '声誉变更';
    }
  }
  
  /**
   * 获取等级所需最低分数
   * @param level 声誉等级
   * @returns 所需最低分数
   */
  getMinScoreForLevel(level: ReputationLevel): number {
    switch (level) {
      case ReputationLevel.NEWCOMER:
        return 0;
      case ReputationLevel.LEARNER:
        return 100;
      case ReputationLevel.CONTRIBUTOR:
        return 500;
      case ReputationLevel.MENTOR:
        return 2000;
      case ReputationLevel.EXPERT:
        return 5000;
      default:
        return 0;
    }
  }
  
  /**
   * 根据分数获取声誉等级
   * @param score 声誉分数
   * @returns 对应的声誉等级
   */
  getLevelFromScore(score: number): ReputationLevel {
    if (score >= this.getMinScoreForLevel(ReputationLevel.EXPERT)) {
      return ReputationLevel.EXPERT;
    } else if (score >= this.getMinScoreForLevel(ReputationLevel.MENTOR)) {
      return ReputationLevel.MENTOR;
    } else if (score >= this.getMinScoreForLevel(ReputationLevel.CONTRIBUTOR)) {
      return ReputationLevel.CONTRIBUTOR;
    } else if (score >= this.getMinScoreForLevel(ReputationLevel.LEARNER)) {
      return ReputationLevel.LEARNER;
    } else {
      return ReputationLevel.NEWCOMER;
    }
  }
  
  /**
   * 计算下一级所需分数
   * @param currentLevel 当前等级
   * @returns 下一级所需分数，如果已经是最高级则返回当前等级分数
   */
  getNextLevelScore(currentLevel: ReputationLevel): number {
    switch (currentLevel) {
      case ReputationLevel.NEWCOMER:
        return this.getMinScoreForLevel(ReputationLevel.LEARNER);
      case ReputationLevel.LEARNER:
        return this.getMinScoreForLevel(ReputationLevel.CONTRIBUTOR);
      case ReputationLevel.CONTRIBUTOR:
        return this.getMinScoreForLevel(ReputationLevel.MENTOR);
      case ReputationLevel.MENTOR:
        return this.getMinScoreForLevel(ReputationLevel.EXPERT);
      case ReputationLevel.EXPERT:
        return this.getMinScoreForLevel(ReputationLevel.EXPERT);
      default:
        return 0;
    }
  }
  
  /**
   * 计算升级进度百分比
   * @param currentScore 当前分数
   * @param currentLevel 当前等级
   * @returns 升级进度(0-100)
   */
  calculateProgressToNextLevel(currentScore: number, currentLevel: ReputationLevel): number {
    if (currentLevel === ReputationLevel.EXPERT) {
      return 100; // 已经是最高级
    }
    
    const currentLevelMinScore = this.getMinScoreForLevel(currentLevel);
    const nextLevelMinScore = this.getNextLevelScore(currentLevel);
    const scoreRange = nextLevelMinScore - currentLevelMinScore;
    const scoreProgress = currentScore - currentLevelMinScore;
    
    const progressPercentage = Math.min(Math.floor((scoreProgress / scoreRange) * 100), 99);
    return progressPercentage;
  }
  
  /**
   * 添加声誉变更
   * @param userId 用户ID
   * @param type 变更类型
   * @param amount 变更数量
   * @param details 变更详情
   */
  public async addReputationChange(
    userId: string,
    type: ReputationChangeType,
    amount: number,
    details?: ReputationChange['details']
  ): Promise<void> {
    try {
      // 获取当前声誉
      let reputation = await this.getUserReputation(userId);
      
      // 创建变更记录
      const change: ReputationChange = {
        id: `change-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        userId,
        type,
        amount,
        timestamp: new Date().toISOString(),
        details
      };
      
      // 创建对应的UI友好格式变更记录
      const uiChange = {
        id: change.id,
        date: new Date(change.timestamp),
        type: change.type,
        amount: change.amount,
        description: this.getDefaultDescription(change.type, change.amount)
      };
      
      // 更新声誉分数
      const newScore = reputation.currentScore + amount;
      
      // 确定新的声誉等级
      const newLevel = this.determineReputationLevel(newScore);
      
      // 确定新的特权
      const newPrivileges = this.determinePrivileges(newScore);
      
      // 将新变更发送到API
      try {
        await this.updateReputation(userId, type, amount);
      } catch (error) {
        console.error('无法通过API更新声誉，使用本地更新:', error);
        
        // 在实际项目中，应该将更新发送到服务器或加入重试队列
        console.log('用户声誉已本地更新:', {
          userId,
          type,
          amount,
          newScore,
          newLevel
        });
      }
      
      // 检查是否有等级变化
      if (reputation.level !== newLevel) {
        this.handleLevelChange(userId, reputation.level, newLevel);
      }
      
      // 发布声誉变更事件
      communicationService.publish(
        'reputationChanged',
        {
          userId,
          oldScore: reputation.currentScore,
          newScore,
          oldLevel: reputation.level,
          newLevel,
          change
        },
        'CommunityReputationService',
        'community'
      );
    } catch (error) {
      console.error('添加声誉变更失败:', error);
      throw error;
    }
  }
  
  /**
   * 确定声誉等级
   * @param score 声誉分数
   * @returns 声誉等级
   */
  private determineReputationLevel(score: number): ReputationLevel {
    if (score >= this.reputationThresholds[ReputationLevel.EXPERT]) {
      return ReputationLevel.EXPERT;
    } else if (score >= this.reputationThresholds[ReputationLevel.MENTOR]) {
      return ReputationLevel.MENTOR;
    } else if (score >= this.reputationThresholds[ReputationLevel.CONTRIBUTOR]) {
      return ReputationLevel.CONTRIBUTOR;
    } else if (score >= this.reputationThresholds[ReputationLevel.LEARNER]) {
      return ReputationLevel.LEARNER;
    } else {
      return ReputationLevel.NEWCOMER;
    }
  }
  
  /**
   * 确定用户特权
   * @param score 声誉分数
   * @returns 特权列表
   */
  private determinePrivileges(score: number): string[] {
    return this.privileges
      .filter(privilege => score >= privilege.requiredScore)
      .map(privilege => privilege.name);
  }
  
  /**
   * 处理等级变化
   * @param userId 用户ID
   * @param oldLevel 旧等级
   * @param newLevel 新等级
   */
  private handleLevelChange(
    userId: string,
    oldLevel: ReputationLevel,
    newLevel: ReputationLevel
  ): void {
    // 判断是升级还是降级
    const isUpgrade = 
      this.reputationThresholds[newLevel] > this.reputationThresholds[oldLevel];
    
    // 发布等级变化事件
    communicationService.publish(
      isUpgrade ? 'reputationLevelUp' : 'reputationLevelDown',
      {
        userId,
        oldLevel,
        newLevel,
        timestamp: new Date().toISOString()
      },
      'CommunityReputationService',
      'community'
    );
    
    console.log(`用户声誉等级${isUpgrade ? '提升' : '下降'}:`, {
      userId,
      oldLevel,
      newLevel
    });
  }
  
  /**
   * 获取用户特权
   * @param userId 用户ID
   * @returns 特权列表
   */
  public async getUserPrivileges(userId: string): Promise<string[]> {
    try {
      const reputation = await this.getUserReputation(userId);
      return reputation.privileges.map(privilege => privilege.name);
    } catch (error) {
      console.error('获取用户特权失败:', error);
      return [];
    }
  }
  
  /**
   * 检查用户是否有特定特权
   * @param userId 用户ID
   * @param privilegeName 特权名称
   * @returns 是否有特权
   */
  public async hasPrivilege(userId: string, privilegeName: string): Promise<boolean> {
    try {
      const privileges = await this.getUserPrivileges(userId);
      return privileges.includes(privilegeName);
    } catch (error) {
      console.error('检查用户特权失败:', error);
      return false;
    }
  }
  
  /**
   * 获取声誉变更记录
   * @param userId 用户ID
   * @param limit 限制条数
   * @returns 声誉变更记录
   */
  public async getReputationHistory(
    userId: string,
    limit: number = 20
  ): Promise<ReputationChange[]> {
    try {
      const reputation = await this.getUserReputation(userId);
      
      // 转换ReputationData中的recentChanges为ReputationChange格式
      const changes: ReputationChange[] = reputation.recentChanges.map(change => ({
        id: change.id,
        userId: userId,
        type: change.type,
        amount: change.amount,
        timestamp: change.date.toISOString(),
        details: {
          reason: change.description
        }
      }));
      
      return changes.slice(0, limit);
    } catch (error) {
      console.error('获取声誉历史失败:', error);
      return [];
    }
  }
  
  /**
   * 获取社区排行榜
   * @param limit 限制条数
   * @returns 排行榜数据
   */
  public async getLeaderboard(limit: number = 10): Promise<Array<{
    userId: string;
    username: string;
    score: number;
    level: ReputationLevel;
  }>> {
    try {
      // 在实际项目中，应该从API获取数据
      // 这里使用模拟数据
      return [
        { userId: 'user1', username: '学习达人', score: 1250, level: ReputationLevel.EXPERT },
        { userId: 'user2', username: '英语先锋', score: 980, level: ReputationLevel.MENTOR },
        { userId: 'user3', username: '知识分享者', score: 730, level: ReputationLevel.MENTOR },
        { userId: 'user4', username: '勤奋学习者', score: 520, level: ReputationLevel.MENTOR },
        { userId: 'user5', username: '热心助人', score: 450, level: ReputationLevel.CONTRIBUTOR },
        { userId: 'user6', username: '积极参与', score: 320, level: ReputationLevel.CONTRIBUTOR },
        { userId: 'user7', username: '新锐贡献者', score: 250, level: ReputationLevel.CONTRIBUTOR },
        { userId: 'user8', username: '进步学习者', score: 180, level: ReputationLevel.LEARNER },
        { userId: 'user9', username: '探索者', score: 120, level: ReputationLevel.LEARNER },
        { userId: 'user10', username: '新手上路', score: 60, level: ReputationLevel.LEARNER }
      ].slice(0, limit);
    } catch (error) {
      console.error('获取排行榜失败:', error);
      return [];
    }
  }
  
  /**
   * 模拟获取用户声誉数据
   * @param userId 用户ID
   * @returns 模拟的用户声誉数据
   */
  private async getMockUserReputation(userId: string): Promise<UserReputation> {
    // 这是模拟数据，实际应该从API获取
    const mockChanges: ReputationChange[] = [
      {
        id: 'change-1',
        userId,
        type: ReputationChangeType.POST_CREATED,
        amount: 5,
        timestamp: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
        details: {
          contentId: 'post-1',
          contentType: 'post'
        }
      },
      {
        id: 'change-2',
        userId,
        type: ReputationChangeType.POST_UPVOTED,
        amount: 10,
        timestamp: new Date(Date.now() - 3600000 * 24 * 4).toISOString(),
        details: {
          contentId: 'post-1',
          contentType: 'post'
        }
      },
      {
        id: 'change-3',
        userId,
        type: ReputationChangeType.COMMENT_CREATED,
        amount: 2,
        timestamp: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
        details: {
          contentId: 'comment-1',
          contentType: 'comment'
        }
      },
      {
        id: 'change-4',
        userId,
        type: ReputationChangeType.RESOURCE_SHARED,
        amount: 10,
        timestamp: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
        details: {
          contentId: 'resource-1',
          contentType: 'resource'
        }
      },
      {
        id: 'change-5',
        userId,
        type: ReputationChangeType.ANSWER_ACCEPTED,
        amount: 15,
        timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
        details: {
          contentId: 'answer-1',
          contentType: 'answer'
        }
      }
    ];
    
    // 计算总分
    const totalScore = mockChanges.reduce((sum, change) => sum + change.amount, 0);
    
    // 确定等级
    const level = this.determineReputationLevel(totalScore);
    
    // 确定特权
    const privileges = this.determinePrivileges(totalScore);
    
    return {
      userId,
      score: totalScore,
      level,
      changes: mockChanges,
      privileges,
      lastUpdated: new Date().toISOString()
    };
  }
  
  /**
   * 重置用户声誉
   * @param userId 用户ID
   * @param adminId 管理员ID
   * @param reason 原因
   */
  public async resetUserReputation(
    userId: string,
    adminId: string,
    reason: string
  ): Promise<void> {
    try {
      console.log('重置用户声誉:', {
        userId,
        adminId,
        reason
      });
      
      // 创建初始声誉数据
      const initialReputation: UserReputation = {
        userId,
        score: 0,
        level: ReputationLevel.NEWCOMER,
        changes: [{
          id: `reset-${Date.now()}`,
          userId,
          type: ReputationChangeType.VIOLATION_CONFIRMED,
          amount: 0,
          timestamp: new Date().toISOString(),
          details: {
            reason: `声誉重置：${reason}`
          }
        }],
        privileges: this.determinePrivileges(0),
        lastUpdated: new Date().toISOString()
      };
      
      // 更新缓存
      this.reputationCache.set(userId, initialReputation);
      
      // 在实际项目中，应该将更新发送到服务器
      
      // 发布声誉重置事件
      communicationService.publish(
        'reputationReset',
        {
          userId,
          adminId,
          reason,
          timestamp: new Date().toISOString()
        },
        'CommunityReputationService',
        'community'
      );
    } catch (error) {
      console.error('重置用户声誉失败:', error);
      throw error;
    }
  }

  /**
   * 获取声誉等级的中文名称
   * @param level 声誉等级
   * @returns 中文名称
   */
  public getLevelName(level: ReputationLevel): string {
    switch (level) {
      case ReputationLevel.NEWCOMER:
        return '新手';
      case ReputationLevel.LEARNER:
        return '学习者';
      case ReputationLevel.CONTRIBUTOR:
        return '贡献者';
      case ReputationLevel.MENTOR:
        return '导师';
      case ReputationLevel.EXPERT:
        return '专家';
      default:
        return '未知';
    }
  }
  
  /**
   * 获取声誉变更类型的中文名称
   * @param type 变更类型
   * @returns 中文名称
   */
  public getChangeTypeName(type: ReputationChangeType): string {
    switch (type) {
      case ReputationChangeType.POST_CREATED:
        return '创建帖子';
      case ReputationChangeType.POST_UPVOTED:
        return '帖子被赞';
      case ReputationChangeType.POST_DOWNVOTED:
        return '帖子被踩';
      case ReputationChangeType.COMMENT_CREATED:
        return '创建评论';
      case ReputationChangeType.COMMENT_UPVOTED:
        return '评论被赞';
      case ReputationChangeType.RESOURCE_SHARED:
        return '分享资源';
      case ReputationChangeType.QUESTION_ANSWERED:
        return '回答问题';
      case ReputationChangeType.ANSWER_ACCEPTED:
        return '回答被采纳';
      case ReputationChangeType.VIOLATION_CONFIRMED:
        return '违规确认';
      case ReputationChangeType.HELPFUL_FLAG:
        return '有用标记';
      case ReputationChangeType.ACHIEVEMENT_UNLOCKED:
        return '成就解锁';
      default:
        return '未知变更';
    }
  }
}

// 创建单例实例
const communityReputationService = new CommunityReputationService();

export default communityReputationService;

// React Hooks 封装
import { useState, useEffect } from 'react';

/**
 * 使用用户声誉的React Hook
 * @param userId 用户ID
 * @returns 用户声誉数据和加载状态
 */
export const useUserReputation = (userId: string) => {
  const [reputationData, setReputationData] = useState<ReputationData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }
    
    const fetchReputation = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await communityReputationService.getUserReputation(userId);
        setReputationData(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('获取声誉数据失败'));
        console.error('获取用户声誉失败:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchReputation();
    
    // 订阅声誉变更事件
    const unsubscribe = communicationService.subscribe(
      'reputationChanged',
      (payload) => {
        if (payload.data.userId === userId) {
          fetchReputation();
        }
      },
      'community'
    );
    
    return () => {
      unsubscribe();
    };
  }, [userId]);
  
  return { reputationData, isLoading, error };
};

/**
 * 使用声誉排行榜的React Hook
 * @param limit 限制条数
 * @returns 排行榜数据和加载状态
 */
export const useReputationLeaderboard = (limit: number = 10) => {
  const [leaderboardData, setLeaderboardData] = useState<Array<{
    userId: string;
    username: string;
    score: number;
    level: ReputationLevel;
  }> | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const fetchLeaderboard = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await communityReputationService.getLeaderboard(limit);
        setLeaderboardData(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('获取排行榜数据失败'));
        console.error('获取排行榜失败:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLeaderboard();
    
    // 定期刷新排行榜
    const intervalId = setInterval(fetchLeaderboard, 5 * 60 * 1000); // 5分钟刷新一次
    
    return () => {
      clearInterval(intervalId);
    };
  }, [limit]);
  
  return { leaderboardData, isLoading, error };
};