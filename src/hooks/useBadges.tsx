import { useMemo, useState } from 'react';
import { Badge, BadgeType, BadgeRarity } from '@/services/badgeService';

export interface BadgeFilters {
  type?: BadgeType | 'all';
  rarity?: BadgeRarity | 'all';
  unlocked?: boolean | 'all';
  search?: string;
}

/**
 * 徽章筛选钩子
 * 提供徽章筛选功能
 */
export const useBadgeFilters = (badges: Badge[]) => {
  // 筛选条件状态
  const [filters, setFilters] = useState<BadgeFilters>({
    type: 'all',
    rarity: 'all',
    unlocked: 'all',
    search: '',
  });

  // 更新筛选条件
  const updateFilter = (name: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 重置筛选条件
  const resetFilters = () => {
    setFilters({
      type: 'all',
      rarity: 'all',
      unlocked: 'all',
      search: '',
    });
  };

  // 应用筛选条件获取过滤后的徽章
  const filteredBadges = useMemo(() => {
    return badges.filter((badge) => {
      // 筛选徽章类型
      if (filters.type && filters.type !== 'all' && badge.type !== filters.type) {
        return false;
      }

      // 筛选稀有度
      if (filters.rarity && filters.rarity !== 'all' && badge.rarity !== filters.rarity) {
        return false;
      }

      // 筛选解锁状态
      if (filters.unlocked !== 'all') {
        const isUnlocked = badge.unlockedAt !== null;
        if (filters.unlocked === 'true' && !isUnlocked) return false;
        if (filters.unlocked === 'false' && isUnlocked) return false;
      }

      // 搜索功能
      if (filters.search && filters.search.trim() !== '') {
        const searchLower = filters.search.toLowerCase().trim();
        const nameMatch = badge.name.toLowerCase().includes(searchLower);
        const descMatch = badge.description.toLowerCase().includes(searchLower);
        if (!nameMatch && !descMatch) return false;
      }

      return true;
    });
  }, [badges, filters]);

  return {
    filters,
    updateFilter,
    resetFilters,
    filteredBadges,
  };
};

/**
 * 获取用户徽章的钩子
 */
export const useUserBadges = (userId: string) => {
  const [userBadges, setUserBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // 这里可以添加获取用户徽章的逻辑
  // 使用useEffect等进行API调用

  return {
    userBadges,
    loading,
    error,
  };
};

/**
 * 获取所有可用徽章的钩子
 */
export const useAllBadges = () => {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // 这里可以添加获取所有徽章的逻辑
  // 使用useEffect等进行API调用

  return {
    badges,
    loading,
    error,
  };
}; 