'use client';

import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Tabs, 
  Tab, 
  Avatar, 
  Divider, 
  Button, 
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Skeleton,
  Alert,
  useTheme
} from '@mui/material';
import { 
  Person as PersonIcon,
  Edit as EditIcon,
  Forum as ForumIcon,
  Book as BookIcon,
  EmojiEvents as TrophyIcon,
  MenuBook as MenuBookIcon,
  Bookmark as BookmarkIcon
} from '@mui/icons-material';
import ReputationDisplay from '@/components/community/ReputationDisplay';
import { useUserReputation } from '@/services/communityReputationService';

// 选项卡接口
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// 选项卡面板
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

// 选项卡标签辅助函数
function a11yProps(index: number) {
  return {
    id: `profile-tab-${index}`,
    'aria-controls': `profile-tabpanel-${index}`,
  };
}

// 模拟用户信息
const mockUserInfo = {
  id: "user1",
  name: "学习达人",
  bio: "热爱学习英语的爱好者，专注于提升口语和听力能力。喜欢在社区分享学习经验和心得。",
  joinDate: "2023-05-15T08:30:00Z",
  avatarUrl: "/images/avatar.jpg",
  stats: {
    posts: 42,
    comments: 156,
    resources: 8,
    helped: 64
  }
};

// 模拟活动数据
const mockActivities = [
  { id: 1, type: "post", title: "如何高效记忆英语单词？", date: "2024-04-15T14:30:00Z", likes: 24 },
  { id: 2, type: "comment", title: "回复：英语听力练习方法", date: "2024-04-14T09:45:00Z", likes: 8 },
  { id: 3, type: "resource", title: "上传资源：英语口语练习材料", date: "2024-04-12T16:20:00Z", likes: 32 },
  { id: 4, type: "post", title: "分享我的英语学习计划", date: "2024-04-10T11:15:00Z", likes: 19 },
  { id: 5, type: "comment", title: "回复：如何提高阅读理解速度", date: "2024-04-08T13:50:00Z", likes: 5 }
];

/**
 * 用户社区资料页面
 * 展示用户社区信息和声誉
 */
export default function UserProfilePage({ params }: { params: { userId: string } }) {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [userInfo, setUserInfo] = useState(mockUserInfo);
  const [activities, setActivities] = useState(mockActivities);
  const [isUserInfoLoading, setIsUserInfoLoading] = useState(false);
  
  // 使用自定义Hook获取用户声誉数据
  const { reputationData, isLoading: isReputationLoading, error: reputationError } = useUserReputation(params.userId);
  
  // 处理选项卡变更
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  // 格式化活动时间
  const formatActivityTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        return `${diffMinutes} 分钟前`;
      }
      return `${diffHours} 小时前`;
    } else if (diffDays < 7) {
      return `${diffDays} 天前`;
    } else {
      return formatDate(dateString);
    }
  };
  
  // 获取活动图标
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'post':
        return <ForumIcon color="primary" />;
      case 'comment':
        return <MenuBookIcon color="secondary" />;
      case 'resource':
        return <BookmarkIcon style={{ color: theme.palette.success.main }} />;
      default:
        return <BookIcon color="primary" />;
    }
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* 用户基本信息卡片 */}
      <Paper 
        variant="outlined" 
        sx={{ 
          p: 3, 
          mb: 4, 
          borderRadius: 2, 
          backgroundColor: theme.palette.background.paper
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} md={3} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            {isUserInfoLoading ? (
              <Skeleton variant="circular" width={120} height={120} sx={{ mx: { xs: 'auto', md: 0 } }} />
            ) : (
              <Avatar 
                src={userInfo.avatarUrl} 
                alt={userInfo.name}
                sx={{ 
                  width: 120, 
                  height: 120, 
                  border: `4px solid ${theme.palette.primary.main}`,
                  mx: { xs: 'auto', md: 0 }
                }}
              />
            )}
          </Grid>
          <Grid item xs={12} md={9}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box>
                {isUserInfoLoading ? (
                  <Skeleton variant="text" width={200} height={40} />
                ) : (
                  <Typography variant="h4" component="h1" fontWeight="bold">
                    {userInfo.name}
                  </Typography>
                )}
                
                {isUserInfoLoading ? (
                  <Skeleton variant="text" width={150} />
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    加入时间: {formatDate(userInfo.joinDate)}
                  </Typography>
                )}
              </Box>
              
              <Button 
                variant="outlined"
                startIcon={<EditIcon />}
                sx={{ display: { xs: 'none', sm: 'flex' } }}
              >
                编辑资料
              </Button>
            </Box>
            
            {isUserInfoLoading ? (
              <Skeleton variant="text" width="100%" height={80} />
            ) : (
              <Typography variant="body1" paragraph>
                {userInfo.bio}
              </Typography>
            )}
            
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" fontWeight="bold">
                    {isUserInfoLoading ? <Skeleton width={30} /> : userInfo.stats.posts}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    发帖
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" fontWeight="bold">
                    {isUserInfoLoading ? <Skeleton width={30} /> : userInfo.stats.comments}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    评论
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" fontWeight="bold">
                    {isUserInfoLoading ? <Skeleton width={30} /> : userInfo.stats.resources}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    分享资源
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" fontWeight="bold">
                    {isUserInfoLoading ? <Skeleton width={30} /> : userInfo.stats.helped}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    帮助他人
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
      
      <Grid container spacing={4}>
        {/* 左侧：声誉信息 */}
        <Grid item xs={12} md={4}>
          {isReputationLoading ? (
            <Card variant="outlined" sx={{ mb: 3 }}>
              <CardContent>
                <Skeleton variant="text" width="60%" height={40} sx={{ mb: 2 }} />
                <Skeleton variant="rectangular" height={200} />
              </CardContent>
            </Card>
          ) : reputationError ? (
            <Alert severity="error" sx={{ mb: 3 }}>
              加载声誉数据失败: {reputationError.message}
            </Alert>
          ) : reputationData ? (
            <ReputationDisplay 
              userId={params.userId}
              currentScore={reputationData.score}
              level={reputationData.level}
              nextLevelScore={reputationData.nextLevelScore}
              progressToNextLevel={reputationData.progressToNextLevel}
              recentChanges={reputationData.recentChanges}
              privileges={reputationData.privileges}
              showHistory={true}
            />
          ) : (
            <Alert severity="info" sx={{ mb: 3 }}>
              该用户尚未获得社区声誉
            </Alert>
          )}
          
          {/* 其他个人资料卡片 */}
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <PersonIcon sx={{ mr: 1 }} />
                用户信息
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText 
                    primary="学习兴趣" 
                    secondary="英语口语、商务英语、语法" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="学习目标" 
                    secondary="流利英语对话、通过商务英语考试" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="英语水平" 
                    secondary="中级 (B1-B2)" 
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
          
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <TrophyIcon sx={{ mr: 1 }} />
                成就徽章
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 1 }}>
                      <ForumIcon />
                    </Avatar>
                    <Typography variant="caption" display="block">
                      讨论达人
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Avatar sx={{ bgcolor: 'secondary.main', mx: 'auto', mb: 1 }}>
                      <MenuBookIcon />
                    </Avatar>
                    <Typography variant="caption" display="block">
                      知识分享者
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Avatar sx={{ bgcolor: 'success.main', mx: 'auto', mb: 1 }}>
                      <BookIcon />
                    </Avatar>
                    <Typography variant="caption" display="block">
                      热心助人
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        
        {/* 右侧：选项卡内容 */}
        <Grid item xs={12} md={8}>
          <Paper variant="outlined" sx={{ borderRadius: 2 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange} 
                aria-label="用户资料选项卡"
                variant="scrollable"
                scrollButtons="auto"
              >
                <Tab label="最近活动" {...a11yProps(0)} />
                <Tab label="发帖" {...a11yProps(1)} />
                <Tab label="评论" {...a11yProps(2)} />
                <Tab label="分享资源" {...a11yProps(3)} />
              </Tabs>
            </Box>
            
            {/* 最近活动选项卡 */}
            <TabPanel value={tabValue} index={0}>
              <List>
                {activities.map((activity) => (
                  <React.Fragment key={activity.id}>
                    <ListItem alignItems="flex-start">
                      <ListItemIcon>
                        {getActivityIcon(activity.type)}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography 
                            variant="body1" 
                            component="span" 
                            fontWeight="medium"
                          >
                            {activity.title}
                          </Typography>
                        }
                        secondary={
                          <React.Fragment>
                            <Typography
                              variant="body2"
                              color="textSecondary"
                              component="span"
                            >
                              {formatActivityTime(activity.date)} · 获赞 {activity.likes}
                            </Typography>
                          </React.Fragment>
                        }
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </React.Fragment>
                ))}
              </List>
              
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Button variant="outlined">
                  查看更多
                </Button>
              </Box>
            </TabPanel>
            
            {/* 发帖选项卡 */}
            <TabPanel value={tabValue} index={1}>
              <Typography variant="body1">
                用户的发帖内容将显示在这里
              </Typography>
            </TabPanel>
            
            {/* 评论选项卡 */}
            <TabPanel value={tabValue} index={2}>
              <Typography variant="body1">
                用户的评论内容将显示在这里
              </Typography>
            </TabPanel>
            
            {/* 分享资源选项卡 */}
            <TabPanel value={tabValue} index={3}>
              <Typography variant="body1">
                用户分享的资源将显示在这里
              </Typography>
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
} 