'use client';

import React, { useState, useEffect } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement,
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend,
  ChartData,
  ChartOptions
} from 'chart.js';
import { format, parseISO, isToday, differenceInDays } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { UserDashboardData } from '@/types/user';
import OptimizedImage from '@/components/OptimizedImage';
import IntegratedLearningDashboard from '@/components/learning/IntegratedLearningDashboard';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  Button, 
  Container, 
  CardMedia 
} from '@mui/material';
import {
  Psychology as PsychologyIcon,
  Analytics as AnalyticsIcon,
  MenuBook as MenuBookIcon,
  EmojiEvents as EmojiEventsIcon
} from '@mui/icons-material';

// 注册图表组件
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// 图表配置选项
const chartOptions: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        color: '#fff',
        font: {
          size: 12
        }
      }
    },
    title: {
      display: false,
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      titleColor: '#fff',
      bodyColor: '#fff',
      bodyFont: {
        size: 13
      },
      titleFont: {
        size: 14,
        weight: 'bold' as const
      },
      padding: 10,
      cornerRadius: 4,
      displayColors: true
    }
  },
  scales: {
    x: {
      grid: {
        color: 'rgba(255, 255, 255, 0.1)'
      },
      ticks: {
        color: '#ddd'
      }
    },
    y: {
      grid: {
        color: 'rgba(255, 255, 255, 0.1)'
      },
      ticks: {
        color: '#ddd',
        precision: 0
      },
      beginAtZero: true
    }
  }
};

// 模拟用户仪表盘数据
const mockDashboardData: UserDashboardData = {
  user: {
    id: "user1",
    name: "张三",
    email: "zhangsan@example.com",
    role: "user",
    bio: "热爱英语学习的中国学生",
    country: "中国",
    language: "zh-CN",
    avatarUrl: "/images/avatar.jpg",
    createdAt: "2023-01-15T08:30:00Z",
    updatedAt: "2024-04-10T14:20:00Z",
    capabilities: {
      level: "intermediate",
      vocabularySize: 3500,
      grammarScore: 78,
      listeningScore: 82,
      speakingScore: 75,
      readingScore: 85,
      writingScore: 72,
      weakAreas: ["口语流利度", "高级词汇", "时态"],
      strongAreas: ["阅读理解", "基础词汇", "单词拼写"]
    }
  },
  statistics: {
    wordsLearned: 3500,
    sentencesLearned: 1250,
    coursesCompleted: 5,
    totalStudyHours: 120,
    averageDailyMinutes: 45,
    learningStreak: 12,
    lastActive: "2024-04-15T18:30:00Z"
  },
  checkIns: [
    { date: "2024-04-15T09:00:00Z", duration: 45, activitiesCompleted: 3 },
    { date: "2024-04-14T10:15:00Z", duration: 30, activitiesCompleted: 2 },
    { date: "2024-04-13T08:30:00Z", duration: 60, activitiesCompleted: 4 },
    { date: "2024-04-12T16:45:00Z", duration: 25, activitiesCompleted: 2 },
    { date: "2024-04-11T19:20:00Z", duration: 40, activitiesCompleted: 3 },
    { date: "2024-04-10T07:30:00Z", duration: 50, activitiesCompleted: 4 },
    { date: "2024-04-09T12:00:00Z", duration: 35, activitiesCompleted: 3 },
    { date: "2024-04-08T20:15:00Z", duration: 45, activitiesCompleted: 3 },
    { date: "2024-04-07T14:30:00Z", duration: 60, activitiesCompleted: 5 },
    { date: "2024-04-06T09:45:00Z", duration: 30, activitiesCompleted: 2 },
    { date: "2024-04-05T17:30:00Z", duration: 55, activitiesCompleted: 4 },
    { date: "2024-04-04T08:15:00Z", duration: 40, activitiesCompleted: 3 },
    { date: "2024-04-03T19:00:00Z", duration: 25, activitiesCompleted: 2 },
    { date: "2024-04-02T13:45:00Z", duration: 50, activitiesCompleted: 4 },
    { date: "2024-04-01T07:30:00Z", duration: 35, activitiesCompleted: 3 }
  ],
  progress: {
    daily: [
      { date: "2024-04-15", wordsLearned: 25, sentencesLearned: 8, minutesStudied: 45 },
      { date: "2024-04-14", wordsLearned: 18, sentencesLearned: 6, minutesStudied: 30 },
      { date: "2024-04-13", wordsLearned: 32, sentencesLearned: 12, minutesStudied: 60 },
      { date: "2024-04-12", wordsLearned: 15, sentencesLearned: 5, minutesStudied: 25 },
      { date: "2024-04-11", wordsLearned: 22, sentencesLearned: 7, minutesStudied: 40 },
      { date: "2024-04-10", wordsLearned: 28, sentencesLearned: 10, minutesStudied: 50 },
      { date: "2024-04-09", wordsLearned: 20, sentencesLearned: 7, minutesStudied: 35 }
    ],
    weekly: {
      wordsLearned: 160,
      sentencesLearned: 55,
      minutesStudied: 285,
      compareLastWeek: 15
    },
    monthly: {
      wordsLearned: 650,
      sentencesLearned: 230,
      minutesStudied: 1200,
      compareLastMonth: 8
    }
  },
  goals: {
    wordsPerDay: {
      target: 30,
      current: 25
    },
    sentencesPerDay: {
      target: 10,
      current: 8
    },
    minutesPerDay: {
      target: 60,
      current: 45
    }
  },
  recentLearning: [
    { courseId: "course1", title: "英语基础入门", lastAccessed: "2024-04-15T16:30:00Z", progress: 75, imageUrl: "/images/courses/basics.jpg" },
    { courseId: "course2", title: "商务英语精讲", lastAccessed: "2024-04-14T10:45:00Z", progress: 45, imageUrl: "/images/courses/business.jpg" },
    { courseId: "course3", title: "日常英语会话", lastAccessed: "2024-04-13T19:20:00Z", progress: 60, imageUrl: "/images/courses/conversation.jpg" },
    { courseId: "course4", title: "高级英语写作", lastAccessed: "2024-04-10T14:15:00Z", progress: 30, imageUrl: "/images/courses/writing.jpg" }
  ],
  nextReview: {
    due: 24,
    overdue: 5,
    upcomingToday: 12,
    nextSession: "2024-04-15T20:00:00Z"
  }
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [userData, setUserData] = useState<UserDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 模拟加载用户数据
  useEffect(() => {
    // 在实际应用中，这里会从API获取用户仪表盘数据
    setTimeout(() => {
      setUserData(mockDashboardData);
      setIsLoading(false);
    }, 1000);
  }, []);

  // 计算当前签到连续天数
  const calculateCurrentStreak = () => {
    if (!userData) return 0;
    
    // 按日期排序（从新到旧）
    const sortedCheckIns = [...userData.checkIns].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    if (sortedCheckIns.length === 0) return 0;
    
    // 先检查最新的签到是否是今天或昨天
    const latestDate = new Date(sortedCheckIns[0].date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const isRecent = isToday(latestDate) || 
                    differenceInDays(today, latestDate) === 1;
    
    if (!isRecent) return 0;
    
    // 计算连续天数
    let streak = 1;
    let currentDate = latestDate;
    currentDate.setHours(0, 0, 0, 0);
    
    for (let i = 1; i < sortedCheckIns.length; i++) {
      const checkInDate = new Date(sortedCheckIns[i].date);
      checkInDate.setHours(0, 0, 0, 0);
      
      const diff = differenceInDays(currentDate, checkInDate);
      
      if (diff === 1) {
        streak++;
        currentDate = checkInDate;
      } else if (diff > 1) {
        break;
      }
    }
    
    return streak;
  };

  // 检查今天是否已签到
  const hasCheckedInToday = () => {
    if (!userData || !userData.checkIns.length) return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return userData.checkIns.some(checkIn => {
      const checkInDate = new Date(checkIn.date);
      checkInDate.setHours(0, 0, 0, 0);
      return isToday(checkInDate);
    });
  };

  // 处理签到
  const handleCheckIn = () => {
    if (!userData) return;
    
    // 如果已经签到，则不进行处理
    if (hasCheckedInToday()) return;
    
    // 创建新的签到记录
    const newCheckIn = {
      date: new Date().toISOString(),
      duration: 0, // 初始设为0，用户开始学习后更新
      activitiesCompleted: 0 // 初始设为0，用户完成活动后更新
    };
      
      // 更新用户数据
    setUserData({
      ...userData,
      checkIns: [newCheckIn, ...userData.checkIns],
      statistics: {
        ...userData.statistics,
        learningStreak: calculateCurrentStreak() + 1
      }
    });
  };

  // 生成日历数据以显示签到日历
  const getCalendarData = () => {
    if (!userData) return [];
    
    const checkInDates = userData.checkIns.map(ci => new Date(ci.date).toDateString());
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // 获取本月第一天和最后一天
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    // 生成日历数据
    const calendar = [];
    
    // 填充第一周的前导空白
    const firstDayOfWeek = firstDay.getDay();
    for (let i = 0; i < firstDayOfWeek; i++) {
      calendar.push(null);
    }
    
    // 填充日期
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(today.getFullYear(), today.getMonth(), i);
      const dateString = date.toDateString();
      const isCheckedIn = checkInDates.includes(dateString);
      const isCurrentDay = isToday(date);
      
      calendar.push({
        date,
        day: i,
        isCheckedIn,
        isCurrentDay
      });
    }
    
    return calendar;
  };

  // 获取图表数据
  const getChartData = (): ChartData<'bar'> | null => {
    if (!userData) return null;
    
    const labels = userData.progress.daily.map(day => 
      format(parseISO(day.date), 'M月d日')
    );
    
    interface DataSet {
      label: string;
      data: number[];
      borderColor?: string;
      backgroundColor: string;
      borderWidth?: number;
    }
    
    const datasets: DataSet[] = [];
    
    // 添加单词数据
    datasets.push({
      label: '单词量',
      data: userData.progress.daily.map(day => day.wordsLearned),
      backgroundColor: 'rgba(75, 192, 192, 0.7)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1
    });
    
    // 添加句子数据
    datasets.push({
      label: '句子量',
      data: userData.progress.daily.map(day => day.sentencesLearned),
      backgroundColor: 'rgba(255, 205, 86, 0.7)',
      borderColor: 'rgba(255, 205, 86, 1)',
      borderWidth: 1
    });
    
    return { labels, datasets };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">加载用户数据失败</h2>
          <p className="mb-6">无法获取仪表盘数据，请稍后再试</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
          >
            重新加载
          </button>
        </div>
      </div>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* 欢迎区域 */}
      <Paper
        elevation={0}
        variant="outlined"
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 2,
          background: 'linear-gradient(to right, #f5f7fa, #e4e8f0)',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center'
        }}
      >
        <Box sx={{ flex: 1, pr: { md: 3 }, mb: { xs: 2, md: 0 } }}>
          <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
            欢迎回到您的学习空间
          </Typography>
          <Typography variant="body1" paragraph color="text.secondary">
            根据您的学习历史和目标，我们已为您准备了个性化的学习内容和建议。
            继续您的学习之旅，跟踪您的进度，并探索新的学习资源。
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            size="large" 
            startIcon={<PlayArrowIcon />}
            href="/practice/daily"
            sx={{ mr: 2, mb: { xs: 2, sm: 0 } }}
          >
            开始今日学习
          </Button>
          <Button 
            variant="outlined" 
            color="primary"
            startIcon={<PsychologyIcon />}
            href="/dashboard/ai-assistant"
          >
            AI学习助手
          </Button>
        </Box>
        <Box 
          sx={{ 
            flex: { md: 0.5 },
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <Box 
            component="img"
            src="/images/dashboard-welcome.svg"
            alt="学习仪表盘"
            sx={{ 
              maxWidth: '100%', 
              height: 'auto',
              maxHeight: 200
            }}
          />
        </Box>
      </Paper>
      
      {/* 快速访问卡片 */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            variant="outlined"
            sx={{
              height: '100%',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 3
              }
            }}
          >
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <PsychologyIcon color="primary" sx={{ fontSize: 48, mb: 1 }} />
              <Typography variant="h6" gutterBottom>
                智能学习助手
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                使用AI助手进行对话练习，获得实时反馈和个性化建议
              </Typography>
              <Button 
                variant="outlined" 
                fullWidth
                href="/dashboard/ai-assistant"
              >
                开始对话
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card
            variant="outlined"
            sx={{
              height: '100%',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 3
              }
            }}
          >
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <AnalyticsIcon color="primary" sx={{ fontSize: 48, mb: 1 }} />
              <Typography variant="h6" gutterBottom>
                学习分析
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                查看详细的学习数据分析，了解您的优势与需要改进的领域
              </Typography>
              <Button 
                variant="outlined" 
                fullWidth
                href="/dashboard/analytics"
              >
                查看分析
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card
            variant="outlined"
            sx={{
              height: '100%',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 3
              }
            }}
          >
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <MenuBookIcon color="primary" sx={{ fontSize: 48, mb: 1 }} />
              <Typography variant="h6" gutterBottom>
                学习内容
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                浏览课程、练习和学习资源，按照您的兴趣和需求选择内容
              </Typography>
              <Button 
                variant="outlined" 
                fullWidth
                href="/courses"
              >
                浏览内容
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card
            variant="outlined"
            sx={{
              height: '100%',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 3
              }
            }}
          >
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <EmojiEventsIcon color="primary" sx={{ fontSize: 48, mb: 1 }} />
              <Typography variant="h6" gutterBottom>
                成就与目标
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                设置学习目标，跟踪您的成就，保持学习动力
              </Typography>
              <Button 
                variant="outlined" 
                fullWidth
                href="/dashboard/achievements"
              >
                查看成就
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* 集成式学习仪表盘 */}
      <IntegratedLearningDashboard 
        userId="user-123"
        onStartActivity={(activityId, type) => {
          console.log('开始活动:', activityId, type);
          // 这里可以添加导航逻辑
        }}
        onViewAllActivities={() => {
          console.log('查看所有活动');
          // 这里可以添加导航逻辑
        }}
        onViewFullAnalytics={() => {
          console.log('查看完整分析');
          // 导航到分析页面
          window.location.href = '/dashboard/analytics';
        }}
      />
    </Container>
  );
}

// 播放按钮图标
function PlayArrowIcon() {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="currentColor"
    >
      <path d="M8 5v14l11-7z" />
    </svg>
  );
} 