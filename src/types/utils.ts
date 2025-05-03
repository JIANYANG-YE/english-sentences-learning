/**
 * 工具函数类型定义
 */

// 日期格式化选项
export interface DateFormatOptions {
  format?: string;
  locale?: string;
  timezone?: string;
}

// 数字格式化选项
export interface NumberFormatOptions {
  locale?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  style?: 'decimal' | 'currency' | 'percent';
  currency?: string;
}

// 字符串截取选项
export interface TruncateOptions {
  length: number;
  suffix?: string;
  preserveWords?: boolean;
}

// 防抖选项
export interface DebounceOptions {
  wait?: number;
  leading?: boolean;
  trailing?: boolean;
  maxWait?: number;
}

// 节流选项
export interface ThrottleOptions {
  wait?: number;
  leading?: boolean;
  trailing?: boolean;
}

// 深拷贝选项
export interface DeepCloneOptions {
  circular?: boolean;
  dateToJSON?: boolean;
}

// 对象合并选项
export interface MergeOptions {
  deep?: boolean;
  array?: 'replace' | 'concat' | 'unique';
}

// 定义项目通用类型
export type Item = Record<string, unknown>;

// 数组分组选项
export interface GroupByOptions {
  key: string | ((item: Item) => string);
  transform?: (items: Item[]) => unknown;
}

// 文件上传选项
export interface FileUploadOptions {
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  maxFiles?: number;
}

// 图片处理选项
export interface ImageProcessOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp';
  fit?: 'cover' | 'contain' | 'fill';
}

// 视频处理选项
export interface VideoProcessOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'mp4' | 'webm';
  duration?: number;
}

// 音频处理选项
export interface AudioProcessOptions {
  quality?: number;
  format?: 'mp3' | 'wav' | 'ogg';
  duration?: number;
}

// 压缩选项
export interface CompressOptions {
  level?: number;
  strategy?: 'default' | 'huffman' | 'rle';
  windowBits?: number;
  memLevel?: number;
}

// 加密选项
export interface EncryptOptions {
  algorithm?: string;
  key?: string;
  iv?: string;
  encoding?: 'utf8' | 'base64' | 'hex';
}

// 解密选项
export interface DecryptOptions {
  algorithm?: string;
  key?: string;
  iv?: string;
  encoding?: 'utf8' | 'base64' | 'hex';
}

// 哈希选项
export interface HashOptions {
  algorithm?: string;
  encoding?: 'utf8' | 'base64' | 'hex';
}

// 验证选项
export interface ValidationOptions {
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: unknown) => boolean | string;
}

// 排序选项
export interface SortOptions {
  key?: string | ((item: Item) => unknown);
  order?: 'asc' | 'desc';
  compare?: (a: unknown, b: unknown) => number;
}

// 过滤选项
export interface FilterOptions {
  key?: string | ((item: Item) => unknown);
  value?: unknown;
  operator?: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'startsWith' | 'endsWith';
  custom?: (item: Item) => boolean;
} 