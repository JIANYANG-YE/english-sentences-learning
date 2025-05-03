'use client';

import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useRouter } from 'next/navigation';
import { LearningMode } from '@/types/learning';

interface LearningContentPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  lessonId: string;
  lessonTitle: string;
  mode: LearningMode;
  content?: {
    english: string;
    chinese: string;
  };
  onStartLearning: () => void;
}

// 切割段落并返回前几段用于预览
function getPreviewContent(content: string, maxLength: number = 400): string {
  if (!content) return '';
  
  if (content.length <= maxLength) return content;
  
  // 截取适当长度，并尝试在句子结束处截断
  const truncated = content.substring(0, maxLength);
  const lastPeriod = truncated.lastIndexOf('.');
  
  if (lastPeriod > maxLength * 0.7) {
    return truncated.substring(0, lastPeriod + 1) + '...';
  }
  
  return truncated + '...';
}

// 获取模式对应的颜色和图标
function getModeStyleAndIcon(mode: string) {
  switch (mode) {
    case 'chinese-to-english':
      return {
        gradient: 'from-orange-600 to-amber-600',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
          </svg>
        ),
        title: '中译英模式'
      };
    case 'english-to-chinese':
      return {
        gradient: 'from-purple-600 to-violet-600',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
          </svg>
        ),
        title: '英译中模式'
      };
    case 'grammar':
      return {
        gradient: 'from-blue-600 to-indigo-600',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        ),
        title: '语法模式'
      };
    case 'listening':
      return {
        gradient: 'from-emerald-600 to-teal-600',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.465a5 5 0 001.897-7.72m-3.732 10.535a9 9 0 0110.607-14.206" />
          </svg>
        ),
        title: '听力模式'
      };
    case 'notes':
      return {
        gradient: 'from-blue-600 to-cyan-500',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        ),
        title: '笔记模式'
      };
    default:
      return {
        gradient: 'from-gray-600 to-gray-700',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
        title: '学习模式'
      };
  }
}

// 获取学习模式帮助信息
function getModeHelpText(mode: string) {
  switch (mode) {
    case 'chinese-to-english':
      return '在中译英模式中，你将看到中文句子，尝试将其翻译成英文。这有助于加强你的英语表达能力和词汇运用。';
    case 'english-to-chinese':
      return '在英译中模式中，你将看到英文句子，尝试将其翻译成中文。这有助于提高你的英语阅读理解能力和翻译技巧。';
    case 'grammar':
      return '在语法模式中，你将分析句子结构，找出主语、谓语、宾语等成分，深入理解英语语法规则和句式结构。';
    case 'listening':
      return '在听力模式中，你将听英语音频，并写出听到的内容，这有助于提高你的英语听力理解能力和拼写能力。';
    case 'notes':
      return '在笔记模式中，你可以为文本中的重点内容添加笔记和标记，方便学习和复习。';
    default:
      return '选择一种适合自己的学习模式，开始你的英语学习之旅。';
  }
}

export default function LearningContentPreview({
  isOpen,
  onClose,
  courseId,
  lessonId,
  lessonTitle,
  mode,
  content,
  onStartLearning
}: LearningContentPreviewProps) {
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState('preview');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const modeStyle = getModeStyleAndIcon(mode);
  
  // 模拟加载进度
  useEffect(() => {
    if (isOpen) {
      setLoadingProgress(0);
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          const newProgress = prev + Math.random() * 10;
          if (newProgress >= 100) {
            clearInterval(interval);
            return 100;
          }
          return newProgress;
        });
      }, 200);
      
      return () => clearInterval(interval);
    }
  }, [isOpen]);
  
  // 处理开始学习
  const handleStartLearning = () => {
    onStartLearning();
    router.push(`/courses/${courseId}/lessons/${lessonId}/${mode}`);
  };

  return (
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
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-lg bg-gray-900 shadow-xl transition-all">
                {/* 头部 */}
                <div className={`bg-gradient-to-r ${modeStyle.gradient} p-6`}>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="rounded-full p-2 bg-white/20 mr-3">
                        {modeStyle.icon}
                      </div>
                      <div>
                        <Dialog.Title className="text-xl font-bold text-white">
                          {modeStyle.title}
                        </Dialog.Title>
                        <p className="text-sm text-white/80 mt-1">
                          {lessonTitle}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="text-white/80 hover:text-white"
                      onClick={onClose}
                    >
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  {/* 加载进度条 */}
                  <div className="mt-6 bg-white/20 h-1 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-white transition-all duration-300 ease-out"
                      style={{ width: `${loadingProgress}%` }}
                    />
                  </div>
                </div>
                
                {/* 内容区域 */}
                <div className="p-6">
                  {/* 标签页 */}
                  <div className="flex border-b border-gray-700 mb-4">
                    <button
                      onClick={() => setCurrentTab('preview')}
                      className={`px-4 py-2 font-medium text-sm ${
                        currentTab === 'preview' 
                          ? 'text-white border-b-2 border-white' 
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      内容预览
                    </button>
                    <button
                      onClick={() => setCurrentTab('help')}
                      className={`px-4 py-2 font-medium text-sm ${
                        currentTab === 'help' 
                          ? 'text-white border-b-2 border-white' 
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      学习帮助
                    </button>
                  </div>
                  
                  {/* 内容预览 */}
                  {currentTab === 'preview' && content && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-gray-400 text-sm mb-2">英文内容:</h3>
                        <div className="bg-gray-800 p-4 rounded-lg text-white leading-relaxed max-h-52 overflow-y-auto">
                          {getPreviewContent(content.english)}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-gray-400 text-sm mb-2">中文内容:</h3>
                        <div className="bg-gray-800 p-4 rounded-lg text-white leading-relaxed max-h-52 overflow-y-auto">
                          {getPreviewContent(content.chinese)}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* 学习帮助 */}
                  {currentTab === 'help' && (
                    <div className="space-y-6">
                      <div className="bg-gray-800 p-5 rounded-lg">
                        <h3 className="font-medium text-white mb-2">学习模式说明</h3>
                        <p className="text-gray-300">
                          {getModeHelpText(mode)}
                        </p>
                      </div>
                      
                      <div className="bg-gray-800 p-5 rounded-lg">
                        <h3 className="font-medium text-white mb-2">学习提示</h3>
                        <ul className="text-gray-300 space-y-2 list-disc pl-5">
                          <li>学习时注意句子的结构和用词</li>
                          <li>尝试理解句子的意思而不是逐词翻译</li>
                          <li>反复练习可以加深记忆</li>
                          <li>不要害怕犯错，从错误中学习</li>
                        </ul>
                      </div>
                      
                      <div className="bg-gray-800 p-5 rounded-lg">
                        <h3 className="font-medium text-white mb-2">快捷键</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center">
                            <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded mr-2">Enter</span>
                            <span className="text-gray-300">提交答案</span>
                          </div>
                          <div className="flex items-center">
                            <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded mr-2">空格</span>
                            <span className="text-gray-300">播放音频</span>
                          </div>
                          <div className="flex items-center">
                            <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded mr-2">Ctrl + →</span>
                            <span className="text-gray-300">下一条</span>
                          </div>
                          <div className="flex items-center">
                            <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded mr-2">Ctrl + ←</span>
                            <span className="text-gray-300">上一条</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* 底部按钮 */}
                <div className="bg-gray-800 px-6 py-4 flex justify-between">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 border border-gray-600 text-gray-300 rounded-md hover:bg-gray-700 transition-colors"
                  >
                    返回
                  </button>
                  
                  <button
                    onClick={handleStartLearning}
                    className={`px-6 py-2 ${modeStyle.gradient.replace('from-', 'bg-').split(' ')[0]} text-white rounded-md font-medium hover:opacity-90 transition-colors flex items-center`}
                    disabled={loadingProgress < 100}
                  >
                    {loadingProgress < 100 ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        加载中 ({Math.round(loadingProgress)}%)
                      </>
                    ) : (
                      <>
                        开始学习
                        <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
} 