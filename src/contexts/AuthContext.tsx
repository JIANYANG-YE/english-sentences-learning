'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from './ToastContext';
import { CoreUser } from '@/types/core';

interface AuthContextValue {
  user: CoreUser | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Partial<CoreUser> & { password: string }) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  error?: string;
}

// 导出AuthContext供钩子使用
export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<CoreUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const router = useRouter();
  const toast = useToast();

  // 初始化时检查认证状态
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // 从localStorage获取用户信息
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Failed to check auth:', error);
        setError('认证检查失败');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // 登录
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(undefined);
    try {
      // 这里模拟API请求，实际项目中应替换为真实API调用
      // const response = await authService.login(email, password);
      
      // 模拟API响应
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 模拟成功登录
      const mockUser: CoreUser = {
        id: '1',
        name: '测试用户',
        email,
        role: 'user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // 保存用户信息到 localStorage
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      
      // 显示成功提示
      toast.showToast('登录成功！', 'success');
      
      // 重定向到仪表盘
      router.push('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      setError('登录失败，请检查您的凭据');
      toast.showToast('登录失败，请检查您的凭据。', 'error');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 注册
  const register = async (userData: Partial<CoreUser> & { password: string }) => {
    setIsLoading(true);
    setError(undefined);
    try {
      // 这里模拟API请求，实际项目中应替换为真实API调用
      // const response = await authService.register(userData);
      
      // 模拟API响应
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 模拟成功注册
      const mockUser: CoreUser = {
        id: '2',
        name: userData.name || '新用户',
        email: userData.email || '',
        role: 'user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // 保存用户信息到 localStorage
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      
      // 显示成功提示
      toast.showToast('注册成功！', 'success');
      
      // 重定向到仪表盘
      router.push('/dashboard');
    } catch (error) {
      console.error('Registration failed:', error);
      setError('注册失败，请稍后再试');
      toast.showToast('注册失败，请稍后再试。', 'error');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 登出
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    toast.showToast('您已成功登出！', 'info');
    router.push('/');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isLoading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 