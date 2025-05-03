import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box, Chip, Tooltip } from '@mui/material';
import { Badge, BadgeRarity } from '@/services/badgeService';
import { useBadgeRarityColor, useBadgeRarityName, useBadgeTypeName } from '@/hooks/useBadges';

// 徽章卡片属性接口
export interface BadgeCardProps {
  badge: Badge;
  onClick?: (badge: Badge) => void;
  size?: 'small' | 'medium' | 'large';
  showDetails?: boolean;
  isLocked?: boolean;
}

/**
 * 徽章卡片组件
 * 显示徽章信息，包括图标、名称、描述、稀有度等
 */
const BadgeCard: React.FC<BadgeCardProps> = ({ 
  badge, 
  onClick, 
  size = 'medium', 
  showDetails = true,
  isLocked = false
}) => {
  // 使用钩子获取徽章稀有度颜色和名称
  const rarityColor = useBadgeRarityColor(badge.rarity);
  const rarityName = useBadgeRarityName(badge.rarity);
  const typeName = useBadgeTypeName(badge.type);
  
  // 根据尺寸计算卡片大小
  const sizeMap = {
    small: {
      width: 120,
      height: showDetails ? 180 : 120,
      iconSize: 64,
      fontSize: {
        title: '0.8rem',
        subtitle: '0.7rem',
        body: '0.65rem'
      }
    },
    medium: {
      width: 200,
      height: showDetails ? 280 : 200,
      iconSize: 100,
      fontSize: {
        title: '1rem',
        subtitle: '0.85rem',
        body: '0.75rem'
      }
    },
    large: {
      width: 280,
      height: showDetails ? 400 : 280,
      iconSize: 140,
      fontSize: {
        title: '1.2rem',
        subtitle: '1rem',
        body: '0.85rem'
      }
    }
  };
  
  const dimensions = sizeMap[size];
  
  // 处理点击事件
  const handleClick = () => {
    if (onClick) {
      onClick(badge);
    }
  };
  
  // 卡片边框样式
  const cardBorder = `2px solid ${rarityColor}`;
  
  // 解锁日期格式化
  const formattedUnlockDate = badge.unlockedAt 
    ? new Date(badge.unlockedAt).toLocaleDateString('zh-CN')
    : null;
  
  return (
    <Card 
      sx={{
        width: dimensions.width,
        height: dimensions.height,
        position: 'relative',
        border: cardBorder,
        borderRadius: 2,
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: onClick ? 'pointer' : 'default',
        opacity: isLocked ? 0.6 : 1,
        filter: isLocked ? 'grayscale(80%)' : 'none',
        '&:hover': onClick ? {
          transform: 'translateY(-5px)',
          boxShadow: `0 5px 15px rgba(0,0,0,0.2)`
        } : {}
      }}
      onClick={handleClick}
    >
      {/* 稀有度标记 */}
      <Box 
        sx={{ 
          position: 'absolute', 
          top: 0, 
          right: 0, 
          backgroundColor: rarityColor,
          color: '#fff',
          borderRadius: '0 4px 0 4px',
          padding: '2px 6px',
          fontSize: dimensions.fontSize.subtitle,
          zIndex: 1
        }}
      >
        {rarityName}
      </Box>
      
      {/* 徽章图标 */}
      <CardMedia
        component="img"
        height={dimensions.iconSize}
        image={badge.iconUrl}
        alt={badge.name}
        sx={{ 
          objectFit: 'contain', 
          padding: 2,
          filter: isLocked ? 'blur(3px)' : 'none'
        }}
      />
      
      {/* 徽章信息 */}
      <CardContent>
        <Typography 
          variant="h6" 
          component="div" 
          gutterBottom
          sx={{ 
            fontSize: dimensions.fontSize.title,
            fontWeight: 'bold',
            color: rarityColor
          }}
        >
          {badge.name}
        </Typography>
        
        {showDetails && (
          <>
            <Chip 
              label={typeName} 
              size="small" 
              sx={{ 
                fontSize: dimensions.fontSize.subtitle,
                mb: 1
              }} 
            />
            
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ 
                fontSize: dimensions.fontSize.body,
                mb: 1
              }}
            >
              {isLocked ? badge.unlockCriteria.description : badge.description}
            </Typography>
            
            {badge.unlockedAt && (
              <Typography 
                variant="caption" 
                sx={{ 
                  fontSize: dimensions.fontSize.body,
                  display: 'block',
                  textAlign: 'right',
                  mt: 1
                }}
              >
                解锁于: {formattedUnlockDate}
              </Typography>
            )}
            
            {/* 锁定状态 */}
            {isLocked && (
              <Box 
                sx={{ 
                  position: 'absolute',
                  bottom: 10,
                  right: 10,
                  bgcolor: 'rgba(0, 0, 0, 0.6)',
                  color: 'white',
                  borderRadius: '4px',
                  padding: '4px 8px',
                  fontSize: dimensions.fontSize.body
                }}
              >
                未解锁
              </Box>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default BadgeCard; 