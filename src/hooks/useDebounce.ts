"use client";

import { useState, useEffect } from 'react';

/**
 * 防抖Hook，用于延迟处理频繁变化的值
 * @param value 需要防抖的值
 * @param delay 延迟时间（毫秒），默认300ms
 * @returns 防抖后的值
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // 设置定时器延迟更新值
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // 在下一次effect运行前或组件卸载时清除定时器
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * 防抖函数Hook，用于减少函数调用频率
 * @param fn 需要防抖的函数
 * @param delay 延迟时间（毫秒），默认300ms
 * @returns 防抖后的函数
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 300
): (...args: Parameters<T>) => void {
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const debouncedFn = (...args: Parameters<T>): void => {
    // 如果已存在定时器，则清除
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // 设置新的定时器
    const id = setTimeout(() => {
      fn(...args);
    }, delay);

    setTimeoutId(id);
  };

  // 组件卸载时清除定时器
  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  return debouncedFn;
} 