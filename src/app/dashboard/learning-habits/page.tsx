'use client';

import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent,
  IconButton,
  Breadcrumbs,
  Link,
  Divider,
  Paper,
  Tooltip,
  Button
} from '@mui/material';
import { 
  Home as HomeIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  Print as PrintIcon,
  Help as HelpIcon
} from '@mui/icons-material';
import LearningHabitAnalyzer from '@/components/learning/LearningHabitAnalyzer';

const LearningHabitsPage = () => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  
  const handlePrintReport = () => {
    window.print();
  };
  
  const handleDownloadReport = () => {
    // 模拟下载报告功能
    alert('报告下载功能即将上线');
  };
  
  const handleShareReport = () => {
    // 模拟分享报告功能
    alert('报告分享功能即将上线');
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box mb={4}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link 
            underline="hover" 
            color="inherit" 
            href="/dashboard" 
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            主页
          </Link>
          <Typography color="text.primary">学习习惯分析</Typography>
        </Breadcrumbs>
      </Box>
      
      <Box mb={4} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" component="h1">
          学习习惯分析
        </Typography>
        <Box>
          <Tooltip title="下载报告">
            <IconButton onClick={handleDownloadReport}>
              <DownloadIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="分享报告">
            <IconButton onClick={handleShareReport}>
              <ShareIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="打印报告">
            <IconButton onClick={handlePrintReport}>
              <PrintIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="帮助">
            <IconButton>
              <HelpIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              bgcolor: 'primary.main', 
              color: 'primary.contrastText',
              borderRadius: 2 
            }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={8}>
                <Typography variant="h5" gutterBottom>
                  通过分析您的学习习惯，优化您的学习效率
                </Typography>
                <Typography variant="body1">
                  我们分析您的学习时间分布、学习频率和学习效果，帮助您了解自己的学习习惯模式，
                  并提供个性化的建议以提高学习效率。
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4} sx={{ textAlign: 'center' }}>
                <Box
                  component="img"
                  src="/images/habits-analysis.svg"
                  alt="学习习惯分析"
                  sx={{ 
                    width: '80%', 
                    maxWidth: 200,
                    display: { xs: 'none', sm: 'inline-block' } 
                  }}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        <Grid item xs={12}>
          <LearningHabitAnalyzer 
            userId="current-user" 
            timeRange={timeRange}
            onChangeTimeRange={setTimeRange}
          />
        </Grid>
        
        <Grid item xs={12}>
          <Paper elevation={0} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              为什么学习习惯分析很重要？
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" color="primary" gutterBottom>
                      发现最佳学习时间
                    </Typography>
                    <Typography variant="body2">
                      每个人都有自己的黄金学习时段，分析可以帮助您找到最适合您的学习时间，
                      在精力最充沛的时刻安排重要的学习任务。
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" color="primary" gutterBottom>
                      建立持续的学习习惯
                    </Typography>
                    <Typography variant="body2">
                      研究表明，持续的学习比集中突击更有效。通过分析您的学习模式，
                      我们可以帮助您建立规律的学习习惯，提高学习的长期效果。
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" color="primary" gutterBottom>
                      优化学习策略
                    </Typography>
                    <Typography variant="body2">
                      根据您的学习数据，我们可以识别哪些学习策略最适合您，
                      帮助您调整学习方法，提高效率和记忆保留率。
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            
            <Box display="flex" justifyContent="center" mt={4}>
              <Button 
                variant="outlined" 
                size="large"
                href="/dashboard/learning-plan"
              >
                生成个性化学习计划
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default LearningHabitsPage; 