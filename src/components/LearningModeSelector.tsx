'use client';

import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Image from 'next/image';
import Link from 'next/link';
import LearningContentPreview from './LearningContentPreview';
import { LearningMode } from '@/types/learning';

interface LearningModeSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  lessonId: string;
  lessonTitle: string;
}

// 模拟获取课文内容的函数
const getContentForPreview = async (lessonId: string) => {
  // 在实际应用中，这里会调用API获取数据
  return {
    english: `I hated English in middle school. I couldn't understand why I needed to learn a foreign language. It seemed so useless. My English teacher was very strict, and English class was boring. I always got poor grades in English tests.

Things changed when I went to high school. My new English teacher was amazing. She didn't just teach from textbooks; she taught us about English songs, movies, and culture. She told us interesting stories about her travel experiences in different countries.

I remember when she played an English song in class for the first time. It was "My Heart Will Go On" by Celine Dion, from the movie Titanic. I was surprised that I could understand some of the lyrics. The song was so beautiful, and I wanted to understand all of it.`,
    chinese: `我在中学时讨厌英语。我不理解为什么我需要学习一门外语。它似乎毫无用处。我的英语老师非常严格，英语课很无聊。我在英语考试中总是得低分。

当我上高中时，情况发生了变化。我的新英语老师很棒。她不只是照本宣科；她教我们英文歌曲、电影和文化。她给我们讲述了她在不同国家的旅行经历的有趣故事。

我记得她第一次在课堂上播放英文歌曲。那是席琳·迪翁演唱的《我心永恒》，电影《泰坦尼克号》的主题曲。我很惊讶我能理解一些歌词。这首歌太美了，我想完全理解它。`
  };
};

export default function LearningModeSelector({
  isOpen,
  onClose,
  courseId,
  lessonId,
  lessonTitle
}: LearningModeSelectorProps) {
  const [previewMode, setPreviewMode] = useState<LearningMode | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [content, setContent] = useState<{english: string, chinese: string} | null>(null);

  // 学习模式
  const learningModes = [
    {
      id: 'chinese-to-english',
      title: '中译英模式',
      description: '看到中文提示，尝试用英文表达。统习运用所学词汇和语法。',
      imageSrc: '/images/learning-modes/chinese-to-english.png',
      fallbackImage: 'https://placehold.co/300x200/f97316/ffffff?text=中译英模式',
      bgColor: 'from-orange-500 to-amber-500',
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
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
      )
    },
    {
      id: 'grammar',
      title: '语法模式',
      description: '分析课文内每个句子的句子成分以及找到句子主干，深入理解英语语法结构。',
      imageSrc: '/images/learning-modes/grammar.png',
      fallbackImage: 'https://placehold.co/300x200/3b82f6/ffffff?text=语法模式',
      bgColor: 'from-blue-500 to-indigo-600',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      id: 'listening',
      title: '听力模式',
      description: '听音频，写出你听到的英文单词，训练听力，掌握单词拼写。',
      imageSrc: '/images/learning-modes/listening.png',
      fallbackImage: 'https://placehold.co/300x200/10b981/ffffff?text=听力模式',
      bgColor: 'from-emerald-500 to-teal-600',
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
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      )
    },
    {
      id: 'more',
      title: '更多模式',
      description: '敬请期待...',
      imageSrc: '/images/learning-modes/more.png',
      fallbackImage: 'https://placehold.co/300x200/6b7280/ffffff?text=更多模式',
      bgColor: 'from-gray-600 to-gray-700',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  // 处理模式选择
  const handleModeSelect = async (mode: LearningMode) => {
    try {
      const contentData = await getContentForPreview(lessonId);
      setContent(contentData);
      setPreviewMode(mode);
      setIsPreviewOpen(true);
    } catch (error) {
      console.error('Failed to load content:', error);
      // 如果获取内容失败，可以直接跳转
      // window.location.href = `/courses/${courseId}/lessons/${lessonId}/${mode}`;
    }
  };

  // 关闭预览
  const handlePreviewClose = () => {
    setIsPreviewOpen(false);
    setPreviewMode(null);
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
                  <div className="flex justify-between items-center mb-6">
                    <Dialog.Title className="text-xl font-semibold text-white">
                      选择学习模式
                    </Dialog.Title>
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

                  <div className="mb-4">
                    <h3 className="text-lg text-gray-300">
                      {lessonTitle}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {learningModes.map((mode) => (
                      <div
                        key={mode.id} 
                        className={`group relative rounded-lg overflow-hidden hover:shadow-lg ${
                          mode.id === 'more' ? 'cursor-not-allowed opacity-70' : 'cursor-pointer hover:opacity-95'
                        }`}
                        onClick={mode.id !== 'more' ? () => handleModeSelect(mode.id as LearningMode) : undefined}
                      >
                        <div className={`absolute inset-0 opacity-90 bg-gradient-to-br ${mode.bgColor}`}></div>
                        
                        <div className="relative p-4 md:p-6 flex flex-col h-full">
                          <div className="flex items-center mb-3">
                            <div className="rounded-full p-2 bg-white/20 mr-3">
                              {mode.icon}
                            </div>
                            <h3 className="text-xl font-bold text-white">{mode.title}</h3>
                          </div>
                          
                          <p className="text-white/90 text-sm mb-4">
                            {mode.description}
                          </p>
                          
                          <div className="mt-auto relative h-40 rounded-md overflow-hidden">
                            <Image
                              src={mode.fallbackImage}
                              alt={mode.title}
                              layout="fill"
                              objectFit="cover"
                              className="group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                          </div>
                          
                          {mode.id !== 'more' && (
                            <button className="absolute bottom-8 right-6 bg-white/90 text-gray-900 px-3 py-1 rounded-full text-sm font-medium hover:bg-white transition-colors">
                              开始学习
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
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