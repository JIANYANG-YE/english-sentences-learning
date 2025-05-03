import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Avatar,
  Chip,
  CircularProgress,
  IconButton,
  Tabs,
  Tab,
  Divider,
  Tooltip,
  Card,
  CardContent,
  Drawer,
  Alert
} from '@mui/material';
import {
  Mic as MicIcon,
  Send as SendIcon,
  Image as ImageIcon,
  Translate as TranslateIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  VolumeUp as VolumeUpIcon,
  Psychology as PsychologyIcon,
  School as SchoolIcon,
  Chat as ChatIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Lightbulb as LightbulbIcon,
  Timeline as TimelineIcon,
  Error as ErrorIcon,
  Assessment as AssessmentIcon,
  BarChart as BarChartIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import AITutor from './AITutor';
import { ErrorPattern } from '../analytics/ErrorPatternDetector';

// 定义增强型AI辅导提示
interface EnhancedSuggestion {
  id: string;
  type: 'grammar' | 'vocabulary' | 'pronunciation' | 'expression';
  content: string;
  explanation: string;
  examples: string[];
  relatedPatterns?: string[]; // 关联的错误模式ID
  difficulty: 'easy' | 'medium' | 'hard';
  learningResources?: {
    title: string;
    type: 'lesson' | 'exercise' | 'article';
    link: string;
  }[];
}

// 定义学习分析数据
interface LearningAnalyticsData {
  commonErrors: {
    id: string;
    category: string;
    description: string;
    frequency: number;
    impact: 'high' | 'medium' | 'low';
  }[];
  learningStreak: {
    current: number;
    longest: number;
  };
  progressData: {
    category: string;
    mastered: number;
    inProgress: number;
    total: number;
  }[];
  sessionStats: {
    totalSessions: number;
    averageDuration: number;
    lastSessionDate: string;
  };
}

// 定义组件属性
interface EnhancedAITutorProps {
  userId?: string;
  learningLevel?: 'beginner' | 'intermediate' | 'advanced';
  focusArea?: string[];
  onSaveSuggestion?: (suggestion: EnhancedSuggestion) => void;
  showAnalytics?: boolean;
}

// 增强型AI学习助手组件
const EnhancedAITutor: React.FC<EnhancedAITutorProps> = ({
  userId,
  learningLevel = 'intermediate',
  focusArea = [],
  onSaveSuggestion,
  showAnalytics = true
}) => {
  // 状态管理
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<LearningAnalyticsData | null>(null);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);
  const [activeAnalyticsTab, setActiveAnalyticsTab] = useState(0);
  const [errorPatterns, setErrorPatterns] = useState<ErrorPattern[]>([]);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  // 加载学习分析数据
  const loadAnalyticsData = () => {
    setIsLoadingAnalytics(true);
    
    // 模拟API请求延迟
    setTimeout(() => {
      // 模拟数据
      const mockData: LearningAnalyticsData = {
        commonErrors: [
          {
            id: 'err1',
            category: '语法',
            description: '过去完成时使用错误',
            frequency: 12,
            impact: 'medium'
          },
          {
            id: 'err2',
            category: '语法',
            description: '介词搭配错误',
            frequency: 18,
            impact: 'medium'
          },
          {
            id: 'err3',
            category: '词汇',
            description: '易混淆词汇使用错误',
            frequency: 15,
            impact: 'high'
          }
        ],
        learningStreak: {
          current: 5,
          longest: 14
        },
        progressData: [
          { category: '词汇', mastered: 120, inProgress: 45, total: 500 },
          { category: '语法', mastered: 35, inProgress: 20, total: 100 },
          { category: '听力', mastered: 28, inProgress: 12, total: 80 },
          { category: '口语', mastered: 15, inProgress: 25, total: 120 }
        ],
        sessionStats: {
          totalSessions: 24,
          averageDuration: 28,
          lastSessionDate: '2023-05-15'
        }
      };
      
      setAnalyticsData(mockData);
      setIsLoadingAnalytics(false);
      
      // 模拟加载错误模式数据
      const mockErrorPatterns: ErrorPattern[] = [
        {
          id: 'err1',
          category: '语法',
          subcategory: '时态',
          description: '过去完成时使用错误',
          frequency: 12,
          impact: 'medium',
          examples: [
            'I have finished my homework yesterday. ❌',
            'I had finished my homework before he called. ✓'
          ],
          suggestion: '过去完成时用于表示过去某一时间点之前已经完成的动作，通常与过去的某个时间点一起使用。'
        },
        {
          id: 'err2',
          category: '语法',
          subcategory: '介词',
          description: '介词搭配错误',
          frequency: 18,
          impact: 'medium',
          examples: [
            "I am interested on history. ❌",
            "I am interested in history. ✓"
          ],
          suggestion: '英语中的介词搭配需要记忆，没有固定规则。建议通过例句和常见搭配来学习。'
        }
      ];
      
      setErrorPatterns(mockErrorPatterns);
    }, 1500);
  };

  // 首次加载时获取分析数据
  useEffect(() => {
    if (showAnalytics) {
      loadAnalyticsData();
    }
  }, [showAnalytics]);

  // 处理会话中检测到的错误
  const handleErrorDetection = (text: string) => {
    // 模拟检测错误模式
    const detectedErrors = errorPatterns.filter(pattern => 
      pattern.examples.some(example => example.includes('❌') && 
      text.toLowerCase().includes(example.split('❌')[0].toLowerCase().trim()))
    );
    
    if (detectedErrors.length > 0) {
      setShowErrorAlert(true);
      // 3秒后自动关闭提醒
      setTimeout(() => setShowErrorAlert(false), 5000);
    }
    
    return detectedErrors;
  };

  // 处理分析标签切换
  const handleAnalyticsTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveAnalyticsTab(newValue);
  };

  // 获取影响等级颜色
  const getImpactColor = (impact: 'high' | 'medium' | 'low') => {
    switch (impact) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ position: 'relative', height: '100%' }}>
      {/* 主AI助手组件 */}
      <AITutor 
        userId={userId}
        learningLevel={learningLevel}
        focusArea={focusArea}
        onSaveSuggestion={onSaveSuggestion as any}
      />
      
      {/* 学习分析浮动按钮 */}
      {showAnalytics && (
        <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 5 }}>
          <Tooltip title="查看学习分析">
            <IconButton
              color="primary"
              onClick={() => setIsAnalyticsOpen(true)}
              sx={{ 
                bgcolor: 'background.paper',
                boxShadow: 2,
                '&:hover': { bgcolor: 'background.paper', opacity: 0.9 }
              }}
            >
              <AssessmentIcon />
            </IconButton>
          </Tooltip>
        </Box>
      )}
      
      {/* 错误检测提醒 */}
      {showErrorAlert && (
        <Alert 
          severity="warning"
          sx={{ 
            position: 'absolute', 
            bottom: 16, 
            left: '50%', 
            transform: 'translateX(-50%)',
            width: '80%',
            maxWidth: 500,
            zIndex: 10,
            boxShadow: 3
          }}
          onClose={() => setShowErrorAlert(false)}
          action={
            <Button 
              color="inherit" 
              size="small"
              onClick={() => {
                setIsAnalyticsOpen(true);
                setActiveAnalyticsTab(1); // 切换到错误模式标签
              }}
            >
              查看详情
            </Button>
          }
        >
          检测到您可能有常见的语法错误，点击查看详情了解更多。
        </Alert>
      )}
      
      {/* 学习分析抽屉 */}
      <Drawer
        anchor="right"
        open={isAnalyticsOpen}
        onClose={() => setIsAnalyticsOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: { xs: '100%', sm: 450 },
            boxSizing: 'border-box'
          }
        }}
      >
        <Box sx={{ p: 3 }}>
          {/* 分析标题 */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" component="h2" fontWeight="bold">
              学习分析
            </Typography>
            <IconButton onClick={() => setIsAnalyticsOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          
          {/* 分析内容标签页 */}
          <Tabs
            value={activeAnalyticsTab}
            onChange={handleAnalyticsTabChange}
            variant="fullWidth"
            sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab icon={<TimelineIcon />} label="进度" />
            <Tab icon={<ErrorIcon />} label="错误模式" />
            <Tab icon={<BarChartIcon />} label="统计" />
          </Tabs>
          
          {/* 加载中状态 */}
          {isLoadingAnalytics ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
              <CircularProgress />
            </Box>
          ) : analyticsData ? (
            <>
              {/* 进度标签内容 */}
              {activeAnalyticsTab === 0 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    学习进度概览
                  </Typography>
                  
                  {analyticsData.progressData.map((item, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2">{item.category}</Typography>
                        <Typography variant="body2">
                          {item.mastered}/{item.total} ({Math.round((item.mastered / item.total) * 100)}%)
                        </Typography>
                      </Box>
                      <Box sx={{ width: '100%', bgcolor: 'background.paper', borderRadius: 1, overflow: 'hidden' }}>
                        <Box
                          sx={{
                            width: `${(item.mastered / item.total) * 100}%`,
                            bgcolor: 'primary.main',
                            height: 10
                          }}
                        />
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        进行中: {item.inProgress} 项
                      </Typography>
                    </Box>
                  ))}
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="h6" gutterBottom>
                    学习连续性
                  </Typography>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center', mb: 2 }}>
                    <Box>
                      <Typography variant="h4" color="primary.main">
                        {analyticsData.learningStreak.current}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        当前连续学习天数
                      </Typography>
                    </Box>
                    <Divider orientation="vertical" flexItem />
                    <Box>
                      <Typography variant="h4" color="text.secondary">
                        {analyticsData.learningStreak.longest}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        最长连续学习记录
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<TimelineIcon />}
                    sx={{ mt: 2 }}
                  >
                    查看详细学习报告
                  </Button>
                </Box>
              )}
              
              {/* 错误模式标签内容 */}
              {activeAnalyticsTab === 1 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    常见错误模式
                  </Typography>
                  
                  {analyticsData.commonErrors.length > 0 ? (
                    analyticsData.commonErrors.map((error, index) => (
                      <Paper key={index} variant="outlined" sx={{ p: 2, mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="subtitle1">
                            {error.description}
                          </Typography>
                          <Chip 
                            label={error.impact === 'high' ? '高' : error.impact === 'medium' ? '中' : '低'}
                            color={getImpactColor(error.impact) as any}
                            size="small"
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          分类: {error.category}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          频率: 在过去30天内出现 {error.frequency} 次
                        </Typography>
                        
                        <Box sx={{ mt: 1 }}>
                          <Button size="small" color="primary">
                            查看详情
                          </Button>
                        </Box>
                      </Paper>
                    ))
                  ) : (
                    <Alert severity="info">
                      暂未检测到明显的错误模式。随着学习的进行，我们将帮助您识别和改正常见错误。
                    </Alert>
                  )}
                  
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<ErrorIcon />}
                    sx={{ mt: 2 }}
                  >
                    查看完整错误分析
                  </Button>
                </Box>
              )}
              
              {/* 统计标签内容 */}
              {activeAnalyticsTab === 2 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    学习会话统计
                  </Typography>
                  
                  <Card variant="outlined" sx={{ mb: 3 }}>
                    <CardContent>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        总学习会话数
                      </Typography>
                      <Typography variant="h4">
                        {analyticsData.sessionStats.totalSessions}
                      </Typography>
                      
                      <Divider sx={{ my: 2 }} />
                      
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        平均会话时长
                      </Typography>
                      <Typography variant="h5">
                        {analyticsData.sessionStats.averageDuration} 分钟
                      </Typography>
                      
                      <Divider sx={{ my: 2 }} />
                      
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        最近学习日期
                      </Typography>
                      <Typography variant="h6">
                        {analyticsData.sessionStats.lastSessionDate}
                      </Typography>
                    </CardContent>
                  </Card>
                  
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    学习专注度趋势
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      仅显示最近30天的学习活动，详细数据请查看完整报告。
                    </Typography>
                    <Box sx={{ height: 100, display: 'flex', alignItems: 'flex-end', mt: 2 }}>
                      {/* 模拟简单柱状图 */}
                      {[70, 65, 80, 90, 75, 60, 85].map((height, i) => (
                        <Box
                          key={i}
                          sx={{
                            height: `${height}%`,
                            width: `${100 / 7}%`,
                            bgcolor: height > 80 ? 'success.main' : height > 70 ? 'primary.main' : 'warning.main',
                            mx: 0.5,
                            borderRadius: '2px 2px 0 0'
                          }}
                        />
                      ))}
                    </Box>
                  </Paper>
                  
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<BarChartIcon />}
                  >
                    查看完整学习统计
                  </Button>
                </Box>
              )}
            </>
          ) : (
            <Alert severity="info">
              暂无学习数据，开始使用AI学习助手后将会收集和分析您的学习情况。
            </Alert>
          )}
        </Box>
      </Drawer>
    </Box>
  );
};

export default EnhancedAITutor; 