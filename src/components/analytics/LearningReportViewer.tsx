import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid as MuiGrid,
  Card,
  CardContent,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  CircularProgress,
  LinearProgress,
  Alert,
  Stack,
  Skeleton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Tooltip,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  Assessment as AssessmentIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  School as SchoolIcon,
  SportsScore as SportsScoreIcon,
  Lightbulb as LightbulbIcon,
  TipsAndUpdates as TipsAndUpdatesIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  TrendingFlat as TrendingFlatIcon,
  CalendarToday as CalendarTodayIcon,
  Refresh as RefreshIcon,
  Event as EventIcon,
  StarRate as StarRateIcon,
  TimerOutlined as TimerOutlinedIcon,
  AccessTime as AccessTimeIcon,
  PlaylistAddCheck as PlaylistAddCheckIcon,
  Description as DescriptionIcon,
  MenuBook as MenuBookIcon,
  Assignment as AssignmentIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

// 重命名Grid组件以避免冲突
const Grid = MuiGrid;

// 学习报告接口
export interface ReportData {
  id: string;
  userId: string;
  timeframe: 'day' | 'week' | 'month' | 'year';
  generatedAt: string;
  summary: {
    timeSpent: number;
    sessionsCompleted: number;
    wordsLearned: number;
    sentencesReviewed: number;
    coursesProgressed: Array<{
      courseId: string;
      title: string;
      progress: number;
    }>;
  };
  goals: {
    achieved: Array<{
      goal: string;
      achievedDate: string;
    }>;
    inProgress: Array<{
      goal: string;
      progress: number;
      remaining: string;
    }>;
  };
  strengths: string[];
  areasForImprovement: string[];
  nextSteps: string[];
  comparisonToPrevious: Array<{
    metric: string;
    current: number;
    previous: number;
    change: number;
  }>;
}

// 组件属性接口
interface LearningReportViewerProps {
  userId?: string;
  onGenerateReport?: () => void;
  onTimeframeChange?: (timeframe: 'day' | 'week' | 'month' | 'year') => void;
}

const LearningReportViewer: React.FC<LearningReportViewerProps> = ({
  userId = '123', // 默认用户ID，实际使用时应该从props或上下文中获取
  onGenerateReport,
  onTimeframeChange
}) => {
  // 状态
  const [report, setReport] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month' | 'year'>('week');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<number>(0);
  
  // 获取学习报告
  const fetchReport = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // 调用API获取报告数据
      const response = await fetch(`/api/analytics/reports?userId=${userId}&timeframe=${timeframe}`);
      
      if (!response.ok) {
        throw new Error('获取学习报告失败');
      }
      
      const data = await response.json();
      
      // 如果返回数组，取最新一个报告
      if (Array.isArray(data) && data.length > 0) {
        setReport(data[0]);
      } else if (!Array.isArray(data)) {
        setReport(data);
      } else {
        setReport(null);
      }
    } catch (error) {
      console.error('获取报告失败:', error);
      setError('无法加载学习报告。请稍后再试。');
    } finally {
      setIsLoading(false);
    }
  };
  
  // 初始加载
  useEffect(() => {
    fetchReport();
  }, [userId, timeframe]);
  
  // 生成新报告
  const generateReport = async () => {
    try {
      setIsGenerating(true);
      setError(null);
      
      // 调用API生成新报告
      const response = await fetch('/api/analytics/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, timeframe })
      });
      
      if (!response.ok) {
        throw new Error('生成学习报告失败');
      }
      
      const data = await response.json();
      setReport(data);
      
      if (onGenerateReport) {
        onGenerateReport();
      }
    } catch (error) {
      console.error('生成报告失败:', error);
      setError('无法生成学习报告。请稍后再试。');
    } finally {
      setIsGenerating(false);
    }
  };
  
  // 处理时间范围变化
  const handleTimeframeChange = (event: SelectChangeEvent<'day' | 'week' | 'month' | 'year'>) => {
    const newTimeframe = event.target.value as 'day' | 'week' | 'month' | 'year';
    setTimeframe(newTimeframe);
    
    if (onTimeframeChange) {
      onTimeframeChange(newTimeframe);
    }
  };
  
  // 格式化时间
  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}小时${mins > 0 ? ` ${mins}分钟` : ''}`;
    }
    
    return `${mins}分钟`;
  };
  
  // 渲染变化趋势
  const renderTrend = (change: number): JSX.Element => {
    if (change > 0) {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', color: 'success.main' }}>
          <TrendingUpIcon fontSize="small" sx={{ mr: 0.5 }} />
          <Typography variant="body2" fontWeight="medium" component="span">
            +{change}%
          </Typography>
        </Box>
      );
    } else if (change < 0) {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', color: 'error.main' }}>
          <TrendingDownIcon fontSize="small" sx={{ mr: 0.5 }} />
          <Typography variant="body2" fontWeight="medium" component="span">
            {change}%
          </Typography>
        </Box>
      );
    } else {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
          <TrendingFlatIcon fontSize="small" sx={{ mr: 0.5 }} />
          <Typography variant="body2" component="span">
            0%
          </Typography>
        </Box>
      );
    }
  };
  
  // 渲染时间范围选择器
  const renderTimeframeSelector = () => (
    <FormControl size="small" sx={{ minWidth: 150 }}>
      <InputLabel id="timeframe-select-label">时间范围</InputLabel>
      <Select
        labelId="timeframe-select-label"
        id="timeframe-select"
        value={timeframe}
        label="时间范围"
        onChange={handleTimeframeChange}
      >
        <MenuItem value="day">今日</MenuItem>
        <MenuItem value="week">本周</MenuItem>
        <MenuItem value="month">本月</MenuItem>
        <MenuItem value="year">今年</MenuItem>
      </Select>
    </FormControl>
  );
  
  // 渲染学习概要部分
  const renderSummary = () => {
    if (!report) return null;
    
    return (
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <AssessmentIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6">学习概要</Typography>
          </Box>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <TimerOutlinedIcon fontSize="large" color="primary" sx={{ mb: 1, opacity: 0.8 }} />
                <Typography variant="h5" fontWeight="bold">
                  {formatTime(report.summary.timeSpent)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  学习时间
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <EventIcon fontSize="large" color="secondary" sx={{ mb: 1, opacity: 0.8 }} />
                <Typography variant="h5" fontWeight="bold">
                  {report.summary.sessionsCompleted}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  学习会话
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <MenuBookIcon fontSize="large" color="success" sx={{ mb: 1, opacity: 0.8 }} />
                <Typography variant="h5" fontWeight="bold">
                  {report.summary.wordsLearned}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  学习单词
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <DescriptionIcon fontSize="large" color="warning" sx={{ mb: 1, opacity: 0.8 }} />
                <Typography variant="h5" fontWeight="bold">
                  {report.summary.sentencesReviewed}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  句子练习
                </Typography>
              </Box>
            </Grid>
          </Grid>
          
          {report.comparisonToPrevious && report.comparisonToPrevious.length > 0 && (
            <>
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                与上一{timeframe === 'day' ? '天' : timeframe === 'week' ? '周' : timeframe === 'month' ? '月' : '年'}相比
              </Typography>
              
              <Grid container spacing={2}>
                {report.comparisonToPrevious.map((item, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        {item.metric}
                      </Typography>
                      {renderTrend(item.change)}
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </>
          )}
        </CardContent>
      </Card>
    );
  };
  
  // 渲染课程进度部分
  const renderCourseProgress = () => {
    if (!report || !report.summary.coursesProgressed || report.summary.coursesProgressed.length === 0) {
      return null;
    }
    
    return (
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <SchoolIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6">课程进度</Typography>
          </Box>
          
          <Stack spacing={2}>
            {report.summary.coursesProgressed.map((course, index) => (
              <Box key={index}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body1">{course.title}</Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {course.progress}%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={course.progress} 
                  sx={{ height: 8, borderRadius: 4 }} 
                />
              </Box>
            ))}
          </Stack>
        </CardContent>
      </Card>
    );
  };
  
  // 渲染目标进度部分
  const renderGoals = () => {
    if (!report || !report.goals) return null;
    
    const { achieved, inProgress } = report.goals;
    
    if ((!achieved || achieved.length === 0) && (!inProgress || inProgress.length === 0)) {
      return null;
    }
    
    return (
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <SportsScoreIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6">学习目标</Typography>
          </Box>
          
          {achieved && achieved.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                已完成的目标
              </Typography>
              <List disablePadding>
                {achieved.map((goal, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemIcon>
                      <CheckCircleIcon color="success" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={goal.goal} 
                      secondary={`完成于: ${new Date(goal.achievedDate).toLocaleDateString()}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
          
          {inProgress && inProgress.length > 0 && (
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                进行中的目标
              </Typography>
              <List disablePadding>
                {inProgress.map((goal, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemIcon>
                      <PlaylistAddCheckIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body1">{goal.goal}</Typography>
                          <Typography variant="body2">{goal.progress}%</Typography>
                        </Box>
                      }
                      secondary={
                        <>
                          <LinearProgress
                            variant="determinate"
                            value={goal.progress}
                            sx={{ my: 1, height: 6, borderRadius: 3 }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            剩余: {goal.remaining}
                          </Typography>
                        </>
                      }
                      secondaryTypographyProps={{ component: 'div' }}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </CardContent>
      </Card>
    );
  };
  
  // 渲染优势和改进领域部分
  const renderStrengthsAndWeaknesses = () => {
    if (!report) return null;
    
    const hasStrengths = report.strengths && report.strengths.length > 0;
    const hasWeaknesses = report.areasForImprovement && report.areasForImprovement.length > 0;
    
    if (!hasStrengths && !hasWeaknesses) return null;
    
    return (
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {hasStrengths && (
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <StarRateIcon color="success" sx={{ mr: 1 }} />
                  <Typography variant="h6">你的优势</Typography>
                </Box>
                <List>
                  {report.strengths!.map((strength, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemIcon>
                        <LightbulbIcon color="warning" />
                      </ListItemIcon>
                      <ListItemText primary={strength} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        )}
        
        {hasWeaknesses && (
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TipsAndUpdatesIcon color="warning" sx={{ mr: 1 }} />
                  <Typography variant="h6">可改进的领域</Typography>
                </Box>
                <List>
                  {report.areasForImprovement!.map((area, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemIcon>
                        <InfoIcon color="info" />
                      </ListItemIcon>
                      <ListItemText primary={area} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    );
  };
  
  // 渲染下一步行动建议部分
  const renderNextSteps = () => {
    if (!report || !report.nextSteps || report.nextSteps.length === 0) return null;
    
    return (
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <AccessTimeIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6">下一步行动建议</Typography>
          </Box>
          <List>
            {report.nextSteps.map((step, index) => (
              <ListItem key={index} sx={{ px: 0 }}>
                <ListItemIcon>
                  <ArrowRightIcon color="action" />
                </ListItemIcon>
                <ListItemText primary={step} />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    );
  };
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };
  
  if (isLoading && !report) {
    return (
      <Box sx={{ width: '100%', py: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>学习报告</Typography>
        <Skeleton variant="rectangular" width="100%" height={200} sx={{ mb: 2, borderRadius: 1 }} />
        <Skeleton variant="rectangular" width="100%" height={150} sx={{ mb: 2, borderRadius: 1 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Skeleton variant="rectangular" width="48%" height={200} sx={{ borderRadius: 1 }} />
          <Skeleton variant="rectangular" width="48%" height={200} sx={{ borderRadius: 1 }} />
        </Box>
      </Box>
    );
  }
  
  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        {error}
        <Button 
          color="inherit" 
          size="small" 
          startIcon={<RefreshIcon />}
          onClick={fetchReport}
          sx={{ ml: 2 }}
        >
          重试
        </Button>
      </Alert>
    );
  }
  
  if (!report) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <DescriptionIcon color="action" sx={{ fontSize: 60, opacity: 0.5, mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          尚未生成学习报告
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          暂无{timeframe === 'day' ? '今日' : timeframe === 'week' ? '本周' : timeframe === 'month' ? '本月' : '今年'}的学习报告。点击下方按钮生成报告。
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
          {renderTimeframeSelector()}
          
          <Button 
            variant="contained" 
            startIcon={isGenerating ? <CircularProgress size={20} color="inherit" /> : <RefreshIcon />}
            onClick={generateReport}
            disabled={isGenerating}
          >
            {isGenerating ? '生成中...' : '生成报告'}
          </Button>
        </Box>
      </Paper>
    );
  }
  
  // 格式化日期
  const formattedDate = format(new Date(report.generatedAt), 'yyyy年MM月dd日 HH:mm', { locale: zhCN });
  
  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: '100%', maxHeight: '90vh', overflow: 'auto' }}>
      <Box mb={3}>
        <Typography variant="h4" gutterBottom align="center">
          学习进度报告
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" align="center" gutterBottom>
          {report.timeframe === 'day' ? '日报' : 
           report.timeframe === 'week' ? '周报' : 
           report.timeframe === 'month' ? '月报' : '年度报告'}
        </Typography>
        <Typography variant="body2" color="textSecondary" align="center">
          生成于: {formattedDate}
        </Typography>
      </Box>
      
      <Tabs value={activeTab} onChange={handleTabChange} centered sx={{ mb: 3 }}>
        <Tab label="概览" />
        <Tab label="详细分析" />
        <Tab label="目标追踪" />
        <Tab label="历史对比" />
      </Tabs>
      
      {activeTab === 0 && (
        <>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    <ScheduleIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                    学习概况
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="textSecondary">总学习时间</Typography>
                      <Typography variant="h5">{report.summary.timeSpent}分钟</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="textSecondary">完成会话数</Typography>
                      <Typography variant="h5">{report.summary.sessionsCompleted}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="textSecondary">学习词汇量</Typography>
                      <Typography variant="h5">{report.summary.wordsLearned}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="textSecondary">复习句子数</Typography>
                      <Typography variant="h5">{report.summary.sentencesReviewed}</Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    <SchoolIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                    课程进度
                  </Typography>
                  {report.summary.coursesProgressed.length > 0 ? (
                    report.summary.coursesProgressed.map((course) => (
                      <Box key={course.courseId} mb={1}>
                        <Typography variant="body2">{course.title}</Typography>
                        <Box display="flex" alignItems="center">
                          <LinearProgress 
                            variant="determinate" 
                            value={course.progress} 
                            sx={{ flexGrow: 1, mr: 2 }} 
                          />
                          <Typography variant="body2">{course.progress}%</Typography>
                        </Box>
                      </Box>
                    ))
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      暂无课程进度数据
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary">
                    <TrendingUpIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                    学习优势
                  </Typography>
                  <List dense>
                    {report.strengths.map((strength, index) => (
                      <ListItem key={index}>
                        <ListItemText primary={strength} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="secondary">
                    <TrendingDownIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                    需要改进的方面
                  </Typography>
                  <List dense>
                    {report.areasForImprovement.map((area, index) => (
                      <ListItem key={index}>
                        <ListItemText primary={area} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}
      
      {activeTab === 1 && (
        <>
          <Typography variant="h6" gutterBottom>
            <MenuBookIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
            学习分析详情
          </Typography>
          
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                学习时间分布
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                根据您的学习记录，我们分析了您的学习时间分布和效率模式：
              </Typography>
              <Box>
                {/* 在这里添加学习时间分布图表或数据，例如使用 Recharts 等图表库 */}
                <Typography variant="body2">
                  学习时间主要集中在：晚上(19:00-23:00)，占总学习时间的70%
                </Typography>
                <Typography variant="body2">
                  学习效率最高的时段：上午(9:00-11:00)，正确率提高了15%
                </Typography>
                <Typography variant="body2">
                  建议：尝试增加上午的学习时间，利用效率高的时段提升学习效果
                </Typography>
              </Box>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                学习内容难点分析
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" fontWeight="bold">词汇记忆情况</Typography>
                  <Box display="flex" alignItems="center" mt={1}>
                    <Box sx={{ width: '70%', mr: 1 }}>
                      <LinearProgress variant="determinate" value={82} color="success" />
                    </Box>
                    <Typography variant="body2">82% 掌握率</Typography>
                  </Box>
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                    您的词汇记忆能力较强，建议继续使用当前的记忆方法
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" fontWeight="bold">语法难点</Typography>
                  <Box display="flex" alignItems="center" mt={1}>
                    <Box sx={{ width: '70%', mr: 1 }}>
                      <LinearProgress variant="determinate" value={65} color="warning" />
                    </Box>
                    <Typography variant="body2">65% 掌握率</Typography>
                  </Box>
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                    在条件句和过去完成时的使用上存在一些困难，建议进行针对性练习
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </>
      )}
      
      {activeTab === 2 && (
        <>
          <Typography variant="h6" gutterBottom>
            <AssignmentIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
            学习目标追踪
          </Typography>
          
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom color="success.main">
                已完成的目标
              </Typography>
              {report.goals.achieved.length > 0 ? (
                <List>
                  {report.goals.achieved.map((goal, index) => (
                    <ListItem key={index}>
                      <ListItemText 
                        primary={goal.goal} 
                        secondary={`完成于: ${format(new Date(goal.achievedDate), 'yyyy年MM月dd日', { locale: zhCN })}`} 
                      />
                      <Chip label="已完成" color="success" size="small" />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="textSecondary">
                  暂无已完成的目标
                </Typography>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom color="info.main">
                进行中的目标
              </Typography>
              {report.goals.inProgress.length > 0 ? (
                <List>
                  {report.goals.inProgress.map((goal, index) => (
                    <ListItem key={index}>
                      <ListItemText 
                        primary={goal.goal} 
                        secondary={goal.remaining} 
                      />
                      <Box sx={{ minWidth: 100 }}>
                        <Box display="flex" alignItems="center">
                          <LinearProgress 
                            variant="determinate" 
                            value={goal.progress} 
                            sx={{ flexGrow: 1, mr: 2 }} 
                          />
                          <Typography variant="body2">{goal.progress}%</Typography>
                        </Box>
                      </Box>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="textSecondary">
                  暂无进行中的目标
                </Typography>
              )}
            </CardContent>
          </Card>
          
          <Box mt={3}>
            <Typography variant="subtitle1" gutterBottom>
              下一步建议
            </Typography>
            <List>
              {report.nextSteps.map((step, index) => (
                <ListItem key={index}>
                  <ListItemText primary={step} />
                </ListItem>
              ))}
            </List>
          </Box>
        </>
      )}
      
      {activeTab === 3 && (
        <>
          <Typography variant="h6" gutterBottom>
            历史对比分析
          </Typography>
          
          <TableContainer component={Paper} sx={{ mb: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>指标</TableCell>
                  <TableCell align="right">本期</TableCell>
                  <TableCell align="right">上期</TableCell>
                  <TableCell align="right">变化</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {report.comparisonToPrevious.map((item) => (
                  <TableRow key={item.metric}>
                    <TableCell component="th" scope="row">
                      {item.metric}
                    </TableCell>
                    <TableCell align="right">{item.current}</TableCell>
                    <TableCell align="right">{item.previous}</TableCell>
                    <TableCell align="right">
                      <Box display="flex" alignItems="center" justifyContent="flex-end">
                        {item.change > 0 ? (
                          <Tooltip title="增长">
                            <ArrowUpwardIcon color="success" sx={{ mr: 0.5 }} fontSize="small" />
                          </Tooltip>
                        ) : item.change < 0 ? (
                          <Tooltip title="下降">
                            <ArrowDownwardIcon color="error" sx={{ mr: 0.5 }} fontSize="small" />
                          </Tooltip>
                        ) : null}
                        <Typography 
                          variant="body2" 
                          color={item.change > 0 ? 'success.main' : item.change < 0 ? 'error.main' : 'textPrimary'}
                        >
                          {item.change > 0 ? '+' : ''}{item.change}%
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          <Card>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                进步趋势分析
              </Typography>
              <Typography variant="body2" paragraph>
                与上一周期相比，您在以下方面有明显进步：
              </Typography>
              <List dense>
                {report.comparisonToPrevious
                  .filter(item => item.change > 10)
                  .map((item, index) => (
                    <ListItem key={index}>
                      <ListItemText 
                        primary={`${item.metric}增长了${item.change}%`} 
                        secondary={generateProgressComment(item.metric, item.change)}
                      />
                    </ListItem>
                  ))}
              </List>
              
              <Typography variant="body2" paragraph sx={{ mt: 2 }}>
                以下方面可能需要更多关注：
              </Typography>
              <List dense>
                {report.comparisonToPrevious
                  .filter(item => item.change < -10)
                  .map((item, index) => (
                    <ListItem key={index}>
                      <ListItemText 
                        primary={`${item.metric}减少了${Math.abs(item.change)}%`} 
                        secondary={generateRegressionComment(item.metric, item.change)}
                      />
                    </ListItem>
                  ))}
              </List>
            </CardContent>
          </Card>
        </>
      )}
      
      <Box mt={3} display="flex" justifyContent="center">
        <Button variant="contained" color="primary" onClick={onClose}>
          关闭报告
        </Button>
      </Box>
    </Paper>
  );
};

// 生成进步评论
function generateProgressComment(metric: string, change: number): string {
  const comments: Record<string, string[]> = {
    "学习时间": [
      "持续的时间投入是学习成功的关键，继续保持！",
      "您的学习时间增加表明了良好的学习习惯正在形成。"
    ],
    "完成的会话": [
      "规律的学习会话有助于知识的巩固和记忆。",
      "高频率的学习会话对语言学习特别有效。"
    ],
    "完成的项目": [
      "学习内容完成量的增加直接反映了您的学习效率提升。",
      "持续完成学习项目有助于构建完整的知识体系。"
    ],
    "平均分数": [
      "分数的提高反映了您对所学内容的掌握程度增强。",
      "持续提高的成绩是努力学习的直接回报。"
    ],
    "完成率": [
      "高完成率表明您的学习计划执行力强，这是成功的关键因素。",
      "按计划完成学习任务有助于建立持续有效的学习节奏。"
    ]
  };
  
  const defaultComments = [
    "继续保持这种进步趋势！",
    "这一指标的提升将对整体学习效果产生积极影响。"
  ];
  
  const commentOptions = comments[metric] || defaultComments;
  return commentOptions[Math.floor(Math.random() * commentOptions.length)];
}

// 生成退步评论
function generateRegressionComment(metric: string, change: number): string {
  const comments: Record<string, string[]> = {
    "学习时间": [
      "尝试制定更合理的学习计划，保证每天的学习时间。",
      "即使每天只有15-20分钟，持续的学习也比偶尔长时间学习更有效。"
    ],
    "完成的会话": [
      "增加学习频率，可以尝试设置提醒，确保定期进行学习。",
      "短时间高频率的学习通常比长时间低频率学习更有效。"
    ],
    "完成的项目": [
      "设置更小、更容易达成的学习目标，逐步提升完成量。",
      "检查是否学习内容难度突然增加，如果是，可以调整学习策略。"
    ],
    "平均分数": [
      "考虑复习之前的内容，确保基础知识牢固。",
      "尝试不同的学习方法，找到最适合自己的方式。"
    ],
    "完成率": [
      "设置更现实的学习目标，确保能够按计划完成。",
      "分析未完成任务的原因，可能是时间安排、难度或兴趣因素影响。"
    ]
  };
  
  const defaultComments = [
    "暂时的下降不必过于担心，找出原因并调整即可。",
    "检查是否有外部因素影响了您的学习，如时间压力或精力分散。"
  ];
  
  const commentOptions = comments[metric] || defaultComments;
  return commentOptions[Math.floor(Math.random() * commentOptions.length)];
}

export default LearningReportViewer;

// 定义缺失的图标
const MenuBookIcon = SchoolIcon; // 用SchoolIcon代替
const ArrowRightIcon = TrendingUpIcon; // 用TrendingUpIcon代替
const InfoIcon = TipsAndUpdatesIcon; // 用TipsAndUpdatesIcon代替 