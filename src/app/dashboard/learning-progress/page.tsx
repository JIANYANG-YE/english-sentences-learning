'use client';

import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Breadcrumbs, 
  Link,
  Paper,
  Alert,
  Button
} from '@mui/material';
import { 
  NavigateNext, 
  Dashboard, 
  Timeline,
  Share as ShareIcon
} from '@mui/icons-material';
import LearningProgressTracker from '@/components/learning/LearningProgressTracker';

/**
 * 学习进度追踪页面
 * 展示用户的学习进度、里程碑和技能掌握等级
 */
export default function LearningProgressPage() {
  // 模拟用户ID
  const userId = "current-user-id";
  
  // 处理里程碑更新
  const handleMilestoneUpdated = (milestoneId: string, completed: boolean) => {
    console.log(`里程碑 ${milestoneId} 已${completed ? '完成' : '取消完成'}`);
    // 实际应用中应调用API更新里程碑状态
  };
  
  // 分享进度处理
  const handleShareProgress = () => {
    console.log('分享学习进度');
    // 实际应用中应实现社交分享功能
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* 页面标题和面包屑导航 */}
      <Box sx={{ mb: 3 }}>
        <Breadcrumbs 
          separator={<NavigateNext fontSize="small" />} 
          aria-label="breadcrumb"
          sx={{ mb: 2 }}
        >
          <Link
            color="inherit"
            href="/dashboard"
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <Dashboard sx={{ mr: 0.5 }} fontSize="small" />
            仪表盘
          </Link>
          <Typography 
            color="text.primary"
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <Timeline sx={{ mr: 0.5 }} fontSize="small" />
            学习进度
          </Typography>
        </Breadcrumbs>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              学习进度追踪
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              追踪您的学习旅程、里程碑和技能掌握情况
            </Typography>
          </Box>
          
          <Button 
            variant="outlined" 
            startIcon={<ShareIcon />}
            onClick={handleShareProgress}
            sx={{ mt: { xs: 2, sm: 0 } }}
          >
            分享我的进度
          </Button>
        </Box>
      </Box>
      
      {/* 进度摘要提示 */}
      <Alert 
        severity="info" 
        sx={{ mb: 4 }}
        action={
          <Button color="inherit" size="small">
            详情
          </Button>
        }
      >
        您已经完成了学习计划的65%，比预期进度超前了8%。继续保持！
      </Alert>
      
      {/* 学习进度追踪器组件 */}
      <Paper 
        variant="outlined" 
        sx={{ borderRadius: 2, overflow: 'hidden', mb: 4 }}
      >
        <Box sx={{ p: { xs: 2, md: 3 } }}>
          <LearningProgressTracker 
            userId={userId}
            onMilestoneUpdated={handleMilestoneUpdated}
          />
        </Box>
      </Paper>
      
      {/* 页脚提示 */}
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="body2" color="text.secondary">
          数据更新时间: {new Date().toLocaleString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
          学习进度会根据您的学习活动自动更新，每日学习结束后会进行同步
        </Typography>
      </Box>
    </Container>
  );
} 