"use client";

import { useState, useEffect } from 'react';

/**
 * 一个自定义Hook，用于检测媒体查询是否匹配
 * @param query 要监听的媒体查询字符串，如 '(min-width: 768px)'
 * @returns 布尔值表示媒体查询是否匹配
 */
export function useMediaQuery(query: string): boolean {
  // 默认值为false，避免服务端渲染不匹配的问题
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // 避免SSR问题
    if (typeof window === 'undefined') return;

    // 创建媒体查询对象
    const media = window.matchMedia(query);
    
    // 设置初始值
    setMatches(media.matches);

    // 定义变更处理函数
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // 添加监听器
    media.addEventListener('change', listener);
    
    // 清理函数
    return () => {
      media.removeEventListener('change', listener);
    };
  }, [query]); // 当查询字符串变化时重新执行

  return matches;
}

// 预定义的断点
export const useIsMobile = () => useMediaQuery('(max-width: 767px)');
export const useIsTablet = () => useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
export const useIsDesktop = () => useMediaQuery('(min-width: 1024px)');
export const useIsDarkMode = () => useMediaQuery('(prefers-color-scheme: dark)');
export const useReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)'); 