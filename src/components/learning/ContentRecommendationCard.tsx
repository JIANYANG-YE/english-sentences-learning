'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Chip, 
  Button, 
  Divider, 
  Grid,
  IconButton,
  CardActionArea,
  Skeleton
} from '@mui/material';
import Link from 'next/link';
import { DifficultyLevel } from '@/services/adaptiveLearningService';

// 简化的图标组件
const AccessTimeIcon = () => <span>⏱️</span>;
const SchoolIcon = () => <span>🎓</span>;
const TrendingUpIcon = () => <span>📈</span>;
const LocalOfferIcon = () => <span>🏷️</span>;
const InfoIcon = () => <span>ℹ️</span>;
const ArrowForwardIcon = () => <span>→</span>;

// 内容标签接口
export interface ContentTag {
  id: string;
  name: string;
  category: 'grammar' | 'vocabulary' | 'pronunciation' | 'listening' | 'speaking' | 'reading' | 'writing' | 'culture';
}

// 课程推荐接口
export interface CourseRecommendation {
  courseId: string;
  title: string;
  description: string;
  matchScore: number; // 0-100 相似度分数
  tags: ContentTag[];
  difficulty: DifficultyLevel;
  estimatedTimeMinutes?: number;
  reasonForRecommendation: string[];
  imageUrl?: string;
}

// 章节推荐接口
export interface LessonRecommendation {
  lessonId: string;
  courseId: string;
  title: string;
  description?: string;
  matchScore: number; // 0-100 相似度分数
  tags: ContentTag[];
  difficulty: DifficultyLevel;
  estimatedTimeMinutes: number;
  reasonForRecommendation: string[];
  imageUrl?: string;
}

// 练习推荐接口
export interface PracticeRecommendation {
  id: string;
  title: string;
  description?: string;
  activityType: string;
  difficulty: DifficultyLevel;
  estimatedTimeMinutes: number;
  targetSkill: string;
  reasonForRecommendation: string[];
  imageUrl?: string;
}

// 组件属性
interface ContentRecommendationCardProps {
  title?: string;
  courses?: CourseRecommendation[];
  lessons?: LessonRecommendation[];
  practices?: PracticeRecommendation[];
  loading?: boolean;
  compact?: boolean;
  maxItems?: number;
  showMatchScore?: boolean;
  showReasons?: boolean;
  userId?: string;
  onSelect?: (type: 'course' | 'lesson' | 'practice', id: string) => void;
}

/**
 * 内容推荐卡片组件
 * 展示基于用户学习历史和偏好的个性化推荐
 */
const ContentRecommendationCard: React.FC<ContentRecommendationCardProps> = ({
  title = "为您推荐",
  courses = [],
  lessons = [],
  practices = [],
  loading = false,
  compact = false,
  maxItems = 3,
  showMatchScore = true,
  showReasons = true,
  userId,
  onSelect
}) => {
  const [activeTab, setActiveTab] = useState<'courses' | 'lessons' | 'practices'>('courses');
  const [expanded, setExpanded] = useState<boolean>(!compact);
  
  // 确定显示哪个标签页
  useEffect(() => {
    if (courses.length > 0) {
      setActiveTab('courses');
    } else if (lessons.length > 0) {
      setActiveTab('lessons');
    } else if (practices.length > 0) {
      setActiveTab('practices');
    }
  }, [courses, lessons, practices]);

  // 渲染难度标签
  const renderDifficultyBadge = (difficulty: DifficultyLevel) => {
    const colors = ['success', 'info', 'primary', 'warning', 'error'];
    const labels = ['入门', '初级', '中级', '进阶', '高级'];
    
    return (
      <Chip 
        label={labels[difficulty - 1]} 
        size="small" 
        color={colors[difficulty - 1] as any}
        sx={{ ml: 1 }}
      />
    );
  };
  
  // 渲染匹配分数
  const renderMatchScore = (score: number) => {
    let color = 'success.main';
    if (score < 70) color = 'warning.main';
    if (score < 50) color = 'text.secondary';
    
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
        <Typography variant="body2" sx={{ color, fontWeight: 500 }}>
          匹配度: {score}%
        </Typography>
      </Box>
    );
  };
  
  // 渲染课程推荐
  const renderCourses = () => {
    const displayCourses = courses.slice(0, maxItems);
    
    if (loading) {
      return Array.from(new Array(3)).map((_, index) => (
        <Card key={index} variant="outlined" sx={{ mb: 2 }}>
          <CardContent>
            <Skeleton variant="text" width="60%" height={28} />
            <Skeleton variant="text" width="90%" height={20} sx={{ mb: 1 }} />
            <Skeleton variant="rectangular" height={40} sx={{ mb: 1 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Skeleton variant="text" width="30%" />
              <Skeleton variant="text" width="20%" />
            </Box>
          </CardContent>
        </Card>
      ));
    }
    
    if (displayCourses.length === 0) {
      return (
        <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
          暂无课程推荐
        </Typography>
      );
    }
    
    return displayCourses.map((course) => (
      <Card 
        key={course.courseId} 
        variant="outlined"
        sx={{ 
          mb: 2,
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: 2
          }
        }}
      >
        <CardActionArea 
          component={Link}
          href={`/courses/${course.courseId}`}
          onClick={() => onSelect && onSelect('course', course.courseId)}
        >
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
              <Typography variant="h6" component="div">
                {course.title}
                {renderDifficultyBadge(course.difficulty)}
              </Typography>
              {showMatchScore && renderMatchScore(course.matchScore)}
            </Box>
            
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {course.description}
            </Typography>
            
            {course.tags && course.tags.length > 0 && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                {course.tags.slice(0, 3).map((tag) => (
                  <Chip 
                    key={tag.id} 
                    label={tag.name} 
                    size="small"
                    variant="outlined"
                  />
                ))}
                {course.tags.length > 3 && (
                  <Chip 
                    label={`+${course.tags.length - 3}`}
                    size="small"
                    variant="outlined"
                  />
                )}
              </Box>
            )}
            
            {showReasons && course.reasonForRecommendation && course.reasonForRecommendation.length > 0 && (
              <Box sx={{ mt: 1, p: 1, bgcolor: 'background.paper', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                  <InfoIcon /> <span style={{ marginLeft: 4 }}>推荐原因: {course.reasonForRecommendation[0]}</span>
                </Typography>
              </Box>
            )}
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
              {course.estimatedTimeMinutes && (
                <Chip 
                  icon={<AccessTimeIcon />}
                  label={`${course.estimatedTimeMinutes}分钟`}
                  size="small"
                  variant="outlined"
                />
              )}
              <Button 
                size="small" 
                endIcon={<ArrowForwardIcon />}
                sx={{ ml: 'auto' }}
              >
                查看课程
              </Button>
            </Box>
          </CardContent>
        </CardActionArea>
      </Card>
    ));
  };
  
  // 渲染章节推荐
  const renderLessons = () => {
    const displayLessons = lessons.slice(0, maxItems);
    
    if (loading) {
      return Array.from(new Array(3)).map((_, index) => (
        <Card key={index} variant="outlined" sx={{ mb: 2 }}>
          <CardContent>
            <Skeleton variant="text" width="60%" height={28} />
            <Skeleton variant="text" width="90%" height={20} sx={{ mb: 1 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Skeleton variant="text" width="30%" />
              <Skeleton variant="text" width="20%" />
            </Box>
          </CardContent>
        </Card>
      ));
    }
    
    if (displayLessons.length === 0) {
      return (
        <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
          暂无章节推荐
        </Typography>
      );
    }
    
    return displayLessons.map((lesson) => (
      <Card 
        key={lesson.lessonId} 
        variant="outlined"
        sx={{ 
          mb: 2,
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: 2
          }
        }}
      >
        <CardActionArea 
          component={Link}
          href={`/courses/${lesson.courseId}/lessons/${lesson.lessonId}`}
          onClick={() => onSelect && onSelect('lesson', lesson.lessonId)}
        >
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
              <Typography variant="h6" component="div">
                {lesson.title}
                {renderDifficultyBadge(lesson.difficulty)}
              </Typography>
              {showMatchScore && renderMatchScore(lesson.matchScore)}
            </Box>
            
            {lesson.description && (
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {lesson.description}
              </Typography>
            )}
            
            {lesson.tags && lesson.tags.length > 0 && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                {lesson.tags.slice(0, 3).map((tag) => (
                  <Chip 
                    key={tag.id} 
                    label={tag.name} 
                    size="small"
                    variant="outlined"
                  />
                ))}
                {lesson.tags.length > 3 && (
                  <Chip 
                    label={`+${lesson.tags.length - 3}`}
                    size="small"
                    variant="outlined"
                  />
                )}
              </Box>
            )}
            
            {showReasons && lesson.reasonForRecommendation && lesson.reasonForRecommendation.length > 0 && (
              <Box sx={{ mt: 1, p: 1, bgcolor: 'background.paper', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                  <InfoIcon /> <span style={{ marginLeft: 4 }}>推荐原因: {lesson.reasonForRecommendation[0]}</span>
                </Typography>
              </Box>
            )}
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
              <Chip 
                icon={<AccessTimeIcon />}
                label={`${lesson.estimatedTimeMinutes}分钟`}
                size="small"
                variant="outlined"
              />
              <Button 
                size="small" 
                endIcon={<ArrowForwardIcon />}
                sx={{ ml: 'auto' }}
              >
                开始学习
              </Button>
            </Box>
          </CardContent>
        </CardActionArea>
      </Card>
    ));
  };
  
  // 渲染练习推荐
  const renderPractices = () => {
    const displayPractices = practices.slice(0, maxItems);
    
    if (loading) {
      return Array.from(new Array(3)).map((_, index) => (
        <Card key={index} variant="outlined" sx={{ mb: 2 }}>
          <CardContent>
            <Skeleton variant="text" width="60%" height={28} />
            <Skeleton variant="text" width="90%" height={20} sx={{ mb: 1 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Skeleton variant="text" width="30%" />
              <Skeleton variant="text" width="20%" />
            </Box>
          </CardContent>
        </Card>
      ));
    }
    
    if (displayPractices.length === 0) {
      return (
        <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
          暂无练习推荐
        </Typography>
      );
    }
    
    return displayPractices.map((practice) => (
      <Card 
        key={practice.id} 
        variant="outlined"
        sx={{ 
          mb: 2,
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: 2
          }
        }}
      >
        <CardActionArea onClick={() => onSelect && onSelect('practice', practice.id)}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
              <Typography variant="h6" component="div">
                {practice.title}
                {renderDifficultyBadge(practice.difficulty)}
              </Typography>
            </Box>
            
            {practice.description && (
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {practice.description}
              </Typography>
            )}
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
              <Chip 
                label={practice.activityType}
                size="small"
                color="primary"
                variant="outlined"
              />
              <Chip 
                label={`目标技能: ${practice.targetSkill}`}
                size="small"
                variant="outlined"
              />
            </Box>
            
            {showReasons && practice.reasonForRecommendation && practice.reasonForRecommendation.length > 0 && (
              <Box sx={{ mt: 1, p: 1, bgcolor: 'background.paper', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                  <InfoIcon /> <span style={{ marginLeft: 4 }}>推荐原因: {practice.reasonForRecommendation[0]}</span>
                </Typography>
              </Box>
            )}
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
              <Chip 
                icon={<AccessTimeIcon />}
                label={`${practice.estimatedTimeMinutes}分钟`}
                size="small"
                variant="outlined"
              />
              <Button 
                size="small" 
                endIcon={<ArrowForwardIcon />}
                sx={{ ml: 'auto' }}
              >
                开始练习
              </Button>
            </Box>
          </CardContent>
        </CardActionArea>
      </Card>
    ));
  };

  return (
    <Card variant="outlined" sx={{ mb: 3 }}>
      <CardContent sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
            <TrendingUpIcon />
            <span style={{ marginLeft: 8 }}>{title}</span>
          </Typography>
          
          {compact && (
            <Button 
              size="small" 
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? '收起' : '展开'}
            </Button>
          )}
        </Box>
        
        {expanded && (
          <>
            {/* 标签页 */}
            {(courses.length > 0 || lessons.length > 0 || practices.length > 0) && (
              <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
                {courses.length > 0 && (
                  <Chip 
                    label={`课程 (${courses.length})`}
                    variant={activeTab === 'courses' ? 'filled' : 'outlined'}
                    color={activeTab === 'courses' ? 'primary' : 'default'}
                    onClick={() => setActiveTab('courses')}
                  />
                )}
                {lessons.length > 0 && (
                  <Chip 
                    label={`章节 (${lessons.length})`}
                    variant={activeTab === 'lessons' ? 'filled' : 'outlined'}
                    color={activeTab === 'lessons' ? 'primary' : 'default'}
                    onClick={() => setActiveTab('lessons')}
                  />
                )}
                {practices.length > 0 && (
                  <Chip 
                    label={`练习 (${practices.length})`}
                    variant={activeTab === 'practices' ? 'filled' : 'outlined'}
                    color={activeTab === 'practices' ? 'primary' : 'default'}
                    onClick={() => setActiveTab('practices')}
                  />
                )}
              </Box>
            )}
            
            {/* 内容区 */}
            <Box>
              {activeTab === 'courses' && renderCourses()}
              {activeTab === 'lessons' && renderLessons()}
              {activeTab === 'practices' && renderPractices()}
            </Box>
            
            {/* 更多按钮 */}
            {((activeTab === 'courses' && courses.length > maxItems) ||
              (activeTab === 'lessons' && lessons.length > maxItems) ||
              (activeTab === 'practices' && practices.length > maxItems)) && (
              <Box sx={{ textAlign: 'center', mt: 1 }}>
                <Button 
                  size="small" 
                  variant="text"
                >
                  查看更多推荐
                </Button>
              </Box>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ContentRecommendationCard; 