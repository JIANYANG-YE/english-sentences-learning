import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Grid, 
  Typography, 
  Tabs, 
  Tab, 
  Button, 
  Chip, 
  CircularProgress, 
  Paper, 
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  LinearProgress,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  CalendarViewWeek,
  CalendarViewMonth,
  CalendarToday,
  TrendingUp,
  TrendingDown,
  TrendingFlat,
  Schedule,
  CheckCircle,
  BookmarkBorder,
  Bookmark,
  MoreVert,
  BarChart,
  Timeline,
  BubbleChart,
  LocalFireDepartment,
  Psychology,
  ShowChart,
  AutoGraph,
  Filter,
  FilterAlt,
  Sort,
  CompareArrows,
  Cached,
  Bolt,
  Speed
} from '@mui/icons-material';

// 模拟服务接口
import { learningAnalyticsService } from '@/services/learningAnalyticsService';

// 模拟用户ID
const MOCK_USER_ID = 'user-123';

// 时间范围类型
type TimeRange = 'day' | 'week' | 'month' | 'year';

// 数据可视化组件 - 趋势图
interface TrendChartProps {
  title: string;
  data: {
    date: string;
    value: number;
  }[];
  unit: string;
  color?: string;
}

const TrendChart: React.FC<TrendChartProps> = ({ title, data, unit, color = '#3f51b5' }) => {
  // 简化版趋势图，真实实现应使用Chart.js或Recharts
  const theme = useTheme();
  const maxValue = Math.max(...data.map(item => item.value));
  
  // 计算趋势方向 - 正值表示上升，负值表示下降，0表示持平
  const trendDirection = data.length >= 2 
    ? data[data.length - 1].value - data[0].value 
    : 0;
  
  const trendPercentage = data.length >= 2 && data[0].value !== 0
    ? Math.round((trendDirection / data[0].value) * 100)
    : 0;
  
  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="h6" component="div">
            {title}
          </Typography>
          {trendDirection !== 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {trendDirection > 0 ? (
                <TrendingUp color="success" sx={{ mr: 0.5 }} />
              ) : trendDirection < 0 ? (
                <TrendingDown color="error" sx={{ mr: 0.5 }} />
              ) : (
                <TrendingFlat color="action" sx={{ mr: 0.5 }} />
              )}
              <Typography 
                variant="body2"
                color={trendDirection > 0 ? 'success.main' : trendDirection < 0 ? 'error.main' : 'text.secondary'}
              >
                {trendDirection > 0 ? '+' : ''}{trendPercentage}%
              </Typography>
            </Box>
          )}
        </Box>
        
        {/* 简化趋势图表示 */}
        <Box sx={{ height: '120px', display: 'flex', alignItems: 'flex-end' }}>
          {data.map((item, index) => (
            <Box
              key={index}
              sx={{
                width: `${100 / data.length}%`,
                height: `${(item.value / maxValue) * 100}%`,
                backgroundColor: color,
                opacity: 0.7 + (index / data.length) * 0.3, // 渐变效果
                mx: 0.5,
                borderTopLeftRadius: 4,
                borderTopRightRadius: 4,
                transition: 'height 0.5s ease',
                position: 'relative',
                '&:hover': {
                  opacity: 1,
                  '& .tooltip': {
                    display: 'block'
                  }
                }
              }}
            >
              <Box 
                className="tooltip" 
                sx={{ 
                  display: 'none',
                  position: 'absolute',
                  bottom: '100%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: 'background.paper',
                  boxShadow: 1,
                  p: 1,
                  borderRadius: 1,
                  zIndex: 1,
                  width: 'auto',
                  whiteSpace: 'nowrap'
                }}
              >
                <Typography variant="caption">
                  {item.date}: {item.value} {unit}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Typography variant="caption" color="text.secondary">
            {data[0]?.date}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {data[data.length - 1]?.date}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

// 学习强度卡片
interface IntensityCardProps {
  title: string;
  currentValue: number;
  maxValue: number;
  averageValue: number;
  icon: React.ReactNode;
  color: string;
}

const IntensityCard: React.FC<IntensityCardProps> = ({ 
  title, 
  currentValue, 
  maxValue, 
  averageValue, 
  icon, 
  color 
}) => {
  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ bgcolor: color, mr: 2 }}>
            {icon}
          </Avatar>
          <Typography variant="h6" component="div">
            {title}
          </Typography>
        </Box>
        
        <Box sx={{ position: 'relative', mb: 2 }}>
          <CircularProgress 
            variant="determinate" 
            value={100} 
            size={120}
            thickness={4}
            sx={{ 
              color: theme => theme.palette.grey[200],
              position: 'absolute'
            }} 
          />
          <CircularProgress 
            variant="determinate" 
            value={(currentValue / maxValue) * 100} 
            size={120}
            thickness={4}
            sx={{ color: color }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="h4" component="div" color="text.primary">
              {currentValue}
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            平均: {averageValue}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            最高: {maxValue}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

// 知识点掌握度卡片
interface KnowledgeMapProps {
  skills: {
    name: string;
    mastery: number;
    recentProgress: number;
  }[];
}

const KnowledgeMap: React.FC<KnowledgeMapProps> = ({ skills }) => {
  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom>
          知识点掌握地图
        </Typography>
        
        <List disablePadding>
          {skills.map((skill, index) => (
            <React.Fragment key={skill.name}>
              <ListItem disablePadding sx={{ py: 1 }}>
                <ListItemText 
                  primary={skill.name} 
                  secondary={`${skill.mastery}% 掌握度`}
                  primaryTypographyProps={{ variant: 'body2' }}
                  secondaryTypographyProps={{ variant: 'caption' }}
                />
                <Box sx={{ minWidth: '120px', width: '30%', ml: 2 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={skill.mastery} 
                    sx={{ 
                      height: 8, 
                      borderRadius: 4,
                      backgroundColor: theme => theme.palette.grey[200],
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: 
                          skill.mastery < 30 ? '#f44336' :
                          skill.mastery < 60 ? '#ff9800' :
                          skill.mastery < 80 ? '#2196f3' : '#4caf50'
                      }
                    }} 
                  />
                </Box>
                <Tooltip title={`最近进度: ${skill.recentProgress > 0 ? '+' : ''}${skill.recentProgress}%`}>
                  <Box sx={{ ml: 1, display: 'flex', alignItems: 'center' }}>
                    {skill.recentProgress > 0 ? (
                      <TrendingUp fontSize="small" color="success" />
                    ) : skill.recentProgress < 0 ? (
                      <TrendingDown fontSize="small" color="error" />
                    ) : (
                      <TrendingFlat fontSize="small" color="action" />
                    )}
                  </Box>
                </Tooltip>
              </ListItem>
              {index < skills.length - 1 && <Divider component="li" />}
            </React.Fragment>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

// 个性化学习仪表盘组件
const PersonalLearningDashboard: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // 状态
  const [loading, setLoading] = useState<boolean>(true);
  const [timeRange, setTimeRange] = useState<TimeRange>('week');
  const [activeTab, setActiveTab] = useState<number>(0);
  const [learningStats, setLearningStats] = useState<any>(null);
  const [learningTrends, setLearningTrends] = useState<any>(null);
  const [learningIntensity, setLearningIntensity] = useState<any>(null);
  const [skillMastery, setSkillMastery] = useState<any>(null);
  
  // 过滤菜单状态
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const openFilterMenu = Boolean(filterAnchorEl);
  
  // 加载数据
  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      // 模拟API调用获取各类数据
      const [
        stats, 
        trends, 
        intensity, 
        mastery
      ] = await Promise.all([
        learningAnalyticsService.getUserLearningStats(MOCK_USER_ID, timeRange),
        learningAnalyticsService.getLearningTrends(MOCK_USER_ID, timeRange),
        learningAnalyticsService.getLearningIntensity(MOCK_USER_ID, timeRange),
        learningAnalyticsService.getSkillMasteryMap(MOCK_USER_ID)
      ]);
      
      setLearningStats(stats);
      setLearningTrends(trends);
      setLearningIntensity(intensity);
      setSkillMastery(mastery);
    } catch (error) {
      console.error('加载仪表盘数据失败:', error);
    } finally {
      setLoading(false);
    }
  }, [timeRange]);
  
  // 初始加载数据
  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);
  
  // 处理时间范围变更
  const handleTimeRangeChange = (range: TimeRange) => {
    setTimeRange(range);
  };
  
  // 处理标签页切换
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };
  
  // 渲染过滤器选项
  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };
  
  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };
  
  // 渲染加载中状态
  if (loading && !learningStats) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  // 渲染仪表盘内容
  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* 仪表盘标题和控件 */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap' }}>
        <Typography variant="h5" component="h1" gutterBottom={isMobile}>
          个性化学习数据分析
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: { xs: 1, md: 0 } }}>
          {/* 时间范围选择器 */}
          <Box sx={{ display: 'flex', borderRadius: 1, overflow: 'hidden', border: `1px solid ${theme.palette.divider}` }}>
            <Button 
              variant={timeRange === 'day' ? 'contained' : 'text'} 
              onClick={() => handleTimeRangeChange('day')}
              startIcon={<CalendarToday />}
              size="small"
              disableElevation
            >
              日
            </Button>
            <Button 
              variant={timeRange === 'week' ? 'contained' : 'text'} 
              onClick={() => handleTimeRangeChange('week')}
              startIcon={<CalendarViewWeek />}
              size="small"
              disableElevation
            >
              周
            </Button>
            <Button 
              variant={timeRange === 'month' ? 'contained' : 'text'} 
              onClick={() => handleTimeRangeChange('month')}
              startIcon={<CalendarViewMonth />}
              size="small"
              disableElevation
            >
              月
            </Button>
          </Box>
          
          {/* 刷新按钮 */}
          <IconButton 
            size="small" 
            onClick={loadDashboardData}
            sx={{ 
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 1
            }}
          >
            <Cached />
          </IconButton>
          
          {/* 过滤和排序选项 */}
          <IconButton 
            size="small" 
            onClick={handleFilterClick}
            sx={{ 
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 1
            }}
          >
            <FilterAlt />
          </IconButton>
          <Menu
            anchorEl={filterAnchorEl}
            open={openFilterMenu}
            onClose={handleFilterClose}
          >
            <MenuItem onClick={handleFilterClose}>按正确率排序</MenuItem>
            <MenuItem onClick={handleFilterClose}>按时间投入排序</MenuItem>
            <MenuItem onClick={handleFilterClose}>按技能类别筛选</MenuItem>
            <MenuItem onClick={handleFilterClose}>按难度级别筛选</MenuItem>
          </Menu>
        </Box>
      </Box>
      
      {/* 主要统计数据 */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Avatar sx={{ bgcolor: '#3f51b5', mr: 2 }}>
                  <Schedule />
                </Avatar>
                <Box>
                  <Typography variant="h5" component="div">
                    {learningStats?.totalTimeSpent || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    总学习时间 (分钟)
                  </Typography>
                </Box>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={learningStats?.timeGoalCompletion || 0}
                sx={{ height: 6, borderRadius: 3, mt: 1 }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                目标达成率: {learningStats?.timeGoalCompletion || 0}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Avatar sx={{ bgcolor: '#4caf50', mr: 2 }}>
                  <CheckCircle />
                </Avatar>
                <Box>
                  <Typography variant="h5" component="div">
                    {learningStats?.learningItemsCompleted || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    已完成学习项目
                  </Typography>
                </Box>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={learningStats?.completionRate || 0}
                sx={{ height: 6, borderRadius: 3, mt: 1, bgcolor: 'rgba(76, 175, 80, 0.2)', '& .MuiLinearProgress-bar': { bgcolor: '#4caf50' } }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                完成比例: {learningStats?.completionRate || 0}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Avatar sx={{ bgcolor: '#f44336', mr: 2 }}>
                  <Bolt />
                </Avatar>
                <Box>
                  <Typography variant="h5" component="div">
                    {learningStats?.averageAccuracy || 0}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    平均准确率
                  </Typography>
                </Box>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={learningStats?.averageAccuracy || 0}
                sx={{ height: 6, borderRadius: 3, mt: 1, bgcolor: 'rgba(244, 67, 54, 0.2)', '& .MuiLinearProgress-bar': { bgcolor: '#f44336' } }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                最佳纪录: {learningStats?.highestAccuracy || 0}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Avatar sx={{ bgcolor: '#ff9800', mr: 2 }}>
                  <LocalFireDepartment />
                </Avatar>
                <Box>
                  <Typography variant="h5" component="div">
                    {learningStats?.streakDays || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    连续学习天数
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', mt: 1 }}>
                {Array.from({ length: 7 }).map((_, index) => (
                  <Box 
                    key={index}
                    sx={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      bgcolor: index < (learningStats?.lastWeekDays || 0) ? '#ff9800' : 'rgba(255, 152, 0, 0.2)',
                      mx: 0.5
                    }}
                  />
                ))}
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                历史最长: {learningStats?.longestStreak || 0}天
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* 切换标签 */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          variant={isMobile ? "scrollable" : "standard"}
          scrollButtons={isMobile ? "auto" : undefined}
        >
          <Tab label="学习趋势" icon={<ShowChart />} iconPosition="start" />
          <Tab label="学习强度" icon={<Speed />} iconPosition="start" />
          <Tab label="知识掌握" icon={<Psychology />} iconPosition="start" />
        </Tabs>
      </Box>
      
      {/* 学习趋势 Tab */}
      {activeTab === 0 && (
        <Grid container spacing={3}>
          {learningTrends && (
            <>
              <Grid item xs={12} md={6}>
                <TrendChart 
                  title="每日学习时间 (分钟)"
                  data={learningTrends.timeSpentData}
                  unit="分钟"
                  color="#3f51b5"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TrendChart 
                  title="学习项目完成数量"
                  data={learningTrends.completionData}
                  unit="项"
                  color="#4caf50"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TrendChart 
                  title="准确率变化 (%)"
                  data={learningTrends.accuracyData}
                  unit="%"
                  color="#f44336"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TrendChart 
                  title="专注度指数"
                  data={learningTrends.focusData}
                  unit="分"
                  color="#ff9800"
                />
              </Grid>
            </>
          )}
        </Grid>
      )}
      
      {/* 学习强度 Tab */}
      {activeTab === 1 && (
        <Grid container spacing={3}>
          {learningIntensity && (
            <>
              <Grid item xs={12} md={6} lg={3}>
                <IntensityCard 
                  title="日学习强度"
                  currentValue={learningIntensity.dailyIntensity.current}
                  maxValue={learningIntensity.dailyIntensity.max}
                  averageValue={learningIntensity.dailyIntensity.average}
                  icon={<LocalFireDepartment />}
                  color="#f44336"
                />
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <IntensityCard 
                  title="专注持续性"
                  currentValue={learningIntensity.focusDuration.current}
                  maxValue={learningIntensity.focusDuration.max}
                  averageValue={learningIntensity.focusDuration.average}
                  icon={<Psychology />}
                  color="#3f51b5"
                />
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <IntensityCard 
                  title="学习效率"
                  currentValue={learningIntensity.efficiency.current}
                  maxValue={learningIntensity.efficiency.max}
                  averageValue={learningIntensity.efficiency.average}
                  icon={<Speed />}
                  color="#4caf50"
                />
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <IntensityCard 
                  title="记忆巩固度"
                  currentValue={learningIntensity.retention.current}
                  maxValue={learningIntensity.retention.max}
                  averageValue={learningIntensity.retention.average}
                  icon={<AutoGraph />}
                  color="#ff9800"
                />
              </Grid>
              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" component="div" gutterBottom>
                      学习强度分布热图
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      热图显示一周内不同时段的学习强度，帮助您识别最佳学习时间
                    </Typography>
                    <Box sx={{ height: '240px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      {Array.from({ length: 7 }).map((_, dayIndex) => (
                        <Box key={dayIndex} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Typography variant="body2" sx={{ width: '60px', flexShrink: 0 }}>
                            {['周一', '周二', '周三', '周四', '周五', '周六', '周日'][dayIndex]}
                          </Typography>
                          <Box sx={{ display: 'flex', flex: 1 }}>
                            {Array.from({ length: 12 }).map((_, hourIndex) => {
                              // 模拟热度数据
                              const randomIntensity = Math.floor(Math.random() * 101);
                              return (
                                <Tooltip 
                                  key={hourIndex} 
                                  title={`${hourIndex + 8}:00 - ${hourIndex + 9}:00, 强度: ${randomIntensity}%`}
                                >
                                  <Box 
                                    sx={{
                                      width: '100%',
                                      height: '24px',
                                      flex: 1,
                                      mx: 0.5,
                                      bgcolor: 
                                        randomIntensity < 20 ? 'rgba(76, 175, 80, 0.1)' :
                                        randomIntensity < 40 ? 'rgba(76, 175, 80, 0.3)' :
                                        randomIntensity < 60 ? 'rgba(76, 175, 80, 0.5)' :
                                        randomIntensity < 80 ? 'rgba(76, 175, 80, 0.7)' : 
                                        'rgba(76, 175, 80, 0.9)',
                                      borderRadius: 1,
                                      cursor: 'pointer',
                                      '&:hover': {
                                        transform: 'scale(1.05)',
                                        boxShadow: 1
                                      }
                                    }}
                                  />
                                </Tooltip>
                              );
                            })}
                          </Box>
                        </Box>
                      ))}
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ width: 20, height: 20, bgcolor: 'rgba(76, 175, 80, 0.1)', borderRadius: 1, mr: 1 }} />
                        <Typography variant="caption">很低</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mx: 2 }}>
                        <Box sx={{ width: 20, height: 20, bgcolor: 'rgba(76, 175, 80, 0.3)', borderRadius: 1, mr: 1 }} />
                        <Typography variant="caption">低</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mx: 2 }}>
                        <Box sx={{ width: 20, height: 20, bgcolor: 'rgba(76, 175, 80, 0.5)', borderRadius: 1, mr: 1 }} />
                        <Typography variant="caption">中</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mx: 2 }}>
                        <Box sx={{ width: 20, height: 20, bgcolor: 'rgba(76, 175, 80, 0.7)', borderRadius: 1, mr: 1 }} />
                        <Typography variant="caption">高</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ width: 20, height: 20, bgcolor: 'rgba(76, 175, 80, 0.9)', borderRadius: 1, mr: 1 }} />
                        <Typography variant="caption">很高</Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </>
          )}
        </Grid>
      )}
      
      {/* 知识掌握 Tab */}
      {activeTab === 2 && (
        <Grid container spacing={3}>
          {skillMastery && (
            <>
              <Grid item xs={12} md={8}>
                <KnowledgeMap skills={skillMastery.skills} />
              </Grid>
              <Grid item xs={12} md={4}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" component="div" gutterBottom>
                      知识掌握概况
                    </Typography>
                    <Box sx={{ mt: 2, mb: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2">整体掌握度</Typography>
                        <Typography variant="body2" color="primary">{skillMastery.overallMastery}%</Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={skillMastery.overallMastery} 
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                    
                    <Typography variant="subtitle2" gutterBottom>
                      知识掌握分布
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      {[
                        { label: '很好 (80%+)', value: skillMastery.masteryDistribution.excellent, color: '#4caf50' },
                        { label: '良好 (60-80%)', value: skillMastery.masteryDistribution.good, color: '#2196f3' },
                        { label: '一般 (40-60%)', value: skillMastery.masteryDistribution.average, color: '#ff9800' },
                        { label: '需加强 (<40%)', value: skillMastery.masteryDistribution.needsWork, color: '#f44336' },
                      ].map(item => (
                        <Box key={item.label} sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
                          <Box 
                            sx={{ 
                              width: 16, 
                              height: 16, 
                              borderRadius: '50%', 
                              bgcolor: item.color,
                              mr: 1 
                            }} 
                          />
                          <Typography variant="body2" sx={{ flex: 1 }}>
                            {item.label}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="body2" fontWeight="medium">
                              {item.value}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                              项
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Typography variant="subtitle2" gutterBottom>
                      学习建议
                    </Typography>
                    <List disablePadding dense>
                      {skillMastery.recommendations.map((rec, index) => (
                        <ListItem key={index} disablePadding sx={{ py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <Bolt fontSize="small" color="warning" />
                          </ListItemIcon>
                          <ListItemText 
                            primary={rec} 
                            primaryTypographyProps={{ variant: 'body2' }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </>
          )}
        </Grid>
      )}
    </Box>
  );
};

export default PersonalLearningDashboard; 