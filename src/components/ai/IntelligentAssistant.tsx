import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  IconButton,
  Tooltip,
  Tabs,
  Tab,
  Divider,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar
} from '@mui/material';
import {
  Psychology as PsychologyIcon,
  School as SchoolIcon,
  Book as BookIcon,
  Translate as TranslateIcon,
  Analytics as AnalyticsIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  AutoStories as AutoStoriesIcon,
  Quiz as QuizIcon,
  RecordVoiceOver as RecordVoiceOverIcon,
  VideoLibrary as VideoLibraryIcon,
  Forum as ForumIcon,
  Mic as MicIcon,
  Headphones as HeadphonesIcon,
  ImageSearch as ImageSearchIcon
} from '@mui/icons-material';

import EnhancedAITutor from './EnhancedAITutor';

// 定义学习工具接口
interface LearningTool {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  comingSoon?: boolean;
}

// 定义学习建议接口
interface LearningRecommendation {
  id: string;
  type: 'vocabulary' | 'grammar' | 'listening' | 'speaking' | 'reading';
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // 分钟
  resourceLink?: string;
}

// 组件属性
interface IntelligentAssistantProps {
  userId?: string;
  learningProfile?: {
    level: 'beginner' | 'intermediate' | 'advanced';
    interests: string[];
    goals: string[];
    preferredLearningStyle?: 'visual' | 'auditory' | 'reading/writing' | 'kinesthetic';
  };
}

// 智能助手组件
const IntelligentAssistant: React.FC<IntelligentAssistantProps> = ({
  userId,
  learningProfile = {
    level: 'intermediate',
    interests: ['旅行', '商务', '日常对话'],
    goals: ['流利口语', '阅读理解能力提升'],
    preferredLearningStyle: 'visual'
  }
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // 状态管理
  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [recommendations, setRecommendations] = useState<LearningRecommendation[]>([]);
  
  // 学习工具列表
  const learningTools: LearningTool[] = [
    {
      id: 'ai-tutor',
      name: 'AI会话辅导',
      description: '与AI进行对话练习，获得实时反馈和建议',
      icon: <PsychologyIcon />,
      color: theme.palette.primary.main
    },
    {
      id: 'vocabulary-helper',
      name: '词汇学习助手',
      description: '个性化词汇学习与记忆，智能复习计划',
      icon: <BookIcon />,
      color: '#4caf50'
    },
    {
      id: 'grammar-analyzer',
      name: '语法分析器',
      description: '深入分析常见语法错误，提供针对性练习',
      icon: <SchoolIcon />,
      color: '#ff9800'
    },
    {
      id: 'pronunciation-coach',
      name: '发音教练',
      description: '语音识别技术进行发音评估和纠正',
      icon: <MicIcon />,
      color: '#e91e63'
    },
    {
      id: 'listening-trainer',
      name: '听力训练',
      description: '根据能力自动调整难度的听力材料和练习',
      icon: <HeadphonesIcon />,
      color: '#2196f3'
    },
    {
      id: 'visual-learning',
      name: '视觉学习',
      description: '图像识别与图像辅助学习',
      icon: <ImageSearchIcon />,
      color: '#9c27b0',
      comingSoon: true
    }
  ];
  
  // 获取学习建议
  useEffect(() => {
    setIsLoading(true);
    
    // 模拟API请求
    setTimeout(() => {
      const mockRecommendations: LearningRecommendation[] = [
        {
          id: 'rec1',
          type: 'grammar',
          title: '过去完成时专项训练',
          description: '根据您的错误模式分析，建议强化过去完成时的使用',
          difficulty: 'intermediate',
          estimatedTime: 15,
          resourceLink: '/lessons/grammar/past-perfect'
        },
        {
          id: 'rec2',
          type: 'vocabulary',
          title: '商务会议词汇',
          description: '基于您的兴趣和目标，推荐商务会议中的常用词汇',
          difficulty: 'intermediate',
          estimatedTime: 20,
          resourceLink: '/vocabulary/business-meetings'
        },
        {
          id: 'rec3',
          type: 'listening',
          title: '旅行场景听力练习',
          description: '与您的兴趣匹配的旅行场景对话听力',
          difficulty: 'intermediate',
          estimatedTime: 25,
          resourceLink: '/listening/travel-dialogues'
        },
        {
          id: 'rec4',
          type: 'speaking',
          title: '日常对话表达练习',
          description: '提高日常对话表达的流利度',
          difficulty: 'intermediate',
          estimatedTime: 15,
          resourceLink: '/speaking/daily-conversations'
        }
      ];
      
      setRecommendations(mockRecommendations);
      setIsLoading(false);
    }, 1200);
  }, []);
  
  // 处理标签切换
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };
  
  // 获取难度标签颜色
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return theme.palette.success.main;
      case 'intermediate': return theme.palette.warning.main;
      case 'advanced': return theme.palette.error.main;
      default: return theme.palette.primary.main;
    }
  };
  
  // 获取类型图标
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'vocabulary': return <BookIcon />;
      case 'grammar': return <SchoolIcon />;
      case 'listening': return <HeadphonesIcon />;
      case 'speaking': return <RecordVoiceOverIcon />;
      case 'reading': return <AutoStoriesIcon />;
      default: return <BookIcon />;
    }
  };
  
  // 移动端侧边栏内容
  const drawerContent = (
    <Box sx={{ width: 250 }} role="presentation">
      <List>
        {learningTools.map((tool) => (
          <ListItemButton 
            key={tool.id}
            disabled={tool.comingSoon}
            sx={{ opacity: tool.comingSoon ? 0.6 : 1 }}
          >
            <ListItemIcon sx={{ color: tool.color }}>
              {tool.icon}
            </ListItemIcon>
            <ListItemText 
              primary={tool.name}
              secondary={tool.comingSoon ? "即将推出" : null}
            />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* 移动端顶部栏 */}
      {isMobile && (
        <AppBar position="static" color="default" elevation={0}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={() => setMobileDrawerOpen(true)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              智能学习助手
            </Typography>
            <IconButton color="inherit">
              <NotificationsIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      )}
      
      {/* 移动端抽屉 */}
      <Drawer
        anchor="left"
        open={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
          <IconButton onClick={() => setMobileDrawerOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        {drawerContent}
      </Drawer>
      
      {/* 主要内容 */}
      <Container 
        maxWidth="lg" 
        sx={{ 
          flexGrow: 1, 
          py: 3,
          display: 'flex',
          flexDirection: 'column',
          height: isMobile ? 'calc(100% - 64px)' : '100%'
        }}
      >
        <Grid container spacing={3} sx={{ height: '100%' }}>
          {/* 侧边栏 - 仅在非移动端显示 */}
          {!isMobile && (
            <Grid item xs={12} md={3} lg={2.5} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Paper 
                elevation={0} 
                variant="outlined" 
                sx={{ 
                  p: 2, 
                  height: '100%', 
                  borderRadius: 2,
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                  学习工具
                </Typography>
                
                <List sx={{ flexGrow: 1 }}>
                  {learningTools.map((tool) => (
                    <ListItemButton 
                      key={tool.id}
                      disabled={tool.comingSoon}
                      sx={{ 
                        borderRadius: 1,
                        mb: 1, 
                        opacity: tool.comingSoon ? 0.6 : 1,
                        '&:hover': {
                          bgcolor: `${tool.color}10`
                        }
                      }}
                    >
                      <ListItemIcon sx={{ color: tool.color, minWidth: 40 }}>
                        {tool.icon}
                      </ListItemIcon>
                      <ListItemText 
                        primary={
                          <Typography variant="body2" fontWeight="medium">
                            {tool.name}
                          </Typography>
                        }
                        secondary={
                          tool.comingSoon ? (
                            <Typography variant="caption" color="text.secondary">
                              即将推出
                            </Typography>
                          ) : null
                        }
                      />
                    </ListItemButton>
                  ))}
                </List>
                
                <Divider sx={{ my: 2 }} />
                
                <Button
                  variant="outlined"
                  startIcon={<SettingsIcon />}
                  size="small"
                  fullWidth
                >
                  学习设置
                </Button>
              </Paper>
            </Grid>
          )}
          
          {/* 主要内容区域 */}
          <Grid item xs={12} md={9} lg={9.5} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* 标签导航 */}
            <Paper elevation={0} variant="outlined" sx={{ borderRadius: 2, mb: 3 }}>
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                variant={isMobile ? "scrollable" : "fullWidth"}
                scrollButtons={isMobile ? "auto" : false}
                sx={{ px: 2 }}
              >
                <Tab icon={<PsychologyIcon />} label="AI辅导" />
                <Tab icon={<AnalyticsIcon />} label="学习建议" />
                <Tab icon={<SchoolIcon />} label="学习进度" />
                <Tab icon={<ForumIcon />} label="社区讨论" />
              </Tabs>
            </Paper>
            
            {/* 标签内容 */}
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
              {/* AI辅导标签内容 */}
              {activeTab === 0 && (
                <Box sx={{ height: '100%' }}>
                  <EnhancedAITutor 
                    userId={userId}
                    learningLevel={learningProfile.level}
                    focusArea={learningProfile.interests}
                    showAnalytics={true}
                  />
                </Box>
              )}
              
              {/* 学习建议标签内容 */}
              {activeTab === 1 && (
                <Paper 
                  elevation={0} 
                  variant="outlined" 
                  sx={{ 
                    p: 3, 
                    height: '100%', 
                    borderRadius: 2,
                    overflowY: 'auto'
                  }}
                >
                  <Typography variant="h5" gutterBottom fontWeight="bold">
                    个性化学习建议
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" paragraph>
                    基于您的学习历史、兴趣和目标，我们为您提供以下学习建议
                  </Typography>
                  
                  {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <Grid container spacing={3}>
                      {recommendations.map((rec) => (
                        <Grid item xs={12} sm={6} key={rec.id}>
                          <Card 
                            elevation={0} 
                            variant="outlined" 
                            sx={{ 
                              height: '100%',
                              display: 'flex',
                              flexDirection: 'column',
                              borderRadius: 2,
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                boxShadow: 3
                              }
                            }}
                          >
                            <Box 
                              sx={{ 
                                display: 'flex', 
                                p: 2, 
                                bgcolor: `${getDifficultyColor(rec.difficulty)}10` 
                              }}
                            >
                              <Box sx={{ mr: 2, color: getDifficultyColor(rec.difficulty) }}>
                                {getTypeIcon(rec.type)}
                              </Box>
                              <Box>
                                <Typography variant="subtitle1" fontWeight="medium">
                                  {rec.title}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {rec.type.charAt(0).toUpperCase() + rec.type.slice(1)} · {rec.difficulty.charAt(0).toUpperCase() + rec.difficulty.slice(1)} · 约{rec.estimatedTime}分钟
                                </Typography>
                              </Box>
                            </Box>
                            
                            <CardContent sx={{ flexGrow: 1 }}>
                              <Typography variant="body2" color="text.secondary">
                                {rec.description}
                              </Typography>
                            </CardContent>
                            
                            <Box sx={{ p: 2, pt: 0 }}>
                              <Button 
                                variant="outlined" 
                                size="small" 
                                fullWidth
                                color="primary"
                              >
                                开始学习
                              </Button>
                            </Box>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </Paper>
              )}
              
              {/* 学习进度标签内容 */}
              {activeTab === 2 && (
                <Paper 
                  elevation={0} 
                  variant="outlined" 
                  sx={{ 
                    p: 3, 
                    height: '100%', 
                    borderRadius: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <AnalyticsIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" align="center" gutterBottom>
                    学习进度追踪即将推出
                  </Typography>
                  <Typography variant="body2" color="text.secondary" align="center" sx={{ maxWidth: 400 }}>
                    我们正在开发更全面的学习进度追踪功能，将为您提供详细的学习数据分析和可视化统计。敬请期待！
                  </Typography>
                </Paper>
              )}
              
              {/* 社区讨论标签内容 */}
              {activeTab === 3 && (
                <Paper 
                  elevation={0} 
                  variant="outlined" 
                  sx={{ 
                    p: 3, 
                    height: '100%', 
                    borderRadius: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <ForumIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" align="center" gutterBottom>
                    学习社区即将推出
                  </Typography>
                  <Typography variant="body2" color="text.secondary" align="center" sx={{ maxWidth: 400 }}>
                    连接全球学习者，分享学习资源，解答疑问，共同进步。我们的学习社区功能即将上线，敬请期待！
                  </Typography>
                </Paper>
              )}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default IntelligentAssistant; 