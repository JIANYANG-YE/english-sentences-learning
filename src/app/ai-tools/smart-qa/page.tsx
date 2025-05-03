import React from 'react';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Paper,
  Divider,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import SmartQA from '@/components/ai/SmartQA';
import BookOutlinedIcon from '@mui/icons-material/BookOutlined';
import PsychologyIcon from '@mui/icons-material/Psychology';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LanguageIcon from '@mui/icons-material/Language';

// 智能问答页面
export default function SmartQAPage() {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box mb={4}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          智能英语问答系统
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          基于AI的智能问答系统，解答您在英语学习过程中遇到的各类疑问
        </Typography>
      </Box>
      
      {/* 主体内容：智能问答组件 */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 2, 
              height: '100%',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2
            }}
          >
            <SmartQA 
              category="general"
              initialQuestion=""
            />
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 2, 
              height: '100%',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2
            }}
          >
            <Typography variant="h6" gutterBottom>
              专业领域问答
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              选择不同的学习领域，获取针对性解答
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Grid container spacing={2}>
                {[
                  { 
                    title: '语法问答', 
                    icon: <BookOutlinedIcon color="primary" />, 
                    description: '解答语法规则、时态用法等问题' 
                  },
                  { 
                    title: '词汇问答', 
                    icon: <PsychologyIcon color="primary" />, 
                    description: '解答词汇含义、用法区别等问题' 
                  },
                  { 
                    title: '口语问答', 
                    icon: <HelpOutlineIcon color="primary" />,
                    description: '解答发音、口语表达等问题' 
                  },
                  { 
                    title: '写作问答', 
                    icon: <ContentCopyIcon color="primary" />,
                    description: '解答写作结构、表达方式等问题' 
                  }
                ].map((item, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Card 
                      variant="outlined" 
                      sx={{ 
                        height: '100%',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        '&:hover': {
                          boxShadow: 2,
                          transform: 'translateY(-2px)'
                        }
                      }}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          {item.icon}
                          <Typography variant="subtitle1" sx={{ ml: 1 }}>
                            {item.title}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {item.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
            
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="h6" gutterBottom>
              使用技巧
            </Typography>
            <Box component="ul" sx={{ pl: 2 }}>
              <Box component="li" sx={{ mb: 1 }}>
                <Typography variant="body2">
                  提问时尽量具体，清晰描述您的问题
                </Typography>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Typography variant="body2">
                  可以提供相关上下文，帮助AI更好理解您的问题
                </Typography>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Typography variant="body2">
                  对于复杂问题，可以分步骤提问
                </Typography>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Typography variant="body2">
                  收藏有用的回答，方便日后查阅
                </Typography>
              </Box>
              <Box component="li">
                <Typography variant="body2">
                  点击相关资源链接获取更多学习材料
                </Typography>
              </Box>
            </Box>
            
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="h6" gutterBottom>
              相关学习资源
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Card variant="outlined" sx={{ mb: 2 }}>
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LanguageIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="body2" fontWeight="medium">
                      英语学习资源库
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
              <Card variant="outlined" sx={{ mb: 2 }}>
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <BookOutlinedIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="body2" fontWeight="medium">
                      英语语法指南
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
              <Card variant="outlined">
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PsychologyIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="body2" fontWeight="medium">
                      常见词汇辨析
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
} 