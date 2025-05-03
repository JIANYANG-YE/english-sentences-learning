'use client';

import { useState } from 'react';
import Link from 'next/link';
import OptimizedImage from '@/components/OptimizedImage';

// 模拟课程包数据
const coursePackages = [
  {
    id: '1',
    title: '40篇范文搞定高考3500单词',
    description: '40篇精选范文搞定高考3500单词，来自英语兔',
    price: 0,
    isFree: true,
    isFeatured: true,
    level: 'beginner',
    coverImage: 'https://placehold.co/600x400/3b82f6/white?text=范文3500',
    totalLessons: 40,
    completedLessons: 0,
    progress: 0,
    rating: 4.8,
    ratingCount: 156,
    features: ['40篇精选范文', '3500个核心词汇', '全部课程音频', '中英文对照'],
    type: '高中词汇',
    students: 2354,
    lastUpdated: '2023-12-15'
  },
  {
    id: '2',
    title: '300个高频句型系列',
    description: '句乐部英语300个高频句型系列',
    price: 0,
    isFree: true,
    isFeatured: true,
    level: 'elementary',
    coverImage: 'https://placehold.co/600x400/3b82f6/white?text=高频句型',
    totalLessons: 30,
    completedLessons: 0,
    progress: 0,
    rating: 4.7,
    ratingCount: 132,
    features: ['300个高频句型', '常用表达', '全部课程音频', '详细语法讲解'],
    type: '语法学习',
    students: 1863,
    lastUpdated: '2023-11-20'
  },
  {
    id: '3',
    title: '最新雅思考试真题（写作）',
    description: '雅思考试写作技巧，预测话题，还有一对一打分',
    price: 39.9,
    isFree: false,
    isFeatured: true,
    level: 'intermediate',
    coverImage: 'https://placehold.co/600x400/c084fc/white?text=雅思写作',
    totalLessons: 20,
    completedLessons: 0,
    progress: 0,
    rating: 4.9,
    ratingCount: 98,
    features: ['最新考试题目', '写作技巧指导', '预测热门话题', '一对一评分反馈'],
    type: '雅思考试',
    students: 985,
    lastUpdated: '2024-01-10'
  },
  {
    id: '4',
    title: 'SST预测（考拉PTE）',
    description: '考拉PTE，是由Harry老师于2019年，在澳洲成立的一家...',
    price: 49.9,
    isFree: false,
    isFeatured: false,
    level: 'advanced',
    coverImage: 'https://placehold.co/600x400/c084fc/white?text=考拉PTE',
    totalLessons: 25,
    completedLessons: 0,
    progress: 0,
    rating: 4.6,
    ratingCount: 78,
    features: ['SST预测', '考试技巧', '实战模拟', '评分反馈'],
    type: 'PTE考试',
    students: 763,
    lastUpdated: '2023-12-05'
  },
  {
    id: '5',
    title: 'WFD360（考拉PTE）',
    description: '考拉PTE，是由Harry老师于2019年，在澳洲成立的一家...',
    price: 29.9,
    isFree: false,
    isFeatured: false,
    level: 'intermediate',
    coverImage: 'https://placehold.co/600x400/c084fc/white?text=考拉PTE',
    totalLessons: 20,
    completedLessons: 0,
    progress: 0,
    rating: 4.5,
    ratingCount: 64,
    features: ['360道题目', '听力技巧', '拼写指导', '评分标准解析'],
    type: 'PTE考试',
    students: 682,
    lastUpdated: '2023-11-15'
  },
  {
    id: '6',
    title: '考拉写作（考拉PTE）',
    description: '考拉PTE，是由Harry老师于2019年，在澳洲成立的一家...',
    price: 19.9,
    isFree: false,
    isFeatured: false,
    level: 'elementary',
    coverImage: 'https://placehold.co/600x400/10b981/white?text=考拉PTE',
    totalLessons: 15,
    completedLessons: 0,
    progress: 0,
    rating: 4.4,
    ratingCount: 42,
    features: ['写作评分标准', '模板句型', '高分攻略', '常见错误分析'],
    type: 'PTE考试',
    students: 529,
    lastUpdated: '2023-10-20'
  },
  {
    id: '7',
    title: 'FIBL核心500（考拉PTE）',
    description: '考拉PTE，是由Harry老师于2019年，在澳洲成立的一家...',
    price: 29.9,
    isFree: false,
    isFeatured: false,
    level: 'intermediate',
    coverImage: 'https://placehold.co/600x400/gray/white?text=考拉PTE',
    totalLessons: 30,
    completedLessons: 0,
    progress: 0,
    rating: 4.6,
    ratingCount: 58,
    features: ['500核心题目', '填空技巧', '词汇积累', '答题策略'],
    type: 'PTE考试',
    students: 614,
    lastUpdated: '2023-11-05'
  },
  {
    id: '8',
    title: '零基础英语课程',
    description: '您绝对会坚持到底',
    price: 0,
    isFree: true,
    isFeatured: false,
    level: 'beginner',
    coverImage: 'https://placehold.co/600x400/4f46e5/white?text=零基础英语',
    totalLessons: 20,
    completedLessons: 0,
    progress: 0,
    rating: 4.8,
    ratingCount: 125,
    features: ['字母发音', '基础单词', '简单句型', '日常对话'],
    type: '基础入门',
    students: 2147,
    lastUpdated: '2023-09-15'
  },
  {
    id: '9',
    title: 'TOEFL备考专项',
    description: '针对托福考试的全面备考课程',
    price: 39.9,
    isFree: false,
    isFeatured: false,
    level: 'advanced',
    coverImage: 'https://placehold.co/600x400/purple/white?text=TOEFL',
    totalLessons: 40,
    completedLessons: 0,
    progress: 0,
    rating: 4.7,
    ratingCount: 89,
    features: ['听说读写全面覆盖', '高分策略', '模拟测试', '名师点评'],
    type: '托福考试',
    students: 872,
    lastUpdated: '2023-12-20'
  },
  {
    id: '10',
    title: '高中英语词汇大全',
    description: '高中阶段必须掌握的全部英语词汇',
    price: 0,
    isFree: true,
    isFeatured: true,
    level: 'intermediate',
    coverImage: 'https://placehold.co/600x400/22c55e/white?text=高中词汇',
    totalLessons: 50,
    completedLessons: 0,
    progress: 0,
    rating: 4.9,
    ratingCount: 215,
    features: ['3500核心词汇', '高频短语', '记忆技巧', '配套练习'],
    type: '高中词汇',
    students: 3128,
    lastUpdated: '2024-01-05'
  },
  {
    id: '11',
    title: '新概念英语1',
    description: '从零开始学习新概念英语第一册',
    price: 0, 
    isFree: true,
    isFeatured: false,
    level: 'beginner',
    coverImage: 'https://placehold.co/600x400/3b82f6/white?text=新概念1',
    totalLessons: 30,
    completedLessons: 0,
    progress: 0,
    rating: 4.7,
    ratingCount: 183,
    features: ['发音指导', '基础语法', '简单对话', '日常表达'],
    type: '新概念英语',
    students: 2534,
    lastUpdated: '2023-10-10'
  },
  {
    id: '12',
    title: '新概念英语2',
    description: '新概念英语第二册学习',
    price: 0,
    isFree: true,
    isFeatured: true,
    level: 'elementary',
    coverImage: 'https://placehold.co/600x400/3b82f6/white?text=新概念2',
    totalLessons: 25,
    completedLessons: 0,
    progress: 0,
    rating: 4.8,
    ratingCount: 76,
    features: ['实用语法', '词汇扩充', '表达技巧', '阅读能力'],
    type: '新概念英语',
    students: 2124,
    lastUpdated: '2024-01-10'
  },
  {
    id: '13',
    title: '新概念英语3',
    description: '新概念英语第三册学习',
    price: 29.9,
    isFree: false,
    isFeatured: true,
    level: 'intermediate',
    coverImage: 'https://placehold.co/600x400/c084fc/white?text=新概念3',
    totalLessons: 25,
    completedLessons: 0,
    progress: 0,
    rating: 4.9,
    ratingCount: 86,
    features: ['高级语法', '丰富词汇', '写作技巧', '进阶阅读'],
    type: '新概念英语',
    students: 1562,
    lastUpdated: '2024-02-15'
  },
];

// 课程类型列表
const courseTypes = [...new Set(coursePackages.map(course => course.type))];

// 课程级别
const courseLevels = [
  { id: 'beginner', label: '初级' },
  { id: 'elementary', label: '基础' },
  { id: 'intermediate', label: '中级' },
  { id: 'advanced', label: '高级' },
];

export default function Shop() {
  const [activeTab, setActiveTab] = useState<'free' | 'member'>('free');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<'newest' | 'popular'>('newest');
  const [showFilters, setShowFilters] = useState(false);
  
  // 过滤课程包
  const filteredCourses = coursePackages.filter(course => {
    // 搜索过滤
    const matchesSearch = searchQuery ? 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) : true;
    
    // 标签过滤
    const matchesTab = activeTab === 'free' ? course.isFree : !course.isFree;
    
    // 类型过滤
    const matchesType = selectedType ? course.type === selectedType : true;
    
    // 级别过滤
    const matchesLevel = selectedLevel ? course.level === selectedLevel : true;
    
    return matchesSearch && matchesTab && matchesType && matchesLevel;
  }).sort((a, b) => {
    if (sortOption === 'newest') {
      return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
    } else {
      return b.students - a.students;
    }
  });
  
  // 获取课程状态标签
  const getCourseStatusLabel = (course: typeof coursePackages[0]) => {
    if (course.progress === 0) return '未开始';
    if (course.progress === 100) return '已完成';
    return '进行中';
  };
  
  // 获取课程状态类名
  const getCourseStatusClassName = (course: typeof coursePackages[0]) => {
    if (course.progress === 0) return 'bg-gray-200';
    if (course.progress === 100) return 'bg-green-500';
    return 'bg-blue-500';
  };
  
  // 显示课程级别
  const getLevelLabel = (level: string) => {
    return courseLevels.find(l => l.id === level)?.label || level;
  };
  
  return (
    <div className="space-y-6 py-4 bg-gray-900 text-white">
      <div className="flex flex-col">
        <div className="mb-2">
          <h1 className="text-2xl font-bold">课程包商城</h1>
        </div>
        
        {/* 标签切换 */}
        <div className="flex mb-6 border-b border-gray-700">
          <button
            className={`py-4 px-6 font-medium text-sm relative ${
              activeTab === 'free' 
                ? 'text-blue-400 border-b-2 border-blue-400' 
                : 'text-gray-400 hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('free')}
          >
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12H19M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              免费课程
            </span>
          </button>
          <button
            className={`py-4 px-6 font-medium text-sm relative ${
              activeTab === 'member' 
                ? 'text-purple-400 border-b-2 border-purple-400' 
                : 'text-gray-400 hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('member')}
          >
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 21V5C16 3.89543 15.1046 3 14 3H10C8.89543 3 8 3.89543 8 5V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 16H2M22 21H2M22 11H16M8 11H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              会员共享
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
                placeholder="搜索课程..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* 排序和筛选按钮 */}
            <div className="flex gap-2">
              <select
                className="block w-full max-w-[200px] py-2 px-3 border border-gray-600 bg-gray-700 rounded-md shadow-sm text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as 'newest' | 'popular')}
              >
                <option value="newest">最新上线</option>
                <option value="popular">最多学习</option>
              </select>
              
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
        
        {/* 课程列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCourses.map(course => (
            <div key={course.id} className="bg-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition-shadow relative group">
              {/* 状态标签 */}
              <div className="absolute top-3 left-3 z-10">
                <span className={`py-1 px-2 text-xs text-white font-medium rounded-full bg-opacity-90 ${
                  course.isFree ? 'bg-blue-600' : 'bg-purple-600'
                }`}>
                  {course.isFree ? '免费' : '会员'}
                </span>
              </div>
              
              {/* 收藏按钮 */}
              <button className="absolute top-3 right-3 z-10 bg-gray-800 bg-opacity-80 p-1.5 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-5 h-5 text-gray-400 hover:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
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
                {course.progress > 0 && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                    <div 
                      className={getCourseStatusClassName(course)}
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                )}
              </div>
              
              {/* 课程信息 */}
              <div className="p-4">
                {/* 课程类型和难度 */}
                <div className="flex items-center mb-2 space-x-2">
                  <span className="px-2 py-0.5 bg-blue-900 text-blue-200 text-xs font-medium rounded">
                    {course.type}
                  </span>
                  <span className="px-2 py-0.5 bg-gray-700 text-gray-300 text-xs font-medium rounded">
                    {getLevelLabel(course.level)}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-white line-clamp-2 h-14">{course.title}</h3>
                <p className="mt-1 text-sm text-gray-400 line-clamp-2 h-10">{course.description}</p>
                
                {/* 评分和学习人数 */}
                <div className="mt-2 flex items-center text-sm text-gray-400">
                  <div className="flex items-center mr-4">
                    <svg className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="ml-1">{course.rating}</span>
                  </div>
                  <div>
                    <span>{course.students}人学习</span>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-between items-center">
                  <div className="text-sm font-medium text-gray-400">
                    {course.totalLessons} 课时
                  </div>
                  
                  {course.progress > 0 ? (
                    <div className="text-sm font-medium text-blue-400">
                      继续学习
                    </div>
                  ) : course.isFree ? (
                    <button className="py-1.5 px-4 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors">
                      立即学习
                    </button>
                  ) : (
                    <button className="py-1.5 px-4 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 transition-colors">
                      开通会员
                    </button>
                  )}
                </div>
              </div>
            </div>
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
              我们正在为您准备更多优质课程，敬请期待
            </p>
          </div>
        )}
        
        {/* 会员促销信息 */}
        {activeTab === 'member' && (
          <div className="bg-gradient-to-r from-purple-800 to-indigo-800 rounded-lg p-6 text-white mt-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">开通会员，畅享全部课程</h2>
                <p className="mt-2 text-purple-200">一次开通，终身学习，持续更新的优质课程</p>
              </div>
              <button className="mt-4 md:mt-0 px-6 py-2 bg-white text-purple-800 rounded-md font-medium hover:bg-purple-100 transition-colors">
                了解会员特权
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 