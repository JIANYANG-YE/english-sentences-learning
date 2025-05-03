/**
 * 认证相关工具
 */
import { post, get } from './api';

// 用户类型定义
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatarUrl?: string;
}

// 登录响应类型
export interface LoginResponse {
  user: User;
  token: string;
}

// 存储令牌
export function setToken(token: string): void {
  localStorage.setItem('auth_token', token);
}

// 获取令牌
export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
}

// 删除令牌
export function removeToken(): void {
  localStorage.removeItem('auth_token');
}

// 登录
export async function login(email: string, password: string): Promise<LoginResponse> {
  const response = await post<LoginResponse>('/auth/login', { email, password });
  setToken(response.token);
  return response;
}

// 注册
export async function register(name: string, email: string, password: string): Promise<LoginResponse> {
  const response = await post<LoginResponse>('/auth/register', { name, email, password });
  setToken(response.token);
  return response;
}

// 登出
export function logout(): void {
  removeToken();
  // 可以在这里添加跳转逻辑
}

// 获取当前用户信息
export async function getCurrentUser(): Promise<User | null> {
  try {
    const token = getToken();
    if (!token) return null;
    
    return await get<User>('/auth/me');
  } catch (error) {
    console.error('获取用户信息失败', error);
    return null;
  }
}

// 检查是否已登录
export function isLoggedIn(): boolean {
  return !!getToken();
} 