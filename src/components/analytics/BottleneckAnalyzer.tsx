import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import {
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  LocalLibrary as LocalLibraryIcon,
  AccessTime as AccessTimeIcon,
  Psychology as PsychologyIcon,
  School as SchoolIcon,
  ExpandMore as ExpandMoreIcon,
  RecordVoiceOver as RecordVoiceOverIcon,
  MenuBook as MenuBookIcon,
  Create as CreateIcon,
  CalendarToday as CalendarTodayIcon,
  Refresh as RefreshIcon,
  LowPriority as LowPriorityIcon,
  Timeline as TimelineIcon,
  Launch as LaunchIcon
} from '@mui/icons-material';
import { BottleneckType, SeverityLevel } from '@/app/api/analytics/bottlenecks/route';

// 学习瓶颈数据接口
interface Bottleneck {
  id: string;
  userId: string;
  type: BottleneckType;
  severity: SeverityLevel;
  description: string;
  details: {
    specificIssues: string[];
    relatedItems?: {
      itemId: string;
      itemType: string;
      errorCount?: number;
      timeSpent?: number;
    }[];
    timeFrameStart?: string;
    timeFrameEnd?: string;
  };
  suggestions: {
    title: string;
    description: string;
    resources?: {
      title: string;
      type: string;
      url?: string;
      id?: string;
    }[];
  }[];
  detectedAt?: string;
  resolvedAt?: string;
  status?: 'active' | 'in_progress' | 'resolved';
}

// 组件属性接口
interface BottleneckAnalyzerProps {
  userId?: string;
  onRefresh?: () => void;
  onResourceSelect?: (resourceId: string, resourceType: string) => void;
}

const BottleneckAnalyzer: React.FC<BottleneckAnalyzerProps> = ({
  userId = '123', // 默认用户ID，实际使用时应该从props或上下文中获取
  onRefresh,
  onResourceSelect
}) => {
  // 状态
  const [bottlenecks, setBottlenecks] = useState<Bottleneck[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedBottleneck, setSelectedBottleneck] = useState<Bottleneck | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // 获取瓶颈数据
  const fetchBottlenecks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // 调用API获取瓶颈数据
      const response = await fetch(`/api/analytics/bottlenecks?userId=${userId}`);
      
      if (!response.ok) {
        throw new Error('获取学习瓶颈数据失败');
      }
      
      const data = await response.json();
      setBottlenecks(data);
    } catch (error) {
      console.error('获取瓶颈数据失败:', error);
      setError('无法加载学习瓶颈数据。请稍后再试。');
    } finally {
      setIsLoading(false);
    }
  };
  
  // 初始加载
  useEffect(() => {
    fetchBottlenecks();
  }, [userId]);
  
  // 分析瓶颈
  const analyzeBottlenecks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // 调用分析API
      const response = await fetch('/api/analytics/bottlenecks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
      });
      
      if (!response.ok) {
        throw new Error('分析学习瓶颈失败');
      }
      
      // 重新获取瓶颈数据
      await fetchBottlenecks();
      
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error('分析瓶颈失败:', error);
      setError('无法分析学习瓶颈。请稍后再试。');
    } finally {
      setIsLoading(false);
    }
  };
  
  // 更新瓶颈状态
  const updateBottleneckStatus = async (bottleneckId: string, status: 'active' | 'in_progress' | 'resolved') => {
    try {
      setIsLoading(true);
      
      // 调用API更新状态
      const response = await fetch(`/api/analytics/bottlenecks?id=${bottleneckId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });
      
      if (!response.ok) {
        throw new Error('更新瓶颈状态失败');
      }
      
      // 更新本地状态
      setBottlenecks(prevBottlenecks => 
        prevBottlenecks.map(bottleneck => 
          bottleneck.id === bottleneckId 
            ? { ...bottleneck, status } 
            : bottleneck
        )
      );
    } catch (error) {
      console.error('更新瓶颈状态失败:', error);
      setError('无法更新瓶颈状态。请稍后再试。');
    } finally {
      setIsLoading(false);
    }
  };
  
  // 打开详情对话框
  const openBottleneckDetails = (bottleneck: Bottleneck) => {
    setSelectedBottleneck(bottleneck);
    setDialogOpen(true);
  };
  
  // 选择资源处理
  const handleResourceSelect = (resourceId: string, resourceType: string) => {
    if (onResourceSelect) {
      onResourceSelect(resourceId, resourceType);
    }
    setDialogOpen(false);
  };
  
  // 渲染瓶颈类型图标
  const renderBottleneckTypeIcon = (type: BottleneckType) => {
    switch (type) {
      case BottleneckType.VOCABULARY:
        return <MenuBookIcon />;
      case BottleneckType.GRAMMAR:
        return <SchoolIcon />;
      case BottleneckType.LISTENING:
        return <RecordVoiceOverIcon />;
      case BottleneckType.SPEAKING:
        return <RecordVoiceOverIcon />;
      case BottleneckType.READING:
        return <LocalLibraryIcon />;
      case BottleneckType.WRITING:
        return <CreateIcon />;
      case BottleneckType.TIME_MANAGEMENT:
        return <AccessTimeIcon />;
      case BottleneckType.LEARNING_PATTERN:
        return <PsychologyIcon />;
      case BottleneckType.RETENTION:
        return <LowPriorityIcon />;
      case BottleneckType.MOTIVATION:
        return <TimelineIcon />;
      default:
        return <InfoIcon />;
    }
  };
  
  // 渲染瓶颈严重程度
  const renderSeverityChip = (severity: SeverityLevel) => {
    let color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' = 'default';
    let icon = <InfoIcon />;
    let label = '未知';
    
    switch (severity) {
      case SeverityLevel.LOW:
        color = 'info';
        icon = <InfoIcon />;
        label = '轻微';
        break;
      case SeverityLevel.MEDIUM:
        color = 'warning';
        icon = <WarningIcon />;
        label = '中等';
        break;
      case SeverityLevel.HIGH:
        color = 'error';
        icon = <ErrorIcon />;
        label = '严重';
        break;
      case SeverityLevel.CRITICAL:
        color = 'secondary';
        icon = <ErrorIcon />;
        label = '严重';
        break;
    }
    
    return (
      <Chip 
        icon={icon} 
        label={label} 
        color={color} 
        size="small" 
        sx={{ fontWeight: 'bold' }} 
      />
    );
  };
  
  // 渲染瓶颈类型名称
  const getBottleneckTypeName = (type: BottleneckType): string => {
    const typeNames: Record<BottleneckType, string> = {
      [BottleneckType.VOCABULARY]: '词汇学习',
      [BottleneckType.GRAMMAR]: '语法理解',
      [BottleneckType.LISTENING]: '听力理解',
      [BottleneckType.SPEAKING]: '口语表达',
      [BottleneckType.READING]: '阅读理解',
      [BottleneckType.WRITING]: '写作能力',
      [BottleneckType.TIME_MANAGEMENT]: '时间管理',
      [BottleneckType.LEARNING_PATTERN]: '学习模式',
      [BottleneckType.RETENTION]: '知识保留',
      [BottleneckType.MOTIVATION]: '学习动力'
    };
    
    return typeNames[type] || '未知类型';
  };
  
  // 渲染瓶颈状态
  const renderStatusChip = (status?: 'active' | 'in_progress' | 'resolved') => {
    switch (status) {
      case 'active':
        return <Chip label="待解决" color="error" size="small" />;
      case 'in_progress':
        return <Chip label="处理中" color="warning" size="small" />;
      case 'resolved':
        return <Chip label="已解决" color="success" size="small" />;
      default:
        return <Chip label="未知" size="small" />;
    }
  };
  
  // 渲染瓶颈卡片
  const renderBottleneckCard = (bottleneck: Bottleneck) => {
    return (
      <Card 
        key={bottleneck.id} 
        sx={{ 
          mb: 2, 
          borderLeft: 4, 
          borderColor: 
            bottleneck.severity === SeverityLevel.CRITICAL || bottleneck.severity === SeverityLevel.HIGH 
              ? 'error.main' 
              : bottleneck.severity === SeverityLevel.MEDIUM 
                ? 'warning.main' 
                : 'info.main' 
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ mr: 1, color: 'text.secondary' }}>
                {renderBottleneckTypeIcon(bottleneck.type)}
              </Box>
              <Typography variant="h6" component="div">
                {getBottleneckTypeName(bottleneck.type)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {renderSeverityChip(bottleneck.severity)}
              {renderStatusChip(bottleneck.status)}
            </Box>
          </Box>
          
          <Typography variant="body1" sx={{ mb: 2 }}>
            {bottleneck.description}
          </Typography>
          
          {bottleneck.details.specificIssues.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                具体问题:
              </Typography>
              <List dense disablePadding>
                {bottleneck.details.specificIssues.slice(0, 2).map((issue, index) => (
                  <ListItem key={index} disablePadding sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 30 }}>
                      <InfoIcon fontSize="small" color="action" />
                    </ListItemIcon>
                    <ListItemText primary={issue} />
                  </ListItem>
                ))}
                {bottleneck.details.specificIssues.length > 2 && (
                  <ListItem disablePadding>
                    <ListItemText 
                      primary={`...还有 ${bottleneck.details.specificIssues.length - 2} 个问题`} 
                      sx={{ fontStyle: 'italic', color: 'text.secondary', pl: 4 }}
                    />
                  </ListItem>
                )}
              </List>
            </Box>
          )}
          
          {bottleneck.suggestions.length > 0 && (
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                建议措施:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {bottleneck.suggestions[0].title}
              </Typography>
            </Box>
          )}
        </CardContent>
        
        <Divider />
        
        <CardActions sx={{ justifyContent: 'space-between' }}>
          <Button 
            size="small" 
            startIcon={<InfoIcon />}
            onClick={() => openBottleneckDetails(bottleneck)}
          >
            查看详情
          </Button>
          
          <Box>
            {bottleneck.status === 'active' && (
              <Button 
                size="small" 
                color="warning"
                onClick={() => updateBottleneckStatus(bottleneck.id, 'in_progress')}
              >
                开始解决
              </Button>
            )}
            
            {bottleneck.status === 'in_progress' && (
              <Button 
                size="small" 
                color="success"
                onClick={() => updateBottleneckStatus(bottleneck.id, 'resolved')}
              >
                标记为已解决
              </Button>
            )}
            
            {bottleneck.status === 'resolved' && (
              <Button 
                size="small" 
                color="primary"
                onClick={() => updateBottleneckStatus(bottleneck.id, 'active')}
              >
                重新打开
              </Button>
            )}
          </Box>
        </CardActions>
      </Card>
    );
  };
  
  // 渲染详情对话框
  const renderDetailsDialog = () => {
    if (!selectedBottleneck) {
      return null;
    }
    
    return (
      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {renderBottleneckTypeIcon(selectedBottleneck.type)}
              <Typography variant="h6" component="div" sx={{ ml: 1 }}>
                {getBottleneckTypeName(selectedBottleneck.type)} - {selectedBottleneck.description}
              </Typography>
            </Box>
            {renderSeverityChip(selectedBottleneck.severity)}
          </Box>
        </DialogTitle>
        
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                具体问题
              </Typography>
              <List>
                {selectedBottleneck.details.specificIssues.map((issue, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <ErrorIcon color="error" />
                    </ListItemIcon>
                    <ListItemText primary={issue} />
                  </ListItem>
                ))}
              </List>
              
              {selectedBottleneck.details.relatedItems && selectedBottleneck.details.relatedItems.length > 0 && (
                <>
                  <Typography variant="subtitle1" gutterBottom fontWeight="bold" sx={{ mt: 2 }}>
                    相关内容
                  </Typography>
                  <List dense>
                    {selectedBottleneck.details.relatedItems.map((item, index) => (
                      <ListItem key={index} button onClick={() => handleResourceSelect(item.itemId, item.itemType)}>
                        <ListItemIcon>
                          <LocalLibraryIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText 
                          primary={`${item.itemType}: ${item.itemId}`}
                          secondary={
                            <>
                              {item.errorCount !== undefined && `错误次数: ${item.errorCount}`}
                              {item.timeSpent !== undefined && `, 花费时间: ${item.timeSpent}分钟`}
                            </>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </>
              )}
              
              {selectedBottleneck.detectedAt && (
                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                  <CalendarTodayIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    检测时间: {new Date(selectedBottleneck.detectedAt).toLocaleString()}
                  </Typography>
                </Box>
              )}
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                改进建议
              </Typography>
              
              {selectedBottleneck.suggestions.map((suggestion, index) => (
                <Accordion key={index} defaultExpanded={index === 0}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography fontWeight="medium">{suggestion.title}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2" paragraph>
                      {suggestion.description}
                    </Typography>
                    
                    {suggestion.resources && suggestion.resources.length > 0 && (
                      <>
                        <Typography variant="subtitle2" gutterBottom>
                          推荐资源
                        </Typography>
                        <List dense>
                          {suggestion.resources.map((resource, resourceIndex) => (
                            <ListItem 
                              key={resourceIndex} 
                              button
                              onClick={() => resource.id && handleResourceSelect(resource.id, resource.type)}
                            >
                              <ListItemIcon>
                                <SchoolIcon color="primary" />
                              </ListItemIcon>
                              <ListItemText primary={resource.title} secondary={resource.type} />
                              {resource.id && (
                                <Tooltip title="打开资源">
                                  <LaunchIcon fontSize="small" color="action" />
                                </Tooltip>
                              )}
                            </ListItem>
                          ))}
                        </List>
                      </>
                    )}
                  </AccordionDetails>
                </Accordion>
              ))}
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions>
          {selectedBottleneck.status === 'active' && (
            <Button 
              onClick={() => {
                updateBottleneckStatus(selectedBottleneck.id, 'in_progress');
                setDialogOpen(false);
              }}
              color="warning"
            >
              开始解决
            </Button>
          )}
          
          {selectedBottleneck.status === 'in_progress' && (
            <Button 
              onClick={() => {
                updateBottleneckStatus(selectedBottleneck.id, 'resolved');
                setDialogOpen(false);
              }}
              color="success"
            >
              标记为已解决
            </Button>
          )}
          
          <Button onClick={() => setDialogOpen(false)}>
            关闭
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  
  if (isLoading && bottlenecks.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
        <CircularProgress size={40} sx={{ mr: 2 }} />
        <Typography variant="body1">加载学习瓶颈数据...</Typography>
      </Box>
    );
  }
  
  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        {error}
        <Button 
          color="inherit" 
          size="small" 
          startIcon={<RefreshIcon />}
          onClick={fetchBottlenecks}
          sx={{ ml: 2 }}
        >
          重试
        </Button>
      </Alert>
    );
  }
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2">
          学习瓶颈分析
        </Typography>
        
        <Button 
          variant="outlined" 
          startIcon={<RefreshIcon />}
          onClick={analyzeBottlenecks}
          disabled={isLoading}
        >
          {isLoading ? '分析中...' : '重新分析'}
        </Button>
      </Box>
      
      {bottlenecks.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <CheckCircleIcon color="success" sx={{ fontSize: 60, opacity: 0.7, mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            未检测到学习瓶颈
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            目前没有发现明显的学习障碍。随着学习的深入，我们将持续监控您的学习情况，并提供针对性建议。
          </Typography>
          <Button 
            variant="outlined" 
            startIcon={<RefreshIcon />}
            onClick={analyzeBottlenecks}
          >
            重新分析
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
              严重问题
            </Typography>
            {bottlenecks
              .filter(b => b.severity === SeverityLevel.CRITICAL || b.severity === SeverityLevel.HIGH)
              .filter(b => b.status !== 'resolved')
              .map(renderBottleneckCard)}
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
              中等问题
            </Typography>
            {bottlenecks
              .filter(b => b.severity === SeverityLevel.MEDIUM)
              .filter(b => b.status !== 'resolved')
              .map(renderBottleneckCard)}
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
              轻微问题
            </Typography>
            {bottlenecks
              .filter(b => b.severity === SeverityLevel.LOW)
              .filter(b => b.status !== 'resolved')
              .map(renderBottleneckCard)}
          </Grid>
          
          {bottlenecks.some(b => b.status === 'resolved') && (
            <Grid item xs={12}>
              <Accordion sx={{ mt: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                    <Typography>已解决的问题</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    {bottlenecks
                      .filter(b => b.status === 'resolved')
                      .map(renderBottleneckCard)}
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Grid>
          )}
        </Grid>
      )}
      
      {renderDetailsDialog()}
    </Box>
  );
};

export default BottleneckAnalyzer; 