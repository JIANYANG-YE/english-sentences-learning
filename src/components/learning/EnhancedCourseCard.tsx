'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import OptimizedImage from '@/components/OptimizedImage';

interface CourseProgress {
  completed: number;
  total: number;
  percentage: number;
  lastUpdated: string | null;
  estimatedTimeToComplete: number; // 分钟
  streak: number; // 连续学习天数
}

export interface CourseInfo {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  level: 'beginner' | 'elementary' | 'intermediate' | 'advanced';
  tags: string[];
  type: string;
  totalLessons: number;
  completedLessons: number;
  rating?: number;
  ratingCount?: number;
  progress: CourseProgress;
  features?: string[];
  difficulty?: number; // 1-5
  popularity?: number; // 1-5
  lastStudied?: string | null;
  isFavorite?: boolean;
}

// 课程级别
const LEVEL_LABELS = {
  beginner: '初级',
  elementary: '基础',
  intermediate: '中级',
  advanced: '高级'
};

// 难度星级
const DIFFICULTY_STARS = [1, 2, 3, 4, 5];

interface EnhancedCourseCardProps {
  course: CourseInfo;
  layout?: 'grid' | 'list';
  onFavoriteToggle?: (courseId: string, isFavorite: boolean) => void;
  showDetailedProgress?: boolean;
}

export default function EnhancedCourseCard({ 
  course, 
  layout = 'grid',
  onFavoriteToggle,
  showDetailedProgress = false
}: EnhancedCourseCardProps) {
  const [isFavorite, setIsFavorite] = useState(course.isFavorite || false);
  
  // 获取课程状态标签
  const getCourseStatusLabel = () => {
    if (course.progress.percentage === 0) return '未开始';
    if (course.progress.percentage === 100) return '已完成';
    if (course.progress.percentage >= 80) return '即将完成';
    if (course.progress.percentage >= 50) return '进行中';
    return '已开始';
  };
  
  // 获取课程状态类名
  const getCourseStatusClassName = () => {
    if (course.progress.percentage === 0) return 'bg-gray-600';
    if (course.progress.percentage === 100) return 'bg-green-600';
    if (course.progress.percentage >= 80) return 'bg-yellow-600';
    if (course.progress.percentage >= 50) return 'bg-blue-600';
    return 'bg-purple-600';
  };
  
  // 格式化日期
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '未学习';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.round((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return '今天';
    if (diffDays === 1) return '昨天';
    if (diffDays < 7) return `${diffDays}天前`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}周前`;
    
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  };
  
  // 获取预计完成时间
  const getEstimatedTimeString = (minutes: number) => {
    if (minutes < 1) return '< 1分钟';
    if (minutes < 60) return `${minutes}分钟`;
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours < 24) {
      return remainingMinutes > 0 
        ? `${hours}小时${remainingMinutes}分钟` 
        : `${hours}小时`;
    }
    
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    
    return remainingHours > 0 
      ? `${days}天${remainingHours}小时` 
      : `${days}天`;
  };
  
  // 切换收藏状态
  const toggleFavorite = () => {
    const newState = !isFavorite;
    setIsFavorite(newState);
    if (onFavoriteToggle) {
      onFavoriteToggle(course.id, newState);
    }
  };
  
  // 渲染难度指示器
  const renderDifficultyIndicator = () => {
    const difficulty = course.difficulty || Math.ceil(
      ['beginner', 'elementary', 'intermediate', 'advanced'].indexOf(course.level) / 3 * 5
    ) || 1;
    
    return (
      <div className="flex items-center" title={`难度: ${difficulty}/5`}>
        {DIFFICULTY_STARS.map((star) => (
          <svg
            key={star}
            className={`w-3 h-3 ${star <= difficulty ? 'text-yellow-400' : 'text-gray-600'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };
  
  // 列表布局
  if (layout === 'list') {
    return (
      <div className="bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow relative flex">
        {/* 状态标签 */}
        <div className="absolute top-3 left-3 z-10">
          <span className={`py-1 px-2 text-xs text-white font-medium rounded-full ${getCourseStatusClassName()}`}>
            {getCourseStatusLabel()}
          </span>
        </div>
        
        {/* 课程封面 */}
        <div className="w-1/4 relative">
          <OptimizedImage
            src={course.coverImage}
            alt={course.title}
            width={600}
            height={450}
            className="w-full h-full object-cover"
          />
          
          {/* 进度条 */}
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gray-700">
            <div 
              className={getCourseStatusClassName()}
              style={{ width: `${course.progress.percentage}%` }}
            ></div>
          </div>
        </div>
        
        {/* 课程信息 */}
        <div className="flex-1 p-4 flex flex-col">
          <div className="flex-1">
            {/* 课程类型和难度 */}
            <div className="flex items-center mb-2 space-x-2">
              <span className="px-2 py-0.5 bg-blue-900 text-blue-200 text-xs font-medium rounded">
                {course.type}
              </span>
              <span className="px-2 py-0.5 bg-gray-700 text-gray-300 text-xs font-medium rounded">
                {LEVEL_LABELS[course.level] || course.level}
              </span>
              {renderDifficultyIndicator()}
            </div>
            
            <h3 className="text-lg font-semibold text-white mb-1">{course.title}</h3>
            <p className="text-gray-400 text-sm line-clamp-2">{course.description}</p>
            
            {/* 标签 */}
            {course.tags && course.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {course.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="text-xs text-gray-400 bg-gray-700 px-2 py-0.5 rounded">
                    #{tag}
                  </span>
                ))}
                {course.tags.length > 3 && (
                  <span className="text-xs text-gray-400 bg-gray-700 px-2 py-0.5 rounded">
                    +{course.tags.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>
          
          <div className="mt-3">
            {/* 学习进度 */}
            <div className="mt-2 mb-2">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>学习进度</span>
                <span>{course.completedLessons}/{course.totalLessons}课时</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div 
                  className={getCourseStatusClassName()}
                  style={{ width: `${course.progress.percentage}%` }}
                ></div>
              </div>
            </div>
            
            {/* 进度详情 */}
            {showDetailedProgress && (
              <div className="grid grid-cols-3 gap-2 mt-3">
                <div className="bg-gray-750 p-2 rounded text-center">
                  <span className="text-xs text-gray-400 block">预计完成</span>
                  <span className="text-sm text-white font-medium">
                    {getEstimatedTimeString(course.progress.estimatedTimeToComplete)}
                  </span>
                </div>
                <div className="bg-gray-750 p-2 rounded text-center">
                  <span className="text-xs text-gray-400 block">学习天数</span>
                  <span className="text-sm text-white font-medium">
                    {course.progress.streak} 天
                  </span>
                </div>
                <div className="bg-gray-750 p-2 rounded text-center">
                  <span className="text-xs text-gray-400 block">最近学习</span>
                  <span className="text-sm text-white font-medium">
                    {formatDate(course.lastStudied || null)}
                  </span>
                </div>
              </div>
            )}
            
            <div className="flex justify-between items-center mt-3">
              {/* 最近学习 */}
              <div className="text-sm text-gray-400">
                <div className="flex items-center">
                  <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>最近: {formatDate(course.lastStudied || null)}</span>
                </div>
              </div>
              
              {/* 操作按钮 */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleFavorite}
                  className="p-1.5 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
                  aria-label={isFavorite ? "取消收藏" : "收藏课程"}
                >
                  <svg 
                    className={`w-4 h-4 ${isFavorite ? 'text-yellow-400' : 'text-gray-400'}`} 
                    fill={isFavorite ? 'currentColor' : 'none'} 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </button>
                
                <Link 
                  href={`/courses/${course.id}`}
                  className="bg-blue-600 text-white text-sm font-medium rounded-md px-4 py-1.5 hover:bg-blue-700 transition-colors"
                >
                  {course.progress.percentage > 0 ? '继续学习' : '开始学习'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // 网格布局（默认）
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow relative group">
      {/* 状态标签 */}
      <div className="absolute top-3 left-3 z-10">
        <span className={`py-1 px-2 text-xs text-white font-medium rounded-full ${getCourseStatusClassName()}`}>
          {getCourseStatusLabel()}
        </span>
      </div>
      
      {/* 收藏按钮 */}
      <button 
        onClick={toggleFavorite}
        className="absolute top-3 right-3 z-10 bg-gray-800 bg-opacity-80 p-1.5 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label={isFavorite ? "取消收藏" : "收藏课程"}
      >
        <svg 
          className={`w-5 h-5 ${isFavorite ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-400'}`} 
          fill={isFavorite ? 'currentColor' : 'none'} 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      </button>
      
      {/* 课程封面 */}
      <div className="aspect-[4/3] relative">
        <OptimizedImage
          src={course.coverImage}
          alt={course.title}
          width={600}
          height={450}
          className="transform group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* 进度条 */}
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gray-700">
          <div 
            className={getCourseStatusClassName()}
            style={{ width: `${course.progress.percentage}%` }}
          ></div>
        </div>
      </div>
      
      {/* 课程信息 */}
      <div className="p-4">
        {/* 课程类型和难度 */}
        <div className="flex items-center mb-2 space-x-2">
          <span className="px-2 py-0.5 bg-blue-900 text-blue-200 text-xs font-medium rounded">
            {course.type}
          </span>
          <span className="px-2 py-0.5 bg-gray-700 text-gray-300 text-xs font-medium rounded">
            {LEVEL_LABELS[course.level] || course.level}
          </span>
          {renderDifficultyIndicator()}
        </div>
        
        <h3 className="text-lg font-semibold text-white line-clamp-2 h-14">{course.title}</h3>
        
        {/* 学习进度 */}
        <div className="mt-2 mb-1">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>学习进度</span>
            <span>{course.completedLessons}/{course.totalLessons}课时</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div 
              className={getCourseStatusClassName()}
              style={{ width: `${course.progress.percentage}%` }}
            ></div>
          </div>
        </div>
        
        {/* 进度详情 */}
        {showDetailedProgress && (
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div className="bg-gray-750 p-2 rounded text-center">
              <span className="text-xs text-gray-400 block">预计完成</span>
              <span className="text-sm text-white">
                {getEstimatedTimeString(course.progress.estimatedTimeToComplete)}
              </span>
            </div>
            <div className="bg-gray-750 p-2 rounded text-center">
              <span className="text-xs text-gray-400 block">学习天数</span>
              <span className="text-sm text-white">
                {course.progress.streak} 天
              </span>
            </div>
          </div>
        )}
        
        {/* 最近学习 */}
        <div className="mt-3 text-sm text-gray-400">
          <div className="flex items-center">
            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>最近学习: {formatDate(course.lastStudied || null)}</span>
          </div>
        </div>
        
        {/* 操作按钮 */}
        <div className="mt-4">
          <Link 
            href={`/courses/${course.id}`}
            className="w-full py-2 px-4 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors block text-center"
          >
            {course.progress.percentage > 0 ? '继续学习' : '开始学习'}
          </Link>
        </div>
      </div>
    </div>
  );
} 