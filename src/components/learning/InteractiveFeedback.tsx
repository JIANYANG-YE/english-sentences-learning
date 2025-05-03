'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  LinearProgress, 
  Button, 
  IconButton,
  Collapse,
  Alert,
  AlertTitle,
  Chip,
  CircularProgress,
  Tooltip
} from '@mui/material';

// 简化的图标组件
const CloseIcon = () => <span>✖️</span>;
const CheckIcon = () => <span>✓</span>;
const InfoIcon = () => <span>ℹ️</span>;
const WarningIcon = () => <span>⚠️</span>;
const ErrorIcon = () => <span>⛔</span>;
const HintIcon = () => <span>💡</span>;
const StatsIcon = () => <span>📊</span>;
const RepeatIcon = () => <span>🔄</span>;

// 反馈类型
export type FeedbackType = 'success' | 'error' | 'warning' | 'info' | 'neutral';

// 学习提示类型
export interface LearningHint {
  title: string;
  content: string;
  type: 'grammar' | 'vocabulary' | 'pronunciation' | 'expression' | 'culture';
}

// 准确度评分
export interface AccuracyScore {
  overall: number; // 0-100
  grammar?: number;
  vocabulary?: number;
  fluency?: number;
  pronunciation?: number;
  breakdown?: Array<{
    aspect: string;
    score: number;
    improvement?: string;
  }>;
}

// 错误类型
export interface ErrorDetail {
  text: string;
  type: 'grammar' | 'vocabulary' | 'structure' | 'tone' | 'other';
  suggestion: string;
  explanation?: string;
}

// 组件属性
interface InteractiveFeedbackProps {
  // 反馈显示控制
  isVisible: boolean;
  feedbackType: FeedbackType;
  message: string;
  detailedMessage?: string;
  onClose?: () => void;
  
  // 准确度评分
  accuracy?: AccuracyScore;
  
  // 错误详情
  errors?: ErrorDetail[];
  
  // 学习提示
  hint?: LearningHint;
  
  // 计时和进度
  timeSpent?: number; // 秒
  expectedTime?: number; // 秒
  progressValue?: number; // 0-100
  
  // 额外的操作
  onRetry?: () => void;
  onNextItem?: () => void;
  onShowAnswer?: () => void;
  onShowHint?: () => void;
  
  // 样式自定义
  compact?: boolean;
  withAnimation?: boolean;
}

const InteractiveFeedback: React.FC<InteractiveFeedbackProps> = ({
  isVisible,
  feedbackType,
  message,
  detailedMessage,
  onClose,
  accuracy,
  errors,
  hint,
  timeSpent,
  expectedTime,
  progressValue,
  onRetry,
  onNextItem,
  onShowAnswer,
  onShowHint,
  compact = false,
  withAnimation = true
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(!withAnimation);
  
  // 反馈出现动画
  useEffect(() => {
    if (isVisible && withAnimation) {
      const timer = setTimeout(() => {
        setAnimationComplete(true);
      }, 500);
      
      return () => clearTimeout(timer);
    }
    
    return undefined;
  }, [isVisible, withAnimation]);
  
  // 重置组件状态
  useEffect(() => {
    if (!isVisible) {
      setShowDetails(false);
      setShowHint(false);
      setAnimationComplete(!withAnimation);
    }
  }, [isVisible, withAnimation]);
  
  // 如果不可见则不渲染
  if (!isVisible) return null;
  
  // 获取反馈颜色和图标
  const getFeedbackColor = () => {
    switch (feedbackType) {
      case 'success': return 'success.main';
      case 'error': return 'error.main';
      case 'warning': return 'warning.main';
      case 'info': return 'info.main';
      default: return 'text.primary';
    }
  };
  
  const getFeedbackIcon = () => {
    switch (feedbackType) {
      case 'success': return <CheckIcon />;
      case 'error': return <ErrorIcon />;
      case 'warning': return <WarningIcon />;
      case 'info': return <InfoIcon />;
      default: return null;
    }
  };
  
  // 格式化时间
  const formatTime = (seconds?: number) => {
    if (seconds === undefined) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // 计算时间效率
  const getTimeEfficiency = () => {
    if (!timeSpent || !expectedTime) return null;
    
    const ratio = timeSpent / expectedTime;
    if (ratio <= 0.8) return { label: '速度很快', color: 'success' };
    if (ratio <= 1.2) return { label: '正常速度', color: 'info' };
    return { label: '需要加快', color: 'warning' };
  };
  
  const timeEfficiency = getTimeEfficiency();
  
  // 紧凑模式下的简化视图
  if (compact) {
    return (
      <Paper
        elevation={3}
        sx={{
          p: 2,
          borderLeft: 3,
          borderColor: getFeedbackColor(),
          mb: 2,
          transition: 'all 0.3s ease',
          transform: animationComplete ? 'translateY(0)' : 'translateY(20px)',
          opacity: animationComplete ? 1 : 0
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ mr: 1, color: getFeedbackColor() }}>
              {getFeedbackIcon()}
            </Box>
            <Typography variant="body1">{message}</Typography>
          </Box>
          
          {onClose && (
            <IconButton size="small" onClick={onClose}>
              <CloseIcon />
            </IconButton>
          )}
        </Box>
        
        {(accuracy?.overall !== undefined || progressValue !== undefined) && (
          <Box sx={{ mt: 1 }}>
            {accuracy?.overall !== undefined && (
              <Tooltip title="答案准确度">
                <Chip 
                  size="small" 
                  label={`准确度: ${accuracy.overall}%`}
                  color={
                    accuracy.overall >= 80 ? 'success' :
                    accuracy.overall >= 60 ? 'info' :
                    'warning'
                  }
                  sx={{ mr: 1 }}
                />
              </Tooltip>
            )}
            
            {progressValue !== undefined && (
              <LinearProgress 
                variant="determinate" 
                value={progressValue} 
                sx={{ mt: 1, height: 4, borderRadius: 2 }}
              />
            )}
          </Box>
        )}
      </Paper>
    );
  }
  
  // 完整反馈界面
  return (
    <Paper
      elevation={4}
      sx={{
        p: 3,
        borderRadius: 2,
        mb: 3,
        transition: 'all 0.4s ease',
        transform: animationComplete ? 'translateY(0)' : 'translateY(30px)',
        opacity: animationComplete ? 1 : 0
      }}
    >
      {/* 主要反馈消息 */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box 
            sx={{ 
              color: getFeedbackColor(),
              fontSize: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              mr: 2
            }}
          >
            {getFeedbackIcon()}
          </Box>
          <Typography variant="h6">{message}</Typography>
        </Box>
        
        {onClose && (
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        )}
      </Box>
      
      {/* 详细信息 */}
      {detailedMessage && (
        <Typography 
          variant="body1" 
          color="text.secondary" 
          sx={{ mb: 2 }}
        >
          {detailedMessage}
        </Typography>
      )}
      
      {/* 准确度和进度信息 */}
      {(accuracy || progressValue !== undefined) && (
        <Box sx={{ mb: 3 }}>
          {accuracy && (
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle2">答案准确度</Typography>
                <Typography 
                  variant="subtitle1" 
                  fontWeight="bold"
                  color={
                    accuracy.overall >= 80 ? 'success.main' :
                    accuracy.overall >= 60 ? 'primary.main' :
                    'warning.main'
                  }
                >
                  {accuracy.overall}%
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                {accuracy.grammar !== undefined && (
                  <Chip 
                    label={`语法: ${accuracy.grammar}%`}
                    size="small"
                    color={accuracy.grammar >= 70 ? 'success' : 'default'}
                  />
                )}
                {accuracy.vocabulary !== undefined && (
                  <Chip 
                    label={`词汇: ${accuracy.vocabulary}%`}
                    size="small"
                    color={accuracy.vocabulary >= 70 ? 'success' : 'default'}
                  />
                )}
                {accuracy.fluency !== undefined && (
                  <Chip 
                    label={`流畅度: ${accuracy.fluency}%`}
                    size="small"
                    color={accuracy.fluency >= 70 ? 'success' : 'default'}
                  />
                )}
                {accuracy.pronunciation !== undefined && (
                  <Chip 
                    label={`发音: ${accuracy.pronunciation}%`}
                    size="small"
                    color={accuracy.pronunciation >= 70 ? 'success' : 'default'}
                  />
                )}
              </Box>
              
              <Button 
                size="small" 
                sx={{ mt: 1 }}
                onClick={() => setShowDetails(!showDetails)}
              >
                {showDetails ? '隐藏详情' : '查看详情'}
              </Button>
              
              <Collapse in={showDetails}>
                <Box sx={{ mt: 2 }}>
                  {accuracy.breakdown?.map((item, index) => (
                    <Box key={index} sx={{ mb: 1 }}>
                      <Typography variant="body2" component="div" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>{item.aspect}</span>
                        <span>{item.score}%</span>
                      </Typography>
                      {item.improvement && (
                        <Typography variant="caption" color="text.secondary">
                          建议: {item.improvement}
                        </Typography>
                      )}
                    </Box>
                  ))}
                </Box>
              </Collapse>
            </Box>
          )}
          
          {progressValue !== undefined && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="subtitle2">学习进度</Typography>
                <Typography variant="body2">{progressValue}%</Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={progressValue} 
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Box>
          )}
        </Box>
      )}
      
      {/* 错误详情 */}
      {errors && errors.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            需要改进的地方:
          </Typography>
          
          {errors.map((error, index) => (
            <Alert 
              key={index}
              severity="info"
              sx={{ mb: 1 }}
              icon={
                error.type === 'grammar' ? <span>📝</span> :
                error.type === 'vocabulary' ? <span>📚</span> :
                error.type === 'structure' ? <span>🔨</span> :
                error.type === 'tone' ? <span>🎵</span> :
                <span>📌</span>
              }
            >
              <AlertTitle>
                {error.type === 'grammar' ? '语法错误' :
                 error.type === 'vocabulary' ? '词汇错误' :
                 error.type === 'structure' ? '结构错误' :
                 error.type === 'tone' ? '语调错误' :
                 '其他错误'}
              </AlertTitle>
              <Typography variant="body2" gutterBottom>
                <strong>原文:</strong> {error.text}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>建议:</strong> {error.suggestion}
              </Typography>
              {error.explanation && (
                <Typography variant="body2" color="text.secondary">
                  <strong>解释:</strong> {error.explanation}
                </Typography>
              )}
            </Alert>
          ))}
        </Box>
      )}
      
      {/* 学习提示 */}
      {hint && (
        <Box sx={{ mb: 3 }}>
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mb: 1,
              cursor: 'pointer'
            }}
            onClick={() => setShowHint(!showHint)}
          >
            <HintIcon />
            <Typography variant="subtitle2" sx={{ ml: 1 }}>
              学习提示: {hint.title}
            </Typography>
            <Button size="small" sx={{ ml: 'auto' }}>
              {showHint ? '收起' : '展开'}
            </Button>
          </Box>
          
          <Collapse in={showHint}>
            <Alert 
              severity="info" 
              icon={
                hint.type === 'grammar' ? <span>📝</span> :
                hint.type === 'vocabulary' ? <span>📚</span> :
                hint.type === 'pronunciation' ? <span>🔊</span> :
                hint.type === 'expression' ? <span>💬</span> :
                <span>🌍</span>
              }
              sx={{ mt: 1 }}
            >
              <Typography variant="body2">
                {hint.content}
              </Typography>
            </Alert>
          </Collapse>
        </Box>
      )}
      
      {/* 学习时间 */}
      {(timeSpent !== undefined || expectedTime !== undefined) && (
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Typography variant="body2" sx={{ mr: 2 }}>
            用时: {formatTime(timeSpent)}
          </Typography>
          
          {expectedTime && (
            <Typography variant="body2" sx={{ mr: 2 }}>
              预期: {formatTime(expectedTime)}
            </Typography>
          )}
          
          {timeEfficiency && (
            <Chip 
              label={timeEfficiency.label} 
              size="small"
              color={timeEfficiency.color as any}
            />
          )}
        </Box>
      )}
      
      {/* 操作按钮 */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
        {onShowHint && (
          <Button 
            variant="text" 
            size="small"
            startIcon={<HintIcon />}
            onClick={onShowHint}
          >
            提示
          </Button>
        )}
        
        {onShowAnswer && (
          <Button 
            variant="text" 
            size="small"
            onClick={onShowAnswer}
          >
            查看答案
          </Button>
        )}
        
        {onRetry && (
          <Button 
            variant="outlined" 
            color="primary"
            startIcon={<RepeatIcon />}
            onClick={onRetry}
          >
            重试
          </Button>
        )}
        
        {onNextItem && (
          <Button 
            variant="contained" 
            color="primary"
            onClick={onNextItem}
          >
            继续
          </Button>
        )}
      </Box>
    </Paper>
  );
};

export default InteractiveFeedback; 