import React from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Divider
} from '@mui/material';
import Link from 'next/link';
import SpellcheckIcon from '@mui/icons-material/Spellcheck';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import PsychologyIcon from '@mui/icons-material/Psychology';
import TranslateIcon from '@mui/icons-material/Translate';
import CreateIcon from '@mui/icons-material/Create';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import SchoolIcon from '@mui/icons-material/School';

// AI工具页面
export default function AIToolsPage() {
  // AI工具数据
  const aiTools = [
    {
      id: 'ai-tutor',
      title: 'AI导师',
      description: '由AI驱动的个人英语学习导师，为您提供专业指导和学习建议',
      icon: <PsychologyIcon fontSize="large" color="primary" />,
      link: '/ai-tools/tutor',
      isComingSoon: false
    },
    {
      id: 'learning-style',
      title: '学习风格分析',
      description: '分析您的学习风格偏好，提供个性化的学习策略和方法建议',
      icon: <SchoolIcon fontSize="large" color="primary" />,
      link: '/ai-tools/learning-style',
      isComingSoon: false,
      isNew: true
    },
    {
      id: 'grammar-check',
      title: '语法检查',
      description: '智能检测英语文本中的语法错误，提供修改建议和解释',
      icon: <SpellcheckIcon fontSize="large" color="primary" />,
      link: '/ai-tools/grammar',
      isComingSoon: false
    },
    {
      id: 'pronunciation-coach',
      title: '发音教练',
      description: '评估您的英语发音，提供针对性的改进建议和练习',
      icon: <RecordVoiceOverIcon fontSize="large" color="primary" />,
      link: '/ai-tools/pronunciation',
      isComingSoon: false
    },
    {
      id: 'vocabulary-helper',
      title: '词汇学习辅助',
      description: '智能词汇学习和记忆系统，基于科学记忆曲线提高词汇掌握效率',
      icon: <SchoolIcon fontSize="large" color="primary" />,
      link: '/ai-tools/vocabulary',
      isComingSoon: false,
      isNew: true
    },
    {
      id: 'smart-qa',
      title: '智能问答',
      description: '解答英语学习中遇到的各类问题，提供专业解释和相关资源',
      icon: <QuestionAnswerIcon fontSize="large" color="primary" />,
      link: '/ai-tools/smart-qa',
      isComingSoon: false
    },
    {
      id: 'writing-assistant',
      title: '写作助手',
      description: '帮助改进英语写作内容，提升表达质量，提供修改建议',
      icon: <CreateIcon fontSize="large" color="primary" />,
      link: '/ai-tools/writing',
      isComingSoon: false
    },
    {
      id: 'smart-translation',
      title: '智能翻译',
      description: '上下文感知的智能翻译工具，理解语境，提供准确翻译',
      icon: <TranslateIcon fontSize="large" color="primary" />,
      link: '/ai-tools/translation',
      isComingSoon: true
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box mb={4}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          AI学习工具
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          借助人工智能提升您的英语学习效率，获得个性化学习体验
        </Typography>
      </Box>
      
      <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -1.5 }}>
        {aiTools.map((tool) => (
          <Box 
            key={tool.id} 
            sx={{ 
              width: { xs: '100%', sm: '50%', md: '33.333%' }, 
              p: 1.5 
            }}
          >
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                position: 'relative',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 3
                }
              }}
            >
              {tool.isComingSoon && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    bgcolor: 'warning.main',
                    color: 'warning.contrastText',
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    fontSize: '0.75rem',
                    fontWeight: 'bold'
                  }}
                >
                  即将推出
                </Box>
              )}
              
              {tool.isNew && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    bgcolor: 'success.main',
                    color: 'success.contrastText',
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    fontSize: '0.75rem',
                    fontWeight: 'bold'
                  }}
                >
                  新功能
                </Box>
              )}
              
              <CardContent sx={{ p: 3, flexGrow: 1 }}>
                <Box 
                  sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    mb: 2
                  }}
                >
                  {tool.icon}
                  <Typography variant="h6" component="h2" ml={1}>
                    {tool.title}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {tool.description}
                </Typography>
              </CardContent>
              
              <CardActions sx={{ p: 2, pt: 0 }}>
                {tool.isComingSoon ? (
                  <Button 
                    size="small" 
                    color="primary" 
                    variant="outlined"
                    disabled
                    fullWidth
                  >
                    开发中
                  </Button>
                ) : (
                  <Button 
                    component={Link}
                    href={tool.link}
                    size="small" 
                    color="primary" 
                    variant="contained"
                    fullWidth
                  >
                    使用工具
                  </Button>
                )}
              </CardActions>
            </Card>
          </Box>
        ))}
      </Box>
      
      <Box mt={6}>
        <Divider sx={{ mb: 3 }} />
        <Typography variant="h5" gutterBottom fontWeight="medium">
          为什么选择AI学习工具？
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -2 }}>
          <Box sx={{ width: { xs: '100%', md: '33.333%' }, p: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              个性化学习体验
            </Typography>
            <Typography variant="body2" color="text.secondary">
              AI工具根据您的学习风格、能力和目标，提供量身定制的学习内容和建议，帮助您达到最佳学习效果。
            </Typography>
          </Box>
          <Box sx={{ width: { xs: '100%', md: '33.333%' }, p: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              即时反馈与指导
            </Typography>
            <Typography variant="body2" color="text.secondary">
              获得即时的错误纠正和改进建议，避免错误习惯的形成，加速学习进程，提升学习效率。
            </Typography>
          </Box>
          <Box sx={{ width: { xs: '100%', md: '33.333%' }, p: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              全天候学习支持
            </Typography>
            <Typography variant="body2" color="text.secondary">
              随时随地获得专业水平的学习指导，解决学习过程中遇到的各种问题，不受时间和地点的限制。
            </Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  );
} 