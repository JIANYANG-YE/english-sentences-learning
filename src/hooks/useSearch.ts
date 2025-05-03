import { useState, useEffect, useCallback } from 'react';
import type { UseSearchParams, UseSearchReturn } from '@/types/hooks';

/**
 * 搜索Hook - 实现搜索功能和防抖
 * 
 * @param {Object} params - 参数
 * @param {string} [params.initialQuery=''] - 初始搜索关键词
 * @param {number} [params.debounceMs=300] - 防抖延迟时间(毫秒)
 * @param {Function} [params.onSearch] - 搜索回调函数
 * @returns {UseSearchReturn} 搜索数据和方法
 * 
 * @example
 * ```tsx
 * const { query, setQuery, debouncedQuery, isSearching } = useSearch({
 *   initialQuery: '',
 *   debounceMs: 500,
 *   onSearch: (query) => {
 *     // 执行搜索
 *     fetchSearchResults(query);
 *   }
 * });
 * ```
 */
const useSearch = ({
  initialQuery = '',
  debounceMs = 300,
  onSearch,
}: UseSearchParams = {}): UseSearchReturn => {
  // 搜索关键词状态
  const [query, setQuery] = useState(initialQuery);
  // 防抖后的搜索关键词
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  // 是否正在搜索
  const [isSearching, setIsSearching] = useState(false);
  
  // 设置搜索关键词
  const handleSetQuery = useCallback((value: string) => {
    setQuery(value);
    setIsSearching(true);
  }, []);
  
  // 防抖效果
  useEffect(() => {
    // 设置定时器
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      // 执行搜索回调
      if (onSearch) {
        try {
          onSearch(query);
        } finally {
          setIsSearching(false);
        }
      } else {
        setIsSearching(false);
      }
    }, debounceMs);
    
    // 清除上一个定时器
    return () => {
      clearTimeout(timer);
    };
  }, [query, debounceMs, onSearch]);
  
  return {
    query,
    setQuery: handleSetQuery,
    debouncedQuery,
    isSearching,
  };
};

export default useSearch; 