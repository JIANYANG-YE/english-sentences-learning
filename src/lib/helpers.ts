/**
 * 辅助函数集合
 * 提供通用工具函数
 */

/**
 * 格式化日期
 * @param date 日期对象或字符串
 * @param format 格式化模板，默认为yyyy-MM-dd
 */
export const formatDate = (date: Date | string, format: string = 'yyyy-MM-dd'): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(d.getTime())) {
    return '无效日期';
  }
  
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const hours = d.getHours();
  const minutes = d.getMinutes();
  const seconds = d.getSeconds();
  
  const pad = (num: number): string => num.toString().padStart(2, '0');
  
  return format
    .replace('yyyy', year.toString())
    .replace('MM', pad(month))
    .replace('dd', pad(day))
    .replace('HH', pad(hours))
    .replace('mm', pad(minutes))
    .replace('ss', pad(seconds));
};

/**
 * 截断文本
 * @param text 原始文本
 * @param maxLength 最大长度
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength) + '...';
};

/**
 * 深拷贝对象
 * @param obj 原始对象
 */
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  return JSON.parse(JSON.stringify(obj));
};

/**
 * 随机生成UUID
 */
export const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * 计算进度百分比
 * @param current 当前值
 * @param total 总值
 */
export const calculatePercentage = (current: number, total: number): number => {
  if (total === 0) return 0;
  const percentage = (current / total) * 100;
  return Math.round(percentage * 100) / 100; // 保留两位小数
};

/**
 * 节流函数
 * @param func 需要节流的函数
 * @param delay 延迟时间（毫秒）
 */
export const throttle = <T extends (...args: any[]) => any>(func: T, delay: number): ((...args: Parameters<T>) => void) => {
  let lastCallTime = 0;
  
  return (...args: Parameters<T>): void => {
    const now = Date.now();
    if (now - lastCallTime >= delay) {
      func(...args);
      lastCallTime = now;
    }
  };
};

/**
 * 防抖函数
 * @param func 需要防抖的函数
 * @param delay 延迟时间（毫秒）
 */
export const debounce = <T extends (...args: any[]) => any>(func: T, delay: number): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  
  return (...args: Parameters<T>): void => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

/**
 * 获取浏览器语言
 */
export const getBrowserLanguage = (): string => {
  if (typeof window === 'undefined') return 'zh-CN';
  
  return navigator.language || (navigator as any).userLanguage || 'zh-CN';
};

/**
 * 检查设备类型
 */
export const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

/**
 * 数组分组
 * @param array 原始数组
 * @param keyFunc 分组键函数
 */
export const groupBy = <T, K extends string | number | symbol>(array: T[], keyFunc: (item: T) => K): Record<K, T[]> => {
  return array.reduce((result, item) => {
    const key = keyFunc(item);
    if (!result[key]) {
      result[key] = [];
    }
    result[key].push(item);
    return result;
  }, {} as Record<K, T[]>);
};

export default {
  formatDate,
  truncateText,
  deepClone,
  generateUUID,
  calculatePercentage,
  throttle,
  debounce,
  getBrowserLanguage,
  isMobileDevice,
  groupBy,
}; 