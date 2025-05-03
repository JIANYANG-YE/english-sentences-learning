'use client';

import React from 'react';
import { Box, Container, Typography, Breadcrumbs, Link, Paper } from '@mui/material';
import { NavigateNext, Dashboard, Timeline } from '@mui/icons-material';
import SmartLearningPlanGenerator from '@/components/learning/SmartLearningPlanGenerator';

/**
 * 智能学习计划生成器页面
 * 允许用户创建个性化的学习计划
 */
export default function LearningPlanPage() {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* 页面标题和面包屑导航 */}
      <Box sx={{ mb: 4 }}>
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
          <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
            <Timeline sx={{ mr: 0.5 }} fontSize="small" />
            学习计划生成器
          </Typography>
        </Breadcrumbs>
        
        <Typography variant="h4" component="h1" gutterBottom>
          智能学习计划生成器
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          创建符合您学习目标、时间安排和内容偏好的个性化学习路径
        </Typography>
      </Box>
      
      {/* 智能学习计划生成器组件 */}
      <SmartLearningPlanGenerator />
      
      {/* 页脚提示信息 */}
      <Paper 
        elevation={0} 
        variant="outlined" 
        sx={{ 
          mt: 4, 
          p: 2, 
          borderRadius: 2,
          bgcolor: 'info.main',
          color: 'info.contrastText'
        }}
      >
        <Typography variant="body2">
          <strong>提示：</strong> 
          智能学习计划会根据您的学习进度和反馈自动调整。您可以随时修改或重新生成学习计划。
        </Typography>
      </Paper>
    </Container>
  );
} 