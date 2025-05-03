import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Skeleton,
  Chip,
  Button,
  IconButton,
  Tooltip,
  Divider,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Alert
} from '@mui/material';
import {
  Psychology as PsychologyIcon,
  Refresh as RefreshIcon,
  ExpandMore as ExpandMoreIcon,
  FileCopy as FileCopyIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Lightbulb as LightbulbIcon,
  Settings as SettingsIcon,
  History as HistoryIcon
} from '@mui/icons-material';

// AI反馈类型
export interface AIFeedback {
  id: string;
  userInput: string;
  correctAnswer?: string;
  feedback: string;
  suggestions: string[];
  alternativeExpressions?: string[];
  score?: number; // 0-100
  grammarCorrections?: Array<{
    original: string;
    corrected: string;
    explanation: string;
  }>;
  timestamp: number;
  source: 'openai' | 'azure' | 'local' | 'mock';
  saved?: boolean;
}

// 组件属性
interface AIFeedbackGeneratorProps {
  userInput: string;
  correctAnswer?: string;
  isGenerating?: boolean;
  lastFeedback?: AIFeedback | null;
  savedFeedbacks?: AIFeedback[];
  apiKey?: string;
  onRegenerateFeedback?: () => void;
  onSaveFeedback?: (feedback: AIFeedback) => void;
  offlineMode?: boolean;
}

/**
 * AI反馈生成器组件
 * 
 * 使用AI生成并展示对用户输入的反馈：
 * - 分析用户回答并提供详细反馈
 * - 提供语法改进和替代表达
 * - 支持保存和查看历史反馈
 */
export default function AIFeedbackGenerator({
  userInput,
  correctAnswer,
  isGenerating = false,
  lastFeedback = null,
  savedFeedbacks = [],
  apiKey,
  onRegenerateFeedback = () => {},
  onSaveFeedback = () => {},
  offlineMode = false
}: AIFeedbackGeneratorProps) {
  const [viewMode, setViewMode] = useState<'current' | 'history'>('current');
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [feedbackLanguage, setFeedbackLanguage] = useState<'zh' | 'en'>('zh');
  
  // 处理复制到剪贴板
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        alert('已复制到剪贴板');
      })
      .catch(err => {
        console.error('无法复制: ', err);
      });
  };
  
  // 处理保存反馈
  const handleSaveFeedback = (feedback: AIFeedback) => {
    const feedbackToSave = {
      ...feedback,
      saved: true
    };
    onSaveFeedback(feedbackToSave);
  };
  
  // 获取语法校正状态图标
  const getGrammarStatusIcon = (score?: number) => {
    if (!score) return <InfoIcon color="action" />;
    
    if (score >= 90) return <CheckCircleIcon color="success" />;
    if (score >= 70) return <StarIcon color="primary" />;
    if (score >= 50) return <StarBorderIcon color="warning" />;
    return <ErrorIcon color="error" />;
  };
  
  // 渲染加载状态
  const renderLoading = () => {
    return (
      <Box textAlign="center" py={6}>
        <CircularProgress size={40} />
        <Typography variant="body1" color="textSecondary" mt={2}>
          AI正在分析您的回答...
        </Typography>
        <Box mt={3}>
          <Skeleton variant="text" width="90%" height={30} />
          <Skeleton variant="text" width="75%" height={30} />
          <Skeleton variant="text" width="85%" height={30} />
        </Box>
      </Box>
    );
  };
  
  // 渲染当前反馈
  const renderCurrentFeedback = () => {
    if (!lastFeedback) {
      return (
        <Box textAlign="center" py={6}>
          <PsychologyIcon style={{ fontSize: 60, color: '#ccc' }} />
          <Typography variant="body1" color="textSecondary" mt={2}>
            {userInput 
              ? '请提交您的回答以获取AI反馈'
              : '输入内容后将提供AI反馈'
            }
          </Typography>
        </Box>
      );
    }
    
    return (
      <Box>
        {/* 反馈头部 */}
        <Box 
          display="flex" 
          justifyContent="space-between" 
          alignItems="center"
          mb={2}
        >
          <Box display="flex" alignItems="center">
            <PsychologyIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6">
              AI反馈分析
            </Typography>
            {lastFeedback.source === 'mock' && (
              <Chip 
                label="模拟" 
                size="small" 
                color="default" 
                sx={{ ml: 1 }}
              />
            )}
            {offlineMode && (
              <Chip 
                label="离线" 
                size="small" 
                color="warning" 
                sx={{ ml: 1 }}
              />
            )}
          </Box>
          
          <Box>
            <Tooltip title="重新生成反馈">
              <IconButton 
                onClick={onRegenerateFeedback}
                disabled={isGenerating || offlineMode}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            {!lastFeedback.saved && (
              <Tooltip title="保存此反馈">
                <IconButton 
                  onClick={() => handleSaveFeedback(lastFeedback)}
                >
                  <StarBorderIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>
        
        {/* 用户输入和正确答案 */}
        <Box mb={3}>
          <Paper variant="outlined" sx={{ p: 2, bgcolor: '#f9f9f9' }}>
            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
              您的回答:
            </Typography>
            <Typography variant="body1" mb={correctAnswer ? 2 : 0}>
              {lastFeedback.userInput}
            </Typography>
            
            {correctAnswer && (
              <>
                <Divider sx={{ my: 1 }} />
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  参考答案:
                </Typography>
                <Typography variant="body1">
                  {correctAnswer}
                </Typography>
              </>
            )}
          </Paper>
        </Box>
        
        {/* 总体评分 */}
        {lastFeedback.score !== undefined && (
          <Box mb={3}>
            <Card variant="outlined">
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Typography variant="subtitle1">总体评分</Typography>
                  <Box display="flex" alignItems="center">
                    {getGrammarStatusIcon(lastFeedback.score)}
                    <Typography 
                      variant="h5" 
                      ml={1}
                      color={
                        lastFeedback.score >= 90 ? 'success.main' :
                        lastFeedback.score >= 70 ? 'primary.main' :
                        lastFeedback.score >= 50 ? 'warning.main' : 'error.main'
                      }
                    >
                      {lastFeedback.score}/100
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        )}
        
        {/* 主要反馈 */}
        <Box mb={3}>
          <Typography variant="subtitle1" gutterBottom>
            反馈意见
          </Typography>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="body1">
              {lastFeedback.feedback}
            </Typography>
          </Paper>
        </Box>
        
        {/* 语法校正 */}
        {lastFeedback.grammarCorrections && lastFeedback.grammarCorrections.length > 0 && (
          <Box mb={3}>
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">语法校正</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {lastFeedback.grammarCorrections.map((correction, index) => (
                  <Box key={index} mb={index < lastFeedback.grammarCorrections!.length - 1 ? 2 : 0}>
                    <Box display="flex" alignItems="flex-start">
                      <ErrorIcon color="error" fontSize="small" sx={{ mr: 1, mt: 0.5 }} />
                      <Box>
                        <Typography variant="body2" sx={{ textDecoration: 'line-through' }}>
                          {correction.original}
                        </Typography>
                        <Typography variant="body2" color="success.main">
                          {correction.corrected}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {correction.explanation}
                        </Typography>
                      </Box>
                    </Box>
                    {index < lastFeedback.grammarCorrections!.length - 1 && (
                      <Divider sx={{ my: 1 }} />
                    )}
                  </Box>
                ))}
              </AccordionDetails>
            </Accordion>
          </Box>
        )}
        
        {/* 替代表达 */}
        {lastFeedback.alternativeExpressions && lastFeedback.alternativeExpressions.length > 0 && (
          <Box mb={3}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">替代表达方式</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {lastFeedback.alternativeExpressions.map((expression, index) => (
                    <Chip
                      key={index}
                      label={expression}
                      onClick={() => handleCopy(expression)}
                      icon={<FileCopyIcon fontSize="small" />}
                      variant="outlined"
                      color="primary"
                    />
                  ))}
                </Box>
              </AccordionDetails>
            </Accordion>
          </Box>
        )}
        
        {/* 改进建议 */}
        {lastFeedback.suggestions && lastFeedback.suggestions.length > 0 && (
          <Box mb={3}>
            <Typography variant="subtitle1" gutterBottom>
              改进建议
            </Typography>
            <Box>
              {lastFeedback.suggestions.map((suggestion, index) => (
                <Alert 
                  key={index}
                  icon={<LightbulbIcon />}
                  severity="info"
                  sx={{ mb: index < lastFeedback.suggestions.length - 1 ? 1 : 0 }}
                >
                  {suggestion}
                </Alert>
              ))}
            </Box>
          </Box>
        )}
        
        {/* 生成时间 */}
        <Box display="flex" justifyContent="flex-end">
          <Typography variant="caption" color="textSecondary">
            生成于: {new Date(lastFeedback.timestamp).toLocaleString()}
          </Typography>
        </Box>
      </Box>
    );
  };
  
  // 渲染历史反馈
  const renderHistoryFeedbacks = () => {
    if (savedFeedbacks.length === 0) {
      return (
        <Box textAlign="center" py={4}>
          <HistoryIcon style={{ fontSize: 60, color: '#ccc' }} />
          <Typography variant="body1" color="textSecondary" mt={2}>
            尚无保存的反馈历史
          </Typography>
        </Box>
      );
    }
    
    const selectedFeedback = selectedHistoryItem 
      ? savedFeedbacks.find(f => f.id === selectedHistoryItem)
      : null;
    
    return (
      <Box>
        <Typography variant="subtitle1" gutterBottom>
          已保存的反馈 ({savedFeedbacks.length})
        </Typography>
        
        <Box display="flex" gap={2}>
          {/* 历史列表 */}
          <Box width="40%">
            <Paper variant="outlined" sx={{ maxHeight: 400, overflow: 'auto' }}>
              <Box p={1}>
                {savedFeedbacks.map((feedback, index) => (
                  <Box key={feedback.id}>
                    <Box
                      p={1}
                      sx={{
                        borderRadius: 1,
                        cursor: 'pointer',
                        bgcolor: selectedHistoryItem === feedback.id ? 'primary.50' : 'transparent',
                        '&:hover': {
                          bgcolor: selectedHistoryItem === feedback.id ? 'primary.100' : 'action.hover'
                        }
                      }}
                      onClick={() => setSelectedHistoryItem(feedback.id)}
                    >
                      <Typography variant="subtitle2" noWrap>
                        {feedback.userInput.length > 30 
                          ? feedback.userInput.substring(0, 30) + '...'
                          : feedback.userInput
                        }
                      </Typography>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="caption" color="textSecondary">
                          {new Date(feedback.timestamp).toLocaleDateString()}
                        </Typography>
                        {feedback.score !== undefined && (
                          <Chip 
                            label={`${feedback.score}/100`}
                            size="small"
                            color={
                              feedback.score >= 90 ? 'success' :
                              feedback.score >= 70 ? 'primary' :
                              feedback.score >= 50 ? 'warning' : 'error'
                            }
                          />
                        )}
                      </Box>
                    </Box>
                    {index < savedFeedbacks.length - 1 && <Divider />}
                  </Box>
                ))}
              </Box>
            </Paper>
          </Box>
          
          {/* 历史详情 */}
          <Box width="60%">
            {selectedFeedback ? (
              <Paper variant="outlined" sx={{ p: 2, maxHeight: 400, overflow: 'auto' }}>
                <Typography variant="body1" gutterBottom>
                  {selectedFeedback.feedback}
                </Typography>
                
                {selectedFeedback.suggestions && selectedFeedback.suggestions.length > 0 && (
                  <Box mt={2}>
                    <Typography variant="subtitle2" gutterBottom>
                      改进建议:
                    </Typography>
                    {selectedFeedback.suggestions.map((suggestion, idx) => (
                      <Typography key={idx} variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                        <LightbulbIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
                        {suggestion}
                      </Typography>
                    ))}
                  </Box>
                )}
              </Paper>
            ) : (
              <Box 
                height="100%" 
                display="flex" 
                alignItems="center" 
                justifyContent="center"
                sx={{ color: 'text.secondary' }}
              >
                <Typography>选择一条反馈查看详情</Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    );
  };
  
  // 渲染设置面板
  const renderSettings = () => {
    if (!showSettings) return null;
    
    return (
      <Box mb={3}>
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            AI反馈设置
          </Typography>
          
          <Box mb={2}>
            <Typography variant="body2" gutterBottom>
              反馈语言:
            </Typography>
            <Box display="flex" gap={1}>
              <Button 
                variant={feedbackLanguage === 'zh' ? 'contained' : 'outlined'}
                size="small"
                onClick={() => setFeedbackLanguage('zh')}
              >
                中文
              </Button>
              <Button 
                variant={feedbackLanguage === 'en' ? 'contained' : 'outlined'}
                size="small"
                onClick={() => setFeedbackLanguage('en')}
              >
                英文
              </Button>
            </Box>
          </Box>
          
          {apiKey === undefined && (
            <Box mb={2}>
              <TextField
                label="OpenAI API密钥"
                variant="outlined"
                size="small"
                fullWidth
                placeholder="设置API密钥以使用真实AI功能"
                disabled={offlineMode}
                helperText={offlineMode ? "离线模式下无法设置API密钥" : ""}
              />
            </Box>
          )}
          
          <Box display="flex" justifyContent="flex-end">
            <Button 
              size="small"
              onClick={() => setShowSettings(false)}
            >
              关闭设置
            </Button>
          </Box>
        </Paper>
      </Box>
    );
  };
  
  return (
    <Box>
      {/* 头部控制区 */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Button
            variant={viewMode === 'current' ? 'contained' : 'outlined'}
            onClick={() => setViewMode('current')}
            size="small"
            sx={{ mr: 1 }}
          >
            当前反馈
          </Button>
          <Button
            variant={viewMode === 'history' ? 'contained' : 'outlined'}
            onClick={() => setViewMode('history')}
            size="small"
            startIcon={<HistoryIcon />}
          >
            历史记录 ({savedFeedbacks.length})
          </Button>
        </Box>
        
        <IconButton onClick={() => setShowSettings(!showSettings)}>
          <SettingsIcon />
        </IconButton>
      </Box>
      
      {/* 设置面板 */}
      {renderSettings()}
      
      {/* 主要内容区 */}
      {isGenerating ? (
        renderLoading()
      ) : (
        <Box>
          {viewMode === 'current' ? renderCurrentFeedback() : renderHistoryFeedbacks()}
        </Box>
      )}
    </Box>
  );
} 