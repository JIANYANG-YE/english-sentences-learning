'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Tabs, 
  Tab, 
  Grid, 
  Button, 
  Chip, 
  CircularProgress, 
  Divider,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  ToggleButtonGroup,
  ToggleButton,
  Avatar,
  Tooltip,
  LinearProgress
} from '@mui/material';
import { 
  Alarm, 
  CalendarMonth, 
  Schedule, 
  TrendingUp, 
  TrendingDown, 
  Info, 
  Check, 
  Close, 
  QuestionAnswer,
  RecordVoiceOver,
  MenuBook,
  Create,
  MoreVert,
  LibraryBooks,
  AccessTime,
  CalendarToday,
  Lightbulb,
  Whatshot
} from '@mui/icons-material';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';

// 学习习惯维度类型
type HabitDimension = 'time' | 'regularity' | 'concentration' | 'method' | 'engagement';

// 学习习惯分析数据接口
interface HabitAnalysisData {
  dimension: HabitDimension;
  score: number;
  trend: 'up' | 'down' | 'neutral';
  insights: string[];
  recommendations: string[];
  badHabits: string[];
  goodHabits: string[];
}

// 学习时间分布数据接口
interface TimeDistributionData {
  dayOfWeek: string;
  morning: number;
  afternoon: number;
  evening: number;
  night: number;
}

// 学习习惯趋势数据接口
interface HabitTrendData {
  date: string;
  score: number;
  dimension: HabitDimension;
}

// 学习活动类型定义
type ActivityType = 'reading' | 'writing' | 'listening' | 'speaking' | 'vocabulary' | 'grammar';

// 学习活动数据接口
interface ActivityData {
  type: ActivityType;
  duration: number;
  percentage: number;
}

// 学习习惯标签数据接口
interface HabitTagData {
  tag: string;
  strength: number;
  isPositive: boolean;
}

/**
 * 获取习惯维度名称
 */
const getDimensionName = (dimension: HabitDimension): string => {
  const dimensionMap: Record<HabitDimension, string> = {
    time: '学习时间',
    regularity: '学习规律性',
    concentration: '专注度',
    method: '学习方法',
    engagement: '交互参与度'
  };
  return dimensionMap[dimension] || dimension;
};

/**
 * 获取习惯维度图标
 */
const getDimensionIcon = (dimension: HabitDimension) => {
  const iconMap: Record<HabitDimension, React.ReactNode> = {
    time: <Schedule fontSize="small" />,
    regularity: <CalendarMonth fontSize="small" />,
    concentration: <Alarm fontSize="small" />,
    method: <LibraryBooks fontSize="small" />,
    engagement: <QuestionAnswer fontSize="small" />
  };
  return iconMap[dimension] || <Info fontSize="small" />;
};

/**
 * 获取活动类型图标
 */
const getActivityIcon = (type: ActivityType) => {
  const iconMap: Record<ActivityType, React.ReactNode> = {
    reading: <MenuBook fontSize="small" />,
    writing: <Create fontSize="small" />,
    listening: <RecordVoiceOver fontSize="small" />,
    speaking: <QuestionAnswer fontSize="small" />,
    vocabulary: <LibraryBooks fontSize="small" />,
    grammar: <Info fontSize="small" />
  };
  return iconMap[type] || <Info fontSize="small" />;
};

/**
 * 获取活动类型名称
 */
const getActivityName = (type: ActivityType): string => {
  const activityMap: Record<ActivityType, string> = {
    reading: '阅读',
    writing: '写作',
    listening: '听力',
    speaking: '口语',
    vocabulary: '词汇',
    grammar: '语法'
  };
  return activityMap[type] || type;
};

/**
 * 学习习惯评分卡片组件
 */
interface HabitScoreCardProps {
  dimension: HabitDimension;
  score: number;
  trend: 'up' | 'down' | 'neutral';
  onClick: (dimension: HabitDimension) => void;
  isSelected: boolean;
}

const HabitScoreCard: React.FC<HabitScoreCardProps> = ({ 
  dimension, 
  score, 
  trend, 
  onClick, 
  isSelected 
}) => {
  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp color="success" fontSize="small" />;
    if (trend === 'down') return <TrendingDown color="error" fontSize="small" />;
    return null;
  };

  return (
    <Card 
      variant={isSelected ? "elevation" : "outlined"} 
      elevation={isSelected ? 4 : 0}
      sx={{ 
        cursor: 'pointer', 
        bgcolor: isSelected ? 'primary.light' : 'background.paper',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: 3
        }
      }}
      onClick={() => onClick(dimension)}
    >
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Avatar sx={{ bgcolor: isSelected ? 'primary.main' : 'action.disabledBackground', mr: 1 }}>
            {getDimensionIcon(dimension)}
          </Avatar>
          <Typography variant="subtitle1" fontWeight="medium">
            {getDimensionName(dimension)}
          </Typography>
          <Box sx={{ ml: 'auto' }}>
            {getTrendIcon()}
          </Box>
        </Box>
        
        <Box sx={{ position: 'relative', display: 'inline-flex', mt: 1 }}>
          <CircularProgress 
            variant="determinate" 
            value={score} 
            size={60} 
            thickness={5}
            sx={{ 
              color: score > 70 ? 'success.main' : score > 40 ? 'warning.main' : 'error.main'
            }}
          />
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="body1" fontWeight="bold">
              {score}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

/**
 * 学习习惯标签组件
 */
interface HabitTagProps {
  tag: string;
  strength: number;
  isPositive: boolean;
}

const HabitTag: React.FC<HabitTagProps> = ({ tag, strength, isPositive }) => {
  const getColor = () => {
    if (!isPositive) return 'error';
    if (strength > 7) return 'success';
    if (strength > 4) return 'info';
    return 'warning';
  };

  const getIcon = () => {
    if (isPositive) return <Check fontSize="small" />;
    return <Close fontSize="small" />;
  };

  return (
    <Chip
      icon={getIcon()}
      label={tag}
      color={getColor()}
      variant="outlined"
      size="medium"
      sx={{ m: 0.5 }}
    />
  );
};

// 定义学习习惯数据类型
interface LearningHabitData {
  userId: string;
  analysisDate: string;
  bestTimeOfDay: string;
  longestStreak: number;
  currentStreak: number;
  averageSessionDuration: number;
  sessionsPerWeek: number;
  completionRate: number;
  consistencyScore: number;
  focusScore: number;
  timeDistribution: {
    morning: number;
    afternoon: number;
    evening: number;
    night: number;
  };
  weekdayDistribution: {
    monday: number;
    tuesday: number;
    wednesday: number;
    thursday: number;
    friday: number;
    saturday: number;
    sunday: number;
  };
  dailyActivity: Array<{
    date: string;
    minutes: number;
    completed: number;
  }>;
  weeklyProgress: Array<{
    week: string;
    minutes: number;
    consistency: number;
  }>;
  habitStrengthTrend: Array<{
    month: string;
    strength: number;
  }>;
  focusDistribution: Array<{
    duration: string;
    percentage: number;
  }>;
}

interface LearningHabitAnalyzerProps {
  userId: string;
  onGenerateRecommendations?: (recommendations: string[]) => void;
  className?: string;
}

// 色彩配置
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const LearningHabitAnalyzer: React.FC<LearningHabitAnalyzerProps> = ({ 
  userId, 
  onGenerateRecommendations,
  className
}) => {
  const [habitData, setHabitData] = useState<LearningHabitData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  // 模拟从API获取学习习惯数据
  useEffect(() => {
    const fetchHabitData = async () => {
      try {
        setLoading(true);
        // 实际项目中这里应该是API调用
        // const response = await fetch(`/api/learning-habits/${userId}`);
        // const data = await response.json();
        
        // 模拟数据
        const mockData: LearningHabitData = {
          userId,
          analysisDate: new Date().toISOString(),
          bestTimeOfDay: '晚上',
          longestStreak: 15,
          currentStreak: 7,
          averageSessionDuration: 32,
          sessionsPerWeek: 5.2,
          completionRate: 78,
          consistencyScore: 82,
          focusScore: 76,
          timeDistribution: {
            morning: 15,
            afternoon: 25,
            evening: 40,
            night: 20
          },
          weekdayDistribution: {
            monday: 60,
            tuesday: 75,
            wednesday: 45,
            thursday: 80,
            friday: 65,
            saturday: 90,
            sunday: 85
          },
          dailyActivity: [
            { date: '9/1', minutes: 25, completed: 2 },
            { date: '9/2', minutes: 30, completed: 3 },
            { date: '9/3', minutes: 0, completed: 0 },
            { date: '9/4', minutes: 45, completed: 4 },
            { date: '9/5', minutes: 20, completed: 2 },
            { date: '9/6', minutes: 35, completed: 3 },
            { date: '9/7', minutes: 40, completed: 3 },
            { date: '9/8', minutes: 15, completed: 1 },
            { date: '9/9', minutes: 50, completed: 5 },
            { date: '9/10', minutes: 30, completed: 3 },
            { date: '9/11', minutes: 25, completed: 2 },
            { date: '9/12', minutes: 0, completed: 0 },
            { date: '9/13', minutes: 40, completed: 4 },
            { date: '9/14', minutes: 35, completed: 3 }
          ],
          weeklyProgress: [
            { week: '第1周', minutes: 180, consistency: 65 },
            { week: '第2周', minutes: 210, consistency: 70 },
            { week: '第3周', minutes: 195, consistency: 68 },
            { week: '第4周', minutes: 240, consistency: 75 },
            { week: '第5周', minutes: 270, consistency: 85 },
            { week: '第6周', minutes: 255, consistency: 80 },
          ],
          habitStrengthTrend: [
            { month: '1月', strength: 40 },
            { month: '2月', strength: 45 },
            { month: '3月', strength: 55 },
            { month: '4月', strength: 60 },
            { month: '5月', strength: 58 },
            { month: '6月', strength: 65 },
            { month: '7月', strength: 70 },
            { month: '8月', strength: 75 },
            { month: '9月', strength: 80 },
          ],
          focusDistribution: [
            { duration: '0-15分钟', percentage: 15 },
            { duration: '15-30分钟', percentage: 35 },
            { duration: '30-45分钟', percentage: 30 },
            { duration: '45-60分钟', percentage: 15 },
            { duration: '60+分钟', percentage: 5 },
          ]
        };
        
        // 延迟模拟网络请求
        setTimeout(() => {
          setHabitData(mockData);
          setLoading(false);
          
          // 生成推荐
          generateRecommendations(mockData);
        }, 1500);
      } catch (err) {
        setError('获取学习习惯数据失败');
        setLoading(false);
        console.error('Error fetching habit data:', err);
      }
    };

    fetchHabitData();
  }, [userId]);

  // 根据习惯数据生成建议
  const generateRecommendations = (data: LearningHabitData) => {
    const newRecommendations: string[] = [];

    // 基于最佳学习时间
    newRecommendations.push(`尽量在${data.bestTimeOfDay}安排学习，这是您的高效学习时段。`);

    // 基于连续性
    if (data.currentStreak < data.longestStreak * 0.5) {
      newRecommendations.push(`您当前的学习连续性(${data.currentStreak}天)低于历史最佳(${data.longestStreak}天)的一半，建议建立更稳定的学习惯例。`);
    }

    // 基于完成率
    if (data.completionRate < 70) {
      newRecommendations.push(`您的课程完成率为${data.completionRate}%，建议设置更合理的学习目标，提高完成率。`);
    } else if (data.completionRate > 90) {
      newRecommendations.push(`您的完成率高达${data.completionRate}%，可以考虑增加学习难度或内容量。`);
    }

    // 基于每周分布
    const weekdayValues = Object.values(data.weekdayDistribution);
    const maxDay = Math.max(...weekdayValues);
    const minDay = Math.min(...weekdayValues);
    if (maxDay > minDay * 3) {
      newRecommendations.push(`您的每周学习时间分布不太均匀，建议更平均地分配学习时间，保持稳定进步。`);
    }

    // 基于专注度
    if (data.focusScore < 70) {
      newRecommendations.push(`您的专注度评分为${data.focusScore}分，建议尝试番茄工作法或减少学习环境的干扰因素。`);
    }

    // 更新状态并调用父组件的回调
    setRecommendations(newRecommendations);
    if (onGenerateRecommendations) {
      onGenerateRecommendations(newRecommendations);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // 渲染学习时间分布图表
  const renderTimeDistributionChart = () => {
    if (!habitData) return null;
    
    const data = [
      { name: '早晨', value: habitData.timeDistribution.morning },
      { name: '下午', value: habitData.timeDistribution.afternoon },
      { name: '晚上', value: habitData.timeDistribution.evening },
      { name: '深夜', value: habitData.timeDistribution.night }
    ];
    
    return (
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Typography variant="h6" component="h3" gutterBottom>
            学习时间分布
          </Typography>
          <Box sx={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip />
              </PieChart>
            </ResponsiveContainer>
          </Box>
          <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 1 }}>
            最佳学习时段: {habitData.bestTimeOfDay}
          </Typography>
        </CardContent>
      </Card>
    );
  };
  
  // 渲染每周分布图表
  const renderWeekdayDistributionChart = () => {
    if (!habitData) return null;
    
    const data = [
      { name: '周一', value: habitData.weekdayDistribution.monday },
      { name: '周二', value: habitData.weekdayDistribution.tuesday },
      { name: '周三', value: habitData.weekdayDistribution.wednesday },
      { name: '周四', value: habitData.weekdayDistribution.thursday },
      { name: '周五', value: habitData.weekdayDistribution.friday },
      { name: '周六', value: habitData.weekdayDistribution.saturday },
      { name: '周日', value: habitData.weekdayDistribution.sunday }
    ];
    
    return (
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Typography variant="h6" component="h3" gutterBottom>
            每周学习分布
          </Typography>
          <Box sx={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip />
                <Bar dataKey="value" fill="#8884d8" name="学习活跃度" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>
    );
  };
  
  // 渲染每日活动图表
  const renderDailyActivityChart = () => {
    if (!habitData) return null;
    
    return (
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Typography variant="h6" component="h3" gutterBottom>
            近期学习活动
          </Typography>
          <Box sx={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={habitData.dailyActivity}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <ChartTooltip />
                <Area type="monotone" dataKey="minutes" name="学习时长(分钟)" stroke="#8884d8" fill="#8884d8" />
                <Area type="monotone" dataKey="completed" name="完成任务数" stroke="#82ca9d" fill="#82ca9d" />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>
    );
  };
  
  // 渲染习惯强度趋势图表
  const renderHabitStrengthChart = () => {
    if (!habitData) return null;
    
    return (
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Typography variant="h6" component="h3" gutterBottom>
            学习习惯强度趋势
          </Typography>
          <Box sx={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={habitData.habitStrengthTrend}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip />
                <Line
                  type="monotone"
                  dataKey="strength"
                  name="习惯强度"
                  stroke="#ff7300"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>
    );
  };

  // 渲染关键指标卡片
  const renderMetricsCards = () => {
    if (!habitData) return null;
    
    return (
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <Whatshot sx={{ color: '#ff6d00', mr: 1 }} />
                <Typography variant="h6" component="div">
                  当前连续学习
                </Typography>
              </Box>
              <Typography variant="h4" component="div" color="primary">
                {habitData.currentStreak} 天
              </Typography>
              <Box display="flex" alignItems="center" mt={1}>
                <Typography variant="body2" color="textSecondary">
                  历史最长: {habitData.longestStreak}天
                </Typography>
                {habitData.currentStreak >= habitData.longestStreak * 0.8 && (
                  <Tooltip title="接近历史最佳记录!">
                    <TrendingUp fontSize="small" sx={{ ml: 1, color: 'success.main' }} />
                  </Tooltip>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <AccessTime sx={{ color: '#0288d1', mr: 1 }} />
                <Typography variant="h6" component="div">
                  平均学习时长
                </Typography>
              </Box>
              <Typography variant="h4" component="div" color="primary">
                {habitData.averageSessionDuration} 分钟
              </Typography>
              <Box display="flex" alignItems="center" mt={1}>
                <Typography variant="body2" color="textSecondary">
                  每周 {habitData.sessionsPerWeek.toFixed(1)} 次
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <CalendarToday sx={{ color: '#7b1fa2', mr: 1 }} />
                <Typography variant="h6" component="div">
                  完成率
                </Typography>
              </Box>
              <Typography variant="h4" component="div" color="primary">
                {habitData.completionRate}%
              </Typography>
              <Box display="flex" alignItems="center" mt={1}>
                <LinearProgress 
                  variant="determinate" 
                  value={habitData.completionRate} 
                  sx={{ width: '100%', height: 8, borderRadius: 4 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <Lightbulb sx={{ color: '#ffc107', mr: 1 }} />
                <Typography variant="h6" component="div">
                  专注度分数
                </Typography>
              </Box>
              <Typography variant="h4" component="div" color="primary">
                {habitData.focusScore}/100
              </Typography>
              <Box display="flex" alignItems="center" justifyContent="center" mt={1}>
                <CircularProgress 
                  variant="determinate" 
                  value={habitData.focusScore} 
                  size={40}
                  thickness={4}
                  sx={{ 
                    color: habitData.focusScore > 75 ? 'success.main' : 
                           habitData.focusScore > 50 ? 'warning.main' : 'error.main'
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  // 渲染推荐建议卡片
  const renderRecommendations = () => {
    if (!recommendations.length) return null;
    
    return (
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" component="h3" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <Lightbulb sx={{ mr: 1, color: '#ffc107' }} />
            基于您的学习习惯的建议
          </Typography>
          <Divider sx={{ my: 1 }} />
          {recommendations.map((rec, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', mt: 1 }}>
              <Typography 
                variant="body1" 
                gutterBottom
                sx={{ 
                  bgcolor: 'background.paper', 
                  p: 1.5, 
                  borderRadius: 2, 
                  boxShadow: 1,
                  borderLeft: '4px solid #2196f3',
                  width: '100%'
                }}
              >
                {rec}
              </Typography>
            </Box>
          ))}
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button 
              variant="outlined" 
              color="primary" 
              startIcon={<CalendarToday />}
            >
              生成学习计划
            </Button>
          </Box>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }} className={className}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          正在分析您的学习习惯...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }} className={className}>
        <Typography variant="body1" color="error">
          {error}
        </Typography>
        <Button variant="outlined" color="primary" sx={{ mt: 2 }}>
          重试
        </Button>
      </Box>
    );
  }

  if (!habitData) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }} className={className}>
        <Typography variant="body1">
          没有可用的学习习惯数据
        </Typography>
      </Box>
    );
  }

  return (
    <Box className={className}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          学习习惯分析
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          数据分析日期: {new Date(habitData.analysisDate).toLocaleDateString()}
        </Typography>
        
        {/* 关键指标卡片 */}
        {renderMetricsCards()}
        
        {/* 切换标签页 */}
        <Box sx={{ mt: 3, borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab label="学习模式" />
            <Tab label="学习趋势" />
            <Tab label="详细分析" />
          </Tabs>
        </Box>
        
        {/* 标签页内容 */}
        {activeTab === 0 && (
          <Box sx={{ mt: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                {renderTimeDistributionChart()}
              </Grid>
              <Grid item xs={12} md={6}>
                {renderWeekdayDistributionChart()}
              </Grid>
            </Grid>
          </Box>
        )}
        
        {activeTab === 1 && (
          <Box sx={{ mt: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                {renderDailyActivityChart()}
              </Grid>
              <Grid item xs={12} md={6}>
                {renderHabitStrengthChart()}
              </Grid>
            </Grid>
          </Box>
        )}
        
        {activeTab === 2 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              学习一致性分析
            </Typography>
            <Typography variant="body1" paragraph>
              您的学习一致性得分为 <strong>{habitData.consistencyScore}/100</strong>。
              这表明您在保持学习频率方面{habitData.consistencyScore >= 80 ? '做得非常好' : 
                habitData.consistencyScore >= 60 ? '有一定的规律性' : '有待提高'}。
              {habitData.consistencyScore < 60 && '建议设定固定的学习时间，并使用提醒功能。'}
            </Typography>
            
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              专注度分布
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={habitData.focusDistribution}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="duration" />
                  <YAxis />
                  <ChartTooltip />
                  <Bar dataKey="percentage" name="占比(%)" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              您的学习时间大多集中在 {
                habitData.focusDistribution.reduce((a, b) => a.percentage > b.percentage ? a : b).duration
              } 的时间段内。
              {habitData.focusDistribution[4].percentage > 10 ? 
                '您能够保持较长时间的专注，这对于语言学习非常有益。' : 
                '尝试逐渐延长单次学习时间，提高专注力和学习效果。'}
            </Typography>
          </Box>
        )}

        {/* 推荐建议 */}
        {renderRecommendations()}
      </Paper>
    </Box>
  );
};

export default LearningHabitAnalyzer; 