/**
 * 缓存服务
 */

// 缓存选项
export interface CacheOptions {
  ttl?: number; // 过期时间（毫秒）
  prefix?: string; // 键前缀
}

// 缓存条目
export interface CacheEntry<T> {
  value: T;
  timestamp: number;
  ttl?: number;
}

// 缓存服务
export const cacheService = {
  /**
   * 获取缓存键
   */
  getCacheKey: (key: string, prefix?: string): string => {
    return prefix ? `${prefix}:${key}` : key;
  },

  /**
   * 设置缓存
   */
  set: <T>(key: string, value: T, options: CacheOptions = {}): void => {
    const { ttl, prefix } = options;
    const cacheKey = cacheService.getCacheKey(key, prefix);
    const entry: CacheEntry<T> = {
      value,
      timestamp: Date.now(),
      ttl,
    };

    try {
      localStorage.setItem(cacheKey, JSON.stringify(entry));
    } catch (error) {
      console.error('Failed to set cache:', error);
    }
  },

  /**
   * 获取缓存
   */
  get: <T>(key: string, options: CacheOptions = {}): T | null => {
    const { prefix } = options;
    const cacheKey = cacheService.getCacheKey(key, prefix);

    try {
      const item = localStorage.getItem(cacheKey);
      if (!item) return null;

      const entry: CacheEntry<T> = JSON.parse(item);
      const { value, timestamp, ttl } = entry;

      // 检查是否过期
      if (ttl && Date.now() - timestamp > ttl) {
        cacheService.remove(key, options);
        return null;
      }

      return value;
    } catch (error) {
      console.error('Failed to get cache:', error);
      return null;
    }
  },

  /**
   * 移除缓存
   */
  remove: (key: string, options: CacheOptions = {}): void => {
    const { prefix } = options;
    const cacheKey = cacheService.getCacheKey(key, prefix);

    try {
      localStorage.removeItem(cacheKey);
    } catch (error) {
      console.error('Failed to remove cache:', error);
    }
  },

  /**
   * 清除所有缓存
   */
  clear: (options: CacheOptions = {}): void => {
    const { prefix } = options;

    try {
      if (prefix) {
        // 清除指定前缀的缓存
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith(prefix)) {
            localStorage.removeItem(key);
          }
        }
      } else {
        // 清除所有缓存
        localStorage.clear();
      }
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  },

  /**
   * 获取缓存大小
   */
  size: (options: CacheOptions = {}): number => {
    const { prefix } = options;

    try {
      if (prefix) {
        // 计算指定前缀的缓存数量
        let count = 0;
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith(prefix)) {
            count++;
          }
        }
        return count;
      } else {
        // 返回所有缓存数量
        return localStorage.length;
      }
    } catch (error) {
      console.error('Failed to get cache size:', error);
      return 0;
    }
  },
}; 