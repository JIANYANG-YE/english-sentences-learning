import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Paper,
  Tab,
  Tabs,
  Typography,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  WarningAmber,
  TrendingUp,
  Assignment,
  Psychology,
  Schedule,
  Download,
  Share,
  ErrorOutline,
  CheckCircleOutline,
  LocalLibrary,
  BarChart,
  Lightbulb,
  Timer,
  MenuBook,
  SelfImprovement,
  Visibility,
  RecordVoiceOver,
  Create,
  DirectionsRun,
} from '@mui/icons-material';

interface WeaknessData {
  id: string;
  type: string;
  name: string;
  description: string;
  probability: number;
  impact: 'low' | 'medium' | 'high';
  suggestedStrategies: string[];
  relatedActivities: string[];
  affectedAreas: string[];
}

interface PredictionDetails {
  timestamp: string;
  userId: string;
  overallRisk: number;
  primaryWeaknesses: WeaknessData[];
  secondaryWeaknesses: WeaknessData[];
  learningHabits: {
    positive: string[];
    negative: string[];
  };
  suggestedFocus: string[];
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`weakness-tabpanel-${index}`}
      aria-labelledby={`weakness-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function LearningWeaknessPredictor() {
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [predictionResults, setPredictionResults] = useState<PredictionDetails | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [openShareDialog, setOpenShareDialog] = useState(false);

  const analyzeWeaknesses = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // 模拟API调用获取学习弱点预测数据
      // 实际实现应调用后端API
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // 模拟数据示例
      const mockData: PredictionDetails = {
        timestamp: new Date().toISOString(),
        userId: "user123",
        overallRisk: 42,
        primaryWeaknesses: [
          {
            id: "vocab-retention",
            type: "memory",
            name: "词汇记忆保留率低",
            description: "您学习新词后容易遗忘，可能缺乏有效的复习策略。",
            probability: 85,
            impact: "high",
            suggestedStrategies: [
              "实施间隔重复学习法",
              "使用词汇联想记忆技巧",
              "创建个人词汇情境示例"
            ],
            relatedActivities: [
              "每日词汇复习挑战",
              "词根词缀分析练习"
            ],
            affectedAreas: ["词汇量", "阅读理解", "听力理解"]
          },
          {
            id: "pronunciation",
            type: "speaking",
            name: "发音准确度不足",
            description: "语音模仿和准确度方面存在困难，特别是对于某些特定音素。",
            probability: 78,
            impact: "medium",
            suggestedStrategies: [
              "使用发音镜像训练",
              "录制并对比自己的发音",
              "专注于问题音素的口型练习"
            ],
            relatedActivities: [
              "发音对比练习",
              "语音模仿训练"
            ],
            affectedAreas: ["口语表达", "听力理解", "社交沟通"]
          }
        ],
        secondaryWeaknesses: [
          {
            id: "grammar-application",
            type: "grammar",
            name: "语法应用不一致",
            description: "理解语法规则但在实际应用中不一致，特别是在口语和写作中。",
            probability: 62,
            impact: "medium",
            suggestedStrategies: [
              "做有针对性的语法练习",
              "分析错误模式并集中练习",
              "使用语法检查工具进行反馈"
            ],
            relatedActivities: [
              "语法填空练习",
              "句子改写训练"
            ],
            affectedAreas: ["写作", "口语表达", "考试表现"]
          },
          {
            id: "listening-focus",
            type: "attention",
            name: "听力专注度不足",
            description: "在较长的听力材料中容易分心，导致关键信息遗漏。",
            probability: 55,
            impact: "low",
            suggestedStrategies: [
              "进行渐进式听力练习",
              "使用积极听力技巧",
              "练习听力笔记方法"
            ],
            relatedActivities: [
              "听力关键词提取练习",
              "听后复述训练"
            ],
            affectedAreas: ["听力理解", "课堂学习", "交流效率"]
          }
        ],
        learningHabits: {
          positive: [
            "学习频率相对稳定",
            "善于使用在线学习资源",
            "有记笔记的习惯"
          ],
          negative: [
            "学习时间过于分散",
            "缺乏系统性复习",
            "过度依赖翻译工具"
          ]
        },
        suggestedFocus: [
          "建立有效的词汇复习系统",
          "增加发音针对性练习",
          "提高听力专注度训练"
        ]
      };
      
      setPredictionResults(mockData);
      setAnalyzing(true);
    } catch (err) {
      setError('分析过程中出现错误，请稍后重试。');
      console.error('Error analyzing weaknesses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleShareResults = () => {
    setOpenShareDialog(true);
  };

  const handleCloseShareDialog = () => {
    setOpenShareDialog(false);
  };

  const downloadReport = () => {
    // 实际实现应创建并下载PDF或其他格式的报告
    alert('报告下载功能将在未来版本中提供');
  };

  const getImpactColor = (impact: 'low' | 'medium' | 'high') => {
    switch (impact) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'memory':
        return <Psychology />;
      case 'speaking':
        return <RecordVoiceOver />;
      case 'grammar':
        return <MenuBook />;
      case 'attention':
        return <Visibility />;
      case 'writing':
        return <Create />;
      case 'reading':
        return <LocalLibrary />;
      case 'motivation':
        return <SelfImprovement />;
      case 'time':
        return <Timer />;
      default:
        return <WarningAmber />;
    }
  };

  const renderWeaknessCard = (weakness: WeaknessData) => (
    <Card key={weakness.id} sx={{ mb: 2, boxShadow: 2 }}>
      <CardHeader
        avatar={getTypeIcon(weakness.type)}
        title={
          <Typography variant="h6">
            {weakness.name}
            <Chip
              label={`影响: ${
                weakness.impact === 'high' ? '高' :
                weakness.impact === 'medium' ? '中' : '低'
              }`}
              color={getImpactColor(weakness.impact)}
              size="small"
              sx={{ ml: 2 }}
            />
          </Typography>
        }
        subheader={`可能性: ${weakness.probability}%`}
      />
      <CardContent>
        <Typography variant="body1" paragraph>
          {weakness.description}
        </Typography>
        
        <Typography variant="subtitle2" gutterBottom>
          建议改进策略:
        </Typography>
        <List dense>
          {weakness.suggestedStrategies.map((strategy, idx) => (
            <ListItem key={idx}>
              <ListItemIcon sx={{ minWidth: '32px' }}>
                <Lightbulb fontSize="small" color="primary" />
              </ListItemIcon>
              <ListItemText primary={strategy} />
            </ListItem>
          ))}
        </List>
        
        <Divider sx={{ my: 1 }} />
        
        <Typography variant="subtitle2" gutterBottom>
          影响领域:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {weakness.affectedAreas.map((area, idx) => (
            <Chip key={idx} label={area} size="small" variant="outlined" />
          ))}
        </Box>
      </CardContent>
    </Card>
  );

  const renderAnalytics = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            总体弱点风险评估
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ position: 'relative', display: 'inline-flex', mr: 2 }}>
              <CircularProgress
                variant="determinate"
                value={predictionResults?.overallRisk || 0}
                color={
                  (predictionResults?.overallRisk || 0) > 70 ? 'error' :
                  (predictionResults?.overallRisk || 0) > 40 ? 'warning' : 'success'
                }
                size={80}
              />
              <Box
                sx={{
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  position: 'absolute',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="caption" component="div" color="text.secondary">
                  {`${predictionResults?.overallRisk || 0}%`}
                </Typography>
              </Box>
            </Box>
            <Box>
              <Typography variant="body1">
                {(predictionResults?.overallRisk || 0) > 70 
                  ? '您的学习存在严重弱点，需要立即关注。' 
                  : (predictionResults?.overallRisk || 0) > 40
                  ? '您的学习存在中等弱点，建议采取改进措施。'
                  : '您的学习弱点风险较低，但仍有改进空间。'}
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2, height: '100%' }}>
          <Typography variant="h6" gutterBottom>
            学习习惯分析
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="success.main" sx={{ display: 'flex', alignItems: 'center' }}>
              <CheckCircleOutline sx={{ mr: 1 }} /> 积极习惯
            </Typography>
            <List dense>
              {predictionResults?.learningHabits.positive.map((habit, idx) => (
                <ListItem key={idx}>
                  <ListItemText primary={habit} />
                </ListItem>
              ))}
            </List>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="error.main" sx={{ display: 'flex', alignItems: 'center' }}>
              <ErrorOutline sx={{ mr: 1 }} /> 需要改进的习惯
            </Typography>
            <List dense>
              {predictionResults?.learningHabits.negative.map((habit, idx) => (
                <ListItem key={idx}>
                  <ListItemText primary={habit} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2, height: '100%' }}>
          <Typography variant="h6" gutterBottom>
            建议关注方向
          </Typography>
          <Alert severity="info" sx={{ mb: 2 }}>
            基于您的学习模式分析，我们建议您优先关注以下领域：
          </Alert>
          <List>
            {predictionResults?.suggestedFocus.map((focus, idx) => (
              <ListItem key={idx}>
                <ListItemIcon>
                  <TrendingUp color="primary" />
                </ListItemIcon>
                <ListItemText primary={focus} />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Grid>
    </Grid>
  );

  return (
    <Container>
      <Paper sx={{ p: 3, mb: 4 }}>
        {!analyzing ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <WarningAmber sx={{ fontSize: 60, color: 'warning.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              学习弱点预测分析
            </Typography>
            <Typography variant="body1" paragraph sx={{ mb: 3 }}>
              我们的AI系统将分析您的学习历史和行为模式，预测影响您学习效果的潜在弱点，并提供针对性改进建议。
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={analyzeWeaknesses}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Psychology />}
            >
              {loading ? '分析中...' : '开始分析'}
            </Button>
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </Box>
        ) : (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5">学习弱点分析结果</Typography>
              <Box>
                <Button
                  startIcon={<Share />}
                  sx={{ mr: 1 }}
                  onClick={handleShareResults}
                >
                  分享
                </Button>
                <Button
                  startIcon={<Download />}
                  variant="outlined"
                  onClick={downloadReport}
                >
                  下载报告
                </Button>
              </Box>
            </Box>
            
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tabValue} onChange={handleTabChange} aria-label="weakness analysis tabs">
                <Tab label="主要弱点" icon={<WarningAmber />} iconPosition="start" />
                <Tab label="次要弱点" icon={<ErrorOutline />} iconPosition="start" />
                <Tab label="分析详情" icon={<BarChart />} iconPosition="start" />
              </Tabs>
            </Box>
            
            <TabPanel value={tabValue} index={0}>
              {predictionResults?.primaryWeaknesses.map(renderWeaknessCard)}
            </TabPanel>
            
            <TabPanel value={tabValue} index={1}>
              {predictionResults?.secondaryWeaknesses.map(renderWeaknessCard)}
            </TabPanel>
            
            <TabPanel value={tabValue} index={2}>
              {renderAnalytics()}
            </TabPanel>
          </>
        )}
      </Paper>

      <Dialog open={openShareDialog} onClose={handleCloseShareDialog}>
        <DialogTitle>分享学习弱点分析结果</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            您可以将分析结果分享给老师或学习伙伴以获取更多帮助。
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseShareDialog}>取消</Button>
          <Button onClick={handleCloseShareDialog} variant="contained">
            复制链接
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
} 