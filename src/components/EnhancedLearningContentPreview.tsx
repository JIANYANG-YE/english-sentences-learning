'use client';

import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useRouter } from 'next/navigation';
import { LearningMode } from '@/types/learning';

interface EnhancedLearningContentPreviewProps {
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
    case 'mixed':
      return {
        gradient: 'from-pink-600 to-rose-600',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        ),
        title: '混合模式'
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

// 获取学习模式帮助信息和预期目标
function getModeInfo(mode: string) {
  switch (mode) {
    case 'chinese-to-english':
      return {
        helpText: '在中译英模式中，你将看到中文句子，尝试将其翻译成英文。这有助于加强你的英语表达能力和词汇运用。',
        expectedOutcomes: [
          '提高英语表达能力',
          '加强词汇主动应用',
          '巩固语法结构记忆'
        ],
        bestPractices: [
          '先理解句子核心含义，再思考英文表达',
          '尝试多种表达方式，而不仅仅是字面翻译',
          '重视动词和介词的正确搭配'
        ],
        interactionType: 'translation',
        difficultyAdjustment: '可根据你的回答准确度自动调整句子难度'
      };
    case 'english-to-chinese':
      return {
        helpText: '在英译中模式中，你将看到英文句子，尝试将其翻译成中文。这有助于提高你的英语阅读理解能力和翻译技巧。',
        expectedOutcomes: [
          '提升英语阅读理解能力',
          '掌握地道的翻译技巧',
          '扩大被动词汇量'
        ],
        bestPractices: [
          '先通读全句，理解整体含义',
          '注意英文长句的逻辑结构',
          '追求意义等价而非字面对应'
        ],
        interactionType: 'translation',
        difficultyAdjustment: '可以选择隐藏关键词解释，增加挑战'
      };
    case 'grammar':
      return {
        helpText: '在语法模式中，你将分析句子结构，找出主语、谓语、宾语等成分，深入理解英语语法规则和句式结构。',
        expectedOutcomes: [
          '掌握英语句子成分分析',
          '理解各类从句结构',
          '提高写作的语法准确性'
        ],
        bestPractices: [
          '总是先找出句子的主谓结构',
          '注意标点符号在划分句子结构中的作用',
          '分析长句时，将其分解为多个简单结构'
        ],
        interactionType: 'analysis',
        difficultyAdjustment: '可调整句子复杂度，从简单陈述句到多重复合句'
      };
    case 'listening':
      return {
        helpText: '在听力模式中，你将听英语音频，并写出听到的内容，这有助于提高你的英语听力理解能力和拼写能力。',
        expectedOutcomes: [
          '提高对不同语速的适应能力',
          '培养对关键词的敏感度',
          '提升拼写准确性'
        ],
        bestPractices: [
          '注意语音的连读和弱读现象',
          '根据上下文推测不确定的单词',
          '利用重复听取功能确认难点'
        ],
        interactionType: 'dictation',
        difficultyAdjustment: '可调整播放速度和重复次数，适应不同水平'
      };
    case 'notes':
      return {
        helpText: '在笔记模式中，你可以为文本中的重点内容添加笔记和标记，方便学习和复习。',
        expectedOutcomes: [
          '建立个性化学习笔记系统',
          '加深对重点内容的理解和记忆',
          '形成有效的学习回顾材料'
        ],
        bestPractices: [
          '使用不同颜色标记不同类型的内容',
          '添加自己的理解而非简单抄写',
          '定期回顾笔记，加深记忆'
        ],
        interactionType: 'annotation',
        difficultyAdjustment: '可选择自动高亮关键点或完全自主标记'
      };
    case 'mixed':
      return {
        helpText: '在混合模式中，你将体验多种学习方式的结合，系统会根据你的表现动态调整学习内容和挑战难度。',
        expectedOutcomes: [
          '全面提升听说读写能力',
          '发现并强化个人弱点',
          '保持学习的趣味性和挑战性'
        ],
        bestPractices: [
          '专注当前任务，不必担心下一个挑战',
          '注意各种练习之间的知识联系',
          '利用系统反馈调整学习策略'
        ],
        interactionType: 'adaptive',
        difficultyAdjustment: '根据你的实时表现自动调整挑战类型和难度'
      };
    default:
      return {
        helpText: '选择一种适合自己的学习模式，开始你的英语学习之旅。',
        expectedOutcomes: [],
        bestPractices: [],
        interactionType: 'basic',
        difficultyAdjustment: ''
      };
  }
}

// 创建交互式演示组件
const InteractiveDemo = ({ mode, content }: { mode: LearningMode, content?: {english: string, chinese: string} }) => {
  const [inputValue, setInputValue] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  
  // 根据模式获取演示内容
  const getDemoContent = () => {
    if (!content) return { prompt: '', answer: '' };
    
    switch (mode) {
      case 'chinese-to-english':
        return { 
          prompt: content.chinese.split('。')[0] + '。', 
          answer: content.english.split('.')[0] + '.'
        };
      case 'english-to-chinese':
        return { 
          prompt: content.english.split('.')[0] + '.', 
          answer: content.chinese.split('。')[0] + '。'
        };
      case 'grammar':
        const sentence = content.english.split('.')[0] + '.';
        return { 
          prompt: sentence, 
          answer: '主语: I\n谓语: hated\n宾语: English\n状语: in middle school'
        };
      case 'listening':
        return { 
          prompt: '🔊 音频播放: "I hated English in middle school."', 
          answer: 'I hated English in middle school.'
        };
      case 'notes':
        return { 
          prompt: content.english.split('.')[0] + '.', 
          answer: '已添加笔记: "hate" - 强烈不喜欢，讨厌。\n"middle school" - 对应中国的初中。'
        };
      case 'mixed':
        return { 
          prompt: '多种练习将根据你的表现交替出现。\n当前练习: 翻译成英文\n"我在中学时讨厌英语。"', 
          answer: 'I hated English in middle school.'
        };
      default:
        return { prompt: '', answer: '' };
    }
  };
  
  const demoContent = getDemoContent();
  
  // 检查答案
  const checkAnswer = () => {
    // 简单演示，实际应用需要更智能的比较
    const isMatch = inputValue.toLowerCase().includes(demoContent.answer.toLowerCase().substring(0, 10));
    setIsCorrect(isMatch);
    setShowAnswer(true);
  };
  
  // 清除输入
  const clearInput = () => {
    setInputValue('');
    setShowAnswer(false);
    setIsCorrect(null);
  };
  
  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h3 className="text-white font-medium mb-3">交互式演示</h3>
      
      <div className="mb-4">
        <div className="text-gray-300 mb-2 bg-gray-700 p-3 rounded">
          {demoContent.prompt}
        </div>
        
        {/* 不同的交互方式 */}
        {mode !== 'notes' ? (
          <div className="mb-3">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full bg-gray-700 text-white border border-gray-600 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder={mode === 'grammar' ? "输入句子分析结果..." : mode === 'listening' ? "输入你听到的内容..." : "输入你的翻译..."}
            />
          </div>
        ) : (
          <div className="mb-3 flex items-center bg-gray-700 p-2 rounded">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-grow bg-transparent text-white focus:outline-none"
              placeholder="添加笔记..."
            />
            <button className="ml-2 text-blue-400 hover:text-blue-300">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </div>
        )}
        
        <div className="flex space-x-2">
          <button
            onClick={checkAnswer}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
          >
            检查答案
          </button>
          <button
            onClick={clearInput}
            className="px-3 py-1.5 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm transition-colors"
          >
            清除
          </button>
        </div>
      </div>
      
      {/* 反馈 */}
      {showAnswer && (
        <div className={`mt-4 p-3 rounded ${isCorrect ? 'bg-green-900/30' : 'bg-red-900/30'}`}>
          <div className="flex items-start">
            <div className={`mr-2 mt-0.5 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
              {isCorrect ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>
            <div>
              <p className={`font-medium ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                {isCorrect ? '答案正确！' : '再试一次'}
              </p>
              <p className="text-gray-300 mt-1">标准答案:</p>
              <p className="text-white mt-1 bg-gray-700/50 p-2 rounded">
                {demoContent.answer}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function EnhancedLearningContentPreview({
  isOpen,
  onClose,
  courseId,
  lessonId,
  lessonTitle,
  mode,
  content,
  onStartLearning
}: EnhancedLearningContentPreviewProps) {
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState('preview');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [learningGoals, setLearningGoals] = useState<string[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  
  const modeStyle = getModeStyleAndIcon(mode);
  const modeInfo = getModeInfo(mode);
  
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
  
  // 设置默认学习目标
  useEffect(() => {
    if (modeInfo.expectedOutcomes.length > 0) {
      setLearningGoals([modeInfo.expectedOutcomes[0]]);
    }
  }, [modeInfo.expectedOutcomes]);
  
  // 切换学习目标
  const toggleLearningGoal = (goal: string) => {
    if (learningGoals.includes(goal)) {
      setLearningGoals(learningGoals.filter(g => g !== goal));
    } else {
      setLearningGoals([...learningGoals, goal]);
    }
  };
  
  // 处理开始学习
  const handleStartLearning = () => {
    // 在实际应用中，这里可以保存用户选择的学习目标和难度设置
    onStartLearning();
    // 构建包含难度和目标的查询参数
    const queryParams = new URLSearchParams();
    queryParams.append('difficulty', selectedDifficulty);
    if (learningGoals.length > 0) {
      queryParams.append('goals', learningGoals.join(','));
    }
    
    // 跳转到学习页面
    router.push(`/courses/${courseId}/lessons/${lessonId}/${mode}?${queryParams.toString()}`);
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
                      模式演示
                    </button>
                    <button
                      onClick={() => setCurrentTab('settings')}
                      className={`px-4 py-2 font-medium text-sm ${
                        currentTab === 'settings' 
                          ? 'text-white border-b-2 border-white' 
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      学习设置
                    </button>
                    <button
                      onClick={() => setCurrentTab('help')}
                      className={`px-4 py-2 font-medium text-sm ${
                        currentTab === 'help' 
                          ? 'text-white border-b-2 border-white' 
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      学习指南
                    </button>
                  </div>
                  
                  {/* 模式演示 */}
                  {currentTab === 'preview' && (
                    <div>
                      <p className="text-gray-300 mb-6">
                        体验<span className="text-white font-medium">{modeStyle.title}</span>的学习流程。下面是一个互动演示，帮助你了解这种模式的学习方式。
                      </p>
                      
                      <InteractiveDemo mode={mode} content={content} />
                      
                      <div className="mt-6 flex justify-between items-center">
                        <p className="text-sm text-gray-400">
                          实际学习中的内容和体验会更加丰富和完整。
                        </p>
                        <button
                          onClick={handleStartLearning}
                          className={`px-4 py-2 bg-gradient-to-r ${modeStyle.gradient} text-white rounded-md flex items-center`}
                        >
                          开始学习
                          <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {/* 学习设置 */}
                  {currentTab === 'settings' && (
                    <div>
                      <p className="text-gray-300 mb-6">
                        根据你的需求和能力定制学习体验，设置学习目标和难度。
                      </p>
                      
                      {/* 难度设置 */}
                      <div className="mb-6">
                        <h3 className="text-white font-medium mb-3">难度设置</h3>
                        <div className="flex space-x-3">
                          <button
                            onClick={() => setSelectedDifficulty('easy')}
                            className={`px-4 py-2 rounded-md transition-colors ${
                              selectedDifficulty === 'easy'
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                          >
                            简单
                          </button>
                          <button
                            onClick={() => setSelectedDifficulty('medium')}
                            className={`px-4 py-2 rounded-md transition-colors ${
                              selectedDifficulty === 'medium'
                                ? 'bg-yellow-600 text-white'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                          >
                            中等
                          </button>
                          <button
                            onClick={() => setSelectedDifficulty('hard')}
                            className={`px-4 py-2 rounded-md transition-colors ${
                              selectedDifficulty === 'hard'
                                ? 'bg-red-600 text-white'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                          >
                            困难
                          </button>
                        </div>
                        <p className="mt-2 text-sm text-gray-400">
                          {selectedDifficulty === 'easy' && '简单模式适合初学者，提供更多提示和帮助。'}
                          {selectedDifficulty === 'medium' && '中等难度适合有一定基础的学习者，平衡挑战与辅助。'}
                          {selectedDifficulty === 'hard' && '困难模式适合高级学习者，提供更少提示，更多挑战。'}
                        </p>
                      </div>
                      
                      {/* 学习目标 */}
                      <div className="mb-6">
                        <h3 className="text-white font-medium mb-3">学习目标 (选择1-3个)</h3>
                        <div className="space-y-2">
                          {modeInfo.expectedOutcomes.map((outcome, index) => (
                            <div key={index} className="flex items-center">
                              <button
                                onClick={() => toggleLearningGoal(outcome)}
                                className={`w-5 h-5 rounded flex items-center justify-center mr-3 transition-colors ${
                                  learningGoals.includes(outcome)
                                    ? `bg-gradient-to-r ${modeStyle.gradient}`
                                    : 'bg-gray-700'
                                }`}
                              >
                                {learningGoals.includes(outcome) && (
                                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </button>
                              <span className="text-gray-300">{outcome}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* 自适应调整 */}
                      <div className="mb-6">
                        <h3 className="text-white font-medium mb-2">自适应学习</h3>
                        <p className="text-gray-300">
                          {modeInfo.difficultyAdjustment}
                        </p>
                      </div>
                      
                      <div className="mt-6 flex justify-end">
                        <button
                          onClick={handleStartLearning}
                          className={`px-4 py-2 bg-gradient-to-r ${modeStyle.gradient} text-white rounded-md flex items-center`}
                        >
                          应用设置并开始学习
                          <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {/* 学习指南 */}
                  {currentTab === 'help' && (
                    <div>
                      <p className="text-gray-300 mb-6">
                        了解如何有效使用{modeStyle.title}来提高你的英语水平。
                      </p>
                      
                      <div className="bg-gray-800 rounded-lg p-4 mb-6">
                        <h3 className="text-white font-medium mb-2">模式介绍</h3>
                        <p className="text-gray-300">
                          {modeInfo.helpText}
                        </p>
                      </div>
                      
                      <div className="mb-6">
                        <h3 className="text-white font-medium mb-3">最佳实践</h3>
                        <ul className="space-y-2">
                          {modeInfo.bestPractices.map((practice, index) => (
                            <li key={index} className="flex items-start">
                              <div className="text-blue-400 mr-2 mt-1">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </div>
                              <span className="text-gray-300">{practice}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="mb-6">
                        <h3 className="text-white font-medium mb-3">预期收获</h3>
                        <ul className="space-y-2">
                          {modeInfo.expectedOutcomes.map((outcome, index) => (
                            <li key={index} className="flex items-start">
                              <div className="text-green-400 mr-2 mt-1">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                              <span className="text-gray-300">{outcome}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="mt-6 flex justify-end">
                        <button
                          onClick={handleStartLearning}
                          className={`px-4 py-2 bg-gradient-to-r ${modeStyle.gradient} text-white rounded-md flex items-center`}
                        >
                          开始学习
                          <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
} 