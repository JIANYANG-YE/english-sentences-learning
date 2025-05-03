import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  LinearProgress, 
  Divider, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Button,
  useTheme,
  Collapse,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Timeline as TimelineIcon,
  Group as GroupIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
  ExpandMore as ExpandMoreIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import ReputationBadge from './ReputationBadge';
import { ReputationLevel, ReputationChangeType } from '../../services/communityReputationService';

// 声誉显示组件属性
export interface ReputationDisplayProps {
  userId: string;
  currentScore: number;
  level: ReputationLevel;
  nextLevelScore: number;
  progressToNextLevel: number;
  recentChanges?: ReputationChange[];
  privileges?: Privilege[];
  showHistory?: boolean;
}

// 声誉变更记录
export interface ReputationChange {
  id: string;
  date: Date;
  type: ReputationChangeType;
  amount: number;
  description: string;
}

// 权限定义
export interface Privilege {
  id: string;
  name: string;
  description: string;
  requiredLevel: ReputationLevel;
  unlocked: boolean;
}

/**
 * 用户声誉显示组件
 * 展示用户的声誉等级、进度和历史
 */
const ReputationDisplay: React.FC<ReputationDisplayProps> = ({
  userId,
  currentScore,
  level,
  nextLevelScore,
  progressToNextLevel,
  recentChanges = [],
  privileges = [],
  showHistory = true
}) => {
  const theme = useTheme();
  const [historyExpanded, setHistoryExpanded] = useState(false);
  const [privilegesExpanded, setPrivilegesExpanded] = useState(false);
  
  // 计算当前等级分数段的起点
  const getCurrentLevelMinScore = () => {
    switch (level) {
      case ReputationLevel.NEWCOMER:
        return 0;
      case ReputationLevel.LEARNER:
        return 100;
      case ReputationLevel.CONTRIBUTOR:
        return 500;
      case ReputationLevel.MENTOR:
        return 2000;
      case ReputationLevel.EXPERT:
        return 5000;
      default:
        return 0;
    }
  };
  
  // 计算历史趋势（正面还是负面）
  const calculateTrend = () => {
    if (recentChanges.length === 0) return 0;
    
    const total = recentChanges.reduce((sum, change) => sum + change.amount, 0);
    return total;
  };
  
  const trend = calculateTrend();
  const currentLevelMinScore = getCurrentLevelMinScore();
  
  return (
    <Card variant="outlined" sx={{ width: '100%', mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" component="div">
            社区声誉
          </Typography>
          <ReputationBadge 
            level={level} 
            score={currentScore} 
            showScore={true} 
            size="medium" 
            variant="chip" 
          />
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        {/* 进度条部分 */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body2" color="text.secondary">
              当前: {currentScore}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              下一等级: {nextLevelScore}
            </Typography>
          </Box>
          
          <LinearProgress 
            variant="determinate" 
            value={progressToNextLevel} 
            sx={{ 
              height: 8, 
              borderRadius: 4,
              backgroundColor: theme.palette.action.selected,
              '& .MuiLinearProgress-bar': {
                backgroundColor: theme.palette.primary.main,
                borderRadius: 4,
              }
            }} 
          />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
            <Typography variant="caption" color="text.secondary">
              还需 {nextLevelScore - currentScore} 分升级
            </Typography>
            <Typography variant="caption" color="text.secondary">
              进度: {progressToNextLevel}%
            </Typography>
          </Box>
        </Box>
        
        {/* 声誉趋势 */}
        <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
          <TimelineIcon 
            sx={{ mr: 1, color: theme.palette.text.secondary }} 
          />
          <Typography variant="body2">
            最近趋势: 
            <Box component="span" sx={{ 
              color: trend > 0 
                ? theme.palette.success.main 
                : trend < 0 
                  ? theme.palette.error.main 
                  : theme.palette.text.primary,
              fontWeight: 'bold',
              ml: 0.5
            }}>
              {trend > 0 ? '+' : ''}{trend}
              {trend > 0 
                ? <TrendingUpIcon fontSize="small" sx={{ ml: 0.5, verticalAlign: 'middle' }} /> 
                : trend < 0 
                  ? <TrendingDownIcon fontSize="small" sx={{ ml: 0.5, verticalAlign: 'middle' }} />
                  : null
              }
            </Box>
          </Typography>
        </Box>
        
        {/* 历史记录部分 */}
        {showHistory && recentChanges.length > 0 && (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle1">
                最近变更
              </Typography>
              <IconButton
                onClick={() => setHistoryExpanded(!historyExpanded)}
                aria-expanded={historyExpanded}
                aria-label="显示历史"
                size="small"
                sx={{
                  transform: historyExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: theme.transitions.create('transform', {
                    duration: theme.transitions.duration.shorter,
                  }),
                }}
              >
                <ExpandMoreIcon />
              </IconButton>
            </Box>
            
            <Collapse in={historyExpanded} timeout="auto" unmountOnExit>
              <List dense disablePadding>
                {recentChanges.map((change) => (
                  <ListItem key={change.id} sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      {change.amount > 0 ? (
                        <TrendingUpIcon color="success" />
                      ) : (
                        <TrendingDownIcon color="error" />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body2">
                          {change.description}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary">
                          {new Date(change.date).toLocaleDateString()} · 
                          <Box 
                            component="span" 
                            sx={{ 
                              ml: 0.5,
                              color: change.amount > 0 
                                ? theme.palette.success.main 
                                : theme.palette.error.main,
                              fontWeight: 'bold'
                            }}
                          >
                            {change.amount > 0 ? '+' : ''}{change.amount}
                          </Box>
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </>
        )}
        
        <Divider sx={{ my: 2 }} />
        
        {/* 权限部分 */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="subtitle1">
              社区权限
            </Typography>
            <Tooltip title="根据您的声誉等级获得的社区特权" arrow>
              <InfoIcon sx={{ ml: 0.5, color: theme.palette.text.secondary, fontSize: '1rem' }} />
            </Tooltip>
          </Box>
          <IconButton
            onClick={() => setPrivilegesExpanded(!privilegesExpanded)}
            aria-expanded={privilegesExpanded}
            aria-label="显示权限"
            size="small"
            sx={{
              transform: privilegesExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: theme.transitions.create('transform', {
                duration: theme.transitions.duration.shorter,
              }),
            }}
          >
            <ExpandMoreIcon />
          </IconButton>
        </Box>
        
        <Collapse in={privilegesExpanded} timeout="auto" unmountOnExit>
          <List dense disablePadding>
            {privileges.map((privilege) => (
              <ListItem key={privilege.id} sx={{ py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  {privilege.unlocked ? (
                    <LockOpenIcon color="success" />
                  ) : (
                    <LockIcon color="action" />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: privilege.unlocked 
                          ? theme.palette.text.primary 
                          : theme.palette.text.secondary
                      }}
                    >
                      {privilege.name}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="caption" color="text.secondary">
                      {privilege.description}
                      {!privilege.unlocked && (
                        <Box component="span" sx={{ fontStyle: 'italic', ml: 0.5 }}>
                          (需要 {getLevelLabel(privilege.requiredLevel)} 等级)
                        </Box>
                      )}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Collapse>
      </CardContent>
    </Card>
  );
};

// 获取等级中文标签
const getLevelLabel = (level: ReputationLevel): string => {
  switch (level) {
    case ReputationLevel.NEWCOMER:
      return '新手';
    case ReputationLevel.LEARNER:
      return '学习者';
    case ReputationLevel.CONTRIBUTOR:
      return '贡献者';
    case ReputationLevel.MENTOR:
      return '导师';
    case ReputationLevel.EXPERT:
      return '专家';
    default:
      return '未知';
  }
};

export default ReputationDisplay; 