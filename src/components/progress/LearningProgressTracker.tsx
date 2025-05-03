import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, Typography, Box, CircularProgress, 
  Tabs, Tab, Divider, Button, Chip, LinearProgress, 
  List, ListItem, ListItemText, ListItemIcon
} from '@mui/material';
import { 
  Timeline, TimelineItem, TimelineSeparator, 
  TimelineConnector, TimelineContent, TimelineDot 
} from '@mui/lab';
import {
  FiClock, FiAward, FiBarChart2, FiCalendar, 
  FiCheckCircle, FiBook, FiTrendingUp, FiTarget
} from 'react-icons/fi';
import { 
  Course, CourseModule, LearningUnit, 
  LearningMetric, LearningMilestone
} from '../../types/progressTypes';
import { getUserProgressData, getUserCourses, getCourseProgress, 
  getLearningMetrics, getLearningMilestones } from '../../services/progressTracking';

interface LearningProgressTrackerProps {
  userId: string;
  initialTab?: number;
  showDetailedView?: boolean;
  onCourseClick?: (courseId: string) => void;
  onMilestoneClick?: (milestoneId: string) => void;
}

const LearningProgressTracker: React.FC<LearningProgressTrackerProps> = ({
  userId,
  initialTab = 0,
  showDetailedView = false,
  onCourseClick,
  onMilestoneClick
}) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isLoading, setIsLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedModule, setSelectedModule] = useState<CourseModule | null>(null);
  const [metrics, setMetrics] = useState<LearningMetric[]>([]);
  const [milestones, setMilestones] = useState<LearningMilestone[]>([]);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        const coursesData = await getUserCourses(userId);
        setCourses(coursesData);
        
        if (coursesData.length > 0) {
          const courseProgress = await getCourseProgress(userId, coursesData[0].id);
          setSelectedCourse(courseProgress);
          if (courseProgress.modules.length > 0) {
            setSelectedModule(courseProgress.modules[0]);
          }
        }
        
        const metricsData = await getLearningMetrics(userId, timeRange);
        setMetrics(metricsData);
        
        const milestonesData = await getLearningMilestones(userId, false);
        setMilestones(milestonesData);
        
        setError(null);
      } catch (err) {
        console.error('Error fetching learning progress data:', err);
        setError('无法加载学习进度数据，请稍后重试。');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchInitialData();
  }, [userId]);
  
  useEffect(() => {
    const fetchMetricsForTimeRange = async () => {
      try {
        setIsLoading(true);
        const metricsData = await getLearningMetrics(userId, timeRange);
        setMetrics(metricsData);
        setError(null);
      } catch (err) {
        console.error('Error fetching metrics data:', err);
        setError('无法加载学习指标数据，请稍后重试。');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMetricsForTimeRange();
  }, [timeRange, userId]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleCourseSelect = async (courseId: string) => {
    try {
      setIsLoading(true);
      const courseProgress = await getCourseProgress(userId, courseId);
      setSelectedCourse(courseProgress);
      if (courseProgress.modules.length > 0) {
        setSelectedModule(courseProgress.modules[0]);
      } else {
        setSelectedModule(null);
      }
      
      if (onCourseClick) {
        onCourseClick(courseId);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching course progress:', err);
      setError('无法加载课程进度数据，请稍后重试。');
    } finally {
      setIsLoading(false);
    }
  };

  const handleModuleSelect = (module: CourseModule) => {
    setSelectedModule(module);
  };

  const handleMilestoneClick = (milestoneId: string) => {
    if (onMilestoneClick) {
      onMilestoneClick(milestoneId);
    }
  };

  const handleTimeRangeChange = (range: 'week' | 'month' | 'year') => {
    setTimeRange(range);
  };

  // 渲染课程进度列表
  const renderCoursesList = () => {
    if (courses.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            当前没有进行中的课程。开始学习新课程以跟踪您的进度！
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            sx={{ mt: 2 }}
            onClick={() => window.location.href = '/courses'}
          >
            浏览课程
          </Button>
        </Box>
      );
    }

    return (
      <Box sx={{ mt: 2 }}>
        {courses.map((course) => (
          <Card 
            key={course.id}
            sx={{ 
              mb: 2, 
              cursor: 'pointer',
              border: selectedCourse?.id === course.id ? '2px solid #1976d2' : 'none',
              transition: 'all 0.3s ease'
            }}
            onClick={() => handleCourseSelect(course.id)}
          >
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              {course.coverImage ? (
                <Box 
                  component="img"
                  src={course.coverImage}
                  alt={course.title}
                  sx={{ width: 60, height: 60, borderRadius: 1, mr: 2 }}
                />
              ) : (
                <Box 
                  sx={{ 
                    width: 60, 
                    height: 60, 
                    bgcolor: 'primary.light', 
                    borderRadius: 1, 
                    mr: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <FiBook size={30} color="#fff" />
                </Box>
              )}
              <Box sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" component="div">
                    {course.title}
                  </Typography>
                  <Chip 
                    label={course.level} 
                    size="small"
                    color={
                      course.level === 'beginner' ? 'success' :
                      course.level === 'intermediate' ? 'primary' :
                      course.level === 'advanced' ? 'error' : 'default'
                    }
                  />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <Box sx={{ flexGrow: 1, mr: 2 }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={course.progress} 
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {course.progress}%
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    <FiCheckCircle style={{ verticalAlign: 'middle', marginRight: 4 }} />
                    {course.completedModules}/{course.totalModules} 模块完成
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <FiCalendar style={{ verticalAlign: 'middle', marginRight: 4 }} />
                    开始于 {new Date(course.startDate).toLocaleDateString('zh-CN')}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  };

  // 渲染选中课程的详细模块进度
  const renderCourseModules = () => {
    if (!selectedCourse) {
      return (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            请从左侧选择一个课程以查看其模块进度
          </Typography>
        </Box>
      );
    }

    return (
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {selectedCourse.title} - 模块进度
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CircularProgress 
              variant="determinate" 
              value={selectedCourse.progress} 
              size={40}
              thickness={4}
              sx={{ mr: 1 }}
            />
            <Typography variant="body1">
              {selectedCourse.progress}%
            </Typography>
          </Box>
        </Box>
        
        <Divider sx={{ mb: 2 }} />
        
        <Box sx={{ maxHeight: 400, overflow: 'auto', pr: 1 }}>
          {selectedCourse.modules.map((module) => (
            <Card 
              key={module.id}
              sx={{ 
                mb: 2, 
                cursor: 'pointer',
                border: selectedModule?.id === module.id ? '2px solid #1976d2' : 'none',
                bgcolor: module.completed ? 'rgba(76, 175, 80, 0.1)' : 'background.paper',
                transition: 'all 0.3s ease'
              }}
              onClick={() => handleModuleSelect(module)}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" component="div">
                    {module.order}. {module.title}
                  </Typography>
                  {module.completed && (
                    <Chip 
                      icon={<FiCheckCircle />} 
                      label="已完成" 
                      size="small"
                      color="success"
                    />
                  )}
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {module.description}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                  <Box sx={{ flexGrow: 1, mr: 2 }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={module.progress} 
                      sx={{ height: 6, borderRadius: 3 }}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {module.progress}%
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {module.completedUnits}/{module.totalUnits} 单元完成
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    );
  };

  // 渲染选中模块的学习单元进度
  const renderModuleUnits = () => {
    if (!selectedModule) {
      return (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            请选择一个模块以查看其学习单元进度
          </Typography>
        </Box>
      );
    }

    return (
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {selectedModule.title} - 学习单元
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
              {selectedModule.completedUnits}/{selectedModule.totalUnits} 单元完成
            </Typography>
          </Box>
        </Box>
        
        <Divider sx={{ mb: 2 }} />
        
        <Box sx={{ maxHeight: 400, overflow: 'auto', pr: 1 }}>
          <List>
            {selectedModule.units.map((unit) => (
              <ListItem 
                key={unit.id}
                sx={{ 
                  mb: 1, 
                  bgcolor: unit.completed ? 'rgba(76, 175, 80, 0.1)' : 'background.paper',
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <ListItemIcon>
                  {unit.completed ? 
                    <FiCheckCircle size={24} color="#4caf50" /> : 
                    <FiClock size={24} color="#ff9800" />
                  }
                </ListItemIcon>
                <ListItemText 
                  primary={unit.title}
                  secondary={
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={unit.progress} 
                          sx={{ 
                            height: 4, 
                            borderRadius: 2, 
                            flexGrow: 1, 
                            mr: 1 
                          }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {unit.progress}%
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <FiClock size={14} style={{ marginRight: 4 }} />
                          <Typography variant="caption" color="text.secondary">
                            {unit.estimatedTimeMinutes} 分钟
                          </Typography>
                        </Box>
                        {unit.score !== undefined && (
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <FiTarget size={14} style={{ marginRight: 4 }} />
                            <Typography variant="caption" color="text.secondary">
                              得分: {unit.score}
                            </Typography>
                          </Box>
                        )}
                        <Chip 
                          label={
                            unit.difficulty === 'beginner' ? '初级' :
                            unit.difficulty === 'intermediate' ? '中级' : '高级'
                          }
                          size="small"
                          color={
                            unit.difficulty === 'beginner' ? 'success' :
                            unit.difficulty === 'intermediate' ? 'primary' : 'error'
                          }
                          sx={{ height: 20, '& .MuiChip-label': { px: 1, py: 0 } }}
                        />
                      </Box>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>
    );
  };

  // 渲染学习指标
  const renderLearningMetrics = () => {
    const timeButtons = [
      { value: 'week', label: '周' },
      { value: 'month', label: '月' },
      { value: 'year', label: '年' }
    ];

    return (
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" component="div">
            学习指标
          </Typography>
          <Box>
            {timeButtons.map((btn) => (
              <Button
                key={btn.value}
                variant={timeRange === btn.value ? 'contained' : 'outlined'}
                size="small"
                onClick={() => handleTimeRangeChange(btn.value as 'week' | 'month' | 'year')}
                sx={{ ml: 1 }}
              >
                {btn.label}
              </Button>
            ))}
          </Box>
        </Box>
        
        <Divider sx={{ mb: 2 }} />
        
        {metrics.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              目前没有可用的学习指标数据。继续学习以生成数据！
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
            {metrics.map((metric) => (
              <Card key={metric.id} sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body1" color="text.secondary">
                      {metric.name}
                    </Typography>
                    {metric.trend === 'up' && <FiTrendingUp color="#4caf50" />}
                    {metric.trend === 'down' && <FiTrendingUp color="#f44336" style={{ transform: 'rotate(180deg)' }} />}
                    {metric.trend === 'stable' && <FiBarChart2 color="#ffb74d" />}
                  </Box>
                  <Typography variant="h5" component="div" sx={{ mt: 1 }}>
                    {metric.value} {metric.unit}
                  </Typography>
                  
                  {metric.changePercentage !== undefined && (
                    <Typography 
                      variant="body2" 
                      color={
                        metric.trend === 'up' ? 'success.main' :
                        metric.trend === 'down' ? 'error.main' : 'warning.main'
                      }
                      sx={{ mt: 1 }}
                    >
                      {metric.trend === 'up' ? '+' : metric.trend === 'down' ? '-' : ''}
                      {Math.abs(metric.changePercentage)}% 相比上一{
                        timeRange === 'week' ? '周' :
                        timeRange === 'month' ? '月' : '年'
                      }
                    </Typography>
                  )}
                  
                  {metric.targetValue !== undefined && (
                    <Box sx={{ mt: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="caption" color="text.secondary">
                          目标: {metric.targetValue} {metric.unit}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {Math.min(100, Math.round((metric.value / metric.targetValue) * 100))}%
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={Math.min(100, Math.round((metric.value / metric.targetValue) * 100))}
                        sx={{ height: 4, borderRadius: 2 }}
                      />
                    </Box>
                  )}
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Box>
    );
  };

  // 渲染学习里程碑
  const renderLearningMilestones = () => {
    if (milestones.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            目前没有可用的学习里程碑。继续学习以解锁里程碑！
          </Typography>
        </Box>
      );
    }

    return (
      <Box>
        <Typography variant="h6" component="div" sx={{ mb: 2 }}>
          学习里程碑
        </Typography>
        
        <Divider sx={{ mb: 3 }} />
        
        <Timeline position="alternate" sx={{ p: 0 }}>
          {milestones.map((milestone, index) => (
            <TimelineItem key={milestone.id}>
              <TimelineSeparator>
                <TimelineDot 
                  color={milestone.completed ? 'success' : 'primary'}
                  variant={milestone.completed ? 'filled' : 'outlined'}
                  sx={{ p: 1 }}
                >
                  <FiAward size={20} />
                </TimelineDot>
                {index < milestones.length - 1 && <TimelineConnector />}
              </TimelineSeparator>
              <TimelineContent sx={{ py: '12px', px: 2 }}>
                <Card 
                  sx={{ 
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': { transform: 'translateY(-4px)', boxShadow: 3 }
                  }}
                  onClick={() => handleMilestoneClick(milestone.id)}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h6" component="div">
                        {milestone.title}
                      </Typography>
                      {milestone.completed ? (
                        <Chip 
                          label="已完成" 
                          size="small"
                          color="success"
                          icon={<FiCheckCircle size={14} />}
                        />
                      ) : (
                        <Chip 
                          label="进行中" 
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      )}
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {milestone.description}
                    </Typography>
                    
                    {!milestone.completed && milestone.progress !== undefined && (
                      <Box sx={{ mt: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="caption" color="text.secondary">
                            进度
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {milestone.progress}%
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={milestone.progress}
                          sx={{ height: 4, borderRadius: 2 }}
                        />
                      </Box>
                    )}
                    
                    {milestone.completed && milestone.completedDate && (
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                        完成于 {new Date(milestone.completedDate).toLocaleDateString('zh-CN')}
                      </Typography>
                    )}
                    
                    {milestone.dueDate && !milestone.completed && (
                      <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1 }}>
                        到期日: {new Date(milestone.dueDate).toLocaleDateString('zh-CN')}
                      </Typography>
                    )}
                    
                    {milestone.reward && (
                      <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                        <FiAward size={14} style={{ marginRight: 4, color: '#FFD700' }} />
                        <Typography variant="caption" sx={{ color: '#FFD700' }}>
                          奖励: {milestone.reward}
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </Box>
    );
  };

  if (error) {
    return (
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Typography color="error" variant="body1">
              {error}
            </Typography>
            <Button 
              variant="outlined" 
              color="primary" 
              sx={{ mt: 2 }}
              onClick={() => window.location.reload()}
            >
              重试
            </Button>
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CircularProgress />
            <Typography variant="body1" sx={{ mt: 2 }}>
              加载学习进度数据...
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="学习进度跟踪选项卡">
            <Tab label="课程进度" />
            <Tab label="学习指标" />
            <Tab label="里程碑" />
          </Tabs>
        </Box>

        {activeTab === 0 && (
          <Box sx={{ mt: 2 }}>
            {showDetailedView ? (
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2 }}>
                <Box>{renderCoursesList()}</Box>
                <Box>{renderCourseModules()}</Box>
                <Box>{renderModuleUnits()}</Box>
              </Box>
            ) : (
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 2 }}>
                <Box>{renderCoursesList()}</Box>
                <Box>
                  {renderCourseModules()}
                  {selectedModule && (
                    <Box sx={{ mt: 3 }}>
                      {renderModuleUnits()}
                    </Box>
                  )}
                </Box>
              </Box>
            )}
          </Box>
        )}
        
        {activeTab === 1 && (
          <Box sx={{ mt: 2 }}>
            {renderLearningMetrics()}
          </Box>
        )}
        
        {activeTab === 2 && (
          <Box sx={{ mt: 2 }}>
            {renderLearningMilestones()}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default LearningProgressTracker; 