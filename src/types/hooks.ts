/**
 * Hooks类型定义
 */

import type { CoreUser } from './core';
import { FormEvent } from 'react';

// 主题Hook返回值类型
export interface UseThemeReturn {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

// 认证Hook返回值类型
export interface UseAuthReturn {
  user: CoreUser | null;
  loading: boolean;
  error: Error | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: Partial<CoreUser>) => Promise<void>;
  updateProfile: (userData: Partial<CoreUser>) => Promise<void>;
}

// 分页Hook参数类型
export interface UsePaginationParams {
  initialPage?: number;
  initialPageSize?: number;
  total?: number;
}

// 分页Hook返回值类型
export interface UsePaginationReturn {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  goToPage: (page: number) => void;
}

// 搜索Hook参数类型
export interface UseSearchParams {
  initialQuery?: string;
  debounceMs?: number;
  onSearch?: (query: string) => void;
}

// 搜索Hook返回值类型
export interface UseSearchReturn {
  query: string;
  setQuery: (query: string) => void;
  debouncedQuery: string;
  isSearching: boolean;
}

// 表单值类型
export type FormValue = string | number | boolean | Date | File | null | undefined;

// 表单Hook参数类型
export interface UseFormParams<T extends Record<string, FormValue>> {
  initialValues: T;
  onSubmit: (values: T) => Promise<void>;
  validate?: (values: T) => Record<string, string>;
}

// 表单Hook返回值类型
export interface UseFormReturn<T extends Record<string, FormValue>> {
  values: T;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  handleChange: (name: keyof T, value: FormValue) => void;
  handleBlur: (name: keyof T) => void;
  handleSubmit: (e: FormEvent) => Promise<void>;
  resetForm: () => void;
  setFieldValue: (name: keyof T, value: FormValue) => void;
  setFieldError: (name: keyof T, error: string) => void;
  isSubmitting: boolean;
} 