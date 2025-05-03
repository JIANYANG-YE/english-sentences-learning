'use client';

import { 
  LearningActivityType, 
  DifficultyLevel
} from '../types/learning';

// 用户学习配置文件
export interface LearnerProfile {
  userId: string;
  skillLevels: Record<LearningActivityType, number>; // 0-100，各项技能水平
  preferredDifficulty: DifficultyLevel; // 用户偏好的难度
  adaptiveMode: boolean; // 是否启用自适应模式
  learningSpeed: 'slow' | 'normal' | 'fast'; // 学习速度偏好
  recentPerformance: any[]; // 最近的表现记录
  strugglingAreas: string[]; // 困难领域标签
  strengthAreas: string[]; // 强项领域标签
}

// 适应性推荐结果
export interface AdjustmentRecommendation {
  newDifficulty: DifficultyLevel;
  reason: string;
  focus: string[];
  recommendedResources: string[];
  adjustmentMagnitude: 'slight' | 'moderate' | 'significant';
}

// 性能评估结果
interface PerformanceEvaluation {
  overallScore: number;
  readinessForNextLevel: boolean;
  weaknesses: string[];
  strengths: string[];
  improvementAreas: string[];
}

// 性能指标接口
export interface PerformanceMetrics {
  activityType: LearningActivityType;
  timestamp: number;
  accuracyRate: number;
  completionTime: number;
  expectedTime: number;
  mistakeCount: number;
  hintUsage: number;
  attemptCount: number;
}

// 学习路径建议
export interface LearningPathSuggestion {
  userId: string;
  currentActivityType: LearningActivityType;
  suggestedNextActivities: Array<{
    activityType: LearningActivityType;
    reason: string;
    priority: number;
  }>;
  recommendedDifficulty: DifficultyLevel;
  focusAreas: string[];
  estimatedTimeToMastery: number;
}

/**
 * 自适应学习服务
 * 负责分析用户学习行为，提供个性化学习建议和优化
 */
export class AdaptiveLearningService {
  // 用户配置缓存
  private profileCache: Record<string, LearnerProfile> = {};

  /**
   * 获取学习者配置，如果不存在则创建默认配置
   */
  getLearnerProfile(userId: string): LearnerProfile {
    if (!this.profileCache[userId]) {
      this.profileCache[userId] = {
        userId,
        skillLevels: {
          chineseToEnglish: 50,
          englishToChinese: 60,
          grammar: 45,
          listening: 55,
          vocabulary: 40,
          speaking: 30,
          reading: 65,
          writing: 35
        },
        preferredDifficulty: 'intermediate',
        adaptiveMode: true,
        learningSpeed: 'normal',
        recentPerformance: [],
        strugglingAreas: ['语法应用', '口语流利度'],
        strengthAreas: ['词汇理解', '阅读理解']
      };
    }
    return this.profileCache[userId];
  }
  
  /**
   * 更新技能等级
   * 基于用户的表现指标调整技能水平
   */
  updateSkillLevel(
    userId: string, 
    activityType: LearningActivityType, 
    performance: PerformanceMetrics
  ): number {
    const profile = this.getLearnerProfile(userId);
    
    // 根据表现计算新的技能等级
    const currentLevel = profile.skillLevels[activityType];
    const accuracyFactor = performance.accuracyRate / 100;
    const timeFactor = Math.min(
      1, 
      performance.expectedTime / Math.max(1, performance.completionTime)
    );
    const mistakeFactor = Math.max(0, 1 - (performance.mistakeCount * 0.1));
    const hintPenalty = Math.max(0, 1 - (performance.hintUsage * 0.05));
    
    // 计算调整值 (-5 到 +10)
    let adjustment = 0;
    
    // 高准确率给予奖励
    if (performance.accuracyRate >= 90) {
      adjustment += 3;
    } else if (performance.accuracyRate >= 75) {
      adjustment += 1.5;
    } else if (performance.accuracyRate < 60) {
      adjustment -= 1;
    }
    
    // 速度快于预期给予奖励
    if (timeFactor > 1.2) {
      adjustment += 2;
    } else if (timeFactor > 1) {
      adjustment += 1;
    } else if (timeFactor < 0.7) {
      adjustment -= 0.5;
    }
    
    // 错误少给予奖励
    if (mistakeFactor > 0.9) {
      adjustment += 1;
    } else if (mistakeFactor < 0.6) {
      adjustment -= 1;
    }
    
    // 使用提示过多给予惩罚
    if (hintPenalty < 0.8) {
      adjustment -= 1;
    }
    
    // 多次尝试给予惩罚
    if (performance.attemptCount > 2) {
      adjustment -= 0.5 * (performance.attemptCount - 1);
    }
    
    // 应用学习速度偏好影响
    switch (profile.learningSpeed) {
      case 'fast':
        adjustment *= 1.2;
        break;
      case 'slow':
        adjustment *= 0.8;
        break;
      default:
        // 正常速度不调整
        break;
    }
    
    // 计算新的技能等级 (限制在 0-100 范围内)
    const newLevel = Math.max(0, Math.min(100, currentLevel + adjustment));
    
    // 更新用户配置
    profile.skillLevels[activityType] = newLevel;
    profile.recentPerformance.push(performance);
    
    // 只保留最近20条记录
    if (profile.recentPerformance.length > 20) {
      profile.recentPerformance = profile.recentPerformance.slice(-20);
    }
    
    this.profileCache[userId] = profile;
    
    return newLevel;
  }
  
  /**
   * 评估用户表现
   * 分析用户在特定活动类型中的表现
   */
  evaluatePerformance(userId: string, activityType: LearningActivityType): PerformanceEvaluation {
    const profile = this.getLearnerProfile(userId);
    
    // 获取最近相关活动的表现
    const relevantPerformance = profile.recentPerformance
      .filter(p => p.activityType === activityType)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 5);
    
    if (relevantPerformance.length === 0) {
      return {
        overallScore: 0,
        readinessForNextLevel: false,
        weaknesses: [],
        strengths: [],
        improvementAreas: []
      };
    }
    
    // 计算整体得分
    const overallScore = relevantPerformance.reduce((sum, p) => sum + p.accuracyRate, 0) / relevantPerformance.length;
    
    // 分析强项和弱项
    const accuracies = relevantPerformance.map(p => p.accuracyRate);
    const avgAccuracy = accuracies.reduce((sum, a) => sum + a, 0) / accuracies.length;
    const readinessForNextLevel = avgAccuracy > 85 && relevantPerformance.length >= 3;
    
    // 分析弱项
    const weaknesses = [];
    const strengths = [];
    
    if (avgAccuracy < 70) weaknesses.push('准确性');
    else strengths.push('准确性');
    
    const avgTimeRatio = relevantPerformance.reduce(
      (sum, p) => sum + (p.completionTime / p.expectedTime), 
      0
    ) / relevantPerformance.length;
    
    if (avgTimeRatio > 1.2) weaknesses.push('反应速度');
    else if (avgTimeRatio < 0.9) strengths.push('反应速度');
    
    const avgHintUsage = relevantPerformance.reduce((sum, p) => sum + p.hintUsage, 0) / relevantPerformance.length;
    if (avgHintUsage > 2) weaknesses.push('独立解决能力');
    else strengths.push('独立思考');
    
    // 生成改进领域
    const improvementAreas = [...weaknesses];
    if (activityType === 'grammar' && profile.skillLevels.grammar < 60) {
      improvementAreas.push('基础语法结构');
    }
    if (activityType === 'listening' && profile.skillLevels.listening < 50) {
      improvementAreas.push('听音辨义能力');
    }
    
    return {
      overallScore,
      readinessForNextLevel,
      weaknesses,
      strengths,
      improvementAreas
    };
  }
  
  /**
   * 推荐下一个内容的难度级别
   * 基于用户的技能水平和最近表现提供建议
   */
  recommendContentDifficulty(
    userId: string, 
    activityType: LearningActivityType
  ): AdjustmentRecommendation {
    const profile = this.getLearnerProfile(userId);
    const evaluation = this.evaluatePerformance(userId, activityType);
    const currentSkillLevel = profile.skillLevels[activityType];
    
    // 默认保持当前难度
    let newDifficulty = profile.preferredDifficulty;
    let reason = '保持当前难度水平以巩固知识';
    let adjustmentMagnitude: 'slight' | 'moderate' | 'significant' = 'slight';
    
    // 根据技能水平和表现评估调整难度
    if (evaluation.readinessForNextLevel && currentSkillLevel > 75) {
      // 技能水平高且表现良好，增加难度
      newDifficulty = currentSkillLevel > 90 ? 'expert' : 'advanced';
      reason = '你在当前难度下表现出色，可以尝试更具挑战性的内容';
      adjustmentMagnitude = 'moderate';
    } else if (evaluation.weaknesses.length > evaluation.strengths.length && currentSkillLevel < 50) {
      // 弱点多且技能水平低，降低难度
      newDifficulty = currentSkillLevel < 30 ? 'beginner' : 'intermediate';
      reason = '降低难度以帮助你建立信心和掌握基本概念';
      adjustmentMagnitude = 'moderate';
    } else if (evaluation.overallScore < 60) {
      // 整体得分低，稍微降低难度
      newDifficulty = 'beginner';
      reason = '稍微降低难度以提高理解和掌握程度';
      adjustmentMagnitude = 'slight';
    } else if (evaluation.overallScore > 90 && profile.preferredDifficulty !== 'expert') {
      // 整体得分高且不在最高难度，提高难度
      newDifficulty = profile.preferredDifficulty === 'advanced' ? 'expert' : 
                       profile.preferredDifficulty === 'intermediate' ? 'advanced' : 'intermediate';
      reason = '你已经很好地掌握了当前难度的内容，准备接受更大的挑战';
      adjustmentMagnitude = 'significant';
    }
    
    // 如果用户不想使用自适应模式，尊重其选择
    if (!profile.adaptiveMode) {
      newDifficulty = profile.preferredDifficulty;
      reason = '按照你的偏好设置保持难度';
      adjustmentMagnitude = 'slight';
    }
    
    // 准备焦点建议
    const focus = [...evaluation.improvementAreas];
    if (focus.length === 0) {
      // 如果没有特定的改进领域，提供一般建议
      if (currentSkillLevel < 30) {
        focus.push('基础词汇', '简单语法结构');
      } else if (currentSkillLevel < 60) {
        focus.push('扩展词汇量', '复杂语法结构的应用');
      } else {
        focus.push('高级表达方式', '地道表达', '文化理解');
      }
    }
    
    // 根据难度和技能推荐资源
    const recommendedResources: string[] = [];
    if (currentSkillLevel < 40) {
      recommendedResources.push('基础语法指南', '常用词汇列表');
    } else if (currentSkillLevel < 70) {
      recommendedResources.push('中级语法练习', '情景对话练习');
    } else {
      recommendedResources.push('高级写作技巧', '地道表达详解');
    }
    
    return {
      newDifficulty,
      reason,
      focus,
      recommendedResources,
      adjustmentMagnitude
    };
  }
  
  /**
   * 生成学习路径建议
   * 基于用户的技能分布和学习偏好推荐下一步学习内容
   */
  generateLearningPathSuggestion(userId: string): LearningPathSuggestion {
    const profile = this.getLearnerProfile(userId);
    
    // 找出技能最弱的领域
    const skillEntries = Object.entries(profile.skillLevels) as [LearningActivityType, number][];
    skillEntries.sort(([, a], [, b]) => a - b);
    
    const weakestSkill = skillEntries[0][0];
    const weakestSkillLevel = skillEntries[0][1];
    
    // 准备建议的活动
    const suggestedNextActivities: Array<{
      activityType: LearningActivityType;
      reason: string;
      priority: number;
    }> = [];
    
    // 首先推荐最弱的技能
    suggestedNextActivities.push({
      activityType: weakestSkill,
      reason: '这是你当前最需要提高的技能领域',
      priority: 10
    });
    
    // 如果最弱技能是语法，推荐相关的语法练习和中译英
    if (weakestSkill === 'grammar') {
      suggestedNextActivities.push({
        activityType: 'chineseToEnglish',
        reason: '通过中译英练习巩固语法知识',
        priority: 8
      });
    }
    
    // 如果最弱技能是听力，推荐听力练习和英译中
    if (weakestSkill === 'listening') {
      suggestedNextActivities.push({
        activityType: 'englishToChinese',
        reason: '提高听力理解能力',
        priority: 8
      });
    }
    
    // 查找近期表现良好的活动
    const recentGoodPerformance = profile.recentPerformance
      .filter(p => p.accuracyRate > 85)
      .map(p => p.activityType);
    
    // 从近期表现良好的活动中选择一个作为调剂
    if (recentGoodPerformance.length > 0) {
      const goodActivityType = recentGoodPerformance[0];
      suggestedNextActivities.push({
        activityType: goodActivityType,
        reason: '保持这项技能的练习，巩固已有成果',
        priority: 5
      });
    }
    
    // 根据弱项确定推荐难度
    let recommendedDifficulty: DifficultyLevel;
    if (weakestSkillLevel < 30) {
      recommendedDifficulty = 'beginner';
    } else if (weakestSkillLevel < 60) {
      recommendedDifficulty = 'intermediate';
    } else {
      recommendedDifficulty = 'advanced';
    }
    
    // 获取重点领域
    const focusAreas = [...profile.strugglingAreas];
    
    // 估算掌握时间（基于当前水平）
    const estimatedTimeToMastery = Math.max(30, 120 - weakestSkillLevel);
    
    return {
      userId,
      currentActivityType: weakestSkill,
      suggestedNextActivities,
      recommendedDifficulty,
      focusAreas,
      estimatedTimeToMastery
    };
  }
  
  /**
   * 根据内容难度和用户偏好设置更新用户学习配置
   */
  updateUserPreferences(
    userId: string, 
    preferences: {
      preferredDifficulty?: DifficultyLevel;
      adaptiveMode?: boolean;
      learningSpeed?: 'slow' | 'normal' | 'fast';
    }
  ): LearnerProfile {
    const profile = this.getLearnerProfile(userId);
    
    // 更新用户偏好
    if (preferences.preferredDifficulty !== undefined) {
      profile.preferredDifficulty = preferences.preferredDifficulty;
    }
    
    if (preferences.adaptiveMode !== undefined) {
      profile.adaptiveMode = preferences.adaptiveMode;
    }
    
    if (preferences.learningSpeed !== undefined) {
      profile.learningSpeed = preferences.learningSpeed;
    }
    
    // 保存到缓存
    this.profileCache[userId] = profile;
    
    return profile;
  }
} 