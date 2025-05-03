import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Slider,
  Step,
  StepLabel,
  Stepper,
  Switch,
  TextField,
  Typography,
  useTheme
} from '@mui/material';
import {
  AccessTime,
  Add,
  BookmarkBorder,
  CalendarMonth,
  CheckCircle,
  Close,
  Edit,
  ExpandMore,
  Extension,
  Flag,
  Info,
  InvertColors,
  KeyboardArrowRight,
  LibraryBooks,
  NavigateNext,
  Psychology,
  SaveAlt,
  Schedule,
  School,
  Settings,
  Speed,
  StarBorder,
  Visibility
} from '@mui/icons-material';

// 模拟服务
import { learningPlanService } from '@/services/learningPlanService';

// 模拟用户ID
const MOCK_USER_ID = 'user-123';

/**
 * 智能学习计划生成器
 * 根据用户水平、可用时间和学习目标生成个性化学习计划
 */
const SmartLearningPlanGenerator: React.FC = () => {
  const theme = useTheme();
  
  // 步骤状态
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // 学习目标设置
  const [selectedGoal, setSelectedGoal] = useState<string>('');
  const [goalDetails, setGoalDetails] = useState<{
    timeframe: string;
    target: number;
    difficulty: number;
  }>({
    timeframe: 'month',
    target: 100,
    difficulty: 2
  });
  
  // 时间偏好设置
  const [timePreferences, setTimePreferences] = useState<{
    totalHoursPerWeek: number;
    preferredDays: string[];
    preferredTimeOfDay: string;
    sessionLength: number;
  }>({
    totalHoursPerWeek: 5,
    preferredDays: ['周一', '周三', '周五', '周日'],
    preferredTimeOfDay: 'evening',
    sessionLength: 30
  });
  
  // 内容偏好设置
  const [contentPreferences, setContentPreferences] = useState<{
    preferredTopics: string[];
    includeSpeaking: boolean;
    includeWriting: boolean;
    reviewFrequency: string;
  }>({
    preferredTopics: ['日常会话', '商务英语'],
    includeSpeaking: true,
    includeWriting: true,
    reviewFrequency: 'high'
  });
  
  // 生成的学习计划
  const [learningPlan, setLearningPlan] = useState<any>(null);
  
  // 处理步骤导航
  const handleNext = () => {
    if (activeStep === 2) {
      generatePlan();
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };
  
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };
  
  // 生成学习计划
  const generatePlan = async () => {
    setLoading(true);
    try {
      const planSettings = {
        userId: MOCK_USER_ID,
        goalDetails,
        timePreferences,
        contentPreferences
      };
      
      const generatedPlan = await learningPlanService.generatePersonalizedPlan(planSettings);
      setLearningPlan(generatedPlan);
      setActiveStep(3); // 进入结果步骤
    } catch (error) {
      console.error('生成学习计划失败:', error);
      // 显示错误提示
    } finally {
      setLoading(false);
    }
  };
  
  // 步骤内容渲染
  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              设定您的学习目标
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              选择一个学习目标，我们将帮助您创建个性化的学习计划。
            </Typography>
            
            {/* 目标设置表单 将在后续迭代中完善 */}
            <Typography variant="body2" color="primary" sx={{ mt: 2 }}>
              目标设置表单将在这里展示
            </Typography>
          </Box>
        );
      
      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              设置您的学习时间偏好
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              告诉我们您可用的学习时间，以便为您安排最佳学习计划。
            </Typography>
            
            {/* 时间偏好设置表单 将在后续迭代中完善 */}
            <Typography variant="body2" color="primary" sx={{ mt: 2 }}>
              时间偏好设置表单将在这里展示
            </Typography>
          </Box>
        );
      
      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              选择您喜欢的学习内容
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              根据您的兴趣和学习偏好，为您推荐合适的学习内容。
            </Typography>
            
            {/* 内容偏好设置表单 将在后续迭代中完善 */}
            <Typography variant="body2" color="primary" sx={{ mt: 2 }}>
              内容偏好设置表单将在这里展示
            </Typography>
          </Box>
        );
      
      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              您的个性化学习计划已生成
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              根据您的目标、时间和内容偏好，我们为您创建了以下学习计划。
            </Typography>
            
            {/* 学习计划结果展示 将在后续迭代中完善 */}
            <Typography variant="body2" color="primary" sx={{ mt: 2 }}>
              学习计划展示将在这里显示
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<SaveAlt />}
              >
                保存此计划
              </Button>
            </Box>
          </Box>
        );
      
      default:
        return null;
    }
  };
  
  // 主要渲染
  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Paper 
        elevation={0} 
        variant="outlined"
        sx={{ borderRadius: 2, overflow: 'hidden', mb: 4 }}
      >
        <Box sx={{ p: 3, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
          <Typography variant="h5" component="h1">
            智能学习计划生成器
          </Typography>
          <Typography variant="subtitle1">
            根据您的学习目标和时间安排，创建个性化学习路径
          </Typography>
        </Box>
        
        <Box sx={{ p: 3 }}>
          {/* 步骤导航 */}
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            <Step>
              <StepLabel>设定目标</StepLabel>
            </Step>
            <Step>
              <StepLabel>时间安排</StepLabel>
            </Step>
            <Step>
              <StepLabel>内容偏好</StepLabel>
            </Step>
            <Step>
              <StepLabel>生成计划</StepLabel>
            </Step>
          </Stepper>
          
          {/* 步骤内容 */}
          {loading ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
              <CircularProgress size={60} sx={{ mb: 2 }} />
              <Typography variant="h6">正在生成您的个性化学习计划...</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                我们正在分析您的学习偏好和目标，这可能需要几秒钟时间
              </Typography>
            </Box>
          ) : (
            <Box sx={{ minHeight: '300px' }}>
              {renderStepContent()}
            </Box>
          )}
          
          {/* 步骤控制按钮 */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              variant="outlined"
              onClick={handleBack}
              disabled={activeStep === 0 || activeStep === 3}
            >
              上一步
            </Button>
            
            {activeStep < 3 && (
              <Button
                variant="contained"
                onClick={handleNext}
                endIcon={activeStep === 2 ? <CheckCircle /> : <NavigateNext />}
              >
                {activeStep === 2 ? '生成计划' : '下一步'}
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default SmartLearningPlanGenerator; 