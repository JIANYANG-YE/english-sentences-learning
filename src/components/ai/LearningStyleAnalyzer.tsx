import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid as MuiGrid,
  Card,
  CardContent,
  LinearProgress,
  Button,
  Tabs,
  Tab,
  Divider,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Hearing as HearingIcon,
  MenuBook as MenuBookIcon,
  DirectionsRun as DirectionsRunIcon,
  CheckCircle as CheckCircleIcon,
  BarChart as BarChartIcon,
  Help as HelpIcon,
  Share as ShareIcon,
  GetApp as GetAppIcon,
  Assessment as AssessmentIcon,
  Refresh as RefreshIcon,
  Lightbulb as LightbulbIcon
} from '@mui/icons-material';

// 导入用户和学习相关类型
import { UserProfile } from '@/types/user';
import { LearningActivityType } from '@/types/learning';

// 学习风格类型
export type LearningStyle = 'visual' | 'auditory' | 'reading/writing' | 'kinesthetic';

// 学习风格详情
interface LearningStyleDetail {
  type: LearningStyle;
  score: number;
  description: string;
  icon: React.ReactNode;
  color: string;
  traits: string[];
  strategies: string[];
}

// 学习活动数据
interface LearningActivityData {
  activityType: LearningActivityType;
  timeSpent: number; // 分钟
  completionRate: number; // 0-100
  averageScore: number; // 0-100
  frequency: number; // 使用频率 (过去30天中的天数)
}

// 活动类型与学习风格的关联映射
const ACTIVITY_STYLE_MAPPING: Record<LearningActivityType, LearningStyle[]> = {
  chineseToEnglish: ['reading/writing'],
  englishToChinese: ['reading/writing'],
  grammar: ['reading/writing'],
  listening: ['auditory'],
  vocabulary: ['visual', 'reading/writing'],
  speaking: ['auditory', 'kinesthetic'],
  reading: ['visual', 'reading/writing'],
  writing: ['reading/writing', 'kinesthetic']
};

// 学习风格分析器属性
interface LearningStyleAnalyzerProps {
  userId?: string;
  userProfile?: UserProfile;
  onStyleAnalysisComplete?: (styles: LearningStyleDetail[]) => void;
}

const LearningStyleAnalyzer: React.FC<LearningStyleAnalyzerProps> = ({
  userId,
  userProfile,
  onStyleAnalysisComplete
}) => {
  // 状态
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [learningStyles, setLearningStyles] = useState<LearningStyleDetail[]>([]);
  const [activityData, setActivityData] = useState<LearningActivityData[]>([]);
  const [analysisDate, setAnalysisDate] = useState<Date | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  // 使用重命名的Grid组件
  const Grid = MuiGrid;

  // 分析学习风格
  const analyzeLearningStyle = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // 模拟API请求
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 模拟活动数据
      const mockActivityData: LearningActivityData[] = [
        {
          activityType: 'listening',
          timeSpent: 210,
          completionRate: 85,
          averageScore: 78,
          frequency: 18
        },
        {
          activityType: 'speaking',
          timeSpent: 180,
          completionRate: 70,
          averageScore: 65,
          frequency: 12
        },
        {
          activityType: 'reading',
          timeSpent: 320,
          completionRate: 92,
          averageScore: 88,
          frequency: 25
        },
        {
          activityType: 'writing',
          timeSpent: 140,
          completionRate: 65,
          averageScore: 72,
          frequency: 10
        },
        {
          activityType: 'vocabulary',
          timeSpent: 260,
          completionRate: 80,
          averageScore: 75,
          frequency: 22
        },
        {
          activityType: 'grammar',
          timeSpent: 190,
          completionRate: 75,
          averageScore: 70,
          frequency: 15
        }
      ];
      
      setActivityData(mockActivityData);
      
      // 计算每种学习风格的得分
      const styleScores: Record<LearningStyle, number> = {
        visual: 0,
        auditory: 0,
        'reading/writing': 0,
        kinesthetic: 0
      };
      
      // 基于活动数据计算各风格得分
      mockActivityData.forEach(activity => {
        const styles = ACTIVITY_STYLE_MAPPING[activity.activityType] || [];
        const activityScore = (
          activity.timeSpent * 0.4 + 
          activity.completionRate * 0.3 + 
          activity.averageScore * 0.2 + 
          activity.frequency * 0.1
        ) / 100;
        
        styles.forEach(style => {
          styleScores[style] += activityScore;
        });
      });
      
      // 规范化分数
      const totalScore = Object.values(styleScores).reduce((sum, score) => sum + score, 0);
      
      Object.keys(styleScores).forEach(key => {
        const style = key as LearningStyle;
        styleScores[style] = totalScore > 0 
          ? Math.round((styleScores[style] / totalScore) * 100) 
          : 25; // 如果没有数据，平均分配
      });
      
      // 创建完整的学习风格详情
      const stylesData: LearningStyleDetail[] = [
        {
          type: 'visual',
          score: styleScores.visual,
          description: '视觉学习者通过看到信息来学习最有效',
          icon: <VisibilityIcon />,
          color: '#4caf50',
          traits: [
            '喜欢图表、图片和视觉辅助工具',
            '倾向于在脑海中可视化信息',
            '善于记住看到的内容',
            '注重色彩和空间布局'
          ],
          strategies: [
            '使用思维导图和图表',
            '使用荧光笔标记重点',
            '观看视频教程',
            '创建图像化的笔记'
          ]
        },
        {
          type: 'auditory',
          score: styleScores.auditory,
          description: '听觉学习者通过听到信息来学习最有效',
          icon: <HearingIcon />,
          color: '#2196f3',
          traits: [
            '喜欢口头讲解和讨论',
            '善于记住听到的内容',
            '可能会自言自语以强化学习',
            '易受背景噪音干扰'
          ],
          strategies: [
            '参与小组讨论',
            '朗读学习材料',
            '听有声读物和播客',
            '用自己的话复述所学内容'
          ]
        },
        {
          type: 'reading/writing',
          score: styleScores['reading/writing'],
          description: '阅读/写作学习者通过文字来学习最有效',
          icon: <MenuBookIcon />,
          color: '#9c27b0',
          traits: [
            '喜欢阅读和写作',
            '喜欢列表和大纲',
            '喜欢书面指导',
            '善于组织思想并写下来'
          ],
          strategies: [
            '写摘要和笔记',
            '重组信息为列表',
            '使用词典和术语表',
            '将口头信息转化为书面形式'
          ]
        },
        {
          type: 'kinesthetic',
          score: styleScores.kinesthetic,
          description: '动觉学习者通过动手实践来学习最有效',
          icon: <DirectionsRunIcon />,
          color: '#ff9800',
          traits: [
            '喜欢动手操作和实验',
            '难以长时间保持静坐',
            '喜欢实际应用和真实情境',
            '记忆与行动和感觉相关的内容'
          ],
          strategies: [
            '角色扮演和情境模拟',
            '实际操作和练习',
            '边走动边学习',
            '使用实物和模型'
          ]
        }
      ];
      
      // 按分数降序排序
      stylesData.sort((a, b) => b.score - a.score);
      
      setLearningStyles(stylesData);
      setAnalysisDate(new Date());
      
      if (onStyleAnalysisComplete) {
        onStyleAnalysisComplete(stylesData);
      }
    } catch (error) {
      console.error('分析学习风格失败:', error);
    } finally {
      setIsLoading(false);
    }
  }, [onStyleAnalysisComplete]);

  // 首次加载时分析
  useEffect(() => {
    analyzeLearningStyle();
  }, [analyzeLearningStyle]);

  // 处理标签切换
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // 分享分析结果
  const handleShare = async () => {
    setIsSharing(true);
    
    try {
      // 模拟分享操作
      await new Promise(resolve => setTimeout(resolve, 1500));
      setShareSuccess(true);
      
      // 3秒后重置状态
      setTimeout(() => {
        setShareSuccess(false);
        setIsSharing(false);
      }, 3000);
    } catch (error) {
      console.error('分享失败:', error);
      setIsSharing(false);
    }
  };

  // 下载分析报告
  const handleDownloadReport = () => {
    // 简单的报告生成逻辑
    const reportData = {
      user: userProfile?.name || '用户', // 使用CoreUser中的name属性
      date: analysisDate?.toLocaleDateString(),
      learningStyles: learningStyles,
      activityData: activityData
    };
    
    // 创建Blob对象
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // 创建下载链接
    const a = document.createElement('a');
    a.href = url;
    a.download = `学习风格分析-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    
    // 清理
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 渲染主要学习风格卡片
  const renderPrimaryStyleCard = () => {
    if (learningStyles.length === 0) return null;
    
    const primaryStyle = learningStyles[0];
    
    return (
      <Card 
        elevation={3} 
        sx={{ 
          mb: 4, 
          bgcolor: `${primaryStyle.color}10`,
          border: `1px solid ${primaryStyle.color}40`,
          position: 'relative'
        }}
      >
        <CardContent>
          <Box sx={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: 1 }}>
            <Chip 
              label="主要学习风格" 
              color="primary" 
              size="small"
              icon={<CheckCircleIcon />}
            />
            <Chip 
              label={`${primaryStyle.score}%`} 
              size="small"
              sx={{ bgcolor: primaryStyle.color, color: 'white' }}
            />
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar 
              sx={{ 
                bgcolor: primaryStyle.color,
                width: 60,
                height: 60,
                mr: 2
              }}
            >
              {primaryStyle.icon}
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                {primaryStyle.type === 'visual' ? '视觉型学习者' : 
                 primaryStyle.type === 'auditory' ? '听觉型学习者' : 
                 primaryStyle.type === 'reading/writing' ? '读写型学习者' : 
                 '动觉型学习者'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {primaryStyle.description}
              </Typography>
            </Box>
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, p: 3 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                特点:
              </Typography>
              <Box component="ul" sx={{ pl: 2 }}>
                {primaryStyle.traits.map((trait, index) => (
                  <Box component="li" key={index} sx={{ mb: 0.5 }}>
                    <Typography variant="body2">{trait}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                推荐学习策略:
              </Typography>
              <Box component="ul" sx={{ pl: 2 }}>
                {primaryStyle.strategies.map((strategy, index) => (
                  <Box component="li" key={index} sx={{ mb: 0.5 }}>
                    <Typography variant="body2">{strategy}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  };

  // 渲染学习风格分布
  const renderStyleDistribution = () => {
    return (
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">学习风格分布</Typography>
            <Tooltip title="重新分析">
              <IconButton size="small" onClick={analyzeLearningStyle} disabled={isLoading}>
                {isLoading ? <CircularProgress size={20} /> : <RefreshIcon />}
              </IconButton>
            </Tooltip>
          </Box>
          
          {learningStyles.map((style) => (
            <Box key={style.type} sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    color: style.color,
                    mr: 1
                  }}
                >
                  {style.icon}
                </Box>
                <Typography variant="body2" sx={{ flexGrow: 1 }}>
                  {style.type === 'visual' ? '视觉型' : 
                   style.type === 'auditory' ? '听觉型' : 
                   style.type === 'reading/writing' ? '读写型' : 
                   '动觉型'}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {style.score}%
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={style.score} 
                sx={{ 
                  height: 8, 
                  borderRadius: 1,
                  bgcolor: `${style.color}20`,
                  '& .MuiLinearProgress-bar': {
                    bgcolor: style.color
                  }
                }}
              />
            </Box>
          ))}
          
          {analysisDate && (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2, textAlign: 'right' }}>
              分析日期: {analysisDate.toLocaleDateString()}
            </Typography>
          )}
        </CardContent>
      </Card>
    );
  };

  // 渲染活动参与度
  const renderActivityEngagement = () => {
    if (activityData.length === 0) return null;
    
    return (
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>活动参与情况</Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -1, mt: 1 }}>
            {activityData.map((activity) => (
              <Box 
                key={activity.activityType} 
                sx={{ 
                  width: { xs: '100%', sm: '50%', md: '33.333%' }, 
                  p: 1 
                }}
              >
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    {activity.activityType === 'listening' ? '听力练习' :
                     activity.activityType === 'speaking' ? '口语练习' :
                     activity.activityType === 'reading' ? '阅读练习' :
                     activity.activityType === 'writing' ? '写作练习' :
                     activity.activityType === 'vocabulary' ? '词汇学习' :
                     activity.activityType === 'grammar' ? '语法学习' :
                     activity.activityType === 'chineseToEnglish' ? '中译英' :
                     '英译中'}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">时长:</Typography>
                    <Typography variant="caption">{activity.timeSpent} 分钟</Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">完成率:</Typography>
                    <Typography variant="caption">{activity.completionRate}%</Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">平均分:</Typography>
                    <Typography variant="caption">{activity.averageScore}</Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="caption" color="text.secondary">频率:</Typography>
                    <Typography variant="caption">{activity.frequency}/30天</Typography>
                  </Box>
                </Paper>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    );
  };

  // 渲染学习策略推荐
  const renderLearningStrategies = () => {
    if (learningStyles.length === 0) return null;
    
    // 获取主要学习风格
    const primaryStyle = learningStyles[0];
    const secondaryStyle = learningStyles[1];
    
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>个性化学习策略推荐</Typography>
        
        <Alert 
          severity="info" 
          sx={{ mb: 3 }}
          icon={<LightbulbIcon />}
        >
          基于您的学习风格分析，我们为您提供了个性化的学习策略建议。结合您的主要学习风格({primaryStyle.type === 'visual' ? '视觉型' : 
            primaryStyle.type === 'auditory' ? '听觉型' : 
            primaryStyle.type === 'reading/writing' ? '读写型' : 
            '动觉型'})和次要学习风格({secondaryStyle.type === 'visual' ? '视觉型' : 
            secondaryStyle.type === 'auditory' ? '听觉型' : 
            secondaryStyle.type === 'reading/writing' ? '读写型' : 
            '动觉型'})，采用以下方法可能会提高您的学习效果。
        </Alert>
        
        <Typography variant="subtitle1" gutterBottom>
          建议学习方法:
        </Typography>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {primaryStyle.strategies.map((strategy, index) => (
            <Box key={`primary-${index}`} sx={{ flex: '1 0 45%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CheckCircleIcon sx={{ color: primaryStyle.color, mr: 1 }} fontSize="small" />
                <Typography variant="body2">{strategy}</Typography>
              </Box>
            </Box>
          ))}
          
          {primaryStyle.type === 'visual' && (
            <>
              <Box sx={{ flex: '1 0 45%' }}>
                <Chip label="图表学习" size="small" sx={{ mr: 1, mb: 1 }} />
                <Typography variant="body2">使用思维导图总结词汇和语法关系</Typography>
              </Box>
              <Box sx={{ flex: '1 0 45%' }}>
                <Chip label="视频教程" size="small" sx={{ mr: 1, mb: 1 }} />
                <Typography variant="body2">观看视频讲解和情景对话</Typography>
              </Box>
            </>
          )}
          
          {primaryStyle.type === 'auditory' && (
            <>
              <Box sx={{ flex: '1 0 45%' }}>
                <Chip label="听力练习" size="small" sx={{ mr: 1, mb: 1 }} />
                <Typography variant="body2">多听对话和播客材料</Typography>
              </Box>
              <Box sx={{ flex: '1 0 45%' }}>
                <Chip label="小组讨论" size="small" sx={{ mr: 1, mb: 1 }} />
                <Typography variant="body2">参与口语练习和角色扮演</Typography>
              </Box>
            </>
          )}
          
          {primaryStyle.type === 'reading/writing' && (
            <>
              <Box sx={{ flex: '1 0 45%' }}>
                <Chip label="写作练习" size="small" sx={{ mr: 1, mb: 1 }} />
                <Typography variant="body2">写日记或总结以强化记忆</Typography>
              </Box>
              <Box sx={{ flex: '1 0 45%' }}>
                <Chip label="阅读材料" size="small" sx={{ mr: 1, mb: 1 }} />
                <Typography variant="body2">阅读不同难度和主题的文章</Typography>
              </Box>
            </>
          )}
          
          {primaryStyle.type === 'kinesthetic' && (
            <>
              <Box sx={{ flex: '1 0 45%' }}>
                <Chip label="角色扮演" size="small" sx={{ mr: 1, mb: 1 }} />
                <Typography variant="body2">进行情境对话和角色扮演</Typography>
              </Box>
              <Box sx={{ flex: '1 0 45%' }}>
                <Chip label="互动练习" size="small" sx={{ mr: 1, mb: 1 }} />
                <Typography variant="body2">使用交互式应用和游戏进行学习</Typography>
              </Box>
            </>
          )}
        </Box>
      </Box>
    );
  };

  return (
    <Box sx={{ height: '100%' }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            学习风格分析
          </Typography>
          
          <Box>
            <Tooltip title="分享分析结果">
              <IconButton 
                size="small" 
                sx={{ mr: 1 }} 
                onClick={handleShare}
                disabled={isSharing || learningStyles.length === 0}
              >
                {isSharing ? (
                  shareSuccess ? <CheckCircleIcon color="success" /> : <CircularProgress size={20} />
                ) : (
                  <ShareIcon />
                )}
              </IconButton>
            </Tooltip>
            
            <Tooltip title="下载分析报告">
              <IconButton 
                size="small" 
                onClick={handleDownloadReport}
                disabled={learningStyles.length === 0}
              >
                <GetAppIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        
        <Typography variant="body2" color="text.secondary" paragraph>
          基于您的学习活动和表现数据，我们分析了您的学习风格偏好。理解自己的学习风格可以帮助您选择更有效的学习方法。
        </Typography>
        
        {isLoading && !learningStyles.length ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {renderPrimaryStyleCard()}
            
            <Paper sx={{ mb: 3 }}>
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                variant="fullWidth"
                sx={{ borderBottom: 1, borderColor: 'divider' }}
              >
                <Tab 
                  label="风格分析" 
                  icon={<BarChartIcon />} 
                  iconPosition="start"
                />
                <Tab 
                  label="学习策略" 
                  icon={<LightbulbIcon />} 
                  iconPosition="start"
                />
                <Tab 
                  label="活动数据" 
                  icon={<AssessmentIcon />} 
                  iconPosition="start"
                />
              </Tabs>
              
              <Box sx={{ p: 2 }}>
                {activeTab === 0 && (
                  <Box>
                    {renderStyleDistribution()}
                    
                    <Typography variant="body2" color="text.secondary">
                      这些分数表示您在不同学习风格中的倾向性比例。主导风格反映了您可能最容易接受和处理信息的方式，但结合多种学习方式通常能带来最佳效果。
                    </Typography>
                  </Box>
                )}
                
                {activeTab === 1 && (
                  <Box>
                    {renderLearningStrategies()}
                  </Box>
                )}
                
                {activeTab === 2 && (
                  <Box>
                    {renderActivityEngagement()}
                  </Box>
                )}
              </Box>
            </Paper>
            
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button 
                variant="outlined" 
                startIcon={<RefreshIcon />}
                onClick={analyzeLearningStyle}
                disabled={isLoading}
              >
                重新分析学习风格
              </Button>
            </Box>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default LearningStyleAnalyzer; 