import React, { useState, useRef, useEffect } from 'react';
import { Box, TextField, Button, Typography, IconButton, Slider, Tooltip, Paper } from '@mui/material';
import { FaVolumeUp, FaPlay, FaPause, FaCheck, FaTimes, FaLightbulb } from 'react-icons/fa';
import { SentencePair } from '@/types/courses/contentTypes';

interface UserPreferences {
  showPinyin?: boolean;
  audioSpeed?: number;
  hintLevel?: number;
  maxAttempts?: number;
}

interface ListeningModeProps {
  sentencePair: SentencePair;
  onComplete?: (success: boolean, attempts: number) => void;
  preferences?: UserPreferences;
  onNext?: () => void;
}

const ListeningMode: React.FC<ListeningModeProps> = ({
  sentencePair,
  onComplete,
  preferences = {},
  onNext
}) => {
  // 默认首选项
  const defaultPrefs = {
    showPinyin: false,
    audioSpeed: 1.0,
    hintLevel: 0,
    maxAttempts: 3
  };

  // 合并默认设置和用户设置
  const prefs = { ...defaultPrefs, ...preferences };
  
  // 状态
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<{
    correct: boolean;
    message: string;
    show: boolean;
  }>({ correct: false, message: '', show: false });
  const [attempts, setAttempts] = useState(0);
  const [hintLevel, setHintLevel] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioSpeed, setAudioSpeed] = useState(prefs.audioSpeed);
  const [showEnglish, setShowEnglish] = useState(false);
  
  // 音频引用
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // 初始化音频元素
  useEffect(() => {
    if (sentencePair.audioUrl) {
      audioRef.current = new Audio(sentencePair.audioUrl);
      audioRef.current.playbackRate = audioSpeed;
      
      return () => {
        if (audioRef.current) {
          audioRef.current.pause();
        }
      };
    }
  }, [sentencePair.audioUrl, audioSpeed]);

  // 播放音频
  const playAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(error => console.error('音频播放失败:', error));
        setIsPlaying(true);
        audioRef.current.onended = () => setIsPlaying(false);
      }
    }
  };

  // 处理速度变化
  const handleSpeedChange = (_event: Event, newValue: number | number[]) => {
    const speed = newValue as number;
    setAudioSpeed(speed);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  };

  // 提交答案
  const handleSubmit = () => {
    // 简单的字符串匹配，实际应用可能需要更复杂的比较
    const normalizedUserAnswer = userAnswer.trim().toLowerCase();
    const normalizedCorrectAnswer = sentencePair.english.trim().toLowerCase();
    
    const isCorrect = normalizedUserAnswer === normalizedCorrectAnswer;
    const newAttempts = attempts + 1;
    
    if (isCorrect) {
      setFeedback({
        correct: true,
        message: '正确! 🎉',
        show: true
      });
      onComplete?.(true, newAttempts);
    } else {
      if (newAttempts >= prefs.maxAttempts) {
        setFeedback({
          correct: false,
          message: `正确答案是: ${sentencePair.english}`,
          show: true
        });
        setShowEnglish(true);
        onComplete?.(false, newAttempts);
      } else {
        setFeedback({
          correct: false,
          message: '请再试一次',
          show: true
        });
      }
    }
    
    setAttempts(newAttempts);
  };

  // 获取提示
  const getHint = () => {
    const nextHintLevel = hintLevel + 1;
    setHintLevel(nextHintLevel);
    
    const englishText = sentencePair.english;
    
    let hintText = '';
    switch (nextHintLevel) {
      case 1:
        // 第一级提示: 显示句子长度和首字母
        hintText = `句子长度: ${englishText.length} 字符，首字母: ${englishText[0]}`;
        break;
      case 2:
        // 第二级提示: 显示部分字母和占位符
        hintText = englishText.split('').map((char, index) => {
          if (char === ' ') return ' ';
          return index % 3 === 0 ? char : '_';
        }).join('');
        break;
      case 3:
        // 第三级提示: 显示完整句子的一半
        const halfLength = Math.floor(englishText.length / 2);
        hintText = englishText.substring(0, halfLength) + '...';
        break;
      default:
        hintText = '';
    }
    
    setFeedback({
      correct: false,
      message: `提示: ${hintText}`,
      show: true
    });
  };

  // 处理下一个句子
  const handleNext = () => {
    // 重置状态
    setUserAnswer('');
    setFeedback({ correct: false, message: '', show: false });
    setAttempts(0);
    setHintLevel(0);
    setShowEnglish(false);
    
    // 调用下一个回调
    onNext?.();
  };

  return (
    <Box sx={{ padding: 3, maxWidth: 600, margin: '0 auto' }}>
      <Typography variant="h6" gutterBottom>
        听力练习
      </Typography>
      
      <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: 2 }}>
            <IconButton 
              onClick={playAudio}
              disabled={!sentencePair.audioUrl}
              color="primary"
              size="large"
              sx={{ mr: 2 }}
            >
              {isPlaying ? <FaPause /> : <FaPlay />}
            </IconButton>
            
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ mr: 1 }}>速度:</Typography>
                <Slider
                  value={audioSpeed}
                  onChange={handleSpeedChange}
                  step={0.1}
                  marks
                  min={0.5}
                  max={2}
                  valueLabelDisplay="auto"
                  sx={{ flexGrow: 1 }}
                />
              </Box>
              
              <Typography variant="caption" sx={{ alignSelf: 'flex-end' }}>
                {audioSpeed.toFixed(1)}x
              </Typography>
            </Box>
          </Box>
          
          {showEnglish && (
            <Typography variant="body1" sx={{ mt: 2, mb: 1 }}>
              {sentencePair.english}
            </Typography>
          )}
          
          <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic', mt: 1 }}>
            {sentencePair.chinese}
          </Typography>
        </Box>
      </Paper>
      
      <TextField
        fullWidth
        multiline
        rows={3}
        variant="outlined"
        placeholder="输入你听到的英文句子..."
        value={userAnswer}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserAnswer(e.target.value)}
        sx={{ mb: 2 }}
      />
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Button 
          variant="contained" 
          color="primary"
          onClick={handleSubmit}
          disabled={feedback.correct || attempts >= prefs.maxAttempts}
        >
          提交
        </Button>
        
        <Tooltip title="获取提示">
          <IconButton 
            onClick={getHint}
            disabled={hintLevel >= 3 || feedback.correct}
            color="info"
          >
            <FaLightbulb />
          </IconButton>
        </Tooltip>
      </Box>
      
      {feedback.show && (
        <Box 
          sx={{
            p: 2,
            mb: 2,
            borderRadius: 1,
            backgroundColor: feedback.correct ? 'success.light' : 'warning.light',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          {feedback.correct ? <FaCheck /> : <FaTimes />}
          <Typography sx={{ ml: 1 }}>{feedback.message}</Typography>
        </Box>
      )}
      
      {(feedback.correct || attempts >= prefs.maxAttempts) && (
        <Button 
          variant="outlined" 
          color="primary" 
          onClick={handleNext}
          fullWidth
        >
          下一句
        </Button>
      )}
    </Box>
  );
};

export default ListeningMode; 