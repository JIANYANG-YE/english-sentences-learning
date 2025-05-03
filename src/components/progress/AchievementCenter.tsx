import React, { useState, useEffect } from 'react';
import { 
  Container, Grid, Typography, Card, CardContent, 
  Box, CircularProgress, IconButton, Badge, Tab, Tabs,
  Button, Tooltip, LinearProgress, Chip, Dialog, DialogTitle,
  DialogContent, DialogActions, Avatar, Paper, Divider, Alert
} from '@mui/material';
import { 
  Star as StarIcon,
  EmojiEvents as TrophyIcon,
  School as SchoolIcon,
  LocalFireDepartment as FireIcon,
  Bookmark as BookmarkIcon,
  Timeline as TimelineIcon,
  Lightbulb as LightbulbIcon,
  CheckCircle as CheckCircleIcon,
  Lock as LockIcon,
  Share as ShareIcon,
  Stars as StarsIcon,
  TrendingUp as TrendingIcon,
  QuestionAnswer as QuestionIcon,
  Psychology as PsychologyIcon
} from '@mui/icons-material';

// 成就类型定义
interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'daily' | 'milestone' | 'skill' | 'special';
  icon: React.ReactNode;
  progress: number;
  target: number;
  isCompleted: boolean;
  dateCompleted?: string;
  xpReward: number;
  isLocked: boolean;
  level: number;
}

// 成就等级定义
interface AchievementLevel {
  level: number;
  name: string;
  color: string;
  requiredPoints: number;
}

// 奖励定义
interface Reward {
  id: string;
  title: string;
  description: string;
  cost: number;
  icon: React.ReactNode;
  isAvailable: boolean;
}

// 徽章接口
interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string; // 对应Material-UI图标名称
  category: 'learning' | 'engagement' | 'milestone';
  level: 1 | 2 | 3 | 4 | 5; // 徽章级别，1-5
  unlocked: boolean; // 是否已解锁
  progress: number; // 解锁进度百分比 0-100
  unlockedAt?: string; // 解锁日期，如果已解锁
  requirement: string; // 解锁要求
}

// 成就统计接口
interface AchievementStats {
  totalBadges: number;
  unlockedBadges: number;
  learningBadges: number;
  engagementBadges: number;
  milestoneBadges: number;
  recentlyUnlocked: Badge[];
  nextMilestones: Badge[];
}

interface AchievementCenterProps {
  userId: string;
  onAchievementEarned?: (achievement: Achievement) => void;
}

// 获取徽章图标组件
const getBadgeIcon = (iconName: string, level: number) => {
  const iconSize = level > 3 ? 'large' : 'medium';
  const iconProps = { fontSize: iconSize as any };
  
  switch(iconName) {
    case 'School': return <SchoolIcon {...iconProps} />;
    case 'Timeline': return <TimelineIcon {...iconProps} />;
    case 'LocalFireDepartment': return <FireIcon {...iconProps} />;
    case 'BookmarkBorder': return <BookmarkIcon {...iconProps} />;
    case 'CheckCircle': return <CheckCircleIcon {...iconProps} />;
    case 'TrendingUp': return <TrendingIcon {...iconProps} />;
    case 'Psychology': return <PsychologyIcon {...iconProps} />;
    case 'QuestionAnswer': return <QuestionIcon {...iconProps} />;
    case 'BarChart': return <ChartIcon {...iconProps} />;
    case 'Stars': return <StarsIcon {...iconProps} />;
    default: return <TrophyIcon {...iconProps} />;
  }
};

// 获取徽章等级对应的颜色
const getBadgeLevelColor = (level: number) => {
  switch(level) {
    case 1: return '#8BC34A'; // 浅绿色
    case 2: return '#03A9F4'; // 蓝色
    case 3: return '#9C27B0'; // 紫色
    case 4: return '#FF9800'; // 橙色
    case 5: return '#F44336'; // 红色
    default: return '#757575'; // 灰色
  }
};

// 徽章卡片组件
const BadgeCard: React.FC<{ badge: Badge }> = ({ badge }) => {
  const levelColor = getBadgeLevelColor(badge.level);
  
  return (
    <Card 
      sx={{ 
        position: 'relative',
        height: '100%',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: badge.unlocked ? 'scale(1.03)' : 'none',
        },
        filter: badge.unlocked ? 'none' : 'grayscale(0.8)',
        opacity: badge.unlocked ? 1 : 0.8
      }}
    >
      <CardContent sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box 
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: 1.5,
          }}
        >
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={
              <Chip 
                label={`Lv.${badge.level}`} 
                size="small" 
                sx={{ 
                  bgcolor: levelColor,
                  color: 'white',
                  fontSize: '0.6rem',
                  height: '18px',
                  minWidth: '18px',
                  '& .MuiChip-label': { px: 0.5 }
                }} 
              />
            }
          >
            <Avatar 
              sx={{ 
                width: 56, 
                height: 56, 
                bgcolor: badge.unlocked ? levelColor : 'action.disabledBackground',
                color: badge.unlocked ? 'white' : 'text.disabled',
                mb: 1
              }}
            >
              {badge.unlocked ? (
                getBadgeIcon(badge.icon, badge.level)
              ) : (
                <LockIcon />
              )}
            </Avatar>
          </Badge>
          
          <Typography 
            variant="subtitle1" 
            align="center" 
            sx={{ fontWeight: 'bold', lineHeight: 1.2 }}
          >
            {badge.name}
          </Typography>
          
          <Typography 
            variant="body2" 
            color="textSecondary" 
            align="center" 
            sx={{ 
              fontSize: '0.75rem', 
              mb: 1.5, 
              minHeight: '32px', 
              display: 'flex', 
              alignItems: 'center' 
            }}
          >
            {badge.description}
          </Typography>
        </Box>
        
        {!badge.unlocked && (
          <Box sx={{ width: '100%', mt: 'auto' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="caption" color="textSecondary">
                进度
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {badge.progress}%
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={badge.progress} 
              sx={{ 
                mb: 1,
                height: 6,
                borderRadius: 3,
                bgcolor: 'background.paper',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 3,
                  bgcolor: levelColor,
                }
              }}
            />
            <Typography variant="caption" color="textSecondary">
              {badge.requirement}
            </Typography>
          </Box>
        )}
        
        {badge.unlocked && badge.unlockedAt && (
          <Box sx={{ mt: 'auto', textAlign: 'center' }}>
            <Chip 
              icon={<CheckCircleIcon />} 
              label={`已获得：${badge.unlockedAt}`} 
              size="small" 
              sx={{ fontSize: '0.75rem' }}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

const AchievementCenter: React.FC<AchievementCenterProps> = ({ userId, onAchievementEarned }) => {
  // 状态管理
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState<number>(0);
  const [userPoints, setUserPoints] = useState<number>(0);
  const [userLevel, setUserLevel] = useState<number>(1);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [openRewardDialog, setOpenRewardDialog] = useState<boolean>(false);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [badgeData, setBadgeData] = useState<{
    badges: Badge[];
    stats: AchievementStats;
  } | null>(null);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'learning' | 'engagement' | 'milestone'>('all');

  // 成就等级定义
  const achievementLevels: AchievementLevel[] = [
    { level: 1, name: '初学者', color: '#6c757d', requiredPoints: 0 },
    { level: 2, name: '勤奋学习者', color: '#28a745', requiredPoints: 100 },
    { level: 3, name: '语言探索者', color: '#17a2b8', requiredPoints: 300 },
    { level: 4, name: '英语能手', color: '#007bff', requiredPoints: 600 },
    { level: 5, name: '语言大师', color: '#fd7e14', requiredPoints: 1000 },
    { level: 6, name: '英语专家', color: '#dc3545', requiredPoints: 1500 },
    { level: 7, name: '语言传奇', color: '#9c27b0', requiredPoints: 2200 },
  ];

  // 模拟API调用，获取徽章数据
  const fetchBadges = (userId: string): Promise<{
    badges: Badge[];
    stats: AchievementStats;
  }> => {
    return new Promise((resolve) => {
      // 模拟API延迟
      setTimeout(() => {
        const badges: Badge[] = [
          {
            id: 'first-lesson',
            name: '学习起步',
            description: '完成您的第一节课',
            icon: 'School',
            category: 'milestone',
            level: 1,
            unlocked: true,
            progress: 100,
            unlockedAt: '2023-11-05',
            requirement: '完成一节课程'
          },
          {
            id: 'streak-7',
            name: '稳定学习者',
            description: '连续学习7天',
            icon: 'Timeline',
            category: 'learning',
            level: 2,
            unlocked: true,
            progress: 100,
            unlockedAt: '2023-11-12',
            requirement: '连续学习7天'
          },
          {
            id: 'streak-30',
            name: '学习大师',
            description: '连续学习30天',
            icon: 'LocalFireDepartment',
            category: 'learning',
            level: 4,
            unlocked: false,
            progress: 43,
            requirement: '连续学习30天'
          },
          {
            id: 'sentences-100',
            name: '句子收藏家',
            description: '学习100个句子',
            icon: 'BookmarkBorder',
            category: 'milestone',
            level: 3,
            unlocked: true,
            progress: 100,
            unlockedAt: '2023-11-20',
            requirement: '学习100个句子'
          },
          {
            id: 'sentences-500',
            name: '句子大师',
            description: '学习500个句子',
            icon: 'BookmarkBorder',
            category: 'milestone',
            level: 4,
            unlocked: false,
            progress: 68,
            requirement: '学习500个句子'
          },
          {
            id: 'accuracy-90',
            name: '精准翻译者',
            description: '在测试中达到90%以上的准确率',
            icon: 'CheckCircle',
            category: 'learning',
            level: 3,
            unlocked: false,
            progress: 82,
            requirement: '在至少10次测试中达到90%以上的准确率'
          },
          {
            id: 'challenge-5',
            name: '挑战接受者',
            description: '完成5项学习挑战',
            icon: 'TrendingUp',
            category: 'engagement',
            level: 2,
            unlocked: true,
            progress: 100,
            unlockedAt: '2023-11-18',
            requirement: '完成5项学习挑战'
          },
          {
            id: 'challenge-20',
            name: '挑战征服者',
            description: '完成20项学习挑战',
            icon: 'TrendingUp',
            category: 'engagement',
            level: 4,
            unlocked: false,
            progress: 35,
            requirement: '完成20项学习挑战'
          },
          {
            id: 'grammar-master',
            name: '语法大师',
            description: '掌握所有基础语法规则',
            icon: 'Psychology',
            category: 'learning',
            level: 5,
            unlocked: false,
            progress: 48,
            requirement: '完成所有基础语法课程并在测试中获得85%以上的分数'
          },
          {
            id: 'conversation-starter',
            name: '对话发起者',
            description: '参与10次AI对话练习',
            icon: 'QuestionAnswer',
            category: 'engagement',
            level: 3,
            unlocked: false,
            progress: 60,
            requirement: '完成10次AI对话练习'
          },
          {
            id: 'analytics-user',
            name: '数据分析者',
            description: '使用分析工具查看您的学习进度25次',
            icon: 'BarChart',
            category: 'engagement',
            level: 2,
            unlocked: true,
            progress: 100,
            unlockedAt: '2023-11-25',
            requirement: '使用分析工具查看您的学习进度25次'
          },
          {
            id: 'perfect-week',
            name: '完美一周',
            description: '一周内每天都达到学习目标',
            icon: 'Stars',
            category: 'learning',
            level: 3,
            unlocked: true,
            progress: 100,
            unlockedAt: '2023-12-03',
            requirement: '连续7天达到每日学习目标'
          }
        ];

        const unlockedBadges = badges.filter(badge => badge.unlocked);
        
        const stats: AchievementStats = {
          totalBadges: badges.length,
          unlockedBadges: unlockedBadges.length,
          learningBadges: badges.filter(badge => badge.category === 'learning' && badge.unlocked).length,
          engagementBadges: badges.filter(badge => badge.category === 'engagement' && badge.unlocked).length,
          milestoneBadges: badges.filter(badge => badge.category === 'milestone' && badge.unlocked).length,
          recentlyUnlocked: unlockedBadges.sort((a, b) => 
            new Date(b.unlockedAt || '').getTime() - new Date(a.unlockedAt || '').getTime()
          ).slice(0, 3),
          nextMilestones: badges
            .filter(badge => !badge.unlocked)
            .sort((a, b) => b.progress - a.progress)
            .slice(0, 3)
        };

        resolve({ badges, stats });
      }, 1500);
    });
  };

  useEffect(() => {
    const loadBadgeData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchBadges(userId);
        setBadgeData(data);
        setError(null);
      } catch (err) {
        setError('无法加载成就数据，请稍后再试。');
        console.error('Error loading badges:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadBadgeData();
  }, [userId]);

  // 计算完成的成就数量
  const completedAchievements = achievements.filter(a => a.isCompleted).length;
  
  // 计算总成就数量
  const totalAchievements = achievements.length;
  
  // 计算完成进度百分比
  const completionPercentage = totalAchievements > 0 
    ? (completedAchievements / totalAchievements) * 100 
    : 0;

  // 计算到下一级别需要的点数
  const nextLevel = achievementLevels.find(level => level.level > userLevel);
  const pointsToNextLevel = nextLevel ? nextLevel.requiredPoints - userPoints : 0;
  const currentLevelInfo = achievementLevels.find(level => level.level === userLevel);
  const nextLevelInfo = achievementLevels.find(level => level.level === userLevel + 1);
  
  // 计算当前等级的进度
  const currentLevelProgress = nextLevelInfo && currentLevelInfo 
    ? ((userPoints - currentLevelInfo.requiredPoints) / (nextLevelInfo.requiredPoints - currentLevelInfo.requiredPoints)) * 100
    : 100;

  // 处理标签页更改
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  // 处理成就详情展示
  const handleAchievementClick = (achievement: Achievement) => {
    setSelectedAchievement(achievement);
  };

  // 关闭成就详情对话框
  const handleCloseAchievementDialog = () => {
    setSelectedAchievement(null);
  };

  // 处理奖励兑换
  const handleRewardClick = (reward: Reward) => {
    setSelectedReward(reward);
    setOpenRewardDialog(true);
  };

  // 关闭奖励对话框
  const handleCloseRewardDialog = () => {
    setOpenRewardDialog(false);
    setSelectedReward(null);
  };

  // 兑换奖励
  const handleClaimReward = () => {
    if (selectedReward && userPoints >= selectedReward.cost) {
      // 更新用户积分
      setUserPoints(prevPoints => prevPoints - selectedReward.cost);
      
      // 更新奖励状态（在实际应用中，这里会调用API）
      
      // 关闭对话框
      handleCloseRewardDialog();
      
      // 显示成功消息
      alert(`成功兑换：${selectedReward.title}`);
    }
  };

  // 获取当前展示的成就
  const getFilteredAchievements = () => {
    if (currentTab === 0) return achievements;
    
    const categories: Record<number, Achievement['category']> = {
      1: 'daily',
      2: 'milestone',
      3: 'skill',
      4: 'special'
    };
    
    return achievements.filter(a => a.category === categories[currentTab]);
  };

  // 获取成就等级样式
  const getLevelStyle = (level: number) => {
    const levelInfo = achievementLevels.find(l => l.level === level);
    return {
      backgroundColor: levelInfo?.color || '#6c757d',
      color: '#fff',
      padding: '2px 6px',
      borderRadius: '4px',
      fontSize: '0.7rem',
      fontWeight: 'bold'
    };
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" p={3}>
        <Typography color="error">加载失败: {error}</Typography>
        <Button variant="contained" color="primary" onClick={() => window.location.reload()}>
          重试
        </Button>
      </Box>
    );
  }

  if (!badgeData) {
    return (
      <Alert severity="info" sx={{ mt: 2 }}>
        没有可用的成就数据。
      </Alert>
    );
  }

  const { badges, stats } = badgeData;

  const filteredBadges = badges.filter(badge => 
    selectedCategory === 'all' ? true : badge.category === selectedCategory
  );

  const unlockedBadges = filteredBadges.filter(badge => badge.unlocked);
  const lockedBadges = filteredBadges.filter(badge => !badge.unlocked);

  return (
    <Container maxWidth="lg">
      {/* 成就概览 */}
      <Card sx={{ mb: 4, mt: 2, p: 2 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box display="flex" alignItems="center">
                <Avatar 
                  sx={{ 
                    bgcolor: currentLevelInfo?.color || 'primary.main', 
                    width: 64, 
                    height: 64,
                    mr: 2
                  }}
                >
                  <Typography variant="h4">{userLevel}</Typography>
                </Avatar>
                <Box>
                  <Typography variant="h5" component="div">
                    {currentLevelInfo?.name || '初学者'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    成就点数: {userPoints}
                  </Typography>
                  {nextLevelInfo && (
                    <Typography variant="caption">
                      距离 {nextLevelInfo.name} 还需 {pointsToNextLevel} 点
                    </Typography>
                  )}
                  <LinearProgress 
                    variant="determinate" 
                    value={currentLevelProgress} 
                    sx={{ mt: 1, height: 8, borderRadius: 2 }} 
                  />
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box display="flex" justifyContent="space-around" alignItems="center" height="100%">
                <Box textAlign="center">
                  <Typography variant="h3" color="primary">{completedAchievements}</Typography>
                  <Typography variant="body2">已完成成就</Typography>
                </Box>
                <Box textAlign="center">
                  <CircularProgress 
                    variant="determinate" 
                    value={completionPercentage} 
                    size={70} 
                    thickness={5}
                    sx={{ color: 'success.main' }}
                  />
                  <Typography variant="body2" sx={{ mt: 1 }}>完成进度</Typography>
                </Box>
                <Box textAlign="center">
                  <Typography variant="h3" color="secondary">{totalAchievements - completedAchievements}</Typography>
                  <Typography variant="body2">待完成成就</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* 成就选项卡 */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={currentTab} 
          onChange={handleTabChange} 
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="全部成就" />
          <Tab label="日常成就" />
          <Tab label="里程碑" />
          <Tab label="技能成就" />
          <Tab label="特殊成就" />
          <Tab label="奖励兑换" />
        </Tabs>
      </Box>

      {/* 成就列表 */}
      {currentTab !== 5 ? (
        <Grid container spacing={3}>
          {getFilteredAchievements().map((achievement) => (
            <Grid item xs={12} sm={6} md={4} key={achievement.id}>
              <Card 
                sx={{ 
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 3
                  },
                  opacity: achievement.isLocked ? 0.7 : 1
                }}
                onClick={() => handleAchievementClick(achievement)}
              >
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Box display="flex" alignItems="center">
                      <Box mr={1}>
                        {achievement.isLocked ? (
                          <LockIcon color="action" />
                        ) : (
                          achievement.icon
                        )}
                      </Box>
                      <Typography variant="subtitle1" component="div">
                        {achievement.title}
                      </Typography>
                    </Box>
                    <Box>
                      <Chip 
                        label={`