'use client';

import { useThemeContext } from '@/contexts/ThemeContext';
import { useState, useEffect } from 'react';
import { LIGHT_THEME, DARK_THEME } from '@/styles/colors';
import { THEMES } from '@/lib/constants';

/**
 * 主题钩子
 * 提供主题相关的所有功能和数据
 */
export function useTheme() {
  const context = useThemeContext();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // 获取当前主题的颜色变量
  const getThemeColors = () => {
    return context.isDark ? DARK_THEME : LIGHT_THEME;
  };
  
  // 切换到指定主题
  const changeTheme = (theme: string) => {
    if (Object.values(THEMES).includes(theme as any)) {
      context.setTheme(theme);
    } else {
      console.warn(`主题 "${theme}" 不支持. 支持的主题有: ${Object.values(THEMES).join(', ')}`);
    }
  };
  
  // 获取CSS变量值
  const getCssVar = (name: string): string => {
    if (typeof window === 'undefined' || !mounted) {
      return '';
    }
    
    return getComputedStyle(document.documentElement)
      .getPropertyValue(`--${name}`)
      .trim();
  };
  
  // 动态获取对比色（用于确保文本在背景上有足够的对比度）
  const getContrastColor = (hexColor: string): string => {
    // 移除颜色字符串中的 # 号
    const color = hexColor.replace('#', '');
    
    // 将十六进制颜色转换为RGB
    const r = parseInt(color.substring(0, 2), 16) || 0;
    const g = parseInt(color.substring(2, 4), 16) || 0;
    const b = parseInt(color.substring(4, 6), 16) || 0;
    
    // 计算亮度 (基于YIQ公式)
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    
    // 根据亮度返回黑色或白色
    return yiq >= 128 ? '#000000' : '#FFFFFF';
  };
  
  // 获取特定主题颜色
  const getColor = (colorName: string): string => {
    const colors = getThemeColors();
    return (colors as any)[colorName] || '';
  };
  
  // 设置动态CSS变量
  const setCssVar = (name: string, value: string): void => {
    if (typeof window === 'undefined' || !mounted) {
      return;
    }
    
    document.documentElement.style.setProperty(`--${name}`, value);
  };
  
  return {
    ...context,
    mounted,
    colors: getThemeColors(),
    getThemeColors,
    changeTheme,
    getCssVar,
    getContrastColor,
    getColor,
    setCssVar,
  };
}

export default useTheme; 