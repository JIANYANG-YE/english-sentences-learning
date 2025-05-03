import React from 'react';
import LearningAnalyzer from '@/components/analytics/LearningAnalyzer';
import { Box, Container, Typography, Breadcrumbs, Link, Paper } from '@mui/material';
import { Home as HomeIcon, Analytics as AnalyticsIcon } from '@mui/icons-material';

export default function AnalyticsPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          <Link
            underline="hover"
            color="inherit"
            href="/"
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
        
        <Typography variant="h4" component="h1" gutterBottom>
          学习分析中心
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          深入了解您的学习数据，发现学习模式，突破瓶颈，优化学习效率。
        </Typography>
      </Box>
      
      <LearningAnalyzer 
        userId="current-user" 
        timeRange="month"
        onSelectResource={(resource) => {
          console.log('Selected resource:', resource);
          // 在实际应用中，这里应该导航到相应的资源页面
        }}
        onStartSession={(sessionId) => {
          console.log('Started session:', sessionId);
          // 在实际应用中，这里应该启动一个新的学习会话
        }}
      />
      
      <Box sx={{ mt: 6, mb: 2 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            数据驱动学习
          </Typography>
          <Typography variant="body2" paragraph>
            学习分析使用您的学习活动数据来提供见解和建议，帮助您更有效地学习。我们跟踪您的学习时间、内容交互、错误模式和进度，以生成个性化的分析结果。
          </Typography>
          <Typography variant="body2">
            所有数据都在严格的隐私保护下处理，仅用于改善您的学习体验。您可以随时在账户设置中查看和管理您的数据使用偏好。
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
} 