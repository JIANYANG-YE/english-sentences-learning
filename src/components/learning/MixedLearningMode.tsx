import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  IconButton,
  Chip,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Alert,
  Snackbar,
  Tabs,
  Tab,
  Paper,
  Grid,
  Divider,
  Tooltip
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Shuffle as ShuffleIcon,
  Timer as TimerIcon,
  Check as CheckIcon,
  VolumeUp as VolumeUpIcon,
  Brightness1 as Brightness1Icon,
  Brightness2 as Brightness2Icon,
  Brightness3 as Brightness3Icon
} from '@mui/icons-material';
import { DifficultyLevel } from '@/types/learning';

// 学习模式定义
export enum LearningMode {
  ChineseToEnglish = 'chineseToEnglish',
  EnglishToChinese = 'englishToChinese',
  Grammar = 'grammar',
  Listening = 'listening'
}

// 学习内容接口
interface LearningContent {
  id: string;
  english: string;
  chinese: string;
  grammar?: string;
  audioUrl?: string;
  difficulty: DifficultyLevel;
  tags: string[];
}

// 模式设置接口
interface ModeSettings {
  autoSwitch: boolean;
  switchInterval: number; // 单位：分钟
  randomOrder: boolean;
  includeChineseToEnglish: boolean;
  includeEnglishToChinese: boolean;
  includeGrammar: boolean;
  includeListening: boolean;
  difficulty: DifficultyLevel;
}

// 用户回答接口
interface UserAnswer {
  contentId: string;
  mode: LearningMode;
  answer: string;
  isCorrect: boolean;
  timestamp: number;
}

// 组件属性接口
interface MixedLearningModeProps {
  initialContents?: LearningContent[];
  onSaveProgress?: (answers: UserAnswer[]) => void;
  onModeChange?: (mode: LearningMode) => void;
}

// 默认学习内容数据（模拟数据）
const defaultContents: LearningContent[] = [
  {
    id: '1',
    english: 'The weather is nice today.',
    chinese: '今天天气很好。',
    grammar: 'Simple present tense with "is".',
    audioUrl: '/audio/weather.mp3',
    difficulty: DifficultyLevel.Beginner,
    tags: ['weather', 'daily conversation']
  },
  {
    id: '2',
    english: 'I have been studying English for five years.',
    chinese: '我已经学习英语五年了。',
    grammar: 'Present perfect continuous tense.',
    audioUrl: '/audio/studying.mp3',
    difficulty: DifficultyLevel.Intermediate,
    tags: ['study', 'experience']
  },
  {
    id: '3',
    english: 'If I had known about the party, I would have attended it.',
    chinese: '如果我知道有聚会，我就会参加。',
    grammar: 'Third conditional with past perfect and would have + past participle.',
    audioUrl: '/audio/party.mp3',
    difficulty: DifficultyLevel.Advanced,
    tags: ['conditional', 'party', 'social']
  },
  {
    id: '4',
    english: 'She suggested that we go to the museum.',
    chinese: '她建议我们去博物馆。',
    grammar: 'Subjunctive mood after "suggest".',
    audioUrl: '/audio/museum.mp3',
    difficulty: DifficultyLevel.Intermediate,
    tags: ['suggestion', 'museum', 'leisure']
  },
  {
    id: '5',
    english: 'I need to buy some groceries.',
    chinese: '我需要买一些杂货。',
    grammar: 'Simple present with infinitive.',
    audioUrl: '/audio/groceries.mp3',
    difficulty: DifficultyLevel.Beginner,
    tags: ['shopping', 'daily life']
  }
];

// 默认模式设置
const defaultSettings: ModeSettings = {
  autoSwitch: false,
  switchInterval: 5,
  randomOrder: false,
  includeChineseToEnglish: true,
  includeEnglishToChinese: true,
  includeGrammar: true,
  includeListening: true,
  difficulty: DifficultyLevel.Intermediate
};

// 混合学习模式组件
const MixedLearningMode: React.FC<MixedLearningModeProps> = ({
  initialContents = defaultContents,
  onSaveProgress,
  onModeChange
}) => {
  // 状态管理
  const [contents, setContents] = useState<LearningContent[]>(initialContents);
  const [filteredContents, setFilteredContents] = useState<LearningContent[]>(initialContents);
  const [currentContentIndex, setCurrentContentIndex] = useState(0);
  const [currentMode, setCurrentMode] = useState<LearningMode>(LearningMode.ChineseToEnglish);
  const [settings, setSettings] = useState<ModeSettings>(defaultSettings);
  const [userAnswer, setUserAnswer] = useState('');
  const [answeredCorrectly, setAnsweredCorrectly] = useState<boolean | null>(null);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [autoSwitchTimer, setAutoSwitchTimer] = useState<NodeJS.Timeout | null>(null);
  const [remainingTime, setRemainingTime] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // 当前内容
  const currentContent = filteredContents[currentContentIndex];

  // 可用的学习模式
  const getAvailableModes = useCallback((): LearningMode[] => {
    const modes: LearningMode[] = [];
    
    if (settings.includeChineseToEnglish) {
      modes.push(LearningMode.ChineseToEnglish);
    }
    
    if (settings.includeEnglishToChinese) {
      modes.push(LearningMode.EnglishToChinese);
    }
    
    if (settings.includeGrammar && currentContent.grammar) {
      modes.push(LearningMode.Grammar);
    }
    
    if (settings.includeListening && currentContent.audioUrl) {
      modes.push(LearningMode.Listening);
    }
    
    return modes;
  }, [settings, currentContent]);

  // 根据难度级别筛选内容
  useEffect(() => {
    const filtered = initialContents.filter(
      content => content.difficulty === settings.difficulty
    );
    setFilteredContents(filtered);
    setCurrentContentIndex(0);
  }, [initialContents, settings.difficulty]);

  // 处理自动切换模式
  useEffect(() => {
    if (settings.autoSwitch && autoSwitchTimer === null) {
      const interval = settings.switchInterval * 60 * 1000; // 转换为毫秒
      const timer = setInterval(() => {
        switchMode();
      }, interval);
      
      setAutoSwitchTimer(timer);
      setRemainingTime(interval / 1000);
      
      // 更新倒计时
      const countdownTimer = setInterval(() => {
        setRemainingTime(prev => {
          if (prev <= 1) return settings.switchInterval * 60;
          return prev - 1;
        });
      }, 1000);
      
      return () => {
        clearInterval(timer);
        clearInterval(countdownTimer);
        setAutoSwitchTimer(null);
      };
    } else if (!settings.autoSwitch && autoSwitchTimer !== null) {
      clearInterval(autoSwitchTimer);
      setAutoSwitchTimer(null);
    }
  }, [settings.autoSwitch, settings.switchInterval, autoSwitchTimer]);

  // 随机或顺序切换模式
  const switchMode = useCallback(() => {
    const modes = getAvailableModes();
    
    if (modes.length === 0) {
      setSnackbarMessage('没有可用的学习模式，请在设置中启用至少一种模式');
      setSnackbarOpen(true);
      return;
    }
    
    let nextMode;
    
    if (settings.randomOrder) {
      // 随机选择一个不同的模式
      const availableModes = modes.filter(mode => mode !== currentMode);
      
      if (availableModes.length === 0) {
        nextMode = currentMode; // 如果只有一种模式，保持不变
      } else {
        const randomIndex = Math.floor(Math.random() * availableModes.length);
        nextMode = availableModes[randomIndex];
      }
    } else {
      // 顺序选择下一个模式
      const currentIndex = modes.indexOf(currentMode);
      const nextIndex = (currentIndex + 1) % modes.length;
      nextMode = modes[nextIndex];
    }
    
    setCurrentMode(nextMode);
    
    if (onModeChange) {
      onModeChange(nextMode);
    }
    
    setSnackbarMessage(`已切换到${getModeNameInChinese(nextMode)}模式`);
    setSnackbarOpen(true);
  }, [currentMode, getAvailableModes, settings.randomOrder, onModeChange]);

  // 获取模式的中文名称
  const getModeNameInChinese = (mode: LearningMode): string => {
    switch (mode) {
      case LearningMode.ChineseToEnglish:
        return '中译英';
      case LearningMode.EnglishToChinese:
        return '英译中';
      case LearningMode.Grammar:
        return '语法';
      case LearningMode.Listening:
        return '听力';
      default:
        return '未知';
    }
  };

  // 处理答案检查
  const checkAnswer = () => {
    if (!userAnswer.trim()) {
      setSnackbarMessage('请输入你的答案');
      setSnackbarOpen(true);
      return;
    }
    
    let isCorrect = false;
    
    switch (currentMode) {
      case LearningMode.ChineseToEnglish:
        // 简单比较，实际应用中可能需要更复杂的比较逻辑
        isCorrect = userAnswer.trim().toLowerCase() === currentContent.english.toLowerCase();
        break;
      case LearningMode.EnglishToChinese:
        isCorrect = userAnswer.trim() === currentContent.chinese;
        break;
      case LearningMode.Grammar:
        // 语法问题可能有多个正确答案，这里简化处理
        isCorrect = userAnswer.trim().toLowerCase().includes(
          currentContent.grammar?.toLowerCase() || ''
        );
        break;
      case LearningMode.Listening:
        isCorrect = userAnswer.trim().toLowerCase() === currentContent.english.toLowerCase();
        break;
    }
    
    setAnsweredCorrectly(isCorrect);
    
    // 记录答案
    const newAnswer: UserAnswer = {
      contentId: currentContent.id,
      mode: currentMode,
      answer: userAnswer,
      isCorrect,
      timestamp: Date.now()
    };
    
    setAnswers(prev => [...prev, newAnswer]);
    
    if (onSaveProgress) {
      onSaveProgress([...answers, newAnswer]);
    }
    
    setSnackbarMessage(isCorrect ? '回答正确！' : '回答错误，请再试一次');
    setSnackbarOpen(true);
  };

  // 进入下一个问题
  const nextQuestion = () => {
    setUserAnswer('');
    setAnsweredCorrectly(null);
    
    if (isPlaying) {
      stopAudio();
    }
    
    // 如果是最后一个问题，回到第一个
    if (currentContentIndex >= filteredContents.length - 1) {
      setCurrentContentIndex(0);
    } else {
      setCurrentContentIndex(currentContentIndex + 1);
    }
    
    // 如果启用了随机模式切换，那么在转到下一个问题时也切换模式
    if (settings.randomOrder) {
      switchMode();
    }
  };

  // 播放音频
  const playAudio = () => {
    if (currentContent.audioUrl && !isPlaying) {
      setIsLoading(true);
      
      if (!audioElement) {
        const audio = new Audio(currentContent.audioUrl);
        setAudioElement(audio);
        
        audio.onloadeddata = () => {
          setIsLoading(false);
          audio.play();
          setIsPlaying(true);
        };
        
        audio.onended = () => {
          setIsPlaying(false);
        };
        
        audio.onerror = () => {
          setIsLoading(false);
          setSnackbarMessage('音频加载失败');
          setSnackbarOpen(true);
        };
      } else {
        audioElement.currentTime = 0;
        audioElement.play();
        setIsPlaying(true);
        setIsLoading(false);
      }
    }
  };

  // 停止音频
  const stopAudio = () => {
    if (audioElement && isPlaying) {
      audioElement.pause();
      audioElement.currentTime = 0;
      setIsPlaying(false);
    }
  };

  // 当切换到听力模式时自动播放音频
  useEffect(() => {
    if (currentMode === LearningMode.Listening && currentContent.audioUrl) {
      playAudio();
    }
  }, [currentMode, currentContentIndex]);

  // 在组件卸载时清理音频
  useEffect(() => {
    return () => {
      if (audioElement) {
        audioElement.pause();
        setAudioElement(null);
      }
    };
  }, []);

  // 更新设置
  const handleSettingsChange = (
    name: keyof ModeSettings,
    value: boolean | number | DifficultyLevel
  ) => {
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 渲染当前问题
  const renderQuestion = () => {
    switch (currentMode) {
      case LearningMode.ChineseToEnglish:
        return (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>请将以下中文翻译成英文：</Typography>
            <Card variant="outlined" sx={{ p: 2, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
              <Typography variant="h5">{currentContent.chinese}</Typography>
            </Card>
          </Box>
        );
      case LearningMode.EnglishToChinese:
        return (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>请将以下英文翻译成中文：</Typography>
            <Card variant="outlined" sx={{ p: 2, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
              <Typography variant="h5">{currentContent.english}</Typography>
            </Card>
          </Box>
        );
      case LearningMode.Grammar:
        return (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>请解释下面句子中的语法结构：</Typography>
            <Card variant="outlined" sx={{ p: 2, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
              <Typography variant="h5">{currentContent.english}</Typography>
            </Card>
          </Box>
        );
      case LearningMode.Listening:
        return (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>请听音频并写出你听到的英文句子：</Typography>
            <Card variant="outlined" sx={{ p: 2, bgcolor: 'primary.light', color: 'primary.contrastText', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <IconButton 
                color="inherit" 
                size="large" 
                onClick={isPlaying ? stopAudio : playAudio}
                disabled={isLoading}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  <VolumeUpIcon fontSize="large" />
                )}
              </IconButton>
              <Typography variant="body1" sx={{ ml: 2 }}>
                {isPlaying ? '正在播放...' : '点击播放音频'}
              </Typography>
            </Card>
          </Box>
        );
      default:
        return null;
    }
  };

  // 根据难度设置图标
  const renderDifficultyIcon = (level: DifficultyLevel) => {
    switch (level) {
      case DifficultyLevel.Beginner:
        return <Brightness1Icon fontSize="small" />;
      case DifficultyLevel.Intermediate:
        return <Brightness2Icon fontSize="small" />;
      case DifficultyLevel.Advanced:
        return <Brightness3Icon fontSize="small" />;
    }
  };

  // 主渲染函数
  return (
    <Box sx={{ width: '100%', maxWidth: 800, mx: 'auto', p: 2 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">混合学习模式</Typography>
          <Box>
            <Chip
              icon={renderDifficultyIcon(settings.difficulty)}
              label={`难度: ${
                settings.difficulty === DifficultyLevel.Beginner
                  ? '初级'
                  : settings.difficulty === DifficultyLevel.Intermediate
                  ? '中级'
                  : '高级'
              }`}
              color="primary"
              variant="outlined"
              sx={{ mr: 1 }}
            />
            <Button
              variant="outlined"
              onClick={() => setShowSettings(!showSettings)}
            >
              {showSettings ? '隐藏设置' : '显示设置'}
            </Button>
          </Box>
        </Box>

        {showSettings && (
          <Card variant="outlined" sx={{ mb: 3, p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>学习模式设置</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.autoSwitch}
                      onChange={(e) => handleSettingsChange('autoSwitch', e.target.checked)}
                    />
                  }
                  label="自动切换模式"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth disabled={!settings.autoSwitch}>
                  <InputLabel>切换间隔（分钟）</InputLabel>
                  <Select
                    value={settings.switchInterval}
                    label="切换间隔（分钟）"
                    onChange={(e) => handleSettingsChange('switchInterval', Number(e.target.value))}
                  >
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={3}>3</MenuItem>
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={15}>15</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.randomOrder}
                      onChange={(e) => handleSettingsChange('randomOrder', e.target.checked)}
                    />
                  }
                  label="随机模式顺序"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>难度级别</InputLabel>
                  <Select
                    value={settings.difficulty}
                    label="难度级别"
                    onChange={(e) => handleSettingsChange('difficulty', e.target.value as DifficultyLevel)}
                  >
                    <MenuItem value={DifficultyLevel.Beginner}>初级</MenuItem>
                    <MenuItem value={DifficultyLevel.Intermediate}>中级</MenuItem>
                    <MenuItem value={DifficultyLevel.Advanced}>高级</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>启用的学习模式:</Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.includeChineseToEnglish}
                      onChange={(e) => handleSettingsChange('includeChineseToEnglish', e.target.checked)}
                    />
                  }
                  label="中译英"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.includeEnglishToChinese}
                      onChange={(e) => handleSettingsChange('includeEnglishToChinese', e.target.checked)}
                    />
                  }
                  label="英译中"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.includeGrammar}
                      onChange={(e) => handleSettingsChange('includeGrammar', e.target.checked)}
                    />
                  }
                  label="语法"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.includeListening}
                      onChange={(e) => handleSettingsChange('includeListening', e.target.checked)}
                    />
                  }
                  label="听力"
                />
              </Grid>
            </Grid>
          </Card>
        )}
        
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="h6">
              当前模式: {getModeNameInChinese(currentMode)}
            </Typography>
            <Box>
              {settings.autoSwitch && (
                <Chip
                  icon={<TimerIcon />}
                  label={`${Math.floor(remainingTime / 60)}:${String(remainingTime % 60).padStart(2, '0')}`}
                  color="secondary"
                  sx={{ mr: 1 }}
                />
              )}
              <Tooltip title="切换模式">
                <IconButton onClick={switchMode} color="primary">
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="随机切换">
                <IconButton onClick={() => {
                  handleSettingsChange('randomOrder', true);
                  switchMode();
                }} color="secondary">
                  <ShuffleIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          
          <Divider sx={{ mb: 2 }} />
          
          {renderQuestion()}
          
          <TextField
            fullWidth
            label="你的答案"
            variant="outlined"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            multiline
            rows={3}
            sx={{ mb: 2 }}
            error={answeredCorrectly === false}
            disabled={answeredCorrectly === true}
          />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={checkAnswer}
              disabled={answeredCorrectly === true || !userAnswer.trim()}
            >
              检查答案
            </Button>
            
            <Button
              variant="outlined"
              color="secondary"
              onClick={nextQuestion}
            >
              下一题
            </Button>
          </Box>
          
          {answeredCorrectly !== null && (
            <Alert 
              severity={answeredCorrectly ? "success" : "error"}
              sx={{ mt: 2 }}
              action={
                answeredCorrectly ? (
                  <Button color="inherit" size="small" onClick={nextQuestion}>
                    下一题
                  </Button>
                ) : null
              }
            >
              {answeredCorrectly ? '回答正确！' : '回答错误。'}
              
              {!answeredCorrectly && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  正确答案: {
                    currentMode === LearningMode.ChineseToEnglish ? currentContent.english :
                    currentMode === LearningMode.EnglishToChinese ? currentContent.chinese :
                    currentMode === LearningMode.Grammar ? currentContent.grammar :
                    currentContent.english
                  }
                </Typography>
              )}
            </Alert>
          )}
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            学习进度: {currentContentIndex + 1} / {filteredContents.length}
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={(currentContentIndex + 1) / filteredContents.length * 100} 
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>
      </Paper>
      
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Box>
  );
};

// 添加 LinearProgress 组件
const LinearProgress = (props: any) => {
  return (
    <Box sx={{ width: '100%', bgcolor: '#e0e0e0', borderRadius: props.sx?.borderRadius || 0 }}>
      <Box
        sx={{
          width: `${props.value}%`,
          height: props.sx?.height || 4,
          bgcolor: props.color === 'secondary' ? 'secondary.main' : 'primary.main',
          borderRadius: props.sx?.borderRadius || 0,
          transition: 'width 0.4s ease-in-out'
        }}
      />
    </Box>
  );
};

export default MixedLearningMode; 