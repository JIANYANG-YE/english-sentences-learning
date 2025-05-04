import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Tabs, 
  Tab, 
  Card, 
  CardContent, 
  Divider, 
  Button, 
  Grid, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  LinearProgress, 
  CircularProgress, 
  Chip, 
  Paper, 
  Alert, 
  Tooltip, 
  IconButton,
  Avatar,
  Menu,
  MenuItem
} from '@mui/material';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import SchoolIcon from '@mui/icons-material/School';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import BarChartIcon from '@mui/icons-material/BarChart';
import DateRangeIcon from '@mui/icons-material/DateRange';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FlagIcon from '@mui/icons-material/Flag';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {
  AccessTime,
  Check,
  Flag,
  TrendingUp,
  TrendingDown,
  TrendingFlat,
  MoreVert,
  CalendarToday,
  RadioButtonUnchecked,
  School,
  DirectionsRun,
  FilterList,
  Sort
} from '@mui/icons-material';

// 定义学习单元接口
interface LearningUnit {
  id: string;
  title: string;
  type: 'sentence' | 'grammar' | 'vocabulary' | 'listening' | 'reading';
  completed: boolean;
  progress: number;
  score?: number;
  date?: string;
  unlocked: boolean;
}

// 定义课程模块接口
interface CourseModule {
  id: string;
  title: string;
  description: string;
  completed: number;
  total: number;
  units: LearningUnit[];
}

// 定义课程接口
interface Course {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  progress: number;
  modules: CourseModule[];
  lastAccessed?: string;
}

// 定义学习指标接口
interface LearningMetric {
  id: string;
  title: string;
  value: number;
  unit: string;
  change: number;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
}

// 定义学习里程碑接口
interface LearningMilestone {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'achievement' | 'course' | 'level' | 'streak';
  achieved: boolean;
  icon: React.ReactNode;
}

// 定义组件Props
interface LearningProgressTrackerProps {
  userId: string;
  onGeneratePlan?: () => void;
  onMilestoneUpdated?: (milestoneId: string, completed: boolean) => void;
  className?: string;
}

const LearningProgressTracker: React.FC<LearningProgressTrackerProps> = ({ 
  userId, 
  onGeneratePlan,
  onMilestoneUpdated,
  className
}) => {
  // 状态定义
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [metrics, setMetrics] = useState<LearningMetric[]>([]);
  const [milestones, setMilestones] = useState<LearningMilestone[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedModule, setSelectedModule] = useState<CourseModule | null>(null);

  // 菜单状态
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string | null>(null);

  // 加载用户学习数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 实际应用中，这里应该调用API获取数据
        // 模拟延迟加载
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 生成模拟数据
        const mockCourses = generateMockCourses();
        const mockMetrics = generateMockMetrics();
        const mockMilestones = generateMockMilestones();
        
        setCourses(mockCourses);
        setMetrics(mockMetrics);
        setMilestones(mockMilestones);
        
        if (mockCourses.length > 0) {
          setSelectedCourse(mockCourses[0]);
          if (mockCourses[0].modules.length > 0) {
            setSelectedModule(mockCourses[0].modules[0]);
          }
        }
      } catch (err) {
        console.error('加载学习进度数据失败:', err);
        setError('加载学习进度数据失败，请稍后再试');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [userId]);

  // 生成模拟课程数据
  const generateMockCourses = (): Course[] => {
    return [
      {
        id: 'course1',
        title: '日常英语对话基础',
        description: '掌握日常英语会话所需的基础词汇和句型',
        imageUrl: '/images/courses/daily-english.jpg',
        progress: 68,
        lastAccessed: '2023-10-15',
        modules: [
          {
            id: 'module1-1',
            title: '问候与介绍',
            description: '学习基本的问候语和自我介绍句型',
            completed: 5,
            total: 8,
            units: [
              { id: 'unit1-1-1', title: '基本问候语', type: 'sentence', completed: true, progress: 100, score: 92, date: '2023-10-08', unlocked: true },
              { id: 'unit1-1-2', title: '自我介绍', type: 'sentence', completed: true, progress: 100, score: 88, date: '2023-10-09', unlocked: true },
              { id: 'unit1-1-3', title: '询问他人基本信息', type: 'sentence', completed: true, progress: 100, score: 95, date: '2023-10-10', unlocked: true },
              { id: 'unit1-1-4', title: '介绍他人', type: 'sentence', completed: true, progress: 100, score: 85, date: '2023-10-12', unlocked: true },
              { id: 'unit1-1-5', title: '问候语法练习', type: 'grammar', completed: true, progress: 100, score: 90, date: '2023-10-14', unlocked: true },
              { id: 'unit1-1-6', title: '正式与非正式问候', type: 'vocabulary', completed: false, progress: 50, unlocked: true },
              { id: 'unit1-1-7', title: '听力练习：对话中的问候', type: 'listening', completed: false, progress: 25, unlocked: true },
              { id: 'unit1-1-8', title: '阅读练习：自我介绍信', type: 'reading', completed: false, progress: 0, unlocked: false }
            ]
          },
          {
            id: 'module1-2',
            title: '购物与交易',
            description: '学习在购物场景中使用的英语表达',
            completed: 3,
            total: 6,
            units: [
              { id: 'unit1-2-1', title: '询问价格', type: 'sentence', completed: true, progress: 100, score: 86, date: '2023-10-02', unlocked: true },
              { id: 'unit1-2-2', title: '比较商品', type: 'sentence', completed: true, progress: 100, score: 92, date: '2023-10-03', unlocked: true },
              { id: 'unit1-2-3', title: '讨价还价', type: 'sentence', completed: true, progress: 100, score: 79, date: '2023-10-05', unlocked: true },
              { id: 'unit1-2-4', title: '支付方式词汇', type: 'vocabulary', completed: false, progress: 60, unlocked: true },
              { id: 'unit1-2-5', title: '购物对话听力', type: 'listening', completed: false, progress: 20, unlocked: true },
              { id: 'unit1-2-6', title: '商场购物情景模拟', type: 'reading', completed: false, progress: 0, unlocked: false }
            ]
          }
        ]
      },
      {
        id: 'course2',
        title: '商务英语精讲',
        description: '面向职场人士的专业商务英语课程',
        imageUrl: '/images/courses/business-english.jpg',
        progress: 42,
        lastAccessed: '2023-10-12',
        modules: [
          {
            id: 'module2-1',
            title: '邮件与商务沟通',
            description: '掌握商务邮件写作与回复技巧',
            completed: 2,
            total: 5,
            units: [
              { id: 'unit2-1-1', title: '邮件格式与结构', type: 'reading', completed: true, progress: 100, score: 94, date: '2023-09-25', unlocked: true },
              { id: 'unit2-1-2', title: '常用商务邮件短语', type: 'vocabulary', completed: true, progress: 100, score: 88, date: '2023-09-28', unlocked: true },
              { id: 'unit2-1-3', title: '请求信息邮件', type: 'sentence', completed: false, progress: 75, unlocked: true },
              { id: 'unit2-1-4', title: '安排会议邮件', type: 'sentence', completed: false, progress: 30, unlocked: true },
              { id: 'unit2-1-5', title: '投诉与解决问题邮件', type: 'sentence', completed: false, progress: 0, unlocked: false }
            ]
          }
        ]
      }
    ];
  };

  // 生成模拟学习指标数据
  const generateMockMetrics = (): LearningMetric[] => {
    return [
      {
        id: 'metric1',
        title: '课程完成率',
        value: 68,
        unit: '%',
        change: 5,
        changeType: 'positive',
        icon: <CheckCircleIcon color="primary" />
      },
      {
        id: 'metric2',
        title: '学习持续性',
        value: 82,
        unit: '%',
        change: -3,
        changeType: 'negative',
        icon: <TrendingUpIcon color="primary" />
      },
      {
        id: 'metric3',
        title: '平均得分',
        value: 88,
        unit: '分',
        change: 2,
        changeType: 'positive',
        icon: <SchoolIcon color="primary" />
      },
      {
        id: 'metric4',
        title: '学习时间',
        value: 8.5,
        unit: '小时/周',
        change: 1.5,
        changeType: 'positive',
        icon: <AccessTimeIcon color="primary" />
      }
    ];
  };

  // 生成模拟里程碑数据
  const generateMockMilestones = (): LearningMilestone[] => {
    return [
      {
        id: 'milestone1',
        title: '完成第一门课程',
        description: '恭喜您完成"基础英语对话"课程的全部内容！',
        date: '2023-09-15',
        type: 'course',
        achieved: true,
        icon: <SchoolIcon />
      },
      {
        id: 'milestone2',
        title: '达成7天连续学习',
        description: '您已连续学习7天，继续保持！',
        date: '2023-10-01',
        type: 'streak',
        achieved: true,
        icon: <DateRangeIcon />
      },
      {
        id: 'milestone3',
        title: '单词掌握量达到500',
        description: '您已掌握500个核心英语单词！',
        date: '2023-10-08',
        type: 'achievement',
        achieved: true,
        icon: <EmojiEventsIcon />
      },
      {
        id: 'milestone4',
        title: '达成14天连续学习',
        description: '连续学习14天将解锁额外奖励！',
        date: '2023-10-17',
        type: 'streak',
        achieved: false,
        icon: <DateRangeIcon />
      },
      {
        id: 'milestone5',
        title: '完成所有商务英语课程',
        description: '完成全部商务英语课程以获得认证！',
        date: '2023-11-30',
        type: 'course',
        achieved: false,
        icon: <SchoolIcon />
      }
    ];
  };

  // 处理标签切换
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // 处理课程选择
  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course);
    if (course.modules.length > 0) {
      setSelectedModule(course.modules[0]);
    } else {
      setSelectedModule(null);
    }
  };

  // 处理模块选择
  const handleModuleSelect = (module: CourseModule) => {
    setSelectedModule(module);
  };

  // 处理学习单元点击
  const handleUnitClick = (unit: LearningUnit) => {
    if (unit.unlocked) {
      // 实际应用中，这里应该导航到对应的学习单元页面
      console.log(`Navigate to unit: ${unit.id}`);
    }
  };

  // 处理里程碑更新
  const handleMilestoneUpdate = (milestoneId: string, completed: boolean) => {
    setMilestones(prev => prev.map(m => 
      m.id === milestoneId ? { 
        ...m, 
        achieved: completed,
        date: completed ? new Date().toISOString() : m.date
      } : m
    ));
    
    if (onMilestoneUpdated) {
      onMilestoneUpdated(milestoneId, completed);
    }
    
    // 关闭菜单
    setMenuAnchorEl(null);
  };

  // 处理菜单打开
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, milestoneId: string) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedMilestoneId(milestoneId);
  };
  
  // 处理菜单关闭
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedMilestoneId(null);
  };

  // 渲染课程概览部分
  const renderCourseOverview = () => {
    return (
      <Box>
        <Typography variant="h5" component="h2" gutterBottom>
          学习进度概览
        </Typography>
        
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {metrics.map((metric) => (
            <Grid item xs={12} sm={6} md={3} key={metric.id}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      {metric.title}
                    </Typography>
                    {metric.icon}
                  </Box>
                  <Typography variant="h4" component="div">
                    {metric.value}{metric.unit}
                  </Typography>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    color: metric.changeType === 'positive' ? 'success.main' : 
                           metric.changeType === 'negative' ? 'error.main' : 'text.secondary'
                  }}>
                    {metric.changeType === 'positive' && '↑ '}
                    {metric.changeType === 'negative' && '↓ '}
                    {Math.abs(metric.change)}{metric.unit} {metric.changeType !== 'neutral' && '较上周'}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        
        <Typography variant="h6" gutterBottom>
          正在学习的课程
        </Typography>
        
        <Grid container spacing={3}>
          {courses.map((course) => (
            <Grid item xs={12} md={6} key={course.id}>
              <Card 
                variant="outlined" 
                sx={{ 
                  cursor: 'pointer',
                  border: selectedCourse?.id === course.id ? '2px solid' : '1px solid',
                  borderColor: selectedCourse?.id === course.id ? 'primary.main' : 'divider'
                }}
                onClick={() => handleCourseSelect(course)}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <Avatar
                      variant="rounded"
                      src={course.imageUrl}
                      alt={course.title}
                      sx={{ width: 60, height: 60, mr: 2 }}
                    >
                      <SchoolIcon />
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" gutterBottom>
                        {course.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {course.description}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ mt: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2" color="text.secondary">
                        完成度: {course.progress}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {course.modules.reduce((acc, module) => acc + module.completed, 0)}/
                        {course.modules.reduce((acc, module) => acc + module.total, 0)} 单元
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={course.progress} 
                      sx={{ height: 8, borderRadius: 1 }}
                    />
                  </Box>
                  
                  {course.lastAccessed && (
                    <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                      上次学习: {course.lastAccessed}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };

  // 渲染课程详情部分
  const renderCourseDetails = () => {
    if (!selectedCourse) return null;
    
    return (
      <Box>
        <Typography variant="h5" component="h2" gutterBottom>
          {selectedCourse.title} 详情
        </Typography>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" paragraph>
            {selectedCourse.description}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2" sx={{ mr: 2 }}>
              总进度: {selectedCourse.progress}%
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={selectedCourse.progress} 
              sx={{ height: 10, borderRadius: 1, flexGrow: 1 }}
            />
          </Box>
        </Box>
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              课程模块
            </Typography>
            <List component={Paper} variant="outlined" sx={{ mb: { xs: 3, md: 0 } }}>
              {selectedCourse.modules.map((module) => (
                <ListItem 
                  key={module.id}
                  button
                  selected={selectedModule?.id === module.id}
                  onClick={() => handleModuleSelect(module)}
                  divider
                  sx={{ 
                    borderLeft: selectedModule?.id === module.id ? '4px solid' : '4px solid transparent',
                    borderLeftColor: 'primary.main',
                    transition: 'all 0.2s ease-in-out'
                  }}
                >
                  <ListItemText 
                    primary={module.title}
                    secondary={
                      <>
                        <Typography variant="body2" component="span" color="text.secondary">
                          完成 {module.completed}/{module.total} 单元 - {Math.round((module.completed / module.total) * 100)}%
                        </Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={(module.completed / module.total) * 100}
                          sx={{ height: 4, borderRadius: 1, mt: 0.5 }}
                        />
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Grid>
          
          <Grid item xs={12} md={8}>
            {selectedModule && (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6">
                    模块: {selectedModule.title}
                  </Typography>
                  <Chip 
                    label={`完成 ${selectedModule.completed}/${selectedModule.total} 单元`}
                    color="primary"
                    size="small"
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {selectedModule.description}
                </Typography>
                
                <Paper variant="outlined" sx={{ p: 0 }}>
                  <List disablePadding>
                    {selectedModule.units.map((unit, index) => (
                      <ListItem 
                        key={unit.id}
                        divider={index < selectedModule.units.length - 1}
                        button={unit.unlocked}
                        onClick={() => handleUnitClick(unit)}
                        disabled={!unit.unlocked}
                        sx={{ 
                          opacity: unit.unlocked ? 1 : 0.6,
                          bgcolor: unit.completed ? 'rgba(76, 175, 80, 0.08)' : 'transparent'
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 40 }}>
                          {unit.completed ? (
                            <CheckCircleIcon color="success" />
                          ) : unit.unlocked ? (
                            <PlayCircleOutlineIcon color="primary" />
                          ) : (
                            <FlagIcon color="disabled" />
                          )}
                        </ListItemIcon>
                        <ListItemText 
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Typography variant="body1">
                                {unit.title}
                              </Typography>
                              {unit.type && (
                                <Chip 
                                  label={
                                    unit.type === 'sentence' ? '句型' :
                                    unit.type === 'grammar' ? '语法' :
                                    unit.type === 'vocabulary' ? '词汇' :
                                    unit.type === 'listening' ? '听力' :
                                    unit.type === 'reading' ? '阅读' : unit.type
                                  }
                                  size="small"
                                  sx={{ ml: 1, height: 20, fontSize: '0.7rem' }}
                                />
                              )}
                            </Box>
                          }
                          secondary={
                            <Box sx={{ mt: 0.5 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                                <Typography variant="body2" component="span" color="text.secondary">
                                  进度: {unit.progress}%
                                </Typography>
                                {unit.score && (
                                  <Typography 
                                    variant="body2" 
                                    component="span" 
                                    color={unit.score >= 90 ? 'success.main' : unit.score >= 70 ? 'primary.main' : 'warning.main'}
                                  >
                                    得分: {unit.score}分
                                  </Typography>
                                )}
                              </Box>
                              <LinearProgress 
                                variant="determinate" 
                                value={unit.progress} 
                                sx={{ 
                                  height: 4, 
                                  borderRadius: 1,
                                  '& .MuiLinearProgress-bar': {
                                    bgcolor: unit.score ? 
                                      (unit.score >= 90 ? 'success.main' : 
                                      unit.score >= 70 ? 'primary.main' : 'warning.main') 
                                      : undefined
                                  }
                                }}
                              />
                            </Box>
                          }
                        />
                        {unit.date && (
                          <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                            {unit.date}
                          </Typography>
                        )}
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </>
            )}
          </Grid>
        </Grid>
      </Box>
    );
  };

  // 渲染学习路径部分
  const renderLearningPath = () => {
    return (
      <Box>
        <Typography variant="h5" component="h2" gutterBottom>
          学习路径与里程碑
        </Typography>
        
        <Timeline position="alternate">
          {milestones.map((milestone) => (
            <TimelineItem key={milestone.id}>
              <TimelineOppositeContent color="text.secondary">
                {milestone.date}
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot 
                  color={milestone.achieved ? "success" : "grey"}
                  variant={milestone.achieved ? "filled" : "outlined"}
                >
                  {milestone.icon}
                </TimelineDot>
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <Paper elevation={milestone.achieved ? 1 : 0} sx={{ p: 2, bgcolor: milestone.achieved ? 'success.light' : 'background.paper' }}>
                  <Typography variant="subtitle1" component="div" fontWeight={500}>
                    {milestone.title}
                  </Typography>
                  <Typography variant="body2">
                    {milestone.description}
                  </Typography>
                  {!milestone.achieved && (
                    <Button 
                      size="small" 
                      variant="outlined" 
                      startIcon={<PlayArrowIcon />} 
                      sx={{ mt: 1 }}
                    >
                      开始学习
                    </Button>
                  )}
                </Paper>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button 
            variant="contained"
            color="primary"
            startIcon={<AutoGraphIcon />}
            onClick={onGeneratePlan}
            size="large"
          >
            生成个性化学习计划
          </Button>
        </Box>
      </Box>
    );
  };

  // 渲染学习统计部分
  const renderLearningStats = () => {
    return (
      <Box>
        <Typography variant="h5" component="h2" gutterBottom>
          学习统计与分析
        </Typography>
        
        <Alert severity="info" sx={{ mb: 4 }}>
          详细的学习统计分析功能正在开发中。即将推出更全面的数据可视化和学习模式分析工具。
        </Alert>
        
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            <BarChartIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            学习时间分布
          </Typography>
          <Paper variant="outlined" sx={{ p: 3, height: 200, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Typography color="text.secondary">
              学习时间分布图表将在下一版本更新中提供
            </Typography>
          </Paper>
        </Box>
        
        <Box>
          <Typography variant="h6" gutterBottom>
            <AutoGraphIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            学习效率趋势
          </Typography>
          <Paper variant="outlined" sx={{ p: 3, height: 200, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Typography color="text.secondary">
              学习效率趋势图表将在下一版本更新中提供
            </Typography>
          </Paper>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button 
            variant="outlined"
            color="primary"
            endIcon={<ArrowForwardIcon />}
            onClick={() => {
              // 实际应用中，这里应该导航到学习习惯分析页面
              console.log('Navigate to learning habits analysis page');
            }}
          >
            查看详细的学习习惯分析
          </Button>
        </Box>
      </Box>
    );
  };

  // 加载提示
  if (loading) {
    return (
      <Box 
        className={className}
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '300px' 
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // 渲染错误状态
  if (error) {
    return (
      <Box className={className} sx={{ p: 3 }}>
        <Typography color="error" align="center">
          {error}
        </Typography>
        <Button 
          variant="outlined" 
          sx={{ mt: 2, display: 'block', mx: 'auto' }}
          onClick={() => window.location.reload()}
        >
          重新加载
        </Button>
      </Box>
    );
  }

  return (
    <Box className={className}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          学习进度跟踪
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          跟踪和分析您的学习进度，掌握学习路径，定制个性化学习计划。
        </Typography>
      </Box>
      
      <Tabs 
        value={activeTab} 
        onChange={handleTabChange} 
        variant="scrollable"
        scrollButtons="auto"
        sx={{ 
          mb: 3,
          borderBottom: 1,
          borderColor: 'divider',
          '& .MuiTab-root': {
            minWidth: 150,
          }
        }}
      >
        <Tab label="进度概览" icon={<BarChartIcon />} iconPosition="start" />
        <Tab label="课程详情" icon={<SchoolIcon />} iconPosition="start" />
        <Tab label="学习路径" icon={<TimelineItem />} iconPosition="start" />
        <Tab label="学习统计" icon={<AutoGraphIcon />} iconPosition="start" />
      </Tabs>
      
      <Box sx={{ py: 2 }}>
        {activeTab === 0 && renderCourseOverview()}
        {activeTab === 1 && renderCourseDetails()}
        {activeTab === 2 && renderLearningPath()}
        {activeTab === 3 && renderLearningStats()}
      </Box>
    </Box>
  );
};

export default LearningProgressTracker; 