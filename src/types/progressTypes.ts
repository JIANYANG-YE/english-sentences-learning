/**
 * 学习单元接口 - 表示课程中的最小学习单位
 */
export interface LearningUnit {
  id: string;
  title: string;
  type: 'sentence' | 'vocabulary' | 'grammar' | 'dialogue' | 'reading' | 'quiz';
  progress: number; // 0-100 的完成度百分比
  score?: number; // 可选的得分
  completed: boolean;
  estimatedTimeMinutes: number;
  lastAccessedAt?: string; // 上次访问的时间戳
  dueDate?: string; // 可选的截止日期
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

/**
 * 课程模块接口 - 表示课程的组成部分
 */
export interface CourseModule {
  id: string;
  title: string;
  description: string;
  progress: number; // 计算得出的模块总进度
  units: LearningUnit[];
  completed: boolean;
  totalUnits: number;
  completedUnits: number;
  order: number; // 模块在课程中的顺序
}

/**
 * 课程接口 - 表示一个完整课程
 */
export interface Course {
  id: string;
  title: string;
  description: string;
  coverImage?: string;
  progress: number; // 计算得出的课程总进度
  modules: CourseModule[];
  startDate: string;
  estimatedEndDate?: string;
  actualEndDate?: string;
  completed: boolean;
  totalModules: number;
  completedModules: number;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'mixed';
  tags: string[];
  targetSkills: ('speaking' | 'listening' | 'reading' | 'writing' | 'grammar' | 'vocabulary')[];
  // 学习路径相关信息
  prerequisites?: string[]; // 前置课程IDs
  nextRecommended?: string[]; // 推荐后续课程IDs
  isRequired?: boolean; // 是否为必修课程
}

/**
 * 学习指标接口 - 表示学习过程中的关键量化指标
 */
export interface LearningMetric {
  id: string;
  name: string; // 指标名称，如"每日学习时间"、"完成单元数"等
  value: number; // 指标值
  unit: string; // 单位，如"分钟"、"个"等
  date: string; // 日期，格式为YYYY-MM-DD
  trend: 'up' | 'down' | 'stable'; // 与前一时间段相比的趋势
  changePercentage?: number; // 与前一时间段相比的变化百分比
  targetValue?: number; // 目标值，如有设置
  category: 'time' | 'progress' | 'performance' | 'consistency' | 'other';
}

/**
 * 学习里程碑接口 - 表示学习过程中的重要成就点
 */
export interface LearningMilestone {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  completedDate?: string;
  progress?: number; // 部分完成的里程碑可以有进度
  type: 'course' | 'skill' | 'streak' | 'achievement' | 'level';
  icon: string; // 图标名称或URL
  reward?: string; // 里程碑奖励描述
  dueDate?: string; // 可选的截止日期
}

/**
 * 学习日记接口 - 记录每日学习情况
 */
export interface LearningJournalEntry {
  id: string;
  date: string;
  totalTimeMinutes: number;
  unitsCompleted: number;
  activitiesCompleted: string[];
  notes?: string;
  mood?: 'good' | 'neutral' | 'tired' | 'motivated' | 'confused';
  challenges?: string[];
}

/**
 * 学习路径节点接口 - 学习路径图的组成节点
 */
export interface LearningPathNode {
  id: string;
  type: 'course' | 'milestone' | 'assessment' | 'certificate';
  title: string;
  status: 'locked' | 'available' | 'in-progress' | 'completed';
  progress?: number;
  prerequisites: string[]; // 前置节点IDs
  position: { x: number; y: number }; // 在路径图中的位置
}

/**
 * 学习路径接口 - 学习路径的完整表示
 */
export interface LearningPath {
  id: string;
  title: string;
  description: string;
  nodes: LearningPathNode[];
  connections: Array<{ source: string; target: string }>; // 节点之间的连接
  currentNodeId?: string; // 当前所在节点
  progress: number;
  estimatedCompletionTime: number; // 预计完成时间（天）
}

/**
 * 学习分析接口 - 学习数据分析结果
 */
export interface LearningAnalytics {
  averageDailyTimeMinutes: number;
  totalLearningDays: number;
  consistencyScore: number; // 0-100 的一致性评分
  weekdayDistribution: Record<string, number>; // 工作日学习时间分布
  hourlyDistribution: Record<string, number>; // 每小时学习时间分布
  strengthAreas: string[];
  improvementAreas: string[];
  recommendedActions: string[];
  learningPace: 'slow' | 'moderate' | 'fast';
}

/**
 * 学习统计接口 - 总体学习统计数据
 */
export interface LearningStatistics {
  totalCoursesStarted: number;
  totalCoursesCompleted: number;
  totalLearningTimeMinutes: number;
  totalUnitsCompleted: number;
  averageScore: number;
  currentStreak: number;
  longestStreak: number;
  activeDays: string[]; // 活跃学习日期列表
  topSkills: Array<{ skill: string; level: number }>;
} 