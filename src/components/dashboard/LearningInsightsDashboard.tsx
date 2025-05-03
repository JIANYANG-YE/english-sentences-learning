import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  CircularProgress, 
  Grid, 
  Typography, 
  Tabs,
  Tab,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper, 
  Button,
  Stack,
  Avatar,
  LinearProgress
} from '@mui/material';
import { 
  TrendingUp,
  TrendingDown,
  AccessTime,
  CheckCircle,
  Warning,
  School,
  CalendarToday,
  Timeline,
  MenuBook,
  Lightbulb,
  LocalLibrary,
  Speed,
  Psychology
} from '@mui/icons-material';
import { learningAnalyticsService } from '@/services/learningAnalyticsService';
import { learningPlanService } from '@/services/learningPlanService';

// 模拟用户ID
const MOCK_USER_ID = 'user-123';

// 仪表板统计卡片组件
interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: number;
  color?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, subtitle, icon, trend, color = 'primary.main' }) => (
  <Card variant="outlined" sx={{ height: '100%' }}>
    <CardContent>
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <Avatar sx={{ bgcolor: color, width: 48, height: 48 }}>
            {icon}
          </Avatar>
        </Grid>
        <Grid item xs>
          <Typography variant="h6" component="div" noWrap>
            {value}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="caption" display="block">
              {subtitle}
            </Typography>
          )}
        </Grid>
        {trend !== undefined && (
          <Grid item>
            {trend > 0 ? (
              <TrendingUp color="success" />
            ) : trend < 0 ? (
              <TrendingDown color="error" />
            ) : null}
            <Typography 
              variant="caption" 
              component="div"
              color={trend > 0 ? 'success.main' : trend < 0 ? 'error.main' : 'text.secondary'}
            >
              {trend > 0 ? '+' : ''}{trend}%
            </Typography>
          </Grid>
        )}
      </Grid>
    </CardContent>
  </Card>
);

// 学习洞察仪表板组件
const LearningInsightsDashboard: React.FC = () => {
  // 状态
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [stats, setStats] = useState<any>(null);
  const [insights, setInsights] = useState<any>(null);
  const [progressReport, setProgressReport] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any>(null);
  const [timeDistribution, setTimeDistribution] = useState<any>(null);
  const [efficiency, setEfficiency] = useState<any>(null);
  const [reviewItems, setReviewItems] = useState<any>(null);

  // 加载用户数据
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        // 并行获取多个数据源
        const [
          userStats,
          userInsights,
          weeklyReport,
          personalRecommendations,
          weeklyTimeDistribution,
          efficiencyData,
          reviewRecommendations
        ] = await Promise.all([
          learningAnalyticsService.getUserStats(MOCK_USER_ID, 'week'),
          learningAnalyticsService.generateInsights(MOCK_USER_ID),
          learningAnalyticsService.generateProgressReport(MOCK_USER_ID, 'week'),
          learningPlanService.getPersonalizedRecommendations(MOCK_USER_ID),
          learningAnalyticsService.getTimeDistribution(MOCK_USER_ID),
          learningAnalyticsService.analyzeEfficiency(MOCK_USER_ID),
          learningAnalyticsService.getReviewRecommendations(MOCK_USER_ID)
        ]);

        setStats(userStats);
        setInsights(userInsights);
        setProgressReport(weeklyReport);
        setRecommendations(personalRecommendations);
        setTimeDistribution(weeklyTimeDistribution);
        setEfficiency(efficiencyData);
        setReviewItems(reviewRecommendations);
      } catch (error) {
        console.error('获取用户数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // 处理标签页切换
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // 渲染统计信息
  const renderStats = () => {
    if (!stats) return null;

    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={3}>
          <StatsCard 
            title="本周学习时间" 
            value={`${stats.totalTimeSpent} 分钟`}
            subtitle={`共 ${stats.totalSessions} 个学习会话`}
            icon={<AccessTime />}
            trend={8}
            color="#3f51b5"
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <StatsCard 
            title="学习单词" 
            value={stats.wordsLearned}
            subtitle="词汇量增长"
            icon={<School />}
            trend={12}
            color="#4caf50"
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <StatsCard 
            title="句子练习" 
            value={stats.sentencesReviewed}
            subtitle="流利度提升"
            icon={<MenuBook />}
            trend={-5}
            color="#ff9800"
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <StatsCard 
            title="正确率" 
            value={`${stats.averageAccuracy}%`}
            subtitle={`连续学习 ${stats.activeDays} 天`}
            icon={<CheckCircle />}
            trend={3}
            color="#f44336"
          />
        </Grid>
      </Grid>
    );
  };

  // 渲染进度报告
  const renderProgressReport = () => {
    if (!progressReport) return null;

    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                本周进度总结
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <AccessTime fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="学习时间"
                    secondary={`${progressReport.summary.timeSpent} 分钟，完成 ${progressReport.summary.sessionsCompleted} 个会话`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <School fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="词汇进度"
                    secondary={`学习了 ${progressReport.summary.wordsLearned} 个单词`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <MenuBook fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="句子复习"
                    secondary={`完成了 ${progressReport.summary.sentencesReviewed} 个句子的练习`}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>

          <Card variant="outlined" sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                学习目标
              </Typography>
              <Typography variant="subtitle2" gutterBottom>
                已完成的目标
              </Typography>
              {progressReport.goals.achieved.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  本周尚未完成学习目标
                </Typography>
              ) : (
                <List dense>
                  {progressReport.goals.achieved.map((goal: any, index: number) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <CheckCircle fontSize="small" color="success" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={goal.goal}
                        secondary={`完成于 ${new Date(goal.achievedDate).toLocaleDateString()}`}
                      />
                    </ListItem>
                  ))}
                </List>
              )}

              <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                进行中的目标
              </Typography>
              <List dense>
                {progressReport.goals.inProgress.map((goal: any, index: number) => (
                  <ListItem key={index}>
                    <ListItemText 
                      primary={goal.goal}
                      secondary={`${goal.progress}% | 剩余: ${goal.remaining}`}
                    />
                    <LinearProgress 
                      variant="determinate" 
                      value={goal.progress} 
                      sx={{ width: 100, ml: 1 }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                课程进度
              </Typography>
              <List dense>
                {progressReport.summary.coursesProgressed.map((course: any) => (
                  <ListItem key={course.courseId}>
                    <ListItemText 
                      primary={course.title}
                      secondary={`完成进度: ${course.progress}%`}
                    />
                    <LinearProgress 
                      variant="determinate" 
                      value={course.progress} 
                      sx={{ width: 100, ml: 1 }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>

          <Card variant="outlined" sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                优势与改进空间
              </Typography>
              <Typography variant="subtitle2" gutterBottom>
                你的优势:
              </Typography>
              <Box sx={{ mb: 2 }}>
                {progressReport.strengths.map((strength: string, index: number) => (
                  <Chip 
                    key={index} 
                    label={strength} 
                    color="success" 
                    size="small" 
                    sx={{ mr: 1, mb: 1 }}
                  />
                ))}
              </Box>

              <Typography variant="subtitle2" gutterBottom>
                需要改进的地方:
              </Typography>
              <Box sx={{ mb: 2 }}>
                {progressReport.areasForImprovement.map((area: string, index: number) => (
                  <Chip 
                    key={index} 
                    label={area} 
                    color="warning" 
                    size="small" 
                    sx={{ mr: 1, mb: 1 }}
                  />
                ))}
              </Box>

              <Typography variant="subtitle2" gutterBottom>
                下一步计划:
              </Typography>
              <List dense>
                {progressReport.nextSteps.map((step: string, index: number) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <Timeline fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={step} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  // 渲染学习洞察
  const renderInsights = () => {
    if (!insights) return null;

    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Speed color="primary" />
                  <span>生产力洞察</span>
                </Stack>
              </Typography>
              <Divider sx={{ my: 1 }} />
              <List dense>
                {insights.productivityInsights.map((insight: any, index: number) => (
                  <ListItem key={index}>
                    <ListItemText 
                      primary={insight.insight}
                      secondary={`置信度: ${insight.confidence.toFixed(2)}`}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <School color="primary" />
                  <span>词汇学习洞察</span>
                </Stack>
              </Typography>
              <Divider sx={{ my: 1 }} />
              <List dense>
                {insights.vocabularyInsights.map((insight: any, index: number) => (
                  <ListItem key={index}>
                    <ListItemText 
                      primary={insight.insight}
                      secondary={`置信度: ${insight.confidence.toFixed(2)}`}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Psychology color="primary" />
                  <span>学习习惯洞察</span>
                </Stack>
              </Typography>
              <Divider sx={{ my: 1 }} />
              <List dense>
                {insights.habitInsights.map((insight: any, index: number) => (
                  <ListItem key={index}>
                    <ListItemText 
                      primary={insight.insight}
                      secondary={`置信度: ${insight.confidence.toFixed(2)}`}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Lightbulb color="primary" />
                  <span>推荐行动</span>
                </Stack>
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Grid container spacing={2}>
                {insights.recommendedActions.map((action: any, index: number) => (
                  <Grid item xs={12} md={6} lg={4} key={index}>
                    <Paper 
                      variant="outlined" 
                      sx={{ 
                        p: 2, 
                        bgcolor: 'background.default',
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%'
                      }}
                    >
                      <Typography 
                        variant="subtitle1" 
                        gutterBottom
                        sx={{ fontWeight: 'bold' }}
                      >
                        {action.action}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ flex: 1 }}
                      >
                        {action.reason}
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        <Chip 
                          label={`优先级: ${action.priority}`} 
                          size="small"
                          color={
                            action.priority > 8 ? 'error' : 
                            action.priority > 5 ? 'warning' : 'info'
                          }
                        />
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  // 渲染推荐内容
  const renderRecommendations = () => {
    if (!recommendations) return null;

    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                推荐课程
              </Typography>
              <List>
                {recommendations.suggestedCourses.map((course: any, index: number) => (
                  <ListItem key={index} sx={{ borderBottom: '1px solid #f0f0f0', py: 1 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                      {index + 1}
                    </Avatar>
                    <ListItemText 
                      primary={course.courseId}
                      secondary={course.reason}
                    />
                    <Button variant="outlined" size="small">
                      查看
                    </Button>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                建议专注的学习领域
              </Typography>
              <List>
                {recommendations.recommendedFocusAreas.map((area: any, index: number) => (
                  <ListItem key={index} sx={{ borderBottom: '1px solid #f0f0f0', py: 1 }}>
                    <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                      {index + 1}
                    </Avatar>
                    <ListItemText 
                      primary={area.area}
                      secondary={area.reason}
                    />
                    <Chip 
                      label="重点关注" 
                      color="primary" 
                      size="small"
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>

          <Card variant="outlined" sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                改善学习习惯的建议
              </Typography>
              <List>
                {recommendations.habitImprovements.map((habit: any, index: number) => (
                  <ListItem key={index} alignItems="flex-start" sx={{ borderBottom: '1px solid #f0f0f0', py: 1 }}>
                    <ListItemIcon>
                      <Lightbulb color="warning" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={habit.suggestion}
                      secondary={`预期影响: ${habit.impact}`}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                时间管理技巧
              </Typography>
              <Grid container spacing={2}>
                {recommendations.timeManagementTips.map((tip: string, index: number) => (
                  <Grid item xs={12} md={6} lg={4} key={index}>
                    <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.default' }}>
                      <Typography variant="body1">
                        {index + 1}. {tip}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  // 渲染"需要复习"的内容
  const renderReviewContent = () => {
    if (!reviewItems) return null;

    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: 'error.main', display: 'flex', alignItems: 'center' }}>
                <Warning sx={{ mr: 1 }} />
                急需复习的内容
              </Typography>
              <List>
                {reviewItems.urgentItems.map((item: any, index: number) => (
                  <ListItem key={index} sx={{ borderBottom: '1px solid #f0f0f0', py: 1 }}>
                    <ListItemText 
                      primary={
                        <Typography variant="body1" noWrap>
                          {item.content}
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography variant="caption" color="text.secondary" component="span">
                            {item.type}
                          </Typography>
                          <Typography variant="caption" color="error" component="span" sx={{ ml: 1 }}>
                            {item.reason}
                          </Typography>
                        </>
                      }
                    />
                    <Button variant="contained" size="small" color="error">
                      立即复习
                    </Button>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>

          <Card variant="outlined" sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                弱项领域
              </Typography>
              <List>
                {reviewItems.weakAreas.map((area: any, index: number) => (
                  <React.Fragment key={index}>
                    <ListItem sx={{ bgcolor: 'background.default' }}>
                      <ListItemText 
                        primary={area.area}
                        primaryTypographyProps={{ fontWeight: 'bold' }}
                      />
                    </ListItem>
                    {area.items.map((item: any, itemIndex: number) => (
                      <ListItem key={`${index}-${itemIndex}`} sx={{ pl: 4 }}>
                        <ListItemText 
                          primary={item.content}
                          primaryTypographyProps={{ variant: 'body2' }}
                        />
                      </ListItem>
                    ))}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <CalendarToday sx={{ mr: 1 }} />
                即将到期复习
              </Typography>
              <List>
                {reviewItems.dueForReview.map((item: any, index: number) => (
                  <ListItem key={index} sx={{ borderBottom: '1px solid #f0f0f0', py: 1 }}>
                    <ListItemText 
                      primary={
                        <Typography variant="body1" noWrap>
                          {item.content}
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography variant="caption" color="text.secondary" component="span">
                            {item.type}
                          </Typography>
                          <Typography variant="caption" component="span" sx={{ ml: 1 }}>
                            到期日: {new Date(item.dueDate).toLocaleDateString()}
                          </Typography>
                        </>
                      }
                    />
                    <Button variant="outlined" size="small">
                      复习
                    </Button>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>

          <Card variant="outlined" sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                复习策略
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.default' }}>
                <Typography variant="subtitle1" gutterBottom>
                  有效复习的五个步骤:
                </Typography>
                <Typography variant="body2" paragraph>
                  1. 短时间、高频率复习比一次长时间更有效
                </Typography>
                <Typography variant="body2" paragraph>
                  2. 在学习后24小时内进行第一次复习
                </Typography>
                <Typography variant="body2" paragraph>
                  3. 主动回忆比被动阅读效果更好
                </Typography>
                <Typography variant="body2" paragraph>
                  4. 使用不同的环境和方式复习同一内容
                </Typography>
                <Typography variant="body2">
                  5. 合理利用间隔重复系统安排复习时间
                </Typography>
              </Paper>
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="contained" color="primary">
                  创建复习计划
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto', p: 2 }}>
      <Typography variant="h4" gutterBottom>
        学习分析与洞察
      </Typography>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {renderStats()}
          
          <Box sx={{ mt: 4 }}>
            <Paper sx={{ mb: 3 }}>
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                sx={{ borderBottom: '1px solid #f0f0f0' }}
              >
                <Tab icon={<Timeline />} label="进度报告" iconPosition="start" />
                <Tab icon={<Lightbulb />} label="学习洞察" iconPosition="start" />
                <Tab icon={<LocalLibrary />} label="推荐内容" iconPosition="start" />
                <Tab icon={<School />} label="复习计划" iconPosition="start" />
              </Tabs>
            </Paper>
            
            {activeTab === 0 && renderProgressReport()}
            {activeTab === 1 && renderInsights()}
            {activeTab === 2 && renderRecommendations()}
            {activeTab === 3 && renderReviewContent()}
          </Box>
        </>
      )}
    </Box>
  );
};

export default LearningInsightsDashboard; 