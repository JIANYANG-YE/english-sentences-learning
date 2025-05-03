'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Tooltip, 
  IconButton,
  Skeleton,
  Paper,
  Grid,
  Slider,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent
} from '@mui/material';

// 简化的图标组件
const CalendarIcon = () => <span>📅</span>;
const TodayIcon = () => <span>📆</span>;
const FilterListIcon = () => <span>🔍</span>;
const InfoIcon = () => <span>ℹ️</span>;

// 每日学习数据接口
export interface DailyLearningData {
  date: string; // ISO日期格式 YYYY-MM-DD
  minutesSpent: number; // 学习时间（分钟）
  activitiesCompleted: number; // 完成的活动数量
  lessonsStudied: number; // 学习的章节数量
  streak?: number; // 连续学习天数
}

// 周热度图接口
export interface WeeklyHeatmapData {
  // 格式：{"周一": [0-23小时的数据], "周二": [0-23小时的数据], ...}
  [day: string]: number[];
}

// 组件属性
interface LearningHeatmapProps {
  dailyData?: DailyLearningData[];
  weeklyData?: WeeklyHeatmapData;
  loading?: boolean;
  userId?: string;
  timeRange?: '7' | '30' | '90' | '365';
  onTimeRangeChange?: (range: '7' | '30' | '90' | '365') => void;
  compact?: boolean;
}

/**
 * 学习热力图组件
 * 显示用户学习时间和频率的可视化图表
 */
const LearningHeatmap: React.FC<LearningHeatmapProps> = ({
  dailyData = [],
  weeklyData,
  loading = false,
  userId,
  timeRange = '30',
  onTimeRangeChange,
  compact = false
}) => {
  const [showWeekly, setShowWeekly] = useState<boolean>(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'7' | '30' | '90' | '365'>(timeRange);
  const [hoverInfo, setHoverInfo] = useState<{day: string, hour: number, value: number} | null>(null);

  // 当外部timeRange变化时同步内部状态
  useEffect(() => {
    setSelectedTimeRange(timeRange);
  }, [timeRange]);

  // 处理时间范围变更
  const handleTimeRangeChange = (event: SelectChangeEvent) => {
    const newRange = event.target.value as '7' | '30' | '90' | '365';
    setSelectedTimeRange(newRange);
    
    if (onTimeRangeChange) {
      onTimeRangeChange(newRange);
    }
  };

  // 切换视图
  const toggleView = () => {
    setShowWeekly(!showWeekly);
  };

  // 计算日历热力图颜色
  const getColorForValue = (value: number) => {
    if (value === 0) return '#ebedf0';
    if (value < 30) return '#9be9a8';
    if (value < 60) return '#40c463';
    if (value < 120) return '#30a14e';
    return '#216e39';
  };

  // 渲染日历热力图
  const renderCalendarView = () => {
    if (loading) {
      return (
        <Box sx={{ mb: 2 }}>
          <Skeleton variant="rectangular" height={140} />
        </Box>
      );
    }

    if (!dailyData || dailyData.length === 0) {
      return (
        <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
          暂无学习数据
        </Typography>
      );
    }

    // 为了简化示例，我们只显示最近一段时间的数据
    const visibleData = dailyData.slice(-parseInt(selectedTimeRange));
    
    // 计算日期网格
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const days = [];
    for (let i = parseInt(selectedTimeRange) - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      // 寻找匹配的数据
      const dayData = visibleData.find(d => d.date === dateString) || {
        date: dateString,
        minutesSpent: 0,
        activitiesCompleted: 0,
        lessonsStudied: 0
      };
      
      days.push(dayData);
    }

    return (
      <Box sx={{ overflowX: 'auto', pb: 1 }}>
        <Box sx={{ display: 'flex', minWidth: compact ? 300 : 600, p: 1 }}>
          {days.map((day, index) => (
            <Tooltip
              key={day.date}
              title={
                <Box>
                  <Typography variant="body2">{new Date(day.date).toLocaleDateString('zh-CN')}</Typography>
                  <Typography variant="body2">学习时间: {day.minutesSpent}分钟</Typography>
                  <Typography variant="body2">完成活动: {day.activitiesCompleted}个</Typography>
                  <Typography variant="body2">学习章节: {day.lessonsStudied}章</Typography>
                  {day.streak && (
                    <Typography variant="body2">连续学习: {day.streak}天</Typography>
                  )}
                </Box>
              }
            >
              <Box
                sx={{
                  width: compact ? 12 : 16,
                  height: compact ? 12 : 16,
                  m: 0.5,
                  backgroundColor: getColorForValue(day.minutesSpent),
                  borderRadius: 1,
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'scale(1.2)',
                    transition: 'transform 0.2s'
                  }
                }}
              />
            </Tooltip>
          ))}
        </Box>
      </Box>
    );
  };

  // 渲染周时间热力图
  const renderWeeklyHeatmap = () => {
    if (loading) {
      return (
        <Box sx={{ mb: 2 }}>
          <Skeleton variant="rectangular" height={200} />
        </Box>
      );
    }

    if (!weeklyData) {
      return (
        <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
          暂无周时间分布数据
        </Typography>
      );
    }

    const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    const hours = Array.from({ length: 24 }, (_, i) => i);

    return (
      <Box sx={{ p: 1 }}>
        <Grid container spacing={0.5}>
          {/* 小时标签 - 顶部 */}
          <Grid item xs={1}></Grid>
          <Grid item xs={11}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              {[0, 6, 12, 18, 23].map(hour => (
                <Typography key={hour} variant="caption" color="text.secondary">
                  {hour}:00
                </Typography>
              ))}
            </Box>
          </Grid>

          {/* 星期和热力格子 */}
          {weekDays.map(day => (
            <React.Fragment key={day}>
              <Grid item xs={1}>
                <Box sx={{ display: 'flex', alignItems: 'center', height: '100%', pr: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    {day}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={11}>
                <Box sx={{ display: 'flex', flexWrap: 'nowrap' }}>
                  {hours.map(hour => {
                    const value = weeklyData[day]?.[hour] || 0;
                    return (
                      <Tooltip
                        key={`${day}-${hour}`}
                        title={`${day} ${hour}:00-${hour+1}:00: ${value}分钟`}
                      >
                        <Box
                          sx={{
                            width: '100%',
                            height: compact ? 15 : 20,
                            backgroundColor: getColorForValue(value),
                            borderRadius: 0.5,
                            m: 0.1,
                            cursor: 'pointer',
                            '&:hover': {
                              opacity: 0.8,
                              transition: 'opacity 0.2s'
                            }
                          }}
                          onMouseEnter={() => setHoverInfo({ day, hour, value })}
                          onMouseLeave={() => setHoverInfo(null)}
                        />
                      </Tooltip>
                    );
                  })}
                </Box>
              </Grid>
            </React.Fragment>
          ))}
        </Grid>

        {/* 热力图图例 */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mt: 2 }}>
          <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
            较少
          </Typography>
          {[0, 1, 2, 3, 4].map((level) => (
            <Box
              key={level}
              sx={{
                width: 15,
                height: 15,
                backgroundColor: getColorForValue(level === 0 ? 0 : level * 30),
                mx: 0.5,
                borderRadius: 0.5
              }}
            />
          ))}
          <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
            较多
          </Typography>
        </Box>
      </Box>
    );
  };

  // 计算学习统计
  const calculateStats = () => {
    if (!dailyData || dailyData.length === 0) {
      return { totalTime: 0, activeDays: 0, averageTimePerDay: 0, maxStreak: 0 };
    }

    const totalTime = dailyData.reduce((sum, day) => sum + day.minutesSpent, 0);
    const activeDays = dailyData.filter(day => day.minutesSpent > 0).length;
    const averageTimePerDay = activeDays > 0 ? Math.round(totalTime / activeDays) : 0;
    const maxStreak = Math.max(...dailyData.map(day => day.streak || 0), 0);

    return { totalTime, activeDays, averageTimePerDay, maxStreak };
  };

  const stats = calculateStats();

  return (
    <Card variant="outlined" sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
            <CalendarIcon />
            <span style={{ marginLeft: 8 }}>学习热力图</span>
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <FormControl size="small" sx={{ minWidth: 100 }}>
              <InputLabel id="time-range-label">时间范围</InputLabel>
              <Select
                labelId="time-range-label"
                value={selectedTimeRange}
                label="时间范围"
                onChange={handleTimeRangeChange}
              >
                <MenuItem value="7">7天</MenuItem>
                <MenuItem value="30">30天</MenuItem>
                <MenuItem value="90">90天</MenuItem>
                <MenuItem value="365">一年</MenuItem>
              </Select>
            </FormControl>
            
            <Tooltip title={showWeekly ? "查看日历视图" : "查看周时间分布"}>
              <IconButton size="small" onClick={toggleView}>
                {showWeekly ? <CalendarIcon /> : <TodayIcon />}
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        
        {/* 热力图视图 */}
        {showWeekly ? renderWeeklyHeatmap() : renderCalendarView()}
        
        {/* 学习统计 */}
        <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'space-around' }}>
          <Paper elevation={0} sx={{ p: 1.5, bgcolor: 'background.default', borderRadius: 2, minWidth: 100, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">总学习时间</Typography>
            <Typography variant="h6">{stats.totalTime}分钟</Typography>
          </Paper>
          
          <Paper elevation={0} sx={{ p: 1.5, bgcolor: 'background.default', borderRadius: 2, minWidth: 100, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">活跃天数</Typography>
            <Typography variant="h6">{stats.activeDays}天</Typography>
          </Paper>
          
          <Paper elevation={0} sx={{ p: 1.5, bgcolor: 'background.default', borderRadius: 2, minWidth: 100, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">日均学习</Typography>
            <Typography variant="h6">{stats.averageTimePerDay}分钟</Typography>
          </Paper>
          
          <Paper elevation={0} sx={{ p: 1.5, bgcolor: 'background.default', borderRadius: 2, minWidth: 100, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">最长连续</Typography>
            <Typography variant="h6">{stats.maxStreak}天</Typography>
          </Paper>
        </Box>
        
        {/* 提示信息 */}
        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
          <InfoIcon />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            每个方块代表一天，颜色越深表示学习时间越长
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default LearningHeatmap; 