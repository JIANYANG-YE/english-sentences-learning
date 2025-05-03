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
  ListItemText
} from '@mui/material';
import TranslateIcon from '@mui/icons-material/Translate';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import PsychologyIcon from '@mui/icons-material/Psychology';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';

// 智能翻译页面（即将推出）
export default function SmartTranslatePage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box mb={4}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          AI智能翻译
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          理解语言背景与语境的智能翻译工具，为您提供准确、自然的双语翻译服务
        </Typography>
      </Box>
      
      {/* 即将推出通知 */}
      <Paper 
        sx={{ 
          p: 3, 
          mb: 4, 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' }, 
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(45deg, #E8F8F5 30%, #D1F2EB 90%)',
          border: '1px solid #A3E4D7'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 2, md: 0 } }}>
          <NotificationsActiveIcon sx={{ fontSize: 40, color: 'info.main', mr: 2 }} />
          <Box>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              功能即将推出
            </Typography>
            <Typography variant="body1">
              我们正在努力开发这项功能，预计将在2023年7月发布。
            </Typography>
          </Box>
        </Box>
        
        <Button 
          variant="contained"
          color="info"
          endIcon={<ArrowForwardIcon />}
          sx={{ 
            fontWeight: 'bold',
            px: 3,
            boxShadow: 2 
          }}
        >
          接收上线通知
        </Button>
      </Paper>
      
      {/* 功能预览 */}
      <Typography variant="h5" gutterBottom fontWeight="medium">
        即将推出的功能
      </Typography>
      <Divider sx={{ mb: 3 }} />
      
      <MuiGrid container spacing={3} sx={{ mb: 4 }}>
        {[
          {
            title: "上下文感知翻译",
            description: "不仅翻译单词和句子，还理解整段文本的上下文，提供更准确、更符合语境的翻译结果。",
            icon: <PsychologyIcon fontSize="large" color="info" />
          },
          {
            title: "语言学习解析",
            description: "每次翻译都是学习机会。系统会解析翻译内容，说明关键语法结构、词汇用法和习惯表达的差异。",
            icon: <LocalLibraryIcon fontSize="large" color="info" />
          },
          {
            title: "多样化表达选项",
            description: "为同一内容提供多种翻译选项，从正式到口语，从直译到意译，帮助您选择最合适的表达方式。",
            icon: <AutoAwesomeIcon fontSize="large" color="info" />
          },
          {
            title: "专业领域适应",
            description: "针对商务、技术、医学、法律等专业领域优化翻译，确保专业术语的准确性和一致性。",
            icon: <HistoryEduIcon fontSize="large" color="info" />
          }
        ].map((feature, index) => (
          <MuiGrid item xs={12} sm={6} key={index}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
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
      
      {/* 翻译质量对比 */}
      <Typography variant="h5" gutterBottom fontWeight="medium">
        翻译质量对比
      </Typography>
      <Divider sx={{ mb: 3 }} />
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          比较：普通翻译 vs. 智能翻译
        </Typography>
        
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" gutterBottom fontWeight="medium">
            原文：
          </Typography>
          <Typography variant="body1" paragraph sx={{ px: 2 }}>
            "The new policy will go into effect next month, but we're still ironing out some of the details."
          </Typography>
          
          <MuiGrid container spacing={2}>
            <MuiGrid item xs={12} md={6}>
              <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    普通翻译
                  </Typography>
                </Box>
                <Typography variant="body1">
                  "新政策将在下个月生效，但我们仍在熨烫一些细节。"
                </Typography>
                <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1 }}>
                  ✗ 直译词组，不符合中文表达习惯
                </Typography>
              </Box>
            </MuiGrid>
            
            <MuiGrid item xs={12} md={6}>
              <Box sx={{ p: 2, bgcolor: 'info.light', color: 'info.contrastText', borderRadius: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle2">
                    AI智能翻译 (预览)
                  </Typography>
                </Box>
                <Typography variant="body1">
                  "新政策将于下个月开始实施，但我们仍在完善一些细节。"
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
                  ✓ 理解习语表达，转换为自然中文
                </Typography>
              </Box>
            </MuiGrid>
          </MuiGrid>
        </Box>
      </Paper>
      
      {/* 使用场景 */}
      <Typography variant="h5" gutterBottom fontWeight="medium">
        使用场景
      </Typography>
      <Divider sx={{ mb: 3 }} />
      
      <MuiGrid container spacing={3} sx={{ mb: 4 }}>
        {[
          {
            title: "学习辅助",
            description: "将英语学习材料翻译为中文，帮助理解内容；或将中文翻译为英语，检查表达是否准确。"
          },
          {
            title: "商务沟通",
            description: "翻译商务邮件、报告和合同，确保专业且准确的跨语言沟通。"
          },
          {
            title: "旅行交流",
            description: "翻译旅行中需要的各种表达，包括问路、订房、用餐和购物等日常对话。"
          },
          {
            title: "内容创作",
            description: "辅助双语内容创作，确保两种语言的表达都自然流畅，符合各自的语言习惯。"
          }
        ].map((scenario, index) => (
          <MuiGrid item xs={12} sm={6} key={index}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {scenario.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {scenario.description}
                </Typography>
              </CardContent>
            </Card>
          </MuiGrid>
        ))}
      </MuiGrid>
      
      {/* 加入等待列表 */}
      <Paper 
        sx={{ 
          p: 3, 
          mb: 4, 
          textAlign: 'center',
          background: 'linear-gradient(45deg, #F8F9F9 30%, #F4F6F7 90%)',
          border: '1px solid #E5E7E9'
        }}
      >
        <Typography variant="h6" gutterBottom>
          想要提前体验智能翻译功能？
        </Typography>
        <Typography variant="body1" paragraph>
          加入我们的测试用户等待列表，有机会提前体验并影响产品开发方向。
        </Typography>
        <Button 
          variant="contained"
          color="info"
          endIcon={<AccessTimeIcon />}
          sx={{ px: 4 }}
        >
          加入等待列表
        </Button>
      </Paper>
      
      {/* 常见问题 */}
      <Typography variant="h5" gutterBottom fontWeight="medium">
        常见问题
      </Typography>
      <Divider sx={{ mb: 3 }} />
      
      <Box mb={4}>
        <List>
          {[
            {
              question: "AI智能翻译与普通翻译工具有什么区别？",
              answer: "AI智能翻译不仅关注单词和句子的直接转换，还理解文本的上下文、语境和目标语言的表达习惯，提供更自然、更准确的翻译结果。此外，它还提供语言学习解析，帮助用户理解两种语言之间的差异。"
            },
            {
              question: "翻译功能支持哪些语言？",
              answer: "初期版本将支持中英互译，后续会陆续增加更多语言对，包括日语、韩语、法语、西班牙语等。"
            },
            {
              question: "能否翻译专业领域的内容？",
              answer: "是的，我们的AI翻译系统针对商务、技术、医学、法律等专业领域进行了优化，能够准确翻译各领域的专业术语和表达方式。"
            },
            {
              question: "翻译结果会保存吗？",
              answer: "系统默认不会永久存储您的翻译内容。您可以选择保存特定的翻译结果以便日后查阅，但这需要您的明确授权。我们非常重视用户隐私和数据安全。"
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