/**
 * 应用程序常量
 */

// 应用信息
export const APP_NAME = '英语学习平台';
export const SITE_NAME = '英语学习平台';
export const APP_DESCRIPTION = '提供优质的英语学习资源，帮助你提高英语水平';
export const APP_URL = 'https://example.com';

// API配置
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.example.com';
export const API_TIMEOUT = 10000; // 10秒超时

// 分页默认值
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

// 本地存储键
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language',
};

// 主题配置
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
};

// 路由路径
export const ROUTES = {
  HOME: '/',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  DASHBOARD: '/dashboard',
  COURSES: '/courses',
  SHOP: '/shop',
  PRACTICE: '/practice',
  PROFILE: '/profile',
  SETTINGS: '/settings',
};

// 错误消息
export const ERROR_MESSAGES = {
  GENERAL: '发生错误，请稍后再试',
  NETWORK: '网络连接错误，请检查您的互联网连接',
  UNAUTHORIZED: '您的登录已过期，请重新登录',
  FORBIDDEN: '您没有权限访问此资源',
  NOT_FOUND: '未找到请求的资源',
  VALIDATION: '输入验证失败，请检查您的输入',
};

// 多语言
export const LANGUAGES = {
  ZH_CN: 'zh-CN',
  EN_US: 'en-US',
};

// 课程难度
export const COURSE_LEVELS = {
  BEGINNER: '初级',
  INTERMEDIATE: '中级',
  ADVANCED: '高级',
};

// 默认缓存时间（秒）
export const CACHE_DURATION = {
  SHORT: 60, // 1分钟
  MEDIUM: 300, // 5分钟
  LONG: 3600, // 1小时
  DAY: 86400, // 1天
};

// Analytics事件
export const ANALYTICS_EVENTS = {
  PAGE_VIEW: 'page_view',
  BUTTON_CLICK: 'button_click',
  COURSE_VIEW: 'course_view',
  COURSE_PURCHASE: 'course_purchase',
  LESSON_START: 'lesson_start',
  LESSON_COMPLETE: 'lesson_complete',
  EXERCISE_COMPLETE: 'exercise_complete',
  LOGIN: 'login',
  REGISTER: 'register',
  SEARCH: 'search',
};

// 媒体查询断点
export const BREAKPOINTS = {
  SM: '640px',
  MD: '768px',
  LG: '1024px',
  XL: '1280px',
  XXL: '1536px',
}; 