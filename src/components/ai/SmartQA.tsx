import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  CircularProgress,
  Divider,
  Card,
  CardContent,
  Chip,
  IconButton,
  Tooltip,
  InputAdornment
} from '@mui/material';
import {
  Send as SendIcon,
  Psychology as PsychologyIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  ContentCopy as ContentCopyIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  Search as SearchIcon,
  BookOutlined as BookOutlinedIcon,
  HelpOutline as HelpOutlineIcon
} from '@mui/icons-material';

// 定义接口
interface QAMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  resources?: RelatedResource[];
  concepts?: RelatedConcept[];
  isBookmarked?: boolean;
  isLoading?: boolean;
}

interface RelatedResource {
  id: string;
  title: string;
  type: 'article' | 'video' | 'book' | 'exercise';
  url: string;
  icon: React.ReactNode;
}

interface RelatedConcept {
  id: string;
  name: string;
  description: string;
}

interface SmartQAProps {
  initialQuestion?: string;
  onBookmark?: (question: string, answer: string) => void;
  category?: 'grammar' | 'vocabulary' | 'speaking' | 'writing' | 'general';
}

// 主组件
const SmartQA: React.FC<SmartQAProps> = ({
  initialQuestion = '',
  onBookmark,
  category = 'general'
}) => {
  // 状态管理
  const [messages, setMessages] = useState<QAMessage[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(initialQuestion);
  const [isProcessing, setIsProcessing] = useState(false);
  const [popularQuestions, setPopularQuestions] = useState<string[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // 初始化热门问题
  useEffect(() => {
    // 根据类别设置不同的热门问题
    const categoryQuestions: Record<string, string[]> = {
      'grammar': [
        '如何区分"affect"和"effect"的用法？',
        '什么时候使用现在完成时？',
        '非限定性定语从句和限定性定语从句有什么区别？',
        'would和will的区别是什么？'
      ],
      'vocabulary': [
        '如何有效记忆英语单词？',
        '"upset"和"angry"有什么区别？',
        '如何扩大我的学术词汇量？',
        '商务英语中常用的礼貌表达有哪些？'
      ],
      'speaking': [
        '如何克服英语口语紧张？',
        '有什么好方法可以提高英语发音？',
        '日常对话中常用的口语表达有哪些？',
        '如何使英语口语更流利自然？'
      ],
      'writing': [
        '如何写一篇有说服力的英语论文？',
        'academic writing有哪些重要特点？',
        '正式邮件的写作格式是什么？',
        '如何避免在英语写作中的常见错误？'
      ],
      'general': [
        '如何制定有效的英语学习计划？',
        '自学英语的最佳方法是什么？',
        '如何提高英语听力技能？',
        '如何准备雅思/托福考试？'
      ]
    };
    
    setPopularQuestions(categoryQuestions[category] || categoryQuestions.general);
  }, [category]);
  
  // 自动滚动到最新消息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // 获取类别图标
  const getCategoryIcon = (): React.ReactNode => {
    switch (category) {
      case 'grammar':
        return <BookOutlinedIcon />;
      case 'vocabulary':
        return <PsychologyIcon />;
      case 'speaking':
        return <HelpOutlineIcon />;
      case 'writing':
        return <ContentCopyIcon />;
      default:
        return <PsychologyIcon />;
    }
  };
  
  // 处理问题提交
  const handleSubmitQuestion = () => {
    if (!currentQuestion.trim()) return;
    
    // 添加用户问题到消息列表
    const userMessage: QAMessage = {
      id: `user-${Date.now()}`,
      content: currentQuestion,
      isUser: true,
      timestamp: new Date()
    };
    
    // 添加AI回复占位（带加载状态）
    const aiResponsePlaceholder: QAMessage = {
      id: `ai-${Date.now()}`,
      content: '',
      isUser: false,
      timestamp: new Date(),
      isLoading: true
    };
    
    setMessages(prev => [...prev, userMessage, aiResponsePlaceholder]);
    setIsProcessing(true);
    
    // 模拟API请求处理
    setTimeout(() => {
      // 生成AI回复
      const aiResponse = generateQAResponse(currentQuestion);
      
      // 更新消息列表，替换占位符
      setMessages(prev => prev.map(message => 
        message.id === aiResponsePlaceholder.id ? aiResponse : message
      ));
      
      setCurrentQuestion('');
      setIsProcessing(false);
    }, 1500); // 模拟网络延迟
  };
  
  // 生成回复（模拟）
  const generateQAResponse = (question: string): QAMessage => {
    // 模拟智能问答系统的回复生成
    
    // 一些基础问题和答案
    const basicQAPairs: Record<string, string> = {
      'how are you': '我很好，谢谢关心！我随时准备帮助您解答英语学习问题。',
      'hello': '你好！我是您的英语学习助手。请问有什么英语问题需要帮助？',
      'hi': '你好！有什么英语相关的问题我可以帮忙解答？',
      'thanks': '不客气！如果还有其他问题，随时可以问我。',
      'thank you': '不客气！很高兴能帮到您。祝您学习顺利！'
    };
    
    // 检查是否是基础问候
    const lowercaseQuestion = question.toLowerCase();
    if (basicQAPairs[lowercaseQuestion]) {
      return {
        id: `ai-${Date.now()}`,
        content: basicQAPairs[lowercaseQuestion],
        isUser: false,
        timestamp: new Date()
      };
    }
    
    // 根据类别生成不同的回答
    let responseContent = '';
    let resources: RelatedResource[] = [];
    let concepts: RelatedConcept[] = [];
    
    if (category === 'grammar' || lowercaseQuestion.includes('grammar') || lowercaseQuestion.includes('语法')) {
      // 语法相关回答模板
      if (lowercaseQuestion.includes('affect') && lowercaseQuestion.includes('effect')) {
        responseContent = 'affect和effect的区别:\n\n1. affect通常作为动词，意思是"影响"。例如：The weather affects my mood. (天气影响我的心情)\n\n2. effect通常作为名词，意思是"效果、结果"。例如：The effect of the medicine was immediate. (药的效果是立竿见影的)\n\n尽管effect也可以作为动词使用（意为"实现、引起"），但这种用法较少见，主要出现在正式文本中。';
        
        concepts = [
          {
            id: 'c1',
            name: 'affect (v.)',
            description: '作为动词，意为"影响"；发音: /əˈfekt/'
          },
          {
            id: 'c2',
            name: 'effect (n.)',
            description: '作为名词，意为"效果、结果"；发音: /ɪˈfekt/'
          }
        ];
      } else if (lowercaseQuestion.includes('present perfect') || lowercaseQuestion.includes('现在完成时')) {
        responseContent = '现在完成时的使用情况:\n\n1. 表示过去发生且已完成的动作，但对现在有影响。例如：I have lost my keys. (我丢了钥匙，现在没有钥匙)\n\n2. 表示从过去开始持续到现在的动作。例如：I have lived here for ten years. (我在这里住了十年，现在还住在这里)\n\n3. 表示过去发生的，在说话之前刚刚完成的动作。例如：I have just finished my homework. (我刚刚完成了我的家庭作业)\n\n形式：主语 + have/has + 过去分词';
      } else {
        responseContent = '语法是英语学习的重要基础。如果您有特定的语法问题，请提供更多细节，我会给您详细的解释和例句。\n\n一般来说，掌握好基本时态、句子结构和常用语法规则是提高英语能力的关键。建议您通过阅读、练习和实际应用来加强语法知识。';
      }
      
      resources = [
        {
          id: 'r1',
          title: '英语语法基础指南',
          type: 'article',
          url: '/resources/grammar-guide',
          icon: <BookOutlinedIcon />
        },
        {
          id: 'r2',
          title: '常见语法错误分析',
          type: 'video',
          url: '/resources/grammar-errors',
          icon: <BookOutlinedIcon />
        }
      ];
    } else if (category === 'vocabulary' || lowercaseQuestion.includes('vocabulary') || lowercaseQuestion.includes('词汇')) {
      // 词汇相关回答模板
      if (lowercaseQuestion.includes('记忆') || lowercaseQuestion.includes('remember')) {
        responseContent = '有效记忆英语单词的方法:\n\n1. 使用间隔重复法 - 科学研究表明，在特定的时间间隔内复习单词可以显著提高记忆效果\n\n2. 联想记忆法 - 将单词与图像、故事或个人经历联系起来\n\n3. 词根词缀法 - 学习常见的词根和词缀，理解单词构成\n\n4. 情境学习法 - 在实际语境中学习单词，如阅读文章或观看视频\n\n5. 记忆宫殿法 - 将单词与熟悉的位置联系起来\n\n6. 创建思维导图 - 按主题或语义场整理单词\n\n记住，持续的复习和实际使用是巩固词汇记忆的关键。';
      } else {
        responseContent = '扩展词汇量是提高英语能力的重要环节。建议您：\n\n1. 每天学习5-10个新单词\n2. 使用单词卡或应用程序进行间隔重复记忆\n3. 在真实语境中使用新学的单词\n4. 按主题学习相关单词\n5. 注意词汇的搭配和用法\n\n如果您有特定词汇方面的问题，请详细说明，我会提供针对性的帮助。';
      }
      
      resources = [
        {
          id: 'r1',
          title: '高效词汇学习技巧',
          type: 'article',
          url: '/resources/vocabulary-learning',
          icon: <PsychologyIcon />
        },
        {
          id: 'r2',
          title: '2000核心英语词汇',
          type: 'book',
          url: '/resources/core-vocabulary',
          icon: <PsychologyIcon />
        }
      ];
    } else {
      // 通用回答
      responseContent = `感谢您的问题！\n\n${question}\n\n这是一个很好的学习疑问。英语学习是一个持续的过程，需要结合听说读写多种技能的练习。建议您：\n\n1. 制定明确的学习目标\n2. 坚持日常练习\n3. 寻找适合自己的学习方法\n4. 多接触英语环境\n\n如果您有更具体的问题，请提供详细信息，我可以给您更有针对性的建议。`;
      
      resources = [
        {
          id: 'r1',
          title: '英语学习资源库',
          type: 'article',
          url: '/resources/learning-resources',
          icon: <BookOutlinedIcon />
        },
        {
          id: 'r2',
          title: '自学英语完全指南',
          type: 'book',
          url: '/resources/self-study-guide',
          icon: <BookOutlinedIcon />
        }
      ];
    }
    
    return {
      id: `ai-${Date.now()}`,
      content: responseContent,
      isUser: false,
      timestamp: new Date(),
      resources: resources.length > 0 ? resources : undefined,
      concepts: concepts.length > 0 ? concepts : undefined,
      isBookmarked: false
    };
  };
  
  // 切换收藏状态
  const toggleBookmark = (messageId: string) => {
    setMessages(prev => prev.map(message => {
      if (message.id === messageId) {
        const newBookmarkedState = !message.isBookmarked;
        
        // 调用外部回调
        if (newBookmarkedState && onBookmark) {
          const questionMessage = prev.find(m => m.isUser && m.timestamp < message.timestamp);
          if (questionMessage) {
            onBookmark(questionMessage.content, message.content);
          }
        }
        
        return {
          ...message,
          isBookmarked: newBookmarkedState
        };
      }
      return message;
    }));
  };
  
  // 使用热门问题
  const usePopularQuestion = (question: string) => {
    setCurrentQuestion(question);
  };
  
  // 复制回答内容
  const copyAnswerToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    // 可以添加通知提示复制成功
  };
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* 顶部标题 */}
      <Paper 
        elevation={0}
        sx={{ 
          p: 2, 
          mb: 2, 
          display: 'flex', 
          alignItems: 'center',
          borderRadius: 2,
          bgcolor: 'primary.light',
          color: 'primary.contrastText'
        }}
      >
        <Box sx={{ mr: 2 }}>
          {getCategoryIcon()}
        </Box>
        <Box>
          <Typography variant="h6">
            智能英语问答
          </Typography>
          <Typography variant="body2">
            有任何英语学习问题，随时向AI助手提问
          </Typography>
        </Box>
      </Paper>
      
      {/* 聊天内容区域 */}
      <Paper 
        elevation={0}
        sx={{ 
          flexGrow: 1, 
          mb: 2, 
          p: 2,
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          overflow: 'auto',
          maxHeight: '60vh',
          bgcolor: 'background.default'
        }}
      >
        {messages.length === 0 ? (
          // 初始状态：显示热门问题
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" gutterBottom>
              还没有问题记录
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              可以问我任何英语学习相关的问题
            </Typography>
            
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                热门问题:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1, mt: 1 }}>
                {popularQuestions.map((question, index) => (
                  <Chip 
                    key={index}
                    label={question}
                    onClick={() => usePopularQuestion(question)}
                    sx={{ my: 0.5 }}
                  />
                ))}
              </Box>
            </Box>
          </Box>
        ) : (
          // 聊天记录
          <List sx={{ p: 0 }}>
            {messages.map((message) => (
              <ListItem 
                key={message.id}
                sx={{ 
                  flexDirection: 'column', 
                  alignItems: message.isUser ? 'flex-end' : 'flex-start',
                  px: 0,
                  py: 1
                }}
              >
                <Box 
                  sx={{
                    display: 'flex',
                    flexDirection: message.isUser ? 'row-reverse' : 'row',
                    alignItems: 'flex-start',
                    maxWidth: '85%'
                  }}
                >
                  <ListItemAvatar sx={{ minWidth: message.isUser ? 0 : 50 }}>
                    {!message.isUser && (
                      <Avatar sx={{ bgcolor: 'primary.main', ml: message.isUser ? 2 : 0 }}>
                        <PsychologyIcon />
                      </Avatar>
                    )}
                  </ListItemAvatar>
                  
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: message.isUser ? 'primary.main' : 'background.paper',
                      color: message.isUser ? 'primary.contrastText' : 'text.primary',
                      border: '1px solid',
                      borderColor: 'divider',
                      ml: message.isUser ? 0 : 1,
                      mr: message.isUser ? 1 : 0,
                      position: 'relative',
                      whiteSpace: 'pre-line'
                    }}
                  >
                    {message.isLoading ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
                        <CircularProgress size={20} sx={{ mr: 2 }} />
                        <Typography variant="body2">思考中...</Typography>
                      </Box>
                    ) : (
                      <Typography variant="body1">
                        {message.content}
                      </Typography>
                    )}
                    
                    {!message.isUser && !message.isLoading && (
                      <Box 
                        sx={{ 
                          position: 'absolute', 
                          top: 8, 
                          right: 8, 
                          display: 'flex'
                        }}
                      >
                        <Tooltip title="复制回答">
                          <IconButton 
                            size="small"
                            onClick={() => copyAnswerToClipboard(message.content)}
                          >
                            <ContentCopyIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        
                        <Tooltip title={message.isBookmarked ? "取消收藏" : "收藏回答"}>
                          <IconButton 
                            size="small"
                            onClick={() => toggleBookmark(message.id)}
                            color={message.isBookmarked ? 'primary' : 'default'}
                          >
                            {message.isBookmarked ? (
                              <BookmarkIcon fontSize="small" />
                            ) : (
                              <BookmarkBorderIcon fontSize="small" />
                            )}
                          </IconButton>
                        </Tooltip>
                      </Box>
                    )}
                  </Paper>
                </Box>
                
                {/* 相关资源和概念 */}
                {!message.isUser && !message.isLoading && (message.resources || message.concepts) && (
                  <Box 
                    sx={{ 
                      ml: 7, 
                      mt: 1, 
                      width: 'calc(100% - 60px)',
                      maxWidth: '85%'
                    }}
                  >
                    {message.resources && (
                      <Card variant="outlined" sx={{ mb: 1 }}>
                        <CardContent sx={{ py: 1, '&:last-child': { pb: 1 } }}>
                          <Typography variant="subtitle2" gutterBottom>
                            相关资源
                          </Typography>
                          {message.resources.map(resource => (
                            <Box 
                              key={resource.id}
                              sx={{ 
                                display: 'flex', 
                                alignItems: 'center',
                                p: 0.5,
                                '&:hover': { bgcolor: 'action.hover' },
                                borderRadius: 1
                              }}
                            >
                              <Box sx={{ mr: 1, color: 'primary.main' }}>
                                {resource.icon}
                              </Box>
                              <Typography variant="body2" component="a" href={resource.url} sx={{ color: 'primary.main', textDecoration: 'none' }}>
                                {resource.title}
                              </Typography>
                              <Chip 
                                label={resource.type} 
                                size="small" 
                                sx={{ ml: 1, height: 20, fontSize: '0.625rem' }}
                              />
                            </Box>
                          ))}
                        </CardContent>
                      </Card>
                    )}
                    
                    {message.concepts && (
                      <Card variant="outlined">
                        <CardContent sx={{ py: 1, '&:last-child': { pb: 1 } }}>
                          <Typography variant="subtitle2" gutterBottom>
                            相关概念
                          </Typography>
                          {message.concepts.map(concept => (
                            <Box key={concept.id} sx={{ mb: 0.5 }}>
                              <Typography variant="body2" fontWeight="bold">
                                {concept.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {concept.description}
                              </Typography>
                            </Box>
                          ))}
                        </CardContent>
                      </Card>
                    )}
                  </Box>
                )}
              </ListItem>
            ))}
            <div ref={messagesEndRef} />
          </List>
        )}
      </Paper>
      
      {/* 输入区域 */}
      <Paper 
        elevation={0}
        sx={{ 
          p: 2,
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider'
        }}
      >
        <TextField
          fullWidth
          placeholder="输入您的英语学习问题..."
          value={currentQuestion}
          onChange={(e) => setCurrentQuestion(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmitQuestion();
            }
          }}
          variant="outlined"
          multiline
          rows={2}
          disabled={isProcessing}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton 
                  onClick={handleSubmitQuestion}
                  disabled={!currentQuestion.trim() || isProcessing}
                  color="primary"
                >
                  <SendIcon />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </Paper>
    </Box>
  );
};

export default SmartQA; 