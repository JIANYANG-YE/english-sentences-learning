import React from 'react';
import { Container, Box, Typography, Tabs, Tab, Paper, Grid, Button } from '@mui/material';
import AchievementCenter from '@/components/progress/AchievementCenter';

export default function LearningProgressPage() {
  return (
    <Container maxWidth="lg">
      <Box py={4}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          学习进度与成就
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          跟踪你的学习历程，查看已获得的成就和可兑换的奖励
        </Typography>
        
        <Paper sx={{ p: 0, mt: 3 }}>
          <AchievementCenter userId="current-user" />
        </Paper>
        
        <Box mt={4} display="flex" justifyContent="center">
          <Button variant="contained" color="primary">
            继续学习
          </Button>
        </Box>
      </Box>
    </Container>
  );
} 