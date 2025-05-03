import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Tabs, Tab, CircularProgress,
  Card, CardContent, Grid, Divider, Chip, Button,
  List, ListItem, ListItemText, ListItemIcon, TextField,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';
import {
  Timeline, TimelineItem, TimelineContent, TimelineSeparator,
  TimelineDot, TimelineConnector
} from '@mui/lab';
import {
  TrendingUp, School, Error as ErrorIcon, Schedule,
  BarChart, Bookmarks, Repeat, LocalOffer, Check,
  Warning, Info, Grade, FilterList
} from '@mui/icons-material';

// 定义词汇数据接口
interface Word {
  id: string;
  term: string;
  translation: string;
  definition: string;
  examples: string[];
  difficulty: number;
  tags: string[];
  lastReviewed?: Date;
  nextReviewDate?: Date;
  memoryStrength: number; // 1-10
  reviewCount: number;
}

// 学习进度数据接口
interface LearningProgressData {
  dailyStats: {
    date: string;
    wordsLearned: number;
    wordsReviewed: number;
    retentionRate: number;
  }[];
  retentionByDifficulty: {
    difficulty: number;
    retention: number;
    count: number;
  }[];
  reviewPatterns: {
    reviewCount: number;
    wordCount: number;
    averageRetention: number;
  }[];
  memoryStrengthDistribution: {
    strength: number;
    count: number;
  }[];
}

// 词汇错误模式接口
interface VocabularyErrorPattern {
  id: string;
  type: 'pronunciation' | 'spelling' | 'meaning' | 'usage' | 'context';
  description: string;
  frequency: number;
  affectedWords: string[];
  suggestions: string;
}

// 组件属性接口
interface EnhancedVocabularyAnalyzerProps {
  userId: string;
  vocabularySet?: Word[];
  onRequestReview?: (words: Word[]) => void;
  onExportAnalysis?: (analysisData: any) => void;
}

// 增强版词汇分析组件
export const EnhancedVocabularyAnalyzer: React.FC<EnhancedVocabularyAnalyzerProps> = ({
  userId,
  vocabularySet = [],
  onRequestReview,
  onExportAnalysis
}) => {
  // 状态管理
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [progressData, setProgressData] = useState<LearningProgressData | null>(null);
  const [errorPatterns, setErrorPatterns] = useState<VocabularyErrorPattern[]>([]);
  const [filteredWords, setFilteredWords] = useState<Word[]>([]);
  const [filterCriteria, setFilterCriteria] = useState({
    difficulty: 'all',
    memoryStrength: 'all',
    tags: [] as string[],
    reviewNeeded: false
  });

  // 模拟加载数据
  useEffect(() => {
    const loadAnalyticsData = async () => {
      setLoading(true);
      // 实际项目中这里应该调用API获取真实数据
      // 这里使用模拟数据
      setTimeout(() => {
        setProgressData(getMockProgressData());
        setErrorPatterns(getMockErrorPatterns());
        setFilteredWords(vocabularySet);
        setLoading(false);
      }, 1000);
    };
    
    loadAnalyticsData();
  }, [userId, vocabularySet]);

  // 处理标签筛选
  const handleTagFilter = (tag: string) => {
    setFilterCriteria(prev => {
      const newTags = prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag];
      
      return { ...prev, tags: newTags };
    });
  };

  // 处理难度筛选
  const handleDifficultyFilter = (difficulty: string) => {
    setFilterCriteria(prev => ({ ...prev, difficulty }));
  };

  // 处理记忆强度筛选
  const handleMemoryStrengthFilter = (strength: string) => {
    setFilterCriteria(prev => ({ ...prev, memoryStrength: strength }));
  };

  // 处理需要复习筛选
  const handleReviewNeededFilter = (needed: boolean) => {
    setFilterCriteria(prev => ({ ...prev, reviewNeeded: needed }));
  };

  // 应用筛选条件
  useEffect(() => {
    let filtered = [...vocabularySet];
    
    // 应用难度筛选
    if (filterCriteria.difficulty !== 'all') {
      const difficultyValue = parseInt(filterCriteria.difficulty);
      filtered = filtered.filter(word => word.difficulty === difficultyValue);
    }
    
    // 应用记忆强度筛选
    if (filterCriteria.memoryStrength !== 'all') {
      const strengthValue = parseInt(filterCriteria.memoryStrength);
      filtered = filtered.filter(word => word.memoryStrength === strengthValue);
    }
    
    // 应用标签筛选
    if (filterCriteria.tags.length > 0) {
      filtered = filtered.filter(word => 
        filterCriteria.tags.some(tag => word.tags.includes(tag))
      );
    }
    
    // 应用需要复习筛选
    if (filterCriteria.reviewNeeded) {
      const now = new Date();
      filtered = filtered.filter(word => 
        word.nextReviewDate && new Date(word.nextReviewDate) <= now
      );
    }
    
    setFilteredWords(filtered);
  }, [filterCriteria, vocabularySet]);

  // 获取模拟学习进度数据
  const getMockProgressData = (): LearningProgressData => {
    // 生成过去30天的日期
    const dates = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return date.toISOString().split('T')[0];
    });

    return {
      dailyStats: dates.map(date => ({
        date,
        wordsLearned: Math.floor(Math.random() * 20) + 5,
        wordsReviewed: Math.floor(Math.random() * 50) + 10,
        retentionRate: Math.round((Math.random() * 30) + 65) // 65%-95%
      })),
      retentionByDifficulty: [
        { difficulty: 1, retention: 95, count: 42 },
        { difficulty: 2, retention: 90, count: 67 },
        { difficulty: 3, retention: 85, count: 89 },
        { difficulty: 4, retention: 75, count: 56 },
        { difficulty: 5, retention: 65, count: 34 }
      ],
      reviewPatterns: [
        { reviewCount: 1, wordCount: 120, averageRetention: 60 },
        { reviewCount: 2, wordCount: 95, averageRetention: 72 },
        { reviewCount: 3, wordCount: 78, averageRetention: 80 },
        { reviewCount: 4, wordCount: 65, averageRetention: 85 },
        { reviewCount: 5, wordCount: 43, averageRetention: 90 },
        { reviewCount: 6, wordCount: 32, averageRetention: 92 },
        { reviewCount: 7, wordCount: 28, averageRetention: 94 },
        { reviewCount: 8, wordCount: 19, averageRetention: 96 },
        { reviewCount: 9, wordCount: 12, averageRetention: 97 },
        { reviewCount: 10, wordCount: 8, averageRetention: 98 }
      ],
      memoryStrengthDistribution: [
        { strength: 1, count: 45 },
        { strength: 2, count: 68 },
        { strength: 3, count: 87 },
        { strength: 4, count: 95 },
        { strength: 5, count: 76 },
        { strength: 6, count: 59 },
        { strength: 7, count: 43 },
        { strength: 8, count: 31 },
        { strength: 9, count: 22 },
        { strength: 10, count: 14 }
      ]
    };
  };

  // 获取模拟错误模式数据
  const getMockErrorPatterns = (): VocabularyErrorPattern[] => {
    return [
      {
        id: '1',
        type: 'pronunciation',
        description: '元音发音不准确',
        frequency: 78,
        affectedWords: ['abundance', 'adequate', 'cognitive', 'delegate'],
        suggestions: '注意英语中的长短元音区别，可以使用音标辅助记忆。'
      },
      {
        id: '2',
        type: 'spelling',
        description: '双写字母错误',
        frequency: 65,
        affectedWords: ['occurrence', 'recommend', 'accommodate', 'colleague'],
        suggestions: '对于双写字母的单词，可以设置特殊的记忆规则或使用词根词缀分析法。'
      },
      {
        id: '3',
        type: 'meaning',
        description: '易混淆词义',
        frequency: 54,
        affectedWords: ['affect/effect', 'principle/principal', 'complement/compliment'],
        suggestions: '创建易混淆词汇对比表，突出差异点。'
      },
      {
        id: '4',
        type: 'usage',
        description: '搭配词使用不当',
        frequency: 47,
        affectedWords: ['make a decision', 'take a photo', 'do homework'],
        suggestions: '学习词汇时同时记忆常见搭配，建立固定短语库。'
      },
      {
        id: '5',
        type: 'context',
        description: '上下文选词不当',
        frequency: 39,
        affectedWords: ['economic/economical', 'historic/historical', 'classic/classical'],
        suggestions: '通过阅读文章学习词汇在不同上下文中的应用。'
      }
    ];
  };

  // 确定需要复习的单词
  const getWordsNeedingReview = () => {
    const now = new Date();
    return vocabularySet.filter(word => 
      word.nextReviewDate && new Date(word.nextReviewDate) <= now
    );
  };

  // 渲染加载状态
  const renderLoading = () => (
    <Box display="flex" justifyContent="center" alignItems="center" height="400px">
      <CircularProgress />
      <Typography variant="h6" ml={2}>加载分析数据...</Typography>
    </Box>
  );

  // 渲染学习进度分析
  const renderProgressAnalysis = () => {
    if (!progressData) return null;
    
    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          <TrendingUp sx={{ mr: 1, verticalAlign: 'middle' }} />
          学习进度概览
        </Typography>
        
        <Grid container spacing={3}>
          {/* 学习统计卡片 */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>单词掌握概况</Typography>
                <Box display="flex" alignItems="center" mb={2}>
                  <School color="primary" />
                  <Typography variant="body1" ml={1}>
                    已学习: <b>{vocabularySet.length}</b> 个单词
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" mb={2}>
                  <Grade color="success" />
                  <Typography variant="body1" ml={1}>
                    平均记忆强度: <b>
                      {Math.round(vocabularySet.reduce((sum, word) => sum + word.memoryStrength, 0) / 
                        (vocabularySet.length || 1))}
                    </b>/10
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center">
                  <Schedule color="secondary" />
                  <Typography variant="body1" ml={1}>
                    需要复习: <b>{getWordsNeedingReview().length}</b> 个单词
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          {/* 记忆强度分布卡片 */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>记忆强度分布</Typography>
                <Box height={150} display="flex" alignItems="flex-end">
                  {progressData.memoryStrengthDistribution.map((item) => (
                    <Box
                      key={item.strength}
                      sx={{
                        height: `${(item.count / Math.max(...progressData.memoryStrengthDistribution.map(i => i.count))) * 100}%`,
                        width: '8%',
                        backgroundColor: `hsl(${180 + item.strength * 20}, 70%, 50%)`,
                        mx: 0.5,
                        borderTopLeftRadius: 4,
                        borderTopRightRadius: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        pb: 1
                      }}
                    >
                      <Typography variant="caption" color="white" fontWeight="bold">
                        {item.count}
                      </Typography>
                    </Box>
                  ))}
                </Box>
                <Box display="flex" justifyContent="space-between" mt={1}>
                  {progressData.memoryStrengthDistribution.map((item) => (
                    <Typography key={item.strength} variant="caption" width="8%" textAlign="center">
                      {item.strength}
                    </Typography>
                  ))}
                </Box>
                <Typography variant="caption" textAlign="center" display="block" mt={1}>
                  记忆强度等级 (1-10)
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          {/* 复习效果分析 */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <Repeat sx={{ mr: 1, verticalAlign: 'middle' }} />
                  复习效果分析
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>复习次数</TableCell>
                        <TableCell>单词数量</TableCell>
                        <TableCell>平均记忆保持率</TableCell>
                        <TableCell>记忆效果</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {progressData.reviewPatterns.map((pattern) => (
                        <TableRow key={pattern.reviewCount}>
                          <TableCell>{pattern.reviewCount}</TableCell>
                          <TableCell>{pattern.wordCount}</TableCell>
                          <TableCell>{pattern.averageRetention}%</TableCell>
                          <TableCell>
                            <Box sx={{ width: '100%', backgroundColor: '#f0f0f0', height: 10, borderRadius: 5 }}>
                              <Box 
                                sx={{ 
                                  width: `${pattern.averageRetention}%`, 
                                  backgroundColor: 
                                    pattern.averageRetention < 70 ? '#f44336' :
                                    pattern.averageRetention < 85 ? '#ff9800' : '#4caf50',
                                  height: 10,
                                  borderRadius: 5
                                }} 
                              />
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    );
  };

  // 渲染错误模式分析
  const renderErrorPatternAnalysis = () => {
    if (errorPatterns.length === 0) return null;
    
    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          <ErrorIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          常见错误模式分析
        </Typography>
        
        <Grid container spacing={3}>
          {errorPatterns.map((pattern) => (
            <Grid item xs={12} key={pattern.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="primary" gutterBottom>
                    {pattern.description}
                    <Chip 
                      label={`出现频率: ${pattern.frequency}`}
                      color={
                        pattern.frequency > 70 ? 'error' :
                        pattern.frequency > 50 ? 'warning' : 'info'
                      }
                      size="small"
                      sx={{ ml: 2 }}
                    />
                  </Typography>
                  
                  <Box mb={2}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      影响的单词:
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={1}>
                      {pattern.affectedWords.map((word, index) => (
                        <Chip 
                          key={index} 
                          label={word} 
                          variant="outlined" 
                          color="primary"
                          size="small"
                        />
                      ))}
                    </Box>
                  </Box>
                  
                  <Divider sx={{ my: 1 }} />
                  
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    改进建议:
                  </Typography>
                  <Typography variant="body2">
                    {pattern.suggestions}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };

  // 渲染筛选面板
  const renderFilterPanel = () => {
    // 获取所有标签
    const allTags = Array.from(
      new Set(vocabularySet.flatMap(word => word.tags))
    );
    
    return (
      <Box mb={3}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" display="flex" alignItems="center" gutterBottom>
            <FilterList sx={{ mr: 1 }} />
            词汇筛选
          </Typography>
          
          <Grid container spacing={2}>
            {/* 难度筛选 */}
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="subtitle2" gutterBottom>难度级别:</Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                <Chip 
                  label="全部" 
                  color={filterCriteria.difficulty === 'all' ? 'primary' : 'default'}
                  onClick={() => handleDifficultyFilter('all')}
                  sx={{ m: 0.5 }}
                />
                {[1, 2, 3, 4, 5].map(level => (
                  <Chip 
                    key={level}
                    label={level}
                    color={filterCriteria.difficulty === level.toString() ? 'primary' : 'default'}
                    onClick={() => handleDifficultyFilter(level.toString())}
                    sx={{ m: 0.5 }}
                  />
                ))}
              </Box>
            </Grid>
            
            {/* 记忆强度筛选 */}
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="subtitle2" gutterBottom>记忆强度:</Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                <Chip 
                  label="全部" 
                  color={filterCriteria.memoryStrength === 'all' ? 'primary' : 'default'}
                  onClick={() => handleMemoryStrengthFilter('all')}
                  sx={{ m: 0.5 }}
                />
                {[1, 3, 5, 7, 10].map(level => (
                  <Chip 
                    key={level}
                    label={level}
                    color={filterCriteria.memoryStrength === level.toString() ? 'primary' : 'default'}
                    onClick={() => handleMemoryStrengthFilter(level.toString())}
                    sx={{ m: 0.5 }}
                  />
                ))}
              </Box>
            </Grid>
            
            {/* 标签筛选 */}
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="subtitle2" gutterBottom>标签:</Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {allTags.map(tag => (
                  <Chip 
                    key={tag}
                    label={tag}
                    color={filterCriteria.tags.includes(tag) ? 'primary' : 'default'}
                    onClick={() => handleTagFilter(tag)}
                    sx={{ m: 0.5 }}
                  />
                ))}
              </Box>
            </Grid>
            
            {/* 需要复习筛选 */}
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="subtitle2" gutterBottom>复习状态:</Typography>
              <Box>
                <Chip 
                  label="需要复习" 
                  color={filterCriteria.reviewNeeded ? 'primary' : 'default'}
                  onClick={() => handleReviewNeededFilter(!filterCriteria.reviewNeeded)}
                  sx={{ m: 0.5 }}
                />
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    );
  };

  // 渲染词汇列表
  const renderVocabularyList = () => {
    return (
      <Box>
        <Typography variant="h6" gutterBottom display="flex" alignItems="center">
          <Bookmarks sx={{ mr: 1 }} />
          词汇列表 ({filteredWords.length})
        </Typography>
        
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>词汇</TableCell>
                <TableCell>翻译</TableCell>
                <TableCell>难度</TableCell>
                <TableCell>记忆强度</TableCell>
                <TableCell>复习次数</TableCell>
                <TableCell>标签</TableCell>
                <TableCell>下次复习</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredWords.map((word) => {
                const needsReview = word.nextReviewDate && new Date(word.nextReviewDate) <= new Date();
                
                return (
                  <TableRow key={word.id}>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">{word.term}</Typography>
                    </TableCell>
                    <TableCell>{word.translation}</TableCell>
                    <TableCell>
                      <Box display="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Grade key={i} 
                            color={i < word.difficulty ? 'action' : 'disabled'} 
                            fontSize="small"
                          />
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ 
                        width: '100%', 
                        backgroundColor: '#f0f0f0', 
                        height: 10, 
                        borderRadius: 5 
                      }}>
                        <Box 
                          sx={{ 
                            width: `${word.memoryStrength * 10}%`, 
                            backgroundColor: 
                              word.memoryStrength < 4 ? '#f44336' :
                              word.memoryStrength < 7 ? '#ff9800' : '#4caf50',
                            height: 10,
                            borderRadius: 5
                          }} 
                        />
                      </Box>
                    </TableCell>
                    <TableCell>{word.reviewCount}</TableCell>
                    <TableCell>
                      <Box display="flex" flexWrap="wrap" gap={0.5}>
                        {word.tags.map((tag, idx) => (
                          <Chip 
                            key={idx} 
                            label={tag} 
                            size="small" 
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell>
                      {needsReview ? (
                        <Typography variant="body2" color="error">
                          需要复习
                        </Typography>
                      ) : (
                        word.nextReviewDate ? 
                          new Date(word.nextReviewDate).toLocaleDateString() : 
                          '未安排'
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        
        {filteredWords.length === 0 && (
          <Box textAlign="center" p={3}>
            <Info color="disabled" sx={{ fontSize: 40 }} />
            <Typography color="text.secondary">没有符合筛选条件的词汇</Typography>
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Paper sx={{ p: 3, mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        增强版词汇分析
      </Typography>
      
      <Tabs
        value={activeTab}
        onChange={(_, newValue) => setActiveTab(newValue)}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
        sx={{ mb: 3 }}
      >
        <Tab icon={<TrendingUp />} label="学习进度" />
        <Tab icon={<ErrorIcon />} label="错误模式" />
        <Tab icon={<BarChart />} label="词汇管理" />
      </Tabs>
      
      {loading ? (
        renderLoading()
      ) : (
        <>
          {activeTab === 0 && renderProgressAnalysis()}
          {activeTab === 1 && renderErrorPatternAnalysis()}
          {activeTab === 2 && (
            <>
              {renderFilterPanel()}
              {renderVocabularyList()}
            </>
          )}
          
          <Box display="flex" justifyContent="flex-end" mt={3}>
            {activeTab === 2 && onRequestReview && (
              <Button 
                variant="contained" 
                color="primary"
                onClick={() => onRequestReview(getWordsNeedingReview())}
                disabled={getWordsNeedingReview().length === 0}
                sx={{ mr: 2 }}
              >
                开始复习 ({getWordsNeedingReview().length})
              </Button>
            )}
            
            {onExportAnalysis && (
              <Button 
                variant="outlined"
                onClick={() => onExportAnalysis({
                  progressData,
                  errorPatterns,
                  vocabularyStats: {
                    total: vocabularySet.length,
                    byDifficulty: [1, 2, 3, 4, 5].map(level => ({
                      level,
                      count: vocabularySet.filter(word => word.difficulty === level).length
                    })),
                    needingReview: getWordsNeedingReview().length
                  }
                })}
              >
                导出分析报告
              </Button>
            )}
          </Box>
        </>
      )}
    </Paper>
  );
};

export default EnhancedVocabularyAnalyzer; 