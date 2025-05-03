import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Chip,
  Switch,
  FormControlLabel,
  Divider,
  TextField,
  Collapse
} from '@mui/material';
import {
  Mic as MicIcon,
  MicOff as MicOffIcon,
  MicNone as MicNoneIcon,
  VolumeUp as VolumeUpIcon,
  Settings as SettingsIcon,
  Check as CheckIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Refresh as RefreshIcon,
  ArrowDropDown as ArrowDropDownIcon,
  ArrowDropUp as ArrowDropUpIcon
} from '@mui/icons-material';

// 语音识别结果接口
export interface SpeechRecognitionResult {
  transcript: string;
  confidence: number; // 0-1之间的值，表示识别准确度
  isFinal: boolean;
  timestamp: number;
}

// 支持的语言
type SupportedLanguage = 'en-US' | 'zh-CN';

// 组件属性
interface SpeechRecognitionPanelProps {
  correctText?: string; // 正确的目标文本
  onRecognitionResult?: (result: SpeechRecognitionResult) => void;
  onRecognitionComplete?: (finalResult: string) => void;
  onCompareResult?: (similarity: number) => void; // 对比相似度回调
  language?: SupportedLanguage;
  autoStart?: boolean;
  offlineMode?: boolean;
  isEmbedded?: boolean; // 是否作为嵌入组件使用（影响样式）
}

/**
 * 语音识别面板组件
 * 
 * 使用浏览器的Web Speech API进行语音识别，并比较与正确文本的相似度。
 * 支持中英文语音识别，提供实时反馈和设置选项。
 */
export default function SpeechRecognitionPanel({
  correctText,
  onRecognitionResult = () => {},
  onRecognitionComplete = () => {},
  onCompareResult = () => {},
  language = 'en-US',
  autoStart = false,
  offlineMode = false,
  isEmbedded = false
}: SpeechRecognitionPanelProps) {
  // 状态管理
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcription, setTranscription] = useState<string>('');
  const [interimResult, setInterimResult] = useState<string>('');
  const [confidence, setConfidence] = useState<number>(0);
  const [similarity, setSimilarity] = useState<number | null>(null);
  const [status, setStatus] = useState<'idle' | 'listening' | 'processing' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>(language);
  const [continuousMode, setContinuousMode] = useState<boolean>(false);
  const [speechAvailable, setSpeechAvailable] = useState<boolean | null>(null);
  
  // 引用
  const recognitionRef = useRef<any>(null);
  
  // 检查浏览器是否支持语音识别
  useEffect(() => {
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || 
                                 (window as any).webkitSpeechRecognition;
    if (SpeechRecognitionAPI) {
      setSpeechAvailable(true);
    } else {
      setSpeechAvailable(false);
      setErrorMessage('您的浏览器不支持语音识别功能');
      setStatus('error');
    }
    
    // 如果自动开始，则启动语音识别
    if (autoStart && !offlineMode) {
      setTimeout(() => {
        startListening();
      }, 1000);
    }
    
    return () => {
      stopRecognition();
    };
  }, []);
  
  // 文本相似度计算
  const calculateSimilarity = (a: string, b: string): number => {
    if (!a || !b) return 0;
    
    const aLower = a.toLowerCase().trim();
    const bLower = b.toLowerCase().trim();
    
    if (aLower === bLower) return 100;
    
    // 简单相似度计算 - 可以扩展为更复杂的算法
    const aSplit = aLower.split(/\s+/);
    const bSplit = bLower.split(/\s+/);
    
    let matches = 0;
    for (const word of aSplit) {
      if (bSplit.includes(word)) matches++;
    }
    
    const maxLen = Math.max(aSplit.length, bSplit.length);
    return maxLen === 0 ? 0 : (matches / maxLen) * 100;
  };
  
  // 初始化语音识别
  const initRecognition = () => {
    if (recognitionRef.current) return; // 已初始化
    
    try {
      const SpeechRecognitionAPI = (window as any).SpeechRecognition || 
                                   (window as any).webkitSpeechRecognition;
      if (!SpeechRecognitionAPI) {
        throw new Error('浏览器不支持语音识别');
      }
      
      const recognition = new SpeechRecognitionAPI();
      recognition.continuous = continuousMode;
      recognition.interimResults = true;
      recognition.lang = selectedLanguage;
      
      recognition.onstart = () => {
        setStatus('listening');
        setIsListening(true);
        setErrorMessage('');
      };
      
      recognition.onend = () => {
        if (status !== 'error') {
          setStatus('idle');
        }
        setIsListening(false);
        
        if (interimResult) {
          const result: SpeechRecognitionResult = {
            transcript: interimResult,
            confidence: confidence,
            isFinal: true,
            timestamp: Date.now()
          };
          onRecognitionResult(result);
          onRecognitionComplete(interimResult);
          
          // 如果有正确文本，计算相似度
          if (correctText) {
            const similarityScore = calculateSimilarity(interimResult, correctText);
            setSimilarity(similarityScore);
            onCompareResult(similarityScore);
          }
        }
      };
      
      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';
        let currentConfidence = 0;
        
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
            currentConfidence = event.results[i][0].confidence;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        
        if (finalTranscript) {
          setTranscription(prev => prev + ' ' + finalTranscript.trim());
          setConfidence(currentConfidence);
          
          const result: SpeechRecognitionResult = {
            transcript: finalTranscript,
            confidence: currentConfidence,
            isFinal: true,
            timestamp: Date.now()
          };
          onRecognitionResult(result);
          
          setInterimResult('');
        } else if (interimTranscript) {
          setInterimResult(interimTranscript);
          
          const result: SpeechRecognitionResult = {
            transcript: interimTranscript,
            confidence: 0,
            isFinal: false,
            timestamp: Date.now()
          };
          onRecognitionResult(result);
        }
      };
      
      recognition.onerror = (event: any) => {
        setStatus('error');
        setIsListening(false);
        setErrorMessage(`语音识别错误: ${event.error}`);
        console.error('语音识别错误:', event);
      };
      
      recognitionRef.current = recognition;
    } catch (error) {
      console.error('初始化语音识别失败:', error);
      setStatus('error');
      setErrorMessage('无法初始化语音识别。请确保您的浏览器支持此功能并已授予麦克风权限。');
    }
  };
  
  // 启动语音识别
  const startListening = () => {
    if (offlineMode) {
      setErrorMessage('离线模式下不支持语音识别');
      setStatus('error');
      return;
    }
    
    try {
      initRecognition();
      
      if (recognitionRef.current) {
        // 重置状态
        setInterimResult('');
        setSimilarity(null);
        
        // 更新语言设置
        recognitionRef.current.lang = selectedLanguage;
        recognitionRef.current.continuous = continuousMode;
        
        // 开始识别
        recognitionRef.current.start();
      }
    } catch (error) {
      console.error('启动语音识别失败:', error);
      setStatus('error');
      setErrorMessage('启动语音识别失败。请检查麦克风权限。');
    }
  };
  
  // 停止语音识别
  const stopRecognition = () => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.error('停止语音识别失败:', error);
      }
    }
  };
  
  // 重置识别结果
  const resetRecognition = () => {
    stopRecognition();
    setTranscription('');
    setInterimResult('');
    setConfidence(0);
    setSimilarity(null);
    setStatus('idle');
    setErrorMessage('');
  };
  
  // 朗读正确文本
  const speakCorrectText = () => {
    if (!correctText) return;
    
    const utterance = new SpeechSynthesisUtterance(correctText);
    utterance.lang = selectedLanguage;
    window.speechSynthesis.speak(utterance);
  };
  
  // 获取相似度评估
  const getSimilarityFeedback = () => {
    if (similarity === null) return null;
    
    if (similarity >= 90) {
      return { text: '发音优秀！', color: 'success.main', icon: <CheckIcon />  };
    } else if (similarity >= 70) {
      return { text: '发音良好', color: 'primary.main', icon: <InfoIcon />  };
    } else if (similarity >= 50) {
      return { text: '发音一般', color: 'warning.main', icon: <InfoIcon />  };
    } else {
      return { text: '需要改进发音', color: 'error.main', icon: <ErrorIcon /> };
    }
  };
  
  const similarityFeedback = getSimilarityFeedback();
  
  // 语言选择器
  const renderLanguageSelector = () => {
    return (
      <Box display="flex" gap={1} my={2}>
        <Button 
          variant={selectedLanguage === 'en-US' ? 'contained' : 'outlined'}
          size="small"
          onClick={() => setSelectedLanguage('en-US')}
          disabled={isListening}
        >
          English (US)
        </Button>
        <Button
          variant={selectedLanguage === 'zh-CN' ? 'contained' : 'outlined'}
          size="small"
          onClick={() => setSelectedLanguage('zh-CN')}
          disabled={isListening}
        >
          中文 (简体)
        </Button>
      </Box>
    );
  };
  
  // 设置面板
  const renderSettings = () => {
    return (
      <Collapse in={showSettings}>
        <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            语音识别设置
          </Typography>
          
          <Box mb={2}>
            <Typography variant="body2" gutterBottom>
              识别语言:
            </Typography>
            {renderLanguageSelector()}
          </Box>
          
          <FormControlLabel
            control={
              <Switch 
                checked={continuousMode}
                onChange={(e) => setContinuousMode(e.target.checked)}
                disabled={isListening}
              />
            }
            label="连续识别模式"
          />
          
          <Box mt={2}>
            <Typography variant="caption" color="textSecondary">
              注意：更改这些设置将在下次开始识别时生效
            </Typography>
          </Box>
        </Paper>
      </Collapse>
    );
  };
  
  // 主控制面板
  const renderControls = () => {
    return (
      <Box 
        display="flex" 
        justifyContent="space-between" 
        alignItems="center"
        mb={2}
      >
        <Box display="flex" alignItems="center">
          <IconButton
            color={isListening ? 'error' : 'primary'}
            onClick={isListening ? stopRecognition : startListening}
            disabled={status === 'error' || offlineMode || speechAvailable === false}
          >
            {isListening ? <MicOffIcon /> : <MicNoneIcon />}
          </IconButton>
          
          <Typography variant="body1" sx={{ ml: 1, display: 'flex', alignItems: 'center' }}>
            {status === 'listening' && (
              <>
                <CircularProgress size={16} sx={{ mr: 1 }} />
                正在聆听...
              </>
            )}
            {status === 'idle' && !transcription && '点击麦克风图标开始录音'}
            {status === 'idle' && transcription && '录音已完成'}
            {status === 'error' && '录音出错'}
          </Typography>
        </Box>
        
        <Box>
          {correctText && (
            <Tooltip title="朗读正确文本">
              <IconButton 
                onClick={speakCorrectText}
                disabled={!correctText}
              >
                <VolumeUpIcon />
              </IconButton>
            </Tooltip>
          )}
          
          <Tooltip title={showSettings ? "隐藏设置" : "显示设置"}>
            <IconButton 
              onClick={() => setShowSettings(!showSettings)}
              sx={{ ml: 1 }}
            >
              {showSettings ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
            </IconButton>
          </Tooltip>
          
          <Tooltip title="重置">
            <IconButton 
              onClick={resetRecognition}
              sx={{ ml: 1 }}
              disabled={!transcription && !interimResult}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    );
  };
  
  // 识别结果显示
  const renderResults = () => {
    const hasResults = transcription || interimResult;
    
    if (!hasResults && status !== 'listening') {
      return null;
    }
    
    return (
      <Box mb={3}>
        <Paper 
          variant="outlined" 
          sx={{ 
            p: 2,
            bgcolor: status === 'listening' ? 'rgba(25, 118, 210, 0.04)' : 'transparent',
            minHeight: '100px'
          }}
        >
          {(transcription || interimResult) ? (
            <>
              <Typography variant="body1">
                {transcription} <span style={{ color: '#777' }}>{interimResult}</span>
              </Typography>
              
              {confidence > 0 && (
                <Box mt={1} display="flex" alignItems="center">
                  <Typography variant="caption" color="textSecondary">
                    识别准确度: {Math.round(confidence * 100)}%
                  </Typography>
                </Box>
              )}
            </>
          ) : (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              height="100%"
            >
              <Typography variant="body2" color="textSecondary">
                {status === 'listening' ? '请开始说话...' : '尚无识别结果'}
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>
    );
  };
  
  // 相似度比较结果
  const renderSimilarityResult = () => {
    if (!correctText || similarity === null) return null;
    
    return (
      <Box mb={3}>
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="subtitle2">
              与目标文本相似度:
            </Typography>
            
            <Chip 
              label={`${Math.round(similarity)}%`}
              color={
                similarity >= 90 ? 'success' :
                similarity >= 70 ? 'primary' :
                similarity >= 50 ? 'warning' : 'error'
              }
            />
          </Box>
          
          {similarityFeedback && (
            <Box 
              display="flex" 
              alignItems="center" 
              mt={1}
              color={similarityFeedback.color}
            >
              {similarityFeedback.icon}
              <Typography 
                variant="body2" 
                color={similarityFeedback.color}
                sx={{ ml: 1 }}
              >
                {similarityFeedback.text}
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>
    );
  };
  
  // 错误提示
  const renderError = () => {
    if (status !== 'error' || !errorMessage) return null;
    
    return (
      <Box mb={3}>
        <Alert severity="error" variant="outlined">
          {errorMessage}
        </Alert>
      </Box>
    );
  };
  
  // 目标文本显示
  const renderTargetText = () => {
    if (!correctText) return null;
    
    return (
      <Box mb={3}>
        <Typography variant="subtitle2" gutterBottom>
          目标文本:
        </Typography>
        <Paper variant="outlined" sx={{ p: 2, bgcolor: '#f8f9fa' }}>
          <Typography variant="body1">
            {correctText}
          </Typography>
        </Paper>
      </Box>
    );
  };
  
  return (
    <Box sx={{ ...(isEmbedded ? { p: 0 } : { p: 2 }) }}>
      {!isEmbedded && (
        <Box display="flex" alignItems="center" mb={3}>
          <MicIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6">
            语音练习
          </Typography>
          {offlineMode && (
            <Chip 
              label="离线模式" 
              size="small" 
              color="warning" 
              sx={{ ml: 1 }}
            />
          )}
        </Box>
      )}
      
      {speechAvailable === false && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          您的浏览器不支持语音识别功能。请使用Chrome、Edge或Safari浏览器。
        </Alert>
      )}
      
      {offlineMode && (
        <Alert severity="info" sx={{ mb: 3 }}>
          离线模式下语音识别功能不可用。请连接网络后再试。
        </Alert>
      )}
      
      {renderSettings()}
      {renderError()}
      {renderControls()}
      {renderTargetText()}
      {renderResults()}
      {renderSimilarityResult()}
    </Box>
  );
} 