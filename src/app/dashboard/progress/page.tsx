import React from 'react';
import { Box, Typography, Tabs, Tab, Card, CardContent, Divider } from '@mui/material';
import { 
  Timeline as TimelineIcon,
  EmojiEvents as TrophyIcon,
  LocalLibrary as BookIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';
import LearningHabitAnalyzer from '@/components/progress/LearningHabitAnalyzer';
import AchievementCenter from '@/components/progress/AchievementCenter';

// 这将在服务器端渲染
export default function ProgressPage() {
  return (
    <Box sx={{ py: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          学习进度与成就
        </Typography>
        <Typography variant="body1" color="text.secondary">
          跟踪您的学习旅程，查看习惯分析并解锁成就徽章
        </Typography>
      </Box>
      
      <Box sx={{ width: '100%' }}>
        {/* 客户端组件将在这里渲染 */}
        <ProgressTabs />
      </Box>
    </Box>
  );
}

// 使用客户端组件处理交互逻辑
'use client';

function ProgressTabs() {
  const [activeTab, setActiveTab] = React.useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <>
      <Card sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab icon={<TimelineIcon />} label="学习习惯分析" />
          <Tab icon={<TrophyIcon />} label="学习成就" />
        </Tabs>
      </Card>

      <Box sx={{ mt: 2 }}>
        {activeTab === 0 && (
          <Box>
            <LearningHabitAnalyzer userId="current-user" />
          </Box>
        )}
        
        {activeTab === 1 && (
          <Box>
            <AchievementCenter userId="current-user" />
          </Box>
        )}
      </Box>
    </>
  );
} 