import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  LinearProgress,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Tooltip,
  useTheme
} from '@mui/material';
import {
  Error as ErrorIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  School as SchoolIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon,
  BookmarkBorder as BookmarkBorderIcon,
  RecordVoiceOver as RecordVoiceOverIcon,
  Translate as TranslateIcon,
  Grading as GradingIcon,
  Event as EventIcon
} from '@mui/icons-material';

// 错误类型接口
interface ErrorPattern {
  id: string;
  type: 'grammar' | 'vocabulary' | 'pronunciation' | 'translation' | 'other';
  description: string;
  frequency: number; // 出现频率（1-100）
  examples: string[];
  suggestions: string[];
  lastOccurrence: string; // 最近一次出现的日期
}

// 错误类别统计接口
interface ErrorCategoryStat {
  category: string;
  count: number;
  percentage: number;
}

// 学习资源接口
interface LearningResource {
  id: string;
  title: string;
  type: 'lesson' | 'exercise' | 'quiz' | 'article';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // 分钟
  link: string;
}

// 组件属性接口
interface ErrorPatternDetectorProps {
  userId?: string;
  timeRange?: 'week' | 'month' | 'year' | 'all';
  onSelectResource?: (resourceId: string) => void;
}

const ErrorPatternDetector: React.FC<ErrorPatternDetectorProps> = ({
  userId,
  timeRange = 'month',
  onSelectResource
}) => {
  const theme = useTheme();
  
  // 状态
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRange);
  const [isLoading, setIsLoading] = useState(false);
  const [errorPatterns, setErrorPatterns] = useState<ErrorPattern[]>([]);
  const [categoryStats, setCategoryStats] = useState<ErrorCategoryStat[]>([]);
  const [recommendedResources, setRecommendedResources] = useState<LearningResource[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // 处理时间范围变化
  const handleTimeRangeChange = (event: SelectChangeEvent) => {
    setSelectedTimeRange(event.target.value as 'week' | 'month' | 'year' | 'all');
  };
  
  // 加载错误模式数据
  useEffect(() => {
    loadErrorData();
  }, [userId, selectedTimeRange]);
  
  // 模拟加载错误数据
  const loadErrorData = () => {
    setIsLoading(true);
    setError(null);
    
    // 模拟API请求
    setTimeout(() => {
      try {
        // 模拟错误模式数据
        const mockErrorPatterns: ErrorPattern[] = [
          {
            id: 'err1',
            type: 'grammar',
            description: '过去完成时使用错误',
            frequency: 68,
            examples: [
              '我已经完成了作业 → I have finished my homework (yesterday). (应为：I had finished my homework)',
              '当他到达时，电影已经开始了 → When he arrived, the movie has already started. (应为：had already started)'
            ],
            suggestions: [
              '区分have done（现在完成时）和had done（过去完成时）的使用场景',
              '过去完成时表示过去某一时刻之前已经发生的动作',
              '练习包含时间轴的句子，明确动作发生的先后顺序'
            ],
            lastOccurrence: '2023-05-13T14:30:00'
          },
          {
            id: 'err2',
            type: 'vocabulary',
            description: '近义词使用混淆',
            frequency: 54,
            examples: [
              '我想看看这件衣服 → I want to watch this clothes. (应为：look at)',
              '你能告诉我这是什么意思吗？ → Can you speak me what this means? (应为：tell)'
            ],
            suggestions: [
              '创建近义词对比表，注明它们的用法区别',
              '通过例句记忆单词的常见搭配',
              '多阅读地道的英语文章，观察单词在上下文中的使用'
            ],
            lastOccurrence: '2023-05-14T09:45:00'
          },
          {
            id: 'err3',
            type: 'pronunciation',
            description: '特定元音发音问题',
            frequency: 42,
            examples: [
              '单词"sheep"和"ship"的发音混淆',
              '单词"food"和"foot"的发音混淆'
            ],
            suggestions: [
              '使用音标辅助学习，关注元音的长短和音质',
              '录制自己的发音并与标准发音对比',
              '进行最小对立体练习，如sheet-shit, bean-bin等'
            ],
            lastOccurrence: '2023-05-10T16:20:00'
          },
          {
            id: 'err4',
            type: 'translation',
            description: '中式英语表达',
            frequency: 61,
            examples: [
              '我很享受音乐 → I very enjoy music. (应为：I really enjoy music)',
              '这个问题很难解决 → This problem is very difficult to solve. (更地道：This is a challenging problem to solve)'
            ],
            suggestions: [
              '避免直译，学习英语思维方式',
              '收集地道英语表达，逐步替换中式表达',
              '阅读英语原版材料，培养语感'
            ],
            lastOccurrence: '2023-05-12T11:15:00'
          },
          {
            id: 'err5',
            type: 'grammar',
            description: '冠词使用错误',
            frequency: 47,
            examples: [
              '我住在大城市 → I live in big city. (应为：a big city)',
              '太阳很明亮 → Sun is bright. (应为：The sun is bright)'
            ],
            suggestions: [
              '学习冠词使用的基本规则',
              '特别注意抽象名词、专有名词和物质名词的冠词使用',
              '通过多阅读来培养语感'
            ],
            lastOccurrence: '2023-05-15T08:30:00'
          }
        ];
        
        // 模拟错误类别统计
        const mockCategoryStats: ErrorCategoryStat[] = [
          { category: '语法错误', count: 42, percentage: 38 },
          { category: '词汇错误', count: 28, percentage: 25 },
          { category: '发音问题', count: 15, percentage: 14 },
          { category: '翻译不准确', count: 18, percentage: 16 },
          { category: '其他问题', count: 8, percentage: 7 }
        ];
        
        // 模拟推荐学习资源
        const mockResources: LearningResource[] = [
          {
            id: 'res1',
            title: '英语时态精讲：过去完成时',
            type: 'lesson',
            difficulty: 'intermediate',
            duration: 25,
            link: '/lessons/grammar/past-perfect-tense'
          },
          {
            id: 'res2',
            title: '近义词辨析练习',
            type: 'exercise',
            difficulty: 'intermediate',
            duration: 15,
            link: '/exercises/vocabulary/synonyms'
          },
          {
            id: 'res3',
            title: '英语元音发音技巧',
            type: 'lesson',
            difficulty: 'beginner',
            duration: 20,
            link: '/lessons/pronunciation/vowels'
          },
          {
            id: 'res4',
            title: '地道英语表达训练',
            type: 'exercise',
            difficulty: 'intermediate',
            duration: 30,
            link: '/exercises/translation/idiomatic-expressions'
          },
          {
            id: 'res5',
            title: '英语冠词使用测验',
            type: 'quiz',
            difficulty: 'intermediate',
            duration: 15,
            link: '/quizzes/grammar/articles'
          }
        ];
        
        setErrorPatterns(mockErrorPatterns);
        setCategoryStats(mockCategoryStats);
        setRecommendedResources(mockResources);
        setIsLoading(false);
      } catch (err) {
        setError('加载错误数据失败，请重试');
        setIsLoading(false);
      }
    }, 800);
  };
  
  // 获取错误类型图标
  const getErrorTypeIcon = (type: string) => {
    switch (type) {
      case 'grammar': return <GradingIcon />;
      case 'vocabulary': return <BookmarkBorderIcon />;
      case 'pronunciation': return <RecordVoiceOverIcon />;
      case 'translation': return <TranslateIcon />;
      default: return <ErrorIcon />;
    }
  };
  
  // 获取错误类型文本
  const getErrorTypeText = (type: string) => {
    switch (type) {
      case 'grammar': return '语法错误';
      case 'vocabulary': return '词汇错误';
      case 'pronunciation': return '发音问题';
      case 'translation': return '翻译错误';
      default: return '其他错误';
    }
  };
  
  // 获取资源类型图标
  const getResourceTypeIcon = (type: string) => {
    switch (type) {
      case 'lesson': return <SchoolIcon />;
      case 'exercise': return <CheckCircleIcon />;
      case 'quiz': return <GradingIcon />;
      case 'article': return <BookmarkBorderIcon />;
      default: return <SchoolIcon />;
    }
  };
  
  // 获取资源类型文本
  const getResourceTypeText = (type: string) => {
    switch (type) {
      case 'lesson': return '课程';
      case 'exercise': return '练习';
      case 'quiz': return '测验';
      case 'article': return '文章';
      default: return '学习资源';
    }
  };
  
  // 获取资源难度文本
  const getResourceDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return '初级';
      case 'intermediate': return '中级';
      case 'advanced': return '高级';
      default: return '未知';
    }
  };
  
  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'short', day: 'numeric' });
  };
  
  // 渲染加载中状态
  if (isLoading && errorPatterns.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>
          分析错误模式数据...
        </Typography>
      </Box>
    );
  }
  
  // 渲染错误状态
  if (error) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" color="error" gutterBottom>
          {error}
        </Typography>
        <Button 
          variant="outlined" 
          startIcon={<RefreshIcon />}
          onClick={loadErrorData}
          sx={{ mt: 2 }}
        >
          重新加载
        </Button>
      </Box>
    );
  }
  
  return (
    <Box>
      {/* 顶部控制栏 */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2" fontWeight="bold">
          错误模式分析
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 120, mr: 1 }}>
            <InputLabel>时间范围</InputLabel>
            <Select
              value={selectedTimeRange}
              label="时间范围"
              onChange={handleTimeRangeChange}
            >
              <MenuItem value="week">本周</MenuItem>
              <MenuItem value="month">本月</MenuItem>
              <MenuItem value="year">今年</MenuItem>
              <MenuItem value="all">全部</MenuItem>
            </Select>
          </FormControl>
          <Tooltip title="刷新数据">
            <IconButton 
              onClick={loadErrorData}
              color="primary"
              size="small"
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      
      {/* 错误类别统计 */}
      <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom fontWeight="medium">
          错误类别分布
        </Typography>
        
        <Grid container spacing={2}>
          {categoryStats.map((stat) => (
            <Grid item xs={12} sm={6} md={4} lg={2.4} key={stat.category}>
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                  <Typography variant="body2" fontWeight="medium">
                    {stat.category}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.percentage}%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={stat.percentage} 
                  sx={{ 
                    height: 8, 
                    borderRadius: 1,
                    mb: 0.5
                  }}
                />
                <Typography variant="caption" color="text.secondary">
                  {stat.count}个错误实例
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>
      
      {/* 主要内容区 */}
      <Grid container spacing={3}>
        {/* 常见错误模式 */}
        <Grid item xs={12} md={7}>
          <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom fontWeight="medium">
              常见错误模式
            </Typography>
            
            {errorPatterns.map((pattern, index) => (
              <Box key={pattern.id} sx={{ mb: index < errorPatterns.length - 1 ? 3 : 0 }}>
                <Box sx={{ display: 'flex', mb: 1 }}>
                  <Box 
                    sx={{ 
                      mr: 2, 
                      display: 'flex',
                      mt: 0.5,
                      color: pattern.frequency > 60 ? 'error.main' : 
                             pattern.frequency > 40 ? 'warning.main' : 'info.main'
                    }}
                  >
                    {getErrorTypeIcon(pattern.type)}
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle1" fontWeight="medium">
                        {pattern.description}
                      </Typography>
                      <Chip 
                        label={`出现频率: ${pattern.frequency}%`} 
                        size="small"
                        color={pattern.frequency > 60 ? "error" : 
                               pattern.frequency > 40 ? "warning" : "info"}
                        variant="outlined"
                      />
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                      {getErrorTypeText(pattern.type)} · 最近出现: {formatDate(pattern.lastOccurrence)}
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ ml: 4, mb: 1 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    错误示例:
                  </Typography>
                  <List dense disablePadding>
                    {pattern.examples.map((example, i) => (
                      <ListItem key={i} sx={{ px: 1, py: 0.25 }}>
                        <ListItemIcon sx={{ minWidth: 24 }}>
                          <WarningIcon color="warning" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText 
                          primary={example} 
                          primaryTypographyProps={{ 
                            variant: 'body2',
                            sx: { overflowWrap: 'break-word' }
                          }} 
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
                
                <Box sx={{ ml: 4 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    改进建议:
                  </Typography>
                  <List dense disablePadding>
                    {pattern.suggestions.map((suggestion, i) => (
                      <ListItem key={i} sx={{ px: 1, py: 0.25 }}>
                        <ListItemIcon sx={{ minWidth: 24 }}>
                          <CheckCircleIcon color="success" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText 
                          primary={suggestion} 
                          primaryTypographyProps={{ 
                            variant: 'body2',
                            sx: { overflowWrap: 'break-word' }
                          }} 
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
                
                {index < errorPatterns.length - 1 && <Divider sx={{ mt: 2 }} />}
              </Box>
            ))}
          </Paper>
        </Grid>
        
        {/* 推荐学习资源 */}
        <Grid item xs={12} md={5}>
          <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom fontWeight="medium">
              推荐学习资源
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              基于您的错误模式，我们为您推荐以下学习资源，帮助您有针对性地提高
            </Typography>
            
            {recommendedResources.map((resource, index) => (
              <React.Fragment key={resource.id}>
                <Card 
                  variant="outlined" 
                  sx={{ 
                    mb: index < recommendedResources.length - 1 ? 2 : 0,
                    transition: 'all 0.2s',
                    '&:hover': {
                      boxShadow: 1,
                      bgcolor: 'action.hover'
                    }
                  }}
                >
                  <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box sx={{ display: 'flex', flexGrow: 1 }}>
                        <Box 
                          sx={{ 
                            mr: 2, 
                            display: 'flex',
                            color: 'primary.main'
                          }}
                        >
                          {getResourceTypeIcon(resource.type)}
                        </Box>
                        <Box>
                          <Typography variant="subtitle1">
                            {resource.title}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                            <Chip 
                              label={getResourceTypeText(resource.type)} 
                              size="small"
                              variant="outlined"
                              sx={{ height: 22 }}
                            />
                            <Chip 
                              label={getResourceDifficultyText(resource.difficulty)} 
                              size="small"
                              color={
                                resource.difficulty === 'beginner' ? "success" : 
                                resource.difficulty === 'intermediate' ? "primary" : 
                                "warning"
                              }
                              variant="outlined"
                              sx={{ height: 22 }}
                            />
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <EventIcon fontSize="small" sx={{ fontSize: 14, mr: 0.5, color: 'text.secondary' }} />
                              <Typography variant="caption" color="text.secondary">
                                {resource.duration}分钟
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                      <IconButton 
                        size="small" 
                        color="primary"
                        onClick={() => onSelectResource && onSelectResource(resource.id)}
                      >
                        <KeyboardArrowRightIcon />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </React.Fragment>
            ))}
            
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Button 
                variant="outlined" 
                startIcon={<SearchIcon />}
                size="small"
              >
                查看更多学习资源
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ErrorPatternDetector; 