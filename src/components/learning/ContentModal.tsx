'use client';

import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ContentItem, WordDefinition, LearningMode } from '@/types/learning';
import SentenceList from './SentenceList';
import SentenceExplanation from './SentenceExplanation';

// 模拟获取单词数据的函数
const getMockWordDefinition = (word: string): WordDefinition | null => {
  // 简单示例，实际应用中应从API获取
  const mockData: Record<string, WordDefinition> = {
    'enjoy': {
      word: "enjoy",
      phonetic: "/ɪnˈdʒɔɪ/",
      partOfSpeech: "动词",
      definition: "从某事物中获得乐趣或满足",
      examples: [
        "She enjoys playing the piano.",
        "We enjoyed our vacation in Italy."
      ],
      synonyms: ["like", "love", "relish"],
      antonyms: ["dislike", "hate"]
    }
  };
  
  return mockData[word.toLowerCase()] || null;
};

interface ContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  sentences: ContentItem[];
  currentSentenceId?: string;
  title?: string;
}

export default function ContentModal({
  isOpen,
  onClose,
  sentences,
  currentSentenceId,
  title = "学习内容"
}: ContentModalProps) {
  const [activeMode, setActiveMode] = useState<LearningMode>('sentences');
  const [activeSentence, setActiveSentence] = useState<ContentItem | null>(null);
  
  // 初始化激活的句子
  useEffect(() => {
    if (currentSentenceId) {
      const sentence = sentences.find(s => s.id === currentSentenceId);
      if (sentence) {
        setActiveSentence(sentence);
      }
    } else if (sentences.length > 0) {
      setActiveSentence(sentences[0]);
    }
  }, [currentSentenceId, sentences]);
  
  // 处理选择句子
  const handleSelectSentence = (sentence: ContentItem) => {
    setActiveSentence(sentence);
    setActiveMode('explanation');
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
          <div className="flex min-h-full items-center justify-center p-2">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-5xl transform overflow-hidden rounded-lg bg-gray-900 shadow-xl transition-all flex flex-col h-[90vh]">
                {/* 头部 */}
                <div className="bg-gradient-to-r from-purple-900 to-indigo-800 p-4 flex justify-between items-center">
                  <Dialog.Title className="text-lg font-semibold text-white">
                    {title}
                  </Dialog.Title>
                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      className="text-white/80 hover:text-white"
                      onClick={() => window.open(window.location.href, '_blank')}
                      title="在新窗口中打开"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      className="text-white/80 hover:text-white"
                      onClick={onClose}
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                {/* 标签页 */}
                <div className="flex border-b border-gray-700">
                  <button
                    onClick={() => setActiveMode('sentences')}
                    className={`px-4 py-3 font-medium text-sm ${
                      activeMode === 'sentences' 
                        ? 'text-white bg-gray-800 border-b-2 border-purple-500' 
                        : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                    }`}
                  >
                    句子列表
                  </button>
                  <button
                    onClick={() => setActiveMode('explanation')}
                    className={`px-4 py-3 font-medium text-sm ${
                      activeMode === 'explanation' 
                        ? 'text-white bg-gray-800 border-b-2 border-purple-500' 
                        : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                    }`}
                    disabled={!activeSentence}
                  >
                    知识点讲解
                  </button>
                </div>
                
                {/* 内容区域 */}
                <div className="flex-1 overflow-y-auto">
                  {activeMode === 'sentences' && (
                    <SentenceList 
                      sentences={sentences}
                      activeSentenceId={activeSentence?.id}
                      onSelectSentence={handleSelectSentence}
                    />
                  )}
                  
                  {activeMode === 'explanation' && activeSentence && (
                    <SentenceExplanation 
                      sentence={activeSentence}
                      getWordDefinition={getMockWordDefinition}
                    />
                  )}
                </div>
                
                {/* 底部工具栏 */}
                <div className="border-t border-gray-700 p-3 flex justify-between">
                  <div className="flex space-x-2">
                    <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m2.828-9.9a9 9 0 012.828-2.828" />
                      </svg>
                    </button>
                    <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700">
                      标记为已掌握
                    </button>
                    <button className="px-3 py-1 bg-gray-700 text-white text-sm rounded hover:bg-gray-600">
                      添加笔记
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
} 