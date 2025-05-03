'use client';

import React from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Button, 
  Box, 
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Divider,
  useTheme
} from '@mui/material';
import { 
  Forum as ForumIcon, 
  MenuBook as ResourceIcon,
  Group as GroupIcon,
  EmojiEvents as TrophyIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import Link from 'next/link';
import ReputationBadge from '@/components/community/ReputationBadge';
import { useReputationLeaderboard } from '@/services/communityReputationService';

/**
 * 社区首页组件
 */
export default function CommunityPage() {
  const theme = useTheme();
  
  // 使用自定义Hook获取排行榜数据（只获取前5名）
  const { leaderboardData, isLoading } = useReputationLeaderboard(5);
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* 社区欢迎横幅 */}
      <Paper
        elevation={0}
        variant="outlined"
        sx={{
          p: { xs: 3, md: 6 },
          mb: 6,
          borderRadius: 2,
          background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
          color: 'white',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Box sx={{ maxWidth: { md: '60%' }, mb: { xs: 3, md: 0 } }}>
          <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
            欢迎来到英语学习社区
          </Typography>
          <Typography variant="h6" paragraph>
            在这里与全球英语学习者交流，分享学习资源，获取专业指导，共同进步。
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 3 }}>
            <Button 
              variant="contained" 
              color="secondary" 
              size="large"
              href="/community/discussions"
            >
              加入讨论
            </Button>
            <Button 
              variant="outlined" 
              color="inherit" 
              size="large"
              href="/community/leaderboard"
              sx={{ 
                borderColor: 'rgba(255,255,255,0.5)', 
                '&:hover': { 
                  borderColor: 'white', 
                  backgroundColor: 'rgba(255,255,255,0.1)' 
                } 
              }}
            >
              声誉排行榜
            </Button>
          </Box>
        </Box>
        <Box 
          component="img"
          src="/images/community-banner.svg"
          alt="社区交流"
          sx={{ 
            width: { xs: '100%', md: '35%' }, 
            maxWidth: '300px',
            height: 'auto'
          }}
        />
      </Paper>
      
      {/* 主要内容区域 */}
      <Grid container spacing={4}>
        {/* 左侧：社区功能 */}
        <Grid item xs={12} md={8}>
          <Typography variant="h5" component="h2" fontWeight="bold" gutterBottom>
            探索社区
          </Typography>
          
          <Grid container spacing={3}>
            {/* 讨论区卡片 */}
            <Grid item xs={12} sm={6}>
              <Card 
                variant="outlined" 
                sx={{ 
                  height: '100%',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 3
                  }
                }}
              >
                <CardMedia
                  component="img"
                  height="140"
                  image="/images/community-discussion.jpg"
                  alt="讨论区"
                />
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <ForumIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6" component="div">
                      讨论区
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    加入英语学习话题讨论，分享您的学习经验和困惑，获取其他学习者的建议和支持。
                  </Typography>
                  <Button
                    component={Link}
                    href="/community/discussions"
                    endIcon={<ArrowForwardIcon />}
                  >
                    浏览讨论
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            
            {/* 资源库卡片 */}
            <Grid item xs={12} sm={6}>
              <Card 
                variant="outlined" 
                sx={{ 
                  height: '100%',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 3
                  }
                }}
              >
                <CardMedia
                  component="img"
                  height="140"
                  image="/images/community-resources.jpg"
                  alt="资源库"
                />
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <ResourceIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6" component="div">
                      资源库
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    探索用户分享的学习资源，包括学习方法、文章、视频、工具和学习材料等。
                  </Typography>
                  <Button
                    component={Link}
                    href="/community/resources"
                    endIcon={<ArrowForwardIcon />}
                  >
                    浏览资源
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 5 }}>
            <Typography variant="h5" component="h2" fontWeight="bold" gutterBottom>
              最新讨论
            </Typography>
            
            <Card variant="outlined">
              <List>
                {[
                  { id: 1, title: "有哪些好用的英语单词记忆方法？", author: "学习达人", time: "2小时前", replies: 15 },
                  { id: 2, title: "如何提高英语口语流利度？", author: "英语初学者", time: "5小时前", replies: 22 },
                  { id: 3, title: "分享我的英语学习计划和方法", author: "进步飞快", time: "昨天", replies: 8 },
                  { id: 4, title: "求推荐适合初学者的英语原著小说", author: "阅读爱好者", time: "2天前", replies: 12 },
                  { id: 5, title: "如何克服英语学习中的懒惰和拖延？", author: "坚持学习", time: "3天前", replies: 19 }
                ].map((item, index) => (
                  <React.Fragment key={item.id}>
                    <ListItem 
                      alignItems="flex-start"
                      component={Link}
                      href={`/community/discussions/${item.id}`}
                      sx={{ 
                        cursor: 'pointer',
                        '&:hover': { backgroundColor: 'action.hover' }
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar alt={item.author}>
                          {item.author.charAt(0)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={item.title}
                        secondary={
                          <React.Fragment>
                            <Typography
                              sx={{ display: 'inline' }}
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              {item.author}
                            </Typography>
                            {` - ${item.time} - ${item.replies} 回复`}
                          </React.Fragment>
                        }
                      />
                    </ListItem>
                    {index < 4 && <Divider variant="inset" component="li" />}
                  </React.Fragment>
                ))}
              </List>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Button 
                  variant="outlined"
                  component={Link}
                  href="/community/discussions"
                  endIcon={<ArrowForwardIcon />}
                >
                  查看更多讨论
                </Button>
              </Box>
            </Card>
          </Box>
        </Grid>
        
        {/* 右侧：排行榜和活动 */}
        <Grid item xs={12} md={4}>
          {/* 声誉排行榜 */}
          <Card variant="outlined" sx={{ mb: 4 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TrophyIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6" component="h3">
                    声誉排行榜
                  </Typography>
                </Box>
                <Button 
                  size="small"
                  component={Link}
                  href="/community/leaderboard"
                >
                  查看全部
                </Button>
              </Box>
              
              <Divider sx={{ mb: 2 }} />
              
              <List sx={{ mb: 0 }}>
                {isLoading ? (
                  // 加载状态
                  Array.from(new Array(5)).map((_, index) => (
                    <ListItem key={index} alignItems="center">
                      <ListItemAvatar>
                        <Avatar>#{index + 1}</Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={<Box sx={{ height: 20, width: '70%', bgcolor: 'grey.300', borderRadius: 1 }} />}
                        secondary={<Box sx={{ height: 15, width: '40%', bgcolor: 'grey.200', borderRadius: 1, mt: 0.5 }} />}
                      />
                    </ListItem>
                  ))
                ) : leaderboardData && leaderboardData.length > 0 ? (
                  // 有数据
                  leaderboardData.map((user, index) => (
                    <ListItem 
                      key={user.userId}
                      alignItems="center"
                      component={Link}
                      href={`/community/profile/${user.userId}`}
                      sx={{ 
                        cursor: 'pointer',
                        '&:hover': { backgroundColor: 'action.hover' },
                        py: 1.5
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ 
                          bgcolor: index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? '#cd7f32' : 'primary.main',
                          color: index < 3 ? 'black' : 'white',
                          fontWeight: 'bold'
                        }}>
                          #{index + 1}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Typography variant="body1" fontWeight="medium">
                              {user.username}
                            </Typography>
                            <ReputationBadge 
                              level={user.level} 
                              score={user.score} 
                              variant="icon"
                              size="small"
                              showScore={true}
                            />
                          </Box>
                        }
                      />
                    </ListItem>
                  ))
                ) : (
                  // 无数据
                  <ListItem>
                    <ListItemText
                      primary="暂无排行榜数据"
                      secondary="成为第一个上榜的用户"
                    />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
          
          {/* 社区活动 */}
          <Card variant="outlined">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <GroupIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" component="h3">
                  社区活动
                </Typography>
              </Box>
              
              <Divider sx={{ mb: 2 }} />
              
              <List disablePadding>
                {[
                  { id: 1, title: "每周单词挑战", date: "进行中", desc: "7天内学习100个新单词" },
                  { id: 2, title: "英语演讲比赛", date: "4月25日", desc: "在线分享您的英语演讲" },
                  { id: 3, title: "语法讨论小组", date: "每周三", desc: "深入讨论英语语法难点" }
                ].map((activity, index) => (
                  <React.Fragment key={activity.id}>
                    <ListItem 
                      alignItems="flex-start" 
                      disablePadding
                      sx={{ py: 1.5 }}
                    >
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body1" fontWeight="medium">
                              {activity.title}
                            </Typography>
                            <Typography variant="caption" color="primary">
                              {activity.date}
                            </Typography>
                          </Box>
                        }
                        secondary={activity.desc}
                      />
                    </ListItem>
                    {index < 2 && <Divider component="li" />}
                  </React.Fragment>
                ))}
              </List>
              
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Button 
                  variant="outlined"
                  component={Link}
                  href="/community/events"
                  size="small"
                >
                  查看所有活动
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
} 