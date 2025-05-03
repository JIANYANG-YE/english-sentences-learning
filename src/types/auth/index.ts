/**
 * 认证相关类型定义
 */

// 用户类型
export interface User {
  id: string;
  username: string;
  email: string;
  displayName?: string;
  avatar?: string;
  role: 'basic' | 'premium' | 'admin' | 'teacher';
  membershipType: 'free' | 'basic' | 'premium';
  membershipExpiry?: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

// 登录凭证
export interface Credentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// 注册数据
export interface RegisterData {
  username: string;
  email: string;
  password: string;
  displayName?: string;
}

// 登录响应
export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

// 认证会话
export interface AuthSession {
  token: string;
  refreshToken: string;
  expiresAt: string;
  user: User;
}

// 认证状态
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// 用户设置
export interface UserSettings {
  userId: string;
  theme: 'light' | 'dark' | 'system';
  emailNotifications: boolean;
  dailyGoal: number;
  language: string;
  timezone: string;
}

// 认证操作类型
export enum AuthActionType {
  LOGIN_REQUEST = 'LOGIN_REQUEST',
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILURE = 'LOGIN_FAILURE',
  REGISTER_REQUEST = 'REGISTER_REQUEST',
  REGISTER_SUCCESS = 'REGISTER_SUCCESS',
  REGISTER_FAILURE = 'REGISTER_FAILURE',
  LOGOUT = 'LOGOUT',
  UPDATE_USER = 'UPDATE_USER',
  CLEAR_ERROR = 'CLEAR_ERROR'
}

// 认证操作
export type AuthAction =
  | { type: AuthActionType.LOGIN_REQUEST }
  | { type: AuthActionType.LOGIN_SUCCESS; payload: LoginResponse }
  | { type: AuthActionType.LOGIN_FAILURE; payload: string }
  | { type: AuthActionType.REGISTER_REQUEST }
  | { type: AuthActionType.REGISTER_SUCCESS; payload: LoginResponse }
  | { type: AuthActionType.REGISTER_FAILURE; payload: string }
  | { type: AuthActionType.LOGOUT }
  | { type: AuthActionType.UPDATE_USER; payload: User }
  | { type: AuthActionType.CLEAR_ERROR };

// API 请求类型
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  displayName?: string;
}

export interface RegisterResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
} 