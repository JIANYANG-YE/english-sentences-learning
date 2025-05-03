import React from 'react';
import {
  Box, 
  Container, 
  Typography, 
  Paper, 
  Breadcrumbs
} from '@mui/material';
import Link from 'next/link';
import LearningWeaknessPredictor from '@/components/ai/LearningWeaknessPredictor';

export default function LearningWeaknessPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link href="/dashboard" passHref>
            <Typography color="inherit" sx={{ cursor: 'pointer' }}>
              控制台
            </Typography>
          </Link>
          <Link href="/ai-tools" passHref>
            <Typography color="inherit" sx={{ cursor: 'pointer' }}>
              AI工具
            </Typography>
          </Link>
          <Typography color="text.primary">学习弱点预测</Typography>
        </Breadcrumbs>
      </Paper>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          学习弱点预测分析
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          基于您的学习历史和行为模式，我们会预测可能影响您学习效果的潜在弱点，并提供针对性的改进建议。
        </Typography>
      </Box>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          学习弱点预测能帮您什么？
        </Typography>
        <Typography variant="body1" paragraph>
          我们的学习弱点预测系统使用先进的人工智能算法，分析您的学习行为、进度和表现，识别出可能影响您学习效率的关键弱点。
          通过这一工具，您可以：
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Box component="li" sx={{ mb: 1 }}>
            <Typography variant="body1">
              <strong>发现隐藏问题</strong> - 识别那些您可能没有注意到但正在影响学习进度的问题
            </Typography>
          </Box>
          <Box component="li" sx={{ mb: 1 }}>
            <Typography variant="body1">
              <strong>获取针对性建议</strong> - 接收专为您定制的改进策略和练习建议
            </Typography>
          </Box>
          <Box component="li" sx={{ mb: 1 }}>
            <Typography variant="body1">
              <strong>跟踪进步</strong> - 监控您的弱点是否正在改善，及时调整学习计划
            </Typography>
          </Box>
          <Box component="li">
            <Typography variant="body1">
              <strong>提高学习效率</strong> - 集中精力在最需要改进的领域，最大化学习投入回报
            </Typography>
          </Box>
        </Box>
      </Paper>

      <LearningWeaknessPredictor />
    </Container>
  );
} 