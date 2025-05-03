import { Credentials, RegisterData, LoginResponse, User } from '../types/auth';
import apiClient from '../lib/api-client';

/**
 * 用户登录
 * @param credentials 登录凭证（邮箱和密码）
 */
export const apiLogin = async (credentials: Credentials): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
    return response;
  } catch (error) {
    console.error('登录失败:', error);
    throw error;
  }
};

/**
 * 用户注册
 * @param data 注册数据（邮箱、密码和用户名）
 */
export const apiRegister = async (data: RegisterData): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post<LoginResponse>('/auth/register', data);
    return response;
  } catch (error) {
    console.error('注册失败:', error);
    throw error;
  }
};

/**
 * 用户登出
 */
export const apiLogout = async (): Promise<void> => {
  try {
    await apiClient.post('/auth/logout');
    return;
  } catch (error) {
    console.error('登出失败:', error);
    throw error;
  }
};

/**
 * 刷新认证令牌
 */
export const apiRefreshToken = async (): Promise<{ token: string; refreshToken: string }> => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('刷新令牌不存在');
    }
    
    const response = await apiClient.post<{ token: string; refreshToken: string }>('/auth/refresh-token', { refreshToken });
    
    // 更新本地存储中的令牌
    localStorage.setItem('token', response.token);
    localStorage.setItem('refreshToken', response.refreshToken);
    
    return response;
  } catch (error) {
    console.error('刷新令牌失败:', error);
    throw error;
  }
};

/**
 * 获取当前用户信息
 */
export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await apiClient.get<User>('/auth/me');
    return response;
  } catch (error) {
    console.error('获取用户信息失败:', error);
    throw error;
  }
};

/**
 * 更新用户信息
 * @param userId 用户ID
 * @param userData 更新的用户数据
 */
export const updateUserProfile = async (userId: string, userData: Partial<User>): Promise<User> => {
  try {
    const response = await apiClient.put<User>(`/users/${userId}`, userData);
    return response;
  } catch (error) {
    console.error('更新用户信息失败:', error);
    throw error;
  }
};

/**
 * 更改用户密码
 * @param userId 用户ID
 * @param currentPassword 当前密码
 * @param newPassword 新密码
 */
export const changePassword = async (
  userId: string, 
  currentPassword: string, 
  newPassword: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await apiClient.put<{ success: boolean; message: string }>(
      `/users/${userId}/change-password`, 
      { currentPassword, newPassword }
    );
    return response;
  } catch (error) {
    console.error('更改密码失败:', error);
    throw error;
  }
};

/**
 * 请求重置密码
 * @param email 用户邮箱
 */
export const requestPasswordReset = async (email: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await apiClient.post<{ success: boolean; message: string }>(
      '/auth/request-password-reset', 
      { email }
    );
    return response;
  } catch (error) {
    console.error('请求重置密码失败:', error);
    throw error;
  }
};

/**
 * 使用令牌重置密码
 * @param token 重置密码令牌
 * @param newPassword 新密码
 */
export const resetPassword = async (
  token: string, 
  newPassword: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await apiClient.post<{ success: boolean; message: string }>(
      '/auth/reset-password', 
      { token, newPassword }
    );
    return response;
  } catch (error) {
    console.error('重置密码失败:', error);
    throw error;
  }
}; 