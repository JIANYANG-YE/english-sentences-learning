import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Grid as MuiGrid,
  Card,
  CardContent,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import WritingAssistant from '@/components/ai/WritingAssistant';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import StarIcon from '@mui/icons-material/Star';
import FeaturedPlayListIcon from '@mui/icons-material/FeaturedPlayList';
import EmailIcon from '@mui/icons-material/Email';
import DescriptionIcon from '@mui/icons-material/Description';
import SchoolIcon from '@mui/icons-material/School';

// 写作助手页面
export default function WritingAssistantPage() {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box mb={4}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          AI写作助手
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          智能辅助英语写作，提供表达建议，帮助您创作更专业、更流畅的英语内容
        </Typography>
        <Chip 
          label="Beta版本" 
          color="primary" 
          size="small" 
          sx={{ mt: 1 }}
        />
      </Box>
      
      {/* 写作助手主界面 */}
      <Paper 
        elevation={0}
        sx={{ 
          p: 2, 
          mb: 4, 
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          minHeight: '70vh'
        }}
      >
        <WritingAssistant 
          initialText="Start writing here to get AI-powered writing suggestions. The assistant will analyze your text and provide recommendations to improve your grammar, vocabulary, style, and structure."
        />
      </Paper>
      
      {/* 功能特点 */}
      <Typography variant="h5" gutterBottom fontWeight="medium">
        功能特点
      </Typography>
      <Divider sx={{ mb: 3 }} />
      
      <MuiGrid container spacing={3} sx={{ mb: 6 }}>
        {[
          {
            title: "实时写作建议",
            description: "在您输入文本时，AI会分析您的写作并提供即时建议，包括语法修正、词汇替换和表达优化。",
            icon: <BorderColorIcon fontSize="large" color="primary" />
          },
          {
            title: "多种写作风格",
            description: "根据您的需求选择不同的写作风格，如学术、商务、日常交流或创意写作，AI会根据所选风格提供相应建议。",
            icon: <MenuBookIcon fontSize="large" color="primary" />
          },
          {
            title: "段落结构建议",
            description: "分析您的段落结构，建议如何组织思想，使文章更具逻辑性和连贯性，增强可读性。",
            icon: <FormatListBulletedIcon fontSize="large" color="primary" />
          },
          {
            title: "创意表达灵感",
            description: "当您遇到表达困难时，AI会提供多种表达方式和创意建议，帮助您突破写作瓶颈。",
            icon: <LightbulbIcon fontSize="large" color="primary" />
          }
        ].map((feature, index) => (
          <MuiGrid item xs={12} sm={6} key={index}>
            <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  {feature.icon}
                  <Typography variant="h6" component="h2" ml={1}>
                    {feature.title}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          </MuiGrid>
        ))}
      </MuiGrid>
      
      {/* 使用场景 */}
      <Typography variant="h5" gutterBottom fontWeight="medium">
        适用场景
      </Typography>
      <Divider sx={{ mb: 3 }} />
      
      <Box mb={4}>
        <MuiGrid container spacing={2}>
          {[
            { text: "学术论文与作业", icon: <SchoolIcon color="primary" /> },
            { text: "商务邮件与报告", icon: <EmailIcon color="primary" /> },
            { text: "求职简历与求职信", icon: <DescriptionIcon color="primary" /> },
            { text: "创意写作与故事", icon: <MenuBookIcon color="primary" /> },
            { text: "日常交流与社交媒体", icon: <FeaturedPlayListIcon color="primary" /> },
            { text: "演讲稿与报告", icon: <StarIcon color="primary" /> }
          ].map((scenario, index) => (
            <MuiGrid item xs={12} sm={6} md={4} key={index}>
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  p: 2,
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'divider',
                  '&:hover': { 
                    bgcolor: 'action.hover',
                    transform: 'translateY(-2px)',
                    transition: 'transform 0.2s'
                  }
                }}
              >
                <Box sx={{ mr: 2 }}>
                  {scenario.icon}
                </Box>
                <Typography variant="body1">
                  {scenario.text}
                </Typography>
              </Box>
            </MuiGrid>
          ))}
        </MuiGrid>
      </Box>
      
      {/* 常见问题 */}
      <Typography variant="h5" gutterBottom fontWeight="medium">
        常见问题
      </Typography>
      <Divider sx={{ mb: 3 }} />
      
      <Box mb={4}>
        <List>
          {[
            {
              question: "写作助手支持哪些类型的文档？",
              answer: "写作助手支持各种类型的文档，包括学术论文、商务文档、个人创作等。无论您是学生、职场人士还是普通用户，都能从中受益。"
            },
            {
              question: "写作助手能完全替代人工修改吗？",
              answer: "不能。虽然写作助手能提供有价值的建议，但它仍是一个辅助工具。最终的写作决策应由您做出，特别是对于需要个人风格和创意的内容。"
            },
            {
              question: "系统会存储我的文档吗？",
              answer: "为了保护您的隐私，系统默认不会永久存储您的文档。您可以选择保存特定的文档以便日后继续编辑，但这需要您的明确授权。"
            },
            {
              question: "如何获得更好的写作建议？",
              answer: "提供更多上下文和写作目的信息，选择正确的写作风格，并在反馈区告诉我们建议是否有帮助，系统会逐渐学习您的偏好。"
            }
          ].map((item, index) => (
            <React.Fragment key={index}>
              <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                <ListItemText
                  primary={<Typography variant="subtitle1" fontWeight="bold">{item.question}</Typography>}
                  secondary={
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      {item.answer}
                    </Typography>
                  }
                />
              </ListItem>
              {index < 3 && <Divider component="li" />}
            </React.Fragment>
          ))}
        </List>
      </Box>
    </Container>
  );
} 