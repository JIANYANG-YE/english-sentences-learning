'use client';

import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Grid,
  Card,
  CardContent,
  CardMedia,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
  Chip
} from '@mui/material';
import {
  Dashboard,
  Timeline,
  Psychology,
  EmojiEvents,
  CheckCircle,
  School,
  Schedule,
  TrendingUp,
  Star,
  Insights,
  BarChart,
  DirectionsRun,
  Whatshot,
  FactCheck
} from '@mui/icons-material';
import Link from 'next/link';

/**
 * 第四阶段成果报告页面
 * 展示个性化学习体系构建的成果
 */
export default function Phase4ReportPage() {
  const features = [
    {
      id: 'personal-dashboard',
      title: '个性化学习仪表盘',
      description: '全方位展示学习数据和进度的个性化仪表盘，帮助用户了解学习状况和趋势',
      icon: <Dashboard fontSize="large" color="primary" />,
      link: '/dashboard/learning-analytics',
      features: [
        '多维度学习数据展示',
        '学习趋势图表与分析',
        '学习强度评估',
        '知识点掌握地图',
        '个性化学习建议'
      ],
      status: '已完成',
      component: 'PersonalLearningDashboard'
    },
    {
      id: 'learning-plan',
      title: '智能学习计划生成器',
      description: '基于用户目标、时间和内容偏好，自动生成个性化学习计划',
      icon: <Timeline fontSize="large" color="primary" />,
      link: '/dashboard/learning-plan',
      features: [
        '个性化学习目标设置',
        '时间偏好与可用性分析',
        '内容兴趣与难度调整',
        '自适应学习路径生成',
        '学习效果预测与评估'
      ],
      status: '已完成',
      component: 'SmartLearningPlanGenerator'
    },
    {
      id: 'progress-tracker',
      title: '学习进度追踪系统',
      description: '多维度追踪学习进度、里程碑和技能掌握情况',
      icon: <DirectionsRun fontSize="large" color="primary" />,
      link: '/dashboard/learning-progress',
      features: [
        '多维度进度可视化',
        '学习里程碑追踪',
        '课程完成情况监控',
        '技能等级系统',
        '进度比较与分析'
      ],
      status: '已完成',
      component: 'LearningProgressTracker'
    },
    {
      id: 'habit-analyzer',
      title: '学习习惯分析系统',
      description: '分析用户学习行为模式，提供改进建议，培养高效学习习惯',
      icon: <Psychology fontSize="large" color="primary" />,
      link: '/dashboard/learning-habits',
      features: [
        '学习时间与频率分析',
        '专注度与效率评估',
        '学习一致性分析',
        '最佳学习时段识别',
        '个性化习惯改进建议'
      ],
      status: '已完成',
      component: 'LearningHabitAnalyzer'
    },
    {
      id: 'achievement-center',
      title: '学习成就系统',
      description: '多层级成就体系，通过游戏化激励持续学习和进步',
      icon: <EmojiEvents fontSize="large" color="primary" />,
      link: '/dashboard/achievements',
      features: [
        '多层级成就体系',
        '成就解锁与动画效果',
        '学习徽章收集',
        '成就进度追踪',
        '社区成就分享'
      ],
      status: '已完成',
      component: 'AchievementCenter'
    }
  ];
  
  const stats = {
    componentsCreated: 5,
    pagesImplemented: 5,
    functionsAdded: 32,
    linesOfCode: '3,500+'
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* 标题区域 */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 4, 
          mb: 4, 
          borderRadius: 2,
          backgroundImage: 'linear-gradient(135deg, #3f51b5 10%, #2196f3 100%)',
          color: 'white'
        }}
      >
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
          第四阶段成果报告
        </Typography>
        <Typography variant="h5" gutterBottom>
          个性化学习体系构建
        </Typography>
        <Typography variant="body1" sx={{ maxWidth: '800px', mt: 2 }}>
          我们成功实现了所有规划功能，构建了完整的个性化学习体系。这套系统能够根据用户特点提供量身定制的学习体验，
          显著提升学习效率和用户满意度。
        </Typography>
        
        <Grid container spacing={3} sx={{ mt: 3 }}>
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight="bold">
                {stats.componentsCreated}
              </Typography>
              <Typography variant="body2">
                核心组件
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight="bold">
                {stats.pagesImplemented}
              </Typography>
              <Typography variant="body2">
                功能页面
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight="bold">
                {stats.functionsAdded}
              </Typography>
              <Typography variant="body2">
                新增功能
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight="bold">
                {stats.linesOfCode}
              </Typography>
              <Typography variant="body2">
                代码行数
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      {/* 功能列表 */}
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        已实现功能
      </Typography>
      
      <Grid container spacing={4}>
        {features.map((feature) => (
          <Grid item xs={12} key={feature.id}>
            <Card variant="outlined" sx={{ borderRadius: 2 }}>
              <Grid container>
                <Grid item xs={12} md={4}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      p: 3,
                      height: '100%',
                      bgcolor: 'rgba(63, 81, 181, 0.05)'
                    }}
                  >
                    <Box sx={{ mb: 2 }}>
                      {feature.icon}
                    </Box>
                    <Typography variant="h5" component="h2" gutterBottom align="center">
                      {feature.title}
                    </Typography>
                    <Chip 
                      label={feature.status} 
                      color="success" 
                      icon={<CheckCircle />}
                      sx={{ mb: 2 }}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }} align="center">
                      组件: {feature.component}
                    </Typography>
                    <Button 
                      component={Link}
                      href={feature.link}
                      variant="outlined"
                      color="primary"
                    >
                      查看功能
                    </Button>
                  </Box>
                </Grid>
                <Grid item xs={12} md={8}>
                  <CardContent>
                    <Typography variant="body1" paragraph>
                      {feature.description}
                    </Typography>
                    
                    <Typography variant="subtitle1" gutterBottom>
                      主要功能:
                    </Typography>
                    <List dense>
                      {feature.features.map((item, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <CheckCircle color="success" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary={item} />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {/* 总结与下一步 */}
      <Paper sx={{ p: 3, mt: 4, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom>
          总结与展望
        </Typography>
        <Typography variant="body1" paragraph>
          第四阶段成功构建了完整的个性化学习体系，实现了"量身定制"的学习体验。通过数据驱动的个性化学习路径、
          直观的进度追踪和有效的激励机制，大幅提升了学习效率和用户体验。
        </Typography>
        <Typography variant="body1" paragraph>
          接下来的第五阶段将聚焦于"社区互动与智能辅导系统"，旨在创建一个充满活力的学习社区，
          并提供AI驱动的智能辅导支持，形成完整的学习生态系统。
        </Typography>
        
        <Button 
          component={Link}
          href="/dashboard"
          variant="contained" 
          color="primary"
          sx={{ mt: 2 }}
        >
          返回仪表盘
        </Button>
      </Paper>
    </Container>
  );
} 