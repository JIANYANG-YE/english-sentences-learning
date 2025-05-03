export enum BadgeRarity {
  COMMON = 'common',
  UNCOMMON = 'uncommon',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary'
}

export enum BadgeType {
  ACHIEVEMENT = 'achievement',
  ACTIVITY = 'activity',
  STREAK = 'streak',
  COMMUNITY = 'community',
  MILESTONE = 'milestone',
  SPECIAL = 'special'
}

export interface BadgeProgress {
  currentValue: number;
  targetValue: number;
  percentage: number;
  remainingValue: number;
  lastUpdated: string;
}

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
  category?: string;
  tags?: string[];
  requirements?: {
    type: string;
    value: number;
    description: string;
  }[];
  rewards?: {
    type: string;
    value: number;
    description: string;
  }[];
  version?: string;
  createdAt: Date;
  updatedAt: Date;
} 