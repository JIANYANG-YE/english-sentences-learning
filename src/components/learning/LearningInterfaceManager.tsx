'use client';

import React, { useState, useEffect } from 'react';
import { Box, IconButton, Tooltip, Backdrop, CircularProgress, Container } from '@mui/material';
import CustomLayoutManager, { LayoutSettings } from './CustomLayoutManager';
import InteractiveFeedback, { 
  FeedbackType, 
  LearningHint, 
  AccuracyScore, 
  ErrorDetail 
} from './InteractiveFeedback';
import { adaptiveLearningService, PerformanceMetrics } from '@/services/adaptiveLearningService';

// 简化的图标组件
const CelebrationIcon = () => <span>🎉</span>;
const SaveIcon = () => <span>💾</span>;
const LeaderboardIcon = () => <span>📊</span>;
const SpeedIcon = () => <span>⏱️</span>;

export interface LearningPosition {
  courseId: string;
  lessonId: string;
  mode?: string;
  position: number;
  timestamp: number;
}

export interface LearningTrackerProps {
  userId: string;
  courseId: string;
  lessonId: string;
  mode?: string;
  totalItems: number;
  currentPosition: number;
  onLayoutChange?: (settings: LayoutSettings) => void;
  onSaveProgress?: (position: LearningPosition) => void;
  saveInterval?: number; // 自动保存间隔，单位毫秒
}

/**
 * 学习界面管理器组件
 * 负责管理学习界面的布局、提供交互式反馈，并跟踪学习进度
 */
const LearningInterfaceManager: React.FC<LearningTrackerProps> = ({
  userId,
  courseId,
  lessonId,
  mode = 'default',
  totalItems,
  currentPosition,
  onLayoutChange,
  onSaveProgress,
  saveInterval = 60000 // 默认1分钟自动保存一次
}) => {
  const [layoutSettings, setLayoutSettings] = useState<LayoutSettings | null>(null);
  const [feedback, setFeedback] = useState<{
    isVisible: boolean;
    type: FeedbackType;
    message: string;
    detailedMessage?: string;
    accuracy?: AccuracyScore;
    errors?: ErrorDetail[];
    hint?: LearningHint;
  }>({
    isVisible: false,
    type: 'neutral',
    message: ''
  });
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [lastSavedPosition, setLastSavedPosition] = useState<number>(-1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [learningStats, setLearningStats] = useState<{
    correctAnswers: number;
    totalAttempts: number;
    streakCount: number;
    timeSpent: number;
  }>({
    correctAnswers: 0,
    totalAttempts: 0,
    streakCount: 0,
    timeSpent: 0
  });

  // 初始化
  useEffect(() => {
    setStartTime(Date.now());
    
    // 如果位置变化，更新最后保存的位置
    if (currentPosition !== lastSavedPosition) {
      setLastSavedPosition(currentPosition);
    }
    
    // 清理函数
    return () => {
      // 离开页面时保存进度
      saveCurrentProgress();
    };
  }, []);

  // 设置自动保存定时器
  useEffect(() => {
    const timer = setInterval(() => {
      saveCurrentProgress();
    }, saveInterval);
    
    return () => clearInterval(timer);
  }, [currentPosition, saveInterval]);

  // 处理布局设置变更
  const handleLayoutSettingsChange = (settings: LayoutSettings) => {
    setLayoutSettings(settings);
    
    if (onLayoutChange) {
      onLayoutChange(settings);
    }
    
    // 应用设置到当前页面
    applyLayoutSettings(settings);
  };

  // 应用布局设置
  const applyLayoutSettings = (settings: LayoutSettings) => {
    const rootElement = document.documentElement;
    const bodyElement = document.body;
    
    // 应用字体大小
    rootElement.style.setProperty('--app-font-size', `${settings.fontSize}px`);
    
    // 应用行高
    rootElement.style.setProperty('--app-line-height', `${settings.lineHeight}`);
    
    // 应用字体
    const fontFamily = settings.fontFamily === 'system' 
      ? '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      : settings.fontFamily === 'serif'
        ? 'Georgia, Cambria, "Times New Roman", Times, serif'
        : 'Menlo, Monaco, Consolas, "Liberation Mono", monospace';
    
    rootElement.style.setProperty('--app-font-family', fontFamily);
    
    // 应用暗模式
    if (settings.darkMode) {
      bodyElement.classList.add('dark-mode');
    } else {
      bodyElement.classList.remove('dark-mode');
    }
    
    // 应用高对比度模式
    if (settings.contrastMode) {
      bodyElement.classList.add('high-contrast');
    } else {
      bodyElement.classList.remove('high-contrast');
    }
    
    // 应用动画设置
    if (!settings.animationsEnabled) {
      bodyElement.classList.add('no-animations');
    } else {
      bodyElement.classList.remove('no-animations');
    }
  };

  // 保存当前进度
  const saveCurrentProgress = () => {
    if (onSaveProgress && currentPosition !== lastSavedPosition) {
      const position: LearningPosition = {
        courseId,
        lessonId,
        mode,
        position: currentPosition,
        timestamp: Date.now()
      };
      
      onSaveProgress(position);
      setLastSavedPosition(currentPosition);
    }
  };

  // 显示反馈
  const showFeedback = (
    type: FeedbackType,
    message: string,
    options?: {
      detailedMessage?: string;
      accuracy?: AccuracyScore;
      errors?: ErrorDetail[];
      hint?: LearningHint;
    }
  ) => {
    setFeedback({
      isVisible: true,
      type,
      message,
      ...options
    });
    
    // 更新学习统计
    if (type === 'success') {
      setLearningStats(prev => ({
        ...prev,
        correctAnswers: prev.correctAnswers + 1,
        totalAttempts: prev.totalAttempts + 1,
        streakCount: prev.streakCount + 1
      }));
    } else if (type === 'error') {
      setLearningStats(prev => ({
        ...prev,
        totalAttempts: prev.totalAttempts + 1,
        streakCount: 0
      }));
    }
    
    // 更新学习时间
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    setLearningStats(prev => ({
      ...prev,
      timeSpent
    }));
  };

  // 关闭反馈
  const closeFeedback = () => {
    setFeedback(prev => ({
      ...prev,
      isVisible: false
    }));
  };

  // 提交学习表现
  const submitPerformance = (
    activityType: 'vocabulary' | 'grammar' | 'listening' | 'reading' | 'speaking' | 'translation',
    metrics: PerformanceMetrics
  ) => {
    setIsLoading(true);
    
    try {
      // 更新用户技能等级
      adaptiveLearningService.updateSkillLevel(userId, activityType, metrics);
      
      // 如果准确率低，标记为困难领域
      if (metrics.accuracyRate < 70) {
        adaptiveLearningService.recordStrugglingArea(userId, activityType);
      } 
      // 如果准确率高，标记为强项领域
      else if (metrics.accuracyRate > 85) {
        adaptiveLearningService.recordStrengthArea(userId, activityType);
      }
    } catch (error) {
      console.error('提交学习表现时出错:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 计算学习进度百分比
  const progressPercent = Math.floor((currentPosition / totalItems) * 100);

  return (
    <>
      {/* 界面自定义管理器 */}
      <Box sx={{ position: 'fixed', bottom: 20, right: 20, zIndex: 10 }}>
        <CustomLayoutManager onSettingsChange={handleLayoutSettingsChange} />
      </Box>
      
      {/* 学习进度指示器 */}
      <Box sx={{ position: 'fixed', bottom: 20, left: 20, zIndex: 10 }}>
        <Tooltip title={`学习进度: ${progressPercent}%`}>
          <IconButton 
            onClick={saveCurrentProgress}
            sx={{
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
              }
            }}
          >
            <SaveIcon />
          </IconButton>
        </Tooltip>
      </Box>
      
      {/* 学习统计按钮 */}
      <Box sx={{ position: 'fixed', bottom: 20, left: 80, zIndex: 10 }}>
        <Tooltip title="学习统计">
          <IconButton 
            sx={{
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
              }
            }}
          >
            <LeaderboardIcon />
          </IconButton>
        </Tooltip>
      </Box>
      
      {/* 学习时间 */}
      <Box sx={{ position: 'fixed', bottom: 20, left: 140, zIndex: 10 }}>
        <Tooltip title="学习时间">
          <IconButton 
            sx={{
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
              }
            }}
          >
            <SpeedIcon />
          </IconButton>
        </Tooltip>
      </Box>
      
      {/* 交互式反馈 */}
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 5 }}>
        <InteractiveFeedback
          isVisible={feedback.isVisible}
          feedbackType={feedback.type}
          message={feedback.message}
          detailedMessage={feedback.detailedMessage}
          accuracy={feedback.accuracy}
          errors={feedback.errors}
          hint={feedback.hint}
          progressValue={progressPercent}
          timeSpent={learningStats.timeSpent}
          onClose={closeFeedback}
          withAnimation={layoutSettings?.animationsEnabled}
        />
      </Container>
      
      {/* 加载状态 */}
      <Backdrop
        sx={{ color: '#fff', zIndex: 100 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

export default LearningInterfaceManager; 