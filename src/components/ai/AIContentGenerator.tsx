import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Card,
  CardContent,
  Divider,
  Alert,
  Paper,
  Chip,
  Stack,
  SelectChangeEvent,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SettingsIcon from '@mui/icons-material/Settings';
import OpenAIService, { ChatMessage } from '../../services/openaiService';
import { useLocalization } from '../i18n/LocalizationProvider';

// 主题选项
const topicOptions = [
  { value: 'business', label: '商务英语' },
  { value: 'travel', label: '旅行英语' },
  { value: 'academic', label: '学术英语' },
  { value: 'daily', label: '日常对话' },
  { value: 'technology', label: '科技英语' },
  { value: 'entertainment', label: '娱乐英语' },
  { value: 'health', label: '健康医疗' },
  { value: 'environment', label: '环境与自然' }
];

// 内容类型
type ContentType = 'practice' | 'dialogue' | 'vocabulary' | 'reading';

interface ContentTypeOption {
  value: ContentType;
  label: string;
  description: string;
}

// 内容类型选项
const contentTypeOptions: ContentTypeOption[] = [
  { 
    value: 'practice', 
    label: '练习题', 
    description: '包含例句、词汇解释和问题的综合练习'
  },
  { 
    value: 'dialogue', 
    label: '情境对话', 
    description: '模拟真实场景的英语对话示例'
  },
  { 
    value: 'vocabulary', 
    label: '词汇列表', 
    description: '主题相关的核心词汇及例句'
  },
  { 
    value: 'reading', 
    label: '阅读材料', 
    description: '短篇文章及理解问题'
  }
];

// 难度级别类型
type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

interface DifficultyOption {
  value: DifficultyLevel;
  label: string;
  description: string;
}

// 难度级别选项
const difficultyOptions: DifficultyOption[] = [
  { 
    value: 'beginner', 
    label: '初级', 
    description: '基础词汇和简单句型，适合入门学习者'
  },
  { 
    value: 'intermediate', 
    label: '中级', 
    description: '常见词汇和基本复合句，适合有一定基础的学习者'
  },
  { 
    value: 'advanced', 
    label: '高级', 
    description: '丰富词汇和复杂句型，适合进阶学习者'
  },
  { 
    value: 'expert', 
    label: '专家', 
    description: '专业词汇和高级语言结构，适合深入学习者'
  }
];

// 生成的内容接口
interface GeneratedContent {
  text: string;
  timestamp: Date;
  topic: string;
  contentType: ContentType;
  difficulty: DifficultyLevel;
}

// 组件属性接口
interface AIContentGeneratorProps {
  onSaveContent?: (content: GeneratedContent) => void;
  initialTopic?: string;
  initialContentType?: ContentType;
  initialDifficulty?: DifficultyLevel;
}

/**
 * AI内容生成器组件
 * 使用OpenAI服务生成各类英语学习内容
 */
const AIContentGenerator: React.FC<AIContentGeneratorProps> = ({
  onSaveContent,
  initialTopic = '',
  initialContentType = 'practice',
  initialDifficulty = 'intermediate'
}) => {
  // 本地化
  const { translate, currentLanguage } = useLocalization();
  
  // 状态
  const [topic, setTopic] = useState(initialTopic);
  const [customTopic, setCustomTopic] = useState('');
  const [contentType, setContentType] = useState<ContentType>(initialContentType);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(initialDifficulty);
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [savedContents, setSavedContents] = useState<GeneratedContent[]>([]);
  const [apiKey, setApiKey] = useState<string>('');
  
  // OpenAI服务实例
  const openAIService = new OpenAIService({ apiKey });
  
  // 处理主题变更
  const handleTopicChange = (event: SelectChangeEvent) => {
    setTopic(event.target.value);
    if (event.target.value !== 'custom') {
      setCustomTopic('');
    }
  };
  
  // 处理自定义主题变更
  const handleCustomTopicChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCustomTopic(event.target.value);
  };
  
  // 处理内容类型变更
  const handleContentTypeChange = (event: SelectChangeEvent) => {
    setContentType(event.target.value as ContentType);
  };
  
  // 处理难度级别变更
  const handleDifficultyChange = (event: SelectChangeEvent) => {
    setDifficulty(event.target.value as DifficultyLevel);
  };
  
  // 处理API密钥变更
  const handleApiKeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(event.target.value);
    // 将API密钥保存到本地存储
    localStorage.setItem('openai_api_key', event.target.value);
  };
  
  // 生成内容
  const generateContent = async () => {
    // 验证输入
    const currentTopic = topic === 'custom' ? customTopic : 
      topicOptions.find(t => t.value === topic)?.label || '';
    
    if (!currentTopic) {
      setError('请选择或输入主题');
      return;
    }
    
    if (!apiKey) {
      setError('请输入OpenAI API密钥');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // 根据内容类型构建不同的提示
      let prompt = '';
      
      switch (contentType) {
        case 'practice':
          // 使用OpenAI服务生成练习内容
          const practiceResponse = await openAIService.generatePracticeContent(
            currentTopic,
            difficulty,
            currentLanguage === 'en' ? 'English' : '中文'
          );
          setGeneratedContent(practiceResponse.text);
          break;
          
        case 'dialogue':
          prompt = `创建一个关于"${currentTopic}"的英语对话场景。难度为${
            difficultyOptions.find(d => d.value === difficulty)?.label
          }。包含2-3个人物的对话，并提供关键表达解释和文化背景注释。`;
          
          // 这里实现对话生成逻辑
          // ... 实现代码 ...
          break;
          
        case 'vocabulary':
          prompt = `创建一个关于"${currentTopic}"的词汇列表。难度为${
            difficultyOptions.find(d => d.value === difficulty)?.label
          }。包含15-20个核心词汇，每个词配有发音指南、例句和使用提示。`;
          
          // 这里实现词汇列表生成逻辑
          // ... 实现代码 ...
          break;
          
        case 'reading':
          prompt = `创建一篇关于"${currentTopic}"的短文阅读材料。难度为${
            difficultyOptions.find(d => d.value === difficulty)?.label
          }。包含300-500字的文章，以及5个理解性问题和1个讨论性问题。`;
          
          // 这里实现阅读材料生成逻辑
          // ... 实现代码 ...
          break;
      }
      
      // 如果没有使用特定服务方法，则使用通用请求
      if (!generatedContent && prompt) {
        const messages: ChatMessage[] = [
          { 
            role: 'system', 
            content: `你是一位专业的英语教育内容创作者，精通创建各类英语学习材料。请用${
              currentLanguage === 'en' ? 'English' : '中文'
            }回答。`
          },
          { role: 'user', content: prompt }
        ];
        
        const response = await openAIService.createChatCompletion(messages);
        setGeneratedContent(response.text);
      }
    } catch (err) {
      console.error('Error generating content:', err);
      setError(`生成内容失败: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  // 保存生成的内容
  const saveContent = () => {
    if (!generatedContent) return;
    
    const currentTopic = topic === 'custom' ? customTopic : 
      topicOptions.find(t => t.value === topic)?.label || '';
    
    const newContent: GeneratedContent = {
      text: generatedContent,
      timestamp: new Date(),
      topic: currentTopic,
      contentType,
      difficulty
    };
    
    // 更新本地保存的内容
    const updatedContents = [...savedContents, newContent];
    setSavedContents(updatedContents);
    
    // 将内容保存到本地存储
    localStorage.setItem('saved_ai_contents', JSON.stringify(updatedContents));
    
    // 如果提供了回调，则调用
    if (onSaveContent) {
      onSaveContent(newContent);
    }
  };
  
  // 复制到剪贴板
  const copyToClipboard = () => {
    if (!generatedContent) return;
    
    navigator.clipboard.writeText(generatedContent)
      .then(() => {
        alert('内容已复制到剪贴板');
      })
      .catch(err => {
        console.error('无法复制文本: ', err);
      });
  };
  
  // 加载保存的内容
  useEffect(() => {
    // 从本地存储加载API密钥
    const storedApiKey = localStorage.getItem('openai_api_key');
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
    
    // 从本地存储加载保存的内容
    const storedContents = localStorage.getItem('saved_ai_contents');
    if (storedContents) {
      try {
        setSavedContents(JSON.parse(storedContents));
      } catch (err) {
        console.error('Error parsing saved contents:', err);
      }
    }
  }, []);
  
  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 3 }}>
          AI内容生成器
        </Typography>
        
        <Box sx={{ mb: 3 }}>
          <Accordion 
            expanded={showAdvancedSettings}
            onChange={() => setShowAdvancedSettings(!showAdvancedSettings)}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <SettingsIcon sx={{ mr: 1 }} />
                <Typography>高级设置</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <TextField
                fullWidth
                label="OpenAI API密钥"
                type="password"
                value={apiKey}
                onChange={handleApiKeyChange}
                variant="outlined"
                margin="normal"
                helperText="请输入您的OpenAI API密钥以启用内容生成功能"
              />
            </AccordionDetails>
          </Accordion>
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <FormControl fullWidth variant="outlined" margin="normal">
            <InputLabel>主题</InputLabel>
            <Select
              value={topic}
              onChange={handleTopicChange}
              label="主题"
            >
              <MenuItem value="">
                <em>请选择一个主题</em>
              </MenuItem>
              {topicOptions.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
              <MenuItem value="custom">自定义主题</MenuItem>
            </Select>
          </FormControl>
          
          {topic === 'custom' && (
            <TextField
              fullWidth
              label="自定义主题"
              value={customTopic}
              onChange={handleCustomTopicChange}
              variant="outlined"
              margin="normal"
              placeholder="请输入您想要的主题"
            />
          )}
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <FormControl fullWidth variant="outlined" margin="normal">
            <InputLabel>内容类型</InputLabel>
            <Select
              value={contentType}
              onChange={handleContentTypeChange}
              label="内容类型"
            >
              {contentTypeOptions.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  <Box>
                    <Typography>{option.label}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      {option.description}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <FormControl fullWidth variant="outlined" margin="normal">
            <InputLabel>难度级别</InputLabel>
            <Select
              value={difficulty}
              onChange={handleDifficultyChange}
              label="难度级别"
            >
              {difficultyOptions.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  <Box>
                    <Typography>{option.label}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      {option.description}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        
        <Button
          variant="contained"
          color="primary"
          onClick={generateContent}
          disabled={isLoading || !apiKey}
          fullWidth
          sx={{ py: 1.5 }}
          startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <AutorenewIcon />}
        >
          {isLoading ? '生成中...' : '生成内容'}
        </Button>
        
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Paper>
      
      {generatedContent && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">生成的内容</Typography>
              <Box>
                <Button
                  size="small"
                  startIcon={<ContentCopyIcon />}
                  onClick={copyToClipboard}
                  sx={{ mr: 1 }}
                >
                  复制
                </Button>
                <Button
                  size="small"
                  startIcon={<BookmarkIcon />}
                  onClick={saveContent}
                  variant="contained"
                  color="secondary"
                >
                  保存
                </Button>
              </Box>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ whiteSpace: 'pre-line' }}>
              {generatedContent}
            </Box>
          </CardContent>
        </Card>
      )}
      
      {savedContents.length > 0 && (
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>
            已保存的内容
          </Typography>
          <Stack spacing={2}>
            {savedContents.map((content, index) => (
              <Accordion key={index}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <Typography>{content.topic}</Typography>
                    <Box>
                      <Chip 
                        size="small" 
                        label={contentTypeOptions.find(t => t.value === content.contentType)?.label} 
                        sx={{ mr: 1 }} 
                      />
                      <Chip 
                        size="small" 
                        label={difficultyOptions.find(d => d.value === content.difficulty)?.label} 
                      />
                    </Box>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="caption" color="textSecondary" sx={{ mb: 1, display: 'block' }}>
                    保存时间: {new Date(content.timestamp).toLocaleString()}
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ whiteSpace: 'pre-line' }}>
                    {content.text}
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default AIContentGenerator; 