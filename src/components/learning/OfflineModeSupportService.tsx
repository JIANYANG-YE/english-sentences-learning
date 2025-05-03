import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { 
  Button, 
  Snackbar, 
  Alert, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress,
  Typography,
  Box,
  Tooltip
} from '@mui/material';
import {
  CloudOff as CloudOffIcon,
  CloudDone as CloudDoneIcon,
  Sync as SyncIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Storage as StorageIcon
} from '@mui/icons-material';

// 离线数据类型
interface OfflineData {
  id: string;
  type: 'userAnswer' | 'progress' | 'note' | 'settings';
  data: any;
  timestamp: number;
  synced: boolean;
  entityId?: string; // 关联的实体ID（课程、课时等）
}

// 上下文状态
interface OfflineModeContextState {
  isOnline: boolean;
  offlineData: OfflineData[];
  pendingSyncCount: number;
  lastSyncTime: number | null;
  storageUsage: {
    used: number;
    total: number;
  };
  saveOfflineData: (type: OfflineData['type'], data: any, entityId?: string) => Promise<string>;
  syncAllData: () => Promise<boolean>;
  deleteOfflineData: (id: string) => Promise<boolean>;
  clearAllOfflineData: () => Promise<boolean>;
}

// 创建上下文
const OfflineModeContext = createContext<OfflineModeContextState | undefined>(undefined);

// 服务属性
interface OfflineModeSupportServiceProps {
  children: ReactNode;
  onSyncComplete?: (results: any) => void;
  storageQuota?: number; // 单位: MB
}

/**
 * 离线模式支持服务
 * 
 * 提供离线数据存储、同步和管理功能：
 * - 监控网络状态变化
 * - 自动将学习数据保存到本地存储
 * - 网络恢复后自动或手动同步数据
 * - 管理存储用量和数据清理
 */
export const OfflineModeSupportService: React.FC<OfflineModeSupportServiceProps> = ({
  children,
  onSyncComplete,
  storageQuota = 50 // 默认50MB
}) => {
  // 状态管理
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [offlineData, setOfflineData] = useState<OfflineData[]>([]);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncResults, setSyncResults] = useState<{success: number, failed: number}>({success: 0, failed: 0});
  const [showSyncDialog, setShowSyncDialog] = useState<boolean>(false);
  const [showOfflineAlert, setShowOfflineAlert] = useState<boolean>(false);
  const [showOnlineAlert, setShowOnlineAlert] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<number | null>(null);
  const [storageUsage, setStorageUsage] = useState<{used: number, total: number}>({
    used: 0,
    total: storageQuota * 1024 * 1024
  });

  // 网络状态监听
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOnlineAlert(true);
      
      // 如果有未同步的数据，显示同步对话框
      if (offlineData.filter(data => !data.synced).length > 0) {
        setTimeout(() => setShowSyncDialog(true), 1000);
      }
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineAlert(true);
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // 初始化时加载离线数据
    loadOfflineData();
    calculateStorageUsage();
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // 每当离线数据变化时更新存储用量
  useEffect(() => {
    calculateStorageUsage();
  }, [offlineData]);

  // 加载离线数据
  const loadOfflineData = () => {
    try {
      const storedData = localStorage.getItem('offlineData');
      if (storedData) {
        setOfflineData(JSON.parse(storedData));
      }
    } catch (error) {
      console.error('Error loading offline data:', error);
    }
  };

  // 保存离线数据
  const saveOfflineData = async (
    type: OfflineData['type'],
    data: any,
    entityId?: string
  ): Promise<string> => {
    try {
      const newItem: OfflineData = {
        id: `${type}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        type,
        data,
        timestamp: Date.now(),
        synced: isOnline, // 如果在线，标记为已同步
        entityId
      };
      
      const updatedData = [...offlineData, newItem];
      setOfflineData(updatedData);
      localStorage.setItem('offlineData', JSON.stringify(updatedData));
      
      // 如果在线状态，尝试立即同步
      if (isOnline) {
        await syncData(newItem);
      }
      
      return newItem.id;
    } catch (error) {
      console.error('Error saving offline data:', error);
      throw error;
    }
  };

  // 计算存储用量
  const calculateStorageUsage = () => {
    try {
      const dataString = JSON.stringify(offlineData);
      const usedBytes = new Blob([dataString]).size;
      
      // 获取当前存储使用情况
      setStorageUsage(prev => ({
        used: usedBytes,
        total: prev.total
      }));
    } catch (error) {
      console.error('Error calculating storage usage:', error);
    }
  };

  // 同步单条数据
  const syncData = async (item: OfflineData): Promise<boolean> => {
    if (!isOnline) return false;
    
    try {
      // 模拟API调用
      console.log(`Syncing data: ${item.id}`, item);
      
      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
      
      // 模拟成功率95%
      const isSuccess = Math.random() > 0.05;
      
      if (isSuccess) {
        // 更新数据状态为已同步
        const updatedData = offlineData.map(d => 
          d.id === item.id ? { ...d, synced: true } : d
        );
        setOfflineData(updatedData);
        localStorage.setItem('offlineData', JSON.stringify(updatedData));
        
        return true;
      } else {
        console.error(`Failed to sync data: ${item.id}`);
        return false;
      }
    } catch (error) {
      console.error(`Error syncing data: ${item.id}`, error);
      return false;
    }
  };

  // 同步所有未同步的数据
  const syncAllData = async (): Promise<boolean> => {
    if (!isOnline || isSyncing) return false;
    
    setIsSyncing(true);
    setSyncResults({ success: 0, failed: 0 });
    
    try {
      const unsynced = offlineData.filter(data => !data.synced);
      
      if (unsynced.length === 0) {
        setIsSyncing(false);
        return true;
      }
      
      let successCount = 0;
      let failedCount = 0;
      
      // 模拟批量同步过程
      for (const item of unsynced) {
        const success = await syncData(item);
        if (success) {
          successCount++;
        } else {
          failedCount++;
        }
        setSyncResults({ success: successCount, failed: failedCount });
      }
      
      setLastSyncTime(Date.now());
      
      if (onSyncComplete) {
        onSyncComplete({
          success: successCount,
          failed: failedCount,
          total: unsynced.length
        });
      }
      
      return failedCount === 0;
    } catch (error) {
      console.error('Error syncing all data:', error);
      return false;
    } finally {
      setIsSyncing(false);
    }
  };

  // 删除离线数据
  const deleteOfflineData = async (id: string): Promise<boolean> => {
    try {
      const updatedData = offlineData.filter(data => data.id !== id);
      setOfflineData(updatedData);
      localStorage.setItem('offlineData', JSON.stringify(updatedData));
      return true;
    } catch (error) {
      console.error('Error deleting offline data:', error);
      return false;
    }
  };

  // 清除所有离线数据
  const clearAllOfflineData = async (): Promise<boolean> => {
    try {
      setOfflineData([]);
      localStorage.setItem('offlineData', JSON.stringify([]));
      return true;
    } catch (error) {
      console.error('Error clearing offline data:', error);
      return false;
    }
  };

  // 渲染同步对话框
  const renderSyncDialog = () => {
    const pendingItems = offlineData.filter(data => !data.synced);
    
    return (
      <Dialog
        open={showSyncDialog}
        onClose={() => setShowSyncDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          数据同步
          <Typography variant="subtitle2" color="textSecondary">
            发现{pendingItems.length}条待同步数据
          </Typography>
        </DialogTitle>
        
        <DialogContent>
          {isSyncing && (
            <Box display="flex" alignItems="center" justifyContent="center" my={2}>
              <CircularProgress size={24} className="mr-2" />
              <Typography>
                正在同步数据... {syncResults.success + syncResults.failed}/{pendingItems.length}
              </Typography>
            </Box>
          )}
          
          {pendingItems.length > 0 && (
            <List dense>
              {pendingItems.slice(0, 5).map(item => (
                <ListItem key={item.id}>
                  <ListItemIcon>
                    {item.synced ? <CheckCircleIcon color="success" /> : <SyncIcon color="disabled" />}
                  </ListItemIcon>
                  <ListItemText 
                    primary={`${item.type === 'userAnswer' ? '答案记录' : 
                              item.type === 'progress' ? '学习进度' : 
                              item.type === 'note' ? '学习笔记' : '设置'}`}
                    secondary={`${new Date(item.timestamp).toLocaleString()}`}
                  />
                </ListItem>
              ))}
              
              {pendingItems.length > 5 && (
                <ListItem>
                  <ListItemText 
                    secondary={`还有 ${pendingItems.length - 5} 条数据未显示...`}
                  />
                </ListItem>
              )}
            </List>
          )}
          
          <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
            <Typography variant="body2" color="textSecondary">
              存储用量: {(storageUsage.used / (1024 * 1024)).toFixed(2)}MB / {(storageUsage.total / (1024 * 1024)).toFixed(0)}MB
            </Typography>
            
            {lastSyncTime && (
              <Typography variant="body2" color="textSecondary">
                上次同步: {new Date(lastSyncTime).toLocaleString()}
              </Typography>
            )}
          </Box>
        </DialogContent>
        
        <DialogActions>
          <Button 
            onClick={() => setShowSyncDialog(false)} 
            color="inherit"
          >
            稍后同步
          </Button>
          <Button
            onClick={clearAllOfflineData}
            color="error"
            startIcon={<DeleteIcon />}
            disabled={isSyncing}
          >
            清除所有
          </Button>
          <Button
            onClick={syncAllData}
            color="primary"
            variant="contained"
            startIcon={<SyncIcon />}
            disabled={isSyncing || pendingItems.length === 0}
          >
            {isSyncing ? '同步中...' : '立即同步'}
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  // 上下文值
  const contextValue: OfflineModeContextState = {
    isOnline,
    offlineData,
    pendingSyncCount: offlineData.filter(data => !data.synced).length,
    lastSyncTime,
    storageUsage,
    saveOfflineData,
    syncAllData,
    deleteOfflineData,
    clearAllOfflineData
  };

  return (
    <OfflineModeContext.Provider value={contextValue}>
      {children}
      
      {/* 网络状态提醒 */}
      <Snackbar
        open={showOfflineAlert}
        autoHideDuration={6000}
        onClose={() => setShowOfflineAlert(false)}
      >
        <Alert severity="warning" icon={<CloudOffIcon />} onClose={() => setShowOfflineAlert(false)}>
          您已进入离线模式，数据将存储在本地
        </Alert>
      </Snackbar>
      
      <Snackbar
        open={showOnlineAlert}
        autoHideDuration={5000}
        onClose={() => setShowOnlineAlert(false)}
      >
        <Alert severity="success" icon={<CloudDoneIcon />} onClose={() => setShowOnlineAlert(false)}>
          网络已恢复，可以同步数据了
        </Alert>
      </Snackbar>
      
      {/* 同步对话框 */}
      {renderSyncDialog()}
    </OfflineModeContext.Provider>
  );
};

// 自定义Hook，便于在组件中使用离线模式服务
export const useOfflineMode = (): OfflineModeContextState => {
  const context = useContext(OfflineModeContext);
  if (context === undefined) {
    throw new Error('useOfflineMode must be used within an OfflineModeSupportService');
  }
  return context;
};

// 离线模式状态指示器组件
interface OfflineModeIndicatorProps {
  showSync?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export const OfflineModeIndicator: React.FC<OfflineModeIndicatorProps> = ({ 
  showSync = true,
  size = 'medium'
}) => {
  const { isOnline, pendingSyncCount, syncAllData, lastSyncTime } = useOfflineMode();
  
  const iconSizes = {
    small: { fontSize: 16 },
    medium: { fontSize: 24 },
    large: { fontSize: 32 }
  };
  
  return (
    <Box display="flex" alignItems="center">
      {isOnline ? (
        <Tooltip title="在线状态">
          <CloudDoneIcon color="primary" style={iconSizes[size]} />
        </Tooltip>
      ) : (
        <Tooltip title="离线状态">
          <CloudOffIcon color="error" style={iconSizes[size]} />
        </Tooltip>
      )}
      
      {isOnline && showSync && pendingSyncCount > 0 && (
        <Box display="flex" alignItems="center" ml={1}>
          <Button
            size="small"
            startIcon={<SyncIcon />}
            onClick={() => syncAllData()}
            color="primary"
            variant="outlined"
          >
            同步 {pendingSyncCount}
          </Button>
        </Box>
      )}
    </Box>
  );
}; 