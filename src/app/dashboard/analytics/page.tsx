import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Tabs, 
  Tab, 
  Breadcrumbs, 
  Link, 
  Container 
} from '@mui/material';
import { 
  Home as HomeIcon, 
  Analytics as AnalyticsIcon, 
  Timeline as TimelineIcon, 
  Error as ErrorIcon,
  Lightbulb as LightbulbIcon,
  NavigateNext as NavigateNextIcon
} from '@mui/icons-material';
import StudyProgressTracker from '@/components/analytics/StudyProgressTracker';
import ErrorPatternDetector from '@/components/analytics/ErrorPatternDetector';
import { TabContext, TabList, TabPanel } from '@mui/lab';

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = React.useState('progress');

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* 面包屑导航 */}
      <Breadcrumbs 
        separator={<NavigateNextIcon fontSize="small" />} 
        aria-label="breadcrumb"
        sx={{ mb: 3 }}
      >
        <Link
          underline="hover"
          color="inherit"
          href="/dashboard"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          首页
        </Link>
        <Typography
          sx={{ display: 'flex', alignItems: 'center' }}
          color="text.primary"
        >
          <AnalyticsIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          学习分析
        </Typography>
      </Breadcrumbs>

      {/* 页面标题 */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          学习分析中心
        </Typography>
        <Typography variant="body1" color="text.secondary">
          全面了解您的学习进度、错误模式和表现趋势。基于数据分析的个性化学习建议将帮助您更高效地提升英语能力。
        </Typography>
      </Box>

      {/* 标签页导航 */}
      <TabContext value={activeTab}>
        <Paper elevation={0} variant="outlined" sx={{ borderRadius: 2, mb: 3 }}>
          <TabList 
            onChange={handleTabChange} 
            variant="fullWidth"
            sx={{ px: 2 }}
          >
            <Tab 
              icon={<TimelineIcon />} 
              label="学习进度" 
              value="progress" 
              iconPosition="start"
            />
            <Tab 
              icon={<ErrorIcon />} 
              label="错误分析" 
              value="errors" 
              iconPosition="start"
            />
            <Tab 
              icon={<LightbulbIcon />} 
              label="学习建议" 
              value="suggestions" 
              iconPosition="start"
              disabled
            />
          </TabList>
        </Paper>

        {/* 学习进度标签内容 */}
        <TabPanel value="progress" sx={{ px: 0 }}>
          <StudyProgressTracker 
            userId="user-123"
            onStartSession={(sessionId) => {
              console.log('开始学习会话:', sessionId);
              // 在实际应用中，这里会导航到学习页面
            }}
          />
        </TabPanel>

        {/* 错误分析标签内容 */}
        <TabPanel value="errors" sx={{ px: 0 }}>
          <ErrorPatternDetector 
            userId="user-123"
            timeRange="month"
            onSelectResource={(resourceId) => {
              console.log('选择资源:', resourceId);
              // 在实际应用中，这里会导航到对应的学习资源页面
            }}
          />
        </TabPanel>

        {/* 学习建议标签内容 */}
        <TabPanel value="suggestions" sx={{ px: 0 }}>
          <Paper
            elevation={0}
            variant="outlined"
            sx={{ 
              p: 4,
              borderRadius: 2, 
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 300
            }}
          >
            <LightbulbIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              个性化学习建议即将推出
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600 }}>
              我们正在开发更先进的学习建议系统，它将基于您的学习模式、错误类型和学习目标，提供高度个性化的学习路径和资源推荐。敬请期待！
            </Typography>
          </Paper>
        </TabPanel>
      </TabContext>
    </Container>
  );
} 