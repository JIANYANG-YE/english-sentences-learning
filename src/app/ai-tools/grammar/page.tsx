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
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import GrammarChecker from '@/components/ai/GrammarChecker';
import SpellcheckIcon from '@mui/icons-material/Spellcheck';
import TextFormatIcon from '@mui/icons-material/TextFormat';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import FactCheckIcon from '@mui/icons-material/FactCheck';

// 语法检查页面
export default function GrammarCheckerPage() {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box mb={4}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          AI语法检查与文本优化
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          智能识别语法错误、拼写错误和表达问题，提供修改建议，提升英语写作质量
        </Typography>
      </Box>
      
      {/* 主要内容区域 */}
      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
        {/* 左侧边栏 - 使用指南 */}
        <Box sx={{ width: { xs: '100%', md: 280 } }}>
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <HelpOutlineIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">使用指南</Typography>
              </Box>
              
              <List dense sx={{ p: 0 }}>
                <ListItem sx={{ pl: 0 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <TextFormatIcon fontSize="small" color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="在文本框中输入您的英文内容"
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
                <ListItem sx={{ pl: 0 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <SpellcheckIcon fontSize="small" color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="点击'检查语法与用词'按钮"
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
                <ListItem sx={{ pl: 0 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <FactCheckIcon fontSize="small" color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="查看右侧分析结果和修改建议"
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
                <ListItem sx={{ pl: 0 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <TipsAndUpdatesIcon fontSize="small" color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="应用修改建议，提升文本质量"
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
              </List>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle2" gutterBottom>
                检查项目:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                <Chip label="语法错误" size="small" color="error" />
                <Chip label="拼写错误" size="small" color="warning" />
                <Chip label="标点使用" size="small" color="info" />
                <Chip label="表达风格" size="small" color="success" />
                <Chip label="用词建议" size="small" color="secondary" />
              </Box>
            </CardContent>
          </Card>
          
          <Card variant="outlined">
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <LocalLibraryIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">常见错误</Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  冠词使用
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  "a"与"an"的选择取决于后面单词的发音，而非拼写。元音音素前用"an"。
                </Typography>
                <Box sx={{ display: 'flex', mt: 1 }}>
                  <Typography variant="body2" color="error.main" sx={{ mr: 1 }}>
                    ✗ a hour
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    ✓ an hour
                  </Typography>
                </Box>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  主谓一致
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  主语和谓语在人称和数上必须一致。
                </Typography>
                <Box sx={{ display: 'flex', mt: 1 }}>
                  <Typography variant="body2" color="error.main" sx={{ mr: 1 }}>
                    ✗ The team are ready.
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    ✓ The team is ready.
                  </Typography>
                </Box>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  时态一致
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  在一个句子或段落中保持时态一致。
                </Typography>
                <Box sx={{ display: 'flex', mt: 1 }}>
                  <Typography variant="body2" color="error.main" sx={{ mr: 1 }}>
                    ✗ I went to the store and buy some food.
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    ✓ I went to the store and bought some food.
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
        
        {/* 主要检查区域 */}
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
            <GrammarChecker initialText="" />
          </Paper>
        </Box>
      </Box>
      
      {/* 底部提示区域 */}
      <Box mt={4}>
        <Typography variant="h6" gutterBottom>
          写作建议
        </Typography>
        <MuiGrid container spacing={2}>
          {[
            { 
              title: "使用主动语态", 
              content: "主动语态通常比被动语态更清晰、更有力。除非有特殊需要强调承受者，否则优先使用主动语态。", 
              example: "主动: The committee approved the proposal. / 被动: The proposal was approved by the committee."
            },
            { 
              title: "避免冗余表达", 
              content: "删除不必要的词汇，保持表达简洁。许多常见表达可以更简洁地重写。", 
              example: "冗余: at this point in time / 简洁: now or currently"
            },
            { 
              title: "使用具体词汇", 
              content: "选择具体、精确的词汇代替泛泛而谈的词语。具体的词汇能让你的写作更加生动有力。", 
              example: "泛泛: The weather was bad. / 具体: The storm brought howling winds and freezing rain."
            },
            { 
              title: "保持段落聚焦", 
              content: "每个段落应关注一个中心思想。使用主题句开始段落，后续句子支持或发展这一思想。", 
              example: "一个段落一个主题，保持3-5个句子的长度，确保逻辑连贯。"
            }
          ].map((tip, index) => (
            <MuiGrid item xs={12} sm={6} key={index}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    {tip.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {tip.content}
                  </Typography>
                  <Box sx={{ bgcolor: 'action.hover', p: 1, borderRadius: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      <strong>示例：</strong> {tip.example}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </MuiGrid>
          ))}
        </MuiGrid>
      </Box>
    </Container>
  );
} 