import React, { useState } from 'react';
import { Button, Box, Typography, Paper } from '@mui/material';
import { BadgeUnlockAnimation } from './BadgeUnlockAnimation';
import { Badge, BadgeRarity, BadgeType } from '@/types/badge';

const demoBadges: Badge[] = [
  {
    id: 'demo-badge-1',
    name: '学习达人',
    description: '连续学习7天获得此徽章',
    type: BadgeType.STREAK,
    rarity: BadgeRarity.RARE,
    imageUrl: '/images/badges/streak-7days.png',
    criteria: 'streak_days',
    points: 7,
    unlockedAt: new Date(),
    category: '学习',
    tags: ['连续学习', '坚持'],
    requirements: [
      {
        type: 'streak_days',
        value: 7,
        description: '连续学习7天'
      }
    ],
    rewards: [
      {
        type: 'points',
        value: 7,
        description: '7点成就值'
      }
    ],
    version: '1.0',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'demo-badge-2',
    name: '社区贡献者',
    description: '在社区中帮助其他学习者',
    type: BadgeType.COMMUNITY,
    rarity: BadgeRarity.EPIC,
    imageUrl: '/images/badges/community-helper.png',
    criteria: 'help_count',
    points: 10,
    unlockedAt: new Date(),
    category: '社区',
    tags: ['帮助', '贡献'],
    requirements: [
      {
        type: 'help_count',
        value: 5,
        description: '帮助5位学习者'
      }
    ],
    rewards: [
      {
        type: 'points',
        value: 10,
        description: '10点成就值'
      }
    ],
    version: '1.0',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const BadgeUnlockDemo: React.FC = () => {
  const [showAnimation, setShowAnimation] = useState(false);
  const [currentBadgeIndex, setCurrentBadgeIndex] = useState(0);

  const handleUnlock = () => {
    setShowAnimation(true);
  };

  const handleAnimationComplete = () => {
    setShowAnimation(false);
    setCurrentBadgeIndex((prev) => (prev + 1) % demoBadges.length);
  };

  const currentBadge = demoBadges[currentBadgeIndex];

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom align="center">
        徽章解锁演示
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        <Box sx={{ flex: 1, minWidth: 300 }}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              当前徽章信息
            </Typography>
            <Box
              component="img"
              src={currentBadge.imageUrl}
              alt={currentBadge.name}
              sx={{
                width: 100,
                height: 100,
                mb: 2,
                filter: 'drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.2))',
              }}
            />
            <Typography variant="h6" gutterBottom>
              {currentBadge.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {currentBadge.description}
            </Typography>
            <Typography variant="body2" color="primary">
              稀有度: {currentBadge.rarity}
            </Typography>
            <Typography variant="body2" color="primary">
              类型: {currentBadge.type}
            </Typography>
            <Typography variant="body2" color="primary">
              成就值: {currentBadge.points}
            </Typography>
          </Paper>
        </Box>
        
        <Box sx={{ flex: 1, minWidth: 300 }}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              解锁要求
            </Typography>
            {currentBadge.requirements?.map((req, index) => (
              <Typography key={index} variant="body2" paragraph>
                {req.description}
              </Typography>
            ))}
            <Button
              variant="contained"
              color="primary"
              onClick={handleUnlock}
              sx={{ mt: 2 }}
            >
              解锁徽章
            </Button>
          </Paper>
        </Box>
      </Box>

      {showAnimation && (
        <BadgeUnlockAnimation
          badge={currentBadge}
          onComplete={handleAnimationComplete}
        />
      )}
    </Box>
  );
}; 