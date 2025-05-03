import React, { useState, useEffect, useRef } from 'react';
import { ModeContentItem, ChineseToEnglishContent, EnglishToChineseContent, GrammarContent, ListeningContent } from '@/types/courses/packageTypes';
import { FaVolumeUp, FaCheck, FaLightbulb, FaTimes, FaUndo, FaRandom, FaExchangeAlt, FaSyncAlt } from 'react-icons/fa';

// 混合学习内容类型
interface MixedLearningContent {
  chineseToEnglish?: ChineseToEnglishContent;
  englishToChinese?: EnglishToChineseContent;
  grammar?: GrammarContent;
  listening?: ListeningContent;
  activeMode: 'chineseToEnglish' | 'englishToChinese' | 'grammar' | 'listening';
  rotationSequence?: Array<'chineseToEnglish' | 'englishToChinese' | 'grammar' | 'listening'>;
}

// 用户设置类型
interface UserPreferences {
  autoPlayAudio?: boolean;
  showTranslation?: boolean;
  fontSize?: 'small' | 'medium' | 'large';
  highlightStyle?: 'underline' | 'background' | 'both';
  speechRate?: number;
  preferredVoice?: string;
  mixedModeSettings?: {
    rotationInterval?: number; // 自动切换间隔（秒）
    enableAutoRotation?: boolean; // 是否自动切换模式
    preferredSequence?: Array<'chineseToEnglish' | 'englishToChinese' | 'grammar' | 'listening'>;
    modeProficiency?: {
      chineseToEnglish?: number; // 0-100的熟练度评分
      englishToChinese?: number;
      grammar?: number;
      listening?: number;
    };
    adaptiveDifficulty?: boolean; // 是否启用自适应难度
  };
}

interface MixedLearningModeProps {
  item: ModeContentItem;
  isCompleted: boolean;
  onComplete: () => void;
  onNext: () => void;
  onPrevious: () => void;
  isLast: boolean;
  isFirst: boolean;
  userPreferences: UserPreferences;
  userLevel: 'beginner' | 'intermediate' | 'advanced';
}

// 计算文本相似度
function calculateSimilarity(str1: string, str2: string): number {
  const normalize = (text: string) => {
    return text.toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  };
  
  const s1 = normalize(str1);
  const s2 = normalize(str2);
  
  if (s1 === s2) return 1.0;
  if (s1.length === 0 || s2.length === 0) return 0.0;
  
  const words1 = s1.split(' ');
  const words2 = s2.split(' ');
  
  let matches = 0;
  for (const word of words1) {
    if (words2.includes(word)) matches++;
  }
  
  return matches / Math.max(words1.length, words2.length);
}

export default function MixedLearningMode({
  item,
  isCompleted,
  onComplete,
  onNext,
  onPrevious,
  isLast,
  isFirst,
  userPreferences,
  userLevel
}: MixedLearningModeProps) {
  const content = item.content as MixedLearningContent;
  
  // 当前活动模式
  const [activeMode, setActiveMode] = useState<'chineseToEnglish' | 'englishToChinese' | 'grammar' | 'listening'>(
    content.activeMode || 'chineseToEnglish'
  );
  
  // 用户答案
  const [userAnswer, setUserAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [feedback, setFeedback] = useState<{
    score: number;
    message: string;
    type: 'success' | 'warning' | 'error' | 'info';
  } | null>(null);
  
  // 模式轮换
  const [isAutoRotating, setIsAutoRotating] = useState(
    userPreferences.mixedModeSettings?.enableAutoRotation || false
  );
  const [rotationInterval, setRotationInterval] = useState(
    userPreferences.mixedModeSettings?.rotationInterval || 60
  );
  const [rotationTimer, setRotationTimer] = useState<NodeJS.Timeout | null>(null);
  
  // 模式熟练度记录
  const [modeProficiency, setModeProficiency] = useState(
    userPreferences.mixedModeSettings?.modeProficiency || {
      chineseToEnglish: 0,
      englishToChinese: 0,
      grammar: 0,
      listening: 0
    }
  );
  
  // 更新模式熟练度
  const updateProficiency = (mode: 'chineseToEnglish' | 'englishToChinese' | 'grammar' | 'listening', score: number) => {
    setModeProficiency(prev => {
      const newProficiency = { ...prev };
      // 根据当前分数和历史熟练度计算新的熟练度
      newProficiency[mode] = Math.min(
        100, 
        (prev[mode] || 0) * 0.7 + score * 30 // 70%历史记录 + 30%当前表现
      );
      return newProficiency;
    });
  };
  
  // 音频引用
  const audioRef = useRef<HTMLAudioElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  // 初始化或重置学习内容
  useEffect(() => {
    if (isCompleted) {
      setShowAnswer(true);
    } else {
      resetLearningState();
    }
    
    // 设置自动模式轮换
    if (isAutoRotating && !rotationTimer) {
      const timer = setInterval(() => {
        rotateMode('next');
      }, rotationInterval * 1000);
      setRotationTimer(timer);
    }
    
    return () => {
      if (rotationTimer) {
        clearInterval(rotationTimer);
        setRotationTimer(null);
      }
    };
  }, [isCompleted, item.id, isAutoRotating, rotationInterval]);
  
  // 重置学习状态
  const resetLearningState = () => {
    setUserAnswer('');
    setShowAnswer(false);
    setFeedback(null);
    
    // 聚焦输入框
    if (inputRef.current && !isCompleted) {
      inputRef.current.focus();
    }
    
    // 如果是听力模式且设置了自动播放，则播放音频
    if (activeMode === 'listening' && content.listening?.audioUrl && userPreferences.autoPlayAudio) {
      setTimeout(() => {
        playAudio();
      }, 500);
    }
  };
  
  // 切换学习模式
  const rotateMode = (direction: 'next' | 'prev' | 'random') => {
    const modes: Array<'chineseToEnglish' | 'englishToChinese' | 'grammar' | 'listening'> = 
      content.rotationSequence || ['chineseToEnglish', 'englishToChinese', 'grammar', 'listening'];
    
    // 过滤掉没有内容的模式
    const availableModes = modes.filter(mode => !!content[mode]);
    
    if (availableModes.length <= 1) return;
    
    let nextModeIndex: number;
    const currentIndex = availableModes.indexOf(activeMode);
    
    if (direction === 'next') {
      nextModeIndex = (currentIndex + 1) % availableModes.length;
    } else if (direction === 'prev') {
      nextModeIndex = (currentIndex - 1 + availableModes.length) % availableModes.length;
    } else {
      // 随机，但不能是当前模式
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * availableModes.length);
      } while (randomIndex === currentIndex && availableModes.length > 1);
      nextModeIndex = randomIndex;
    }
    
    setActiveMode(availableModes[nextModeIndex]);
    resetLearningState();
  };
  
  // 播放音频
  const playAudio = () => {
    if (audioRef.current) {
      const audioUrl = 
        (activeMode === 'listening' && content.listening?.audioUrl) ||
        (activeMode === 'chineseToEnglish' && content.chineseToEnglish?.audioUrl) ||
        (activeMode === 'englishToChinese' && content.englishToChinese?.audioUrl) ||
        (activeMode === 'grammar' && content.grammar?.audioUrl);
      
      if (audioUrl) {
        audioRef.current.src = audioUrl;
        audioRef.current.playbackRate = userPreferences.speechRate || 1;
        audioRef.current.play();
      }
    }
  };
  
  // 提交答案
  const handleSubmit = () => {
    if (!userAnswer.trim()) {
      setFeedback({
        score: 0,
        message: '请输入你的答案',
        type: 'warning'
      });
      return;
    }
    
    let correctAnswer = '';
    let similarity = 0;
    
    // 根据当前模式获取正确答案
    if (activeMode === 'chineseToEnglish' && content.chineseToEnglish) {
      correctAnswer = content.chineseToEnglish.answer;
      similarity = calculateSimilarity(userAnswer, correctAnswer);
    } else if (activeMode === 'englishToChinese' && content.englishToChinese) {
      correctAnswer = content.englishToChinese.answer;
      similarity = calculateSimilarity(userAnswer, correctAnswer);
    } else if (activeMode === 'grammar' && content.grammar) {
      correctAnswer = content.grammar.answer;
      similarity = calculateSimilarity(userAnswer, correctAnswer);
    } else if (activeMode === 'listening' && content.listening) {
      correctAnswer = content.listening.transcript;
      similarity = calculateSimilarity(userAnswer, correctAnswer);
    }
    
    // 评分和反馈
    if (similarity >= 0.8) {
      setFeedback({
        score: similarity,
        message: '完美！你的回答非常准确。',
        type: 'success'
      });
      setShowAnswer(true);
      updateProficiency(activeMode, similarity);
      if (!isCompleted) onComplete();
    } else if (similarity >= 0.6) {
      setFeedback({
        score: similarity,
        message: '答案基本正确，但可以进一步完善。',
        type: 'warning'
      });
      setShowAnswer(true);
      updateProficiency(activeMode, similarity);
    } else {
      setFeedback({
        score: similarity,
        message: '尝试再次作答，或查看正确答案获取帮助。',
        type: 'error'
      });
      updateProficiency(activeMode, similarity * 0.5); // 错误答案也算部分熟练度
    }
  };
  
  // 重置答案
  const resetAnswer = () => {
    setUserAnswer('');
    setShowAnswer(false);
    setFeedback(null);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  
  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.key === 'Enter') {
      handleSubmit();
    }
  };
  
  // 切换自动轮换模式
  const toggleAutoRotation = () => {
    setIsAutoRotating(!isAutoRotating);
    
    if (!isAutoRotating) {
      const timer = setInterval(() => {
        rotateMode('next');
      }, rotationInterval * 1000);
      setRotationTimer(timer);
    } else if (rotationTimer) {
      clearInterval(rotationTimer);
      setRotationTimer(null);
    }
  };
  
  // 渲染当前模式内容
  const renderModeContent = () => {
    switch (activeMode) {
      case 'chineseToEnglish':
        return content.chineseToEnglish ? (
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">中译英练习</h3>
            <div className="bg-blue-50 p-4 rounded-lg mb-4 text-lg">
              {content.chineseToEnglish.prompt}
            </div>
            {content.chineseToEnglish.keywords && (
              <div className="text-sm text-gray-600 mb-2">
                <span className="font-medium">关键词: </span>
                {Array.isArray(content.chineseToEnglish.keywords) && 
                  content.chineseToEnglish.keywords.map((keyword, idx) => (
                    <span key={idx} className="mr-2 bg-blue-100 px-2 py-1 rounded">
                      {typeof keyword === 'string' ? keyword : keyword.word}
                    </span>
                  ))
                }
              </div>
            )}
          </div>
        ) : <div>中译英内容不可用</div>;
      
      case 'englishToChinese':
        return content.englishToChinese ? (
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">英译中练习</h3>
            <div className="bg-green-50 p-4 rounded-lg mb-4 text-lg">
              {content.englishToChinese.prompt}
            </div>
            {content.englishToChinese.audioUrl && (
              <button 
                onClick={playAudio} 
                className="bg-green-100 hover:bg-green-200 text-green-800 font-bold py-1 px-3 rounded inline-flex items-center mb-4"
              >
                <FaVolumeUp className="mr-1" /> 播放音频
              </button>
            )}
          </div>
        ) : <div>英译中内容不可用</div>;
      
      case 'grammar':
        return content.grammar ? (
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">语法练习</h3>
            <div className="bg-purple-50 p-4 rounded-lg mb-4 text-lg">
              {content.grammar.prompt}
            </div>
            {content.grammar.hint && (
              <div className="text-sm bg-purple-100 p-2 rounded mb-4">
                <span className="font-medium">提示: </span>{content.grammar.hint}
              </div>
            )}
          </div>
        ) : <div>语法练习内容不可用</div>;
      
      case 'listening':
        return content.listening ? (
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">听力练习</h3>
            <div className="bg-yellow-50 p-4 rounded-lg mb-4 text-lg text-center">
              {content.listening.instructions || "听音频并转写你听到的内容"}
            </div>
            {content.listening.audioUrl && (
              <div className="text-center mb-4">
                <button 
                  onClick={playAudio} 
                  className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 font-bold py-2 px-4 rounded inline-flex items-center"
                >
                  <FaVolumeUp className="mr-2" /> 播放音频
                </button>
              </div>
            )}
          </div>
        ) : <div>听力练习内容不可用</div>;
        
      default:
        return <div>没有可用的学习内容</div>;
    }
  };
  
  // 渲染反馈信息
  const renderFeedback = () => {
    if (!feedback) return null;
    
    const bgColor = 
      feedback.type === 'success' ? 'bg-green-50' :
      feedback.type === 'warning' ? 'bg-yellow-50' :
      feedback.type === 'error' ? 'bg-red-50' : 'bg-blue-50';
      
    const borderColor = 
      feedback.type === 'success' ? 'border-green-500' :
      feedback.type === 'warning' ? 'border-yellow-500' :
      feedback.type === 'error' ? 'border-red-500' : 'border-blue-500';
      
    const textColor = 
      feedback.type === 'success' ? 'text-green-800' :
      feedback.type === 'warning' ? 'text-yellow-800' :
      feedback.type === 'error' ? 'text-red-800' : 'text-blue-800';
    
    return (
      <div className={`${bgColor} border-l-4 ${borderColor} p-4 mt-4 rounded`}>
        <div className="flex">
          <div className="flex-shrink-0">
            {feedback.type === 'success' && <FaCheck className="h-5 w-5 text-green-500" />}
            {feedback.type === 'warning' && <FaLightbulb className="h-5 w-5 text-yellow-500" />}
            {feedback.type === 'error' && <FaTimes className="h-5 w-5 text-red-500" />}
          </div>
          <div className="ml-3">
            <p className={`text-sm ${textColor}`}>{feedback.message}</p>
            {feedback.score > 0 && (
              <div className="mt-1">
                <div className="bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${feedback.type === 'success' ? 'bg-green-500' : feedback.type === 'warning' ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{width: `${feedback.score * 100}%`}}
                  ></div>
                </div>
                <p className="text-xs text-gray-600 mt-1">得分: {(feedback.score * 100).toFixed(0)}%</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  // 渲染模式切换控制
  const renderModeControls = () => {
    return (
      <div className="flex items-center justify-between bg-gray-100 p-2 rounded mb-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => rotateMode('prev')}
            className="bg-white hover:bg-gray-200 text-gray-800 font-semibold py-1 px-2 rounded border border-gray-300"
            title="上一个模式"
          >
            <FaExchangeAlt className="transform rotate-90" />
          </button>
          <button
            onClick={() => rotateMode('random')}
            className="bg-white hover:bg-gray-200 text-gray-800 font-semibold py-1 px-2 rounded border border-gray-300"
            title="随机模式"
          >
            <FaRandom />
          </button>
          <button
            onClick={() => rotateMode('next')}
            className="bg-white hover:bg-gray-200 text-gray-800 font-semibold py-1 px-2 rounded border border-gray-300"
            title="下一个模式"
          >
            <FaExchangeAlt className="transform -rotate-90" />
          </button>
        </div>
        
        <div className="text-sm font-medium">
          当前模式: 
          <span className={`ml-1 px-2 py-1 rounded ${
            activeMode === 'chineseToEnglish' ? 'bg-blue-100 text-blue-800' :
            activeMode === 'englishToChinese' ? 'bg-green-100 text-green-800' :
            activeMode === 'grammar' ? 'bg-purple-100 text-purple-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {activeMode === 'chineseToEnglish' ? '中译英' :
             activeMode === 'englishToChinese' ? '英译中' :
             activeMode === 'grammar' ? '语法' : '听力'}
          </span>
        </div>
        
        <button
          onClick={toggleAutoRotation}
          className={`${isAutoRotating ? 'bg-indigo-500 text-white' : 'bg-white text-gray-800 border border-gray-300'} hover:bg-indigo-600 font-semibold py-1 px-3 rounded inline-flex items-center`}
          title={isAutoRotating ? '关闭自动切换' : '开启自动切换'}
        >
          <FaSyncAlt className={`mr-1 ${isAutoRotating ? 'animate-spin' : ''}`} />
          {isAutoRotating ? `${rotationInterval}秒自动切换` : '自动切换'}
        </button>
      </div>
    );
  };
  
  // 渲染熟练度指示器
  const renderProficiencyIndicator = () => {
    const modes = [
      { id: 'chineseToEnglish', name: '中译英', color: 'bg-blue-500' },
      { id: 'englishToChinese', name: '英译中', color: 'bg-green-500' },
      { id: 'grammar', name: '语法', color: 'bg-purple-500' },
      { id: 'listening', name: '听力', color: 'bg-yellow-500' }
    ];
    
    return (
      <div className="mt-6 bg-gray-50 p-3 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-2">模式熟练度</h4>
        <div className="space-y-2">
          {modes.map(mode => (
            <div key={mode.id} className="flex items-center">
              <span className="text-xs w-16">{mode.name}</span>
              <div className="flex-1 ml-2">
                <div className="bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${mode.color}`}
                    style={{width: `${modeProficiency[mode.id as keyof typeof modeProficiency] || 0}%`}}
                  ></div>
                </div>
              </div>
              <span className="text-xs ml-2 w-8">
                {Math.round(modeProficiency[mode.id as keyof typeof modeProficiency] || 0)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <audio ref={audioRef} className="hidden" />
      
      {/* 模式切换控制 */}
      {renderModeControls()}
      
      {/* 当前模式内容 */}
      {renderModeContent()}
      
      {/* 答案输入区 */}
      <div className="mb-4">
        <textarea
          ref={inputRef}
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`请输入你的${
            activeMode === 'chineseToEnglish' ? '英文翻译' :
            activeMode === 'englishToChinese' ? '中文翻译' :
            activeMode === 'grammar' ? '答案' : '听到的内容'
          }`}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={4}
          disabled={showAnswer || isCompleted}
        ></textarea>
      </div>
      
      {/* 反馈信息 */}
      {renderFeedback()}
      
      {/* 正确答案 */}
      {showAnswer && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-700 mb-2">正确答案:</h4>
          <p className="text-gray-800">
            {activeMode === 'chineseToEnglish' && content.chineseToEnglish?.answer}
            {activeMode === 'englishToChinese' && content.englishToChinese?.answer}
            {activeMode === 'grammar' && content.grammar?.answer}
            {activeMode === 'listening' && content.listening?.transcript}
          </p>
          {(activeMode === 'grammar' && content.grammar?.explanation) && (
            <div className="mt-2 text-sm">
              <h5 className="font-medium text-gray-700">解释:</h5>
              <p className="text-gray-600">{content.grammar.explanation}</p>
            </div>
          )}
        </div>
      )}
      
      {/* 操作按钮 */}
      <div className="mt-6 flex justify-between">
        <div>
          <button
            onClick={onPrevious}
            disabled={isFirst}
            className={`mr-2 ${isFirst ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'} text-gray-800 font-bold py-2 px-4 rounded`}
          >
            上一条
          </button>
          <button
            onClick={onNext}
            disabled={isLast}
            className={`${isLast ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'} text-gray-800 font-bold py-2 px-4 rounded`}
          >
            下一条
          </button>
        </div>
        
        <div>
          {!showAnswer && !isCompleted && (
            <button
              onClick={handleSubmit}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded"
            >
              提交答案
            </button>
          )}
          {!isCompleted && showAnswer && (
            <button
              onClick={resetAnswer}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded inline-flex items-center"
            >
              <FaUndo className="mr-1" /> 重新作答
            </button>
          )}
        </div>
      </div>
      
      {/* 熟练度指示器 */}
      {renderProficiencyIndicator()}
    </div>
  );
} 