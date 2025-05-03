import React from 'react';
import IntelligentAssistant from '@/components/ai/IntelligentAssistant';
import { Box, Typography, Breadcrumbs, Link, Paper } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import PsychologyIcon from '@mui/icons-material/Psychology';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

export default function AIAssistantPage() {
  // 模拟用户学习档案数据
  const userLearningProfile = {
    level: 'intermediate' as const,
    interests: ['旅行', '商务', '日常对话'],
    goals: ['流利口语', '阅读理解能力提升'],
    preferredLearningStyle: 'visual' as const
  };
  
  return (
    <Box sx={{ py: 3, height: 'calc(100vh - 80px)' }}>
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
          <PsychologyIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          AI智能助手
        </Typography>
      </Breadcrumbs>
      
      {/* 简短介绍 */}
      <Paper
        elevation={0}
        variant="outlined"
        sx={{ p: 2, mb: 3, borderRadius: 2 }}
      >
        <Typography variant="h6" gutterBottom>
          欢迎使用智能学习助手
        </Typography>
        <Typography variant="body2" color="text.secondary">
          智能学习助手整合了AI对话辅导、个性化学习建议、错误模式分析等多项功能，帮助您更高效地学习英语。选择左侧的学习工具开始使用，或点击上方标签切换不同功能。
        </Typography>
      </Paper>
      
      {/* 智能助手组件 */}
      <Box sx={{ height: 'calc(100% - 120px)' }}>
        <IntelligentAssistant 
          userId="user-123"
          learningProfile={userLearningProfile}
        />
      </Box>
    </Box>
  );
} 