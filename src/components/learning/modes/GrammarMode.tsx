import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Divider, Chip, IconButton, Tooltip } from '@mui/material';
import { FaVolumeUp, FaInfoCircle, FaCode, FaFont } from 'react-icons/fa';
import { SentencePair } from '@/types/courses/contentTypes';
import { GrammarPoint } from '@/types/courses';

interface UserPreferences {
  showPinyin?: boolean;
  audioSpeed?: number;
  hintLevel?: number;
  showGrammarPointsByDefault?: boolean;
}

interface GrammarModeProps {
  sentencePair: SentencePair;
  onComplete?: (success: boolean) => void;
  preferences?: UserPreferences;
  onNext?: () => void;
}

const GrammarMode: React.FC<GrammarModeProps> = ({
  sentencePair,
  onComplete,
  preferences = {},
  onNext
}) => {
  // 默认首选项
  const defaultPrefs = {
    audioSpeed: 1.0,
    showPinyin: false,
    hintLevel: 0,
    showGrammarPointsByDefault: true
  };

  // 合并默认设置和用户设置
  const prefs = { ...defaultPrefs, ...preferences };
  
  // 状态
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [showGrammarPoints, setShowGrammarPoints] = useState(prefs.showGrammarPointsByDefault);
  const [showSyntaxTree, setShowSyntaxTree] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // 音频引用
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  
  // 模拟语法点数据
  const grammarPoints: GrammarPoint[] = sentencePair.grammarPoints?.map(point => ({
    id: `grammar-${Math.random().toString(36).substr(2, 9)}`,
    title: point.point || '语法点',
    explanation: point.explanation || '这是语法点的详细解释。',
    example: sentencePair.english,
    sentences: [sentencePair.english],
    syntaxTree: '(S (NP (PRP I)) (VP (VBP am) (NP (DT a) (NN student))))'
  })) || [];
  
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

  // 处理单词点击
  const handleWordClick = (word: string) => {
    setSelectedWord(selectedWord === word ? null : word);
  };

  // 将句子分词
  const tokenizeEnglish = (text: string) => {
    return text.split(/(\s+|[,.!?;:()[\]{}""''`])/g).filter(token => token.trim().length > 0);
  };

  // 处理完成
  const handleComplete = () => {
    if (onComplete) {
      onComplete(true);
    }
  };

  // 简单的语法树渲染组件
  const SyntaxTreeDisplay = () => (
    <Paper elevation={2} sx={{ p: 2, mb: 3, bgcolor: 'background.default' }}>
      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
        句法结构树
      </Typography>
      <Box sx={{ 
        fontFamily: 'monospace', 
        whiteSpace: 'pre', 
        overflow: 'auto',
        p: 1,
        bgcolor: 'action.hover',
        borderRadius: 1
      }}>
        {`
        S
        ├── NP
        │   └── PRP: I
        └── VP
            ├── VBP: am
            └── NP
                ├── DT: a
                └── NN: student
        `}
      </Box>
    </Paper>
  );

  return (
    <Box sx={{ padding: 3, maxWidth: 600, margin: '0 auto' }}>
      <Typography variant="h6" gutterBottom>
        语法分析
      </Typography>
      
      <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 'auto' }}>
            {sentencePair.audioUrl && (
              <IconButton 
                onClick={playAudio}
                disabled={isPlaying}
                size="small"
                color="primary"
                sx={{ mr: 1 }}
              >
                <FaVolumeUp />
              </IconButton>
            )}
            
            <Tooltip title="显示/隐藏语法点">
              <IconButton 
                onClick={() => setShowGrammarPoints(!showGrammarPoints)}
                size="small"
                color={showGrammarPoints ? "primary" : "default"}
              >
                <FaInfoCircle />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="显示/隐藏句法结构">
              <IconButton 
                onClick={() => setShowSyntaxTree(!showSyntaxTree)}
                size="small"
                color={showSyntaxTree ? "primary" : "default"}
                sx={{ ml: 1 }}
              >
                <FaCode />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        
        <Typography variant="body1" gutterBottom>
          {tokenizeEnglish(sentencePair.english).map((token, index) => (
            <span 
              key={index}
              onClick={() => handleWordClick(token)}
              style={{ 
                cursor: 'pointer',
                color: selectedWord === token ? '#1976d2' : 'inherit',
                fontWeight: selectedWord === token ? 'bold' : 'normal',
                textDecoration: selectedWord === token ? 'underline' : 'none'
              }}
            >
              {token}
            </span>
          ))}
        </Typography>
        
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
          {sentencePair.chinese}
        </Typography>
      </Paper>
      
      {showSyntaxTree && <SyntaxTreeDisplay />}
      
      {showGrammarPoints && grammarPoints.length > 0 && (
        <Box>
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
            语法要点
          </Typography>
          
          {grammarPoints.map((point, index) => (
            <Paper key={index} elevation={1} sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 'bold' }}>
                {point.title}
              </Typography>
              
              <Typography variant="body2" sx={{ mt: 1, mb: 2 }}>
                {point.explanation}
              </Typography>
              
              <Divider sx={{ my: 1 }} />
              
              <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'text.secondary' }}>
                例句:
              </Typography>
              
              <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                {point.example}
              </Typography>
            </Paper>
          ))}
        </Box>
      )}
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Chip 
          label="标记为已学习" 
          color="primary" 
          onClick={handleComplete}
          sx={{ mr: 1 }}
        />
        
        <Chip 
          label="下一句" 
          color="secondary" 
          onClick={onNext}
        />
      </Box>
    </Box>
  );
};

export default GrammarMode; 