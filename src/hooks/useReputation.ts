"use client";

import { useState, useEffect, useCallback } from 'react';
import communityReputationService from '@/services/communityReputationService';
import { ReputationLevel, ReputationChangeType } from '@/services/communityReputationService';
import communicationService from '@/services/componentCommunication';

// 声誉相关类型定义
export interface ReputationChange {
  id: string;
  userId: string;
  type: ReputationChangeType;
  amount: number;
  timestamp: string;
  details?: {
    contentId?: string;
    contentType?: string;
    reason?: string;
  };
}

export interface UserReputation {
  userId: string;
  score: number;
  level: ReputationLevel;
  changes: ReputationChange[];
  privileges: string[];
  lastUpdated: string;
}

// 声誉相关接口
export interface ReputationData {
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
 * Hook用于获取和订阅用户声誉数据
 * @param userId 用户ID
 * @returns 包含用户声誉数据、加载状态和错误信息的对象
 */
export function useUserReputation(userId: string) {
  const [reputation, setReputation] = useState<ReputationData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchReputation = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await communityReputationService.getUserReputation(userId);
      setReputation(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('获取用户声誉数据失败'));
      console.error('获取用户声誉数据失败:', err);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchReputation();

    // 订阅声誉变化事件
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
  }, [userId, fetchReputation]);

  return { reputation, isLoading, error, refreshReputation: fetchReputation };
}

/**
 * Hook用于获取声誉排行榜数据
 * @param limit 要获取的排行榜条目数量
 * @returns 包含排行榜数据、加载状态和错误信息的对象
 */
export function useReputationLeaderboard(limit: number = 10) {
  const [leaderboard, setLeaderboard] = useState<Array<{
    userId: string;
    username: string;
    score: number;
    level: ReputationLevel;
  }> | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchLeaderboard = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await communityReputationService.getLeaderboard(limit);
      setLeaderboard(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('获取声誉排行榜失败'));
      console.error('获取声誉排行榜失败:', err);
    } finally {
      setIsLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchLeaderboard();

    // 每5分钟刷新一次排行榜数据
    const intervalId = setInterval(fetchLeaderboard, 5 * 60 * 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [fetchLeaderboard]);

  return { leaderboard, isLoading, error, refreshLeaderboard: fetchLeaderboard };
}

/**
 * Hook用于获取声誉等级名称
 * @param level 声誉等级
 * @returns 声誉等级的中文名称
 */
export function useReputationLevelName(level: ReputationLevel) {
  return communityReputationService.getLevelName(level);
}

/**
 * Hook用于获取用户的声誉历史记录
 * @param userId 用户ID
 * @param limit 要获取的记录数量
 * @returns 包含声誉历史记录、加载状态和错误信息的对象
 */
export function useReputationHistory(userId: string, limit: number = 10) {
  const [history, setHistory] = useState<ReputationChange[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchHistory = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await communityReputationService.getReputationHistory(userId, limit);
      setHistory(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('获取声誉历史记录失败'));
      console.error('获取声誉历史记录失败:', err);
    } finally {
      setIsLoading(false);
    }
  }, [userId, limit]);

  useEffect(() => {
    fetchHistory();
    
    // 订阅声誉变化事件以刷新历史记录
    const unsubscribe = communicationService.subscribe(
      'reputationChanged',
      (payload) => {
        if (payload.data.userId === userId) {
          fetchHistory();
        }
      },
      'community'
    );

    return () => {
      unsubscribe();
    };
  }, [userId, fetchHistory]);

  return { history, isLoading, error, refreshHistory: fetchHistory };
} 