/**
 * 认证相关工具
 */
import { post, get } from './api';
import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

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

interface JwtPayload {
  id: string;
  email: string;
  role: string;
  [key: string]: any;
}

/**
 * 签发JWT令牌
 */
export async function signJwtToken(payload: JwtPayload): Promise<string> {
  const secret = process.env.NEXTAUTH_SECRET;
  
  if (!secret) {
    throw new Error('JWT密钥未设置');
  }
  
  return jwt.sign(payload, secret, {
    expiresIn: '7d' // 令牌有效期7天
  });
}

/**
 * 验证JWT令牌
 */
export async function verifyJwtToken(token: string): Promise<JwtPayload | null> {
  try {
    const secret = process.env.NEXTAUTH_SECRET;
    
    if (!secret) {
      throw new Error('JWT密钥未设置');
    }
    
    const payload = jwt.verify(token, secret) as JwtPayload;
    return payload;
  } catch (error) {
    console.error('令牌验证失败:', error);
    return null;
  }
}

/**
 * 从请求头中获取并验证JWT令牌
 */
export async function getTokenFromRequest(request: NextRequest): Promise<JwtPayload | null> {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.split(' ')[1];
  return verifyJwtToken(token);
}

/**
 * 验证用户是否已认证
 */
export async function isAuthenticated(request: NextRequest): Promise<{
  authenticated: boolean;
  user?: JwtPayload;
}> {
  const user = await getTokenFromRequest(request);
  
  if (!user) {
    return { authenticated: false };
  }
  
  return {
    authenticated: true,
    user
  };
}

/**
 * 验证用户是否具有特定角色
 */
export async function hasRole(request: NextRequest, roles: string[]): Promise<{
  authenticated: boolean;
  hasRole: boolean;
  user?: JwtPayload;
}> {
  const { authenticated, user } = await isAuthenticated(request);
  
  if (!authenticated || !user) {
    return { authenticated: false, hasRole: false };
  }
  
  const hasRequiredRole = roles.includes(user.role);
  
  return {
    authenticated: true,
    hasRole: hasRequiredRole,
    user
  };
} 