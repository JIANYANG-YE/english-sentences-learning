import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Chip,
  Tabs,
  Tab,
  Divider,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Tooltip,
  Rating,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Search as SearchIcon,
  VolumeUp as VolumeUpIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Add as AddIcon,
  ArrowForward as ArrowForwardIcon,
  Check as CheckIcon,
  Refresh as RefreshIcon,
  School as SchoolIcon,
  StarBorder as StarBorderIcon,
  Timer as TimerIcon,
  Lightbulb as LightbulbIcon
} from '@mui/icons-material';

// 接口定义
interface Word {
  id: string;
  word: string;
  phonetic: string;
  meanings: {
    partOfSpeech: string;
    definitions: {
      definition: string;
      example?: string;
    }[];
  }[];
  synonyms: string[];
  antonyms: string[];
  examples: string[];
  difficulty: number;
  isBookmarked?: boolean;
}

interface LearningSet {
  id: string;
  name: string;
  description?: string;
  wordCount: number;
  difficulty: number;
  words: string[];
  createdAt: Date;
}

interface VocabularyHelperProps {
  initialWord?: string;
  onSaveWord?: (word: Word) => void;
}

// 主组件
const VocabularyHelper: React.FC<VocabularyHelperProps> = ({
  initialWord = '',
  onSaveWord
}) => {
  // 状态管理
  const [searchTerm, setSearchTerm] = useState(initialWord);
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [recentWords, setRecentWords] = useState<Word[]>([]);
  const [learningSets, setLearningSets] = useState<LearningSet[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingToSet, setIsAddingToSet] = useState(false);
  const [selectedSetId, setSelectedSetId] = useState<string>('');
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info'>('success');
  
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // 初始化模拟学习集
  useEffect(() => {
    const mockLearningSets: LearningSet[] = [
      {
        id: 'set1',
        name: '日常用语词汇',
        description: '包含日常对话中常用的基础词汇',
        wordCount: 50,
        difficulty: 1,
        words: ['apple', 'book', 'car'],
        createdAt: new Date(2023, 0, 15)
      },
      {
        id: 'set2',
        name: '商务英语词汇',
        description: '商务沟通和职场环境中使用的专业词汇',
        wordCount: 30,
        difficulty: 3,
        words: ['negotiate', 'contract', 'meeting'],
        createdAt: new Date(2023, 1, 10)
      },
      {
        id: 'set3',
        name: '雅思核心词汇',
        description: '雅思考试高频词汇集合',
        wordCount: 100,
        difficulty: 4,
        words: ['academic', 'research', 'analyze'],
        createdAt: new Date(2023, 2, 5)
      }
    ];
    
    setLearningSets(mockLearningSets);
    
    // 如果有初始词汇，自动搜索
    if (initialWord) {
      searchWord(initialWord);
    }
  }, [initialWord]);
  
  // 搜索词汇
  const searchWord = (term: string = searchTerm) => {
    if (!term.trim()) return;
    
    setIsLoading(true);
    
    // 模拟API请求
    setTimeout(() => {
      // 这里使用模拟数据，实际应用中应该调用词典API
      const mockWords: Record<string, Word> = {
        'apple': {
          id: 'word1',
          word: 'apple',
          phonetic: '/ˈæp.əl/',
          meanings: [
            {
              partOfSpeech: 'noun',
              definitions: [
                {
                  definition: 'A round fruit with red, yellow or green skin and firm white flesh',
                  example: 'Would you like an apple?'
                }
              ]
            }
          ],
          synonyms: ['fruit'],
          antonyms: [],
          examples: [
            'She bit into the juicy apple.',
            'We went apple picking last weekend.'
          ],
          difficulty: 1
        },
        'negotiate': {
          id: 'word2',
          word: 'negotiate',
          phonetic: '/nɪˈɡoʊ.ʃi.eɪt/',
          meanings: [
            {
              partOfSpeech: 'verb',
              definitions: [
                {
                  definition: 'To have formal discussions with someone in order to reach an agreement',
                  example: 'They negotiated a peace agreement.'
                },
                {
                  definition: 'To successfully get past or through something difficult or dangerous',
                  example: 'He negotiated the narrow mountain road with care.'
                }
              ]
            }
          ],
          synonyms: ['bargain', 'discuss', 'arrange'],
          antonyms: ['dictate', 'command'],
          examples: [
            'The two companies are negotiating a merger.',
            "We are still negotiating the terms of the contract."
          ],
          difficulty: 3
        },
        'academic': {
          id: 'word3',
          word: 'academic',
          phonetic: '/ˌæk.əˈdem.ɪk/',
          meanings: [
            {
              partOfSpeech: 'adjective',
              definitions: [
                {
                  definition: 'Relating to schools, colleges, and universities, or connected with studying and thinking',
                  example: 'Academic achievement'
                }
              ]
            },
            {
              partOfSpeech: 'noun',
              definitions: [
                {
                  definition: 'A person who teaches or does research at a college or university',
                  example: 'She is a distinguished academic in the field of linguistics.'
                }
              ]
            }
          ],
          synonyms: ['scholarly', 'educational', 'intellectual'],
          antonyms: ['practical', 'vocational'],
          examples: [
            'The university has a strong academic reputation.',
            'His academic interests include philosophy and history.'
          ],
          difficulty: 3
        }
      };
      
      const foundWord = mockWords[term.toLowerCase()] || null;
      
      if (foundWord) {
        setCurrentWord(foundWord);
        
        // 添加到最近查询的词汇
        setRecentWords(prev => {
          const filtered = prev.filter(w => w.word !== foundWord.word);
          return [foundWord, ...filtered].slice(0, 5);
        });
      } else {
        setCurrentWord(null);
        setSnackbarMessage('未找到该词汇，请检查拼写或尝试其他词汇');
        setSnackbarSeverity('error');
        setShowSnackbar(true);
      }
      
      setIsLoading(false);
    }, 1000);
  };
  
  // 播放发音
  const playPronunciation = () => {
    if (!currentWord) return;
    
    // 实际应用中，这里应调用发音API或使用预先存储的音频文件
    // 这里为模拟，使用Web Speech API
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(currentWord.word);
      utterance.lang = 'en-US';
      speechSynthesis.speak(utterance);
    }
  };
  
  // 添加到学习集
  const addToLearningSet = () => {
    if (!currentWord || !selectedSetId) return;
    
    const updatedSets = learningSets.map(set => {
      if (set.id === selectedSetId) {
        // 检查词汇是否已经在学习集中
        if (set.words.includes(currentWord.word)) {
          setSnackbarMessage('该词汇已在学习集中');
          setSnackbarSeverity('info');
          setShowSnackbar(true);
          return set;
        }
        
        // 添加词汇到学习集
        return {
          ...set,
          words: [...set.words, currentWord.word],
          wordCount: set.wordCount + 1
        };
      }
      return set;
    });
    
    setLearningSets(updatedSets);
    setIsAddingToSet(false);
    setSnackbarMessage(`已将 "${currentWord.word}" 添加到学习集`);
    setSnackbarSeverity('success');
    setShowSnackbar(true);
  };
  
  // 收藏词汇
  const toggleBookmark = () => {
    if (!currentWord) return;
    
    const updatedWord = {
      ...currentWord,
      isBookmarked: !currentWord.isBookmarked
    };
    
    setCurrentWord(updatedWord);
    
    // 更新最近词汇列表
    setRecentWords(prev => 
      prev.map(word => 
        word.id === currentWord.id ? updatedWord : word
      )
    );
    
    // 调用外部保存回调
    if (onSaveWord && updatedWord.isBookmarked) {
      onSaveWord(updatedWord);
    }
    
    setSnackbarMessage(updatedWord.isBookmarked ? '词汇已收藏' : '已取消收藏');
    setSnackbarSeverity('success');
    setShowSnackbar(true);
  };
  
  // 处理标签切换
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };
  
  // 获取难度文本
  const getDifficultyText = (level: number) => {
    switch (level) {
      case 1: return '基础';
      case 2: return '初级';
      case 3: return '中级';
      case 4: return '高级';
      case 5: return '专家';
      default: return '未知';
    }
  };
  
  // 获取难度颜色
  const getDifficultyColor = (level: number) => {
    switch (level) {
      case 1: return 'success';
      case 2: return 'info';
      case 3: return 'primary';
      case 4: return 'warning';
      case 5: return 'error';
      default: return 'default';
    }
  };
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* 搜索区域 */}
      <Paper sx={{ p: 2, mb: 2, display: 'flex', alignItems: 'center' }}>
        <TextField
          placeholder="输入要查询的英语单词..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          variant="outlined"
          size="small"
          fullWidth
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              searchWord();
            }
          }}
          InputProps={{
            endAdornment: (
              <IconButton 
                onClick={() => searchWord()} 
                disabled={!searchTerm.trim() || isLoading}
                color="primary"
              >
                {isLoading ? <CircularProgress size={20} /> : <SearchIcon />}
              </IconButton>
            )
          }}
        />
      </Paper>
      
      {/* 内容区域 */}
      <Grid container spacing={2} sx={{ flexGrow: 1 }}>
        {/* 左侧：词汇详情 */}
        <Grid item xs={12} md={8}>
          {currentWord ? (
            <Paper sx={{ p: 3, height: '100%', position: 'relative' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box>
                  <Typography variant="h4" component="h1" gutterBottom>
                    {currentWord.word}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="subtitle1" color="text.secondary">
                      {currentWord.phonetic}
                    </Typography>
                    <IconButton onClick={playPronunciation} size="small" sx={{ ml: 1 }}>
                      <VolumeUpIcon />
                    </IconButton>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Chip 
                    label={getDifficultyText(currentWord.difficulty)} 
                    color={getDifficultyColor(currentWord.difficulty) as any}
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  <Tooltip title={currentWord.isBookmarked ? "取消收藏" : "收藏词汇"}>
                    <IconButton onClick={toggleBookmark} color={currentWord.isBookmarked ? "primary" : "default"}>
                      {currentWord.isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              {/* 词义 */}
              <Typography variant="h6" gutterBottom>
                词义释义
              </Typography>
              {currentWord.meanings.map((meaning, index) => (
                <Box key={index} sx={{ mb: 3 }}>
                  <Chip 
                    label={meaning.partOfSpeech} 
                    size="small" 
                    sx={{ mb: 1 }}
                  />
                  {meaning.definitions.map((def, idx) => (
                    <Box key={idx} sx={{ mb: 1.5 }}>
                      <Typography variant="body1">
                        {def.definition}
                      </Typography>
                      {def.example && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                          例句: "{def.example}"
                        </Typography>
                      )}
                    </Box>
                  ))}
                </Box>
              ))}
              
              <Divider sx={{ my: 2 }} />
              
              {/* 例句 */}
              <Typography variant="h6" gutterBottom>
                例句
              </Typography>
              <List sx={{ pl: 1 }}>
                {currentWord.examples.map((example, index) => (
                  <ListItem key={index} sx={{ px: 1, py: 0.5 }}>
                    <ListItemText 
                      primary={example}
                      primaryTypographyProps={{ variant: 'body2' }}
                    />
                  </ListItem>
                ))}
              </List>
              
              {/* 同义词/反义词 */}
              {(currentWord.synonyms.length > 0 || currentWord.antonyms.length > 0) && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Grid container spacing={2}>
                    {currentWord.synonyms.length > 0 && (
                      <Grid item xs={12} sm={6}>
                        <Typography variant="h6" gutterBottom>
                          同义词
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {currentWord.synonyms.map((word, index) => (
                            <Chip 
                              key={index}
                              label={word}
                              size="small"
                              onClick={() => {
                                setSearchTerm(word);
                                searchWord(word);
                              }}
                              clickable
                            />
                          ))}
                        </Box>
                      </Grid>
                    )}
                    
                    {currentWord.antonyms.length > 0 && (
                      <Grid item xs={12} sm={6}>
                        <Typography variant="h6" gutterBottom>
                          反义词
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {currentWord.antonyms.map((word, index) => (
                            <Chip 
                              key={index}
                              label={word}
                              size="small"
                              onClick={() => {
                                setSearchTerm(word);
                                searchWord(word);
                              }}
                              clickable
                            />
                          ))}
                        </Box>
                      </Grid>
                    )}
                  </Grid>
                </>
              )}
              
              {/* 添加到学习集按钮 */}
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={() => setIsAddingToSet(true)}
                  disabled={isAddingToSet}
                >
                  添加到学习集
                </Button>
              </Box>
              
              {/* 添加到学习集弹出层 */}
              {isAddingToSet && (
                <Paper 
                  elevation={3}
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    p: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    bgcolor: 'rgba(255, 255, 255, 0.95)',
                    zIndex: 10
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    选择要添加到的学习集
                  </Typography>
                  
                  <Box sx={{ flexGrow: 1, overflow: 'auto', my: 2 }}>
                    <List>
                      {learningSets.map((set) => (
                        <ListItem 
                          key={set.id}
                          button
                          selected={selectedSetId === set.id}
                          onClick={() => setSelectedSetId(set.id)}
                          sx={{
                            borderRadius: 1,
                            mb: 1,
                            border: '1px solid',
                            borderColor: selectedSetId === set.id ? 'primary.main' : 'divider'
                          }}
                        >
                          <ListItemText
                            primary={set.name}
                            secondary={`${set.wordCount}个词汇 • ${getDifficultyText(set.difficulty)}难度`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button onClick={() => setIsAddingToSet(false)}>
                      取消
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      disabled={!selectedSetId}
                      onClick={addToLearningSet}
                      endIcon={<CheckIcon />}
                    >
                      确认添加
                    </Button>
                  </Box>
                </Paper>
              )}
            </Paper>
          ) : (
            <Paper 
              sx={{ 
                p: 4, 
                height: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                flexDirection: 'column',
                textAlign: 'center'
              }}
            >
              <SchoolIcon sx={{ fontSize: 60, color: 'primary.light', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                输入要查询的英语单词
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400 }}>
                使用上方搜索框查询单词，获取详细解释、例句和学习建议。您可以将单词保存到学习集中以便复习。
              </Typography>
            </Paper>
          )}
        </Grid>
        
        {/* 右侧：最近查询和学习集 */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ height: '100%' }}>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab label="最近查询" />
              <Tab label="学习集" />
            </Tabs>
            
            <Box sx={{ p: 2, height: 'calc(100% - 48px)', overflow: 'auto' }}>
              {activeTab === 0 ? (
                // 最近查询的词汇
                recentWords.length > 0 ? (
                  <List sx={{ p: 0 }}>
                    {recentWords.map((word) => (
                      <ListItem 
                        key={word.id}
                        button
                        onClick={() => {
                          setSearchTerm(word.word);
                          setCurrentWord(word);
                        }}
                        sx={{ 
                          borderRadius: 1,
                          mb: 1,
                          border: '1px solid',
                          borderColor: 'divider'
                        }}
                      >
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Typography variant="body1">{word.word}</Typography>
                              {word.isBookmarked && (
                                <BookmarkIcon color="primary" sx={{ ml: 1, fontSize: 16 }} />
                              )}
                            </Box>
                          }
                          secondary={word.phonetic}
                        />
                        <Chip 
                          label={getDifficultyText(word.difficulty)} 
                          color={getDifficultyColor(word.difficulty) as any}
                          size="small"
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Box sx={{ textAlign: 'center', pt: 4 }}>
                    <TimerIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      您最近查询的词汇将显示在这里
                    </Typography>
                  </Box>
                )
              ) : (
                // 学习集列表
                <Box>
                  <List sx={{ p: 0 }}>
                    {learningSets.map((set) => (
                      <Card key={set.id} variant="outlined" sx={{ mb: 2 }}>
                        <CardContent sx={{ pb: 1 }}>
                          <Typography variant="h6" gutterBottom>
                            {set.name}
                          </Typography>
                          {set.description && (
                            <Typography variant="body2" color="text.secondary" paragraph>
                              {set.description}
                            </Typography>
                          )}
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Chip 
                              label={`${set.wordCount}个词汇`}
                              size="small"
                              sx={{ mr: 1 }}
                            />
                            <Chip 
                              label={`${getDifficultyText(set.difficulty)}难度`}
                              color={getDifficultyColor(set.difficulty) as any}
                              size="small"
                            />
                          </Box>
                        </CardContent>
                        <CardActions>
                          <Button 
                            size="small" 
                            color="primary"
                            endIcon={<ArrowForwardIcon />}
                          >
                            开始学习
                          </Button>
                        </CardActions>
                      </Card>
                    ))}
                  </List>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      {/* 通知提示 */}
      <Snackbar
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={() => setShowSnackbar(false)}
      >
        <Alert 
          onClose={() => setShowSnackbar(false)} 
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default VocabularyHelper; 