/**
 * API请求封装
 */

// 基础API URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

/**
 * 封装的fetch函数
 */
export async function fetchAPI<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `API请求失败：${response.status}`);
  }

  return response.json();
}

/**
 * GET请求
 */
export function get<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  return fetchAPI<T>(endpoint, {
    ...options,
    method: 'GET',
  });
}

/**
 * POST请求
 */
export function post<T>(endpoint: string, data: any, options: RequestInit = {}): Promise<T> {
  return fetchAPI<T>(endpoint, {
    ...options,
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * PUT请求
 */
export function put<T>(endpoint: string, data: any, options: RequestInit = {}): Promise<T> {
  return fetchAPI<T>(endpoint, {
    ...options,
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * DELETE请求
 */
export function del<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  return fetchAPI<T>(endpoint, {
    ...options,
    method: 'DELETE',
  });
} 