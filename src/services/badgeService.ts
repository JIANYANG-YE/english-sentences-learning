import { v4 as uuidv4 } from 'uuid';
import apiService from './apiService';
import communicationService from './componentCommunication';
import stateManager from './stateManagementService';

// 常量定义
const API_ENDPOINT = '/api/users/badges';
const EVENTS_KEY = 'badgeEvents';
const STATE_KEY = 'userBadges';

// 徽章稀有度枚举
export enum BadgeRarity {
  COMMON = 'common',          // 普通
  UNCOMMON = 'uncommon',      // 不常见
  RARE = 'rare',              // 稀有
  EPIC = 'epic',              // 史诗
  LEGENDARY = 'legendary'     // 传奇
}

// 徽章类型枚举
export enum BadgeType {
  ACHIEVEMENT = 'achievement',  // 成就
  ACTIVITY = 'activity',        // 活动
  STREAK = 'streak',           // 连续学习
  COMMUNITY = 'community',     // 社区贡献
  MILESTONE = 'milestone',     // 里程碑
  SPECIAL = 'special'          // 特殊徽章
}

// 徽章进度接口
export interface BadgeProgress {
  currentValue: number;
  targetValue: number;
  percentage: number;
  remainingValue: number;
  lastUpdated: string;
}

// 徽章接口定义
export interface Badge {
  id: string;
  name: string;
  description: string;
  type: BadgeType;
  rarity: BadgeRarity;
  imageUrl: string;
  criteria: string;
  points: number;
  unlockedAt: Date | null;
  unlockedBy?: string;
  isHidden?: boolean;
  progress?: BadgeProgress;
  maxProgress?: number;
}

// 用户徽章集合接口
export interface UserBadgeCollection {
  userId: string;
  badges: Badge[];
  featuredBadges: string[]; // 用户选择展示的徽章ID
  lastUpdated: string;
  totalCount: number;
  stats: {
    byRarity: Record<BadgeRarity, number>;
    byType: Record<BadgeType, number>;
  };
}

// 徽章解锁事件数据
export interface BadgeUnlockEvent {
  userId: string;
  badgeId: string;
  badge: Badge;
  unlockedAt: string;
}

/**
 * 徽章服务
 * 负责管理用户徽章、检查解锁条件、授予徽章等功能
 */
class BadgeService {
  private static instance: BadgeService;
  private apiUrl = '/api/users/badges';
  private badgeCache: Map<string, Badge[]> = new Map();
  private userCollectionCache: Map<string, UserBadgeCollection> = new Map();
  
  // 单例模式
  public static getInstance(): BadgeService {
    if (!BadgeService.instance) {
      BadgeService.instance = new BadgeService();
    }
    return BadgeService.instance;
  }
  
  // 徽章颜色映射
  private rarityColorMap = {
    [BadgeRarity.COMMON]: '#8e8e8e',     // 灰色
    [BadgeRarity.UNCOMMON]: '#8e8e8e',   // 不常见
    [BadgeRarity.RARE]: '#1976d2',       // 蓝色
    [BadgeRarity.EPIC]: '#9c27b0',       // 紫色
    [BadgeRarity.LEGENDARY]: '#f57c00'   // 橙色
  };
  
  // 徽章边框样式映射
  private rarityBorderMap = {
    [BadgeRarity.COMMON]: '1px solid #8e8e8e',
    [BadgeRarity.UNCOMMON]: '1px solid #8e8e8e',
    [BadgeRarity.RARE]: '2px solid #1976d2',
    [BadgeRarity.EPIC]: '2px solid #9c27b0',
    [BadgeRarity.LEGENDARY]: '3px solid #f57c00'
  };
  
  constructor() {
    this.initialize();
    this.setupEventListeners();
  }
  
  /**
   * 初始化服务
   */
  private async initialize() {
    try {
      // 预加载常用徽章数据
      await this.getAllBadges();
      
      console.log('徽章服务初始化完成');
    } catch (error) {
      console.error('徽章服务初始化失败:', error);
    }
  }
  
  /**
   * 设置事件监听
   */
  private setupEventListeners() {
    // 监听学习进度变化事件，检查徽章解锁条件
    communicationService.subscribe('learningProgressUpdated', this.checkProgressBasedBadges.bind(this), 'learning');
    
    // 监听连续学习天数变化
    communicationService.subscribe('streakUpdated', this.checkStreakBadges.bind(this), 'learning');
    
    // 监听技能水平变化
    communicationService.subscribe('skillLevelUpdated', this.checkSkillBadges.bind(this), 'learning');
    
    // 监听挑战完成事件
    communicationService.subscribe('challengeCompleted', this.checkChallengeBadges.bind(this), 'learning');
    
    // 监听社区贡献事件
    communicationService.subscribe('communityContribution', this.checkCommunityBadges.bind(this), 'community');
  }
  
  /**
   * 获取所有可用徽章
   * @returns 徽章列表
   */
  public async getAllBadges(): Promise<Badge[]> {
    try {
      // 从API获取所有徽章定义
      const response = await apiService.get<Badge[]>(this.apiUrl + '/available');
      
      // 更新缓存
      this.badgeCache.set('all', response.data);
      
      return response.data;
    } catch (error) {
      console.error('获取徽章列表失败:', error);
      
      // 如果API调用失败，返回缓存数据或空数组
      return this.badgeCache.get('all') || [];
    }
  }
  
  /**
   * 获取用户徽章集合
   * @param userId 用户ID
   * @returns 用户徽章集合
   */
  public async getUserBadges(userId: string): Promise<UserBadgeCollection> {
    try {
      // 从API获取用户徽章数据
      const response = await apiService.get<UserBadgeCollection>(`${this.apiUrl}/users/${userId}`);
      
      // 更新缓存
      this.userCollectionCache.set(userId, response.data);
      
      return response.data;
    } catch (error) {
      console.error(`获取用户(${userId})徽章失败:`, error);
      
      // 如果API调用失败，返回缓存数据或创建默认集合
      return this.userCollectionCache.get(userId) || this.createDefaultCollection(userId);
    }
  }
  
  /**
   * 创建默认的用户徽章集合
   * @param userId 用户ID
   * @returns 默认徽章集合
   */
  private createDefaultCollection(userId: string): UserBadgeCollection {
    return {
      userId,
      badges: [],
      featuredBadges: [],
      lastUpdated: new Date().toISOString(),
      totalCount: 0,
      stats: {
        byRarity: {
          [BadgeRarity.COMMON]: 0,
          [BadgeRarity.UNCOMMON]: 0,
          [BadgeRarity.RARE]: 0,
          [BadgeRarity.EPIC]: 0,
          [BadgeRarity.LEGENDARY]: 0
        },
        byType: {
          [BadgeType.ACHIEVEMENT]: 0,
          [BadgeType.ACTIVITY]: 0,
          [BadgeType.STREAK]: 0,
          [BadgeType.COMMUNITY]: 0,
          [BadgeType.MILESTONE]: 0,
          [BadgeType.SPECIAL]: 0
        }
      }
    };
  }
  
  /**
   * 授予用户徽章
   * @param userId 用户ID
   * @param badgeId 徽章ID
   * @returns 成功或失败
   */
  public async awardBadge(userId: string, badgeId: string): Promise<boolean> {
    try {
      // 获取徽章详情
      const allBadges = await this.getAllBadges();
      const badge = allBadges.find(b => b.id === badgeId);
      
      if (!badge) {
        console.error(`徽章ID(${badgeId})不存在`);
        return false;
      }
      
      // 获取用户当前徽章集合
      const userCollection = await this.getUserBadges(userId);
      
      // 检查是否已拥有该徽章
      if (userCollection.badges.some(b => b.id === badgeId)) {
        console.log(`用户(${userId})已拥有徽章(${badgeId})`);
        return true;
      }
      
      // 添加解锁时间
      const badgeWithUnlockTime: Badge = {
        ...badge,
        unlockedAt: new Date()
      };
      
      // 更新用户徽章集合
      userCollection.badges.push(badgeWithUnlockTime);
      userCollection.totalCount = userCollection.badges.length;
      userCollection.lastUpdated = new Date().toISOString();
      
      // 更新统计数据
      userCollection.stats.byRarity[badge.rarity]++;
      userCollection.stats.byType[badge.type]++;
      
      // 调用API保存更新
      await apiService.post(`${this.apiUrl}/users/${userId}/award`, {
        badgeId
      });
      
      // 更新缓存
      this.userCollectionCache.set(userId, userCollection);
      
      // 发布徽章解锁事件
      this.publishBadgeUnlockEvent(userId, badgeWithUnlockTime);
      
      return true;
    } catch (error) {
      console.error(`授予用户(${userId})徽章(${badgeId})失败:`, error);
      return false;
    }
  }
  
  /**
   * 发布徽章解锁事件
   * @param userId 用户ID
   * @param badge 解锁的徽章
   */
  private publishBadgeUnlockEvent(userId: string, badge: Badge) {
    const event: BadgeUnlockEvent = {
      userId,
      badgeId: badge.id,
      badge,
      unlockedAt: new Date().toISOString()
    };
    
    // 发布事件通知
    communicationService.publish('badgeUnlocked', event, 'badge');
    
    // 触发显示通知的事件
    communicationService.publish('showNotification', {
      type: 'achievement',
      title: '获得新徽章!',
      message: `恭喜解锁「${badge.name}」徽章`,
      data: badge
    }, 'notification');
  }
  
  /**
   * 设置精选徽章
   * @param userId 用户ID
   * @param badgeIds 要精选的徽章ID数组
   * @returns 成功或失败
   */
  public async setFeaturedBadges(userId: string, badgeIds: string[]): Promise<boolean> {
    try {
      // 获取用户徽章集合
      const userCollection = await this.getUserBadges(userId);
      
      // 验证这些徽章用户都拥有
      const validBadgeIds = badgeIds.filter(id => 
        userCollection.badges.some(b => b.id === id)
      );
      
      // 更新精选徽章
      userCollection.featuredBadges = validBadgeIds;
      userCollection.lastUpdated = new Date().toISOString();
      
      // 调用API保存更新
      await apiService.post(`${this.apiUrl}/users/${userId}/featured`, {
        featuredBadges: validBadgeIds
      });
      
      // 更新缓存
      this.userCollectionCache.set(userId, userCollection);
      
      return true;
    } catch (error) {
      console.error(`设置用户(${userId})精选徽章失败:`, error);
      return false;
    }
  }
  
  /**
   * 检查与学习进度相关的徽章
   * @param data 学习进度事件数据
   */
  private async checkProgressBasedBadges(data: any) {
    const { userId, progress } = data.data;
    if (!userId || !progress) return;
    
    // 获取所有可用徽章
    const allBadges = await this.getAllBadges();
    const milestoneBadges = allBadges.filter(b => b.type === BadgeType.MILESTONE);
    
    // 遍历里程碑徽章，检查是否达成条件
    for (const badge of milestoneBadges) {
      if (badge.criteria === 'sentences_learned' && 
          progress.sentencesLearned >= badge.points) {
        await this.awardBadge(userId, badge.id);
      } else if (badge.criteria === 'words_learned' && 
                progress.wordsLearned >= badge.points) {
        await this.awardBadge(userId, badge.id);
      } else if (badge.criteria === 'learning_hours' && 
                progress.totalHours >= badge.points) {
        await this.awardBadge(userId, badge.id);
      }
    }
  }
  
  /**
   * 检查与连续学习相关的徽章
   * @param data 连续学习事件数据
   */
  private async checkStreakBadges(data: any) {
    const { userId, streakDays } = data.data;
    if (!userId || !streakDays) return;
    
    // 获取所有可用徽章
    const allBadges = await this.getAllBadges();
    const streakBadges = allBadges.filter(b => b.type === BadgeType.STREAK);
    
    // 遍历连续学习徽章，检查是否达成条件
    for (const badge of streakBadges) {
      if (badge.criteria === 'streak_days' && 
          streakDays >= badge.points) {
        await this.awardBadge(userId, badge.id);
      }
    }
  }
  
  /**
   * 检查与技能掌握相关的徽章
   * @param data 技能水平事件数据
   */
  private async checkSkillBadges(data: any) {
    const { userId, skillType, skillLevel } = data.data;
    if (!userId || !skillType || skillLevel === undefined) return;
    
    // 获取所有可用徽章
    const allBadges = await this.getAllBadges();
    const skillBadges = allBadges.filter(b => b.type === BadgeType.SPECIAL);
    
    // 遍历技能徽章，检查是否达成条件
    for (const badge of skillBadges) {
      if (badge.criteria === `skill_${skillType}` && 
          skillLevel >= badge.points) {
        await this.awardBadge(userId, badge.id);
      }
    }
  }
  
  /**
   * 检查与挑战完成相关的徽章
   * @param data 挑战完成事件数据
   */
  private async checkChallengeBadges(data: any) {
    const { userId, challengeId, performance } = data.data;
    if (!userId || !challengeId || !performance) return;
    
    // 获取所有可用徽章
    const allBadges = await this.getAllBadges();
    const challengeBadges = allBadges.filter(b => b.type === BadgeType.ACTIVITY);
    
    // 遍历挑战徽章，检查是否达成条件
    for (const badge of challengeBadges) {
      if (badge.criteria === 'challenge' && 
          badge.criteria.toString() === challengeId) {
        // 检查是否达到挑战的性能要求（如时间、正确率等）
        if (this.checkChallengePerformance(badge, performance)) {
          await this.awardBadge(userId, badge.id);
        }
      }
    }
  }
  
  /**
   * 检查挑战表现是否满足徽章要求
   * @param badge 徽章对象
   * @param performance 表现数据
   * @returns 是否满足要求
   */
  private checkChallengePerformance(badge: Badge, performance: any): boolean {
    // 根据徽章的具体要求检查表现
    // 这里是简化实现，实际应用中需要根据挑战类型和徽章要求进行详细判断
    return true;
  }
  
  /**
   * 检查与社区贡献相关的徽章
   * @param data 社区贡献事件数据
   */
  private async checkCommunityBadges(data: any) {
    const { userId, contributionType, contributionValue } = data.data;
    if (!userId || !contributionType) return;
    
    // 获取所有可用徽章
    const allBadges = await this.getAllBadges();
    const communityBadges = allBadges.filter(b => b.type === BadgeType.COMMUNITY);
    
    // 遍历社区徽章，检查是否达成条件
    for (const badge of communityBadges) {
      if (badge.criteria === contributionType && 
          contributionValue >= badge.points) {
        await this.awardBadge(userId, badge.id);
      }
    }
  }
  
  /**
   * 获取徽章稀有度颜色
   * @param rarity 稀有度
   * @returns 颜色代码
   */
  public getRarityColor(rarity: BadgeRarity): string {
    return this.rarityColorMap[rarity] || '#888888';
  }
  
  /**
   * 获取徽章稀有度边框
   * @param rarity 稀有度
   * @returns 边框CSS
   */
  public getRarityBorder(rarity: BadgeRarity): string {
    return this.rarityBorderMap[rarity] || '1px solid #888888';
  }
  
  /**
   * 获取徽章稀有度名称
   * @param rarity 稀有度枚举值
   * @returns 中文名称
   */
  public getRarityName(rarity: BadgeRarity): string {
    const rarityNames = {
      [BadgeRarity.COMMON]: '普通',
      [BadgeRarity.UNCOMMON]: '不常见',
      [BadgeRarity.RARE]: '稀有',
      [BadgeRarity.EPIC]: '史诗',
      [BadgeRarity.LEGENDARY]: '传奇'
    };
    return rarityNames[rarity] || '未知稀有度';
  }
  
  /**
   * 获取徽章类型名称
   * @param type 类型枚举值
   * @returns 中文名称
   */
  public getTypeName(type: BadgeType): string {
    const typeNames = {
      [BadgeType.ACHIEVEMENT]: '成就',
      [BadgeType.ACTIVITY]: '活动',
      [BadgeType.STREAK]: '连续学习',
      [BadgeType.COMMUNITY]: '社区贡献',
      [BadgeType.MILESTONE]: '里程碑',
      [BadgeType.SPECIAL]: '特殊徽章'
    };
    return typeNames[type] || '未知类型';
  }
  
  // 解锁徽章
  public async unlockBadge(userId: string, badgeId: string): Promise<Badge> {
    try {
      const response = await fetch(`${this.apiUrl}/users/${userId}/badges/${badgeId}/unlock`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('解锁徽章失败');
      }
      return await response.json();
    } catch (error) {
      console.error('解锁徽章失败:', error);
      throw error;
    }
  }
  
  /**
   * 更新徽章进度
   * @param userId 用户ID
   * @param badgeId 徽章ID
   * @param currentValue 当前值
   * @returns 更新后的徽章进度
   */
  public async updateBadgeProgress(
    userId: string,
    badgeId: string,
    currentValue: number
  ): Promise<BadgeProgress> {
    try {
      const badge = await this.getBadgeById(badgeId);
      if (!badge) {
        throw new Error('徽章不存在');
      }

      const targetValue = badge.points;
      const percentage = Math.min((currentValue / targetValue) * 100, 100);
      const remainingValue = Math.max(targetValue - currentValue, 0);

      const progress: BadgeProgress = {
        currentValue,
        targetValue,
        percentage,
        remainingValue,
        lastUpdated: new Date().toISOString()
      };

      // 调用API更新进度
      await apiService.put(`${this.apiUrl}/users/${userId}/badges/${badgeId}/progress`, {
        progress
      });

      // 检查是否达到解锁条件
      if (currentValue >= targetValue) {
        await this.awardBadge(userId, badgeId);
      }

      // 更新缓存
      const userCollection = await this.getUserBadges(userId);
      const badgeIndex = userCollection.badges.findIndex(b => b.id === badgeId);
      if (badgeIndex !== -1) {
        userCollection.badges[badgeIndex].progress = progress;
        this.userCollectionCache.set(userId, userCollection);
      }

      return progress;
    } catch (error) {
      console.error(`更新徽章(${badgeId})进度失败:`, error);
      throw error;
    }
  }

  /**
   * 获取徽章详情
   * @param badgeId 徽章ID
   * @returns 徽章对象
   */
  private async getBadgeById(badgeId: string): Promise<Badge | undefined> {
    const allBadges = await this.getAllBadges();
    return allBadges.find(b => b.id === badgeId);
  }

  /**
   * 获取徽章进度
   * @param userId 用户ID
   * @param badgeId 徽章ID
   * @returns 徽章进度
   */
  public async getBadgeProgress(userId: string, badgeId: string): Promise<BadgeProgress | null> {
    try {
      const userCollection = await this.getUserBadges(userId);
      const badge = userCollection.badges.find(b => b.id === badgeId);
      return badge?.progress || null;
    } catch (error) {
      console.error(`获取徽章(${badgeId})进度失败:`, error);
      return null;
    }
  }

  /**
   * 批量更新徽章进度
   * @param userId 用户ID
   * @param updates 进度更新数组
   */
  public async batchUpdateProgress(
    userId: string,
    updates: Array<{ badgeId: string; currentValue: number }>
  ): Promise<void> {
    try {
      const promises = updates.map(update =>
        this.updateBadgeProgress(userId, update.badgeId, update.currentValue)
      );
      await Promise.all(promises);
    } catch (error) {
      console.error('批量更新徽章进度失败:', error);
      throw error;
    }
  }
}

// 导出单例实例
export const badgeService = BadgeService.getInstance(); 