/**
 * 离线支持服务
 * 在没有后端API可用时提供基本功能
 */

// 判断是否在浏览器环境
const isBrowser = typeof window !== 'undefined';

// 检查是否可以访问网络和API
export const checkOnlineStatus = async (): Promise<boolean> => {
  if (!isBrowser) return true; // 服务器端始终视为在线
  
  // 检查网络连接
  if (!navigator.onLine) return false;
  
  try {
    // 尝试访问状态API
    const response = await fetch('/api/status', { 
      method: 'GET',
      headers: { 'Cache-Control': 'no-cache' }
    });
    return response.ok;
  } catch (error) {
    console.warn('API离线检测失败:', error);
    return false;
  }
};

// 本地存储键
const STORAGE_KEYS = {
  USER_PROGRESS: 'offline_user_progress',
  LEARNING_DATA: 'offline_learning_data',
  COMPLETED_LESSONS: 'offline_completed_lessons',
  USER_SETTINGS: 'offline_user_settings',
  PENDING_SYNC: 'offline_pending_sync'
};

// 保存学习进度
export const saveProgressOffline = (
  userId: string, 
  courseId: string, 
  lessonId: string, 
  progress: number
): void => {
  if (!isBrowser) return;
  
  try {
    // 获取现有进度数据
    const progressData = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_PROGRESS) || '{}');
    
    // 更新指定课程和课时的进度
    if (!progressData[userId]) progressData[userId] = {};
    if (!progressData[userId][courseId]) progressData[userId][courseId] = {};
    
    progressData[userId][courseId][lessonId] = {
      progress,
      lastUpdated: new Date().toISOString()
    };
    
    // 保存回localStorage
    localStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(progressData));
    
    // 添加到待同步队列
    addToPendingSyncQueue({
      type: 'progress',
      userId,
      courseId,
      lessonId,
      progress,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('离线保存进度失败:', error);
  }
};

// 获取离线学习进度
export const getProgressOffline = (
  userId: string, 
  courseId: string, 
  lessonId?: string
): any => {
  if (!isBrowser) return null;
  
  try {
    const progressData = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_PROGRESS) || '{}');
    
    if (!progressData[userId]) return null;
    if (!progressData[userId][courseId]) return null;
    
    if (lessonId) {
      return progressData[userId][courseId][lessonId] || null;
    }
    
    return progressData[userId][courseId] || null;
  } catch (error) {
    console.error('获取离线进度失败:', error);
    return null;
  }
};

// 添加到待同步队列
const addToPendingSyncQueue = (item: any): void => {
  if (!isBrowser) return;
  
  try {
    const queue = JSON.parse(localStorage.getItem(STORAGE_KEYS.PENDING_SYNC) || '[]');
    queue.push(item);
    localStorage.setItem(STORAGE_KEYS.PENDING_SYNC, JSON.stringify(queue));
  } catch (error) {
    console.error('添加到同步队列失败:', error);
  }
};

// 获取待同步队列
export const getPendingSyncQueue = (): any[] => {
  if (!isBrowser) return [];
  
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.PENDING_SYNC) || '[]');
  } catch (error) {
    console.error('获取同步队列失败:', error);
    return [];
  }
};

// 清空待同步队列
export const clearPendingSyncQueue = (): void => {
  if (!isBrowser) return;
  localStorage.removeItem(STORAGE_KEYS.PENDING_SYNC);
};

// 同步数据到服务器
export const syncOfflineData = async (): Promise<boolean> => {
  if (!isBrowser) return true;
  
  const isOnline = await checkOnlineStatus();
  if (!isOnline) return false;
  
  const pendingItems = getPendingSyncQueue();
  if (pendingItems.length === 0) return true;
  
  try {
    // 同步数据到服务器
    const response = await fetch('/api/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ items: pendingItems })
    });
    
    if (response.ok) {
      clearPendingSyncQueue();
      return true;
    }
    return false;
  } catch (error) {
    console.error('同步数据失败:', error);
    return false;
  }
};

// 保存用户设置
export const saveSettingsOffline = (userId: string, settings: any): void => {
  if (!isBrowser) return;
  
  try {
    const allSettings = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_SETTINGS) || '{}');
    allSettings[userId] = settings;
    localStorage.setItem(STORAGE_KEYS.USER_SETTINGS, JSON.stringify(allSettings));
  } catch (error) {
    console.error('保存离线设置失败:', error);
  }
};

// 获取用户设置
export const getSettingsOffline = (userId: string): any => {
  if (!isBrowser) return null;
  
  try {
    const allSettings = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_SETTINGS) || '{}');
    return allSettings[userId] || null;
  } catch (error) {
    console.error('获取离线设置失败:', error);
    return null;
  }
};

// 检查和进行数据同步
export const checkAndSyncData = async (): Promise<void> => {
  if (!isBrowser) return;
  
  if (navigator.onLine) {
    await syncOfflineData();
  }
  
  // 监听在线状态变化
  window.addEventListener('online', async () => {
    console.log('网络已连接，开始同步数据...');
    await syncOfflineData();
  });
}; 