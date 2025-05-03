import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  IconButton,
  Tooltip,
  CircularProgress,
  Tabs,
  Tab,
  Card,
  CardContent,
  Divider,
  Chip,
  Rating
} from '@mui/material';
import {
  Check as CheckIcon,
  Close as CloseIcon,
  ContentCopy as CopyIcon,
  Grading as GradingIcon,
  Spellcheck as SpellcheckIcon,
  TextFormat as TextFormatIcon,
  Psychology as PsychologyIcon,
  Autorenew as AutorenewIcon,
  HighlightOff as HighlightOffIcon,
  HelpOutline as HelpOutlineIcon,
  Download as DownloadIcon
} from '@mui/icons-material';

// 定义错误类型
interface GrammarError {
  id: string;
  startIndex: number;
  endIndex: number;
  originalText: string;
  suggestedText: string;
  type: 'grammar' | 'spelling' | 'punctuation' | 'style' | 'vocabulary';
  explanation: string;
  severity: 'low' | 'medium' | 'high';
}

// 定义文本统计信息
interface TextStats {
  wordCount: number;
  sentenceCount: number;
  averageWordLength: number;
  readabilityScore: number; // 0-100
  complexSentences: number;
  vocabularyLevel: 'basic' | 'intermediate' | 'advanced';
}

// 定义组件属性
interface GrammarCheckerProps {
  initialText?: string;
  onCheck?: (errors: GrammarError[], stats: TextStats) => void;
  onCorrectedTextChange?: (text: string) => void;
}

// 主组件
const GrammarChecker: React.FC<GrammarCheckerProps> = ({
  initialText = '',
  onCheck,
  onCorrectedTextChange
}) => {
  // 状态管理
  const [inputText, setInputText] = useState(initialText);
  const [correctedText, setCorrectedText] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [errors, setErrors] = useState<GrammarError[]>([]);
  const [stats, setStats] = useState<TextStats | null>(null);
  const [highlightError, setHighlightError] = useState<string | null>(null);

  // 处理文本变化
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    // 重置之前的检查结果
    if (errors.length > 0) {
      setErrors([]);
      setStats(null);
      setCorrectedText('');
    }
  };

  // 处理检查按钮点击
  const handleCheckGrammar = () => {
    if (!inputText.trim()) return;
    
    setIsChecking(true);
    
    // 模拟API检查过程
    setTimeout(() => {
      const simulatedErrors = simulateGrammarCheck(inputText);
      const simulatedStats = calculateTextStats(inputText);
      
      setErrors(simulatedErrors);
      setStats(simulatedStats);
      
      // 生成修正后的文本
      let textWithCorrections = inputText;
      // 从后向前应用修正，以避免索引变化问题
      simulatedErrors
        .slice()
        .sort((a, b) => b.startIndex - a.startIndex)
        .forEach(error => {
          textWithCorrections = 
            textWithCorrections.substring(0, error.startIndex) +
            error.suggestedText +
            textWithCorrections.substring(error.endIndex);
        });
      
      setCorrectedText(textWithCorrections);
      if (onCorrectedTextChange) {
        onCorrectedTextChange(textWithCorrections);
      }
      
      if (onCheck) {
        onCheck(simulatedErrors, simulatedStats);
      }
      
      setIsChecking(false);
    }, 1500);
  };

  // 处理标签页变化
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // 复制修正后的文本
  const handleCopyText = () => {
    navigator.clipboard.writeText(correctedText || inputText);
  };

  // 重置所有内容
  const handleReset = () => {
    setInputText('');
    setCorrectedText('');
    setErrors([]);
    setStats(null);
  };

  // 获取错误类型显示信息
  const getErrorTypeInfo = (type: string) => {
    switch (type) {
      case 'grammar':
        return { label: '语法错误', color: 'error' as const };
      case 'spelling':
        return { label: '拼写错误', color: 'warning' as const };
      case 'punctuation':
        return { label: '标点错误', color: 'info' as const };
      case 'style':
        return { label: '表达风格', color: 'success' as const };
      case 'vocabulary':
        return { label: '用词建议', color: 'secondary' as const };
      default:
        return { label: '其他问题', color: 'default' as const };
    }
  };

  // 获取错误严重程度图标和颜色
  const getSeverityInfo = (severity: string) => {
    switch (severity) {
      case 'high':
        return { icon: '●', color: 'error.main' };
      case 'medium':
        return { icon: '●', color: 'warning.main' };
      case 'low':
        return { icon: '●', color: 'success.main' };
      default:
        return { icon: '●', color: 'text.secondary' };
    }
  };

  // 模拟语法检查功能
  const simulateGrammarCheck = (text: string): GrammarError[] => {
    const simulatedErrors: GrammarError[] = [];
    
    // 简单的模拟错误检测规则
    // 1. "i" 应该是 "I"
    const iPattern = /\bi\b/g;
    let match;
    while ((match = iPattern.exec(text)) !== null) {
      simulatedErrors.push({
        id: `err-${simulatedErrors.length + 1}`,
        startIndex: match.index,
        endIndex: match.index + 1,
        originalText: 'i',
        suggestedText: 'I',
        type: 'grammar',
        explanation: '在英语中，代表第一人称的"I"始终应该大写。',
        severity: 'medium'
      });
    }
    
    // 2. 检查常见拼写错误
    const spellingErrors = [
      { wrong: 'recieve', correct: 'receive', explanation: '"i" 和 "e" 的顺序应遵循"在 c 之后，e 在 i 之前"的规则。' },
      { wrong: 'definately', correct: 'definitely', explanation: '正确拼写为"definitely"，常见拼写错误。' },
      { wrong: 'seperate', correct: 'separate', explanation: '正确拼写为"separate"，注意第二个元音是"a"而不是"e"。' },
      { wrong: 'occured', correct: 'occurred', explanation: '当添加后缀时，应该双写最后一个辅音字母。' }
    ];
    
    spellingErrors.forEach(({ wrong, correct, explanation }) => {
      const wrongPattern = new RegExp(`\\b${wrong}\\b`, 'gi');
      while ((match = wrongPattern.exec(text)) !== null) {
        simulatedErrors.push({
          id: `err-${simulatedErrors.length + 1}`,
          startIndex: match.index,
          endIndex: match.index + wrong.length,
          originalText: match[0],
          suggestedText: correct,
          type: 'spelling',
          explanation,
          severity: 'medium'
        });
      }
    });
    
    // 3. 检查一些语法错误
    // "a" 后面接元音音素开头的单词应该用 "an"
    const aVowelPattern = /\ba\s+([aeiou]\w+)/gi;
    while ((match = aVowelPattern.exec(text)) !== null) {
      simulatedErrors.push({
        id: `err-${simulatedErrors.length + 1}`,
        startIndex: match.index,
        endIndex: match.index + 1,
        originalText: 'a',
        suggestedText: 'an',
        type: 'grammar',
        explanation: '当后面的单词以元音音素开头时，应使用"an"而不是"a"。',
        severity: 'high'
      });
    }
    
    // 4. 检查标点符号错误
    // 句号后面应该有空格
    const periodNoSpacePattern = /\.(\w)/g;
    while ((match = periodNoSpacePattern.exec(text)) !== null) {
      simulatedErrors.push({
        id: `err-${simulatedErrors.length + 1}`,
        startIndex: match.index + 1,
        endIndex: match.index + 2,
        originalText: match[1],
        suggestedText: ` ${match[1]}`,
        type: 'punctuation',
        explanation: '句号后应该有一个空格。',
        severity: 'low'
      });
    }
    
    // 5. 检查风格问题
    // 连续使用"very"的情况
    const veryPattern = /\bvery\s+very\b/gi;
    while ((match = veryPattern.exec(text)) !== null) {
      simulatedErrors.push({
        id: `err-${simulatedErrors.length + 1}`,
        startIndex: match.index,
        endIndex: match.index + match[0].length,
        originalText: match[0],
        suggestedText: 'extremely',
        type: 'style',
        explanation: '避免重复使用"very"，可以用更强烈的副词替代。',
        severity: 'low'
      });
    }
    
    // 6. 检查用词建议
    // "good" 可以用更具体的词替换
    const goodPattern = /\bgood\b/gi;
    while ((match = goodPattern.exec(text)) !== null) {
      simulatedErrors.push({
        id: `err-${simulatedErrors.length + 1}`,
        startIndex: match.index,
        endIndex: match.index + 4,
        originalText: match[0],
        suggestedText: match[0],  // 保持原样，但提供建议
        type: 'vocabulary',
        explanation: '考虑使用更具体、更丰富的形容词，如"excellent"、"beneficial"、"pleasant"等。',
        severity: 'low'
      });
    }
    
    return simulatedErrors;
  };

  // 计算文本统计信息
  const calculateTextStats = (text: string): TextStats => {
    // 简单的文本分析
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    const sentences = text.trim().split(/[.!?]+/).filter(sentence => sentence.length > 0);
    
    const wordCount = words.length;
    const sentenceCount = sentences.length;
    
    // 计算平均单词长度
    const totalWordLength = words.reduce((total, word) => total + word.length, 0);
    const averageWordLength = wordCount > 0 ? totalWordLength / wordCount : 0;
    
    // 简单估算复杂句子数量（包含逗号或分号的句子）
    const complexSentences = sentences.filter(sentence => 
      sentence.includes(',') || sentence.includes(';')
    ).length;
    
    // 简单估算词汇水平
    const longWords = words.filter(word => word.length > 6).length;
    const longWordsRatio = wordCount > 0 ? longWords / wordCount : 0;
    
    let vocabularyLevel: 'basic' | 'intermediate' | 'advanced' = 'basic';
    if (longWordsRatio > 0.2) {
      vocabularyLevel = 'advanced';
    } else if (longWordsRatio > 0.1) {
      vocabularyLevel = 'intermediate';
    }
    
    // 简单估算可读性分数 (0-100)
    // 基于平均句子长度和平均单词长度
    const avgWordsPerSentence = sentenceCount > 0 ? wordCount / sentenceCount : 0;
    const readabilityBase = 100 - (avgWordsPerSentence * 2) - (averageWordLength * 5);
    const readabilityScore = Math.max(0, Math.min(100, readabilityBase));
    
    return {
      wordCount,
      sentenceCount,
      averageWordLength,
      readabilityScore,
      complexSentences,
      vocabularyLevel
    };
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* 标题和工具栏 */}
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
          <SpellcheckIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6">
            语法检查与文本优化
          </Typography>
        </Box>
        
        <Box>
          <Tooltip title="复制文本">
            <IconButton onClick={handleCopyText} disabled={!correctedText && !inputText}>
              <CopyIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="重置">
            <IconButton onClick={handleReset} disabled={!inputText}>
              <HighlightOffIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* 主要内容区域 */}
      <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
        {/* 输入和结果区域 */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            textColor="primary"
            indicatorColor="primary"
            variant="fullWidth"
          >
            <Tab label="原文" />
            <Tab 
              label={`修正后 ${errors.length > 0 ? `(${errors.length}项)` : ''}`} 
              disabled={!correctedText}
            />
          </Tabs>

          <Box sx={{ flexGrow: 1, p: 2, overflowY: 'auto' }}>
            {activeTab === 0 ? (
              <TextField
                multiline
                fullWidth
                minRows={12}
                maxRows={20}
                variant="outlined"
                placeholder="在此输入英文文本进行语法检查..."
                value={inputText}
                onChange={handleTextChange}
                disabled={isChecking}
              />
            ) : (
              <Paper
                variant="outlined"
                sx={{ p: 2, whiteSpace: 'pre-wrap', minHeight: 300 }}
              >
                {correctedText}
              </Paper>
            )}

            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCheckGrammar}
                disabled={!inputText.trim() || isChecking}
                startIcon={isChecking ? <CircularProgress size={20} /> : <GradingIcon />}
              >
                {isChecking ? '检查中...' : '检查语法与用词'}
              </Button>
              
              {stats && (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip 
                    label={`${stats.wordCount} 词`} 
                    size="small" 
                    variant="outlined" 
                  />
                  <Chip 
                    label={`${stats.sentenceCount} 句`} 
                    size="small" 
                    variant="outlined" 
                  />
                </Box>
              )}
            </Box>
          </Box>
        </Box>

        {/* 错误和统计信息侧边栏 */}
        <Box
          sx={{
            width: 320,
            borderLeft: 1,
            borderColor: 'divider',
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            height: '100%',
            bgcolor: 'background.default'
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
              分析结果
            </Typography>
          </Box>

          <Box
            sx={{
              flexGrow: 1,
              overflowY: 'auto',
              p: 0
            }}
          >
            {isChecking ? (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  p: 3
                }}
              >
                <CircularProgress size={40} sx={{ mb: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  正在分析文本...
                </Typography>
              </Box>
            ) : errors.length > 0 ? (
              <Box>
                {/* 错误列表 */}
                <Box sx={{ p: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    检测到的问题 ({errors.length})
                  </Typography>
                  
                  {errors.map(error => {
                    const typeInfo = getErrorTypeInfo(error.type);
                    const severityInfo = getSeverityInfo(error.severity);
                    
                    return (
                      <Card 
                        key={error.id} 
                        variant="outlined"
                        sx={{ 
                          mb: 1.5,
                          borderColor: highlightError === error.id ? 'primary.main' : 'divider',
                          boxShadow: highlightError === error.id ? 1 : 0
                        }}
                        onMouseEnter={() => setHighlightError(error.id)}
                        onMouseLeave={() => setHighlightError(null)}
                      >
                        <CardContent sx={{ p: '12px !important' }}>
                          <Box display="flex" alignItems="center" mb={1}>
                            <Typography 
                              component="span" 
                              sx={{ 
                                color: severityInfo.color,
                                fontSize: 16,
                                mr: 1,
                                lineHeight: 1
                              }}
                            >
                              {severityInfo.icon}
                            </Typography>
                            <Chip
                              label={typeInfo.label}
                              size="small"
                              color={typeInfo.color}
                              sx={{ mr: 1 }}
                            />
                            <Typography 
                              variant="body2" 
                              component="div" 
                              sx={{ 
                                ml: 'auto', 
                                fontSize: '0.75rem', 
                                color: 'text.secondary'
                              }}
                            >
                              {error.startIndex}-{error.endIndex}
                            </Typography>
                          </Box>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                            <Typography variant="body2" color="error" component="span" sx={{ mr: 1 }}>
                              {error.originalText}
                            </Typography>
                            <CloseIcon sx={{ fontSize: 16, color: 'text.secondary', mx: 0.5 }} />
                            <Typography variant="body2" color="success.main" component="span" sx={{ mr: 1 }}>
                              {error.suggestedText}
                            </Typography>
                          </Box>
                          
                          <Typography variant="caption" color="text.secondary">
                            {error.explanation}
                          </Typography>
                        </CardContent>
                      </Card>
                    );
                  })}
                </Box>
                
                <Divider />
                
                {/* 文本统计信息 */}
                {stats && (
                  <Box sx={{ p: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      文本分析
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                        <Typography variant="body2">可读性评分</Typography>
                        <Chip 
                          label={`${Math.round(stats.readabilityScore)}/100`}
                          size="small"
                          color={
                            stats.readabilityScore > 80 ? 'success' :
                            stats.readabilityScore > 60 ? 'primary' :
                            stats.readabilityScore > 40 ? 'warning' : 'error'
                          }
                        />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2">词汇水平</Typography>
                        <Typography variant="body2" color="primary">
                          {stats.vocabularyLevel === 'basic' ? '基础' : 
                          stats.vocabularyLevel === 'intermediate' ? '中级' : '高级'}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2">复杂句比例</Typography>
                        <Typography variant="body2">
                          {stats.sentenceCount > 0 
                            ? `${Math.round((stats.complexSentences / stats.sentenceCount) * 100)}%` 
                            : '0%'}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">平均单词长度</Typography>
                        <Typography variant="body2">
                          {stats.averageWordLength.toFixed(1)} 字符
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Button
                      variant="outlined"
                      size="small"
                      fullWidth
                      startIcon={<DownloadIcon />}
                      sx={{ mt: 1 }}
                    >
                      导出分析报告
                    </Button>
                  </Box>
                )}
              </Box>
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  p: 3
                }}
              >
                <PsychologyIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
                <Typography variant="body2" color="text.secondary" align="center">
                  在左侧输入英文文本，点击"检查语法与用词"按钮开始分析
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<HelpOutlineIcon />}
                  sx={{ mt: 2 }}
                >
                  查看使用指南
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default GrammarChecker; 