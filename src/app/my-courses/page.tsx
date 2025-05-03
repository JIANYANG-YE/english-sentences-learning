'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ResumeLearningCard from '@/components/learning/ResumeLearningCard';
import EnhancedCourseCard, { CourseInfo } from '@/components/learning/EnhancedCourseCard';
import resumeLearningService from '@/services/resumeLearningService';

// 模拟用户数据
const currentUser = {
  id: 'user-123',
  name: '学习者'
};

// 模拟用户已获取的课程包数据
const mockCourses: CourseInfo[] = [
  {
    id: '1',
    title: '40篇范文搞定高考3500单词',
    description: '40篇精选范文搞定高考3500单词，来自英语兔',
    coverImage: 'https://placehold.co/600x400/3b82f6/white?text=范文3500',
    level: 'beginner',
    tags: ['范文', '高考', '词汇'],
    type: '高中词汇',
    totalLessons: 40,
    completedLessons: 0,
    rating: 4.8,
    ratingCount: 156,
    features: ['40篇精选范文', '3500个核心词汇', '全部课程音频', '中英文对照'],
    difficulty: 2,
    popularity: 5,
    lastStudied: null,
    progress: {
      completed: 0,
      total: 40,
      percentage: 0,
      lastUpdated: null,
      estimatedTimeToComplete: 2400, // 40小时
      streak: 0
    }
  },
  {
    id: '2',
    title: '300个高频句型系列',
    description: '句乐部英语300个高频句型系列',
    coverImage: 'https://placehold.co/600x400/3b82f6/white?text=高频句型',
    level: 'elementary',
    tags: ['句型', '语法', '口语'],
    type: '语法学习',
    totalLessons: 30,
    completedLessons: 6,
    rating: 4.7,
    ratingCount: 132,
    features: ['300个高频句型', '常用表达', '全部课程音频', '详细语法讲解'],
    difficulty: 3,
    popularity: 4,
    lastStudied: '2024-05-10',
    progress: {
      completed: 6,
      total: 30,
      percentage: 20,
      lastUpdated: '2024-05-10',
      estimatedTimeToComplete: 720, // 12小时
      streak: 3
    }
  },
  {
    id: '3',
    title: '最新雅思考试真题（写作）',
    description: '雅思考试写作技巧，预测话题，还有一对一打分',
    coverImage: 'https://placehold.co/600x400/c084fc/white?text=雅思写作',
    level: 'intermediate',
    tags: ['雅思', '写作', '考试'],
    type: '雅思考试',
    totalLessons: 20,
    completedLessons: 10,
    rating: 4.9,
    ratingCount: 98,
    features: ['最新考试题目', '写作技巧指导', '预测热门话题', '一对一评分反馈'],
    difficulty: 4,
    popularity: 5,
    lastStudied: '2024-05-09',
    progress: {
      completed: 10,
      total: 20,
      percentage: 50,
      lastUpdated: '2024-05-09',
      estimatedTimeToComplete: 300, // 5小时
      streak: 5
    }
  },
  {
    id: '11',
    title: '新概念英语1',
    description: '从零开始学习新概念英语第一册',
    coverImage: 'https://placehold.co/600x400/3b82f6/white?text=新概念1',
    level: 'beginner',
    tags: ['初学者', '新概念', '基础'],
    type: '新概念英语',
    totalLessons: 30,
    completedLessons: 25,
    rating: 4.7,
    ratingCount: 183,
    features: ['发音指导', '基础语法', '简单对话', '日常表达'],
    difficulty: 1,
    popularity: 5,
    lastStudied: '2024-05-11',
    progress: {
      completed: 25,
      total: 30,
      percentage: 83,
      lastUpdated: '2024-05-11',
      estimatedTimeToComplete: 60, // 1小时
      streak: 8
    }
  },
];

// 课程类型列表
const courseTypes = [...new Set(mockCourses.map(course => course.type))];

// 课程级别
const courseLevels = [
  { id: 'beginner', label: '初级' },
  { id: 'elementary', label: '基础' },
  { id: 'intermediate', label: '中级' },
  { id: 'advanced', label: '高级' },
];

export default function MyCourses() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'all' | 'studying' | 'finished'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<'recent' | 'progress' | 'difficulty'>('recent');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showDetailedProgress, setShowDetailedProgress] = useState(false);
  const [courses, setCourses] = useState<CourseInfo[]>(mockCourses);
  
  // 模拟数据加载过程
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // 模拟异步加载用户课程数据
    const timer = setTimeout(() => {
      setCourses(mockCourses);
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  // 处理课程收藏状态变更
  const handleFavoriteToggle = (courseId: string, isFavorite: boolean) => {
    setCourses(prevCourses => 
      prevCourses.map(course => 
        course.id === courseId ? { ...course, isFavorite } : course
      )
    );
  };
  
  // 处理续学课程
  const handleContinueLearning = async (courseId: string) => {
    try {
      // 查找课程的学习位置
      const lastPosition = await resumeLearningService.getLastPosition(currentUser.id, courseId);
      
      if (lastPosition) {
        // 如果有上次学习记录，跳转到继续学习位置
        const resumeUrl = resumeLearningService.generateResumeUrl(
          lastPosition.courseId,
          lastPosition.lessonId,
          lastPosition.mode,
          lastPosition.position
        );
        router.push(resumeUrl);
      } else {
        // 否则跳转到课程详情页
        router.push(`/courses/${courseId}`);
      }
    } catch (error) {
      console.error('继续学习失败:', error);
      // 如果发生错误，直接跳转到课程详情页
      router.push(`/courses/${courseId}`);
    }
  };
  
  // 过滤课程包
  const filteredCourses = courses.filter(course => {
    // 搜索过滤
    const matchesSearch = searchQuery ? 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) : true;
    
    // 标签过滤
    let matchesTab = true;
    if (activeTab === 'studying') {
      matchesTab = course.progress.percentage > 0 && course.progress.percentage < 100;
    } else if (activeTab === 'finished') {
      matchesTab = course.progress.percentage === 100;
    }
    
    // 类型过滤
    const matchesType = selectedType ? course.type === selectedType : true;
    
    // 级别过滤
    const matchesLevel = selectedLevel ? course.level === selectedLevel : true;
    
    return matchesSearch && matchesTab && matchesType && matchesLevel;
  }).sort((a, b) => {
    if (sortOption === 'recent') {
      // 按最近学习排序，未学习的排最后
      const aDate = a.lastStudied ? new Date(a.lastStudied).getTime() : 0;
      const bDate = b.lastStudied ? new Date(b.lastStudied).getTime() : 0;
      return bDate - aDate;
    } else if (sortOption === 'progress') {
      // 按进度排序
      return b.progress.percentage - a.progress.percentage;
    } else {
      // 按难度排序
      return (b.difficulty || 1) - (a.difficulty || 1);
    }
  });
  
  return (
    <div className="space-y-6 py-4 bg-gray-900 text-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-2">
          <h1 className="text-2xl font-bold">我的课程包</h1>
        </div>
        
        {/* 续学卡片 - 添加的新组件 */}
        {!isLoading && (
          <div className="mb-6">
            <ResumeLearningCard userId={currentUser.id} />
          </div>
        )}
        
        {/* 提示信息 */}
        <div className="flex items-center bg-gray-800 text-purple-300 p-4 rounded-lg mb-6">
          <svg className="w-6 h-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>课程包收集更多学习材料，快去找一个适合您的吧！</span>
          <Link href="/shop" className="ml-auto bg-purple-600 text-white py-1.5 px-4 rounded-md hover:bg-purple-700 transition-colors text-sm font-medium">
            去商城看看
          </Link>
        </div>
        
        {/* 标签切换 */}
        <div className="flex mb-6 border-b border-gray-700">
          <button
            className={`py-4 px-6 font-medium text-sm relative ${
              activeTab === 'all' 
                ? 'text-blue-400 border-b-2 border-blue-400' 
                : 'text-gray-400 hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('all')}
          >
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              全部课程
            </span>
          </button>
          <button
            className={`py-4 px-6 font-medium text-sm relative ${
              activeTab === 'studying' 
                ? 'text-blue-400 border-b-2 border-blue-400' 
                : 'text-gray-400 hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('studying')}
          >
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              进行中
            </span>
          </button>
          <button
            className={`py-4 px-6 font-medium text-sm relative ${
              activeTab === 'finished' 
                ? 'text-blue-400 border-b-2 border-blue-400' 
                : 'text-gray-400 hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('finished')}
          >
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              已完成
            </span>
          </button>
        </div>
        
        {/* 搜索和筛选 */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* 搜索框 */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-600 bg-gray-700 rounded-md leading-5 text-white placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="搜索课程、标签或关键词..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* 排序、布局和筛选按钮 */}
            <div className="flex gap-2 items-center">
              <select
                className="py-2 px-3 border border-gray-600 bg-gray-700 rounded-md shadow-sm text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as 'recent' | 'progress' | 'difficulty')}
              >
                <option value="recent">最近学习</option>
                <option value="progress">学习进度</option>
                <option value="difficulty">难度等级</option>
              </select>
              
              {/* 视图切换 */}
              <div className="flex bg-gray-700 rounded-md border border-gray-600 p-0.5">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-gray-600' : 'hover:bg-gray-650'}`}
                  aria-label="网格视图"
                >
                  <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-gray-600' : 'hover:bg-gray-650'}`}
                  aria-label="列表视图"
                >
                  <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
              
              {/* 详细进度显示开关 */}
              <button
                onClick={() => setShowDetailedProgress(!showDetailedProgress)}
                className={`p-1.5 rounded border border-gray-600 ${
                  showDetailedProgress ? 'bg-blue-600 text-white border-blue-500' : 'bg-gray-700 text-gray-300'
                }`}
                aria-label={showDetailedProgress ? "隐藏详细进度" : "显示详细进度"}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </button>
              
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center px-4 py-2 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="h-5 w-5 mr-2 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                </svg>
                筛选
              </button>
            </div>
          </div>
          
          {/* 筛选条件 */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">课程类型</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedType(null)}
                    className={`px-3 py-1 text-sm rounded-full ${
                      selectedType === null ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    全部
                  </button>
                  {courseTypes.map(type => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className={`px-3 py-1 text-sm rounded-full ${
                        selectedType === type ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">难度级别</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedLevel(null)}
                    className={`px-3 py-1 text-sm rounded-full ${
                      selectedLevel === null ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    全部
                  </button>
                  {courseLevels.map(level => (
                    <button
                      key={level.id}
                      onClick={() => setSelectedLevel(level.id)}
                      className={`px-3 py-1 text-sm rounded-full ${
                        selectedLevel === level.id ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {level.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* 课程列表 - 显示加载状态 */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* 课程列表 - 使用新的增强卡片组件 */}
            <div className={
              viewMode === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
            }>
              {filteredCourses.map(course => (
                <EnhancedCourseCard 
                  key={course.id}
                  course={course}
                  layout={viewMode}
                  onFavoriteToggle={handleFavoriteToggle}
                  showDetailedProgress={showDetailedProgress}
                />
              ))}
            </div>
            
            {/* 没有课程时的提示 */}
            {filteredCourses.length === 0 && (
              <div className="py-12 text-center bg-gray-800 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <h2 className="mt-4 text-xl font-semibold text-gray-300">暂无相关课程</h2>
                <p className="mt-2 text-gray-400 max-w-md mx-auto">
                  {activeTab === 'all' ? 
                    '您还没有获取任何课程，去课程包商城看看吧' : 
                    activeTab === 'studying' ? 
                      '您目前没有正在学习的课程' : 
                      '您还没有完成的课程'
                  }
                </p>
                {activeTab === 'all' && (
                  <Link href="/shop" className="mt-6 inline-block bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium">
                    去商城看看
                  </Link>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 