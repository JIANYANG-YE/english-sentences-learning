import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  CircularProgress,
  Button,
  Tabs,
  Tab,
  Divider,
  Chip,
  Alert,
  useTheme,
  IconButton,
  Tooltip,
  LinearProgress
} from '@mui/material';
import { 
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent
} from '@mui/lab';
import {
  AccessTime as AccessTimeIcon,
  TrendingUp as TrendingUpIcon,
  LocationOn as LocationOnIcon,
  Devices as DevicesIcon,
  Repeat as RepeatIcon,
  EmojiEvents as EmojiEventsIcon,
  Info as InfoIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  HelpOutline as HelpOutlineIcon,
  Check as CheckIcon,
  SwapVert as SwapVertIcon,
  LocalLibrary as BookIcon,
  EmojiObjects as InsightIcon,
  Timeline as TimelineIcon,
  CalendarToday as CalendarIcon,
  DonutLarge as DonutIcon,
  Error as ErrorIcon,
  WbSunny as MorningIcon,
  Brightness3 as NightIcon,
  Weekend as WeekendIcon
} from '@mui/icons-material';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend
} from 'recharts';

// 类型定义
interface LearningHabitAnalyzerProps {
  userId?: string;
  onHabitChange?: (changes: any) => void;
}

interface TimeDistribution {
  day: string;
  minutes: number;
}

interface DeviceUsage {
  device: string;
  percentage: number;
  color: string;
}

interface LocationData {
  location: string;
  percentage: number;
  color: string;
}

interface LearningPattern {
  category: string;
  value: number;
  fullMark: number;
}

interface LearningStreak {
  date: string;
  minutes: number;
}

interface HabitInsight {
  id: string;
  type: 'strength' | 'improvement' | 'suggestion';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  actionable: boolean;
  action?: string;
}

interface LearningHabit {
  id: string;
  category: 'time' | 'consistency' | 'focus' | 'method';
  title: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
  details: string;
  recommendation: string;
}

interface LearningHabitData {
  dailyActivityPatterns: {
    day: string;
    minutesLearned: number;
    completedItems: number;
  }[];
  timeOfDayDistribution: {
    timeSlot: string;
    percentage: number;
    minutes: number;
  }[];
  consistencyScore: number;
  focusScore: number;
  averageSessionLength: number;
  longestStreak: number;
  currentStreak: number;
  mostProductiveDay: string;
  mostProductiveTimeSlot: string;
  completionRate: number;
  habitInsights: {
    type: 'positive' | 'suggestion';
    message: string;
  }[];
}

const mockTimeDistribution: TimeDistribution[] = [
  { day: '周一', minutes: 45 },
  { day: '周二', minutes: 30 },
  { day: '周三', minutes: 60 },
  { day: '周四', minutes: 25 },
  { day: '周五', minutes: 15 },
  { day: '周六', minutes: 90 },
  { day: '周日', minutes: 75 },
];

const mockDeviceUsage: DeviceUsage[] = [
  { device: '手机', percentage: 45, color: '#0088FE' },
  { device: '平板', percentage: 30, color: '#00C49F' },
  { device: '电脑', percentage: 25, color: '#FFBB28' },
];

const mockLocationData: LocationData[] = [
  { location: '家里', percentage: 60, color: '#8884d8' },
  { location: '学校', percentage: 20, color: '#82ca9d' },
  { location: '通勤中', percentage: 15, color: '#ffc658' },
  { location: '其他', percentage: 5, color: '#ff8042' },
];

const mockLearningPattern: LearningPattern[] = [
  { category: '专注度', value: 80, fullMark: 100 },
  { category: '连续性', value: 65, fullMark: 100 },
  { category: '规律性', value: 90, fullMark: 100 },
  { category: '复习频率', value: 40, fullMark: 100 },
  { category: '主动性', value: 70, fullMark: 100 },
  { category: '多样性', value: 55, fullMark: 100 },
];

const mockLearningStreak: LearningStreak[] = [
  { date: '5/1', minutes: 45 },
  { date: '5/2', minutes: 30 },
  { date: '5/3', minutes: 60 },
  { date: '5/4', minutes: 0 },
  { date: '5/5', minutes: 25 },
  { date: '5/6', minutes: 40 },
  { date: '5/7', minutes: 55 },
  { date: '5/8', minutes: 35 },
  { date: '5/9', minutes: 50 },
  { date: '5/10', minutes: 65 },
  { date: '5/11', minutes: 45 },
  { date: '5/12', minutes: 0 },
  { date: '5/13', minutes: 0 },
  { date: '5/14', minutes: 30 },
];

const mockInsights: HabitInsight[] = [
  {
    id: '1',
    type: 'strength',
    title: '周末学习效率高',
    description: '你在周末的学习时间是平日的两倍，周六的学习时间最长，达到90分钟。',
    impact: 'high',
    actionable: true,
    action: '可以考虑在周末安排更多的复习和难点攻克任务。'
  },
  {
    id: '2',
    type: 'improvement',
    title: '学习连续性需要提高',
    description: '数据显示你有多天未学习的情况，这可能会影响知识的保留和累积效果。',
    impact: 'high',
    actionable: true,
    action: '尝试设置每日学习提醒，即使只有5分钟也要保持学习习惯。'
  },
  {
    id: '3',
    type: 'suggestion',
    title: '增加复习频率',
    description: '你的复习频率评分较低(40/100)，可能导致之前学习的内容遗忘。',
    impact: 'medium',
    actionable: true,
    action: '建议每周安排1-2天专门用于复习之前学过的内容。'
  },
  {
    id: '4',
    type: 'strength',
    title: '学习规律性强',
    description: '你的学习有很好的规律性(90/100)，这有助于形成稳定的学习习惯。',
    impact: 'medium',
    actionable: false
  },
  {
    id: '5',
    type: 'improvement',
    title: '多样化学习方式',
    description: '你的学习方式多样性评分(55/100)有提升空间，尝试不同的学习模式可以增强学习效果。',
    impact: 'low',
    actionable: true,
    action: '尝试切换不同的学习模式，如听力、阅读、口语练习等。'
  }
];

// 模拟获取学习习惯数据的函数
const fetchLearningHabits = (userId: string): Promise<LearningHabitData> => {
  return new Promise((resolve) => {
    // 模拟API延迟
    setTimeout(() => {
      resolve({
        dailyActivityPatterns: [
          { day: '周一', minutesLearned: 45, completedItems: 12 },
          { day: '周二', minutesLearned: 30, completedItems: 8 },
          { day: '周三', minutesLearned: 60, completedItems: 15 },
          { day: '周四', minutesLearned: 25, completedItems: 7 },
          { day: '周五', minutesLearned: 35, completedItems: 10 },
          { day: '周六', minutesLearned: 90, completedItems: 22 },
          { day: '周日', minutesLearned: 75, completedItems: 18 },
        ],
        timeOfDayDistribution: [
          { timeSlot: '早晨 (6-9点)', percentage: 15, minutes: 120 },
          { timeSlot: '上午 (9-12点)', percentage: 25, minutes: 200 },
          { timeSlot: '下午 (12-18点)', percentage: 30, minutes: 240 },
          { timeSlot: '晚上 (18-22点)', percentage: 25, minutes: 200 },
          { timeSlot: '深夜 (22-6点)', percentage: 5, minutes: 40 },
        ],
        consistencyScore: 72,
        focusScore: 68,
        averageSessionLength: 23,
        longestStreak: 14,
        currentStreak: 5,
        mostProductiveDay: '周六',
        mostProductiveTimeSlot: '下午 (12-18点)',
        completionRate: 85,
        habitInsights: [
          { 
            type: 'positive', 
            message: '您在周末的学习时间显著增加，这是一个很好的习惯。' 
          },
          { 
            type: 'positive', 
            message: '您的学习连续性正在改善，当前已连续学习5天。' 
          },
          { 
            type: 'suggestion', 
            message: '尝试增加在周四的学习时间，这是您学习量最少的一天。' 
          },
          { 
            type: 'suggestion', 
            message: '可以考虑在早晨进行更多学习，研究表明早晨是记忆效果最佳的时段。' 
          },
        ]
      });
    }, 1500);
  });
};

const LearningHabitAnalyzer: React.FC<LearningHabitAnalyzerProps> = ({ userId, onHabitChange }) => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [habitData, setHabitData] = useState<LearningHabitData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadHabitData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchLearningHabits(userId);
        setHabitData(data);
        setError(null);
      } catch (err) {
        setError('无法加载学习习惯数据，请稍后再试。');
        console.error('Error loading habits:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadHabitData();
  }, [userId]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleApplyHabitSuggestion = (insightId: string) => {
    // 在实际应用中，这里应调用API更新用户的设置或学习计划
    console.log(`Applied suggestion with ID: ${insightId}`);
    
    if (onHabitChange) {
      onHabitChange({ insightId, applied: true });
    }
    
    // 更新本地状态，例如标记建议为已应用
    setHabitData(prevData => 
      prevData ? {
        ...prevData,
        habitInsights: prevData.habitInsights.map(insight => 
          insight.id === insightId 
            ? { ...insight, actionable: false } 
            : insight
        )
      } : null
    );
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>
          加载学习习惯数据...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!habitData) {
    return (
      <Alert severity="info" sx={{ mt: 2 }}>
        没有可用的学习习惯数据。
      </Alert>
    );
  }

  return (
    <Box>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="learning habits tabs"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="总览" icon={<DonutIcon />} iconPosition="start" />
          <Tab label="时间分布" icon={<CalendarIcon />} iconPosition="start" />
          <Tab label="每周模式" icon={<CalendarIcon />} iconPosition="start" />
          <Tab label="学习洞见" icon={<TrendingUpIcon />} iconPosition="start" />
        </Tabs>
      </Box>

      {/* 总览面板 */}
      {activeTab === 0 && (
        <Box>
          <Grid container spacing={3}>
            {/* 关键数据卡片 */}
            <Grid item xs={12} md={6} lg={3}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    学习连续性评分
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ position: 'relative', display: 'inline-flex', mr: 2 }}>
                      <CircularProgress
                        variant="determinate"
                        value={habitData.consistencyScore}
                        size={64}
                        thickness={5}
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
                        <Typography variant="body2" component="div" color="text.secondary">
                          {`${habitData.consistencyScore}%`}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="h5" component="div">
                      {habitData.consistencyScore >= 70 ? '优秀' : 
                       habitData.consistencyScore >= 50 ? '良好' : '需改进'}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6} lg={3}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    专注度评分
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ position: 'relative', display: 'inline-flex', mr: 2 }}>
                      <CircularProgress
                        variant="determinate"
                        value={habitData.focusScore}
                        size={64}
                        thickness={5}
                        color="success"
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
                        <Typography variant="body2" component="div" color="text.secondary">
                          {`${habitData.focusScore}%`}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="h5" component="div">
                      {habitData.focusScore >= 70 ? '优秀' : 
                       habitData.focusScore >= 50 ? '良好' : '需改进'}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6} lg={3}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    当前学习连续天数
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="h4" component="div" sx={{ mr: 1 }}>
                      {habitData.currentStreak}
                    </Typography>
                    <Typography color="textSecondary">
                      / {habitData.longestStreak} 天
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                    历史最长连续: {habitData.longestStreak} 天
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6} lg={3}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    平均学习时长
                  </Typography>
                  <Typography variant="h4" component="div">
                    {habitData.averageSessionLength} 分钟
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                    完成率: {habitData.completionRate}%
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* 最有效的学习时间 */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    最有效的学习时间
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 2 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <WeekendIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />
                      <Typography variant="body1" sx={{ mt: 1 }}>
                        最佳学习日
                      </Typography>
                      <Typography variant="h6" color="primary" fontWeight="bold">
                        {habitData.mostProductiveDay}
                      </Typography>
                    </Box>

                    <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />

                    <Box sx={{ textAlign: 'center' }}>
                      {habitData.mostProductiveTimeSlot.includes('早晨') || habitData.mostProductiveTimeSlot.includes('上午') ? (
                        <MorningIcon sx={{ fontSize: 40, color: theme.palette.warning.main }} />
                      ) : (
                        <NightIcon sx={{ fontSize: 40, color: theme.palette.info.main }} />
                      )}
                      <Typography variant="body1" sx={{ mt: 1 }}>
                        最佳学习时段
                      </Typography>
                      <Typography variant="h6" color="primary" fontWeight="bold">
                        {habitData.mostProductiveTimeSlot}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* 快速洞察 */}
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    学习习惯洞察
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    {habitData.habitInsights.slice(0, 2).map((insight, index) => (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                        {insight.type === 'positive' ? (
                          <CheckIcon color="success" sx={{ mr: 1 }} />
                        ) : (
                          <ErrorIcon color="warning" sx={{ mr: 1 }} />
                        )}
                        <Typography variant="body2">
                          {insight.message}
                        </Typography>
                      </Box>
                    ))}
                    {habitData.habitInsights.length > 2 && (
                      <Button 
                        size="small" 
                        sx={{ mt: 1 }}
                        onClick={() => setActiveTab(3)}
                      >
                        查看更多洞察
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* 时间分布面板 */}
      {activeTab === 1 && (
        <Box>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    一天中学习时间分布
                  </Typography>
                  <Box sx={{ height: 300, mt: 2 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={habitData.timeOfDayDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="percentage"
                          nameKey="timeSlot"
                        >
                          {habitData.timeOfDayDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value: number) => [`${value}%`, '占比']}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    各时段学习分钟数
                  </Typography>
                  <Box sx={{ height: 300, mt: 2 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={habitData.timeOfDayDistribution}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="timeSlot" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`${value} 分钟`, '学习时长']} />
                        <Bar dataKey="minutes" fill="#8884d8" name="学习分钟数" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* 每周模式面板 */}
      {activeTab === 2 && (
        <Box>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    一周学习活动模式
                  </Typography>
                  <Box sx={{ height: 300, mt: 2 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={habitData.dailyActivityPatterns}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                        <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                        <Tooltip />
                        <Legend />
                        <Bar yAxisId="left" dataKey="minutesLearned" fill="#8884d8" name="学习分钟数" />
                        <Bar yAxisId="right" dataKey="completedItems" fill="#82ca9d" name="完成项目数" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* 学习洞见面板 */}
      {activeTab === 3 && (
        <Box>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    学习习惯洞察与建议
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    积极习惯
                  </Typography>
                  <Box sx={{ mb: 3 }}>
                    {habitData.habitInsights
                      .filter(insight => insight.type === 'positive')
                      .map((insight, index) => (
                        <Alert 
                          key={`positive-${index}`} 
                          severity="success" 
                          icon={<CheckIcon />}
                          sx={{ mb: 1 }}
                        >
                          {insight.message}
                        </Alert>
                      ))
                    }
                  </Box>
                  
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    改进建议
                  </Typography>
                  <Box>
                    {habitData.habitInsights
                      .filter(insight => insight.type === 'suggestion')
                      .map((insight, index) => (
                        <Alert 
                          key={`suggestion-${index}`} 
                          severity="info" 
                          icon={<ErrorIcon />}
                          sx={{ mb: 1 }}
                        >
                          {insight.message}
                        </Alert>
                      ))
                    }
                  </Box>

                  <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      个性化学习建议
                    </Typography>
                    <Typography variant="body2" paragraph>
                      根据您的学习习惯分析，我们建议您：
                    </Typography>
                    <ul style={{ paddingLeft: '20px' }}>
                      <li>
                        <Typography variant="body2">
                          尝试在{habitData.mostProductiveTimeSlot}安排更多学习时间，这是您学习效率最高的时段。
                        </Typography>
                      </li>
                      <li>
                        <Typography variant="body2">
                          增加学习连续性，目标是至少连续学习{habitData.longestStreak}天。
                        </Typography>
                      </li>
                      <li>
                        <Typography variant="body2">
                          考虑分配更均匀的每日学习时间，特别是在{
                            habitData.dailyActivityPatterns.reduce(
                              (min, p) => p.minutesLearned < min.minutesLearned ? p : min
                            ).day
                          }这一天。
                        </Typography>
                      </li>
                    </ul>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default LearningHabitAnalyzer; 