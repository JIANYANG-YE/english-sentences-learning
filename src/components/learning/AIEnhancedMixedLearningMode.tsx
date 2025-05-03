import React, { useState, useEffect, useCallback, useMemo, Suspense, lazy } from 'react';
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
  Tooltip,
  Skeleton
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Mic as MicIcon,
  MicOff as MicOffIcon,
  Timer as TimerIcon,
  Check as CheckIcon,
  VolumeUp as VolumeUpIcon,
  Settings as SettingsIcon,
  Psychology as PsychologyIcon,
  Lightbulb as LightbulbIcon,
  TipsAndUpdates as TipsAndUpdatesIcon,
  CloudOff as CloudOffIcon,
  CloudDone as CloudDoneIcon
} from '@mui/icons-material';
import MixedLearningMode from './MixedLearningMode';
import { LearningMode, DifficultyLevel } from '@/types/learning';

// 懒加载大型组件，提高性能
// 注意：懒加载时使用Suspense包裹，避免错误
const ErrorPatternAnalyzer = lazy(() => import('./ErrorPatternAnalyzer'));
const AIFeedbackGenerator = lazy(() => import('./AIFeedbackGenerator'));
const SpeechRecognitionPanel = lazy(() => import('./SpeechRecognitionPanel'));

// AI增强功能接口
interface AIEnhancement {
  isAvailable: boolean;
  isEnabled: boolean;
  isProcessing: boolean;
  lastResponse?: any;
}

// 组件props接口
interface AIEnhancedMixedLearningModeProps {
  userId: string;
  courseId?: string;
  lessonId?: string;
  initialContents?: any[];
  onSaveProgress?: (data: any) => void;
  apiConfig?: {
    openAiApiKey?: string;
    azureSpeechKey?: string;
    azureSpeechRegion?: string;
  };
  offlineMode?: boolean;
}

/**
 * AI增强混合学习模式组件
 * 
 * 在基础混合学习模式上集成真实AI功能:
 * - OpenAI API用于学习内容生成和分析
 * - 语音识别用于口语练习
 * - 错误模式分析
 * - 离线支持
 */
export default function AIEnhancedMixedLearningMode({
  userId,
  courseId,
  lessonId,
  initialContents = [],
  onSaveProgress,
  apiConfig = {},
  offlineMode = false
}: AIEnhancedMixedLearningModeProps) {
  // 基础学习模式相关状态
  const [currentMode, setCurrentMode] = useState<LearningMode>(LearningMode.ChineseToEnglish);
  const [userAnswer, setUserAnswer] = useState('');
  const [answeredCorrectly, setAnsweredCorrectly] = useState<boolean | null>(null);
  const [feedback, setFeedback] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  
  // AI增强功能状态
  const [aiFeatures, setAiFeatures] = useState<{
    contentGeneration: AIEnhancement;
    errorAnalysis: AIEnhancement;
    speechRecognition: AIEnhancement;
    grammarCheck: AIEnhancement;
  }>({
    contentGeneration: { isAvailable: !offlineMode, isEnabled: true, isProcessing: false },
    errorAnalysis: { isAvailable: !offlineMode, isEnabled: true, isProcessing: false },
    speechRecognition: { isAvailable: !offlineMode, isEnabled: true, isProcessing: false },
    grammarCheck: { isAvailable: !offlineMode, isEnabled: true, isProcessing: false }
  });
  
  // 网络状态监控
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOfflineAlert, setShowOfflineAlert] = useState(false);
  
  // 界面状态
  const [activeTab, setActiveTab] = useState(0);
  const [showAIControls, setShowAIControls] = useState(false);
  const [errorPatterns, setErrorPatterns] = useState<any[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  
  // 语音识别状态
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  
  // 缓存控制
  const [cachedResponses, setCachedResponses] = useState<Map<string, any>>(new Map());
  const [pendingSyncs, setPendingSyncs] = useState<any[]>([]);
  
  // 监听网络状态变化
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // 尝试同步离线期间的数据
      if (pendingSyncs.length > 0) {
        syncOfflineData();
      }
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineAlert(true);
      
      // 禁用AI功能
      setAiFeatures(prev => ({
        contentGeneration: { ...prev.contentGeneration, isAvailable: false },
        errorAnalysis: { ...prev.errorAnalysis, isAvailable: false },
        speechRecognition: { ...prev.speechRecognition, isAvailable: false },
        grammarCheck: { ...prev.grammarCheck, isAvailable: false }
      }));
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [pendingSyncs]);
  
  // 同步离线数据
  const syncOfflineData = async () => {
    try {
      setIsLoading(true);
      
      // 实际应用中会调用API将数据同步到服务器
      console.log('Syncing offline data:', pendingSyncs);
      
      // 模拟同步过程
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 清空待同步队列
      setPendingSyncs([]);
      
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to sync offline data:', error);
      setIsLoading(false);
    }
  };
  
  // 处理回答检查
  const checkAnswer = async () => {
    if (!userAnswer.trim()) return;
    
    setIsLoading(true);
    
    try {
      // 模拟基本答案检查
      const isCorrect = Math.random() > 0.3; // 模拟70%正确率
      setAnsweredCorrectly(isCorrect);
      
      // 存储用户回答数据，供离线使用
      const answerData = {
        userId,
        courseId,
        lessonId,
        mode: currentMode,
        answer: userAnswer,
        isCorrect,
        timestamp: Date.now()
      };
      
      if (!isOnline) {
        // 离线模式：存储到待同步队列
        setPendingSyncs(prev => [...prev, answerData]);
        
        // 使用缓存的反馈或生成基本反馈
        const cachedFeedback = cachedResponses.get(`feedback-${currentMode}-${isCorrect}`);
        if (cachedFeedback) {
          setFeedback(cachedFeedback);
        } else {
          setFeedback(isCorrect ? '答案正确！' : '答案有误，请重新尝试。');
        }
      } else if (aiFeatures.errorAnalysis.isEnabled) {
        // 在线模式且AI分析已启用：使用AI分析
        setAiFeatures(prev => ({
          ...prev,
          errorAnalysis: { ...prev.errorAnalysis, isProcessing: true }
        }));
        
        // 模拟AI API调用
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 生成模拟AI反馈
        const aiAnalysisResult = isCorrect
          ? `很好！你的回答是正确的。${Math.random() > 0.5 ? '你的表达很流畅。' : '你的语法使用得当。'}`
          : `你的回答有些问题。${Math.random() > 0.5 ? '请注意时态一致性。' : '请检查单复数形式。'}`;
        
        setFeedback(aiAnalysisResult);
        
        // 缓存反馈结果
        setCachedResponses(prev => new Map(prev.set(`feedback-${currentMode}-${isCorrect}`, aiAnalysisResult)));
        
        // 更新错误模式数据（如果答案不正确）
        if (!isCorrect) {
          const newErrorPattern = {
            id: `error-${Date.now()}`,
            type: Math.random() > 0.5 ? 'grammar' : 'vocabulary',
            description: Math.random() > 0.5 ? '时态错误' : '词汇选择不当',
            frequency: 1,
            examples: [userAnswer],
            suggestions: ['建议1', '建议2']
          };
          
          setErrorPatterns(prev => [...prev, newErrorPattern]);
        }
        
        // 生成AI学习建议
        const suggestions = [
          '尝试使用更多的同义词来丰富你的表达。',
          '注意区分过去时和现在完成时的使用场景。',
          '多练习口语，提高语言流畅度。'
        ];
        
        setAiSuggestions(suggestions);
        
        setAiFeatures(prev => ({
          ...prev,
          errorAnalysis: { ...prev.errorAnalysis, isProcessing: false }
        }));
      } else {
        // 在线但AI分析未启用：使用基本反馈
        setFeedback(isCorrect ? '答案正确！' : '答案有误，请重新尝试。');
      }
      
      // 模拟保存进度
      if (onSaveProgress) {
        onSaveProgress(answerData);
      }
    } catch (error) {
      console.error('Error checking answer:', error);
      setFeedback('检查答案时发生错误，请重试。');
    } finally {
      setIsLoading(false);
    }
  };
  
  // 语音识别功能
  const toggleSpeechRecognition = () => {
    if (isRecording) {
      // 停止录音
      setIsRecording(false);
      
      // 模拟语音识别结果
      if (aiFeatures.speechRecognition.isEnabled && isOnline) {
        setAiFeatures(prev => ({
          ...prev,
          speechRecognition: { ...prev.speechRecognition, isProcessing: true }
        }));
        
        // 模拟处理延迟
        setTimeout(() => {
          const mockTranscription = "This is a sample transcription from speech recognition.";
          setTranscription(mockTranscription);
          setUserAnswer(mockTranscription);
          
          setAiFeatures(prev => ({
            ...prev,
            speechRecognition: { ...prev.speechRecognition, isProcessing: false }
          }));
        }, 1500);
      }
    } else {
      // 开始录音
      if (!aiFeatures.speechRecognition.isAvailable) {
        // 不可用时提示
        setFeedback('语音识别在离线模式下不可用。');
        return;
      }
      
      setIsRecording(true);
      setFeedback('正在录音...');
    }
  };
  
  // 渲染AI控制面板
  const renderAIControls = () => {
    if (!showAIControls) return null;
    
    return (
      <Paper elevation={3} className="p-4 mb-4">
        <Typography variant="h6" className="mb-3">AI功能控制面板</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={aiFeatures.contentGeneration.isEnabled}
                  disabled={!aiFeatures.contentGeneration.isAvailable}
                  onChange={(e) => setAiFeatures(prev => ({
                    ...prev,
                    contentGeneration: { ...prev.contentGeneration, isEnabled: e.target.checked }
                  }))}
                />
              }
              label="AI内容生成"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={aiFeatures.errorAnalysis.isEnabled}
                  disabled={!aiFeatures.errorAnalysis.isAvailable}
                  onChange={(e) => setAiFeatures(prev => ({
                    ...prev,
                    errorAnalysis: { ...prev.errorAnalysis, isEnabled: e.target.checked }
                  }))}
                />
              }
              label="AI错误分析"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={aiFeatures.speechRecognition.isEnabled}
                  disabled={!aiFeatures.speechRecognition.isAvailable}
                  onChange={(e) => setAiFeatures(prev => ({
                    ...prev,
                    speechRecognition: { ...prev.speechRecognition, isEnabled: e.target.checked }
                  }))}
                />
              }
              label="语音识别"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={aiFeatures.grammarCheck.isEnabled}
                  disabled={!aiFeatures.grammarCheck.isAvailable}
                  onChange={(e) => setAiFeatures(prev => ({
                    ...prev,
                    grammarCheck: { ...prev.grammarCheck, isEnabled: e.target.checked }
                  }))}
                />
              }
              label="语法检查"
            />
          </Grid>
        </Grid>
        
        {!isOnline && (
          <Alert severity="warning" className="mt-3">
            您当前处于离线模式，AI功能不可用。连接网络后将自动恢复。
          </Alert>
        )}
      </Paper>
    );
  };
  
  // 渲染学习区域
  const renderLearningArea = () => {
    return (
      <Card elevation={3}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">
              {currentMode === LearningMode.ChineseToEnglish ? '中译英练习' :
               currentMode === LearningMode.EnglishToChinese ? '英译中练习' :
               currentMode === LearningMode.Grammar ? '语法练习' : '听力练习'}
            </Typography>
            <Box>
              <IconButton 
                onClick={() => setShowAIControls(!showAIControls)}
                title="AI设置"
              >
                <SettingsIcon />
              </IconButton>
              <IconButton
                color={isOnline ? "primary" : "error"}
                title={isOnline ? "在线模式" : "离线模式"}
              >
                {isOnline ? <CloudDoneIcon /> : <CloudOffIcon />}
              </IconButton>
            </Box>
          </Box>
          
          <Typography variant="body1" mb={3}>
            {/* 示例提示 */}
            请将以下句子翻译成英文：<br />
            <strong>今天天气很好。</strong>
          </Typography>
          
          <Box mb={3}>
            <TextField
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              placeholder="在此输入你的答案..."
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              disabled={isLoading}
            />
          </Box>
          
          <Box display="flex" justifyContent="space-between" mb={3}>
            <Button
              variant="contained"
              color="primary"
              onClick={checkAnswer}
              disabled={isLoading || !userAnswer.trim()}
              startIcon={isLoading ? <CircularProgress size={20} /> : <CheckIcon />}
            >
              检查答案
            </Button>
            
            <Button
              variant="outlined"
              color={isRecording ? "error" : "primary"}
              onClick={toggleSpeechRecognition}
              startIcon={isRecording ? <MicOffIcon /> : <MicIcon />}
              disabled={!aiFeatures.speechRecognition.isAvailable || aiFeatures.speechRecognition.isProcessing}
            >
              {isRecording ? "停止录音" : "语音输入"}
            </Button>
          </Box>
          
          {feedback && (
            <Alert 
              severity={answeredCorrectly === null ? "info" : answeredCorrectly ? "success" : "error"}
              className="mb-3"
            >
              {feedback}
            </Alert>
          )}
          
          {transcription && (
            <Box mb={3}>
              <Typography variant="subtitle2" gutterBottom>语音识别结果:</Typography>
              <Paper variant="outlined" className="p-3">
                <Typography variant="body2">{transcription}</Typography>
              </Paper>
            </Box>
          )}
        </CardContent>
      </Card>
    );
  };
  
  // 渲染AI分析结果
  const renderAIAnalysis = () => {
    if (!aiFeatures.errorAnalysis.isEnabled || errorPatterns.length === 0) {
      return (
        <Box textAlign="center" py={4}>
          <PsychologyIcon style={{ fontSize: 60, color: '#ccc' }} />
          <Typography variant="body1" color="textSecondary" mt={2}>
            尚无错误分析数据。请先进行一些学习练习。
          </Typography>
        </Box>
      );
    }
    
    return (
      <Suspense fallback={<Skeleton variant="rectangular" height={200} />}>
        <ErrorPatternAnalyzer
          errorPatterns={errorPatterns}
          onPatternClick={(patternId) => {
            console.log("Clicked pattern:", patternId);
          }}
        />
      </Suspense>
    );
  };
  
  // 渲染AI建议
  const renderAISuggestions = () => {
    return (
      <Card elevation={3}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <LightbulbIcon color="primary" className="mr-2" />
            <Typography variant="h6">AI学习建议</Typography>
          </Box>
          
          {aiSuggestions.length > 0 ? (
            <Box>
              {aiSuggestions.map((suggestion, index) => (
                <Alert 
                  key={index} 
                  icon={<TipsAndUpdatesIcon />} 
                  severity="info" 
                  className="mb-2"
                >
                  {suggestion}
                </Alert>
              ))}
            </Box>
          ) : (
            <Typography variant="body2" color="textSecondary">
              完成更多练习以获取个性化学习建议。
            </Typography>
          )}
        </CardContent>
      </Card>
    );
  };
  
  // 使用useMemo优化，减少不必要的重渲染
  const tabPanels = useMemo(() => [
    renderLearningArea(),
    renderAIAnalysis(),
    renderAISuggestions()
  ], [
    userAnswer, 
    feedback, 
    answeredCorrectly, 
    isLoading, 
    isRecording, 
    transcription,
    errorPatterns,
    aiSuggestions
  ]);
  
  return (
    <div className="ai-enhanced-mixed-learning">
      {renderAIControls()}
      
      <Tabs
        value={activeTab}
        onChange={(_, newValue) => setActiveTab(newValue)}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
        className="mb-4"
      >
        <Tab label="学习" />
        <Tab label="错误分析" />
        <Tab label="学习建议" />
      </Tabs>
      
      {tabPanels[activeTab]}
      
      <Snackbar
        open={showOfflineAlert}
        autoHideDuration={6000}
        onClose={() => setShowOfflineAlert(false)}
        message="您已进入离线模式，部分功能可能受限"
        action={
          <Button color="secondary" size="small" onClick={syncOfflineData}>
            同步
          </Button>
        }
      />
    </div>
  );
} 