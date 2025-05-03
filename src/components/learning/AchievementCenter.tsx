'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Chip, 
  Button, 
  CircularProgress, 
  LinearProgress, 
  Tabs, 
  Tab, 
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Badge,
  Tooltip,
  IconButton,
  Paper
} from '@mui/material';
import { 
  EmojiEvents, 
  Lock, 
  Verified, 
  Today, 
  TrendingUp, 
  Timer, 
  LocalFireDepartment, 
  Star, 
  StarBorder, 
  Close, 
  Share, 
  Info,
  Timeline,
  LockOpen,
  Trophy,
  ArrowUpward,
  Celebration,
  School,
  WorkspacePremium
} from '@mui/icons-material';
import { TransitionProps } from '@mui/material/transitions';

// 动画转场组件
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// 成就类型定义
export type AchievementCategory = 
  | 'streak' // 连续学习
  | 'milestone' // 学习里程碑
  | 'skill' // 技能掌握
  | 'challenge' // 挑战完成
  | 'special'; // 特殊成就

// 成就分级定义
export type AchievementTier = 
  | 'bronze' // 铜级
  | 'silver' // 银级
  | 'gold' // 金级
  | 'platinum'; // 白金级

// 成就状态
export type AchievementStatus = 
  | 'locked' // 未解锁
  | 'in-progress' // 进行中
  | 'completed' // 已完成
  | 'claimed'; // 已领取奖励

// 成就定义接口
export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: AchievementCategory;
  tier: AchievementTier;
  status: AchievementStatus;
  icon: React.ReactNode;
  progress: number; // 0-100
  target: number;
  current: number;
  reward: {
    type: 'points' | 'badge' | 'feature' | 'theme';
    value: number | string;
    description: string;
  };
  dateEarned?: string;
  featured?: boolean;
  rarity: string;
  iconPath: string;
  pointsAwarded: number;
  isUnlocked: boolean;
  unlockedDate?: string; // ISO日期字符串
  progressText: string;
  rewards?: string[];
}

// 成就类别信息
const categoryInfo = {
  streak: {
    label: '连续学习',
    color: '#FF5722',
    icon: <LocalFireDepartment />
  },
  milestone: {
    label: '学习里程碑',
    color: '#2196F3',
    icon: <TrendingUp />
  },
  skill: {
    label: '技能掌握',
    color: '#4CAF50',
    icon: <Verified />
  },
  challenge: {
    label: '挑战完成',
    color: '#9C27B0',
    icon: <EmojiEvents />
  },
  special: {
    label: '特殊成就',
    color: '#FFC107',
    icon: <Star />
  }
};

// 成就等级信息
const tierInfo = {
  bronze: {
    label: '铜级',
    color: '#CD7F32'
  },
  silver: {
    label: '银级',
    color: '#C0C0C0'
  },
  gold: {
    label: '金级',
    color: '#FFD700'
  },
  platinum: {
    label: '白金级',
    color: '#E5E4E2'
  }
};

// 徽章颜色映射
const rarityColorMap = {
  '普通': '#8e8e8e', // 灰色
  '稀有': '#1976d2', // 蓝色
  '史诗': '#9c27b0', // 紫色
  '传奇': '#f57c00'  // 橙色
};

// 徽章边框映射
const rarityBorderMap = {
  '普通': '1px solid #8e8e8e',
  '稀有': '2px solid #1976d2',
  '史诗': '2px solid #9c27b0',
  '传奇': '3px solid #f57c00' 
};

// 单个成就卡片组件
const AchievementCard = ({ 
  achievement, 
  onView 
}: { 
  achievement: Achievement;
  onView: (achievement: Achievement) => void;
}) => {
  const isLocked = achievement.status === 'locked';
  const isCompleted = achievement.status === 'completed' || achievement.status === 'claimed';
  const category = categoryInfo[achievement.category];
  const tier = tierInfo[achievement.tier];
  
  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        position: 'relative',
        opacity: isLocked ? 0.7 : 1,
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 3,
        },
        border: isLocked ? rarityBorderMap[achievement.rarity] : '1px solid #e0e0e0'
      }}
    >
      {achievement.featured && (
        <Box 
          sx={{ 
            position: 'absolute', 
            top: 0, 
            right: 0, 
            bgcolor: 'warning.main', 
            color: 'warning.contrastText',
            borderRadius: '0 4px 0 4px',
            px: 1,
            zIndex: 1
          }}
        >
          <Typography variant="caption" fontWeight="bold">
            精选
          </Typography>
        </Box>
      )}

      <CardMedia
        component="div"
        sx={{
          height: 120,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          bgcolor: isLocked ? 'grey.300' : category.color + '20',
          color: isLocked ? 'grey.500' : category.color,
          position: 'relative'
        }}
      >
        {isLocked ? (
          <Lock sx={{ fontSize: 48, opacity: 0.5 }} />
        ) : (
          <Box sx={{ fontSize: 48 }}>{achievement.icon}</Box>
        )}
        
        {!isLocked && !isCompleted && (
          <Box 
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0
            }}
          >
            <LinearProgress 
              variant="determinate" 
              value={achievement.progress} 
              sx={{ height: 8 }}
            />
          </Box>
        )}
      </CardMedia>
      
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Chip 
            label={category.label} 
            size="small" 
            sx={{ 
              bgcolor: isLocked ? 'grey.300' : category.color + '20',
              color: isLocked ? 'grey.700' : category.color,
            }} 
          />
          <Chip 
            label={tier.label} 
            size="small" 
            sx={{ 
              bgcolor: isLocked ? 'grey.300' : tier.color + '20',
              color: isLocked ? 'grey.700' : 'text.primary',
            }} 
          />
        </Box>
        
        <Typography variant="subtitle1" component="div" fontWeight="bold" noWrap>
          {isLocked ? '???' : achievement.title}
        </Typography>
        
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            mb: 1,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            height: 40
          }}
        >
          {isLocked ? '继续学习以解锁此成就' : achievement.description}
        </Typography>
        
        {!isLocked && (
          <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {achievement.status === 'claimed' ? (
                <Verified color="success" fontSize="small" sx={{ mr: 0.5 }} />
              ) : (
                <Timer fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
              )}
              <Typography variant="caption" color="text.secondary">
                {achievement.status === 'claimed' ? 
                  `获得于 ${new Date(achievement.dateEarned!).toLocaleDateString('zh-CN')}` : 
                  `${achievement.current}/${achievement.target}`
                }
              </Typography>
            </Box>
            
            <Button 
              size="small" 
              onClick={() => onView(achievement)}
              variant="text"
            >
              查看
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

// 成就详情弹窗组件
const AchievementDetailDialog = ({ 
  achievement, 
  open, 
  onClose,
  onClaim
}: { 
  achievement?: Achievement; 
  open: boolean; 
  onClose: () => void;
  onClaim: (id: string) => void;
}) => {
  if (!achievement) return null;
  
  const category = categoryInfo[achievement.category];
  const tier = tierInfo[achievement.tier];
  const isCompleted = achievement.status === 'completed';
  const isClaimed = achievement.status === 'claimed';
  
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">成就详情</Typography>
        <IconButton edge="end" onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>
      
      <DialogContent dividers>
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            mb: 3,
            pt: 2
          }}
        >
          <Box 
            sx={{ 
              width: 120, 
              height: 120, 
              borderRadius: '50%', 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              bgcolor: category.color + '20',
              color: category.color,
              mb: 2,
              fontSize: 64
            }}
          >
            {achievement.icon}
          </Box>
          
          <Typography variant="h5" fontWeight="bold" textAlign="center" gutterBottom>
            {achievement.title}
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
            <Chip 
              label={category.label} 
              size="small" 
              sx={{ bgcolor: category.color + '20', color: category.color }} 
            />
            <Chip 
              label={tier.label} 
              size="small" 
              sx={{ bgcolor: tier.color + '20', color: 'text.primary' }} 
            />
            <Chip 
              label={isClaimed ? '已领取' : isCompleted ? '已完成' : '进行中'} 
              size="small" 
              color={isClaimed ? 'success' : isCompleted ? 'primary' : 'default'} 
              variant="outlined"
            />
          </Box>
        </Box>
        
        <Typography variant="body1" paragraph>
          {achievement.description}
        </Typography>
        
        <Box sx={{ mt: 2, mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            达成条件
          </Typography>
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              bgcolor: 'background.paper', 
              p: 2, 
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            <Box sx={{ flexGrow: 1, mr: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2">
                  进度: {achievement.current}/{achievement.target}
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  {achievement.progress}%
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={achievement.progress} 
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Box>
          </Box>
        </Box>
        
        <Box 
          sx={{ 
            p: 2, 
            bgcolor: 'background.paper',
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Typography variant="subtitle2" gutterBottom>
            奖励内容
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {achievement.reward.type === 'points' && <Star sx={{ color: 'warning.main', mr: 1 }} />}
            {achievement.reward.type === 'badge' && <EmojiEvents sx={{ color: 'primary.main', mr: 1 }} />}
            {achievement.reward.type === 'feature' && <Verified sx={{ color: 'success.main', mr: 1 }} />}
            {achievement.reward.type === 'theme' && <Palette sx={{ color: 'secondary.main', mr: 1 }} />}
            <Typography>
              {achievement.reward.description}
            </Typography>
          </Box>
        </Box>
        
        {isClaimed && achievement.dateEarned && (
          <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Today fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              获得于 {new Date(achievement.dateEarned).toLocaleDateString('zh-CN')}
            </Typography>
          </Box>
        )}
      </DialogContent>
      
      <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
        <Button
          startIcon={<Share />}
          variant="outlined"
          disabled={!isCompleted && !isClaimed}
        >
          分享成就
        </Button>
        
        {isCompleted && !isClaimed && (
          <Button
            startIcon={<EmojiEvents />}
            variant="contained"
            color="primary"
            onClick={() => onClaim(achievement.id)}
          >
            领取奖励
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

// 成就总览组件
const AchievementOverview = ({ 
  stats 
}: { 
  stats: {
    totalAchievements: number;
    completedAchievements: number;
    earnedPoints: number;
    nextMilestone: number;
    milestoneProgress: number;
    rankInfo: {
      name: string;
      level: number;
      nextLevel: string;
      pointsToNextLevel: number;
    }
  } 
}) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>成就进度</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box sx={{ position: 'relative', display: 'inline-flex', mr: 2 }}>
                <CircularProgress
                  variant="determinate"
                  value={(stats.completedAchievements / stats.totalAchievements) * 100}
                  size={80}
                  thickness={5}
                  sx={{ color: 'primary.main' }}
                />
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="h6" component="div" color="text.secondary">
                    {Math.round((stats.completedAchievements / stats.totalAchievements) * 100)}%
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  已完成成就
                </Typography>
                <Typography variant="h5">
                  {stats.completedAchievements}/{stats.totalAchievements}
                </Typography>
              </Box>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="body2" gutterBottom>
              下一个里程碑: {stats.nextMilestone} 成就
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={stats.milestoneProgress} 
              sx={{ height: 8, borderRadius: 4 }}
            />
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>学习者等级</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  <Box 
                    sx={{ 
                      bgcolor: 'primary.main', 
                      color: 'white', 
                      borderRadius: '50%', 
                      width: 24, 
                      height: 24, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      border: '2px solid white'
                    }}
                  >
                    {stats.rankInfo.level}
                  </Box>
                }
              >
                <Box 
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    borderRadius: '50%', 
                    bgcolor: 'primary.light', 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    mr: 2
                  }}
                >
                  <EmojiEvents sx={{ fontSize: 40 }} />
                </Box>
              </Badge>
              
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  当前称号
                </Typography>
                <Typography variant="h5">
                  {stats.rankInfo.name}
                </Typography>
              </Box>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2">
                下一称号: {stats.rankInfo.nextLevel}
              </Typography>
              <Typography variant="body2">
                还需 {stats.rankInfo.pointsToNextLevel} 积分
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Star sx={{ color: 'warning.main', mr: 1 }} />
              <Typography variant="body1" fontWeight="bold">
                {stats.earnedPoints} 积分
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

// 主成就系统组件
export default function AchievementCenter() {
  // 状态管理
  const [loading, setLoading] = useState(true);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | undefined>(undefined);
  const [detailOpen, setDetailOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<AchievementCategory | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<AchievementStatus | 'all'>('all');
  const [stats, setStats] = useState({
    totalAchievements: 0,
    completedAchievements: 0,
    earnedPoints: 0,
    nextMilestone: 0,
    milestoneProgress: 0,
    rankInfo: {
      name: '初学者',
      level: 1,
      nextLevel: '语言爱好者',
      pointsToNextLevel: 200
    }
  });
  
  // 模拟获取成就数据
  useEffect(() => {
    const fetchAchievements = async () => {
      // 模拟API请求延迟
      setTimeout(() => {
        // 模拟成就数据
        const mockAchievements: Achievement[] = [
          {
            id: 'streak-7',
            title: '坚持不懈',
            description: '连续学习7天',
            category: 'streak',
            tier: 'bronze',
            status: 'claimed',
            icon: <LocalFireDepartment />,
            progress: 100,
            target: 7,
            current: 7,
            reward: {
              type: 'points',
              value: 50,
              description: '获得50积分'
            },
            dateEarned: '2023-11-15',
            featured: true,
            rarity: '普通',
            iconPath: '/images/achievements/seven-day-streak.png',
            pointsAwarded: 200,
            isUnlocked: true,
            unlockedDate: '2023-08-25T08:20:00Z',
            progressText: '已完成',
            rewards: ['专属头像框: 坚持不懈']
          },
          {
            id: 'streak-30',
            title: '习惯养成',
            description: '连续学习30天',
            category: 'streak',
            tier: 'silver',
            status: 'in-progress',
            icon: <LocalFireDepartment />,
            progress: 60,
            target: 30,
            current: 18,
            reward: {
              type: 'points',
              value: 150,
              description: '获得150积分和专属徽章'
            },
            rarity: '稀有',
            iconPath: '/images/achievements/thirty-day-streak.png',
            pointsAwarded: 500,
            isUnlocked: false,
            progressText: '15 / 30'
          },
          {
            id: 'milestone-100',
            title: '初窥门径',
            description: '学习100个句子',
            category: 'milestone',
            tier: 'bronze',
            status: 'claimed',
            icon: <TrendingUp />,
            progress: 100,
            target: 100,
            current: 100,
            reward: {
              type: 'points',
              value: 75,
              description: '获得75积分'
            },
            dateEarned: '2023-11-20',
            rarity: '普通',
            iconPath: '/images/achievements/hundred-lessons.png',
            pointsAwarded: 500,
            isUnlocked: true,
            progressText: '已完成'
          },
          {
            id: 'milestone-500',
            title: '熟能生巧',
            description: '学习500个句子',
            category: 'milestone',
            tier: 'silver',
            status: 'in-progress',
            icon: <TrendingUp />,
            progress: 48,
            target: 500,
            current: 240,
            reward: {
              type: 'points',
              value: 200,
              description: '获得200积分和解锁高级学习数据统计'
            },
            rarity: '稀有',
            iconPath: '/images/achievements/vocabulary-expert.png',
            pointsAwarded: 300,
            isUnlocked: false,
            progressText: '320 / 500'
          },
          {
            id: 'skill-grammar',
            title: '语法大师',
            description: '完成所有语法挑战并获得至少90%的正确率',
            category: 'skill',
            tier: 'gold',
            status: 'completed',
            icon: <Verified />,
            progress: 100,
            target: 100,
            current: 100,
            reward: {
              type: 'badge',
              value: 'grammar-master',
              description: '获得"语法大师"徽章和300积分'
            },
            rarity: '稀有',
            iconPath: '/images/achievements/grammar-master.png',
            pointsAwarded: 250,
            isUnlocked: true,
            progressText: '已完成'
          },
          {
            id: 'challenge-speed',
            title: '疾如闪电',
            description: '在10分钟内完成50个翻译练习',
            category: 'challenge',
            tier: 'silver',
            status: 'locked',
            icon: <EmojiEvents />,
            progress: 0,
            target: 50,
            current: 0,
            reward: {
              type: 'feature',
              value: 'speed-mode',
              description: '解锁"速度模式"练习功能和150积分'
            },
            rarity: '普通',
            iconPath: '/images/achievements/speed-mode.png',
            pointsAwarded: 150,
            isUnlocked: false,
            progressText: '0 / 50'
          },
          {
            id: 'special-early',
            title: '早起鸟儿',
            description: '连续7天在早晨6点前开始学习',
            category: 'special',
            tier: 'bronze',
            status: 'locked',
            icon: <Star />,
            progress: 0,
            target: 7,
            current: 0,
            reward: {
              type: 'theme',
              value: 'sunrise-theme',
              description: '解锁"日出"主题和100积分'
            },
            rarity: '普通',
            iconPath: '/images/achievements/sunrise-theme.png',
            pointsAwarded: 100,
            isUnlocked: true,
            progressText: '已完成'
          },
          {
            id: 'streak-365',
            title: '年度学者',
            description: '连续学习365天',
            category: 'streak',
            tier: 'platinum',
            status: 'locked',
            icon: <LocalFireDepartment />,
            progress: 5,
            target: 365,
            current: 18,
            reward: {
              type: 'points',
              value: 1000,
              description: '获得1000积分和"年度学者"专属徽章'
            },
            rarity: '史诗',
            iconPath: '/images/achievements/year-scholar.png',
            pointsAwarded: 1000,
            isUnlocked: true,
            progressText: '已完成'
          }
        ];
        
        setAchievements(mockAchievements);
        
        // 计算成就统计信息
        const completed = mockAchievements.filter(a => 
          a.status === 'completed' || a.status === 'claimed'
        ).length;
        
        const points = mockAchievements
          .filter(a => a.status === 'claimed')
          .reduce((sum, a) => {
            if (a.reward.type === 'points') {
              return sum + (a.reward.value as number);
            }
            return sum;
          }, 0);
        
        setStats({
          totalAchievements: mockAchievements.length,
          completedAchievements: completed,
          earnedPoints: points,
          nextMilestone: 5,
          milestoneProgress: (completed / 5) * 100,
          rankInfo: {
            name: '初学者',
            level: 1,
            nextLevel: '语言爱好者',
            pointsToNextLevel: 200 - points
          }
        });
        
        setLoading(false);
      }, 1000);
    };
    
    fetchAchievements();
  }, []);
  
  // 处理成就详情查看
  const handleViewAchievement = (achievement: Achievement) => {
    setSelectedAchievement(achievement);
    setDetailOpen(true);
  };
  
  // 处理关闭成就详情
  const handleCloseDetail = () => {
    setDetailOpen(false);
  };
  
  // 处理领取奖励
  const handleClaimReward = (id: string) => {
    setAchievements(achievements.map(achievement => {
      if (achievement.id === id) {
        return {
          ...achievement,
          status: 'claimed' as AchievementStatus,
          dateEarned: new Date().toISOString()
        };
      }
      return achievement;
    }));
    
    // 更新统计数据
    const claimed = achievements.find(a => a.id === id);
    if (claimed && claimed.reward.type === 'points') {
      const newPoints = stats.earnedPoints + (claimed.reward.value as number);
      setStats({
        ...stats,
        earnedPoints: newPoints,
        rankInfo: {
          ...stats.rankInfo,
          pointsToNextLevel: Math.max(0, 200 - newPoints)
        }
      });
    }
    
    setDetailOpen(false);
    
    // 在实际应用中，这里应该调用API保存数据
  };
  
  // 筛选成就
  const filteredAchievements = achievements.filter(achievement => {
    if (categoryFilter !== 'all' && achievement.category !== categoryFilter) {
      return false;
    }
    
    if (statusFilter !== 'all' && achievement.status !== statusFilter) {
      return false;
    }
    
    return true;
  });
  
  // 返回界面
  return (
    <Box sx={{ p: 3 }}>
      {/* 成就概览 */}
      <Typography variant="h5" gutterBottom fontWeight="bold">
        成就中心
      </Typography>
      <Typography variant="body1" paragraph color="text.secondary">
        跟踪您的学习旅程，解锁成就，获取奖励，展示您的进步
      </Typography>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* 成就统计卡片 */}
          <Box sx={{ mb: 4 }}>
            <AchievementOverview stats={stats} />
          </Box>
          
          {/* 筛选栏 */}
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              flexWrap: 'wrap',
              mb: 2
            }}
          >
            <Tabs 
              value={categoryFilter}
              onChange={(_, newValue) => setCategoryFilter(newValue)}
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label="全部" value="all" />
              <Tab 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ color: categoryInfo.streak.color, mr: 0.5 }}>
                      {categoryInfo.streak.icon}
                    </Box>
                    {categoryInfo.streak.label}
                  </Box>
                } 
                value="streak" 
              />
              <Tab 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ color: categoryInfo.milestone.color, mr: 0.5 }}>
                      {categoryInfo.milestone.icon}
                    </Box>
                    {categoryInfo.milestone.label}
                  </Box>
                } 
                value="milestone" 
              />
              <Tab 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ color: categoryInfo.skill.color, mr: 0.5 }}>
                      {categoryInfo.skill.icon}
                    </Box>
                    {categoryInfo.skill.label}
                  </Box>
                } 
                value="skill" 
              />
              <Tab 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ color: categoryInfo.challenge.color, mr: 0.5 }}>
                      {categoryInfo.challenge.icon}
                    </Box>
                    {categoryInfo.challenge.label}
                  </Box>
                } 
                value="challenge" 
              />
              <Tab 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ color: categoryInfo.special.color, mr: 0.5 }}>
                      {categoryInfo.special.icon}
                    </Box>
                    {categoryInfo.special.label}
                  </Box>
                } 
                value="special" 
              />
            </Tabs>
            
            <Box sx={{ display: 'flex', mt: { xs: 2, md: 0 } }}>
              <Button
                size="small"
                variant={statusFilter === 'all' ? 'contained' : 'outlined'}
                onClick={() => setStatusFilter('all')}
                sx={{ mr: 1 }}
              >
                全部
              </Button>
              <Button
                size="small"
                variant={statusFilter === 'claimed' ? 'contained' : 'outlined'}
                onClick={() => setStatusFilter('claimed')}
                color="success"
                sx={{ mr: 1 }}
              >
                已获得
              </Button>
              <Button
                size="small"
                variant={statusFilter === 'completed' ? 'contained' : 'outlined'}
                onClick={() => setStatusFilter('completed')}
                color="primary"
                sx={{ mr: 1 }}
              >
                待领取
              </Button>
              <Button
                size="small"
                variant={statusFilter === 'in-progress' ? 'contained' : 'outlined'}
                onClick={() => setStatusFilter('in-progress')}
                color="info"
                sx={{ mr: 1 }}
              >
                进行中
              </Button>
              <Button
                size="small"
                variant={statusFilter === 'locked' ? 'contained' : 'outlined'}
                onClick={() => setStatusFilter('locked')}
                color="warning"
              >
                未解锁
              </Button>
            </Box>
          </Box>
          
          {/* 成就网格 */}
          {filteredAchievements.length > 0 ? (
            <Grid container spacing={3}>
              {filteredAchievements.map((achievement) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={achievement.id}>
                  <AchievementCard 
                    achievement={achievement} 
                    onView={handleViewAchievement} 
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                justifyContent: 'center',
                py: 5
              }}
            >
              <Info sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                没有找到匹配的成就
              </Typography>
              <Typography variant="body2" color="text.secondary">
                尝试修改筛选条件或继续学习以解锁更多成就
              </Typography>
            </Box>
          )}
        </>
      )}
      
      {/* 成就详情弹窗 */}
      <AchievementDetailDialog 
        achievement={selectedAchievement}
        open={detailOpen}
        onClose={handleCloseDetail}
        onClaim={handleClaimReward}
      />
    </Box>
  );
} 