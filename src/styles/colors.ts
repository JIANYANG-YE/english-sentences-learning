/**
 * 颜色常量定义
 * 集中管理应用程序中使用的所有颜色
 */

// 主色调
export const PRIMARY = {
  light: '#4F46E5', // 浅色变体
  DEFAULT: '#4338CA', // 默认
  dark: '#3730A3', // 深色变体
};

// 辅助色调
export const SECONDARY = {
  light: '#10B981', // 浅色变体
  DEFAULT: '#059669', // 默认
  dark: '#047857', // 深色变体
};

// 灰度色阶
export const GRAY = {
  50: '#F9FAFB',
  100: '#F3F4F6',
  200: '#E5E7EB',
  300: '#D1D5DB',
  400: '#9CA3AF',
  500: '#6B7280',
  600: '#4B5563',
  700: '#374151',
  800: '#1F2937',
  900: '#111827',
};

// 背景色
export const BACKGROUND = {
  light: '#FFFFFF', // 浅色主题
  dark: '#1F2937', // 深色主题
};

// 文本色
export const TEXT = {
  light: '#1F2937', // 浅色主题
  dark: '#F9FAFB', // 深色主题
};

// 功能性颜色
export const FUNCTIONAL = {
  success: '#10B981', // 成功
  error: '#EF4444',   // 错误
  warning: '#F59E0B', // 警告
  info: '#3B82F6',    // 信息
};

/**
 * 浅色主题颜色集合
 */
export const LIGHT_THEME = {
  primary: PRIMARY.DEFAULT,
  primaryLight: PRIMARY.light,
  primaryDark: PRIMARY.dark,
  secondary: SECONDARY.DEFAULT,
  secondaryLight: SECONDARY.light,
  secondaryDark: SECONDARY.dark,
  background: BACKGROUND.light,
  text: TEXT.light,
  border: GRAY[200],
  divider: GRAY[200],
  hover: GRAY[100],
  ...FUNCTIONAL,
};

/**
 * 深色主题颜色集合
 */
export const DARK_THEME = {
  primary: PRIMARY.light,
  primaryLight: PRIMARY.DEFAULT,
  primaryDark: PRIMARY.dark,
  secondary: SECONDARY.light,
  secondaryLight: SECONDARY.DEFAULT,
  secondaryDark: SECONDARY.dark,
  background: BACKGROUND.dark,
  text: TEXT.dark,
  border: GRAY[700],
  divider: GRAY[700],
  hover: GRAY[800],
  ...FUNCTIONAL,
};

export default {
  PRIMARY,
  SECONDARY,
  GRAY,
  BACKGROUND,
  TEXT,
  FUNCTIONAL,
  LIGHT_THEME,
  DARK_THEME,
}; 