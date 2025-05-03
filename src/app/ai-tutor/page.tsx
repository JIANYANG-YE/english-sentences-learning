import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Tabs,
  Tab,
  Button,
  Divider,
  Chip,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import AITutor from '@/components/ai/AITutor';
import { 
  Psychology as PsychologyIcon,
  Settings as SettingsIcon, 
  History as HistoryIcon,
  Bookmark as BookmarkIcon,
  School as SchoolIcon
} from '@mui/icons-material';

// AI辅导页面
export default function AITutorPage() {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box mb={4}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          AI智能辅导助手
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          为你提供个性化语言学习指导，随时解答语法问题，优化你的表达
        </Typography>
      </Box>
      
      {/* 主要内容区域 */}
      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
        {/* 左侧边栏 - 功能区 */}
        <Box sx={{ width: { xs: '100%', md: 280 } }}>
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <SchoolIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">学习级别</Typography>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Chip 
                    label="初级" 
                    variant="outlined" 
                    onClick={() => {}} 
                    color="default"
                  />
                  <Chip 
                    label="中级" 
                    variant="filled" 
                    onClick={() => {}} 
                    color="primary"
                  />
                  <Chip 
                    label="高级" 
                    variant="outlined" 
                    onClick={() => {}} 
                    color="default"
                  />
                </Box>
                <Typography variant="caption" color="text.secondary">
                  当前学习级别: 中级 (B1-B2)
                </Typography>
              </Box>
              
              <Divider sx={{ mb: 2 }} />
              
              <Box mb={2}>
                <Typography variant="subtitle2" gutterBottom>
                  重点学习领域
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                  <Chip label="日常会话" size="small" color="primary" />
                  <Chip label="商务英语" size="small" variant="outlined" />
                  <Chip label="学术写作" size="small" variant="outlined" />
                  <Chip label="旅游英语" size="small" variant="outlined" />
                  <Chip label="考试准备" size="small" color="primary" />
                </Box>
              </Box>
              
              <Button 
                variant="outlined" 
                fullWidth 
                startIcon={<SettingsIcon />}
                size="small"
                sx={{ mt: 1 }}
              >
                调整辅导设置
              </Button>
            </CardContent>
          </Card>
          
          <Card variant="outlined">
            <Tabs
              value={0}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
            >
              <Tab icon={<HistoryIcon />} label="历史" />
              <Tab icon={<BookmarkIcon />} label="收藏" />
            </Tabs>
            
            <CardContent>
              <Typography variant="subtitle2" gutterBottom>
                最近会话
              </Typography>
              
              {[
                { title: "日常口语表达练习", date: "今天" },
                { title: "被动语态使用咨询", date: "昨天" },
                { title: "旅游英语对话练习", date: "3天前" }
              ].map((session, index) => (
                <Box 
                  key={index}
                  sx={{ 
                    p: 1.5, 
                    borderRadius: 1,
                    mb: 1,
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'action.hover' },
                    borderLeft: index === 0 ? 3 : 0,
                    borderColor: 'primary.main',
                    bgcolor: index === 0 ? 'action.selected' : 'transparent'
                  }}
                >
                  <Typography variant="body2" noWrap>
                    {session.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {session.date}
                  </Typography>
                </Box>
              ))}
              
              <Button 
                variant="text" 
                size="small" 
                fullWidth
                sx={{ mt: 1 }}
              >
                查看全部历史会话
              </Button>
            </CardContent>
          </Card>
        </Box>
        
        {/* 主要辅导区域 */}
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
            <AITutor 
              learningLevel="intermediate"
              focusArea={['日常会话', '考试准备']}
            />
          </Paper>
        </Box>
        
      </Box>
      
      {/* 底部推荐区域 */}
      <Box mt={4}>
        <Typography variant="h6" gutterBottom>
          推荐学习资源
        </Typography>
        <Grid container spacing={2}>
          {[
            { title: "商务英语必备表达100句", type: "课程", level: "中级" },
            { title: "英语语法精讲 - 动词时态", type: "视频", level: "初级/中级" },
            { title: "英语发音纠正实践", type: "练习", level: "全级别" },
            { title: "雅思口语提分技巧", type: "课程", level: "中级/高级" }
          ].map((resource, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom noWrap>
                    {resource.title}
                  </Typography>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Chip size="small" label={resource.type} />
                    <Typography variant="caption">{resource.level}</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
} 