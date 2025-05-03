import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  IconButton,
  Card,
  CardContent,
  Divider,
  CircularProgress,
  Tooltip,
  Chip,
  Grid,
  LinearProgress,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  Mic as MicIcon,
  Stop as StopIcon,
  VolumeUp as VolumeUpIcon,
  Audiotrack as AudiotrackIcon,
  Replay as ReplayIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  RecordVoiceOver as RecordVoiceOverIcon,
  Favorite as FavoriteIcon,
  PlayCircleOutline as PlayCircleOutlineIcon,
  ExpandMore as ExpandMoreIcon,
  SvgIconComponent
} from '@mui/icons-material';

// 定义评分类型
interface PronunciationScore {
  overall: number; // 0-100
  accuracy: number;
  fluency: number;
  rhythm: number;
  intonation: number;
}

// 定义单词发音评估
interface WordAssessment {
  word: string;
  startTime: number;
  endTime: number;
  score: number; // 0-100
  correct: boolean;
  phonemes: {
    symbol: string;
    score: number;
  }[];
}

// 定义发音问题
interface PronunciationIssue {
  type: 'vowel' | 'consonant' | 'stress' | 'intonation' | 'rhythm';
  description: string;
  example: string;
  suggestion: string;
  icon: SvgIconComponent;
}

// 定义组件属性
interface PronunciationCoachProps {
  initialText?: string;
  onScoreChange?: (score: PronunciationScore) => void;
  userLevel?: 'beginner' | 'intermediate' | 'advanced';
}

// 主组件
const PronunciationCoach: React.FC<PronunciationCoachProps> = ({
  initialText = '',
  onScoreChange,
  userLevel = 'intermediate'
}) => {
  // 状态管理
  const [text, setText] = useState(initialText || 'The quick brown fox jumps over the lazy dog.');
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [recordingTimer, setRecordingTimer] = useState<NodeJS.Timeout | null>(null);
  const [score, setScore] = useState<PronunciationScore | null>(null);
  const [wordAssessments, setWordAssessments] = useState<WordAssessment[]>([]);
  const [issues, setIssues] = useState<PronunciationIssue[]>([]);
  const [practiceCount, setPracticeCount] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // 示例句子列表
  const exampleSentences = [
    "The quick brown fox jumps over the lazy dog.",
    "She sells seashells by the seashore.",
    "How much wood would a woodchuck chuck if a woodchuck could chuck wood?",
    "Peter Piper picked a peck of pickled peppers.",
    "I scream, you scream, we all scream for ice cream."
  ];
  
  // 常见发音问题
  const commonIssues: PronunciationIssue[] = [
    {
      type: 'vowel',
      description: '/æ/ 和 /e/ 的区分',
      example: 'bad vs bed',
      suggestion: '发 /æ/ 时，嘴巴要张得更开，下巴下降。',
      icon: RecordVoiceOverIcon
    },
    {
      type: 'consonant',
      description: '/θ/ 和 /s/ 的区分',
      example: 'think vs sink',
      suggestion: '发 /θ/ 时，舌尖应放在上下齿之间，而不是在牙齿后面。',
      icon: RecordVoiceOverIcon
    },
    {
      type: 'stress',
      description: '单词重音位置',
      example: 'PHOtograph vs phoTOgraphy',
      suggestion: '注意多音节单词中重音的位置，重音音节发音更响亮、时间更长。',
      icon: AudiotrackIcon
    },
    {
      type: 'intonation',
      description: '句子语调',
      example: 'Are you coming? vs You are coming.',
      suggestion: '问句通常以升调结束，而陈述句通常以降调结束。',
      icon: AudiotrackIcon
    },
    {
      type: 'rhythm',
      description: '语句节奏',
      example: 'I WANT to GO to the STORE.',
      suggestion: '英语是重音计时语言，重音音节之间的时间间隔大致相等。',
      icon: AudiotrackIcon
    }
  ];

  // 释放计时器
  useEffect(() => {
    return () => {
      if (recordingTimer) {
        clearInterval(recordingTimer);
      }
    };
  }, [recordingTimer]);

  // 开始录音
  const startRecording = () => {
    setIsRecording(true);
    setRecordingDuration(0);
    
    // 开始计时
    const timer = setInterval(() => {
      setRecordingDuration(prev => prev + 1);
    }, 1000);
    
    setRecordingTimer(timer);
    
    // 这里应该有实际的录音逻辑
    // 为了演示，我们只是模拟
  };

  // 停止录音并分析
  const stopRecording = () => {
    setIsRecording(false);
    
    if (recordingTimer) {
      clearInterval(recordingTimer);
      setRecordingTimer(null);
    }
    
    // 模拟处理录音
    setIsProcessing(true);
    
    setTimeout(() => {
      // 模拟评分和分析结果
      const simulatedScore = simulatePronunciationScore();
      const simulatedWordAssessments = simulateWordAssessments(text);
      const simulatedIssues = selectRelevantIssues(text);
      
      setScore(simulatedScore);
      setWordAssessments(simulatedWordAssessments);
      setIssues(simulatedIssues);
      
      if (onScoreChange) {
        onScoreChange(simulatedScore);
      }
      
      setPracticeCount(prev => prev + 1);
      setIsProcessing(false);
    }, 2000);
  };

  // 播放示范音频
  const playAudio = () => {
    if (audioRef.current) {
      setIsPlaying(true);
      audioRef.current.play();
    }
  };

  // 处理音频播放结束
  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  // 使用示例句子
  const useExampleSentence = (sentence: string) => {
    setText(sentence);
    // 重置之前的评估结果
    setScore(null);
    setWordAssessments([]);
  };

  // 重置为新文本
  const resetPractice = () => {
    setText('');
    setScore(null);
    setWordAssessments([]);
    setIssues([]);
  };

  // 模拟发音评分
  const simulatePronunciationScore = (): PronunciationScore => {
    // 基于用户级别模拟不同的评分范围
    const levelFactor = 
      userLevel === 'beginner' ? 0.7 : 
      userLevel === 'intermediate' ? 0.8 : 0.9;
    
    // 增加一点随机性
    const randomFactor = () => 0.85 + Math.random() * 0.15;
    
    return {
      overall: Math.round(85 * levelFactor * randomFactor()),
      accuracy: Math.round(82 * levelFactor * randomFactor()),
      fluency: Math.round(88 * levelFactor * randomFactor()),
      rhythm: Math.round(80 * levelFactor * randomFactor()),
      intonation: Math.round(84 * levelFactor * randomFactor())
    };
  };

  // 模拟单词评估
  const simulateWordAssessments = (text: string): WordAssessment[] => {
    const words = text.trim().split(/\s+/);
    let currentTime = 0.2; // 起始时间
    
    return words.map((word, index) => {
      const wordDuration = 0.3 + (word.length * 0.05); // 根据单词长度模拟持续时间
      const startTime = currentTime;
      const endTime = startTime + wordDuration;
      currentTime = endTime + 0.1; // 添加词间间隔
      
      // 模拟得分，大多数单词评分较高，偶尔有低分单词
      const isProblematic = Math.random() < 0.2; // 20%的单词可能有问题
      const baseScore = isProblematic ? 
        50 + Math.round(Math.random() * 20) : 
        75 + Math.round(Math.random() * 25);
      
      // 模拟音素评估
      const phonemes = word.split('').map(char => ({
        symbol: char,
        score: Math.round(70 + Math.random() * 30)
      }));
      
      return {
        word,
        startTime,
        endTime,
        score: baseScore,
        correct: baseScore >= 70,
        phonemes
      };
    });
  };

  // 选择与文本相关的发音问题
  const selectRelevantIssues = (text: string): PronunciationIssue[] => {
    const selectedIssues: PronunciationIssue[] = [];
    
    // 检查文本是否包含特定字母组合，然后选择相关问题
    if (/[aeiou]/.test(text.toLowerCase())) {
      selectedIssues.push(commonIssues[0]); // 元音问题
    }
    
    if (/th/.test(text.toLowerCase())) {
      selectedIssues.push(commonIssues[1]); // th发音问题
    }
    
    // 总是包含一些节奏和语调问题
    selectedIssues.push(commonIssues[3]); // 语调问题
    
    // 如果单词较多，添加重音问题
    if (text.split(/\s+/).length > 5) {
      selectedIssues.push(commonIssues[2]); // 重音问题
    }
    
    // 确保至少返回2个问题
    if (selectedIssues.length < 2) {
      selectedIssues.push(commonIssues[4]); // 节奏问题
    }
    
    return selectedIssues;
  };

  // 渲染得分指示器
  const renderScoreIndicator = (value: number, label: string) => (
    <Box sx={{ textAlign: 'center', my: 1 }}>
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        <CircularProgress
          variant="determinate"
          value={value}
          size={64}
          thickness={5}
          sx={{ color: getScoreColor(value) }}
        />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="body1" component="div" color="text.secondary" fontWeight="bold">
            {value}
          </Typography>
        </Box>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
        {label}
      </Typography>
    </Box>
  );

  // 获取得分对应的颜色
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'success.main';
    if (score >= 75) return 'primary.main';
    if (score >= 60) return 'warning.main';
    return 'error.main';
  };

  // 获取单词背景色
  const getWordBackground = (assessment: WordAssessment) => {
    if (!score) return 'transparent';
    if (assessment.score >= 90) return 'rgba(76, 175, 80, 0.1)';
    if (assessment.score >= 75) return 'rgba(33, 150, 243, 0.1)';
    if (assessment.score >= 60) return 'rgba(255, 152, 0, 0.1)';
    return 'rgba(244, 67, 54, 0.1)';
  };

  // 获取单词文本颜色
  const getWordColor = (assessment: WordAssessment) => {
    if (!score) return 'text.primary';
    if (assessment.score >= 90) return 'success.main';
    if (assessment.score >= 75) return 'primary.main';
    if (assessment.score >= 60) return 'warning.main';
    return 'error.main';
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* 标题和信息 */}
      <Box
        sx={{
          p: 2,
          bgcolor: 'background.paper',
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <RecordVoiceOverIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6">
            发音教练
          </Typography>
        </Box>
        
        <Box>
          {practiceCount > 0 && (
            <Chip 
              label={`已练习: ${practiceCount}次`} 
              size="small" 
              color="primary" 
              variant="outlined" 
            />
          )}
        </Box>
      </Box>

      {/* 主内容区域 */}
      <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
        {/* 录音和评估区域 */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 2, overflowY: 'auto' }}>
          {/* 文本输入/显示区域 */}
          <Paper
            variant="outlined"
            sx={{ p: 2, mb: 2 }}
          >
            <TextField
              multiline
              fullWidth
              minRows={3}
              maxRows={5}
              variant="outlined"
              placeholder="输入或选择句子进行发音练习..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={isRecording || isProcessing}
              sx={{ mb: 2 }}
            />
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {exampleSentences.map((sentence, index) => (
                <Chip
                  key={index}
                  label={`示例 ${index + 1}`}
                  size="small"
                  onClick={() => useExampleSentence(sentence)}
                  color={text === sentence ? 'primary' : 'default'}
                  variant={text === sentence ? 'filled' : 'outlined'}
                />
              ))}
            </Box>
          </Paper>

          {/* 发音练习区域 */}
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1" sx={{ flex: 1 }}>
                  练习发音
                </Typography>
                <Box>
                  <IconButton 
                    color="primary" 
                    disabled={isPlaying || isRecording || isProcessing || !text.trim()}
                    onClick={playAudio}
                  >
                    <VolumeUpIcon />
                  </IconButton>
                  <IconButton 
                    color={isRecording ? 'error' : 'primary'} 
                    disabled={isPlaying || isProcessing || !text.trim()}
                    onClick={isRecording ? stopRecording : startRecording}
                  >
                    {isRecording ? <StopIcon /> : <MicIcon />}
                  </IconButton>
                </Box>
              </Box>
              
              {isRecording && (
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                    <Typography variant="h4" component="div" color="error.main" sx={{ mr: 1 }}>
                      ● REC
                    </Typography>
                    <Typography variant="h6" component="div">
                      {recordingDuration}s
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    朗读文本并录制您的发音...
                  </Typography>
                  <LinearProgress sx={{ mt: 2 }} />
                </Box>
              )}
              
              {isProcessing && (
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <CircularProgress size={40} sx={{ mb: 2 }} />
                  <Typography variant="body2" color="text.secondary">
                    分析您的发音...
                  </Typography>
                </Box>
              )}
              
              {!isRecording && !isProcessing && wordAssessments.length > 0 && (
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    发音评估
                  </Typography>
                  
                  <Paper 
                    variant="outlined" 
                    sx={{ p: 2, mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}
                  >
                    {wordAssessments.map((assessment, index) => (
                      <Tooltip 
                        key={index} 
                        title={`得分: ${assessment.score}/100`}
                        arrow
                      >
                        <Box
                          component="span"
                          sx={{
                            display: 'inline-block',
                            p: 0.5,
                            borderRadius: 1,
                            bgcolor: getWordBackground(assessment),
                            color: getWordColor(assessment),
                            fontWeight: assessment.score < 70 ? 'bold' : 'normal',
                            transition: 'all 0.2s',
                            '&:hover': {
                              bgcolor: 'action.hover',
                              transform: 'scale(1.05)'
                            }
                          }}
                        >
                          {assessment.word}
                        </Box>
                      </Tooltip>
                    ))}
                  </Paper>
                </Box>
              )}
            </CardContent>
          </Card>
          
          {/* 按钮区域 */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Button
              variant="outlined"
              startIcon={<ReplayIcon />}
              onClick={resetPractice}
              disabled={isRecording || isProcessing}
            >
              重置练习
            </Button>
            
            {score && (
              <Button
                variant="contained"
                color="primary"
                endIcon={<PlayCircleOutlineIcon />}
                onClick={() => {
                  // 开始新一轮练习
                  setScore(null);
                  setWordAssessments([]);
                  startRecording();
                }}
                disabled={isRecording || isProcessing}
              >
                再次练习
              </Button>
            )}
          </Box>
          
          {/* 隐藏的音频元素 */}
          <audio 
            ref={audioRef}
            src="/audio/example-pronunciation.mp3" // 这里应该是真实的音频URL
            onEnded={handleAudioEnded}
          />
        </Box>

        {/* 评分和建议侧边栏 */}
        <Box
          sx={{
            width: 300,
            borderLeft: 1,
            borderColor: 'divider',
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            height: '100%'
          }}
        >
          <Box
            sx={{
              p: 2,
              bgcolor: 'background.paper',
              borderBottom: 1,
              borderColor: 'divider'
            }}
          >
            <Typography variant="subtitle1">
              发音评分与建议
            </Typography>
          </Box>

          <Box
            sx={{
              flexGrow: 1,
              overflowY: 'auto',
              p: 2
            }}
          >
            {score ? (
              <>
                {/* 评分显示 */}
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                  {renderScoreIndicator(score.overall, '总体评分')}
                  
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={6}>
                      {renderScoreIndicator(score.accuracy, '准确性')}
                    </Grid>
                    <Grid item xs={6}>
                      {renderScoreIndicator(score.fluency, '流利度')}
                    </Grid>
                    <Grid item xs={6}>
                      {renderScoreIndicator(score.rhythm, '节奏')}
                    </Grid>
                    <Grid item xs={6}>
                      {renderScoreIndicator(score.intonation, '语调')}
                    </Grid>
                  </Grid>
                </Box>
                
                <Divider sx={{ mb: 2 }} />
                
                {/* 改进建议 */}
                <Typography variant="subtitle2" gutterBottom>
                  需要关注的问题
                </Typography>
                
                {issues.length > 0 ? (
                  <List disablePadding>
                    {issues.map((issue, index) => (
                      <ListItem 
                        key={index} 
                        disablePadding 
                        sx={{ 
                          py: 1, 
                          px: 0,
                          borderBottom: index < issues.length - 1 ? 1 : 0,
                          borderColor: 'divider'
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <issue.icon color="primary" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                          primary={issue.description}
                          secondary={
                            <React.Fragment>
                              <Typography variant="caption" component="span" display="block" gutterBottom>
                                例: <strong>{issue.example}</strong>
                              </Typography>
                              <Typography variant="caption" component="span" color="text.secondary">
                                {issue.suggestion}
                              </Typography>
                            </React.Fragment>
                          }
                          primaryTypographyProps={{ variant: 'body2' }}
                          sx={{ m: 0 }}
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                    未检测到显著的发音问题
                  </Typography>
                )}
                
                {/* 鼓励消息 */}
                <Box
                  sx={{
                    mt: 3,
                    p: 2,
                    bgcolor: 'primary.light',
                    color: 'primary.contrastText',
                    borderRadius: 1,
                    position: 'relative'
                  }}
                >
                  <FavoriteIcon 
                    sx={{ 
                      position: 'absolute', 
                      top: -12, 
                      right: -12,
                      color: 'error.light',
                      bgcolor: 'background.paper',
                      borderRadius: '50%',
                      p: 0.5,
                      boxShadow: 1
                    }} 
                  />
                  <Typography variant="subtitle2" gutterBottom>
                    鼓励提示
                  </Typography>
                  <Typography variant="body2">
                    {score.overall >= 80 
                      ? '太棒了！你的发音相当标准，继续保持！'
                      : score.overall >= 60
                      ? '做得不错！经过一定的练习，你的发音会更好。'
                      : '坚持练习！发音能力需要时间培养，每天进步一点点。'}
                  </Typography>
                </Box>
              </>
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  p: 2
                }}
              >
                <AudiotrackIcon 
                  sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.5, mb: 2 }} 
                />
                <Typography variant="body1" align="center" gutterBottom>
                  准备好练习发音了吗？
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center">
                  点击麦克风按钮开始录音，系统将分析您的发音并提供反馈
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default PronunciationCoach; 