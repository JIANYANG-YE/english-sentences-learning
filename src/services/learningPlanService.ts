import { get, post, put, del } from '@/lib/api';

/**
 * 学习计划接口
 */
export interface LearningPlan {
  id: string;
  userId: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  dailyGoal: {
    minutes: number;
    words: number;
    sentences: number;
  };
  weeklySchedule: {
    [key in 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday']?: {
      active: boolean;
      focusAreas?: ('vocabulary' | 'grammar' | 'listening' | 'speaking' | 'reading')[];
      timeSlots?: { start: string; end: string }[];
    };
  };
  courses: {
    courseId: string;
    priority: number;
    progress: number;
    estimatedCompletionDate?: string;
  }[];
  adaptiveSettings: {
    adjustBasedOnPerformance: boolean;
    prioritizeDifficultContent: boolean;
    spacedRepetitionEnabled: boolean;
    reminderFrequency: 'none' | 'daily' | 'weekly';
  };
  createdAt: string;
  updatedAt: string;
}

/**
 * 每日学习安排
 */
export interface DailySchedule {
  date: string;
  available: boolean;
  totalMinutes: number;
  sessions: {
    startTime: string;
    endTime: string;
    duration: number;
    courseId?: string;
    lessonId?: string;
    focusArea: string;
    completed: boolean;
  }[];
  stats: {
    wordsLearned: number;
    sentencesReviewed: number;
    minutesSpent: number;
    completionRate: number;
  };
}

/**
 * 学习计划服务
 * 提供学习计划的创建、管理和优化功能
 */
class LearningPlanService {
  /**
   * 获取用户的所有学习计划
   * @param userId 用户ID
   */
  async getUserPlans(userId: string): Promise<LearningPlan[]> {
    try {
      return await get<LearningPlan[]>(`/api/learning-plans?userId=${userId}`);
    } catch (error) {
      console.error('获取学习计划失败:', error);
      throw new Error(`获取学习计划失败: ${(error as Error).message}`);
    }
  }

  /**
   * 获取特定学习计划
   * @param planId 学习计划ID
   */
  async getPlan(planId: string): Promise<LearningPlan> {
    try {
      return await get<LearningPlan>(`/api/learning-plans/${planId}`);
    } catch (error) {
      console.error('获取学习计划失败:', error);
      throw new Error(`获取学习计划失败: ${(error as Error).message}`);
    }
  }

  /**
   * 创建新学习计划
   * @param plan 学习计划数据
   */
  async createPlan(plan: Omit<LearningPlan, 'id' | 'createdAt' | 'updatedAt'>): Promise<LearningPlan> {
    try {
      return await post<LearningPlan>('/api/learning-plans', plan);
    } catch (error) {
      console.error('创建学习计划失败:', error);
      throw new Error(`创建学习计划失败: ${(error as Error).message}`);
    }
  }

  /**
   * 更新学习计划
   * @param planId 学习计划ID
   * @param plan 更新的计划数据
   */
  async updatePlan(planId: string, plan: Partial<LearningPlan>): Promise<LearningPlan> {
    try {
      return await put<LearningPlan>(`/api/learning-plans/${planId}`, plan);
    } catch (error) {
      console.error('更新学习计划失败:', error);
      throw new Error(`更新学习计划失败: ${(error as Error).message}`);
    }
  }

  /**
   * 删除学习计划
   * @param planId 学习计划ID
   */
  async deletePlan(planId: string): Promise<void> {
    try {
      await del(`/api/learning-plans/${planId}`);
    } catch (error) {
      console.error('删除学习计划失败:', error);
      throw new Error(`删除学习计划失败: ${(error as Error).message}`);
    }
  }

  /**
   * 获取特定日期的学习安排
   * @param planId 学习计划ID
   * @param date 日期
   */
  async getDailySchedule(planId: string, date: string): Promise<DailySchedule> {
    try {
      return await get<DailySchedule>(`/api/learning-plans/${planId}/schedule?date=${date}`);
    } catch (error) {
      console.error('获取每日安排失败:', error);
      throw new Error(`获取每日安排失败: ${(error as Error).message}`);
    }
  }

  /**
   * 获取一周的学习安排
   * @param planId 学习计划ID
   * @param startDate 开始日期
   */
  async getWeeklySchedule(planId: string, startDate: string): Promise<DailySchedule[]> {
    try {
      return await get<DailySchedule[]>(
        `/api/learning-plans/${planId}/schedule/weekly?startDate=${startDate}`
      );
    } catch (error) {
      console.error('获取每周安排失败:', error);
      throw new Error(`获取每周安排失败: ${(error as Error).message}`);
    }
  }

  /**
   * 更新学习会话状态
   * @param planId 学习计划ID
   * @param date 日期
   * @param sessionIndex 会话索引
   * @param completed 是否完成
   */
  async updateSessionStatus(
    planId: string,
    date: string,
    sessionIndex: number,
    completed: boolean
  ): Promise<DailySchedule> {
    try {
      return await put<DailySchedule>(
        `/api/learning-plans/${planId}/sessions/${date}/${sessionIndex}`,
        { completed }
      );
    } catch (error) {
      console.error('更新学习会话状态失败:', error);
      throw new Error(`更新学习会话状态失败: ${(error as Error).message}`);
    }
  }

  /**
   * 生成智能学习计划
   * @param userId 用户ID
   * @param preferences 学习偏好
   */
  async generateSmartPlan(
    userId: string,
    preferences: {
      goal: 'general' | 'travel' | 'business' | 'academic' | 'test-prep';
      intensity: 'light' | 'moderate' | 'intensive';
      availableHours: number;
      preferredTimes?: ('morning' | 'afternoon' | 'evening')[];
      targetDate?: string;
      focusAreas?: ('vocabulary' | 'grammar' | 'listening' | 'speaking' | 'reading')[];
      selectedCourseIds?: string[];
    }
  ): Promise<LearningPlan> {
    try {
      return await post<LearningPlan>('/api/learning-plans/generate', {
        userId,
        preferences
      });
    } catch (error) {
      console.error('生成智能学习计划失败:', error);
      throw new Error(`生成智能学习计划失败: ${(error as Error).message}`);
    }
  }

  /**
   * 优化现有学习计划
   * @param planId 学习计划ID
   * @param criteria 优化标准
   */
  async optimizePlan(
    planId: string,
    criteria: {
      balanceWorkload?: boolean;
      prioritizeLowCompletionAreas?: boolean;
      adjustForRecentPerformance?: boolean;
      reduceOverdueItems?: boolean;
    }
  ): Promise<LearningPlan> {
    try {
      return await post<LearningPlan>(`/api/learning-plans/${planId}/optimize`, criteria);
    } catch (error) {
      console.error('优化学习计划失败:', error);
      throw new Error(`优化学习计划失败: ${(error as Error).message}`);
    }
  }

  /**
   * 获取学习计划进度统计
   * @param planId 学习计划ID
   */
  async getPlanStats(planId: string): Promise<{
    progress: number;
    daysActive: number;
    totalTimeSpent: number;
    wordsLearned: number;
    sentencesReviewed: number;
    streakDays: number;
    courseCompletionRates: { courseId: string; progress: number }[];
    focusAreaBreakdown: { [key: string]: number };
    dailyActivityHeatmap: { date: string; count: number }[];
  }> {
    try {
      return await get(`/api/learning-plans/${planId}/stats`);
    } catch (error) {
      console.error('获取学习计划统计失败:', error);
      throw new Error(`获取学习计划统计失败: ${(error as Error).message}`);
    }
  }

  /**
   * 基于用户学习数据和计划进度提供智能建议
   * @param userId 用户ID
   */
  async getPersonalizedRecommendations(userId: string): Promise<{
    suggestedCourses: { courseId: string; reason: string }[];
    recommendedFocusAreas: { area: string; reason: string }[];
    habitImprovements: { suggestion: string; impact: string }[];
    timeManagementTips: string[];
  }> {
    try {
      return await get(`/api/learning-plans/recommendations?userId=${userId}`);
    } catch (error) {
      console.error('获取个性化建议失败:', error);
      throw new Error(`获取个性化建议失败: ${(error as Error).message}`);
    }
  }

  /**
   * 生成默认的学习计划模板
   * @param userId 用户ID
   * @param type 模板类型
   */
  createPlanTemplate(
    userId: string,
    type: 'standard' | 'intensive' | 'weekend' | 'test-prep'
  ): Omit<LearningPlan, 'id' | 'createdAt' | 'updatedAt'> {
    const now = new Date();
    const endDate = new Date();
    endDate.setMonth(now.getMonth() + 3); // 默认3个月计划

    // 基础计划结构
    const basePlan: Omit<LearningPlan, 'id' | 'createdAt' | 'updatedAt'> = {
      userId,
      title: `${this.getPlanTitle(type)}学习计划`,
      description: `为期3个月的${this.getPlanTitle(type)}英语学习计划`,
      startDate: now.toISOString(),
      endDate: endDate.toISOString(),
      dailyGoal: {
        minutes: 30,
        words: 15,
        sentences: 10
      },
      weeklySchedule: this.generateWeeklySchedule(type),
      courses: [],
      adaptiveSettings: {
        adjustBasedOnPerformance: true,
        prioritizeDifficultContent: true,
        spacedRepetitionEnabled: true,
        reminderFrequency: 'daily'
      }
    };

    // 根据类型调整计划细节
    switch (type) {
      case 'intensive':
        basePlan.dailyGoal.minutes = 60;
        basePlan.dailyGoal.words = 30;
        basePlan.dailyGoal.sentences = 20;
        break;
      
      case 'weekend':
        // 周末学习计划主要集中在周末
        basePlan.weeklySchedule = {
          monday: { active: false },
          tuesday: { active: false },
          wednesday: { active: false },
          thursday: { active: false },
          friday: { active: true, focusAreas: ['vocabulary'], timeSlots: [{ start: '19:00', end: '20:00' }] },
          saturday: { 
            active: true, 
            focusAreas: ['vocabulary', 'grammar', 'listening'], 
            timeSlots: [
              { start: '10:00', end: '11:30' },
              { start: '15:00', end: '16:30' }
            ] 
          },
          sunday: { 
            active: true, 
            focusAreas: ['speaking', 'reading'], 
            timeSlots: [
              { start: '10:00', end: '11:30' },
              { start: '15:00', end: '16:30' }
            ] 
          }
        };
        break;
      
      case 'test-prep':
        basePlan.dailyGoal.minutes = 90;
        basePlan.dailyGoal.words = 40;
        basePlan.dailyGoal.sentences = 30;
        // 更密集的学习安排
        const testPrepSchedule: LearningPlan['weeklySchedule'] = {};
        ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].forEach(day => {
          testPrepSchedule[day as keyof LearningPlan['weeklySchedule']] = {
            active: true,
            focusAreas: ['vocabulary', 'grammar', 'reading', 'listening'],
            timeSlots: [
              { start: '07:00', end: '08:00' },
              { start: '19:00', end: '21:00' }
            ]
          };
        });
        basePlan.weeklySchedule = testPrepSchedule;
        break;
    }

    return basePlan;
  }

  // 辅助方法

  /**
   * 生成周计划模板
   */
  private generateWeeklySchedule(type: string): LearningPlan['weeklySchedule'] {
    const schedule: LearningPlan['weeklySchedule'] = {};
    
    // 根据计划类型设置每周安排
    switch (type) {
      case 'standard':
        schedule.monday = { 
          active: true, 
          focusAreas: ['vocabulary'], 
          timeSlots: [{ start: '19:00', end: '19:30' }] 
        };
        schedule.tuesday = { 
          active: true, 
          focusAreas: ['grammar'], 
          timeSlots: [{ start: '19:00', end: '19:30' }] 
        };
        schedule.wednesday = { 
          active: true, 
          focusAreas: ['listening'], 
          timeSlots: [{ start: '19:00', end: '19:30' }] 
        };
        schedule.thursday = { 
          active: true, 
          focusAreas: ['vocabulary'], 
          timeSlots: [{ start: '19:00', end: '19:30' }] 
        };
        schedule.friday = { 
          active: true, 
          focusAreas: ['speaking'], 
          timeSlots: [{ start: '19:00', end: '19:30' }] 
        };
        schedule.saturday = { 
          active: true, 
          focusAreas: ['reading', 'grammar'], 
          timeSlots: [{ start: '10:00', end: '11:00' }] 
        };
        schedule.sunday = { 
          active: true, 
          focusAreas: ['listening', 'speaking'], 
          timeSlots: [{ start: '10:00', end: '11:00' }] 
        };
        break;
      
      case 'intensive':
        ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].forEach(day => {
          schedule[day as keyof LearningPlan['weeklySchedule']] = {
            active: true,
            focusAreas: ['vocabulary', 'grammar', 'listening'],
            timeSlots: [
              { start: '07:00', end: '07:30' },
              { start: '19:00', end: '20:00' }
            ]
          };
        });
        
        ['saturday', 'sunday'].forEach(day => {
          schedule[day as keyof LearningPlan['weeklySchedule']] = {
            active: true,
            focusAreas: ['speaking', 'reading', 'listening'],
            timeSlots: [
              { start: '10:00', end: '12:00' },
              { start: '15:00', end: '16:00' }
            ]
          };
        });
        break;
      
      // 其他类型已在调用方法中处理
      default:
        ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].forEach(day => {
          schedule[day as keyof LearningPlan['weeklySchedule']] = {
            active: true,
            focusAreas: ['vocabulary'],
            timeSlots: [{ start: '19:00', end: '19:30' }]
          };
        });
        break;
    }
    
    return schedule;
  }

  /**
   * 获取计划标题
   */
  private getPlanTitle(type: string): string {
    switch (type) {
      case 'standard': return '标准';
      case 'intensive': return '强化';
      case 'weekend': return '周末';
      case 'test-prep': return '考试准备';
      default: return '自定义';
    }
  }

  /**
   * 生成个性化学习计划
   * @param settings 计划设置参数
   */
  async generatePersonalizedPlan(settings: {
    userId: string;
    goalDetails: {
      timeframe: string;
      target: number;
      difficulty: number;
    };
    timePreferences: {
      totalHoursPerWeek: number;
      preferredDays: string[];
      preferredTimeOfDay: string;
      sessionLength: number;
    };
    contentPreferences: {
      preferredTopics: string[];
      includeSpeaking: boolean;
      includeWriting: boolean;
      reviewFrequency: string;
    };
  }): Promise<{
    plan: LearningPlan;
    schedule: {
      daily: {
        date: string;
        sessions: {
          time: string;
          duration: number;
          activity: string;
          focusArea: string;
          materials: string;
        }[];
      }[];
      weekly: {
        totalSessions: number;
        totalHours: number;
        expectedProgress: number;
      };
    };
    insights: {
      estimatedCompletionDate: string;
      learningCurve: { week: number; progress: number }[];
      milestones: { date: string; achievement: string }[];
      adaptiveRecommendations: string[];
    };
  }> {
    try {
      // 在实际应用中，这里应该调用API
      // return await post('/api/learning-plans/personalized', settings);
      
      // 模拟响应数据
      const { userId, goalDetails, timePreferences, contentPreferences } = settings;
      
      // 计算估计完成日期
      const today = new Date();
      const completionDate = new Date();
      
      // 根据目标和学习强度计算预计完成时间
      const estimatedWeeks = Math.ceil(goalDetails.target / (timePreferences.totalHoursPerWeek * 4));
      completionDate.setDate(today.getDate() + estimatedWeeks * 7);
      
      // 生成每日学习计划
      const dailySchedule = [];
      const preferredDaysMap: {[key: string]: number} = {
        '周一': 1, '周二': 2, '周三': 3, '周四': 4, '周五': 5, '周六': 6, '周日': 0
      };
      
      // 生成接下来两周的学习计划
      for (let i = 0; i < 14; i++) {
        const date = new Date();
        date.setDate(today.getDate() + i);
        
        const dayOfWeek = date.getDay();
        const dayName = Object.keys(preferredDaysMap).find(
          key => preferredDaysMap[key] === dayOfWeek
        );
        
        // 检查是否是首选学习日
        if (timePreferences.preferredDays.includes(dayName || '')) {
          // 设置学习时间
          let startTime: string;
          switch (timePreferences.preferredTimeOfDay) {
            case 'morning':
              startTime = '08:00';
              break;
            case 'afternoon':
              startTime = '14:00';
              break;
            case 'evening':
              startTime = '19:00';
              break;
            default:
              startTime = '19:00';
          }
          
          // 创建学习会话
          const sessions = [];
          const sessionDuration = timePreferences.sessionLength;
          
          // 为每天创建1-2个学习会话
          const sessionCount = Math.random() > 0.5 ? 2 : 1;
          
          for (let j = 0; j < sessionCount; j++) {
            // 计算会话开始时间
            const sessionStartTime = startTime;
            if (j > 0) {
              // 第二个会话增加一小时
              const [hours, minutes] = sessionStartTime.split(':').map(Number);
              const newHours = (hours + 1) % 24;
              startTime = `${newHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
            }
            
            // 随机选择学习活动
            const activities = [
              '词汇学习', '语法练习', '听力训练', '阅读理解', '口语练习', '写作练习'
            ];
            
            // 如果用户不包含口语/写作，则从活动列表中移除
            let availableActivities = [...activities];
            if (!contentPreferences.includeSpeaking) {
              availableActivities = availableActivities.filter(a => a !== '口语练习');
            }
            if (!contentPreferences.includeWriting) {
              availableActivities = availableActivities.filter(a => a !== '写作练习');
            }
            
            // 随机选择活动和焦点领域
            const randomActivity = availableActivities[Math.floor(Math.random() * availableActivities.length)];
            const randomTopic = contentPreferences.preferredTopics[
              Math.floor(Math.random() * contentPreferences.preferredTopics.length)
            ];
            
            sessions.push({
              time: sessionStartTime,
              duration: sessionDuration,
              activity: randomActivity,
              focusArea: randomTopic,
              materials: `课程资料 #${Math.floor(Math.random() * 1000) + 1}`
            });
          }
          
          dailySchedule.push({
            date: date.toISOString().split('T')[0],
            sessions
          });
        }
      }
      
      // 创建学习计划
      const plan: LearningPlan = {
        id: `plan-${Date.now()}`,
        userId,
        title: `个性化学习计划 - ${contentPreferences.preferredTopics.join('、')}`,
        description: `基于您的学习目标和时间偏好创建的个性化学习计划，专注于${contentPreferences.preferredTopics.join('、')}。`,
        startDate: today.toISOString(),
        endDate: completionDate.toISOString(),
        dailyGoal: {
          minutes: timePreferences.sessionLength,
          words: 25,
          sentences: 10
        },
        weeklySchedule: this.generateWeeklyScheduleFromPreferences(timePreferences.preferredDays),
        courses: [
          {
            courseId: 'course-1',
            priority: 1,
            progress: 0
          },
          {
            courseId: 'course-2',
            priority: 2,
            progress: 0
          }
        ],
        adaptiveSettings: {
          adjustBasedOnPerformance: true,
          prioritizeDifficultContent: goalDetails.difficulty > 2,
          spacedRepetitionEnabled: contentPreferences.reviewFrequency !== 'low',
          reminderFrequency: 'daily'
        },
        createdAt: today.toISOString(),
        updatedAt: today.toISOString()
      };
      
      // 生成学习洞察
      const insights = {
        estimatedCompletionDate: completionDate.toISOString().split('T')[0],
        learningCurve: Array.from({ length: 8 }, (_, i) => ({
          week: i + 1,
          progress: Math.min(100, Math.round((i + 1) * (100 / estimatedWeeks)))
        })),
        milestones: [
          {
            date: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            achievement: '完成基础词汇学习'
          },
          {
            date: new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            achievement: '掌握核心语法规则'
          },
          {
            date: new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            achievement: '能够进行基本日常对话'
          }
        ],
        adaptiveRecommendations: [
          '根据您的学习时间和进度，建议每周增加一次口语练习',
          '您在词汇学习方面表现良好，可以尝试更高级的词汇',
          '听力理解是您需要加强的部分，建议每天增加15分钟的听力训练'
        ]
      };
      
      return {
        plan,
        schedule: {
          daily: dailySchedule,
          weekly: {
            totalSessions: dailySchedule.reduce((acc, day) => acc + day.sessions.length, 0),
            totalHours: dailySchedule.reduce(
              (acc, day) => acc + day.sessions.reduce((sum, session) => sum + session.duration, 0) / 60, 
              0
            ),
            expectedProgress: 15 // 预计两周可以完成15%的学习目标
          }
        },
        insights
      };
    } catch (error) {
      console.error('生成个性化学习计划失败:', error);
      throw new Error(`生成个性化学习计划失败: ${(error as Error).message}`);
    }
  }
  
  /**
   * 根据首选天数生成周计划结构
   */
  private generateWeeklyScheduleFromPreferences(preferredDays: string[]): LearningPlan['weeklySchedule'] {
    const dayMapping: {[key: string]: keyof LearningPlan['weeklySchedule']} = {
      '周一': 'monday',
      '周二': 'tuesday',
      '周三': 'wednesday',
      '周四': 'thursday',
      '周五': 'friday',
      '周六': 'saturday',
      '周日': 'sunday'
    };
    
    const schedule: LearningPlan['weeklySchedule'] = {};
    
    // 设置每周安排
    Object.keys(dayMapping).forEach(dayName => {
      const day = dayMapping[dayName];
      schedule[day] = {
        active: preferredDays.includes(dayName),
        focusAreas: ['vocabulary', 'grammar', 'listening'],
        timeSlots: preferredDays.includes(dayName) 
          ? [{ start: '19:00', end: '20:00' }] 
          : []
      };
    });
    
    return schedule;
  }
}

// 导出服务实例
export const learningPlanService = new LearningPlanService();
export default learningPlanService; 