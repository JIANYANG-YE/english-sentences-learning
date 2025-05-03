'use client';

import React from 'react';
import { 
  Box, 
  Typography, 
  Stepper, 
  Step, 
  StepLabel, 
  StepContent, 
  Paper, 
  Chip,
  LinearProgress
} from '@mui/material';

// 假设我们使用图标组件
const CheckCircleIcon = () => <span>✅</span>;
const AccessTimeIcon = () => <span>⏱️</span>;
const CalendarIcon = () => <span>📅</span>;

export interface LearningMilestone {
  id: string;
  date: string;
  title: string;
  description?: string;
  progress: number;
  isCompleted: boolean;
  duration?: number;
  type: 'lesson' | 'quiz' | 'assessment' | 'certificate';
}

interface LearningTimelineProps {
  milestones: LearningMilestone[];
  currentMilestoneId?: string;
  onMilestoneClick?: (milestone: LearningMilestone) => void;
  showDetailedView?: boolean;
}

const LearningTimeline: React.FC<LearningTimelineProps> = ({
  milestones,
  currentMilestoneId,
  onMilestoneClick,
  showDetailedView = false
}) => {
  // 查找当前里程碑的索引
  const activeStep = currentMilestoneId 
    ? milestones.findIndex(m => m.id === currentMilestoneId)
    : milestones.findIndex(m => !m.isCompleted);
  
  // 格式化日期显示
  const formatDate = (dateString: string) => {
    if (!dateString) return '未开始';
    const date = new Date(dateString);
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  };
  
  // 计算总体学习进度
  const totalProgress = milestones.length > 0 
    ? Math.round(milestones.filter(m => m.isCompleted).length / milestones.length * 100)
    : 0;
  
  // 获取里程碑类型对应的标签
  const getMilestoneTypeLabel = (type: string) => {
    switch (type) {
      case 'lesson': return '课程学习';
      case 'quiz': return '知识测验';
      case 'assessment': return '能力评估';
      case 'certificate': return '课程认证';
      default: return '学习活动';
    }
  };
  
  return (
    <Box sx={{ width: '100%', mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          学习进度
        </Typography>
        <Chip 
          icon={<CheckCircleIcon />} 
          label={`总进度: ${totalProgress}%`} 
          color={totalProgress === 100 ? "success" : "primary"} 
          variant="outlined"
        />
      </Box>
      
      <Box sx={{ mb: 2 }}>
        <LinearProgress 
          variant="determinate" 
          value={totalProgress} 
          sx={{ height: 8, borderRadius: 4 }}
        />
      </Box>
      
      <Stepper activeStep={activeStep} orientation="vertical">
        {milestones.map((milestone, index) => (
          <Step key={milestone.id} completed={milestone.isCompleted}>
            <StepLabel 
              optional={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                  <CalendarIcon />
                  <Typography variant="caption">
                    {formatDate(milestone.date)}
                  </Typography>
                  {milestone.duration && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <AccessTimeIcon />
                      <Typography variant="caption">
                        {milestone.duration}分钟
                      </Typography>
                    </Box>
                  )}
                </Box>
              }
            >
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  cursor: onMilestoneClick ? 'pointer' : 'default' 
                }}
                onClick={() => onMilestoneClick && onMilestoneClick(milestone)}
              >
                <Typography variant="subtitle1">
                  {milestone.title}
                </Typography>
                <Chip 
                  label={getMilestoneTypeLabel(milestone.type)} 
                  size="small" 
                  color={
                    milestone.type === 'certificate' ? "success" : 
                    milestone.type === 'assessment' ? "warning" : 
                    "default"
                  }
                  sx={{ ml: 1 }}
                />
              </Box>
            </StepLabel>
            
            {showDetailedView && (
              <StepContent>
                <Box sx={{ mb: 2 }}>
                  {milestone.description && (
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {milestone.description}
                    </Typography>
                  )}
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Box sx={{ width: '100%', mr: 1 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={milestone.progress} 
                        color={milestone.isCompleted ? "success" : "primary"}
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {Math.round(milestone.progress)}%
                    </Typography>
                  </Box>
                </Box>
                
                {index === activeStep && (
                  <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <Chip 
                      label="当前进度" 
                      color="primary" 
                      size="small"
                    />
                  </Box>
                )}
              </StepContent>
            )}
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default LearningTimeline; 