'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// 定义错题类型
interface ErrorItem {
  id: string;
  question: string;
  correctAnswer: string;
  userAnswer: string;
  type: 'translation' | 'filling' | 'choice' | 'listening';
  date: string;
  source: {
    book: string;
    lesson: string;
    sentence?: string;
  };
  status: 'new' | 'reviewing' | 'mastered';
  reviewCount: number;
  lastReviewed?: string;
}

// 模拟错题数据
const initialErrors: ErrorItem[] = [
  {
    id: '1',
    question: 'He has been learning English ____ five years.',
    correctAnswer: 'for',
    userAnswer: 'since',
    type: 'filling',
    date: '2024-04-16T14:30:00Z',
    source: {
      book: '新概念英语第二册',
      lesson: '第15课'
    },
    status: 'new',
    reviewCount: 0
  },
  {
    id: '2',
    question: 'They arrived ____ the airport ____ time.',
    correctAnswer: 'at, on',
    userAnswer: 'at, in',
    type: 'filling',
    date: '2024-04-15T10:20:00Z',
    source: {
      book: '新概念英语第二册',
      lesson: '第12课'
    },
    status: 'new',
    reviewCount: 0
  },
  {
    id: '3',
    question: 'Translate: 他已经完成了作业。',
    correctAnswer: 'He has finished his homework.',
    userAnswer: 'He have finished his homework.',
    type: 'translation',
    date: '2024-04-14T16:45:00Z',
    source: {
      book: '新概念英语第二册',
      lesson: '第10课',
      sentence: 'Lesson 10 - Exercise 3'
    },
    status: 'new',
    reviewCount: 0
  },
  {
    id: '4',
    question: 'Which is correct?',
    correctAnswer: 'She has lived here since 2010.',
    userAnswer: 'She has lived here for 2010.',
    type: 'choice',
    date: '2024-04-13T11:15:00Z',
    source: {
      book: '新概念英语第二册',
      lesson: '第8课'
    },
    status: 'reviewing',
    reviewCount: 1,
    lastReviewed: '2024-04-14T15:30:00Z'
  },
  {
    id: '5',
    question: "Transcribe what you hear: \"I've been waiting for you for half an hour.\"",
    correctAnswer: "I've been waiting for you for half an hour.",
    userAnswer: "I've been waiting you for half an hour.",
    type: 'listening',
    date: '2024-04-12T09:50:00Z',
    source: {
      book: '新概念英语第二册',
      lesson: '第6课'
    },
    status: 'new',
    reviewCount: 0
  }
];

// 过滤选项
const filterOptions = [
  { value: 'all', label: '全部' },
  { value: 'new', label: '未掌握' },
  { value: 'reviewing', label: '复习中' },
  { value: 'mastered', label: '已掌握' }
];

// 分类选项
const typeOptions = [
  { value: 'all', label: '全部类型' },
  { value: 'translation', label: '翻译题' },
  { value: 'filling', label: '填空题' },
  { value: 'choice', label: '选择题' },
  { value: 'listening', label: '听力题' }
];

export default function ErrorsPage() {
  const [errors, setErrors] = useState<ErrorItem[]>(initialErrors);
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'card'>('list');
  
  // 过滤错题
  const filteredErrors = errors.filter(error => {
    const matchesStatus = statusFilter === 'all' || error.status === statusFilter;
    const matchesType = typeFilter === 'all' || error.type === typeFilter;
    const matchesSearch = error.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          error.correctAnswer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          error.source.book.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          error.source.lesson.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesType && matchesSearch;
  });
  
  // 标记为已掌握
  const markAsMastered = (id: string) => {
    setErrors(errors.map(error => 
      error.id === id ? {...error, status: 'mastered', lastReviewed: new Date().toISOString()} : error
    ));
  };
  
  // 标记为需要复习
  const markForReview = (id: string) => {
    setErrors(errors.map(error => 
      error.id === id ? {
        ...error, 
        status: 'reviewing', 
        reviewCount: error.reviewCount + 1,
        lastReviewed: new Date().toISOString()
      } : error
    ));
  };
  
  // 删除错题
  const deleteError = (id: string) => {
    if (window.confirm('确定要删除这个错题吗？')) {
      setErrors(errors.filter(error => error.id !== id));
    }
  };
  
  // 获取错题类型标签
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'translation': return '翻译题';
      case 'filling': return '填空题';
      case 'choice': return '选择题';
      case 'listening': return '听力题';
      default: return '';
    }
  };
  
  // 获取状态类名
  const getStatusClassName = (status: string) => {
    switch (status) {
      case 'new': return 'bg-red-100 text-red-800';
      case 'reviewing': return 'bg-yellow-100 text-yellow-800';
      case 'mastered': return 'bg-green-100 text-green-800';
      default: return '';
    }
  };
  
  // 获取状态标签
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'new': return '未掌握';
      case 'reviewing': return '复习中';
      case 'mastered': return '已掌握';
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">我的错题本</h1>
        <div className="text-sm text-gray-500">
          共 {errors.filter(e => e.status !== 'mastered').length} 个未掌握的错题
        </div>
      </div>
      
      {/* 搜索和过滤区域 */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="搜索错题..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">状态：</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {filterOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">类型：</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {typeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex-grow"></div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
              </svg>
            </button>
            <button
              onClick={() => setViewMode('card')}
              className={`p-1.5 rounded ${viewMode === 'card' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* 错题列表 */}
      {filteredErrors.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-10 text-center">
          <p className="text-gray-500">
            {searchQuery || statusFilter !== 'all' || typeFilter !== 'all'
              ? '没有找到符合条件的错题'
              : '您的错题本是空的'}
          </p>
          <Link
            href="/study"
            className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
          >
            去练习
          </Link>
        </div>
      ) : viewMode === 'list' ? (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    错题
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    类型
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    来源
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    状态
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    错误次数
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredErrors.map(error => (
                  <tr key={error.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {error.question}
                      </div>
                      <div className="mt-1">
                        <span className="text-xs text-gray-500">正确答案：</span>
                        <span className="text-xs text-green-600 font-medium">{error.correctAnswer}</span>
                      </div>
                      <div className="mt-0.5">
                        <span className="text-xs text-gray-500">你的答案：</span>
                        <span className="text-xs text-red-600 font-medium">{error.userAnswer}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {getTypeLabel(error.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{error.source.book}</div>
                      <div className="text-sm text-gray-500">{error.source.lesson}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClassName(error.status)}`}>
                        {getStatusLabel(error.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {error.reviewCount + 1}次
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => markAsMastered(error.id)}
                          className="text-green-600 hover:text-green-900"
                          disabled={error.status === 'mastered'}
                        >
                          已掌握
                        </button>
                        <button 
                          onClick={() => markForReview(error.id)}
                          className="text-yellow-600 hover:text-yellow-900"
                        >
                          标记复习
                        </button>
                        <button 
                          onClick={() => deleteError(error.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          删除
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredErrors.map(error => (
            <div key={error.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-5">
                <div className="flex justify-between">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClassName(error.status)}`}>
                    {getStatusLabel(error.status)}
                  </span>
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {getTypeLabel(error.type)}
                  </span>
                </div>
                
                <div className="mt-4">
                  <p className="text-gray-900 font-medium">{error.question}</p>
                  
                  <div className="mt-3 space-y-1">
                    <div className="flex">
                      <span className="text-sm text-gray-500 w-20">正确答案：</span>
                      <span className="text-sm text-green-600 font-medium">{error.correctAnswer}</span>
                    </div>
                    <div className="flex">
                      <span className="text-sm text-gray-500 w-20">你的答案：</span>
                      <span className="text-sm text-red-600 font-medium">{error.userAnswer}</span>
                    </div>
                  </div>
                  
                  <div className="mt-3 text-xs text-gray-500">
                    来源：{error.source.book} - {error.source.lesson}
                  </div>
                  
                  <div className="mt-4 text-xs text-gray-500">
                    错误次数：{error.reviewCount + 1}次
                    {error.lastReviewed && ` · 最后复习：${new Date(error.lastReviewed).toLocaleDateString('zh-CN')}`}
                  </div>
                </div>
              </div>
              
              <div className="px-5 py-3 bg-gray-50 border-t grid grid-cols-3 gap-2">
                <button 
                  onClick={() => markAsMastered(error.id)}
                  className={`text-xs py-1 rounded font-medium ${
                    error.status === 'mastered'
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                  disabled={error.status === 'mastered'}
                >
                  已掌握
                </button>
                <button 
                  onClick={() => markForReview(error.id)}
                  className="text-xs py-1 rounded font-medium bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                >
                  标记复习
                </button>
                <button 
                  onClick={() => deleteError(error.id)}
                  className="text-xs py-1 rounded font-medium bg-red-100 text-red-700 hover:bg-red-200"
                >
                  删除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* 错题练习按钮 */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-sm p-6 text-white">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">开始复习错题</h2>
            <p className="mt-1 text-blue-100">通过集中练习错题，快速提高薄弱环节</p>
          </div>
          <Link
            href="/study?mode=error"
            className="mt-4 md:mt-0 px-6 py-2 bg-white text-blue-700 rounded-md font-medium hover:bg-blue-50 transition-colors"
          >
            开始练习
          </Link>
        </div>
      </div>
    </div>
  );
} 