import { LearningStyle } from '@/components/ai/LearningStyleAnalyzer';
import { createContext, useContext } from 'react';
import { useState, useEffect, useCallback } from 'react';

// 定义全局状态类型
export interface GlobalState {
  // 用户相关状态
  user: {
    id: string;
    name: string;
    level: string;
    preferences: {
      theme: 'light' | 'dark' | 'system';
      learningStyle?: LearningStyle;
      notifications: boolean;
    };
  } | null;
  
  // 学习数据
  learningData: {
    // 学习进度
    progress: {
      totalSessions: number;
      completedLessons: number;
      totalStudyTime: number; // 分钟
      lastActivity: string; // ISO日期字符串
    };
    
    // 学习活动
    activities: Array<{
      id: string;
      type: string;
      startTime: string; // ISO日期字符串
      endTime: string; // ISO日期字符串
      performance: number; // 0-100
      completed: boolean;
    }>;
    
    // 学习风格分析结果
    styleAnalysis: {
      primaryStyle?: LearningStyle;
      styles?: Record<LearningStyle, number>; // 各风格得分
      lastUpdated?: string; // ISO日期字符串
    };
    
    // 学习弱点预测
    weaknesses: Array<{
      id: string;
      type: string;
      severity: 'low' | 'medium' | 'high';
      description: string;
      detectedAt: string; // ISO日期字符串
      status: 'active' | 'in_progress' | 'resolved';
    }>;
  };
  
  // 社区相关
  community: {
    notifications: number;
    activeDiscussions: number;
    savedResources: string[]; // 资源ID
  };
  
  // 系统状态
  system: {
    isLoading: boolean;
    lastSynced: string | null; // ISO日期字符串
    errors: Array<{
      id: string;
      message: string;
      timestamp: string; // ISO日期字符串
    }>;
  };
}

// 初始状态
const initialState: GlobalState = {
  user: null,
  learningData: {
    progress: {
      totalSessions: 0,
      completedLessons: 0,
      totalStudyTime: 0,
      lastActivity: new Date().toISOString()
    },
    activities: [],
    styleAnalysis: {},
    weaknesses: []
  },
  community: {
    notifications: 0,
    activeDiscussions: 0,
    savedResources: []
  },
  system: {
    isLoading: false,
    lastSynced: null,
    errors: []
  }
};

// 定义状态动作类型
type Action = 
  | { type: 'SET_USER', payload: GlobalState['user'] }
  | { type: 'UPDATE_PREFERENCES', payload: Partial<NonNullable<GlobalState['user']>['preferences']> }
  | { type: 'LOG_ACTIVITY', payload: GlobalState['learningData']['activities'][0] }
  | { type: 'UPDATE_PROGRESS', payload: Partial<GlobalState['learningData']['progress']> }
  | { type: 'SET_STYLE_ANALYSIS', payload: GlobalState['learningData']['styleAnalysis'] }
  | { type: 'UPDATE_WEAKNESSES', payload: GlobalState['learningData']['weaknesses'] }
  | { type: 'ADD_WEAKNESS', payload: GlobalState['learningData']['weaknesses'][0] }
  | { type: 'UPDATE_WEAKNESS_STATUS', payload: { id: string, status: 'active' | 'in_progress' | 'resolved' } }
  | { type: 'SET_LOADING', payload: boolean }
  | { type: 'SYNC_COMPLETE', payload: string }
  | { type: 'ADD_ERROR', payload: Omit<GlobalState['system']['errors'][0], 'id'> }
  | { type: 'CLEAR_ERROR', payload: string }
  | { type: 'RESET_STATE' };

// 状态变更回调函数类型
type StateChangeListener<T> = (newState: T, oldState: T) => void;

// 状态存储选项
interface StateOptions {
  persist?: boolean;
  storageKey?: string;
  storageType?: 'local' | 'session';
}

/**
 * 状态管理类
 * 提供全局状态管理、更新和订阅功能
 */
class StateManager {
  private states: Map<string, any> = new Map();
  private listeners: Map<string, Set<StateChangeListener<any>>> = new Map();
  private options: Map<string, StateOptions> = new Map();
  private initialized: boolean = false;

  constructor() {
    // 初始化状态管理器
    this.initialize();
  }

  /**
   * 初始化状态管理器
   */
  private initialize(): void {
    if (typeof window !== 'undefined') {
      // 在浏览器环境中从存储中加载持久化状态
      this.loadPersistedStates();
      this.initialized = true;

      // 在页面卸载前保存状态
      window.addEventListener('beforeunload', () => {
        this.persistStates();
      });
    }
  }

  /**
   * 从存储中加载持久化状态
   */
  private loadPersistedStates(): void {
    if (typeof window === 'undefined') return;

    try {
      // 从localStorage获取所有存储的状态键
      const stateKeys = Object.keys(localStorage)
        .filter(key => key.startsWith('appState:'))
        .map(key => key.replace('appState:', ''));

      // 加载每个持久化状态
      stateKeys.forEach(key => {
        const storageKey = `appState:${key}`;
        const storedState = localStorage.getItem(storageKey);
        
        if (storedState) {
          try {
            const state = JSON.parse(storedState);
            this.states.set(key, state);
            this.options.set(key, { persist: true, storageKey });
          } catch (error) {
            console.error(`Failed to parse stored state for key ${key}:`, error);
          }
        }
      });
    } catch (error) {
      console.error('Failed to load persisted states:', error);
    }
  }

  /**
   * 将状态持久化到存储
   */
  private persistStates(): void {
    if (typeof window === 'undefined') return;

    try {
      // 遍历所有需要持久化的状态
      this.options.forEach((options, key) => {
        if (options.persist) {
          const state = this.states.get(key);
          const storageKey = options.storageKey || `appState:${key}`;
          const storageType = options.storageType || 'local';
          
          if (state !== undefined) {
            const storage = storageType === 'local' ? localStorage : sessionStorage;
            storage.setItem(storageKey, JSON.stringify(state));
          }
        }
      });
    } catch (error) {
      console.error('Failed to persist states:', error);
    }
  }

  /**
   * 注册一个状态
   * @param key 状态的唯一键
   * @param initialState 初始状态值
   * @param options 状态选项
   * @returns 当前状态
   */
  registerState<T>(key: string, initialState: T, options: StateOptions = {}): T {
    if (!this.states.has(key)) {
      this.states.set(key, initialState);
      this.listeners.set(key, new Set());
      this.options.set(key, options);
      
      // 如果需要持久化且已初始化，则立即持久化
      if (options.persist && this.initialized) {
        const storageKey = options.storageKey || `appState:${key}`;
        const storageType = options.storageType || 'local';
        const storage = storageType === 'local' ? localStorage : sessionStorage;
        
        try {
          storage.setItem(storageKey, JSON.stringify(initialState));
        } catch (error) {
          console.error(`Failed to persist state for key ${key}:`, error);
        }
      }
    }
    
    return this.states.get(key);
  }

  /**
   * 获取状态
   * @param key 状态的唯一键
   * @returns 当前状态
   */
  getState<T>(key: string): T | undefined {
    return this.states.get(key);
  }

  /**
   * 设置状态
   * @param key 状态的唯一键
   * @param newState 新状态值或更新函数
   */
  setState<T>(key: string, newState: T | ((prevState: T) => T)): void {
    if (!this.states.has(key)) {
      console.error(`State with key "${key}" does not exist.`);
      return;
    }

    const oldState = this.states.get(key);
    const actualNewState = typeof newState === 'function' 
      ? (newState as Function)(oldState) 
      : newState;
    
    // 如果状态没有变化，则不做任何处理
    if (JSON.stringify(oldState) === JSON.stringify(actualNewState)) {
      return;
    }
    
    // 更新状态
    this.states.set(key, actualNewState);
    
    // 通知监听器
    this.notifyListeners(key, actualNewState, oldState);
    
    // 持久化状态
    const options = this.options.get(key);
    if (options?.persist) {
      this.persistState(key);
    }
  }

  /**
   * 持久化单个状态
   * @param key 状态的唯一键
   */
  private persistState(key: string): void {
    if (typeof window === 'undefined') return;
    
    const options = this.options.get(key);
    if (!options?.persist) return;
    
    const state = this.states.get(key);
    const storageKey = options.storageKey || `appState:${key}`;
    const storageType = options.storageType || 'local';
    
    try {
      const storage = storageType === 'local' ? localStorage : sessionStorage;
      storage.setItem(storageKey, JSON.stringify(state));
    } catch (error) {
      console.error(`Failed to persist state for key ${key}:`, error);
    }
  }

  /**
   * 订阅状态变更
   * @param key 状态的唯一键
   * @param listener 监听函数
   * @returns 取消订阅的函数
   */
  subscribe<T>(key: string, listener: StateChangeListener<T>): () => void {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    
    const listeners = this.listeners.get(key)!;
    listeners.add(listener);
    
    // 返回取消订阅的函数
    return () => {
      listeners.delete(listener);
    };
  }

  /**
   * 通知监听器状态已变更
   * @param key 状态的唯一键
   * @param newState 新状态
   * @param oldState 旧状态
   */
  private notifyListeners<T>(key: string, newState: T, oldState: T): void {
    const listeners = this.listeners.get(key);
    if (!listeners) return;
    
    listeners.forEach(listener => {
      try {
        listener(newState, oldState);
      } catch (error) {
        console.error(`Error in state listener for key "${key}":`, error);
      }
    });
  }

  /**
   * 重置状态到初始值
   * @param key 状态的唯一键
   * @param initialState 初始状态
   */
  resetState<T>(key: string, initialState: T): void {
    this.setState(key, initialState);
  }

  /**
   * 清除所有状态和监听器
   */
  clear(): void {
    this.states.clear();
    this.listeners.clear();
    this.options.clear();
  }
}

// 创建单例实例
const stateManager = new StateManager();

/**
 * 使用全局状态的Hook
 * @param key 状态的唯一键
 * @param initialState 初始状态
 * @param options 状态选项
 * @returns [状态, 设置状态函数]
 */
export function useGlobalState<T>(
  key: string, 
  initialState: T, 
  options: StateOptions = {}
): [T, (newState: T | ((prevState: T) => T)) => void] {
  // 注册或获取状态
  const [state, setState] = useState<T>(() => {
    // 如果状态已存在，使用现有状态
    const existingState = stateManager.getState<T>(key);
    if (existingState !== undefined) {
      return existingState;
    }
    
    // 否则注册新状态
    return stateManager.registerState<T>(key, initialState, options);
  });
  
  // 更新状态的函数
  const updateGlobalState = useCallback((newState: T | ((prevState: T) => T)) => {
    stateManager.setState<T>(key, newState);
  }, [key]);
  
  // 订阅状态变更
  useEffect(() => {
    const unsubscribe = stateManager.subscribe<T>(key, (newState) => {
      setState(newState);
    });
    
    // 组件卸载时取消订阅
    return () => {
      unsubscribe();
    };
  }, [key]);
  
  return [state, updateGlobalState];
}

export default stateManager;

// 创建全局状态管理器实例
export const stateManagerInstance = new StateManager();

// 创建React上下文
export const StateContext = createContext<StateManager>(stateManagerInstance);

// 创建自定义Hook
export const useStateManager = () => useContext(StateContext);

// 加载持久化的状态
export const loadPersistedState = (): void => {
  try {
    if (typeof window !== 'undefined') {
      const persistedState = localStorage.getItem('app_state');
      if (persistedState) {
        const parsedState = JSON.parse(persistedState);
        stateManagerInstance.setState('user', parsedState.user);
        // 加载其他需要的状态...
      }
    }
  } catch (error) {
    console.error('Failed to load persisted state:', error);
  }
}; 