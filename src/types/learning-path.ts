export interface LearningPathData {
  date: string;
  progress: number;
  difficulty: number;
  performance: number;
}

export interface LearningPathAdjustment {
  suggestedPath: string[];
  difficultyAdjustment: number;
  additionalResources: string[];
  estimatedTime: number;
}

export interface LearningPathAnalysis {
  currentProgress: number;
  currentPerformance: number;
  difficulties: string[];
  adjustment: LearningPathAdjustment;
} 