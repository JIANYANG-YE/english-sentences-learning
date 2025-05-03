import React from 'react';
import { 
  Box, 
  Tooltip, 
  Typography, 
  Badge, 
  Chip, 
  SvgIcon,
  useTheme
} from '@mui/material';
import { 
  Star as StarIcon,
  EmojiEvents as TrophyIcon,
  School as SchoolIcon,
  VerifiedUser as VerifiedIcon,
  Psychology as PsychologyIcon
} from '@mui/icons-material';
import { ReputationLevel } from '../../services/communityReputationService';

// 定义声誉徽章属性
export interface ReputationBadgeProps {
  level: ReputationLevel;
  score: number;
  showScore?: boolean;
  size?: 'small' | 'medium' | 'large';
  variant?: 'icon' | 'chip' | 'badge';
}

// 等级图标配置
const levelIcons = {
  [ReputationLevel.NEWCOMER]: StarIcon,
  [ReputationLevel.LEARNER]: SchoolIcon,
  [ReputationLevel.CONTRIBUTOR]: VerifiedIcon,
  [ReputationLevel.MENTOR]: PsychologyIcon,
  [ReputationLevel.EXPERT]: TrophyIcon,
};

// 等级颜色配置
const levelColors = {
  [ReputationLevel.NEWCOMER]: '#9e9e9e', // 灰色
  [ReputationLevel.LEARNER]: '#4caf50', // 绿色
  [ReputationLevel.CONTRIBUTOR]: '#2196f3', // 蓝色
  [ReputationLevel.MENTOR]: '#ff9800', // 橙色
  [ReputationLevel.EXPERT]: '#f44336', // 红色
};

// 等级描述配置
const levelDescriptions = {
  [ReputationLevel.NEWCOMER]: '新手: 刚刚开始参与社区',
  [ReputationLevel.LEARNER]: '学习者: 积极参与社区讨论',
  [ReputationLevel.CONTRIBUTOR]: '贡献者: 为社区提供有价值内容',
  [ReputationLevel.MENTOR]: '导师: 经常帮助其他成员学习',
  [ReputationLevel.EXPERT]: '专家: 在社区中拥有很高的声誉',
};

/**
 * 声誉徽章组件
 * 用于显示用户在社区中的声誉等级
 */
const ReputationBadge: React.FC<ReputationBadgeProps> = ({
  level,
  score,
  showScore = false,
  size = 'medium',
  variant = 'icon'
}) => {
  const theme = useTheme();
  
  // 获取图标组件
  const IconComponent = levelIcons[level];
  
  // 获取颜色
  const color = levelColors[level];
  
  // 获取描述
  const description = `${levelDescriptions[level]} (${score} 声誉分)`;
  
  // 根据尺寸设置图标大小
  const getIconSize = () => {
    switch (size) {
      case 'small':
        return { fontSize: '1rem' };
      case 'large':
        return { fontSize: '2rem' };
      default:
        return { fontSize: '1.5rem' };
    }
  };
  
  // 渲染图标变体
  const renderIconVariant = () => (
    <Tooltip title={description} arrow>
      <Box 
        sx={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          cursor: 'help'
        }}
      >
        <SvgIcon 
          component={IconComponent} 
          sx={{ 
            color, 
            ...getIconSize()
          }} 
        />
        
        {showScore && (
          <Typography 
            variant={size === 'small' ? 'caption' : 'body2'} 
            sx={{ 
              ml: 0.5, 
              fontWeight: 'bold',
              color: theme.palette.text.secondary
            }}
          >
            {score}
          </Typography>
        )}
      </Box>
    </Tooltip>
  );
  
  // 渲染徽章变体
  const renderBadgeVariant = () => (
    <Tooltip title={description} arrow>
      <Badge
        badgeContent={
          <SvgIcon 
            component={IconComponent} 
            sx={{ 
              color,
              fontSize: size === 'small' ? '0.75rem' : '1rem',
            }} 
          />
        }
        sx={{ cursor: 'help' }}
      >
        <Typography 
          variant={size === 'small' ? 'caption' : 'body2'} 
          sx={{ 
            fontWeight: 'bold',
            color: theme.palette.text.primary
          }}
        >
          {score}
        </Typography>
      </Badge>
    </Tooltip>
  );
  
  // 渲染标签变体
  const renderChipVariant = () => (
    <Tooltip title={description} arrow>
      <Chip
        icon={
          <SvgIcon 
            component={IconComponent} 
            sx={{ 
              color: '#fff'
            }} 
          />
        }
        label={showScore ? `${getLevelLabel(level)} · ${score}` : getLevelLabel(level)}
        size={size === 'large' ? 'medium' : 'small'}
        sx={{
          backgroundColor: color,
          color: '#fff',
          fontWeight: 'bold',
          cursor: 'help',
          '& .MuiChip-icon': {
            color: '#fff'
          }
        }}
      />
    </Tooltip>
  );
  
  // 获取等级标签
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
  
  // 根据变体渲染不同样式
  switch (variant) {
    case 'badge':
      return renderBadgeVariant();
    case 'chip':
      return renderChipVariant();
    case 'icon':
    default:
      return renderIconVariant();
  }
};

export default ReputationBadge; 