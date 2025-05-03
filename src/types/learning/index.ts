/**
 * 学习功能相关类型定义
 */

// 内容项（句子）
export interface ContentItem {
  id: string;
  english: string;
  chinese: string;
}

// 单词定义
export interface WordDefinition {
  word: string;
  phonetic: string;
  partOfSpeech: string;
  definition: string;
  examples: string[];
  synonyms: string[];
  antonyms: string[];
}

// 学习模式
export type StudyTab = 'sentences' | 'explanation' | 'grammar' | 'vocabulary' | 'practice';

// 学习模式类型（路由）
export type LearningMode = 
  | 'chinese-to-english' 
  | 'english-to-chinese' 
  | 'grammar' 
  | 'listening' 
  | 'notes'
  | 'sentences'  // 原始句子学习
  | 'explanation' // 详细讲解模式
  | 'mixed'; // 混合学习模式

// 学习活动类型（用于性能和熟练度跟踪）
export type LearningActivityType = 
  | 'chineseToEnglish' 
  | 'englishToChinese' 
  | 'grammar' 
  | 'listening' 
  | 'vocabulary'
  | 'speaking'
  | 'reading'
  | 'writing';

// 学习进度
export interface LearningProgress {
  userId: string;
  contentId: string;
  progress: number; // 0-100
  completed: boolean;
  lastAccessedAt: string;
  timeSpent: number; // 秒
}

// 学习设置
export interface LearningSettings {
  autoPlayAudio: boolean;
  showTranslation: boolean;
  fontSize: 'small' | 'medium' | 'large';
  highlightStyle: 'underline' | 'background' | 'both';
  speechRate: number; // 0.5-2.0
  preferredVoice?: string;
}

// 难度级别
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

// 表现指标
export interface PerformanceMetrics {
  activityType: LearningActivityType;
  timestamp: number;
  accuracyRate: number; // 0-100
  completionTime: number; // 秒
  expectedTime: number; // 秒
  mistakeCount: number;
  hintUsage: number;
  attemptCount: number;
}

// 模式熟练度数据
export interface ModeProficiencyData {
  modeName: string;
  displayName: string;
  currentScore: number;
  historyScores: number[];
  completedSessions: number;
  successRate: number;
  lastPracticeDate: string;
  recommendedNextDate: string;
  color: string;
}

// 混合学习模式用户设置
export interface MixedModeSettings {
  rotationInterval: number; // 自动切换间隔（秒）
  enableAutoRotation: boolean; // 是否自动切换模式
  preferredSequence: LearningActivityType[];
  modeProficiency: Record<LearningActivityType, number>; // 0-100的熟练度评分
  adaptiveDifficulty: boolean; // 是否启用自适应难度
}

// 内容难度分布数据
export interface ContentDifficultyData {
  name: string;
  value: number;
  color: string;
  description: string;
  examples: string[];
}

// 相关知识项
export interface RelatedKnowledgeItem {
  id: string;
  title: string;
  type: string;
  relevanceScore: number; // 0-100
  description?: string;
  link?: string;
}

// 学习路径建议
export interface LearningPathSuggestion {
  userId: string;
  currentActivityType: LearningActivityType;
  suggestedNextActivities: Array<{
    activityType: LearningActivityType;
    reason: string;
    priority: number; // 1-10
  }>;
  recommendedDifficulty: DifficultyLevel;
  focusAreas: string[];
  estimatedTimeToMastery: number; // 分钟
} 