import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Avatar,
  Chip,
  CircularProgress,
  IconButton,
  Tabs,
  Tab,
  Divider,
  Tooltip,
  Card,
  CardContent,
  Collapse
} from '@mui/material';
import {
  Mic as MicIcon,
  Send as SendIcon,
  Image as ImageIcon,
  Translate as TranslateIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  VolumeUp as VolumeUpIcon,
  Psychology as PsychologyIcon,
  School as SchoolIcon,
  Chat as ChatIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Lightbulb as LightbulbIcon
} from '@mui/icons-material';

// 定义辅导提示类型
interface Suggestion {
  id: string;
  type: 'grammar' | 'vocabulary' | 'pronunciation' | 'expression';
  content: string;
  explanation: string;
  examples: string[];
}

// 定义辅导会话消息类型
interface Message {
  id: string;
  sender: 'user' | 'ai';
  content: string;
  timestamp: Date;
  suggestions?: Suggestion[];
  correctedContent?: string;
  isSaved?: boolean;
}

// 定义学习建议类型
interface LearningTip {
  id: string;
  title: string;
  content: string;
  relevance: number; // 0-100 相关性评分
}

// 定义常见问题类型
interface CommonQuestion {
  id: string;
  question: string;
  category: string;
}

// 定义组件属性
interface AITutorProps {
  userId?: string;
  learningLevel?: 'beginner' | 'intermediate' | 'advanced';
  focusArea?: string[];
  onSaveSuggestion?: (suggestion: Suggestion) => void;
}

// 主组件
const AITutor: React.FC<AITutorProps> = ({
  userId,
  learningLevel = 'intermediate',
  focusArea = [],
  onSaveSuggestion
}) => {
  // 状态管理
  const [activeTab, setActiveTab] = useState(0);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [learningTips, setLearningTips] = useState<LearningTip[]>([]);
  const [commonQuestions, setCommonQuestions] = useState<CommonQuestion[]>([]);
  const [expandedTipId, setExpandedTipId] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 常见问题初始化
  useEffect(() => {
    setCommonQuestions([
      { id: '1', question: '如何区分"比较级"和"最高级"的使用场景？', category: 'grammar' },
      { id: '2', question: '英语中的情态动词有哪些，各自表达什么含义？', category: 'grammar' },
      { id: '3', question: '如何有效地扩展我的英语词汇量？', category: 'vocabulary' },
      { id: '4', question: '如何准确发音英语中的"th"音？', category: 'pronunciation' },
      { id: '5', question: '商务场合常用的英语邮件开头和结尾有哪些？', category: 'business' },
      { id: '6', question: '如何用英语自然地表达感谢？', category: 'expression' }
    ]);
    
    // 默认欢迎消息
    setMessages([
      {
        id: '0',
        sender: 'ai',
        content: `你好！我是你的AI英语学习助手。今天我们可以：\n- 练习英语对话\n- 解答你的语法问题\n- 提供个性化学习建议\n\n你现在想要做什么呢？`,
        timestamp: new Date(),
      }
    ]);
  }, []);

  // 消息滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 处理选项卡变化
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // 处理提交消息
  const handleSubmit = async () => {
    if (!inputText.trim()) return;
    
    // 添加用户消息
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: inputText,
      timestamp: new Date()
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputText('');
    setIsLoading(true);
    
    // 模拟AI分析和回复
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputText);
      setMessages(prevMessages => [...prevMessages, aiResponse]);
      
      // 根据用户输入生成学习建议
      const newTips = generateLearningTips(inputText);
      setLearningTips(prevTips => [...newTips, ...prevTips].slice(0, 5));
      
      setIsLoading(false);
    }, 1500);
  };

  // 模拟开始语音输入
  const handleVoiceInput = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // 模拟语音识别过程
      setTimeout(() => {
        setInputText(prevText => prevText + "我想练习英语口语，特别是日常对话。");
        setIsRecording(false);
      }, 3000);
    }
  };

  // 处理常见问题点击
  const handleQuestionClick = (question: string) => {
    setInputText(question);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // 切换学习提示展开/收起
  const toggleTipExpand = (tipId: string) => {
    setExpandedTipId(expandedTipId === tipId ? null : tipId);
  };

  // 标记/取消标记消息为收藏
  const toggleSaveMessage = (messageId: string) => {
    setMessages(prevMessages =>
      prevMessages.map(msg =>
        msg.id === messageId
          ? { ...msg, isSaved: !msg.isSaved }
          : msg
      )
    );
  };

  // 生成AI响应（模拟）
  const generateAIResponse = (userInput: string): Message => {
    // 检查输入中的语法或表达问题
    const containsError = userInput.toLowerCase().includes('你好') || 
                          userInput.toLowerCase().includes('我想');
    
    // 基于错误类型生成建议
    let suggestions: Suggestion[] = [];
    let correctedContent = '';
    
    if (containsError) {
      if (userInput.toLowerCase().includes('你好')) {
        suggestions.push({
          id: `sug-${Date.now()}-1`,
          type: 'expression',
          content: '使用"Hello"或"Hi"代替直译的"你好"',
          explanation: '英语中打招呼通常使用Hello或Hi，而不是直接翻译中文的"你好"',
          examples: ['Hello, how are you today?', 'Hi there! Nice to meet you.']
        });
        correctedContent = userInput.replace(/你好/g, 'Hello');
      }
      
      if (userInput.toLowerCase().includes('我想')) {
        suggestions.push({
          id: `sug-${Date.now()}-2`,
          type: 'grammar',
          content: '使用"I would like to"或"I want to"表达愿望',
          explanation: '英语中表达愿望可以使用"I would like to"(更礼貌)或"I want to"',
          examples: ['I would like to practice English conversation.', 'I want to improve my speaking skills.']
        });
        correctedContent = userInput.replace(/我想/g, 'I would like to');
      }
    }
    
    // 根据用户输入内容生成回复
    let responseContent = '';
    
    if (userInput.toLowerCase().includes('grammar') || userInput.toLowerCase().includes('语法')) {
      responseContent = '语法是语言学习的重要基础。我可以帮你解答语法问题，提供例句和练习。你有什么具体的语法问题吗？';
    } else if (userInput.toLowerCase().includes('vocabulary') || userInput.toLowerCase().includes('词汇')) {
      responseContent = '扩展词汇量对提高英语能力至关重要。我建议你通过主题学习词汇，并在实际语境中使用新词。你想学习哪个领域的词汇？';
    } else if (userInput.toLowerCase().includes('speaking') || userInput.toLowerCase().includes('口语')) {
      responseContent = '提高口语需要大量练习。我们可以进行角色对话，或者我可以给你一些日常表达来练习。要开始一个简单的对话练习吗？';
    } else if (userInput.toLowerCase().includes('writing') || userInput.toLowerCase().includes('写作')) {
      responseContent = '写作是提高语言准确性的好方法。我可以帮你修改写作内容，提供表达建议。你想练习什么类型的写作？';
    } else {
      responseContent = `我理解你想${userInput.length > 30 ? '进行深入的英语学习' : '提高英语能力'}。根据你的学习阶段，我建议先专注于日常对话和基础语法。我们可以从简单的对话开始，逐步提高难度。你觉得怎么样？`;
    }
    
    // 如果有错误修正，添加到回复中
    if (correctedContent) {
      responseContent = `我注意到你的表达有几处可以优化:\n\n${correctedContent}\n\n${responseContent}`;
    }
    
    return {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      content: responseContent,
      timestamp: new Date(),
      suggestions: suggestions.length > 0 ? suggestions : undefined,
      correctedContent: correctedContent || undefined
    };
  };

  // 生成学习建议（模拟）
  const generateLearningTips = (userInput: string): LearningTip[] => {
    const tips: LearningTip[] = [];
    
    if (userInput.toLowerCase().includes('grammar') || userInput.toLowerCase().includes('语法')) {
      tips.push({
        id: `tip-${Date.now()}-1`,
        title: '语法学习小技巧',
        content: '尝试使用"语法图表法"来理解复杂语法结构。将句子绘制成树状图，标明各部分的语法功能，这有助于理解句子结构。',
        relevance: 95
      });
    }
    
    if (userInput.toLowerCase().includes('vocabulary') || userInput.toLowerCase().includes('词汇')) {
      tips.push({
        id: `tip-${Date.now()}-2`,
        title: '高效词汇记忆法',
        content: '使用间隔重复技术来记忆词汇。研究表明，在特定的时间间隔内复习单词（例如1天后、3天后、7天后、14天后）可以显著提高记忆效果。',
        relevance: 90
      });
    }
    
    if (userInput.toLowerCase().includes('speaking') || userInput.toLowerCase().includes('口语')) {
      tips.push({
        id: `tip-${Date.now()}-3`,
        title: '口语流利度提升技巧',
        content: '每天大声朗读5-10分钟。选择一篇短文或对话，先慢速朗读，然后逐渐提高速度，重复多次直到感觉流畅。这有助于改善发音和语调。',
        relevance: 85
      });
    }
    
    // 添加一个通用的学习建议
    tips.push({
      id: `tip-${Date.now()}-4`,
      title: '多感官学习方法',
      content: '结合听、说、读、写多种感官来学习语言。例如，听一段对话，然后尝试复述，接着阅读文本，最后写下关键句子。这种多通道学习方式可以加深记忆。',
      relevance: 75
    });
    
    return tips;
  };

  // 渲染消息气泡
  const renderMessage = (message: Message) => {
    const isAI = message.sender === 'ai';
    
    return (
      <Box
        key={message.id}
        sx={{
          display: 'flex',
          flexDirection: isAI ? 'row' : 'row-reverse',
          mb: 2
        }}
      >
        <Avatar
          sx={{
            bgcolor: isAI ? 'primary.main' : 'secondary.main',
            width: 40,
            height: 40,
            mr: isAI ? 1 : 0,
            ml: isAI ? 0 : 1
          }}
        >
          {isAI ? <PsychologyIcon /> : 'U'}
        </Avatar>
        
        <Box
          sx={{
            maxWidth: '75%',
            position: 'relative'
          }}
        >
          <Paper
            elevation={1}
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: isAI ? 'background.paper' : 'primary.light',
              color: isAI ? 'text.primary' : 'primary.contrastText'
            }}
          >
            <Typography 
              variant="body1" 
              component="div"
              sx={{ whiteSpace: 'pre-line' }}
            >
              {message.content}
            </Typography>
            
            {isAI && message.suggestions && message.suggestions.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Divider sx={{ my: 1 }} />
                <Typography variant="subtitle2" color="primary" gutterBottom>
                  语言优化建议
                </Typography>
                
                {message.suggestions.map(suggestion => (
                  <Card 
                    key={suggestion.id} 
                    variant="outlined"
                    sx={{ mb: 1, bgcolor: 'background.default' }}
                  >
                    <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                      <Box display="flex" alignItems="center" mb={1}>
                        <Chip
                          size="small"
                          label={
                            suggestion.type === 'grammar' ? '语法' :
                            suggestion.type === 'vocabulary' ? '词汇' :
                            suggestion.type === 'pronunciation' ? '发音' : '表达'
                          }
                          color={
                            suggestion.type === 'grammar' ? 'primary' :
                            suggestion.type === 'vocabulary' ? 'secondary' :
                            suggestion.type === 'pronunciation' ? 'success' : 'info'
                          }
                          sx={{ mr: 1 }}
                        />
                        <Typography variant="body2" fontWeight="bold">
                          {suggestion.content}
                        </Typography>
                        
                        <IconButton 
                          size="small" 
                          sx={{ ml: 'auto' }}
                          onClick={() => onSaveSuggestion && onSaveSuggestion(suggestion)}
                        >
                          <BookmarkBorderIcon fontSize="small" />
                        </IconButton>
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {suggestion.explanation}
                      </Typography>
                      
                      <Box sx={{ bgcolor: 'action.hover', p: 1, borderRadius: 1, mt: 1 }}>
                        <Typography variant="caption" component="div" fontWeight="bold">例句:</Typography>
                        {suggestion.examples.map((example, idx) => (
                          <Typography key={idx} variant="caption" component="div">
                            - {example}
                          </Typography>
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}
          </Paper>
          
          <Box
            sx={{
              display: 'flex',
              justifyContent: isAI ? 'flex-start' : 'flex-end',
              mt: 0.5,
              alignItems: 'center'
            }}
          >
            <Typography variant="caption" color="text.secondary" sx={{ mx: 1 }}>
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Typography>
            
            {isAI && (
              <>
                <Tooltip title="朗读文本">
                  <IconButton size="small">
                    <VolumeUpIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title={message.isSaved ? "取消收藏" : "收藏此回答"}>
                  <IconButton 
                    size="small"
                    onClick={() => toggleSaveMessage(message.id)}
                  >
                    {message.isSaved ? 
                      <BookmarkIcon fontSize="small" color="primary" /> : 
                      <BookmarkBorderIcon fontSize="small" />
                    }
                  </IconButton>
                </Tooltip>
              </>
            )}
          </Box>
        </Box>
      </Box>
    );
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* 标题区域 */}
      <Box
        sx={{
          p: 2,
          bgcolor: 'background.paper',
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <PsychologyIcon fontSize="large" color="primary" sx={{ mr: 1 }} />
        <Typography variant="h6" component="div">
          AI智能辅导助手
        </Typography>
        <Chip 
          label={`${learningLevel === 'beginner' ? '初级' : learningLevel === 'intermediate' ? '中级' : '高级'}模式`} 
          size="small" 
          color="primary" 
          sx={{ ml: 2 }} 
        />
        {focusArea && focusArea.length > 0 && (
          <Box sx={{ ml: 2, display: 'flex', gap: 0.5 }}>
            {focusArea.map((area, index) => (
              <Chip key={index} label={area} size="small" variant="outlined" />
            ))}
          </Box>
        )}
      </Box>

      {/* 主内容区域 */}
      <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
        {/* 聊天区域 */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* 选项卡 */}
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            textColor="primary"
            indicatorColor="primary"
            variant="fullWidth"
            sx={{ bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab icon={<ChatIcon />} label="对话辅导" />
            <Tab icon={<SchoolIcon />} label="语法检查" />
            <Tab icon={<TranslateIcon />} label="翻译助手" />
          </Tabs>

          {/* 消息列表 */}
          <Box
            sx={{
              p: 2,
              flexGrow: 1,
              overflowY: 'auto',
              bgcolor: 'grey.50'
            }}
          >
            {messages.map(renderMessage)}
            <div ref={messagesEndRef} />
            
            {isLoading && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  mt: 2
                }}
              >
                <CircularProgress size={24} />
              </Box>
            )}
          </Box>

          {/* 输入区域 */}
          <Box
            sx={{
              p: 2,
              bgcolor: 'background.paper',
              borderTop: 1,
              borderColor: 'divider'
            }}
          >
            <Box
              component="form"
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              sx={{
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <TextField
                inputRef={inputRef}
                fullWidth
                variant="outlined"
                placeholder="输入问题、句子进行辅导..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                size="small"
                disabled={isLoading}
                sx={{ mr: 1 }}
              />
              <IconButton
                color={isRecording ? 'secondary' : 'default'}
                onClick={handleVoiceInput}
                disabled={isLoading}
              >
                <MicIcon />
              </IconButton>
              <IconButton
                color="default"
                disabled={isLoading}
              >
                <ImageIcon />
              </IconButton>
              <Button
                variant="contained"
                color="primary"
                endIcon={<SendIcon />}
                onClick={handleSubmit}
                disabled={isLoading || !inputText.trim()}
              >
                发送
              </Button>
            </Box>
            
            {/* 常见问题快捷方式 */}
            <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {commonQuestions.slice(0, 3).map((q) => (
                <Chip
                  key={q.id}
                  label={q.question.length > 20 ? q.question.substring(0, 20) + '...' : q.question}
                  size="small"
                  variant="outlined"
                  onClick={() => handleQuestionClick(q.question)}
                  clickable
                />
              ))}
            </Box>
          </Box>
        </Box>

        {/* 侧边栏 - 学习建议 */}
        <Box
          sx={{
            width: 300,
            borderLeft: 1,
            borderColor: 'divider',
            display: { xs: 'none', md: 'block' },
            overflowY: 'auto'
          }}
        >
          <Box sx={{ p: 2, bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}>
            <Typography variant="subtitle1" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
              <LightbulbIcon fontSize="small" sx={{ mr: 1 }} color="warning" />
              学习建议
            </Typography>
          </Box>
          
          <Box sx={{ p: 2 }}>
            {learningTips.length > 0 ? (
              learningTips.map((tip) => (
                <Card key={tip.id} sx={{ mb: 2 }} variant="outlined">
                  <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <Typography variant="subtitle2" component="div">
                        {tip.title}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => toggleTipExpand(tip.id)}
                      >
                        {expandedTipId === tip.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </IconButton>
                    </Box>
                    
                    <Collapse in={expandedTipId === tip.id}>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {tip.content}
                      </Typography>
                    </Collapse>
                    
                    <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                      <Chip 
                        label={`相关度: ${tip.relevance}%`} 
                        size="small" 
                        color={
                          tip.relevance > 80 ? 'success' :
                          tip.relevance > 60 ? 'primary' :
                          'default'
                        }
                        variant="outlined"
                      />
                    </Box>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 3 }}>
                与你当前学习内容相关的建议将在这里显示
              </Typography>
            )}
            
            {learningTips.length > 0 && (
              <Button 
                variant="outlined" 
                size="small" 
                fullWidth
                sx={{ mt: 1 }}
              >
                查看更多建议
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AITutor; 