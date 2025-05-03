import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Breadcrumbs
} from '@mui/material';
import Link from 'next/link';
import LearningStyleAnalyzer from '@/components/ai/LearningStyleAnalyzer';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import SchoolIcon from '@mui/icons-material/School';

export default function LearningStylePage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ mb: 3, p: 2 }}>
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
          <Link href="/dashboard" style={{ textDecoration: 'none', color: 'inherit' }}>
            控制台
          </Link>
          <Link href="/ai-tools" style={{ textDecoration: 'none', color: 'inherit' }}>
            AI工具
          </Link>
          <Typography color="text.primary">学习风格分析</Typography>
        </Breadcrumbs>
      </Paper>
      
      <Box mb={4}>
        <Box display="flex" alignItems="center" mb={1}>
          <SchoolIcon fontSize="large" color="primary" sx={{ mr: 1 }} />
          <Typography variant="h4" component="h1" fontWeight="bold">
            学习风格分析
          </Typography>
        </Box>
        <Typography variant="subtitle1" color="text.secondary">
          了解您的学习风格偏好，获取个性化学习策略建议，提升学习效率
        </Typography>
      </Box>
      
      <Box mb={4}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>关于学习风格分析</Typography>
          <Typography paragraph>
            每个人都有不同的学习风格偏好，了解自己的学习风格可以帮助您选择最适合的学习方法，提高学习效率。
            我们的学习风格分析工具基于VARK模型，将学习风格分为视觉型、听觉型、读写型和动觉型四种类型。
          </Typography>
          <Typography paragraph>
            通过分析您的学习活动数据和学习偏好，我们可以识别您的主导学习风格，并提供个性化的学习策略建议，
            帮助您更有效地学习英语。
          </Typography>
          <Box component="ul" sx={{ pl: 2 }}>
            <Typography component="li">视觉型学习者 - 通过看到信息来学习最有效</Typography>
            <Typography component="li">听觉型学习者 - 通过听到信息来学习最有效</Typography>
            <Typography component="li">读写型学习者 - 通过文字来学习最有效</Typography>
            <Typography component="li">动觉型学习者 - 通过动手实践来学习最有效</Typography>
          </Box>
        </Paper>
      </Box>
      
      <LearningStyleAnalyzer />
    </Container>
  );
} 