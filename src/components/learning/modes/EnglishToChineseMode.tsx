import React, { useState, useRef, useEffect } from 'react';
import { Box, TextField, Button, Typography, IconButton, Tooltip } from '@mui/material';
import { FaVolumeUp, FaLightbulb, FaCheck, FaTimes } from 'react-icons/fa';
import { SentencePair } from '@/types/courses/contentTypes';

interface UserPreferences {
  showPinyin?: boolean;
  audioSpeed?: number;
  hintLevel?: number;
  maxAttempts?: number;
}

interface EnglishToChineseModeProps {
  sentencePair: SentencePair;
  onComplete?: (success: boolean, attempts: number) => void;
  preferences?: UserPreferences;
  onNext?: () => void;
}

// 标准化中文文本用于比较（移除空格、标点等）
const normalizeChineseText = (text: string): string => {
  return text
    .replace(/\s+/g, '') // 移除所有空格
    .replace(/[.,!?，。！？]/g, '') // 移除标点符号
    .toLowerCase(); // 转为小写
};

const EnglishToChineseMode: React.FC<EnglishToChineseModeProps> = ({
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
  
  // 音频引用
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // 初始化音频元素
  useEffect(() => {
    if (sentencePair.audioUrl) {
      audioRef.current = new Audio(sentencePair.audioUrl);
      audioRef.current.playbackRate = prefs.audioSpeed;
      
      return () => {
        if (audioRef.current) {
          audioRef.current.pause();
        }
      };
    }
  }, [sentencePair.audioUrl, prefs.audioSpeed]);

  // 播放音频
  const playAudio = () => {
    if (audioRef.current && !isPlaying) {
      setIsPlaying(true);
      audioRef.current.play().catch(error => console.error('音频播放失败:', error));
      audioRef.current.onended = () => setIsPlaying(false);
    }
  };

  // 提交答案
  const handleSubmit = () => {
    const normalizedUserAnswer = normalizeChineseText(userAnswer);
    const normalizedCorrectAnswer = normalizeChineseText(sentencePair.chinese);
    
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
          message: `正确答案是: ${sentencePair.chinese}`,
          show: true
        });
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
    
    const chineseText = sentencePair.chinese;
    
    let hintText = '';
    switch (nextHintLevel) {
      case 1:
        // 第一级提示: 显示句子长度和首字
        hintText = `句子长度: ${chineseText.length} 字，首字: ${chineseText[0]}`;
        break;
      case 2:
        // 第二级提示: 显示部分字符和占位符
        hintText = chineseText.split('').map((char, index) => {
          return index % 3 === 0 ? char : '○';
        }).join('');
        break;
      case 3:
        // 第三级提示: 显示完整句子
        hintText = chineseText;
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
    
    // 调用下一个回调
    onNext?.();
  };

  return (
    <Box sx={{ padding: 3, maxWidth: 600, margin: '0 auto' }}>
      <Typography variant="h6" gutterBottom>
        请将以下句子翻译成中文:
      </Typography>
      
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Typography variant="body1" sx={{ mr: 1 }}>
          {sentencePair.english}
        </Typography>
        
        {sentencePair.audioUrl && (
          <IconButton 
            onClick={playAudio}
            disabled={isPlaying}
            size="small"
            color="primary"
          >
            <FaVolumeUp />
          </IconButton>
        )}
      </Box>
      
      <TextField
        fullWidth
        multiline
        rows={2}
        variant="outlined"
        placeholder="输入中文翻译..."
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

export default EnglishToChineseMode; 