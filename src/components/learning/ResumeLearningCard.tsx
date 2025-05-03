'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import resumeLearningService, { LearningRecommendation, CourseResumeInfo } from '@/services/resumeLearningService';

interface ResumeLearningCardProps {
  userId: string;
  maxItems?: number;
}

export default function ResumeLearningCard({ userId, maxItems = 3 }: ResumeLearningCardProps) {
  const router = useRouter();
  const [recommendations, setRecommendations] = useState<LearningRecommendation[]>([]);
  const [inProgressCourses, setInProgressCourses] = useState<CourseResumeInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [fadeIn, setFadeIn] = useState(false);

  // 使用useCallback避免useEffect依赖变化导致的重复加载
  const fetchData = useCallback(async (retry = false) => {
    if (retry) {
      setIsLoading(true);
      setError(null);
    }
    
    try {
      // 并行获取推荐和进行中的课程
      const [recommendationsData, inProgressData] = await Promise.all([
        resumeLearningService.getRecommendations(userId, maxItems, retry),
        resumeLearningService.getInProgressCourses(userId, retry)
      ]);
      
      setRecommendations(recommendationsData);
      setInProgressCourses(inProgressData);
      setError(null);
      // 淡入动画
      setTimeout(() => setFadeIn(true), 50);
    } catch (err) {
      console.error('获取续学数据失败:', err);
      setError('获取学习数据失败，请稍后再试');
    } finally {
      setIsLoading(false);
    }
  }, [userId, maxItems]);

  // 初始加载数据
  useEffect(() => {
    if (userId) {
      setFadeIn(false);
      fetchData();
    }
  }, [userId, fetchData]);

  // 处理重试
  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    fetchData(true);
  };

  // 继续学习
  const handleContinue = (courseId: string, lessonId: string, mode: string, position: number = 0) => {
    try {
      const resumeUrl = resumeLearningService.generateResumeUrl(courseId, lessonId, mode, position);
      router.push(resumeUrl);
    } catch (error) {
      console.error('继续学习失败:', error);
      setError('无法继续学习，请重试');
    }
  };

  // 推荐为空，且没有进行中的课程，不显示卡片
  if (!isLoading && recommendations.length === 0 && inProgressCourses.length === 0 && !error) {
    return null;
  }

  // 格式化时间
  const formatTimeAgo = (dateString: string) => {
    if (!dateString) return '未知时间';
    
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      
      // 检查日期是否有效
      if (isNaN(date.getTime())) return '未知时间';
      
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffMins < 1) return '刚刚';
      if (diffMins < 60) return `${diffMins}分钟前`;
      if (diffHours < 24) return `${diffHours}小时前`;
      if (diffDays < 30) return `${diffDays}天前`;
      
      return `${date.getMonth() + 1}月${date.getDate()}日`;
    } catch (e) {
      console.error('日期格式化错误:', e);
      return '未知时间';
    }
  };

  // 格式化时间字符串
  const getTimeString = (minutes: number) => {
    if (!minutes || minutes < 0) return '未知';
    if (minutes < 1) return '不到1分钟';
    if (minutes < 60) return `约${minutes}分钟`;
    
    const hours = Math.floor(minutes / 60);
    const remainMins = minutes % 60;
    if (remainMins === 0) return `约${hours}小时`;
    return `约${hours}小时${remainMins}分钟`;
  };

  return (
    <div className={`bg-gray-800 rounded-lg overflow-hidden shadow-md transition-opacity duration-300 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
      <div className="px-5 py-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-white flex items-center">
          <svg className="w-5 h-5 mr-2 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
          </svg>
          继续学习
        </h2>
      </div>

      <div className="p-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-3"></div>
            <p className="text-sm text-gray-400">加载中...</p>
          </div>
        ) : error ? (
          <div className="text-center py-6">
            <div className="text-red-400 mb-3">{error}</div>
            <button 
              onClick={handleRetry}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm transition-colors"
            >
              重试加载
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* 顶部推荐 */}
            {recommendations.length > 0 && (
              <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-lg p-4 relative overflow-hidden hover:from-blue-800 hover:to-purple-800 transition-all duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                  <svg viewBox="0 0 24 24" fill="white" className="w-full h-full">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                  </svg>
                </div>
                
                <h3 className="text-white font-medium mb-1">{recommendations[0].title}</h3>
                <p className="text-blue-200 text-sm mb-3">{recommendations[0].description}</p>
                
                <button
                  onClick={() => handleContinue(
                    recommendations[0].courseId,
                    recommendations[0].lessonId,
                    recommendations[0].mode
                  )}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors w-full flex items-center justify-center"
                >
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  立即继续
                </button>
              </div>
            )}
            
            {/* 进行中课程列表 */}
            {inProgressCourses.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-400">最近学习</h3>
                
                {inProgressCourses.map((course) => (
                  <div 
                    key={`${course.courseId}-${course.lessonId}`} 
                    className="flex items-center bg-gray-750 rounded-lg p-3 hover:bg-gray-700 transition-colors cursor-pointer group"
                    onClick={() => handleContinue(
                      course.courseId,
                      course.lessonId,
                      course.mode,
                      course.lastPosition
                    )}
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white text-sm font-medium truncate">{course.title}</h4>
                      <p className="text-gray-400 text-xs truncate mt-1">{course.lessonTitle}</p>
                      
                      <div className="flex flex-wrap items-center mt-2 gap-3">
                        <span className="text-gray-500 text-xs flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {formatTimeAgo(course.lastStudied)}
                        </span>
                        
                        <span className="text-gray-500 text-xs flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          {Math.round(course.progress)}% 完成
                        </span>
                        
                        <span className="text-gray-500 text-xs flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          剩余 {getTimeString(course.estimatedTimeToComplete)}
                        </span>
                      </div>
                      
                      {/* 进度条 */}
                      <div className="w-full bg-gray-700 rounded-full h-1 mt-2 overflow-hidden">
                        <div 
                          className={`h-1 ${
                            course.progress >= 80 ? 'bg-green-500' : 
                            course.progress >= 50 ? 'bg-blue-500' : 'bg-purple-500'
                          }`}
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <button
                      className="ml-4 p-2 bg-blue-600 hover:bg-blue-700 rounded-full flex-shrink-0 transition-colors transform group-hover:scale-110"
                      aria-label="继续学习"
                    >
                      <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </button>
                  </div>
                ))}
                
                {inProgressCourses.length > 0 && (
                  <Link href="/my-courses" className="block text-center text-sm text-blue-400 hover:text-blue-300 mt-4 transition-colors">
                    查看全部学习记录
                  </Link>
                )}
              </div>
            )}
            
            {recommendations.length === 0 && inProgressCourses.length === 0 && (
              <div className="py-6 text-center">
                <svg className="w-12 h-12 mx-auto text-gray-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <p className="text-gray-400">还没有学习记录</p>
                <Link href="/shop" className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm transition-colors">
                  浏览课程
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 