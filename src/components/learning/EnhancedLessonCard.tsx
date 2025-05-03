'use client';

import React, { useState } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Chip, 
  Button, 
  LinearProgress, 
  IconButton,
  Collapse,
  Tooltip,
  Badge,
  Grid,
  CardActionArea,
  Divider
} from '@mui/material';
import { Bookmark, BookmarkBorder, ExpandMore, ExpandLess } from '@mui/icons-material';
// 假设我们使用其他图标库或模拟这些图标
const AccessTimeIcon = () => <span>⏱️</span>;
const SchoolIcon = () => <span>🎓</span>;
const BookmarkBorderIcon = () => <span>🔖</span>;
const BookmarkIcon = () => <span>📑</span>;
const ExpandMoreIcon = () => <span>⬇️</span>;
const SpellcheckIcon = () => <span>✓</span>;
const TranslateIcon = () => <span>🔤</span>;
const HeadphonesIcon = () => <span>🎧</span>;
import OptimizedImage from '@/components/OptimizedImage';

// 从importTypes.ts导入ContentAnalysisResult
import { ContentAnalysisResult } from '@/types/courses/importTypes';

// 定义ContentKeyword接口
export interface ContentKeyword {
  id: string;
  word: string;
  translation?: string;
  importance: number; // 1-10
  frequency: number;
  examples?: string[];
}

export interface LessonInfo {
  id: string;
  courseId: string;
  title: string;
  subtitle?: string;
  duration: number;
  progress: number;
  wordsCount: number;
  sentencesCount: number;
  keyPoints?: string[];
  description?: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  completionDate?: string | null;
  isBookmarked?: boolean;
  availableModes?: string[];
  keywords?: ContentKeyword[];
  analysisResults?: ContentAnalysisResult;
}

interface EnhancedLessonCardProps {
  lesson: LessonInfo;
  onLessonClick?: (lessonId: string, lessonTitle: string) => void;
  isActive?: boolean;
  showDetailedInfo?: boolean;
  showKeywords?: boolean;
}

export const EnhancedLessonCard: React.FC<EnhancedLessonCardProps> = ({
  lesson,
  onLessonClick,
  isActive = false,
  showDetailedInfo = false,
  showKeywords = false
}) => {
  const [isBookmarked, setIsBookmarked] = useState(lesson.isBookmarked || false);
  const [expanded, setExpanded] = useState(false);

  // 根据进度确定状态标签
  const getLessonStatusLabel = () => {
    if (lesson.progress === 100) return '已完成';
    if (lesson.progress > 0) return '进行中';
    return '未开始';
  };

  // 根据进度确定状态类名
  const getLessonStatusClass = () => {
    if (lesson.progress === 100) return 'success';
    if (lesson.progress > 0) return 'warning';
    return 'info';
  };
  
  // 根据难度返回指示器
  const renderDifficultyIndicator = () => {
    switch (lesson.difficulty) {
      case 1:
        return <Chip size="small" label="入门" color="success" />;
      case 2:
        return <Chip size="small" label="初级" color="success" />;
      case 3:
        return <Chip size="small" label="中级" color="warning" />;
      case 4:
        return <Chip size="small" label="进阶" color="error" />;
      case 5:
        return <Chip size="small" label="高级" color="error" />;
      default:
        return null;
    }
  };

  // 格式化日期
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '未完成';
    const date = new Date(dateString);
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  };

  // 切换书签状态
  const toggleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
    // 这里可以添加API调用来保存书签状态
  };

  // 计算预计完成时间
  const getEstimatedTimeToComplete = () => {
    if (lesson.progress === 100) return '0分钟';
    const remainingPercent = 100 - lesson.progress;
    const estimatedMinutes = Math.round((remainingPercent / 100) * lesson.duration);
    return `${estimatedMinutes}分钟`;
  };

  // 切换展开状态
  const handleExpandClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded(!expanded);
  };

  // 处理点击事件
  const handleClick = () => {
    if (onLessonClick) {
      onLessonClick(lesson.id, lesson.title);
    }
  };

  return (
    <Card 
      sx={{ 
        mb: 2, 
        cursor: onLessonClick ? 'pointer' : 'default',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: 3
        },
        border: isActive ? '2px solid #3f51b5' : 'none'
      }} 
      onClick={handleClick}
    >
      <CardContent sx={{ p: 2 }}>
        <Grid container spacing={2}>
          {/* 左侧：标题和进度信息 */}
          <Grid item sx={{ width: { xs: '100%', md: '66.66%' } }}>
            <Box display="flex" alignItems="center" mb={1}>
              <Badge
                color={getLessonStatusClass() as "success" | "warning" | "info"}
                variant="dot"
                sx={{ mr: 1 }}
              />
              <Typography variant="h6" component="div">
                {lesson.title}
              </Typography>
              <IconButton 
                size="small" 
                onClick={toggleBookmark}
                sx={{ ml: 'auto' }}
              >
                {isBookmarked ? (
                  <BookmarkIcon />
                ) : (
                  <BookmarkBorderIcon />
                )}
              </IconButton>
            </Box>
            
            {lesson.subtitle && (
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {lesson.subtitle}
              </Typography>
            )}
            
            <Box display="flex" alignItems="center" flexWrap="wrap" gap={1} mb={1}>
              {renderDifficultyIndicator()}
              <Chip 
                size="small" 
                icon={<AccessTimeIcon />} 
                label={`${lesson.duration}分钟`} 
              />
              <Chip 
                size="small" 
                icon={<SchoolIcon />} 
                label={`${lesson.wordsCount}词 / ${lesson.sentencesCount}句`} 
              />
              <Chip 
                size="small" 
                color={getLessonStatusClass() as "success" | "warning" | "info"}
                label={getLessonStatusLabel()} 
              />
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Box sx={{ width: '100%', mr: 1 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={lesson.progress} 
                  color={getLessonStatusClass() as "success" | "warning" | "info"}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
              <Typography variant="body2" color="text.secondary">
                {`${Math.round(lesson.progress)}%`}
              </Typography>
            </Box>
            
            {lesson.availableModes && lesson.availableModes.length > 0 && (
              <Box display="flex" gap={1} mt={1}>
                {lesson.availableModes.includes('translate') && (
                  <Tooltip title="翻译模式">
                    <IconButton size="small">
                      <TranslateIcon />
                    </IconButton>
                  </Tooltip>
                )}
                {lesson.availableModes.includes('grammar') && (
                  <Tooltip title="语法模式">
                    <IconButton size="small">
                      <SpellcheckIcon />
                    </IconButton>
                  </Tooltip>
                )}
                {lesson.availableModes.includes('listening') && (
                  <Tooltip title="听力模式">
                    <IconButton size="small">
                      <HeadphonesIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            )}
          </Grid>
          
          {/* 右侧：统计信息 */}
          <Grid item sx={{ width: { xs: '100%', md: '33.33%' } }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <Typography variant="body2" color="text.secondary">
                完成日期: {formatDate(lesson.completionDate)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                预计完成时间: {getEstimatedTimeToComplete()}
              </Typography>
              
              <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                  variant="outlined" 
                  size="small" 
                  endIcon={
                    <ExpandMoreIcon />
                  }
                  onClick={handleExpandClick}
                >
                  {expanded ? '收起' : '详情'}
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
        
        {/* 可展开区域：详细信息 */}
        <Collapse in={expanded}>
          <Box mt={2} pt={2} sx={{ borderTop: '1px solid rgba(0, 0, 0, 0.12)' }}>
            {showDetailedInfo && lesson.description && (
              <Box mb={2}>
                <Typography variant="subtitle2" gutterBottom>
                  课程描述
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {lesson.description}
                </Typography>
              </Box>
            )}
            
            {lesson.keyPoints && lesson.keyPoints.length > 0 && (
              <Box mb={2}>
                <Typography variant="subtitle2" gutterBottom>
                  重点概念
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {lesson.keyPoints.map((point, index) => (
                    <Chip key={index} label={point} size="small" />
                  ))}
                </Box>
              </Box>
            )}
            
            {showKeywords && lesson.keywords && lesson.keywords.length > 0 && (
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  关键词汇
                </Typography>
                <Grid container spacing={1}>
                  {lesson.keywords.slice(0, 6).map((keyword, index) => (
                    <Grid item sx={{ width: { xs: '100%', sm: '50%', md: '33.33%' } }} key={index}>
                      <Card variant="outlined" sx={{ p: 1 }}>
                        <Typography variant="body2" fontWeight="bold">
                          {keyword.word}
                        </Typography>
                        {keyword.translation && (
                          <Typography variant="body2" color="text.secondary">
                            {keyword.translation}
                          </Typography>
                        )}
                      </Card>
                    </Grid>
                  ))}
                </Grid>
                {lesson.keywords.length > 6 && (
                  <Button size="small" sx={{ mt: 1 }}>
                    查看更多词汇 ({lesson.keywords.length - 6})
                  </Button>
                )}
              </Box>
            )}
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default EnhancedLessonCard; 