import { adaptiveLearningService, LearningActivityType, DifficultyLevel } from './adaptiveLearningService';
import resumeLearningService from './resumeLearningService';

export interface ContentTag {
  id: string;
  name: string;
  category: 'grammar' | 'vocabulary' | 'pronunciation' | 'listening' | 'speaking' | 'reading' | 'writing' | 'culture';
}

export interface CourseRecommendation {
  courseId: string;
  title: string;
  description: string;
  matchScore: number; // 0-100 相似度分数
  tags: ContentTag[];
  difficulty: DifficultyLevel;
  reasonForRecommendation: string[];
}

export interface LessonRecommendation {
  lessonId: string;
  courseId: string;
  title: string;
  description?: string;
  matchScore: number; // 0-100 相似度分数
  tags: ContentTag[];
  difficulty: DifficultyLevel;
  estimatedTimeMinutes: number;
  reasonForRecommendation: string[];
}

export interface PracticeRecommendation {
  id: string;
  title: string;
  description?: string;
  activityType: LearningActivityType;
  difficulty: DifficultyLevel;
  estimatedTimeMinutes: number;
  targetSkill: string;
  reasonForRecommendation: string[];
}

export interface RecommendationSettings {
  maxRecommendations: number;
  includeCourseRecommendations: boolean;
  includeLessonRecommendations: boolean;
  includePracticeRecommendations: boolean;
  preferredTags?: ContentTag[];
  excludeTags?: ContentTag[];
  preferSimilarToRecentlyStudied?: boolean;
  preferTargetWeakAreas?: boolean;
  difficulty?: DifficultyLevel | 'adaptive';
}

// 模拟数据库中的课程数据
const mockCourseData = [
  {
    id: 'course-1',
    title: '日常生活英语对话',
    description: '掌握日常生活中的常用英语对话和表达',
    tags: [
      { id: 'tag-1', name: '日常对话', category: 'speaking' } as ContentTag,
      { id: 'tag-2', name: '实用表达', category: 'speaking' } as ContentTag,
      { id: 'tag-3', name: '日常词汇', category: 'vocabulary' } as ContentTag
    ] as ContentTag[],
    difficulty: 2, // 简单
    popularity: 95
  },
  {
    id: 'course-2',
    title: '商务英语精讲',
    description: '提升职场商务英语能力，掌握会议、谈判和邮件写作技巧',
    tags: [
      { id: 'tag-4', name: '商务沟通', category: 'speaking' },
      { id: 'tag-5', name: '商务写作', category: 'writing' },
      { id: 'tag-6', name: '商务词汇', category: 'vocabulary' }
    ],
    difficulty: 4, // 困难
    popularity: 87
  },
  {
    id: 'course-3',
    title: '英语语法进阶',
    description: '系统掌握英语语法知识，提高语言准确性',
    tags: [
      { id: 'tag-7', name: '语法规则', category: 'grammar' },
      { id: 'tag-8', name: '句型结构', category: 'grammar' }
    ],
    difficulty: 3, // 中等
    popularity: 91
  },
  {
    id: 'course-4',
    title: '旅游英语会话',
    description: '准备出国旅行？学习最实用的旅游英语表达',
    tags: [
      { id: 'tag-9', name: '旅行对话', category: 'speaking' },
      { id: 'tag-10', name: '文化礼仪', category: 'culture' },
      { id: 'tag-11', name: '地理词汇', category: 'vocabulary' }
    ],
    difficulty: 2, // 简单
    popularity: 88
  },
  {
    id: 'course-5',
    title: '学术英语写作',
    description: '掌握学术论文和报告的写作技巧和规范',
    tags: [
      { id: 'tag-12', name: '学术写作', category: 'writing' },
      { id: 'tag-13', name: '论文结构', category: 'writing' },
      { id: 'tag-14', name: '学术词汇', category: 'vocabulary' }
    ],
    difficulty: 5, // 非常困难
    popularity: 82
  },
  {
    id: 'course-6',
    title: '英语发音纠正',
    description: '改善英语发音，提高口语清晰度和自然度',
    tags: [
      { id: 'tag-15', name: '语音规则', category: 'pronunciation' },
      { id: 'tag-16', name: '重音节奏', category: 'pronunciation' }
    ],
    difficulty: 3, // 中等
    popularity: 90
  }
] as const;

// 模拟数据库中的课程章节数据
const mockLessonData = [
  // 日常生活英语对话课程的章节
  {
    id: 'lesson-1-1',
    courseId: 'course-1',
    title: '打招呼与自我介绍',
    description: '学习不同场合的问候语和自我介绍方式',
    tags: [
      { id: 'tag-1', name: '日常对话', category: 'speaking' },
      { id: 'tag-17', name: '问候语', category: 'vocabulary' }
    ],
    difficulty: 1, // 非常简单
    estimatedTimeMinutes: 15
  },
  {
    id: 'lesson-1-2',
    courseId: 'course-1',
    title: '购物对话',
    description: '掌握在商店、超市购物时的实用对话',
    tags: [
      { id: 'tag-1', name: '日常对话', category: 'speaking' },
      { id: 'tag-18', name: '购物词汇', category: 'vocabulary' }
    ],
    difficulty: 2, // 简单
    estimatedTimeMinutes: 20
  },
  
  // 商务英语精讲课程的章节
  {
    id: 'lesson-2-1',
    courseId: 'course-2',
    title: '商务会议用语',
    description: '学习商务会议中的常用表达和礼仪',
    tags: [
      { id: 'tag-4', name: '商务沟通', category: 'speaking' },
      { id: 'tag-19', name: '会议用语', category: 'vocabulary' }
    ],
    difficulty: 3, // 中等
    estimatedTimeMinutes: 25
  },
  {
    id: 'lesson-2-2',
    courseId: 'course-2',
    title: '商务邮件写作',
    description: '掌握专业商务邮件的写作格式和技巧',
    tags: [
      { id: 'tag-5', name: '商务写作', category: 'writing' },
      { id: 'tag-20', name: '邮件格式', category: 'writing' }
    ],
    difficulty: 4, // 困难
    estimatedTimeMinutes: 30
  },
  
  // 英语语法进阶课程的章节
  {
    id: 'lesson-3-1',
    courseId: 'course-3',
    title: '时态全解析',
    description: '系统学习英语中的各种时态用法和区别',
    tags: [
      { id: 'tag-7', name: '语法规则', category: 'grammar' },
      { id: 'tag-21', name: '时态', category: 'grammar' }
    ],
    difficulty: 3, // 中等
    estimatedTimeMinutes: 35
  },
  {
    id: 'lesson-3-2',
    courseId: 'course-3',
    title: '条件句和虚拟语气',
    description: '掌握条件句的三种类型和虚拟语气的使用',
    tags: [
      { id: 'tag-7', name: '语法规则', category: 'grammar' },
      { id: 'tag-22', name: '虚拟语气', category: 'grammar' }
    ],
    difficulty: 4, // 困难
    estimatedTimeMinutes: 40
  }
] as const;

// 模拟练习题数据
const mockPracticeData = [
  {
    id: 'practice-1',
    title: '日常问候练习',
    description: '练习不同场合和时间的问候语',
    activityType: 'vocabulary',
    difficulty: 1, // 非常简单
    estimatedTimeMinutes: 10,
    targetSkill: 'speaking',
    relatedTags: ['tag-1', 'tag-17']
  },
  {
    id: 'practice-2',
    title: '时态变换练习',
    description: '在不同情境下选择正确的时态',
    activityType: 'grammar',
    difficulty: 3, // 中等
    estimatedTimeMinutes: 15,
    targetSkill: 'grammar',
    relatedTags: ['tag-7', 'tag-21']
  },
  {
    id: 'practice-3',
    title: '商务邮件写作练习',
    description: '根据情景写作商务邮件',
    activityType: 'writing',
    difficulty: 4, // 困难
    estimatedTimeMinutes: 25,
    targetSkill: 'writing',
    relatedTags: ['tag-5', 'tag-20']
  },
  {
    id: 'practice-4',
    title: '发音练习：元音辨析',
    description: '区分相似元音发音的练习',
    activityType: 'pronunciation',
    difficulty: 2, // 简单
    estimatedTimeMinutes: 12,
    targetSkill: 'pronunciation',
    relatedTags: ['tag-15']
  },
  {
    id: 'practice-5',
    title: '听力理解：日常对话',
    description: '听取日常对话并回答问题',
    activityType: 'listening',
    difficulty: 2, // 简单
    estimatedTimeMinutes: 15,
    targetSkill: 'listening',
    relatedTags: ['tag-1', 'tag-3']
  }
] as const;

// 计算标签相似度 (0-1)
const calculateTagSimilarity = (userTags: ContentTag[], contentTags: ContentTag[]): number => {
  if (userTags.length === 0 || contentTags.length === 0) return 0;
  
  const userTagIds = userTags.map(tag => tag.id);
  const matchingTags = contentTags.filter(tag => userTagIds.includes(tag.id));
  
  return matchingTags.length / Math.max(userTags.length, contentTags.length);
};

// 根据内容难度计算适合度 (0-1)，0表示差距很大，1表示完全匹配
const calculateDifficultyFit = (userPreferredDifficulty: DifficultyLevel, contentDifficulty: DifficultyLevel): number => {
  const diff = Math.abs(userPreferredDifficulty - contentDifficulty);
  if (diff === 0) return 1;
  if (diff === 1) return 0.8;
  if (diff === 2) return 0.5;
  if (diff === 3) return 0.2;
  return 0; // 差距超过3
};

class ContentRecommendationService {
  // 获取推荐课程
  getRecommendedCourses(
    userId: string,
    settings: RecommendationSettings = { 
      maxRecommendations: 3,
      includeCourseRecommendations: true,
      includeLessonRecommendations: false,
      includePracticeRecommendations: false
    }
  ): CourseRecommendation[] {
    const recommendations: CourseRecommendation[] = [];
    
    try {
      // 获取用户学习资料
      const learnerProfile = adaptiveLearningService.getLearnerProfile(userId);
      const learnerAreaSummary = adaptiveLearningService.getLearnerAreaSummary(userId);
      
      // 获取用户的最近学习位置
      const recentPositions = resumeLearningService.getRecentPositions(userId, 5);
      
      // 确定推荐难度级别
      let targetDifficulty: DifficultyLevel = learnerProfile.preferredDifficulty;
      if (settings.difficulty && settings.difficulty !== 'adaptive') {
        targetDifficulty = settings.difficulty;
      }
      
      // 从最近学习内容中提取标签
      const recentTags: ContentTag[] = [];
      if (settings.preferSimilarToRecentlyStudied && recentPositions.length > 0) {
        // 这里模拟从最近学习位置中提取标签
        // 实际中应该根据recentPositions查询数据库获取相关内容的标签
        recentTags.push(
          { id: 'tag-1', name: '日常对话', category: 'speaking' } as ContentTag,
          { id: 'tag-7', name: '语法规则', category: 'grammar' } as ContentTag
        );
      }
      
      // 评分和筛选课程
      const scoredCourses = mockCourseData.map(course => {
        let score = 0;
        const reasons: string[] = [];
        
        // 计算难度匹配度
        const difficultyScore = calculateDifficultyFit(targetDifficulty, course.difficulty as DifficultyLevel);
        score += difficultyScore * 40; // 难度权重40%
        
        if (difficultyScore > 0.7) {
          reasons.push(`难度级别与您的偏好匹配`);
        }
        
        // 如果设置为关注弱项领域
        if (settings.preferTargetWeakAreas && learnerAreaSummary.struggles.length > 0) {
          // 检查课程标签是否包含用户的弱项领域
          const strugglingCategories = learnerAreaSummary.struggles;
          const matchingStruggles = course.tags.filter(tag => 
            strugglingCategories.includes(tag.category as string)
          );
          
          if (matchingStruggles.length > 0) {
            const fitScore = matchingStruggles.length / strugglingCategories.length;
            score += fitScore * 30; // 弱项匹配权重30%
            reasons.push(`内容涵盖您需要提高的${matchingStruggles.map(t => t.category).join('、')}技能`);
          }
        }
        
        // 与最近学习内容的相似度
        if (settings.preferSimilarToRecentlyStudied && recentTags.length > 0) {
          const similarityScore = calculateTagSimilarity(recentTags, course.tags as ContentTag[]);
          score += similarityScore * 20; // 相似度权重20%
          
          if (similarityScore > 0.3) {
            reasons.push(`与您最近学习的内容相关`);
          }
        }
        
        // 考虑课程流行度
        score += (course.popularity / 100) * 10; // 流行度权重10%
        
        if (course.popularity > 90) {
          reasons.push(`热门课程，好评率高`);
        }
        
        // 检查偏好标签和排除标签
        if (settings.preferredTags && settings.preferredTags.length > 0) {
          const preferredTagIds = settings.preferredTags.map(tag => tag.id);
          const hasPreferredTags = course.tags.some(tag => preferredTagIds.includes(tag.id));
          
          if (hasPreferredTags) {
            score += 15; // 有偏好标签加分
            reasons.push(`包含您感兴趣的主题`);
          }
        }
        
        if (settings.excludeTags && settings.excludeTags.length > 0) {
          const excludeTagIds = settings.excludeTags.map(tag => tag.id);
          const hasExcludedTags = course.tags.some(tag => excludeTagIds.includes(tag.id));
          
          if (hasExcludedTags) {
            score -= 50; // 有排除标签减分
          }
        }
        
        return {
          courseId: course.id,
          title: course.title,
          description: course.description,
          matchScore: Math.round(Math.max(0, Math.min(100, score))),
          tags: course.tags as ContentTag[],
          difficulty: course.difficulty as DifficultyLevel,
          reasonForRecommendation: reasons.length > 0 ? reasons : ['基于您的学习偏好推荐']
        };
      });
      
      // 排序并限制数量
      recommendations.push(
        ...scoredCourses
          .filter(course => course.matchScore > 0) // 过滤掉评分为0的课程
          .sort((a, b) => b.matchScore - a.matchScore)
          .slice(0, settings.maxRecommendations)
      );
      
    } catch (error) {
      console.error('获取课程推荐时出错:', error);
    }
    
    return recommendations;
  }
  
  // 获取推荐章节
  getRecommendedLessons(
    userId: string,
    settings: RecommendationSettings = { 
      maxRecommendations: 5,
      includeCourseRecommendations: false,
      includeLessonRecommendations: true,
      includePracticeRecommendations: false
    }
  ): LessonRecommendation[] {
    const recommendations: LessonRecommendation[] = [];
    
    try {
      // 获取用户学习资料
      const learnerProfile = adaptiveLearningService.getLearnerProfile(userId);
      const learnerAreaSummary = adaptiveLearningService.getLearnerAreaSummary(userId);
      
      // 确定目标难度
      let targetDifficulty: DifficultyLevel = learnerProfile.preferredDifficulty;
      if (settings.difficulty && settings.difficulty !== 'adaptive') {
        targetDifficulty = settings.difficulty;
      }
      
      // 评分和筛选章节
      const scoredLessons = mockLessonData.map(lesson => {
        let score = 0;
        const reasons: string[] = [];
        
        // 计算难度匹配度
        const difficultyScore = calculateDifficultyFit(targetDifficulty, lesson.difficulty as DifficultyLevel);
        score += difficultyScore * 40; // 难度权重40%
        
        if (difficultyScore > 0.7) {
          reasons.push(`难度适合您当前的水平`);
        }
        
        // 如果设置为关注弱项领域
        if (settings.preferTargetWeakAreas && learnerAreaSummary.struggles.length > 0) {
          // 检查章节标签是否包含用户的弱项领域
          const strugglingCategories = learnerAreaSummary.struggles;
          const matchingStruggles = lesson.tags.filter(tag => 
            strugglingCategories.includes(tag.category as string)
          );
          
          if (matchingStruggles.length > 0) {
            const fitScore = matchingStruggles.length / strugglingCategories.length;
            score += fitScore * 30; // 弱项匹配权重30%
            reasons.push(`帮助提高您的${matchingStruggles.map(t => t.category).join('、')}能力`);
          }
        }
        
        // 检查偏好标签和排除标签
        if (settings.preferredTags && settings.preferredTags.length > 0) {
          const preferredTagIds = settings.preferredTags.map(tag => tag.id);
          const hasPreferredTags = lesson.tags.some(tag => preferredTagIds.includes(tag.id));
          
          if (hasPreferredTags) {
            score += 20; // 有偏好标签加分
            reasons.push(`包含您感兴趣的主题内容`);
          }
        }
        
        if (settings.excludeTags && settings.excludeTags.length > 0) {
          const excludeTagIds = settings.excludeTags.map(tag => tag.id);
          const hasExcludedTags = lesson.tags.some(tag => excludeTagIds.includes(tag.id));
          
          if (hasExcludedTags) {
            score -= 50; // 有排除标签减分
          }
        }
        
        // 学习时间考虑
        if (lesson.estimatedTimeMinutes <= 20) {
          score += 10; // 短时间章节加分
          reasons.push(`短小精练，仅需${lesson.estimatedTimeMinutes}分钟`);
        }
        
        return {
          lessonId: lesson.id,
          courseId: lesson.courseId,
          title: lesson.title,
          description: lesson.description,
          matchScore: Math.round(Math.max(0, Math.min(100, score))),
          tags: lesson.tags as ContentTag[],
          difficulty: lesson.difficulty as DifficultyLevel,
          estimatedTimeMinutes: lesson.estimatedTimeMinutes,
          reasonForRecommendation: reasons.length > 0 ? reasons : ['根据您的学习记录推荐']
        };
      });
      
      // 排序并限制数量
      recommendations.push(
        ...scoredLessons
          .filter(lesson => lesson.matchScore > 0) // 过滤掉评分为0的章节
          .sort((a, b) => b.matchScore - a.matchScore)
          .slice(0, settings.maxRecommendations)
      );
      
    } catch (error) {
      console.error('获取章节推荐时出错:', error);
    }
    
    return recommendations;
  }
  
  // 获取推荐练习
  getRecommendedPractices(
    userId: string,
    settings: RecommendationSettings = { 
      maxRecommendations: 3,
      includeCourseRecommendations: false,
      includeLessonRecommendations: false,
      includePracticeRecommendations: true
    }
  ): PracticeRecommendation[] {
    const recommendations: PracticeRecommendation[] = [];
    
    try {
      // 获取用户学习资料
      const learnerProfile = adaptiveLearningService.getLearnerProfile(userId);
      const learnerAreaSummary = adaptiveLearningService.getLearnerAreaSummary(userId);
      
      // 确定目标难度
      let targetDifficulty: DifficultyLevel = learnerProfile.preferredDifficulty;
      if (settings.difficulty && settings.difficulty !== 'adaptive') {
        targetDifficulty = settings.difficulty;
      }
      
      // 评分和筛选练习
      const scoredPractices = mockPracticeData.map(practice => {
        let score = 0;
        const reasons: string[] = [];
        
        // 计算难度匹配度
        const difficultyScore = calculateDifficultyFit(targetDifficulty, practice.difficulty as DifficultyLevel);
        score += difficultyScore * 35; // 难度权重35%
        
        if (difficultyScore > 0.7) {
          reasons.push(`难度适合您当前的水平`);
        }
        
        // 如果设置为关注弱项领域
        if (settings.preferTargetWeakAreas && learnerAreaSummary.struggles.length > 0) {
          // 检查练习是否针对用户的弱项领域
          if (learnerAreaSummary.struggles.includes(practice.targetSkill)) {
            score += 40; // 针对弱项加分
            reasons.push(`专门针对您需要提高的${practice.targetSkill}技能`);
          }
        }
        
        // 检查技能水平，推荐低于平均水平的技能练习
        const skillLevel = learnerProfile.skillLevels[practice.activityType as LearningActivityType] || 50;
        if (skillLevel < 60) { // 如果技能水平较低
          score += (60 - skillLevel) * 0.5; // 根据水平差距加分
          reasons.push(`帮助提升您的${practice.activityType}技能水平`);
        }
        
        // 学习时间考虑
        if (practice.estimatedTimeMinutes <= 15) {
          score += 10; // 短时间练习加分
          reasons.push(`快速练习，仅需${practice.estimatedTimeMinutes}分钟`);
        }
        
        return {
          id: practice.id,
          title: practice.title,
          description: practice.description,
          activityType: practice.activityType as LearningActivityType,
          difficulty: practice.difficulty as DifficultyLevel,
          estimatedTimeMinutes: practice.estimatedTimeMinutes,
          targetSkill: practice.targetSkill,
          reasonForRecommendation: reasons.length > 0 ? reasons : ['根据您的学习情况生成的练习']
        };
      });
      
      // 排序并限制数量
      recommendations.push(
        ...scoredPractices
          .filter(practice => practice.reasonForRecommendation.length > 1) // 至少有一个明确推荐原因
          .sort((a, b) => b.reasonForRecommendation.length - a.reasonForRecommendation.length)
          .slice(0, settings.maxRecommendations)
      );
      
    } catch (error) {
      console.error('获取练习推荐时出错:', error);
    }
    
    return recommendations;
  }
  
  // 获取混合推荐（课程、章节和练习的组合）
  getRecommendations(
    userId: string,
    settings: RecommendationSettings = {
      maxRecommendations: 8,
      includeCourseRecommendations: true,
      includeLessonRecommendations: true,
      includePracticeRecommendations: true,
      preferTargetWeakAreas: true
    }
  ): {
    courses: CourseRecommendation[],
    lessons: LessonRecommendation[],
    practices: PracticeRecommendation[]
  } {
    // 分配推荐数量
    let coursesCount = 0, lessonsCount = 0, practicesCount = 0;
    const totalCount = settings.maxRecommendations;
    
    if (settings.includeCourseRecommendations && 
        settings.includeLessonRecommendations && 
        settings.includePracticeRecommendations) {
      // 三种推荐都包含，按4:3:1的比例分配
      coursesCount = Math.floor(totalCount * 0.4);
      lessonsCount = Math.floor(totalCount * 0.3);
      practicesCount = totalCount - coursesCount - lessonsCount;
    } else if (settings.includeCourseRecommendations && 
              settings.includeLessonRecommendations) {
      // 只包含课程和章节，按6:4的比例分配
      coursesCount = Math.floor(totalCount * 0.6);
      lessonsCount = totalCount - coursesCount;
    } else if (settings.includeCourseRecommendations && 
              settings.includePracticeRecommendations) {
      // 只包含课程和练习，按7:3的比例分配
      coursesCount = Math.floor(totalCount * 0.7);
      practicesCount = totalCount - coursesCount;
    } else if (settings.includeLessonRecommendations && 
              settings.includePracticeRecommendations) {
      // 只包含章节和练习，按8:2的比例分配
      lessonsCount = Math.floor(totalCount * 0.8);
      practicesCount = totalCount - lessonsCount;
    } else {
      // 单一类型推荐，全部分配给该类型
      if (settings.includeCourseRecommendations) coursesCount = totalCount;
      else if (settings.includeLessonRecommendations) lessonsCount = totalCount;
      else if (settings.includePracticeRecommendations) practicesCount = totalCount;
    }
    
    // 获取各类型推荐
    const courses = coursesCount > 0 ? 
      this.getRecommendedCourses(userId, { ...settings, maxRecommendations: coursesCount }) : [];
      
    const lessons = lessonsCount > 0 ? 
      this.getRecommendedLessons(userId, { ...settings, maxRecommendations: lessonsCount }) : [];
      
    const practices = practicesCount > 0 ? 
      this.getRecommendedPractices(userId, { ...settings, maxRecommendations: practicesCount }) : [];
    
    return { courses, lessons, practices };
  }
}

export const contentRecommendationService = new ContentRecommendationService(); 