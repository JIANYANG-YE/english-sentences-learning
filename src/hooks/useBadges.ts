'use client';

import { useState, useEffect, useCallback } from 'react';
import badgeService, { Badge, BadgeRarity, BadgeType, UserBadgeCollection } from '@/services/badgeService';
import communicationService from '@/services/componentCommunication';

/**
 * 钩子: 使用所有可用徽章
 * @returns 所有可用徽章数据、加载状态和错误信息
 */
export function useAvailableBadges() {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  const fetchBadges = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await badgeService.getAllBadges();
      setBadges(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('获取徽章数据失败'));
      console.error('获取徽章数据失败:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchBadges();
  }, [fetchBadges]);
  
  return { badges, isLoading, error, refreshBadges: fetchBadges };
}

/**
 * 钩子: 使用用户徽章
 * @param userId 用户ID
 * @returns 用户徽章集合、加载状态和错误信息
 */
export function useUserBadges(userId: string) {
  const [collection, setCollection] = useState<UserBadgeCollection | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  const fetchUserBadges = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await badgeService.getUserBadges(userId);
      setCollection(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('获取用户徽章失败'));
      console.error('获取用户徽章失败:', err);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);
  
  useEffect(() => {
    fetchUserBadges();
    
    // 订阅徽章解锁事件
    const unsubscribe = communicationService.subscribe(
      'badgeUnlocked',
      (payload) => {
        if (payload.data.userId === userId) {
          fetchUserBadges();
        }
      },
      'badge'
    );
    
    return () => {
      unsubscribe();
    };
  }, [userId, fetchUserBadges]);
  
  // 设置精选徽章的处理函数
  const setFeaturedBadges = useCallback(async (badgeIds: string[]) => {
    try {
      const success = await badgeService.setFeaturedBadges(userId, badgeIds);
      if (success) {
        fetchUserBadges();
      }
      return success;
    } catch (err) {
      console.error('设置精选徽章失败:', err);
      return false;
    }
  }, [userId, fetchUserBadges]);
  
  return { 
    collection, 
    isLoading, 
    error, 
    refreshBadges: fetchUserBadges, 
    setFeaturedBadges 
  };
}

/**
 * 钩子: 使用用户精选徽章
 * @param userId 用户ID
 * @returns 用户精选徽章、加载状态和错误信息
 */
export function useUserFeaturedBadges(userId: string) {
  const { collection, isLoading, error, refreshBadges, setFeaturedBadges } = useUserBadges(userId);
  
  // 提取精选徽章
  const featuredBadges = collection ? 
    collection.badges.filter(badge => 
      collection.featuredBadges.includes(badge.id)
    ) : [];
  
  return { 
    featuredBadges, 
    isLoading, 
    error, 
    refreshBadges, 
    setFeaturedBadges 
  };
}

/**
 * 钩子: 使用徽章通知
 * @param onUnlock 解锁回调函数
 * @returns 卸载函数
 */
export function useBadgeNotifications(onUnlock: (badge: Badge) => void) {
  useEffect(() => {
    // 订阅徽章解锁事件
    const unsubscribe = communicationService.subscribe(
      'badgeUnlocked',
      (payload) => {
        onUnlock(payload.data.badge);
      },
      'badge'
    );
    
    return () => {
      unsubscribe();
    };
  }, [onUnlock]);
}

/**
 * 钩子: 使用徽章筛选
 * @param badges 徽章列表
 * @param initialFilters 初始筛选条件
 * @returns 筛选后的徽章和筛选控制函数
 */
export function useBadgeFilters(
  badges: Badge[],
  initialFilters: {
    type?: BadgeType | 'all';
    rarity?: BadgeRarity | 'all';
    unlocked?: boolean | 'all';
    search?: string;
  } = { type: 'all', rarity: 'all', unlocked: 'all' }
) {
  const [filters, setFilters] = useState(initialFilters);
  
  // 应用筛选器
  const filteredBadges = badges.filter(badge => {
    // 按类型筛选
    if (filters.type && filters.type !== 'all' && badge.type !== filters.type) {
      return false;
    }
    
    // 按稀有度筛选
    if (filters.rarity && filters.rarity !== 'all' && badge.rarity !== filters.rarity) {
      return false;
    }
    
    // 按解锁状态筛选
    if (filters.unlocked !== 'all') {
      if (filters.unlocked === true && !badge.unlockedAt) {
        return false;
      }
      if (filters.unlocked === false && badge.unlockedAt) {
        return false;
      }
    }
    
    // 按搜索词筛选
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        badge.name.toLowerCase().includes(searchLower) ||
        badge.description.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });
  
  // 更新单个筛选条件
  const updateFilter = useCallback((key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);
  
  // 重置所有筛选条件
  const resetFilters = useCallback(() => {
    setFilters({
      type: 'all',
      rarity: 'all',
      unlocked: 'all',
      search: ''
    });
  }, []);
  
  return {
    filteredBadges,
    filters,
    updateFilter,
    resetFilters
  };
}

/**
 * 钩子: 获取徽章稀有度颜色
 * @param rarity 稀有度
 * @returns 颜色代码
 */
export function useBadgeRarityColor(rarity: BadgeRarity) {
  return badgeService.getRarityColor(rarity);
}

/**
 * 钩子: 获取徽章稀有度边框
 * @param rarity 稀有度
 * @returns 边框CSS
 */
export function useBadgeRarityBorder(rarity: BadgeRarity) {
  return badgeService.getRarityBorder(rarity);
}

/**
 * 钩子: 获取徽章稀有度名称
 * @param rarity 稀有度枚举值
 * @returns 中文名称
 */
export function useBadgeRarityName(rarity: BadgeRarity) {
  return badgeService.getRarityName(rarity);
}

/**
 * 钩子: 获取徽章类型名称
 * @param type 类型枚举值
 * @returns 中文名称
 */
export function useBadgeTypeName(type: BadgeType) {
  return badgeService.getTypeName(type);
} 