import { theme } from './theme';

/**
 * 颜色处理工具函数
 */
export const colorUtils = {
  /**
   * 设置颜色透明度
   */
  setOpacity: (color: string, opacity: number): string => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  },

  /**
   * 混合两种颜色
   */
  mix: (color1: string, color2: string, weight: number = 0.5): string => {
    const hex1 = color1.replace('#', '');
    const hex2 = color2.replace('#', '');
    
    const r1 = parseInt(hex1.substring(0, 2), 16);
    const g1 = parseInt(hex1.substring(2, 4), 16);
    const b1 = parseInt(hex1.substring(4, 6), 16);
    
    const r2 = parseInt(hex2.substring(0, 2), 16);
    const g2 = parseInt(hex2.substring(2, 4), 16);
    const b2 = parseInt(hex2.substring(4, 6), 16);
    
    const r = Math.round(r1 * weight + r2 * (1 - weight));
    const g = Math.round(g1 * weight + g2 * (1 - weight));
    const b = Math.round(b1 * weight + b2 * (1 - weight));
    
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }
};

/**
 * 响应式工具函数
 */
export const responsiveUtils = {
  /**
   * 获取响应式断点值
   */
  getBreakpoint: (key: keyof typeof theme.breakpoints): string => {
    return theme.breakpoints[key];
  },

  /**
   * 生成媒体查询
   */
  mediaQuery: (breakpoint: keyof typeof theme.breakpoints, direction: 'up' | 'down' = 'up'): string => {
    const value = theme.breakpoints[breakpoint];
    return direction === 'up' 
      ? `@media (min-width: ${value})`
      : `@media (max-width: ${value})`;
  }
};

/**
 * 动画工具函数
 */
export const animationUtils = {
  /**
   * 生成过渡动画
   */
  transition: (properties: string[] = ['all'], duration: keyof typeof theme.transitions = 'DEFAULT'): string => {
    return properties
      .map(prop => `${prop} ${theme.transitions[duration]} ease-in-out`)
      .join(', ');
  }
}; 