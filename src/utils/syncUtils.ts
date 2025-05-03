import { stateManager, GlobalState } from '@/services/stateManagementService';

// 数据同步配置
interface SyncConfig {
  // 同步间隔（毫秒）
  syncInterval: number;
  // 同步超时（毫秒）
  syncTimeout: number;
  // 重试次数
  maxRetries: number;
  // 重试延迟（毫秒）
  retryDelay: number;
  // 同步URL
  apiEndpoint: string;
}

// 默认同步配置
const defaultSyncConfig: SyncConfig = {
  syncInterval: 60000, // 1分钟
  syncTimeout: 30000,  // 30秒
  maxRetries: 3,
  retryDelay: 5000,    // 5秒
  apiEndpoint: '/api/sync'
};

// 同步状态
type SyncStatus = 'idle' | 'syncing' | 'success' | 'error';

// 同步管理器
class SyncManager {
  private config: SyncConfig;
  private lastSyncTimestamp: number | null = null;
  private syncTimer: NodeJS.Timeout | null = null;
  private status: SyncStatus = 'idle';
  private retryCount: number = 0;
  private pendingChanges: Map<string, any> = new Map();
  
  constructor(config: Partial<SyncConfig> = {}) {
    this.config = { ...defaultSyncConfig, ...config };
    this.initializeSync();
  }
  
  // 初始化同步
  private initializeSync(): void {
    if (typeof window !== 'undefined') {
      // 添加窗口事件监听器
      window.addEventListener('online', this.handleOnline);
      window.addEventListener('offline', this.handleOffline);
      window.addEventListener('beforeunload', this.syncBeforeUnload);
      
      // 开始定时同步
      this.startSyncTimer();
    }
  }
  
  // 启动同步定时器
  private startSyncTimer(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
    }
    
    this.syncTimer = setInterval(() => {
      this.syncData();
    }, this.config.syncInterval);
  }
  
  // 停止同步定时器
  private stopSyncTimer(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
      this.syncTimer = null;
    }
  }
  
  // 在线处理程序
  private handleOnline = (): void => {
    console.log('设备在线，恢复同步');
    this.startSyncTimer();
    // 立即尝试同步挂起的更改
    this.syncData(true);
  }
  
  // 离线处理程序
  private handleOffline = (): void => {
    console.log('设备离线，暂停同步');
    this.stopSyncTimer();
  }
  
  // 页面关闭前同步
  private syncBeforeUnload = (event: BeforeUnloadEvent): void => {
    if (this.pendingChanges.size > 0) {
      // 尝试同步挂起的更改
      this.syncData(true);
      
      // 如果有未同步的重要数据，可以提示用户
      if (this.pendingChanges.size > 0) {
        const message = '有未保存的更改。确定要离开吗？';
        event.returnValue = message;
      }
    }
  }
  
  // 跟踪更改
  public trackChange(path: string, value: any): void {
    this.pendingChanges.set(path, value);
  }
  
  // 计算对象的差异
  public calculateDiff(original: any, updated: any, path: string = ''): Map<string, any> {
    const diff = new Map<string, any>();
    
    // 如果两者类型不同或者一个为null，另一个不为null
    if (typeof original !== typeof updated || 
        (original === null && updated !== null) || 
        (original !== null && updated === null)) {
      diff.set(path, updated);
      return diff;
    }
    
    // 如果不是对象，直接比较值
    if (typeof original !== 'object' || original === null) {
      if (original !== updated) {
        diff.set(path, updated);
      }
      return diff;
    }
    
    // 处理数组
    if (Array.isArray(original) && Array.isArray(updated)) {
      if (JSON.stringify(original) !== JSON.stringify(updated)) {
        diff.set(path, updated);
      }
      return diff;
    }
    
    // 处理对象
    // 合并两个对象的键并去重
    const originalKeys = Object.keys(original);
    const updatedKeys = Object.keys(updated);
    const allKeys = originalKeys.concat(updatedKeys.filter(key => !originalKeys.includes(key)));
    
    for (const key of allKeys) {
      const currentPath = path ? `${path}.${key}` : key;
      
      // 如果键只存在于更新后的对象中
      if (!(key in original)) {
        diff.set(currentPath, updated[key]);
        continue;
      }
      
      // 如果键只存在于原始对象中
      if (!(key in updated)) {
        diff.set(currentPath, undefined); // 标记为删除
        continue;
      }
      
      // 递归比较嵌套对象
      const nestedDiff = this.calculateDiff(original[key], updated[key], currentPath);
      nestedDiff.forEach((value, key) => diff.set(key, value));
    }
    
    return diff;
  }
  
  // 应用差异到对象
  public applyDiff(target: any, diff: Map<string, any>): any {
    const result = JSON.parse(JSON.stringify(target)); // 深拷贝
    
    diff.forEach((value, path) => {
      const keys = path.split('.');
      let current = result;
      
      // 导航到嵌套对象的最后一级
      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (!(key in current)) {
          current[key] = {};
        }
        current = current[key];
      }
      
      const lastKey = keys[keys.length - 1];
      if (value === undefined) {
        // 删除属性
        delete current[lastKey];
      } else {
        // 更新或添加属性
        current[lastKey] = value;
      }
    });
    
    return result;
  }
  
  // 同步数据
  public async syncData(immediate: boolean = false): Promise<void> {
    // 如果没有更改或已经在同步中，则跳过
    if (this.pendingChanges.size === 0 || this.status === 'syncing') {
      return;
    }
    
    // 如果不是立即同步且上次同步时间不足间隔，则跳过
    if (!immediate && this.lastSyncTimestamp && 
        Date.now() - this.lastSyncTimestamp < this.config.syncInterval) {
      return;
    }
    
    this.status = 'syncing';
    stateManager.dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // 获取当前状态的副本
      const pendingChanges = new Map(this.pendingChanges);
      this.pendingChanges.clear();
      
      // 转换为对象以便发送
      const changesObject: Record<string, any> = {};
      pendingChanges.forEach((value, key) => {
        changesObject[key] = value;
      });
      
      // 模拟API请求
      // 在实际实现中，这里应该是真实的API调用
      const response = await this.mockSyncRequest(changesObject);
      
      // 处理响应
      if (response.status === 'success') {
        this.status = 'success';
        this.lastSyncTimestamp = Date.now();
        this.retryCount = 0;
        stateManager.dispatch({ 
          type: 'SYNC_COMPLETE', 
          payload: new Date().toISOString() 
        });
        
        // 如果服务器返回了任何更新，应用它们
        if (response.updates) {
          this.applyServerUpdates(response.updates);
        }
      } else {
        throw new Error(response.message || '同步失败');
      }
    } catch (error) {
      this.status = 'error';
      console.error('同步失败:', error);
      
      // 将失败的更改添加回挂起队列
      stateManager.dispatch({ 
        type: 'ADD_ERROR', 
        payload: { 
          message: `同步失败: ${error instanceof Error ? error.message : String(error)}`,
          timestamp: new Date().toISOString()
        } 
      });
      
      // 重试逻辑
      if (this.retryCount < this.config.maxRetries) {
        this.retryCount++;
        setTimeout(() => {
          this.syncData(true);
        }, this.config.retryDelay * this.retryCount);
      }
    } finally {
      stateManager.dispatch({ type: 'SET_LOADING', payload: false });
    }
  }
  
  // 应用服务器更新
  private applyServerUpdates(updates: Record<string, any>): void {
    const currentState = stateManager.getState();
    const updatedState = this.applyUpdatesToCopy(currentState, updates);
    
    // 更新各个部分的状态
    if (updates.user) {
      stateManager.dispatch({ type: 'SET_USER', payload: updatedState.user });
    }
    
    if (updates.learningData?.progress) {
      stateManager.dispatch({ 
        type: 'UPDATE_PROGRESS', 
        payload: updatedState.learningData.progress 
      });
    }
    
    if (updates.learningData?.styleAnalysis) {
      stateManager.dispatch({ 
        type: 'SET_STYLE_ANALYSIS', 
        payload: updatedState.learningData.styleAnalysis 
      });
    }
    
    if (updates.learningData?.weaknesses) {
      stateManager.dispatch({ 
        type: 'UPDATE_WEAKNESSES', 
        payload: updatedState.learningData.weaknesses 
      });
    }
    
    // 更新其他状态...
  }
  
  // 将更新应用到状态副本
  private applyUpdatesToCopy(state: GlobalState, updates: Record<string, any>): GlobalState {
    const stateCopy = JSON.parse(JSON.stringify(state));
    
    // 使用递归函数应用更新
    const applyNestedUpdates = (target: any, source: any) => {
      Object.keys(source).forEach(key => {
        if (target[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
          // 递归处理嵌套对象
          if (!target[key]) target[key] = {};
          applyNestedUpdates(target[key], source[key]);
        } else {
          // 直接赋值非对象或数组
          target[key] = source[key];
        }
      });
    };
    
    applyNestedUpdates(stateCopy, updates);
    return stateCopy;
  }
  
  // 模拟同步请求
  private async mockSyncRequest(changes: Record<string, any>): Promise<{
    status: 'success' | 'error';
    message?: string;
    updates?: Record<string, any>;
  }> {
    return new Promise((resolve) => {
      // 模拟网络延迟
      setTimeout(() => {
        // 随机成功或失败
        if (Math.random() > 0.1) { // 90%成功率
          resolve({
            status: 'success',
            updates: {} // 模拟可能的服务器更新
          });
        } else {
          resolve({
            status: 'error',
            message: '网络错误或服务器问题'
          });
        }
      }, 1000);
    });
  }
  
  // 清理
  public cleanup(): void {
    this.stopSyncTimer();
    
    if (typeof window !== 'undefined') {
      window.removeEventListener('online', this.handleOnline);
      window.removeEventListener('offline', this.handleOffline);
      window.removeEventListener('beforeunload', this.syncBeforeUnload);
    }
  }
}

// 创建单例实例
const syncUtils = new SyncManager();

export default syncUtils; 