import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import VocabularyHelper from '@/components/ai/VocabularyHelper';
import SchoolIcon from '@mui/icons-material/School';
import MemoryIcon from '@mui/icons-material/Memory';
import SpeedIcon from '@mui/icons-material/Speed';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import PsychologyIcon from '@mui/icons-material/Psychology';
import TranslateIcon from '@mui/icons-material/Translate';
import ReviewsIcon from '@mui/icons-material/Reviews';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';

// 词汇学习辅助工具页面
export default function VocabularyHelperPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box mb={4}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          智能词汇学习辅助
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          利用AI辅助记忆和掌握英语词汇，实现高效学习和长期记忆
        </Typography>
        <Chip 
          label="新功能" 
          color="success" 
          size="small" 
          sx={{ mt: 1 }}
        />
      </Box>
      
      {/* 主要功能区 */}
      <Paper 
        elevation={0}
        sx={{ 
          p: 2, 
          mb: 4, 
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          overflow: 'hidden'
        }}
      >
        <VocabularyHelper />
      </Paper>
      
      {/* 功能特点 */}
      <Typography variant="h5" gutterBottom fontWeight="medium">
        功能特点
      </Typography>
      <Divider sx={{ mb: 3 }} />
      
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {[
          {
            title: "智能记忆曲线",
            description: "基于艾宾浩斯遗忘曲线和您的个人学习情况，系统自动安排最佳复习时间，确保高效记忆。",
            icon: <MemoryIcon fontSize="large" color="primary" />
          },
          {
            title: "上下文学习",
            description: "通过真实例句和场景学习词汇，帮助理解单词在不同语境中的用法，提高应用能力。",
            icon: <TranslateIcon fontSize="large" color="primary" />
          },
          {
            title: "个性化难度调整",
            description: "根据您的学习进度和掌握程度，智能调整词汇难度和学习计划，保持适当的学习挑战。",
            icon: <SpeedIcon fontSize="large" color="primary" />
          },
          {
            title: "多元化记忆方法",
            description: "结合听觉、视觉和情境记忆等多种记忆方法，针对不同类型的词汇提供最适合的记忆策略。",
            icon: <PsychologyIcon fontSize="large" color="primary" />
          }
        ].map((feature, index) => (
          <Grid item xs={12} sm={6} key={index}>
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
          </Grid>
        ))}
      </Grid>
      
      {/* 学习方式 */}
      <Typography variant="h5" gutterBottom fontWeight="medium">
        多元学习方式
      </Typography>
      <Divider sx={{ mb: 3 }} />
      
      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid item xs={12} md={6}>
          <Paper variant="outlined" sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center' }}>
              <SchoolIcon sx={{ mr: 1 }} /> 词汇学习模式
            </Typography>
            <Typography variant="body2" paragraph>
              针对新词汇的系统化学习流程，包括：
            </Typography>
            <List>
              {[
                "单词发音与拼写练习",
                "多维度释义理解与记忆",
                "真实语境中的例句学习",
                "词根词缀分析与联想记忆",
                "同反义词辨析与扩展"
              ].map((item, index) => (
                <ListItem key={index} sx={{ py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Chip size="small" label={index + 1} />
                  </ListItemIcon>
                  <ListItemText primary={item} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper variant="outlined" sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom color="secondary" sx={{ display: 'flex', alignItems: 'center' }}>
              <ReviewsIcon sx={{ mr: 1 }} /> 词汇复习模式
            </Typography>
            <Typography variant="body2" paragraph>
              科学安排的复习计划，巩固长期记忆：
            </Typography>
            <List>
              {[
                "智能间隔重复复习提醒",
                "多样化测试形式（选择、拼写、应用）",
                "难度自适应的挑战模式",
                "弱点词汇重点强化",
                "学习进度数据分析与反馈"
              ].map((item, index) => (
                <ListItem key={index} sx={{ py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Chip size="small" label={index + 1} color="secondary" />
                  </ListItemIcon>
                  <ListItemText primary={item} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
      
      {/* 学习建议 */}
      <Typography variant="h5" gutterBottom fontWeight="medium">
        高效词汇学习建议
      </Typography>
      <Divider sx={{ mb: 3 }} />
      
      <Paper sx={{ p: 3, mb: 6, bgcolor: 'background.default', borderRadius: 2 }}>
        <List>
          {[
            {
              title: "每日学习计划",
              description: "建立规律的学习习惯，每天学习10-15个新词汇，并复习之前学过的词汇。固定的学习时间和适量的学习内容是成功的关键。",
              icon: <FormatListBulletedIcon color="primary" />
            },
            {
              title: "多感官记忆法",
              description: "同时调动视觉、听觉和书写等多种感官参与记忆过程。看到单词时，大声朗读并手写几遍，能显著提高记忆效果。",
              icon: <TipsAndUpdatesIcon color="primary" />
            },
            {
              title: "情境化学习",
              description: "将词汇放在真实语境中学习，如阅读文章、观看视频或进行对话。理解单词在实际使用中的意义和用法，而不仅仅是死记硬背。",
              icon: <TranslateIcon color="primary" />
            },
            {
              title: "联想记忆法",
              description: "将新词汇与已知信息建立联系，如通过词根词缀分析、同义词关联、创建心理图像或编造记忆故事等方式增强记忆。",
              icon: <PsychologyIcon color="primary" />
            }
          ].map((tip, index) => (
            <React.Fragment key={index}>
              <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                <ListItemIcon>
                  {tip.icon}
                </ListItemIcon>
                <ListItemText
                  primary={<Typography variant="subtitle1" fontWeight="bold">{tip.title}</Typography>}
                  secondary={
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      {tip.description}
                    </Typography>
                  }
                />
              </ListItem>
              {index < 3 && <Divider component="li" />}
            </React.Fragment>
          ))}
        </List>
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
              question: "如何创建自定义词汇学习集？",
              answer: "在工具主界面，点击"学习集"标签，然后选择"创建新学习集"。您可以手动添加词汇，或从预设的主题词库中导入，也可以通过上传文本文件批量导入词汇。"
            },
            {
              question: "如何根据自己的英语水平选择合适的词汇？",
              answer: "系统提供从基础到高级的词汇分级，您可以根据自我评估选择起点。使用过程中，系统会根据您的学习表现自动调整推荐词汇的难度级别。"
            },
            {
              question: "词汇学习和复习的最佳频率是什么？",
              answer: "根据记忆理论，新词汇应在学习后的1天、3天、7天、14天和30天进行复习。我们的系统会根据您的实际掌握情况动态调整这个频率，您只需按照系统的提醒进行学习和复习即可。"
            },
            {
              question: "如何将学到的词汇应用到实际中？",
              answer: "我们建议结合阅读和写作练习来应用新词汇。每学习5-10个新词后，尝试用它们造句或写一段短文。系统也提供情境对话练习，帮助您在真实场景中应用所学词汇。"
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