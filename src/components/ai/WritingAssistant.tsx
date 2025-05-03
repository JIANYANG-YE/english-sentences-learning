import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Chip,
  IconButton,
  Card,
  CardContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Tab,
  Tabs,
  CircularProgress,
  Grid,
  Tooltip,
  Snackbar,
  Alert
} from '@mui/material';
import {
  ContentCopy as ContentCopyIcon,
  FormatBold as FormatBoldIcon,
  FormatItalic as FormatItalicIcon,
  FormatUnderlined as FormatUnderlinedIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon,
  Check as CheckIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Lightbulb as LightbulbIcon,
  LocalOffer as LocalOfferIcon,
  School as SchoolIcon,
  Business as BusinessIcon,
  ChatBubble as ChatBubbleIcon,
  Create as CreateIcon,
  Spellcheck as SpellcheckIcon
} from '@mui/icons-material';

// 接口定义
interface WritingSuggestion {
  id: string;
  originalText: string;
  suggestedText: string;
  type: 'grammar' | 'vocabulary' | 'style' | 'clarity' | 'structure';
  explanation: string;
  startPosition: number;
  endPosition: number;
}

interface WritingStyle {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

interface WritingAssistantProps {
  initialText?: string;
  onSave?: (text: string, title: string) => void;
  readOnly?: boolean;
}

// 主组件
const WritingAssistant: React.FC<WritingAssistantProps> = ({
  initialText = '',
  onSave,
  readOnly = false
}) => {
  // 状态管理
  const [text, setText] = useState(initialText || '');
  const [title, setTitle] = useState('未命名文档');
  const [suggestions, setSuggestions] = useState<WritingSuggestion[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedStyle, setSelectedStyle] = useState('general');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [writingScore, setWritingScore] = useState<{
    overall: number;
    grammar: number;
    vocabulary: number;
    style: number;
    structure: number;
  } | null>(null);
  const [appliedSuggestions, setAppliedSuggestions] = useState<string[]>([]);
  const [savedSnackbarOpen, setSavedSnackbarOpen] = useState(false);
  const [autoAnalyzeTimeout, setAutoAnalyzeTimeout] = useState<NodeJS.Timeout | null>(null);
  
  const textFieldRef = useRef<HTMLTextAreaElement>(null);
  
  // 写作风格选项
  const writingStyles: WritingStyle[] = [
    {
      id: 'general',
      name: '通用',
      description: '适合日常交流和一般用途的写作',
      icon: <ChatBubbleIcon />
    },
    {
      id: 'academic',
      name: '学术',
      description: '正式的学术写作风格，适合论文和研究报告',
      icon: <SchoolIcon />
    },
    {
      id: 'business',
      name: '商务',
      description: '专业的商务写作，适合邮件、报告和提案',
      icon: <BusinessIcon />
    },
    {
      id: 'creative',
      name: '创意',
      description: '富有表现力的创意写作，适合故事和描述性内容',
      icon: <CreateIcon />
    }
  ];
  
  // 自动分析
  useEffect(() => {
    if (autoAnalyzeTimeout) {
      clearTimeout(autoAnalyzeTimeout);
    }
    
    if (text.length > 50) {
      const timeout = setTimeout(() => {
        if (!isAnalyzing) {
          analyzeText();
        }
      }, 2000);
      
      setAutoAnalyzeTimeout(timeout);
    }
    
    return () => {
      if (autoAnalyzeTimeout) {
        clearTimeout(autoAnalyzeTimeout);
      }
    };
  }, [text]);
  
  // 分析文本
  const analyzeText = () => {
    if (!text.trim() || text.length < 20) return;
    
    setIsAnalyzing(true);
    
    // 模拟API分析延迟
    setTimeout(() => {
      const simulatedSuggestions = generateSimulatedSuggestions(text, selectedStyle);
      setSuggestions(simulatedSuggestions);
      
      const simulatedScore = generateSimulatedScore(text, selectedStyle);
      setWritingScore(simulatedScore);
      
      setIsAnalyzing(false);
    }, 1500);
  };
  
  // 应用建议
  const applySuggestion = (suggestion: WritingSuggestion) => {
    if (textFieldRef.current) {
      const newText = 
        text.substring(0, suggestion.startPosition) +
        suggestion.suggestedText +
        text.substring(suggestion.endPosition);
      
      setText(newText);
      setAppliedSuggestions([...appliedSuggestions, suggestion.id]);
    }
  };
  
  // 生成模拟建议
  const generateSimulatedSuggestions = (content: string, style: string): WritingSuggestion[] => {
    const suggestions: WritingSuggestion[] = [];
    const sentences = content.match(/[^.!?]+[.!?]+/g) || [];
    
    // 简单的语法模式检测
    const grammarPatterns = [
      { 
        regex: /\bi am\b/gi, 
        replacement: 'I am', 
        type: 'grammar' as const,
        explanation: '代词"I"始终应该大写。'
      },
      { 
        regex: /\bi have\b/gi, 
        replacement: 'I have', 
        type: 'grammar' as const,
        explanation: '代词"I"始终应该大写。'
      },
      { 
        regex: /\bthey is\b/gi, 
        replacement: 'they are', 
        type: 'grammar' as const,
        explanation: '复数主语"they"应该使用复数动词形式"are"。'
      },
      { 
        regex: /\bhe have\b/gi, 
        replacement: 'he has', 
        type: 'grammar' as const,
        explanation: '第三人称单数主语"he"应该使用"has"。'
      }
    ];
    
    // 风格建议模式
    const stylePatterns: {[key: string]: Array<{regex: RegExp, replacement: string, explanation: string}>} = {
      'academic': [
        {
          regex: /\bkind of\b/gi,
          replacement: 'somewhat',
          explanation: '在学术写作中，"kind of"太口语化，建议使用更正式的表达如"somewhat"或"relatively"。'
        },
        {
          regex: /\blots of\b/gi,
          replacement: 'numerous',
          explanation: '在学术写作中，"lots of"太口语化，建议使用"numerous"、"many"或"a significant number of"。'
        }
      ],
      'business': [
        {
          regex: /\bget back to\b/gi,
          replacement: 'respond to',
          explanation: '在商务写作中，"get back to"过于口语化，建议使用更专业的"respond to"或"follow up with"。'
        },
        {
          regex: /\bASAP\b/gi,
          replacement: 'as soon as possible',
          explanation: '在正式商务写作中，应避免使用缩写如"ASAP"，建议使用完整表达"as soon as possible"。'
        }
      ]
    };
    
    // 应用语法检查
    grammarPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.regex.exec(content)) !== null) {
        suggestions.push({
          id: `grammar-${suggestions.length}`,
          originalText: match[0],
          suggestedText: pattern.replacement,
          type: pattern.type,
          explanation: pattern.explanation,
          startPosition: match.index,
          endPosition: match.index + match[0].length
        });
      }
    });
    
    // 应用风格建议
    if (stylePatterns[style]) {
      stylePatterns[style].forEach(pattern => {
        let match;
        while ((match = pattern.regex.exec(content)) !== null) {
          suggestions.push({
            id: `style-${suggestions.length}`,
            originalText: match[0],
            suggestedText: pattern.replacement,
            type: 'style',
            explanation: pattern.explanation,
            startPosition: match.index,
            endPosition: match.index + match[0].length
          });
        }
      });
    }
    
    // 词汇提升建议
    const vocabularyEnhancements = [
      { word: 'good', suggestion: 'excellent', context: /\bgood\b/gi, type: 'vocabulary' as const },
      { word: 'bad', suggestion: 'poor', context: /\bbad\b/gi, type: 'vocabulary' as const },
      { word: 'big', suggestion: 'substantial', context: /\bbig\b/gi, type: 'vocabulary' as const },
      { word: 'small', suggestion: 'minimal', context: /\bsmall\b/gi, type: 'vocabulary' as const },
      { word: 'a lot', suggestion: 'significantly', context: /\ba lot\b/gi, type: 'vocabulary' as const }
    ];
    
    vocabularyEnhancements.forEach(item => {
      let match;
      while ((match = item.context.exec(content)) !== null) {
        suggestions.push({
          id: `vocab-${suggestions.length}`,
          originalText: match[0],
          suggestedText: item.suggestion,
          type: item.type,
          explanation: `考虑使用更精确或更丰富的词汇。"${item.word}" 可以用 "${item.suggestion}" 替换，使表达更生动。`,
          startPosition: match.index,
          endPosition: match.index + match[0].length
        });
      }
    });
    
    // 结构建议 (针对段落过长的情况)
    const paragraphs = content.split(/\n\s*\n/);
    paragraphs.forEach((paragraph, index) => {
      if (paragraph.length > 500) {
        const startPosition = content.indexOf(paragraph);
        suggestions.push({
          id: `structure-${index}`,
          originalText: paragraph.substring(0, 50) + '...',
          suggestedText: paragraph.substring(0, 50) + '...',
          type: 'structure',
          explanation: '这个段落过长，考虑将其分成多个较短的段落以提高可读性。理想的段落长度通常为3-5个句子。',
          startPosition,
          endPosition: startPosition + paragraph.length
        });
      }
    });
    
    return suggestions.slice(0, 10); // 限制建议数量
  };
  
  // 生成模拟分数
  const generateSimulatedScore = (content: string, style: string) => {
    if (!content || content.length < 20) return null;
    
    const baseScore = 70; // 基础分数
    let grammarScore = baseScore;
    let vocabularyScore = baseScore;
    let styleScore = baseScore;
    let structureScore = baseScore;
    
    // 语法评分
    const grammarErrors = [
      /\bi am\b/gi, 
      /\bi have\b/gi, 
      /\bthey is\b/gi, 
      /\bhe have\b/gi,
      /\bshe have\b/gi
    ];
    
    let grammarErrorCount = 0;
    grammarErrors.forEach(regex => {
      const matches = content.match(regex);
      if (matches) {
        grammarErrorCount += matches.length;
      }
    });
    
    grammarScore -= grammarErrorCount * 5;
    
    // 词汇多样性评分
    const words = content.toLowerCase().match(/\b[a-z]+\b/g) || [];
    const uniqueWords = new Set(words);
    const wordVarietyRatio = uniqueWords.size / words.length;
    
    vocabularyScore += (wordVarietyRatio > 0.7) ? 15 : (wordVarietyRatio > 0.5) ? 5 : 0;
    
    // 样式评分基于选择的风格
    if (style === 'academic') {
      const informalPatterns = [/\bkind of\b/gi, /\blots of\b/gi, /\bstuff\b/gi, /\bthings\b/gi];
      let informalCount = 0;
      
      informalPatterns.forEach(regex => {
        const matches = content.match(regex);
        if (matches) {
          informalCount += matches.length;
        }
      });
      
      styleScore -= informalCount * 5;
    } else if (style === 'business') {
      const informalPatterns = [/\bget back to\b/gi, /\bASAP\b/gi, /\bfyi\b/gi];
      let informalCount = 0;
      
      informalPatterns.forEach(regex => {
        const matches = content.match(regex);
        if (matches) {
          informalCount += matches.length;
        }
      });
      
      styleScore -= informalCount * 5;
    }
    
    // 结构评分
    const paragraphs = content.split(/\n\s*\n/);
    const longParagraphsCount = paragraphs.filter(p => p.length > 500).length;
    structureScore -= longParagraphsCount * 8;
    
    // 确保分数在0-100范围内
    grammarScore = Math.max(0, Math.min(100, grammarScore));
    vocabularyScore = Math.max(0, Math.min(100, vocabularyScore));
    styleScore = Math.max(0, Math.min(100, styleScore));
    structureScore = Math.max(0, Math.min(100, structureScore));
    
    // 计算总体分数
    const overallScore = Math.round((grammarScore + vocabularyScore + styleScore + structureScore) / 4);
    
    return {
      overall: overallScore,
      grammar: grammarScore,
      vocabulary: vocabularyScore,
      style: styleScore,
      structure: structureScore
    };
  };
  
  // 保存文档
  const saveDocument = () => {
    if (onSave) {
      onSave(text, title);
    }
    setSavedSnackbarOpen(true);
  };
  
  // 复制到剪贴板
  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    // 可以添加一个通知提示复制成功
  };
  
  // 获取分数颜色
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'success.main';
    if (score >= 70) return 'primary.main';
    if (score >= 50) return 'warning.main';
    return 'error.main';
  };
  
  // 处理标签切换
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };
  
  // 渲染写作评分卡片
  const renderScoreCard = (title: string, score: number, description: string) => (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent sx={{ p: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="subtitle2" color="text.secondary">
            {title}
          </Typography>
          <Chip 
            label={`${score}/100`} 
            size="small"
            sx={{ 
              fontWeight: 'bold',
              bgcolor: getScoreColor(score),
              color: 'white'
            }}
          />
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontSize: '0.75rem' }}>
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* 顶部工具栏 */}
      <Paper sx={{ p: 2, mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            variant="standard"
            placeholder="文档标题"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ mr: 2, width: 200 }}
            InputProps={{ sx: { fontSize: '1.2rem', fontWeight: 'bold' } }}
            disabled={readOnly}
          />
          
          <FormControl variant="outlined" size="small" sx={{ minWidth: 120, mr: 2 }}>
            <InputLabel>写作风格</InputLabel>
            <Select
              value={selectedStyle}
              onChange={(e) => setSelectedStyle(e.target.value)}
              label="写作风格"
              disabled={readOnly}
            >
              {writingStyles.map(style => (
                <MenuItem key={style.id} value={style.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ mr: 1 }}>{style.icon}</Box>
                    {style.name}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        
        <Box>
          <Tooltip title="复制内容">
            <IconButton onClick={copyToClipboard}>
              <ContentCopyIcon />
            </IconButton>
          </Tooltip>
          {!readOnly && (
            <>
              <Tooltip title="分析写作">
                <IconButton 
                  onClick={analyzeText} 
                  disabled={isAnalyzing || text.length < 20}
                  color="primary"
                >
                  <SpellcheckIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="保存文档">
                <IconButton 
                  onClick={saveDocument}
                  color="primary"
                  disabled={!text.trim()}
                >
                  <SaveIcon />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Box>
      </Paper>
      
      {/* 主体内容区 */}
      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        {/* 左侧编辑区 */}
        <Box sx={{ flexGrow: 1, mr: 2 }}>
          <TextField
            inputRef={textFieldRef}
            placeholder="开始输入您的文本..."
            multiline
            fullWidth
            minRows={12}
            maxRows={20}
            value={text}
            onChange={(e) => setText(e.target.value)}
            variant="outlined"
            disabled={readOnly}
            sx={{
              '& .MuiOutlinedInput-root': {
                fontFamily: '"Noto Serif SC", serif',
                fontSize: '1rem',
                lineHeight: 1.8
              }
            }}
          />
          
          {isAnalyzing && (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
              <CircularProgress size={20} sx={{ mr: 1 }} />
              <Typography variant="body2" color="text.secondary">
                分析您的写作...
              </Typography>
            </Box>
          )}
        </Box>
        
        {/* 右侧建议区 */}
        <Box sx={{ width: 300, flexShrink: 0 }}>
          <Paper sx={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab label="建议" />
              <Tab label="评分" />
            </Tabs>
            
            <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
              {activeTab === 0 ? (
                // 建议标签内容
                suggestions.length > 0 ? (
                  <List sx={{ p: 0 }}>
                    {suggestions.map((suggestion) => (
                      <ListItem 
                        key={suggestion.id}
                        sx={{ 
                          mb: 1, 
                          p: 1.5, 
                          bgcolor: 'background.paper',
                          border: '1px solid',
                          borderColor: 'divider',
                          borderRadius: 1,
                          opacity: appliedSuggestions.includes(suggestion.id) ? 0.6 : 1
                        }}
                        disablePadding
                        secondaryAction={
                          !appliedSuggestions.includes(suggestion.id) && !readOnly ? (
                            <Tooltip title="应用建议">
                              <IconButton 
                                edge="end" 
                                size="small"
                                onClick={() => applySuggestion(suggestion)}
                              >
                                <CheckIcon />
                              </IconButton>
                            </Tooltip>
                          ) : null
                        }
                      >
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          {suggestion.type === 'grammar' && <ErrorIcon color="error" />}
                          {suggestion.type === 'vocabulary' && <LightbulbIcon color="warning" />}
                          {suggestion.type === 'style' && <LocalOfferIcon color="primary" />}
                          {suggestion.type === 'structure' && <FormatBoldIcon color="info" />}
                          {suggestion.type === 'clarity' && <InfoIcon color="secondary" />}
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box>
                              <Typography variant="body2" component="span" sx={{ fontWeight: 'bold' }}>
                                "{suggestion.originalText}"
                              </Typography>
                              {suggestion.type !== 'structure' && (
                                <>
                                  <Typography variant="body2" component="span"> → </Typography>
                                  <Typography variant="body2" component="span" color="success.main" sx={{ fontWeight: 'bold' }}>
                                    "{suggestion.suggestedText}"
                                  </Typography>
                                </>
                              )}
                            </Box>
                          }
                          secondary={
                            <Typography variant="caption" color="text.secondary" component="div" sx={{ mt: 0.5 }}>
                              {suggestion.explanation}
                            </Typography>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      {text.length < 20 
                        ? '请输入至少20个字符以获取写作建议' 
                        : '点击分析按钮获取写作建议'}
                    </Typography>
                  </Box>
                )
              ) : (
                // 评分标签内容
                writingScore ? (
                  <>
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                      <Typography variant="h4" color={getScoreColor(writingScore.overall)}>
                        {writingScore.overall}
                      </Typography>
                      <Typography variant="subtitle2" color="text.secondary">
                        总体评分
                      </Typography>
                    </Box>
                    
                    {renderScoreCard(
                      '语法准确性', 
                      writingScore.grammar, 
                      '评估句子结构、时态搭配、标点使用等方面的准确性'
                    )}
                    
                    {renderScoreCard(
                      '词汇丰富度', 
                      writingScore.vocabulary, 
                      '评估词汇多样性、准确性和适当的专业术语使用'
                    )}
                    
                    {renderScoreCard(
                      '风格一致性', 
                      writingScore.style, 
                      '评估文本是否符合所选写作风格的标准和期望'
                    )}
                    
                    {renderScoreCard(
                      '结构组织', 
                      writingScore.structure, 
                      '评估段落划分、逻辑连贯性和整体文本组织'
                    )}
                  </>
                ) : (
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      点击分析按钮获取写作评分
                    </Typography>
                  </Box>
                )
              )}
            </Box>
          </Paper>
        </Box>
      </Box>
      
      {/* 底部状态栏 */}
      <Paper sx={{ mt: 2, p: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          {text.split(/\s+/).filter(Boolean).length} 词 | {text.length} 字符
        </Typography>
        
        <Box>
          {writingScore && (
            <Chip 
              label={`总体评分: ${writingScore.overall}/100`} 
              size="small"
              sx={{ 
                fontWeight: 'bold',
                bgcolor: getScoreColor(writingScore.overall),
                color: 'white',
                mr: 1
              }}
            />
          )}
          
          <Chip 
            label={writingStyles.find(style => style.id === selectedStyle)?.name || '通用'} 
            size="small"
            icon={writingStyles.find(style => style.id === selectedStyle)?.icon}
          />
        </Box>
      </Paper>
      
      {/* 保存成功提示 */}
      <Snackbar
        open={savedSnackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSavedSnackbarOpen(false)}
      >
        <Alert onClose={() => setSavedSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
          文档已保存
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default WritingAssistant; 