'use client';

import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import type { User } from '../types/auth';

/**
 * 身份验证钩子
 * 
 * 提供身份验证相关功能的快捷访问
 */

// 直接重新导出来自AuthContext的useAuth
export { useAuth } from '@/contexts/AuthContext';

// 便捷钩子，仅暴露特定功能
import { useAuth as useAuthContext } from '@/contexts/AuthContext';

/**
 * 获取当前用户
 * @returns 当前用户对象或null
 */
export function useUser() {
  const { user } = useAuthContext();
  return user;
}

/**
 * 检查用户是否已认证
 * @returns 布尔值，表示用户是否已登录
 */
export function useIsAuthenticated() {
  const { isAuthenticated } = useAuthContext();
  return isAuthenticated;
}

/**
 * 获取认证加载状态
 * @returns 布尔值，表示认证是否正在加载
 */
export function useAuthLoading() {
  const { isLoading } = useAuthContext();
  return isLoading;
}

/**
 * 获取认证错误信息
 * @returns 错误信息或undefined
 */
export function useAuthError() {
  const { error } = useAuthContext();
  return error;
}

/**
 * 注销钩子
 * @returns 注销函数
 */
export function useLogout() {
  const { logout } = useAuthContext();
  return logout;
}

/**
 * 登录钩子
 * @returns 登录函数
 */
export function useLogin() {
  const { login } = useAuthContext();
  return login;
}

/**
 * 注册钩子
 * @returns 注册函数
 */
export function useRegister() {
  const { register } = useAuthContext();
  return register;
} 