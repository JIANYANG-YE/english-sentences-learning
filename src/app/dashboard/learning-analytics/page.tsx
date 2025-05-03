'use client';

import React from 'react';
import { Box, Container, Paper, Typography, Breadcrumbs, Link } from '@mui/material';
import { NavigateNext, Dashboard } from '@mui/icons-material';
import PersonalLearningDashboard from '@/components/dashboard/PersonalLearningDashboard';

/**
 * 个性化学习分析页面
 * 提供用户的学习数据、趋势、强度和知识掌握地图的可视化展示
 */
export default function LearningAnalyticsPage() {
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
            学习分析
          </Typography>
        </Breadcrumbs>
        
        <Typography variant="h4" component="h1" gutterBottom>
          学习分析仪表盘
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          全面了解您的学习进度、趋势和知识掌握情况，获取个性化学习建议
        </Typography>
      </Box>
      
      {/* 个性化学习仪表盘组件 */}
      <Paper 
        elevation={0} 
        variant="outlined"
        sx={{ 
          borderRadius: 2,
          overflow: 'hidden',
          mb: 4
        }}
      >
        <PersonalLearningDashboard />
      </Paper>
      
      {/* 页脚说明 */}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
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
          本仪表盘数据基于您的学习行为和进度自动生成，每日更新
        </Typography>
      </Box>
    </Container>
  );
} 