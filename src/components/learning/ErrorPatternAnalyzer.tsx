import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Button,
  Card,
  CardContent,
  LinearProgress,
  Grid,
  useTheme
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ErrorOutline as ErrorOutlineIcon,
  Today as TodayIcon,
  PriorityHigh as PriorityHighIcon,
  Repeat as RepeatIcon,
  LightbulbOutlined as LightbulbOutlinedIcon
} from '@mui/icons-material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

// 错误模式类型
export interface ErrorPattern {
  id: string;
  type: 'grammar' | 'vocabulary' | 'pronunciation' | 'structure' | 'other';
  description: string;
  frequency: number;
  examples: string[];
  suggestions: string[];
  firstOccurrence?: number;
  lastOccurrence?: number;
}

// 组件属性
interface ErrorPatternAnalyzerProps {
  errorPatterns: ErrorPattern[];
  onPatternClick?: (patternId: string) => void;
  showCharts?: boolean;
  showSuggestions?: boolean;
}

/**
 * 错误模式分析组件
 * 
 * 分析并可视化用户学习过程中的常见错误模式：
 * - 按类型和频率分类错误
 * - 提供例子和改进建议
 * - 可视化错误分布
 */
export default function ErrorPatternAnalyzer({
  errorPatterns,
  onPatternClick = () => {},
  showCharts = true,
  showSuggestions = true
}: ErrorPatternAnalyzerProps) {
  const theme = useTheme();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  
  // 按类型分组错误
  const patternsByType = errorPatterns.reduce((acc, pattern) => {
    if (!acc[pattern.type]) {
      acc[pattern.type] = [];
    }
    acc[pattern.type].push(pattern);
    return acc;
  }, {} as Record<string, ErrorPattern[]>);
  
  // 总错误次数
  const totalFrequency = errorPatterns.reduce((sum, pattern) => sum + pattern.frequency, 0);
  
  // 类型映射
  const typeNames: Record<string, string> = {
    grammar: '语法错误',
    vocabulary: '词汇错误',
    pronunciation: '发音错误',
    structure: '句式结构错误',
    other: '其他错误'
  };
  
  // 类型颜色
  const typeColors: Record<string, string> = {
    grammar: theme.palette.error.main,
    vocabulary: theme.palette.warning.main,
    pronunciation: theme.palette.info.main,
    structure: theme.palette.success.main,
    other: theme.palette.grey[500]
  };
  
  // 准备饼图数据
  const pieChartData = Object.entries(patternsByType).map(([type, patterns]) => ({
    name: typeNames[type] || type,
    value: patterns.reduce((sum, pattern) => sum + pattern.frequency, 0),
    color: typeColors[type] || theme.palette.grey[500]
  }));
  
  // 获取前5个最常见错误
  const topErrors = [...errorPatterns]
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, 5);
  
  // 准备柱状图数据
  const barChartData = topErrors.map(pattern => ({
    name: pattern.description.length > 15 
      ? pattern.description.substring(0, 15) + '...' 
      : pattern.description,
    value: pattern.frequency,
    fullName: pattern.description,
    type: pattern.type,
    color: typeColors[pattern.type]
  }));
  
  // 渲染类型选择器
  const renderTypeSelector = () => {
    return (
      <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
        {Object.entries(patternsByType).map(([type, patterns]) => (
          <Chip
            key={type}
            label={`${typeNames[type] || type} (${patterns.length})`}
            onClick={() => setSelectedType(selectedType === type ? null : type)}
            color={selectedType === type ? 'primary' : 'default'}
            style={{ 
              backgroundColor: selectedType === type 
                ? undefined 
                : `${typeColors[type]}20`,
              borderColor: typeColors[type],
              color: selectedType === type ? undefined : typeColors[type]
            }}
            variant={selectedType === type ? 'filled' : 'outlined'}
          />
        ))}
      </Box>
    );
  };
  
  // 渲染错误详情
  const renderErrorDetails = (pattern: ErrorPattern) => {
    return (
      <Accordion key={pattern.id}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box width="100%" display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center">
              <ErrorOutlineIcon 
                style={{ color: typeColors[pattern.type], marginRight: '8px' }} 
              />
              <Typography variant="subtitle1">{pattern.description}</Typography>
            </Box>
            <Chip 
              size="small" 
              label={`出现 ${pattern.frequency} 次`}
              style={{ 
                backgroundColor: `${typeColors[pattern.type]}20`,
                color: typeColors[pattern.type],
                marginLeft: '8px'
              }}
            />
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Box>
            {pattern.examples.length > 0 && (
              <>
                <Typography variant="subtitle2" gutterBottom>错误示例:</Typography>
                <Paper 
                  variant="outlined" 
                  style={{ padding: '8px', backgroundColor: '#f5f5f5', marginBottom: '12px' }}
                >
                  <List dense>
                    {pattern.examples.map((example, idx) => (
                      <ListItem key={idx}>
                        <ListItemIcon style={{ minWidth: '30px' }}>
                          <PriorityHighIcon 
                            fontSize="small" 
                            style={{ color: typeColors[pattern.type] }} 
                          />
                        </ListItemIcon>
                        <ListItemText primary={example} />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </>
            )}
            
            {showSuggestions && pattern.suggestions.length > 0 && (
              <>
                <Typography variant="subtitle2" gutterBottom>改进建议:</Typography>
                <Paper 
                  variant="outlined" 
                  style={{ padding: '8px', backgroundColor: '#f0f7ff', marginBottom: '12px' }}
                >
                  <List dense>
                    {pattern.suggestions.map((suggestion, idx) => (
                      <ListItem key={idx}>
                        <ListItemIcon style={{ minWidth: '30px' }}>
                          <LightbulbOutlinedIcon 
                            fontSize="small" 
                            color="primary" 
                          />
                        </ListItemIcon>
                        <ListItemText primary={suggestion} />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </>
            )}
            
            <Box display="flex" justifyContent="space-between" mt={1}>
              {pattern.firstOccurrence && (
                <Typography variant="caption" color="textSecondary" display="flex" alignItems="center">
                  <TodayIcon fontSize="small" style={{ marginRight: '4px' }} />
                  首次出现: {new Date(pattern.firstOccurrence).toLocaleDateString()}
                </Typography>
              )}
              <Button 
                size="small" 
                color="primary" 
                variant="outlined" 
                onClick={() => onPatternClick(pattern.id)}
              >
                查看更多
              </Button>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
    );
  };
  
  // 渲染错误分布图表
  const renderCharts = () => {
    if (!showCharts) return null;
    
    return (
      <Grid container spacing={2} mb={3}>
        {/* 饼图 - 错误类型分布 */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle1" gutterBottom align="center">
                错误类型分布
              </Typography>
              <Box height={220}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => [`${value} 次 (${((value / totalFrequency) * 100).toFixed(1)}%)`, '频率']}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* 柱状图 - 最常见错误 */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle1" gutterBottom align="center">
                最常见错误
              </Typography>
              <Box height={220}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={barChartData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      width={100}
                    />
                    <Tooltip 
                      formatter={(value: number) => [`${value} 次`, '频率']}
                      labelFormatter={(label) => {
                        const item = barChartData.find(d => d.name === label);
                        return item?.fullName || label;
                      }}
                    />
                    <Bar dataKey="value">
                      {barChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };
  
  // 渲染摘要信息
  const renderSummary = () => {
    return (
      <Box mb={3}>
        <Paper variant="outlined" style={{ padding: '16px' }}>
          <Typography variant="h6" gutterBottom>错误模式分析摘要</Typography>
          <Box display="flex" alignItems="center" mb={1}>
            <RepeatIcon color="action" style={{ marginRight: '8px' }} />
            <Typography variant="body2">
              总共检测到 <strong>{errorPatterns.length}</strong> 种错误模式，
              累计出现 <strong>{totalFrequency}</strong> 次
            </Typography>
          </Box>
          
          {Object.entries(patternsByType).length > 0 && (
            <Box mt={2}>
              <Typography variant="subtitle2" gutterBottom>错误分类比例:</Typography>
              <Box>
                {Object.entries(patternsByType).map(([type, patterns]) => {
                  const typeFrequency = patterns.reduce((sum, p) => sum + p.frequency, 0);
                  const percentage = (typeFrequency / totalFrequency) * 100;
                  
                  return (
                    <Box key={type} mb={1}>
                      <Box display="flex" justifyContent="space-between" mb={0.5}>
                        <Typography variant="body2">{typeNames[type] || type}</Typography>
                        <Typography variant="body2">
                          {typeFrequency} 次 ({percentage.toFixed(1)}%)
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={percentage}
                        style={{ 
                          height: 8, 
                          borderRadius: 4,
                          backgroundColor: `${typeColors[type]}20`,
                        }}
                        sx={{
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: typeColors[type]
                          }
                        }}
                      />
                    </Box>
                  );
                })}
              </Box>
            </Box>
          )}
          
          {topErrors.length > 0 && (
            <Box mt={2}>
              <Typography variant="subtitle2" gutterBottom>
                最需要注意的错误:
              </Typography>
              <Typography variant="body2" color="error">
                {topErrors[0].description}
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>
    );
  };
  
  return (
    <Box>
      {renderSummary()}
      
      {showCharts && renderCharts()}
      
      <Box mb={2}>
        <Typography variant="h6" gutterBottom>错误模式详情</Typography>
        {renderTypeSelector()}
        
        {errorPatterns.length === 0 ? (
          <Box textAlign="center" py={4}>
            <ErrorOutlineIcon style={{ fontSize: 60, color: '#ccc' }} />
            <Typography variant="body1" color="textSecondary" mt={2}>
              尚未检测到错误模式。继续练习以获取分析。
            </Typography>
          </Box>
        ) : (
          <Box>
            {Object.entries(patternsByType)
              .filter(([type]) => selectedType === null || type === selectedType)
              .map(([type, patterns]) => (
                <Box key={type} mb={2}>
                  {selectedType === null && (
                    <Typography 
                      variant="subtitle1" 
                      gutterBottom
                      style={{ color: typeColors[type] }}
                    >
                      {typeNames[type] || type}
                    </Typography>
                  )}
                  
                  {patterns.map(pattern => renderErrorDetails(pattern))}
                </Box>
              ))}
          </Box>
        )}
      </Box>
    </Box>
  );
} 