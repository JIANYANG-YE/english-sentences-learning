import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid as MuiGrid, 
  Card, 
  CardContent, 
  Button,
  IconButton,
  Chip,
  Divider,
  CircularProgress,
  Tooltip
} from '@mui/material';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip,
  Legend,
  PieProps
} from 'recharts';
import { format, subDays, isToday, isThisWeek, parseISO } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import TimerIcon from '@mui/icons-material/Timer';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import BarChartIcon from '@mui/icons-material/BarChart';
import { LearningActivityType, LearningSession, LearningStats } from '../../types/learning';

// 颜色映射
const ACTIVITY_COLORS: Record<LearningActivityType, string> = {
  listening: '#8884d8',
  speaking: '#82ca9d',
  reading: '#ffc658',
  writing: '#ff8042',
  vocabulary: '#0088FE',
  grammar: '#00C49F',
  chineseToEnglish: '#FFBB28',
  englishToChinese: '#FF8042'
};

// 活动类型名称映射
const ACTIVITY_NAMES: Record<LearningActivityType, string> = {
  listening: '听力练习',
  speaking: '口语练习',
  reading: '阅读理解',
  writing: '写作练习',
  vocabulary: '词汇学习',
  grammar: '语法学习',
  chineseToEnglish: '中译英',
  englishToChinese: '英译中'
};

interface LearningActivitiesTrackerProps {
  userId: string;
}

const LearningActivitiesTracker: React.FC<LearningActivitiesTrackerProps> = ({ userId }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sessions, setSessions] = useState<LearningSession[]>([]);
  const [stats, setStats] = useState<LearningStats | null>(null);
  const [activeTimer, setActiveTimer] = useState<{
    activityType: LearningActivityType;
    startTime: Date;
    isRunning: boolean;
  } | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [currentTimeframe, setCurrentTimeframe] = useState<'day' | 'week' | 'month'>('week');

  // 获取学习活动记录
  useEffect(() => {
    const fetchLearningData = async () => {
      setIsLoading(true);
      try {
        // 模拟API请求
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 生成模拟数据
        const mockSessions = generateMockSessions(userId);
        setSessions(mockSessions);
        
        // 生成统计数据
        const mockStats = generateMockStats(userId, mockSessions);
        setStats(mockStats);
        
        setIsLoading(false);
      } catch (err) {
        setError('获取学习数据失败，请稍后再试');
        setIsLoading(false);
      }
    };
    
    fetchLearningData();
  }, [userId]);

  // 计时器逻辑
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    
    if (activeTimer && activeTimer.isRunning) {
      intervalId = setInterval(() => {
        const now = new Date();
        const seconds = Math.floor((now.getTime() - activeTimer.startTime.getTime()) / 1000);
        setElapsedTime(seconds);
      }, 1000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [activeTimer]);

  // 开始计时
  const startTimer = (activityType: LearningActivityType) => {
    setActiveTimer({
      activityType,
      startTime: new Date(),
      isRunning: true
    });
    setElapsedTime(0);
  };

  // 暂停计时
  const pauseTimer = () => {
    if (activeTimer) {
      setActiveTimer({
        ...activeTimer,
        isRunning: false
      });
    }
  };

  // 继续计时
  const resumeTimer = () => {
    if (activeTimer) {
      // 调整开始时间以保持已经计时的时长
      const adjustedStartTime = new Date();
      adjustedStartTime.setSeconds(adjustedStartTime.getSeconds() - elapsedTime);
      
      setActiveTimer({
        ...activeTimer,
        startTime: adjustedStartTime,
        isRunning: true
      });
    }
  };

  // 结束计时并保存会话
  const endTimer = async () => {
    if (!activeTimer) return;
    
    try {
      const endTime = new Date();
      const duration = Math.floor((endTime.getTime() - activeTimer.startTime.getTime()) / 60000); // 转换为分钟
      
      // 模拟保存会话的API请求
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newSession: LearningSession = {
        id: `session-${Date.now()}`,
        userId,
        activityType: activeTimer.activityType,
        startTime: activeTimer.startTime.toISOString(),
        endTime: endTime.toISOString(),
        duration,
        score: Math.floor(Math.random() * 100),
        difficulty: 'intermediate',
        completed: true
      };
      
      // 更新会话列表
      setSessions(prev => [newSession, ...prev]);
      
      // 更新统计数据
      if (stats) {
        setStats({
          ...stats,
          totalSessions: stats.totalSessions + 1,
          totalTimeSpent: stats.totalTimeSpent + duration,
          activitiesBreakdown: {
            ...stats.activitiesBreakdown,
            [activeTimer.activityType]: (stats.activitiesBreakdown[activeTimer.activityType] || 0) + duration
          }
        });
      }
      
      // 重置计时器
      setActiveTimer(null);
      setElapsedTime(0);
    } catch (err) {
      setError('保存学习会话失败，请稍后再试');
    }
  };

  // 格式化时间显示
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // 按时间范围过滤会话
  const getFilteredSessions = (): LearningSession[] => {
    const today = new Date();
    
    return sessions.filter(session => {
      const sessionDate = parseISO(session.startTime);
      
      if (currentTimeframe === 'day') {
        return isToday(sessionDate);
      } else if (currentTimeframe === 'week') {
        return isThisWeek(sessionDate, { weekStartsOn: 1 });
      } else {
        // 月视图 - 30天内
        return sessionDate >= subDays(today, 30);
      }
    });
  };

  // 准备饼图数据
  const getPieChartData = () => {
    if (!stats) return [];
    
    return Object.entries(stats.activitiesBreakdown).map(([type, minutes]) => ({
      name: ACTIVITY_NAMES[type as LearningActivityType],
      value: minutes,
      color: ACTIVITY_COLORS[type as LearningActivityType]
    })).filter(item => item.value > 0);
  };

  // 准备每日活动数据
  const getDailyActivityData = () => {
    const filteredSessions = getFilteredSessions();
    const dailyData: Record<string, Record<string, number>> = {};
    
    filteredSessions.forEach(session => {
      const date = format(parseISO(session.startTime), 'yyyy-MM-dd');
      const activityType = session.activityType;
      
      if (!dailyData[date]) {
        dailyData[date] = {};
      }
      
      dailyData[date][activityType] = (dailyData[date][activityType] || 0) + session.duration;
    });
    
    return Object.entries(dailyData).map(([date, activities]) => {
      const result: any = { date: format(parseISO(date), 'MM-dd', { locale: zhCN }) };
      
      Object.entries(activities).forEach(([type, minutes]) => {
        result[ACTIVITY_NAMES[type as LearningActivityType]] = minutes;
      });
      
      return result;
    }).sort((a, b) => a.date.localeCompare(b.date));
  };

  // 生成模拟会话数据
  const generateMockSessions = (userId: string): LearningSession[] => {
    const activityTypes: LearningActivityType[] = [
      'listening', 'speaking', 'reading', 'writing', 
      'vocabulary', 'grammar', 'chineseToEnglish', 'englishToChinese'
    ];
    
    const sessions: LearningSession[] = [];
    const now = new Date();
    
    // 生成过去30天的随机学习会话
    for (let i = 0; i < 50; i++) {
      const randomDaysAgo = Math.floor(Math.random() * 30);
      const startDate = subDays(now, randomDaysAgo);
      startDate.setHours(Math.floor(Math.random() * 12) + 8); // 8AM-8PM
      startDate.setMinutes(Math.floor(Math.random() * 60));
      
      const duration = Math.floor(Math.random() * 60) + 15; // 15-75分钟
      const endDate = new Date(startDate);
      endDate.setMinutes(endDate.getMinutes() + duration);
      
      const randomActivityType = activityTypes[Math.floor(Math.random() * activityTypes.length)];
      
      sessions.push({
        id: `session-${i}`,
        userId,
        activityType: randomActivityType,
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
        duration,
        score: Math.floor(Math.random() * 40) + 60, // 60-100
        difficulty: ['beginner', 'intermediate', 'advanced', 'expert'][Math.floor(Math.random() * 4)] as any,
        completed: Math.random() > 0.1 // 90%完成率
      });
    }
    
    // 按时间倒序排序
    return sessions.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
  };

  // 生成模拟统计数据
  const generateMockStats = (userId: string, sessions: LearningSession[]): LearningStats => {
    const activityBreakdown: Record<LearningActivityType, number> = {
      listening: 0,
      speaking: 0,
      reading: 0,
      writing: 0,
      vocabulary: 0,
      grammar: 0,
      chineseToEnglish: 0,
      englishToChinese: 0
    };
    
    let totalTime = 0;
    let totalScore = 0;
    
    sessions.forEach(session => {
      activityBreakdown[session.activityType] += session.duration;
      totalTime += session.duration;
      totalScore += session.score;
    });
    
    return {
      userId,
      period: 'monthly',
      startDate: subDays(new Date(), 30).toISOString(),
      endDate: new Date().toISOString(),
      totalSessions: sessions.length,
      totalTimeSpent: totalTime,
      activitiesBreakdown: activityBreakdown,
      averageScore: Math.round(totalScore / sessions.length),
      wordsLearned: Math.floor(Math.random() * 500) + 200,
      streakDays: Math.floor(Math.random() * 10) + 1
    };
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="400px">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', py: 2 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        学习活动追踪
      </Typography>
      
      {/* 计时器模块 */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          <TimerIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          活动计时器
        </Typography>
        
        <MuiGrid container spacing={3}>
          <MuiGrid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>选择活动类型</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {Object.entries(ACTIVITY_NAMES).map(([type, name]) => (
                  <Chip
                    key={type}
                    label={name}
                    onClick={() => startTimer(type as LearningActivityType)}
                    disabled={!!activeTimer}
                    sx={{ 
                      m: 0.5, 
                      bgcolor: ACTIVITY_COLORS[type as LearningActivityType],
                      color: 'white',
                      '&.Mui-disabled': {
                        opacity: 0.6,
                        bgcolor: ACTIVITY_COLORS[type as LearningActivityType],
                        color: 'white'
                      }
                    }}
                  />
                ))}
              </Box>
            </Box>
          </MuiGrid>
          
          <MuiGrid item xs={12} md={6}>
            {activeTimer ? (
              <Card sx={{ p: 2, bgcolor: '#f5f5f5', height: '100%' }}>
                <CardContent>
                  <Typography variant="body2" color="text.secondary">当前活动</Typography>
                  <Typography variant="h6" sx={{ color: ACTIVITY_COLORS[activeTimer.activityType] }}>
                    {ACTIVITY_NAMES[activeTimer.activityType]}
                  </Typography>
                  
                  <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                    <Typography variant="h4" component="div" sx={{ fontFamily: 'monospace', flex: 1 }}>
                      {formatTime(elapsedTime)}
                    </Typography>
                    
                    <Box>
                      {activeTimer.isRunning ? (
                        <IconButton 
                          onClick={pauseTimer} 
                          color="primary" 
                          sx={{ mr: 1 }}
                        >
                          <PauseCircleOutlineIcon fontSize="large" />
                        </IconButton>
                      ) : (
                        <IconButton 
                          onClick={resumeTimer} 
                          color="primary" 
                          sx={{ mr: 1 }}
                        >
                          <PlayCircleOutlineIcon fontSize="large" />
                        </IconButton>
                      )}
                      
                      <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={endTimer}
                      >
                        结束并保存
                      </Button>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ) : (
              <Box sx={{ 
                height: '100%', 
                display: 'flex', 
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px dashed #ccc',
                borderRadius: 1,
                p: 2
              }}>
                <Typography color="text.secondary">
                  请选择一个活动类型开始计时
                </Typography>
              </Box>
            )}
          </MuiGrid>
        </MuiGrid>
      </Paper>
      
      {/* 统计图表 */}
      <MuiGrid container spacing={4}>
        {/* 活动分布 */}
        <MuiGrid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%', borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              <PieChart sx={{ fontSize: 20, mr: 1, verticalAlign: 'top' }} />
              活动类型分布
            </Typography>
            
            <Box sx={{ height: 300 }}>
              {stats && Object.values(stats.activitiesBreakdown).some(v => v > 0) ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={getPieChartData()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {getPieChartData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography color="text.secondary">暂无活动数据</Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </MuiGrid>
        
        {/* 每日活动 */}
        <MuiGrid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%', borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                <BarChartIcon sx={{ fontSize: 20, mr: 1, verticalAlign: 'top' }} />
                学习时间记录
              </Typography>
              
              <Box>
                <Button 
                  size="small" 
                  variant={currentTimeframe === 'day' ? 'contained' : 'outlined'} 
                  onClick={() => setCurrentTimeframe('day')}
                  sx={{ mr: 1, minWidth: '60px' }}
                >
                  今日
                </Button>
                <Button 
                  size="small" 
                  variant={currentTimeframe === 'week' ? 'contained' : 'outlined'} 
                  onClick={() => setCurrentTimeframe('week')}
                  sx={{ mr: 1, minWidth: '60px' }}
                >
                  本周
                </Button>
                <Button 
                  size="small" 
                  variant={currentTimeframe === 'month' ? 'contained' : 'outlined'} 
                  onClick={() => setCurrentTimeframe('month')}
                  sx={{ minWidth: '60px' }}
                >
                  月度
                </Button>
              </Box>
            </Box>
            
            <Box sx={{ height: 300 }}>
              {getDailyActivityData().length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={getDailyActivityData()}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis label={{ value: '分钟', angle: -90, position: 'insideLeft' }} />
                    <RechartsTooltip />
                    <Legend />
                    {Object.entries(ACTIVITY_NAMES).map(([type, name]) => (
                      <Bar key={type} dataKey={name} stackId="a" fill={ACTIVITY_COLORS[type as LearningActivityType]} />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography color="text.secondary">所选时间段内暂无活动数据</Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </MuiGrid>
        
        {/* 学习统计 */}
        <MuiGrid item xs={12}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              <TrendingUpIcon sx={{ fontSize: 20, mr: 1, verticalAlign: 'top' }} />
              学习总结
            </Typography>
            
            <MuiGrid container spacing={3}>
              <MuiGrid item xs={6} sm={3}>
                <Card sx={{ height: '100%', bgcolor: '#f8f9fa' }}>
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">总学习时间</Typography>
                    <Typography variant="h4" sx={{ mt: 1, fontWeight: 'medium' }}>
                      {stats ? Math.round(stats.totalTimeSpent / 60) : 0}<Typography variant="body1" component="span" sx={{ ml: 1 }}>小时</Typography>
                    </Typography>
                  </CardContent>
                </Card>
              </MuiGrid>
              
              <MuiGrid item xs={6} sm={3}>
                <Card sx={{ height: '100%', bgcolor: '#f8f9fa' }}>
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">学习会话</Typography>
                    <Typography variant="h4" sx={{ mt: 1, fontWeight: 'medium' }}>
                      {stats?.totalSessions || 0}
                    </Typography>
                  </CardContent>
                </Card>
              </MuiGrid>
              
              <MuiGrid item xs={6} sm={3}>
                <Card sx={{ height: '100%', bgcolor: '#f8f9fa' }}>
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">平均得分</Typography>
                    <Typography variant="h4" sx={{ mt: 1, fontWeight: 'medium' }}>
                      {stats?.averageScore || 0}
                    </Typography>
                  </CardContent>
                </Card>
              </MuiGrid>
              
              <MuiGrid item xs={6} sm={3}>
                <Card sx={{ height: '100%', bgcolor: '#f8f9fa' }}>
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">学习词汇</Typography>
                    <Typography variant="h4" sx={{ mt: 1, fontWeight: 'medium' }}>
                      {stats?.wordsLearned || 0}
                    </Typography>
                  </CardContent>
                </Card>
              </MuiGrid>
            </MuiGrid>
            
            {/* 最近活动记录 */}
            <Box sx={{ mt: 4 }}>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                <CalendarTodayIcon sx={{ fontSize: 18, mr: 1, verticalAlign: 'text-bottom' }} />
                最近活动
              </Typography>
              
              {sessions.length > 0 ? (
                <Box sx={{ maxHeight: '300px', overflow: 'auto' }}>
                  {sessions.slice(0, 5).map((session, index) => (
                    <React.Fragment key={session.id}>
                      <Box sx={{ display: 'flex', py: 1.5 }}>
                        <Box sx={{ 
                          width: 12, 
                          height: 12, 
                          borderRadius: '50%', 
                          bgcolor: ACTIVITY_COLORS[session.activityType],
                          mt: 0.5,
                          mr: 2
                        }} />
                        
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                            {ACTIVITY_NAMES[session.activityType]}
                            <Chip 
                              size="small" 
                              label={`${session.duration} 分钟`} 
                              sx={{ ml: 1, height: 20, fontSize: '0.7rem' }} 
                            />
                          </Typography>
                          
                          <Typography variant="caption" color="text.secondary">
                            {format(parseISO(session.startTime), 'yyyy-MM-dd HH:mm')}
                          </Typography>
                        </Box>
                        
                        <Box>
                          <Tooltip title="得分">
                            <Chip 
                              size="small" 
                              label={`${session.score}分`} 
                              color={session.score >= 80 ? "success" : session.score >= 60 ? "warning" : "error"}
                              sx={{ fontWeight: 'bold' }} 
                            />
                          </Tooltip>
                        </Box>
                      </Box>
                      
                      {index < sessions.slice(0, 5).length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </Box>
              ) : (
                <Typography color="text.secondary">暂无活动记录</Typography>
              )}
            </Box>
          </Paper>
        </MuiGrid>
      </MuiGrid>
    </Box>
  );
};

export default LearningActivitiesTracker; 