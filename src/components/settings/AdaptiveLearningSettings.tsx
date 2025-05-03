'use client';

import React, { useEffect, useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  FormControl, 
  FormControlLabel, 
  RadioGroup, 
  Radio, 
  Slider, 
  Switch, 
  Box,
  Button,
  Divider,
  Alert,
  Chip,
  Tooltip,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import SpeedIcon from '@mui/icons-material/Speed';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';

import { 
  adaptiveLearningService, 
  DifficultyLevel, 
  LearnerProfile 
} from '@/services/adaptiveLearningService';

interface AdaptiveLearningSettingsProps {
  userId: string;
  onSettingsChange?: (profile: LearnerProfile) => void;
}

/**
 * 自适应学习设置组件，允许用户配置难度偏好和学习速度等选项
 */
export default function AdaptiveLearningSettings({ 
  userId, 
  onSettingsChange 
}: AdaptiveLearningSettingsProps) {
  const [profile, setProfile] = useState<LearnerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [difficultyValue, setDifficultyValue] = useState<number>(3);
  const [adaptiveModeEnabled, setAdaptiveModeEnabled] = useState(true);
  const [learningSpeed, setLearningSpeed] = useState<'slow' | 'normal' | 'fast'>('normal');
  const [showSuccess, setShowSuccess] = useState(false);
  
  // 加载用户配置
  useEffect(() => {
    try {
      const userProfile = adaptiveLearningService.getLearnerProfile(userId);
      setProfile(userProfile);
      setDifficultyValue(userProfile.preferredDifficulty);
      setAdaptiveModeEnabled(userProfile.adaptiveMode);
      setLearningSpeed(userProfile.learningSpeed);
    } catch (error) {
      console.error('加载自适应学习配置时出错:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);
  
  // 保存设置更改
  const saveSettings = () => {
    if (!profile) return;
    
    try {
      adaptiveLearningService.updateLearnerPreferences(userId, {
        preferredDifficulty: difficultyValue as DifficultyLevel,
        adaptiveMode: adaptiveModeEnabled,
        learningSpeed: learningSpeed
      });
      
      // 重新获取更新后的配置
      const updatedProfile = adaptiveLearningService.getLearnerProfile(userId);
      setProfile(updatedProfile);
      
      // 触发外部回调
      if (onSettingsChange) {
        onSettingsChange(updatedProfile);
      }
      
      // 显示成功消息
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('保存学习设置时出错:', error);
    }
  };
  
  // 重置配置到默认值
  const resetSettings = () => {
    if (confirm('确定要将所有设置重置为默认值吗？')) {
      adaptiveLearningService.resetLearnerProfile(userId);
      const defaultProfile = adaptiveLearningService.getLearnerProfile(userId);
      setProfile(defaultProfile);
      setDifficultyValue(defaultProfile.preferredDifficulty);
      setAdaptiveModeEnabled(defaultProfile.adaptiveMode);
      setLearningSpeed(defaultProfile.learningSpeed);
      
      if (onSettingsChange) {
        onSettingsChange(defaultProfile);
      }
    }
  };
  
  // 渲染难度标签文本
  const getDifficultyLabel = (value: number): string => {
    switch (value) {
      case 1: return '非常简单';
      case 2: return '简单';
      case 3: return '中等';
      case 4: return '困难';
      case 5: return '非常困难';
      default: return '中等';
    }
  };
  
  // 渲染难度滑块标记
  const difficultyMarks = [
    { value: 1, label: '非常简单' },
    { value: 2, label: '简单' },
    { value: 3, label: '中等' },
    { value: 4, label: '困难' },
    { value: 5, label: '非常困难' },
  ];
  
  if (loading) {
    return (
      <Card variant="outlined" sx={{ minWidth: 275, my: 2 }}>
        <CardContent>
          <Typography>加载学习设置中...</Typography>
        </CardContent>
      </Card>
    );
  }
  
  // 用户的困难和强项领域
  const areaSummary = adaptiveLearningService.getLearnerAreaSummary(userId);
  
  return (
    <Card variant="outlined" sx={{ minWidth: 275, my: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <AutoFixHighIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h5" component="div" gutterBottom>
            自适应学习设置
          </Typography>
        </Box>
        
        {showSuccess && (
          <Alert severity="success" sx={{ mb: 2 }}>
            设置已成功保存
          </Alert>
        )}
        
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography id="difficulty-slider" gutterBottom>
              内容难度偏好
            </Typography>
            <Tooltip title="设置你偏好的内容难度级别。如果启用自适应模式，系统会在此基础上根据你的表现进行调整">
              <InfoIcon fontSize="small" color="action" sx={{ ml: 1 }} />
            </Tooltip>
          </Box>
          
          <Slider
            value={difficultyValue}
            onChange={(_, newValue) => setDifficultyValue(newValue as number)}
            step={1}
            marks={difficultyMarks}
            min={1}
            max={5}
            valueLabelDisplay="auto"
            valueLabelFormat={getDifficultyLabel}
            aria-labelledby="difficulty-slider"
          />
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography component="div" gutterBottom>
              自适应模式
            </Typography>
            <Tooltip title="启用后，系统会根据你的学习表现自动调整内容难度">
              <InfoIcon fontSize="small" color="action" sx={{ ml: 1 }} />
            </Tooltip>
          </Box>
          
          <FormControlLabel
            control={
              <Switch
                checked={adaptiveModeEnabled}
                onChange={(e) => setAdaptiveModeEnabled(e.target.checked)}
                color="primary"
              />
            }
            label={adaptiveModeEnabled ? "已启用" : "已禁用"}
          />
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <SpeedIcon fontSize="small" sx={{ mr: 1 }} />
            <Typography component="div" gutterBottom>
              学习速度偏好
            </Typography>
            <Tooltip title="设置你的学习速度偏好，影响进度调整的速率">
              <InfoIcon fontSize="small" color="action" sx={{ ml: 1 }} />
            </Tooltip>
          </Box>
          
          <FormControl component="fieldset">
            <RadioGroup
              row
              value={learningSpeed}
              onChange={(e) => setLearningSpeed(e.target.value as 'slow' | 'normal' | 'fast')}
            >
              <FormControlLabel 
                value="slow" 
                control={<Radio />} 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TrendingDownIcon fontSize="small" sx={{ mr: 0.5 }} color="info" />
                    <span>较慢</span>
                  </Box>
                }
              />
              <FormControlLabel 
                value="normal" 
                control={<Radio />} 
                label="正常"
              />
              <FormControlLabel 
                value="fast" 
                control={<Radio />} 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TrendingUpIcon fontSize="small" sx={{ mr: 0.5 }} color="error" />
                    <span>较快</span>
                  </Box>
                }
              />
            </RadioGroup>
          </FormControl>
          
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {learningSpeed === 'slow' && "较慢学习速度会减缓难度提升的速率，给你更多时间巩固知识点"}
            {learningSpeed === 'normal' && "正常学习速度提供平衡的学习体验"}
            {learningSpeed === 'fast' && "较快学习速度会加快难度提升的速率，适合已有一定基础的学习者"}
          </Typography>
        </Box>
        
        <Divider sx={{ my: 3 }} />
        
        {profile && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              学习统计
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                技能水平:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {Object.entries(profile.skillLevels).map(([skill, level]) => (
                  <Tooltip key={skill} title={`${level}/100`}>
                    <Chip
                      label={`${skill}: ${level}`}
                      size="small"
                      variant="outlined"
                      color={level >= 75 ? "success" : level >= 50 ? "primary" : "default"}
                    />
                  </Tooltip>
                ))}
              </Box>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                强项领域:
              </Typography>
              {areaSummary.strengths.length > 0 ? (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {areaSummary.strengths.map((strength) => (
                    <Chip key={strength} label={strength} size="small" color="success" />
                  ))}
                </Box>
              ) : (
                <Typography variant="body2">尚未记录强项领域</Typography>
              )}
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                需要改进的领域:
              </Typography>
              {areaSummary.struggles.length > 0 ? (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {areaSummary.struggles.map((struggle) => (
                    <Chip key={struggle} label={struggle} size="small" color="warning" />
                  ))}
                </Box>
              ) : (
                <Typography variant="body2">尚未记录需改进领域</Typography>
              )}
            </Box>
          </Box>
        )}
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button variant="outlined" color="error" onClick={resetSettings}>
            重置为默认值
          </Button>
          <Button variant="contained" color="primary" onClick={saveSettings}>
            保存设置
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
} 