import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Divider,
  Container,
  Grid as MuiGrid,
  Button,
  CircularProgress,
  Tabs,
  Tab,
  Alert
} from '@mui/material';
import StudyProgressTracker from './StudyProgressTracker';
import ErrorPatternDetector from './ErrorPatternDetector';
import BottleneckAnalyzer from './BottleneckAnalyzer';
import LearningReportViewer from './LearningReportViewer';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import {
  Assessment as AssessmentIcon,
  Timeline as TimelineIcon,
  Error as ErrorIcon,
  TrendingUp as TrendingUpIcon,
  InsertChart as InsertChartIcon,
  School as SchoolIcon,
  Schedule as ScheduleIcon,
  Help as HelpIcon,
  Psychology as PsychologyIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';

// 重命名Grid组件以避免冲突
const Grid = MuiGrid;

// 组件属性接口
interface LearningAnalyzerProps {
  userId?: string;
  learningLevel?: 'beginner' | 'intermediate' | 'advanced';
  timeRange?: 'week' | 'month' | 'all';
  onStartSession?: (sessionId: string) => void;
  onSelectResource?: (resource: any) => void;
}

// 学习分析器组件
const LearningAnalyzer: React.FC<LearningAnalyzerProps> = ({
  userId,
  learningLevel = 'intermediate',
  timeRange = 'month',
  onStartSession,
  onSelectResource
}) => {
  // 状态管理
  const [activeTab, setActiveTab] = useState('progress');
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date>(new Date());
  const [error, setError] = useState<string | null>(null);
  const [reportTimeframe, setReportTimeframe] = useState<'day' | 'week' | 'month' | 'year'>('week');

  // 处理标签切换
  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
  };

  // 刷新数据
  const handleRefreshData = () => {
    setIsLoading(true);
    
    // 模拟刷新延迟
    setTimeout(() => {
      setLastUpdateTime(new Date());
      setIsLoading(false);
    }, 1500);
  };
  
  // 处理报告时间范围变化
  const handleReportTimeframeChange = (timeframe: 'day' | 'week' | 'month' | 'year') => {
    setReportTimeframe(timeframe);
  };
  
  // 处理资源选择
  const handleResourceSelect = (resourceId: string, resourceType: string) => {
    if (onSelectResource) {
      onSelectResource({ id: resourceId, type: resourceType });
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2 }}>
          分析学习数据中...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Container maxWidth="lg">
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h4" component="h1" fontWeight="bold">
              学习数据分析
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              深入了解您的学习模式、进度和改进机会
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary" display="block" textAlign="right">
              最后更新: {lastUpdateTime.toLocaleString()}
            </Typography>
            <Button 
              variant="outlined" 
              size="small" 
              startIcon={<InsertChartIcon />}
              onClick={handleRefreshData}
              sx={{ mt: 1 }}
            >
              刷新数据
            </Button>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <TabContext value={activeTab}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleTabChange} variant="fullWidth">
              <Tab 
                label="学习进度" 
                value="progress" 
                icon={<TimelineIcon />} 
                iconPosition="start" 
              />
              <Tab 
                label="错误模式" 
                value="errors" 
                icon={<ErrorIcon />} 
                iconPosition="start" 
              />
              <Tab 
                label="学习瓶颈" 
                value="bottlenecks" 
                icon={<PsychologyIcon />} 
                iconPosition="start" 
              />
              <Tab 
                label="学习报告" 
                value="reports" 
                icon={<DescriptionIcon />} 
                iconPosition="start" 
              />
            </TabList>
          </Box>

          <TabPanel value="progress" sx={{ px: 0, py: 2 }}>
            <StudyProgressTracker 
              userId={userId} 
              onRefreshData={handleRefreshData}
              onStartSession={onStartSession}
            />
          </TabPanel>

          <TabPanel value="errors" sx={{ px: 0, py: 2 }}>
            <ErrorPatternDetector 
              userId={userId}
              timeRange={timeRange}
              onSelectResource={onSelectResource}
            />
          </TabPanel>
          
          <TabPanel value="bottlenecks" sx={{ px: 0, py: 2 }}>
            <BottleneckAnalyzer 
              userId={userId}
              onRefresh={handleRefreshData}
              onResourceSelect={handleResourceSelect}
            />
          </TabPanel>
          
          <TabPanel value="reports" sx={{ px: 0, py: 2 }}>
            <LearningReportViewer 
              userId={userId}
              onGenerateReport={handleRefreshData}
              onTimeframeChange={handleReportTimeframeChange}
            />
          </TabPanel>
        </TabContext>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          数据解释
        </Typography>
        <Typography variant="body2" paragraph>
          本分析基于您过去{timeRange === 'week' ? '一周' : timeRange === 'month' ? '一个月' : '所有'}的学习活动数据。数据包括学习时间、完成的课程、错误模式和学习效率等方面。
        </Typography>
        <Typography variant="body2">
          这些数据帮助您了解自己的学习模式，找出需要改进的领域，并为未来的学习制定更有效的计划。我们建议定期查看分析结果，以持续优化您的学习过程。
        </Typography>
      </Paper>
    </Container>
  );
};

export default LearningAnalyzer; 