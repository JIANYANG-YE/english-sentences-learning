'use client';

import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';

interface ContentItem {
  id: string;
  english: string;
  chinese: string;
}

interface LearningContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  sentences: ContentItem[];
  currentSentenceId?: string;
  title?: string;
}

interface WordDefinition {
  word: string;
  phonetic: string;
  partOfSpeech: string;
  definition: string;
  examples: string[];
  synonyms: string[];
  antonyms: string[];
}

// 模拟单词解析数据（实际应用中应从API获取）
const mockWordDefinition: WordDefinition = {
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
};

export default function LearningContentModal({
  isOpen,
  onClose,
  sentences,
  currentSentenceId,
  title = "学习内容"
}: LearningContentModalProps) {
  const [activeTab, setActiveTab] = useState<'sentences' | 'explanation'>('sentences');
  const [activeSentence, setActiveSentence] = useState<ContentItem | null>(null);
  const [showWordDefinition, setShowWordDefinition] = useState(false);
  
  // 如果有当前句子ID，找到对应的句子
  useState(() => {
    if (currentSentenceId) {
      const sentence = sentences.find(s => s.id === currentSentenceId);
      if (sentence) {
        setActiveSentence(sentence);
      }
    } else if (sentences.length > 0) {
      setActiveSentence(sentences[0]);
    }
  });
  
  // 处理选择句子
  const handleSelectSentence = (sentence: ContentItem) => {
    setActiveSentence(sentence);
    setActiveTab('explanation');
  };
  
  // 功能：单词点击选中（模拟）
  const handleWordClick = (word: string) => {
    setShowWordDefinition(true);
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
                    onClick={() => setActiveTab('sentences')}
                    className={`px-4 py-3 font-medium text-sm ${
                      activeTab === 'sentences' 
                        ? 'text-white bg-gray-800 border-b-2 border-purple-500' 
                        : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                    }`}
                  >
                    句子列表
                  </button>
                  <button
                    onClick={() => setActiveTab('explanation')}
                    className={`px-4 py-3 font-medium text-sm ${
                      activeTab === 'explanation' 
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
                  {/* 句子列表 */}
                  {activeTab === 'sentences' && (
                    <div className="p-4">
                      {sentences.map((sentence, index) => (
                        <div 
                          key={sentence.id}
                          className={`p-4 rounded-lg mb-2 cursor-pointer ${
                            activeSentence?.id === sentence.id 
                              ? 'bg-purple-900/30 border border-purple-500/50' 
                              : 'bg-gray-800 hover:bg-gray-700/70'
                          }`}
                          onClick={() => handleSelectSentence(sentence)}
                        >
                          <div className="text-white mb-2">{sentence.english}</div>
                          <div className="text-gray-400 text-sm">{sentence.chinese}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* 知识点讲解 */}
                  {activeTab === 'explanation' && activeSentence && (
                    <div className="p-4 space-y-8">
                      {/* 当前句子 */}
                      <div className="bg-gray-800 rounded-lg p-4 border-l-4 border-purple-500">
                        <div 
                          className="text-white text-lg mb-2"
                          onClick={(e) => {
                            // 模拟点击单词
                            if ((e.target as HTMLElement).tagName.toLowerCase() === 'span') {
                              handleWordClick((e.target as HTMLElement).textContent || '');
                            }
                          }}
                        >
                          {/* 将句子分割成单词，以便为每个单词添加点击事件 */}
                          {activeSentence.english.split(' ').map((word, i) => (
                            <span 
                              key={i} 
                              className="hover:bg-purple-500/30 hover:text-white cursor-pointer px-0.5 rounded"
                            >
                              {word}
                            </span>
                          )).reduce((prev, curr, i) => {
                            return i === 0 ? [curr] : [...prev, ' ', curr];
                          }, [] as React.ReactNode[])}
                        </div>
                        <div className="text-gray-400">{activeSentence.chinese}</div>
                      </div>
                      
                      {/* 中文翻译 */}
                      <div>
                        <h3 className="text-white font-medium mb-2">中文翻译</h3>
                        <div className="bg-gray-800 rounded-lg p-4">
                          <p className="text-gray-300">{activeSentence.chinese}</p>
                        </div>
                      </div>
                      
                      {/* 英文解释 */}
                      <div>
                        <h3 className="text-white font-medium mb-2">英文解释</h3>
                        <div className="bg-gray-800 rounded-lg p-4">
                          <p className="text-gray-300">
                            This sentence expresses a personal preference for the activity of reading. 
                            It uses the simple present tense to indicate a general truth or habitual action.
                          </p>
                        </div>
                      </div>
                      
                      {/* 单词与语法解析 */}
                      <div>
                        <h3 className="text-white font-medium mb-3">单词与语法注解</h3>
                        <div className="space-y-4">
                          <div className="bg-gray-800 rounded-lg p-4">
                            <div className="flex items-start">
                              <div className="text-purple-400 font-medium min-w-24">enjoy</div>
                              <div className="text-xs text-gray-500 bg-gray-700 px-2 py-0.5 rounded">动词</div>
                            </div>
                            <div className="mt-2 text-gray-300">
                              <div className="text-sm">基本含义: 从某事物中获得乐趣或满足</div>
                              <div className="text-sm mt-1">在句中表示主语对阅读的喜爱</div>
                              <div className="flex mt-2 text-xs text-gray-400">
                                <span>同义词:</span>
                                <div className="flex flex-wrap gap-1 ml-1">
                                  <span className="bg-green-900/40 px-1.5 py-0.5 rounded">like</span>
                                  <span className="bg-green-900/40 px-1.5 py-0.5 rounded">love</span>
                                  <span className="bg-green-900/40 px-1.5 py-0.5 rounded">relish</span>
                                </div>
                              </div>
                              <div className="flex mt-1 text-xs text-gray-400">
                                <span>反义词:</span>
                                <div className="flex flex-wrap gap-1 ml-1">
                                  <span className="bg-red-900/40 px-1.5 py-0.5 rounded">dislike</span>
                                  <span className="bg-red-900/40 px-1.5 py-0.5 rounded">hate</span>
                                </div>
                              </div>
                              <div className="mt-2 text-xs">
                                <div className="italic border-l-2 border-gray-700 pl-2 py-1">例句: She enjoys playing the piano.</div>
                              </div>
                            </div>
                          </div>
                          
                          {/* 更多单词解析... */}
                          <div className="bg-gray-800 rounded-lg p-4">
                            <div className="flex items-start">
                              <div className="text-purple-400 font-medium min-w-24">reading</div>
                              <div className="text-xs text-gray-500 bg-gray-700 px-2 py-0.5 rounded">名词</div>
                            </div>
                            <div className="mt-2 text-gray-300">
                              <div className="text-sm">基本含义: 通过阅读文字来获取信息或娱乐</div>
                              <div className="text-sm mt-1">在句中作为enjoy的对象，表示喜爱的活动</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* 常用句型 */}
                      <div>
                        <h3 className="text-white font-medium mb-2">常用句型</h3>
                        <div className="bg-gray-800 rounded-lg p-4">
                          <div className="mb-3">
                            <div className="text-gray-300 mb-1 text-sm font-medium">主语 + enjoy + 动名词</div>
                            <div className="text-sm text-gray-400 italic">例: I enjoy swimming. (我喜欢游泳。)</div>
                          </div>
                          <div>
                            <div className="text-gray-300 mb-1 text-sm font-medium">主语 + enjoy + 名词短语</div>
                            <div className="text-sm text-gray-400 italic">例: They enjoy the movie. (他们喜欢这部电影。)</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* 底部导航 */}
                {activeTab === 'explanation' && (
                  <div className="p-4 border-t border-gray-700 flex justify-between">
                    <button
                      onClick={() => {
                        const currentIndex = sentences.findIndex(s => s.id === activeSentence?.id);
                        if (currentIndex > 0) {
                          setActiveSentence(sentences[currentIndex - 1]);
                        }
                      }}
                      disabled={sentences.findIndex(s => s.id === activeSentence?.id) <= 0}
                      className={`flex items-center px-3 py-1.5 rounded-md ${
                        sentences.findIndex(s => s.id === activeSentence?.id) <= 0
                          ? 'text-gray-500 cursor-not-allowed'
                          : 'text-white bg-gray-700 hover:bg-gray-600'
                      }`}
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      上一句
                    </button>
                    
                    <button
                      onClick={() => {
                        const currentIndex = sentences.findIndex(s => s.id === activeSentence?.id);
                        if (currentIndex < sentences.length - 1) {
                          setActiveSentence(sentences[currentIndex + 1]);
                        }
                      }}
                      disabled={sentences.findIndex(s => s.id === activeSentence?.id) >= sentences.length - 1}
                      className={`flex items-center px-3 py-1.5 rounded-md ${
                        sentences.findIndex(s => s.id === activeSentence?.id) >= sentences.length - 1
                          ? 'text-gray-500 cursor-not-allowed'
                          : 'text-white bg-gray-700 hover:bg-gray-600'
                      }`}
                    >
                      下一句
                      <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                )}
                
                {/* 单词解析对话框 */}
                {showWordDefinition && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-20">
                    <div className="bg-gray-800 rounded-lg p-5 max-w-md w-full mx-4 shadow-xl">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-white">{mockWordDefinition.word}</h3>
                          <div className="text-gray-400 text-sm">{mockWordDefinition.phonetic}</div>
                        </div>
                        <button 
                          onClick={() => setShowWordDefinition(false)}
                          className="text-gray-500 hover:text-white"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      
                      <div className="flex items-center mb-3">
                        <span className="text-purple-400 bg-purple-900/20 px-2 py-0.5 rounded text-sm">{mockWordDefinition.partOfSpeech}</span>
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="text-gray-400 text-sm mb-1">基本含义：</h4>
                        <p className="text-white">{mockWordDefinition.definition}</p>
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="text-gray-400 text-sm mb-1">例句：</h4>
                        <ul className="space-y-1">
                          {mockWordDefinition.examples.map((example, index) => (
                            <li key={index} className="text-gray-300 italic text-sm">{example}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="text-gray-400 text-sm mb-1">同义词：</h4>
                        <div className="flex flex-wrap gap-1">
                          {mockWordDefinition.synonyms.map((synonym, index) => (
                            <span key={index} className="bg-green-900/40 px-2 py-0.5 rounded text-white text-sm">{synonym}</span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-gray-400 text-sm mb-1">反义词：</h4>
                        <div className="flex flex-wrap gap-1">
                          {mockWordDefinition.antonyms.map((antonym, index) => (
                            <span key={index} className="bg-red-900/40 px-2 py-0.5 rounded text-white text-sm">{antonym}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
} 