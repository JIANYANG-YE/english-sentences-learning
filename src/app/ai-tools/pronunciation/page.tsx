import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Card,
  CardContent,
  Grid as MuiGrid,
  Divider,
  Chip
} from '@mui/material';
import PronunciationCoach from '@/components/ai/PronunciationCoach';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import MicIcon from '@mui/icons-material/Mic';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import AssignmentIcon from '@mui/icons-material/Assignment';
import TimerIcon from '@mui/icons-material/Timer';

// 发音教练页面
export default function PronunciationCoachPage() {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box mb={4}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          AI发音教练
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          通过智能语音评估，获得专业发音反馈，提升英语口语准确度和流利度
        </Typography>
      </Box>
      
      {/* 主要内容区域 */}
      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
        {/* 左侧边栏 - 练习指南 */}
        <Box sx={{ width: { xs: '100%', md: 280 } }}>
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <AssignmentIcon color="secondary" sx={{ mr: 1 }} />
                <Typography variant="h6">练习指南</Typography>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" paragraph>
                  有效的发音练习能帮助你掌握英语的音素、重音和语调，提高交流清晰度。
                </Typography>
                
                <Box sx={{ my: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    练习步骤：
                  </Typography>
                  <Box component="ol" sx={{ pl: 2, m: 0 }}>
                    <Box component="li" sx={{ mb: 1 }}>
                      <Typography variant="body2">
                        选择练习句子或输入自定义文本
                      </Typography>
                    </Box>
                    <Box component="li" sx={{ mb: 1 }}>
                      <Typography variant="body2">
                        点击麦克风按钮开始录音
                      </Typography>
                    </Box>
                    <Box component="li" sx={{ mb: 1 }}>
                      <Typography variant="body2">
                        清晰地朗读文本内容
                      </Typography>
                    </Box>
                    <Box component="li">
                      <Typography variant="body2">
                        查看评估结果，关注需要改进的地方
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="subtitle2" gutterBottom>
                  建议练习模式:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                  <Chip 
                    icon={<MicIcon fontSize="small" />}
                    label="跟读模式" 
                    size="small" 
                    color="secondary" 
                  />
                  <Chip 
                    icon={<VolumeUpIcon fontSize="small" />}
                    label="自由朗读" 
                    size="small" 
                    variant="outlined" 
                  />
                  <Chip 
                    icon={<TimerIcon fontSize="small" />}
                    label="限时练习" 
                    size="small" 
                    variant="outlined" 
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
          
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle2" gutterBottom>
                热门练习句子
              </Typography>
              
              {[
                { text: "How are you doing today?", level: "初级", topic: "日常对话" },
                { text: "Could you please repeat that?", level: "初级", topic: "请求" },
                { text: "I'm considering applying for a new job.", level: "中级", topic: "工作" },
                { text: "The weather forecast predicts thunderstorms tomorrow.", level: "中级", topic: "天气" },
                { text: "She emphasized the importance of pronunciation in effective communication.", level: "高级", topic: "学习" }
              ].map((sentence, index) => (
                <Box 
                  key={index}
                  sx={{ 
                    p: 1.5, 
                    borderRadius: 1,
                    mb: 1,
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'action.hover' },
                    borderLeft: index === 0 ? 3 : 0,
                    borderColor: 'secondary.main',
                    bgcolor: index === 0 ? 'action.selected' : 'transparent'
                  }}
                >
                  <Typography variant="body2" gutterBottom>
                    {sentence.text}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Chip size="small" label={sentence.level} variant="outlined" />
                    <Chip size="small" label={sentence.topic} variant="outlined" />
                  </Box>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Box>
        
        {/* 主要练习区域 */}
        <Box sx={{ flexGrow: 1 }}>
          <Paper 
            elevation={0} 
            variant="outlined"
            sx={{ 
              height: { xs: 'calc(100vh - 250px)', md: 'calc(100vh - 200px)' },
              minHeight: 500,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <PronunciationCoach 
              initialText="The quick brown fox jumps over the lazy dog."
              userLevel="intermediate"
            />
          </Paper>
        </Box>
      </Box>
      
      {/* 底部提示区域 */}
      <Box mt={4}>
        <Typography variant="h6" gutterBottom>
          发音技巧
        </Typography>
        <MuiGrid container spacing={2}>
          {[
            { 
              title: "元音清晰度", 
              content: "英语有20个元音音素，比汉语多，练习时注意口型和舌位的准确，尤其是长短元音的区分。", 
              type: "技巧"
            },
            { 
              title: "连读规则", 
              content: "当一个词以辅音结尾，下一个词以元音开头时，这两个词往往连读，形成流畅的语音。", 
              type: "规则" 
            },
            { 
              title: "重音位置", 
              content: "英语词汇和句子都有重音，重读音节发音更响亮、更长、更清晰，是英语节奏的基础。", 
              type: "技巧" 
            },
            { 
              title: "语调变化", 
              content: "英语句子有升调和降调，疑问句通常用升调，陈述句用降调，语调变化能传达说话者的态度和意图。", 
              type: "表达" 
            }
          ].map((tip, index) => (
            <MuiGrid item xs={12} sm={6} md={3} key={index}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="subtitle1" gutterBottom noWrap>
                      {tip.title}
                    </Typography>
                    <Chip size="small" label={tip.type} color="secondary" variant="outlined" />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {tip.content}
                  </Typography>
                </CardContent>
              </Card>
            </MuiGrid>
          ))}
        </MuiGrid>
      </Box>
    </Container>
  );
} 