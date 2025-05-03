'use client';

import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Breadcrumbs, 
  Link as MuiLink, 
  Button, 
  Grid, 
  Paper, 
  Card, 
  CardContent,
  Tabs,
  Tab,
  Divider,
  CircularProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Avatar
} from '@mui/material';
import { 
  Home as HomeIcon,
  EmojiEvents as TrophyIcon,
  Timeline as TimelineIcon,
  School as SchoolIcon,
  Psychology as PsychologyIcon,
  Share as ShareIcon,
  Download as DownloadIcon,
  Close as CloseIcon,
  ContentCopy as CopyIcon
} from '@mui/icons-material';
import Link from 'next/link';
import AchievementCenter from '@/components/learning/AchievementCenter';

// Achievement类型定义（与组件内部使用的保持一致）
interface Achievement {
  id: string;
  title: string;
  description: string;
  category: string;
  rarity: string;
  iconPath: string;
  pointsAwarded: number;
  isUnlocked: boolean;
  unlockedDate?: string;
  progress: number;
  progressTarget: number;
  progressText: string;
  rewards?: string[];
}

/**
 * 成就中心页面
 * 展示用户的学习成就、徽章和奖励
 */
export default function AchievementsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({
    totalAchievements: 0,
    unlockedAchievements: 0,
    totalPoints: 0,
    level: 0
  });
  
  // 分享对话框状态
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [shareCopied, setShareCopied] = useState(false);
  
  // 证书状态
  const [certificateUrl, setCertificateUrl] = useState('');
  
  // 用户ID - 实际应用中应从认证上下文获取
  const userId = "current-user-id";
  
  useEffect(() => {
    // 模拟加载用户成就统计数据
    const loadAchievementStats = async () => {
      setIsLoading(true);
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // 模拟数据
      setStats({
        totalAchievements: 24,
        unlockedAchievements: 8,
        totalPoints: 850,
        level: 3
      });
      
      // 模拟证书URL
      setCertificateUrl('/certificates/english-learning-progress.pdf');
      
      setIsLoading(false);
    };
    
    loadAchievementStats();
  }, []);
  
  // 处理成就解锁回调
  const handleAchievementUnlocked = (achievement: Achievement) => {
    console.log('解锁新成就:', achievement);
    // 更新统计数据
    setStats(prev => ({
      ...prev,
      unlockedAchievements: prev.unlockedAchievements + 1,
      totalPoints: prev.totalPoints + achievement.pointsAwarded
    }));
  };
  
  // 处理分享成就
  const handleShareAchievements = () => {
    // 生成分享链接
    const shareUrl = `${window.location.origin}/shared/achievements/${userId}`;
    setShareLink(shareUrl);
    setShareDialogOpen(true);
  };
  
  // 处理复制分享链接
  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(shareLink)
      .then(() => {
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2000);
      })
      .catch(err => {
        console.error('复制失败:', err);
      });
  };
  
  // 处理下载证书
  const handleDownloadCertificate = () => {
    if (certificateUrl) {
      window.open(certificateUrl, '_blank');
    }
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* 面包屑导航 */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Breadcrumbs aria-label="breadcrumb">
          <MuiLink 
            component={Link}
            href="/" 
            color="inherit" 
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            首页
          </MuiLink>
          <MuiLink
            component={Link}
            href="/dashboard"
            color="inherit"
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <SchoolIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            学习中心
          </MuiLink>
          <Typography 
            color="text.primary"
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <TrophyIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            成就中心
          </Typography>
        </Breadcrumbs>
        
        <Box>
          <Button 
            startIcon={<ShareIcon />} 
            onClick={handleShareAchievements}
            sx={{ mr: 1 }}
          >
            分享成就
          </Button>
          <Button 
            startIcon={<DownloadIcon />} 
            onClick={handleDownloadCertificate}
            variant="contained"
            disabled={!certificateUrl}
          >
            下载证书
          </Button>
        </Box>
      </Box>
      
      {/* 页面标题和描述 */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          mb: 4, 
          borderRadius: 2,
          background: 'linear-gradient(135deg, #5c6bc0 0%, #3949ab 100%)',
          color: 'white'
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={8}>
            <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
              学习成就中心
            </Typography>
            <Typography variant="body1">
              跟踪您的学习旅程，展示已获得的成就和徽章。继续学习解锁更多成就，提升您的英语水平！
              每一枚徽章都是您学习进步的见证，激励着您不断前行。
            </Typography>
          </Grid>
          <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
            {isLoading ? (
              <CircularProgress size={100} sx={{ color: 'white' }} />
            ) : (
              <Box>
                <Box 
                  sx={{ 
                    width: 120, 
                    height: 120, 
                    borderRadius: '50%', 
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    margin: '0 auto',
                    border: '4px solid white'
                  }}
                >
                  <Typography variant="h3" fontWeight="bold">
                    {stats.level}
                  </Typography>
                  <Typography variant="body2">
                    等级
                  </Typography>
                </Box>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
                  <Chip 
                    label={`${stats.unlockedAchievements}/${stats.totalAchievements} 成就`} 
                    sx={{ bgcolor: 'rgba(255,255,255,0.3)', color: 'white' }}
                  />
                  <Chip 
                    label={`${stats.totalPoints} 积分`} 
                    sx={{ bgcolor: 'rgba(255,255,255,0.3)', color: 'white' }}
                  />
                </Box>
              </Box>
            )}
          </Grid>
        </Grid>
      </Paper>
      
      {/* 成就中心组件 */}
      <Box>
        <AchievementCenter 
          userId={userId} 
          onAchievementUnlocked={handleAchievementUnlocked}
        />
      </Box>
      
      {/* 额外信息 */}
      <Grid container spacing={3} sx={{ mt: 4 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SchoolIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">
                  为什么成就很重要?
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body2">
                成就系统是保持学习动力的强大工具。通过将学习过程游戏化，让您在学习过程中获得成就感，
                激励持续学习。研究表明，明确的目标和及时的奖励能显著提高学习效果和学习坚持度。
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TimelineIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">
                  成就等级系统
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body2" component="div">
                我们的成就分为四个等级:
                <ul style={{ paddingLeft: '20px', marginTop: '8px', marginBottom: '8px' }}>
                  <li><b>普通成就</b>: 基础学习里程碑</li>
                  <li><b>稀有成就</b>: 需要一定努力才能获得</li>
                  <li><b>史诗成就</b>: 需要持续学习和技能掌握</li>
                  <li><b>传奇成就</b>: 最高级别成就，展示卓越学习成果</li>
                </ul>
                每个等级的成就都有不同的奖励和徽章。
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PsychologyIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">
                  如何解锁更多成就?
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body2" component="div">
                以下是解锁更多成就的方法:
                <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
                  <li>每天坚持学习，提高连续学习天数</li>
                  <li>尝试不同类型的学习模式和练习</li>
                  <li>参与社区活动和讨论</li>
                  <li>完成挑战任务</li>
                  <li>提高各项技能的掌握程度</li>
                </ul>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* 分享对话框 */}
      <Dialog
        open={shareDialogOpen}
        onClose={() => setShareDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">分享您的学习成就</Typography>
            <IconButton onClick={() => setShareDialogOpen(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" gutterBottom>
            分享您的学习成就，激励您的朋友也开始学习之旅！
          </Typography>
          
          <Box sx={{ mt: 2, mb: 3, display: 'flex', alignItems: 'center' }}>
            <Box sx={{ mr: 2 }}>
              <Avatar sx={{ bgcolor: 'primary.main', width: 64, height: 64 }}>
                <TrophyIcon sx={{ fontSize: 36 }} />
              </Avatar>
            </Box>
            <Box>
              <Typography variant="subtitle1">
                学习者: {userId}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                等级: {stats.level} | 已解锁成就: {stats.unlockedAchievements} | 积分: {stats.totalPoints}
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              分享链接:
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                value={shareLink}
                InputProps={{
                  readOnly: true,
                  sx: { pr: 0 }
                }}
                sx={{ mr: 1 }}
              />
              <Button 
                variant="contained" 
                onClick={handleCopyShareLink}
                startIcon={<CopyIcon />}
                color={shareCopied ? "success" : "primary"}
              >
                {shareCopied ? "已复制" : "复制"}
              </Button>
            </Box>
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="subtitle2" gutterBottom>
            分享到社交媒体:
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
            <Button variant="outlined" fullWidth>
              微信
            </Button>
            <Button variant="outlined" fullWidth>
              微博
            </Button>
            <Button variant="outlined" fullWidth>
              QQ
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShareDialogOpen(false)}>
            关闭
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
} 