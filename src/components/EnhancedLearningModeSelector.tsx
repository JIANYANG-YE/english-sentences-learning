'use client';

import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { LearningMode } from '@/types/learning';
import LearningContentPreview from '@/components/LearningContentPreview';

interface EnhancedLearningModeSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  lessonId: string;
  lessonTitle: string;
  userPreferences?: {
    recentModes?: string[];
    favoriteMode?: string;
    skillLevels?: Record<string, number>;
  };
}

// 模拟获取课文内容的函数
const getContentForPreview = async (lessonId: string) => {
  // 在实际应用中，这里会调用API获取数据
  return {
    english: `I hated English in middle school. I couldn't understand why I needed to learn a foreign language. It seemed so useless. My English teacher was very strict, and English class was boring.`,
    chinese: `我在中学时讨厌英语。我不理解为什么我需要学习一门外语。它似乎毫无用处。我的英语老师非常严格，英语课很无聊。`
  };
};

export default function EnhancedLearningModeSelector({
  isOpen,
  onClose,
  courseId,
  lessonId,
  lessonTitle,
  userPreferences = {}
}: EnhancedLearningModeSelectorProps) {
  const router = useRouter();
  const [previewMode, setPreviewMode] = useState<LearningMode | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [content, setContent] = useState<{english: string, chinese: string} | null>(null);
  const [recommendedModes, setRecommendedModes] = useState<string[]>([]);
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [filterType, setFilterType] = useState<'all' | 'recommended' | 'favorite'>('all');

  // 学习模式
  const learningModes = [
    {
      id: 'chinese-to-english',
      title: '中译英模式',
      description: '看到中文提示，尝试用英文表达。训练英语表达能力和词汇运用。',
      imageSrc: '/images/learning-modes/chinese-to-english.png',
      fallbackImage: 'https://placehold.co/300x200/f97316/ffffff?text=中译英模式',
      bgColor: 'from-orange-500 to-amber-500',
      skillsGained: ['口语表达', '词汇应用', '语法结构'],
      difficulty: 'medium',
      effectiveFor: ['提高口语能力', '加强英语输出', '掌握词汇用法'],
      averageTimeRequired: 15,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
      )
    },
    {
      id: 'english-to-chinese',
      title: '英译中模式',
      description: '看到英文句子，尝试用中文表达。提高英语阅读理解能力和翻译技巧。',
      imageSrc: '/images/learning-modes/english-to-chinese.png',
      fallbackImage: 'https://placehold.co/300x200/8b5cf6/ffffff?text=英译中模式',
      bgColor: 'from-purple-500 to-violet-600',
      skillsGained: ['阅读理解', '翻译技巧', '语境理解'],
      difficulty: 'easy',
      effectiveFor: ['提高阅读速度', '理解长句结构', '掌握原文含义'],
      averageTimeRequired: 12,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
      )
    },
    {
      id: 'grammar',
      title: '语法模式',
      description: '分析句子结构，理解句子成分，深入掌握英语语法规则。',
      imageSrc: '/images/learning-modes/grammar.png',
      fallbackImage: 'https://placehold.co/300x200/3b82f6/ffffff?text=语法模式',
      bgColor: 'from-blue-500 to-indigo-600',
      skillsGained: ['语法规则', '句子分析', '结构理解'],
      difficulty: 'hard',
      effectiveFor: ['掌握语法规则', '提高写作准确性', '理解复杂句式'],
      averageTimeRequired: 20,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      id: 'listening',
      title: '听力模式',
      description: '听音频，写出听到的英文单词，训练听力，掌握单词拼写。',
      imageSrc: '/images/learning-modes/listening.png',
      fallbackImage: 'https://placehold.co/300x200/10b981/ffffff?text=听力模式',
      bgColor: 'from-emerald-500 to-teal-600',
      skillsGained: ['听力理解', '拼写能力', '音素辨识'],
      difficulty: 'medium',
      effectiveFor: ['提高听力辨析', '增强拼写能力', '训练语音识别'],
      averageTimeRequired: 18,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.465a5 5 0 001.897-7.72m-3.732 10.535a9 9 0 0110.607-14.206" />
        </svg>
      )
    },
    {
      id: 'notes',
      title: '笔记模式',
      description: '为课文中的重点内容添加笔记和标记，记录学习心得，方便复习和记忆。',
      imageSrc: '/images/learning-modes/notes.png',
      fallbackImage: 'https://placehold.co/300x200/0ea5e9/ffffff?text=笔记模式',
      bgColor: 'from-blue-500 to-cyan-500',
      skillsGained: ['学习组织', '笔记技巧', '知识归纳'],
      difficulty: 'easy',
      effectiveFor: ['整理知识体系', '重点标记', '便于复习回顾'],
      averageTimeRequired: 10,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      )
    },
    {
      id: 'mixed',
      title: '混合模式',
      description: '结合多种学习方式，全面提高英语听说读写能力。自适应调整学习内容。',
      imageSrc: '/images/learning-modes/mixed.png',
      fallbackImage: 'https://placehold.co/300x200/ec4899/ffffff?text=混合模式',
      bgColor: 'from-pink-500 to-rose-500',
      skillsGained: ['综合能力', '全面掌握', '自适应学习'],
      difficulty: 'adaptive',
      effectiveFor: ['全面提升能力', '打破学习单一性', '根据表现调整学习重点'],
      averageTimeRequired: 25,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
        </svg>
      )
    }
  ];

  // 计算模式推荐
  useEffect(() => {
    // 在实际应用中，这里会有更复杂的推荐算法
    // 基于用户偏好、技能水平、学习历史等
    if (userPreferences) {
      // 简单模拟推荐算法
      const recommended = [];
      
      // 1. 考虑用户最常使用的模式
      if (userPreferences.recentModes && userPreferences.recentModes.length > 0) {
        recommended.push(userPreferences.recentModes[0]);
      }
      
      // 2. 考虑用户技能水平，推荐需要提高的技能对应的模式
      if (userPreferences.skillLevels) {
        const skills = Object.entries(userPreferences.skillLevels);
        if (skills.length > 0) {
          // 找出最弱的技能
          const weakestSkill = skills.sort(([, a], [, b]) => a - b)[0][0];
          
          // 根据最弱技能推荐模式
          if (weakestSkill === 'listening') recommended.push('listening');
          else if (weakestSkill === 'grammar') recommended.push('grammar');
          else if (weakestSkill === 'speaking') recommended.push('chinese-to-english');
          else if (weakestSkill === 'reading') recommended.push('english-to-chinese');
        }
      }
      
      // 3. 如果没有足够的推荐，添加混合模式
      if (recommended.length < 2) {
        recommended.push('mixed');
      }
      
      // 确保推荐是唯一的
      setRecommendedModes([...new Set(recommended)]);
    } else {
      // 默认推荐
      setRecommendedModes(['chinese-to-english', 'mixed']);
    }
  }, [userPreferences]);

  // 处理模式选择
  const handleModeSelect = async (mode: LearningMode) => {
    try {
      const contentData = await getContentForPreview(lessonId);
      setContent(contentData);
      setPreviewMode(mode);
      setIsPreviewOpen(true);
    } catch (error) {
      console.error('加载内容失败:', error);
      // 如果获取内容失败，可以直接跳转
      router.push(`/courses/${courseId}/lessons/${lessonId}/${mode}`);
    }
  };

  // 关闭预览
  const handlePreviewClose = () => {
    setIsPreviewOpen(false);
    setPreviewMode(null);
  };

  // 切换视图类型
  const toggleViewType = () => {
    setViewType(viewType === 'grid' ? 'list' : 'grid');
  };

  // 获取显示的模式列表
  const getFilteredModes = () => {
    if (filterType === 'all') return learningModes;
    if (filterType === 'recommended') {
      return learningModes.filter(mode => recommendedModes.includes(mode.id));
    }
    if (filterType === 'favorite' && userPreferences?.favoriteMode) {
      return learningModes.filter(mode => mode.id === userPreferences.favoriteMode);
    }
    return learningModes;
  };

  // 获取模式的难度标签
  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return { label: '简单', color: 'bg-green-100 text-green-800' };
      case 'medium': return { label: '中等', color: 'bg-yellow-100 text-yellow-800' };
      case 'hard': return { label: '困难', color: 'bg-red-100 text-red-800' };
      case 'adaptive': return { label: '自适应', color: 'bg-purple-100 text-purple-800' };
      default: return { label: '未知', color: 'bg-gray-100 text-gray-800' };
    }
  };

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/80" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-lg bg-gray-900 p-6 shadow-xl transition-all">
                  {/* 头部标题和控制按钮 */}
                  <div className="flex justify-between items-center mb-6">
                    <Dialog.Title className="text-xl font-semibold text-white">
                      选择学习模式
                    </Dialog.Title>
                    <div className="flex items-center space-x-4">
                      {/* 视图切换按钮 */}
                      <button
                        type="button"
                        className="text-gray-400 hover:text-white"
                        onClick={toggleViewType}
                        title={viewType === 'grid' ? '切换到列表视图' : '切换到网格视图'}
                      >
                        {viewType === 'grid' ? (
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                          </svg>
                        )}
                      </button>
                      
                      {/* 关闭按钮 */}
                      <button
                        type="button"
                        className="text-gray-400 hover:text-white"
                        onClick={onClose}
                      >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* 课程标题 */}
                  <div className="mb-4">
                    <h3 className="text-lg text-gray-300">
                      {lessonTitle}
                    </h3>
                  </div>

                  {/* 筛选选项 */}
                  <div className="flex mb-6 space-x-2">
                    <button
                      onClick={() => setFilterType('all')}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        filterType === 'all' 
                          ? 'bg-white text-gray-900' 
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      全部模式
                    </button>
                    <button
                      onClick={() => setFilterType('recommended')}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        filterType === 'recommended' 
                          ? 'bg-white text-gray-900' 
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      为你推荐
                    </button>
                    {userPreferences?.favoriteMode && (
                      <button
                        onClick={() => setFilterType('favorite')}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                          filterType === 'favorite' 
                            ? 'bg-white text-gray-900' 
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        收藏模式
                      </button>
                    )}
                  </div>

                  {/* 网格视图 */}
                  {viewType === 'grid' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {getFilteredModes().map((mode) => (
                        <div
                          key={mode.id} 
                          className="relative group bg-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 hover:ring-2 hover:ring-white/20 cursor-pointer"
                          onClick={() => handleModeSelect(mode.id as LearningMode)}
                        >
                          <div className={`h-36 bg-gradient-to-r ${mode.bgColor} p-6 flex flex-col justify-between`}>
                            <div className="flex justify-between items-start">
                              <div className="p-2 bg-white/20 rounded-lg">
                                {mode.icon}
                              </div>
                              
                              {recommendedModes.includes(mode.id) && (
                                <span className="bg-white/90 text-gray-900 px-2 py-1 rounded-full text-xs font-medium">
                                  推荐
                                </span>
                              )}
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-white">
                                {mode.title}
                              </h3>
                              <p className="text-white/80 text-sm mt-1 line-clamp-2">
                                {mode.description}
                              </p>
                            </div>
                          </div>
                          
                          <div className="p-4">
                            {/* 难度标签 */}
                            <div className="flex flex-wrap gap-2 mb-3">
                              <span className={`text-xs px-2 py-0.5 rounded-full ${getDifficultyLabel(mode.difficulty).color}`}>
                                {getDifficultyLabel(mode.difficulty).label}
                              </span>
                              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                                约{mode.averageTimeRequired}分钟
                              </span>
                            </div>
                            
                            {/* 技能标签 */}
                            <div className="mb-3">
                              <h4 className="text-xs text-gray-400 mb-1">提升技能:</h4>
                              <div className="flex flex-wrap gap-1">
                                {mode.skillsGained.map((skill, index) => (
                                  <span key={index} className="text-xs px-2 py-0.5 rounded-full bg-gray-700 text-gray-300">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                            
                            <button className="w-full mt-2 bg-white/10 hover:bg-white/20 text-white py-1.5 rounded-md text-sm transition-colors">
                              开始学习
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 列表视图 */}
                  {viewType === 'list' && (
                    <div className="space-y-3">
                      {getFilteredModes().map((mode) => (
                        <div
                          key={mode.id} 
                          className="flex items-center bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-750 transition-all duration-300 cursor-pointer hover:ring-1 hover:ring-white/20 p-3"
                          onClick={() => handleModeSelect(mode.id as LearningMode)}
                        >
                          <div className={`w-12 h-12 bg-gradient-to-r ${mode.bgColor} rounded-lg flex items-center justify-center flex-shrink-0 mr-4`}>
                            {mode.icon}
                          </div>
                          
                          <div className="flex-grow">
                            <div className="flex items-center">
                              <h3 className="text-white font-medium">{mode.title}</h3>
                              {recommendedModes.includes(mode.id) && (
                                <span className="ml-2 bg-white/90 text-gray-900 px-2 py-0.5 rounded-full text-xs font-medium">
                                  推荐
                                </span>
                              )}
                              <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${getDifficultyLabel(mode.difficulty).color}`}>
                                {getDifficultyLabel(mode.difficulty).label}
                              </span>
                            </div>
                            <p className="text-gray-400 text-sm mt-1 line-clamp-1">{mode.description}</p>
                          </div>
                          
                          <button className="ml-4 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded text-sm transition-colors flex-shrink-0">
                            预览
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* 学习内容预览组件 */}
      {previewMode && (
        <LearningContentPreview
          isOpen={isPreviewOpen}
          onClose={handlePreviewClose}
          courseId={courseId}
          lessonId={lessonId}
          lessonTitle={lessonTitle}
          mode={previewMode}
          content={content || undefined}
          onStartLearning={() => {
            onClose(); // 关闭模式选择器
          }}
        />
      )}
    </>
  );
} 