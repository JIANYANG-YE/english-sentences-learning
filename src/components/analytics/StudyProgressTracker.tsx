import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  IconButton,
  Divider,
  Chip,
  CircularProgress,
  LinearProgress,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  Tooltip,
  useTheme
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  CalendarToday as CalendarTodayIcon,
  Schedule as ScheduleIcon,
  EmojiEvents as EmojiEventsIcon,
  CheckCircle as CheckCircleIcon,
  LocalOffer as LocalOfferIcon,
  School as SchoolIcon,
  Whatshot as WhatshotIcon
} from '@mui/icons-material';

// 类型定义
interface LearningActivity {
  id: string;
  date: string;
  type: 'course' | 'practice' | 'test' | 'review';
  title: string;
  duration: number; // 分钟
  items: number; // 例如：单词数、句子数
  score?: number; // 可选，分数
  completed: boolean;
}

interface ProgressStats {
  totalLearningTime: number; // 总学习时间（分钟）
  completedActivities: number; // 完成的活动数
  learningStreak: number; // 连续学习天数
  averageScore: number; // 平均分数
  learningEfficiency: number; // 学习效率（0-100）
  totalItemsLearned: number; // 学习的总项目数（单词、句子等）
}

interface CategoryProgress {
  category: string;
  progress: number; // 0-100
  itemsLearned: number;
  timeSpent: number; // 分钟
}

interface StudyProgressTrackerProps {
  userId?: string;
  onRefreshData?: () => void;
  onStartSession?: (sessionId: string) => void;
}

const StudyProgressTracker: React.FC<StudyProgressTrackerProps> = ({
  userId,
  onRefreshData,
  onStartSession
}) => {
  const theme = useTheme();
  
  // 状态
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');
  const [isLoading, setIsLoading] = useState(false);
  const [recentActivities, setRecentActivities] = useState<LearningActivity[]>([]);
  const [progressStats, setProgressStats] = useState<ProgressStats | null>(null);
  const [categoryProgress, setCategoryProgress] = useState<CategoryProgress[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // 处理时间范围变化
  const handleTimeRangeChange = (event: SelectChangeEvent) => {
    setTimeRange(event.target.value as 'week' | 'month' | 'year');
  };
  
  // 初始加载数据
  useEffect(() => {
    loadProgressData();
  }, [userId, timeRange]);
  
  // 加载进度数据
  const loadProgressData = () => {
    setIsLoading(true);
    setError(null);
    
    // 模拟API请求
    setTimeout(() => {
      try {
        // 模拟最近活动数据
        const mockActivities: LearningActivity[] = [
          {
            id: 'act1',
            date: '2023-05-15T14:30:00',
            type: 'course',
            title: '商务英语对话入门',
            duration: 45,
            items: 15,
            score: 92,
            completed: true
          },
          {
            id: 'act2',
            date: '2023-05-14T09:15:00',
            type: 'practice',
            title: '过去时态练习',
            duration: 30,
            items: 25,
            score: 85,
            completed: true
          },
          {
            id: 'act3',
            date: '2023-05-13T16:45:00',
            type: 'review',
            title: '旅行词汇复习',
            duration: 20,
            items: 40,
            completed: true
          },
          {
            id: 'act4',
            date: '2023-05-12T11:30:00',
            type: 'test',
            title: '中级语法测试',
            duration: 35,
            items: 30,
            score: 78,
            completed: true
          },
          {
            id: 'act5',
            date: '2023-05-10T08:00:00',
            type: 'course',
            title: '日常英语对话进阶',
            duration: 50,
            items: 20,
            score: 88,
            completed: true
          }
        ];
        
        // 模拟进度统计数据
        const mockStats: ProgressStats = {
          totalLearningTime: 450, // 分钟
          completedActivities: 28,
          learningStreak: 12,
          averageScore: 86,
          learningEfficiency: 78,
          totalItemsLearned: 730
        };
        
        // 模拟分类进度数据
        const mockCategoryProgress: CategoryProgress[] = [
          {
            category: '词汇',
            progress: 65,
            itemsLearned: 350,
            timeSpent: 180
          },
          {
            category: '语法',
            progress: 72,
            itemsLearned: 120,
            timeSpent: 150
          },
          {
            category: '听力',
            progress: 48,
            itemsLearned: 95,
            timeSpent: 120
          },
          {
            category: '口语',
            progress: 53,
            itemsLearned: 85,
            timeSpent: 100
          },
          {
            category: '阅读',
            progress: 67,
            itemsLearned: 80,
            timeSpent: 90
          }
        ];
        
        setRecentActivities(mockActivities);
        setProgressStats(mockStats);
        setCategoryProgress(mockCategoryProgress);
        setIsLoading(false);
      } catch (err) {
        setError('加载数据时出错，请重试');
        setIsLoading(false);
      }
    }, 800);
  };
  
  // 根据活动类型获取图标
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'course': return <SchoolIcon />;
      case 'practice': return <WhatshotIcon />;
      case 'test': return <EmojiEventsIcon />;
      case 'review': return <RefreshIcon />;
      default: return <CalendarTodayIcon />;
    }
  };
  
  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };
  
  // 获取进度颜色
  const getProgressColor = (progress: number) => {
    if (progress >= 80) return theme.palette.success.main;
    if (progress >= 60) return theme.palette.info.main;
    if (progress >= 40) return theme.palette.warning.main;
    return theme.palette.error.main;
  };
  
  // 获取活动类型文本
  const getActivityTypeText = (type: string) => {
    switch (type) {
      case 'course': return '课程学习';
      case 'practice': return '练习';
      case 'test': return '测试';
      case 'review': return '复习';
      default: return '学习活动';
    }
  };
  
  // 渲染加载中状态
  if (isLoading && !progressStats) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>
          加载学习进度数据...
        </Typography>
      </Box>
    );
  }
  
  // 渲染错误状态
  if (error) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" color="error" gutterBottom>
          {error}
        </Typography>
        <Button 
          variant="outlined" 
          startIcon={<RefreshIcon />}
          onClick={loadProgressData}
          sx={{ mt: 2 }}
        >
          重新加载
        </Button>
      </Box>
    );
  }
  
  return (
    <Box>
      {/* 顶部控制栏 */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2" fontWeight="bold">
          学习进度追踪
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 120, mr: 1 }}>
            <InputLabel>时间范围</InputLabel>
            <Select
              value={timeRange}
              label="时间范围"
              onChange={handleTimeRangeChange}
            >
              <MenuItem value="week">本周</MenuItem>
              <MenuItem value="month">本月</MenuItem>
              <MenuItem value="year">今年</MenuItem>
            </Select>
          </FormControl>
          <Tooltip title="刷新数据">
            <IconButton 
              onClick={() => {
                loadProgressData();
                onRefreshData && onRefreshData();
              }}
              color="primary"
              size="small"
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      
      {/* 概览统计卡片 */}
      {progressStats && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6} sm={4} md={2}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <ScheduleIcon color="primary" sx={{ mr: 1, fontSize: 20 }} />
                  <Typography variant="body2" color="text.secondary">
                    总学习时间
                  </Typography>
                </Box>
                <Typography variant="h6" component="div" fontWeight="bold">
                  {Math.floor(progressStats.totalLearningTime / 60)}小时{progressStats.totalLearningTime % 60}分钟
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={6} sm={4} md={2}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CheckCircleIcon color="primary" sx={{ mr: 1, fontSize: 20 }} />
                  <Typography variant="body2" color="text.secondary">
                    完成活动
                  </Typography>
                </Box>
                <Typography variant="h6" component="div" fontWeight="bold">
                  {progressStats.completedActivities}个
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={6} sm={4} md={2}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <WhatshotIcon color="primary" sx={{ mr: 1, fontSize: 20 }} />
                  <Typography variant="body2" color="text.secondary">
                    连续学习
                  </Typography>
                </Box>
                <Typography variant="h6" component="div" fontWeight="bold">
                  {progressStats.learningStreak}天
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={6} sm={4} md={2}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <EmojiEventsIcon color="primary" sx={{ mr: 1, fontSize: 20 }} />
                  <Typography variant="body2" color="text.secondary">
                    平均分数
                  </Typography>
                </Box>
                <Typography variant="h6" component="div" fontWeight="bold">
                  {progressStats.averageScore}分
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={6} sm={4} md={2}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <TrendingUpIcon color="primary" sx={{ mr: 1, fontSize: 20 }} />
                  <Typography variant="body2" color="text.secondary">
                    学习效率
                  </Typography>
                </Box>
                <Typography variant="h6" component="div" fontWeight="bold">
                  {progressStats.learningEfficiency}%
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={6} sm={4} md={2}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LocalOfferIcon color="primary" sx={{ mr: 1, fontSize: 20 }} />
                  <Typography variant="body2" color="text.secondary">
                    学习项目
                  </Typography>
                </Box>
                <Typography variant="h6" component="div" fontWeight="bold">
                  {progressStats.totalItemsLearned}项
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
      
      {/* 主要内容区 */}
      <Grid container spacing={3}>
        {/* 分类进度 */}
        <Grid item xs={12} md={6}>
          <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom fontWeight="medium">
              学习类别进度
            </Typography>
            
            {categoryProgress.map((category, index) => (
              <Box key={category.category} sx={{ mb: index < categoryProgress.length - 1 ? 2 : 0 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                  <Typography variant="body2" fontWeight="medium">
                    {category.category}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {category.progress}%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={category.progress} 
                  sx={{ 
                    height: 8, 
                    borderRadius: 1,
                    mb: 0.5,
                    backgroundColor: `${getProgressColor(category.progress)}20`,
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: getProgressColor(category.progress)
                    }
                  }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    已学{category.itemsLearned}项
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    投入{category.timeSpent}分钟
                  </Typography>
                </Box>
                {index < categoryProgress.length - 1 && <Divider sx={{ mt: 2 }} />}
              </Box>
            ))}
          </Paper>
        </Grid>
        
        {/* 最近活动 */}
        <Grid item xs={12} md={6}>
          <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom fontWeight="medium">
              最近学习活动
            </Typography>
            
            {recentActivities.map((activity, index) => (
              <Box key={activity.id}>
                <Box sx={{ display: 'flex', mb: 1 }}>
                  <Box 
                    sx={{ 
                      mr: 2, 
                      display: 'flex',
                      mt: 0.5,
                      color: activity.completed ? 'success.main' : 'primary.main'
                    }}
                  >
                    {getActivityIcon(activity.type)}
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle2">
                      {activity.title}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="caption" color="text.secondary">
                        {getActivityTypeText(activity.type)} · {formatDate(activity.date)}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Chip 
                          label={`${activity.duration}分钟`} 
                          size="small" 
                          variant="outlined"
                          sx={{ mr: 1, height: 22 }}
                        />
                        {activity.score && (
                          <Chip 
                            label={`${activity.score}分`} 
                            size="small"
                            color={activity.score >= 90 ? "success" : activity.score >= 70 ? "primary" : "warning"}
                            variant="outlined"
                            sx={{ height: 22 }}
                          />
                        )}
                      </Box>
                    </Box>
                  </Box>
                </Box>
                {index < recentActivities.length - 1 && <Divider sx={{ my: 1.5 }} />}
              </Box>
            ))}
            
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
              <Button 
                variant="outlined" 
                size="small"
                onClick={() => onStartSession && onStartSession('new-session')}
              >
                开始新的学习会话
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StudyProgressTracker; 