import React, { useState, useEffect, useRef } from 'react';
import { ModeContentItem, ChineseToEnglishContent } from '@/types/courses/packageTypes';
import { FaVolumeUp, FaCheck, FaLightbulb, FaTimes, FaUndo } from 'react-icons/fa';

// 定义关键词类型
interface Keyword {
  word: string;
  meaning?: string;
  example?: string;
}

// 用户偏好设置类型
interface UserPreferences {
  autoPlayAudio?: boolean;
  showTranslation?: boolean;
  fontSize?: 'small' | 'medium' | 'large';
  highlightStyle?: 'underline' | 'background' | 'both';
  speechRate?: number;
  preferredVoice?: string;
}

interface ChineseToEnglishModeProps {
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

// 类型守卫，确保内容是ChineseToEnglishContent类型
function isChineseToEnglishContent(content: any): content is ChineseToEnglishContent {
  return content && 
    typeof content === 'object' && 
    'prompt' in content && 
    'answer' in content;
}

// 简单的字符串相似度计算函数
function calculateSimilarity(str1: string, str2: string): number {
  // 转换为小写并删除标点符号
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
  
  // 计算单词重叠数
  const words1 = s1.split(' ');
  const words2 = s2.split(' ');
  
  let matches = 0;
  for (const word of words1) {
    if (words2.includes(word)) matches++;
  }
  
  // 简单的相似度计算
  return matches / Math.max(words1.length, words2.length);
}

export default function ChineseToEnglishMode({
  item,
  isCompleted,
  onComplete,
  onNext,
  onPrevious,
  isLast,
  isFirst,
  userPreferences,
  userLevel
}: ChineseToEnglishModeProps) {
  // 确保content是ChineseToEnglishContent类型
  const content = item.content as ChineseToEnglishContent;
  
  const [userAnswer, setUserAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [feedback, setFeedback] = useState<{
    score: number;
    message: string;
    type: 'success' | 'warning' | 'error' | 'info';
  } | null>(null);
  const [hints, setHints] = useState<string[]>([]);
  const [showKeywords, setShowKeywords] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // 初始化
  useEffect(() => {
    if (isCompleted) {
      setShowAnswer(true);
      setUserAnswer(content.answer);
    } else {
      setShowAnswer(false);
      setUserAnswer('');
      setFeedback(null);
      setHints([]);
      setShowKeywords(false);
    }
    
    // 聚焦输入框
    if (inputRef.current && !isCompleted) {
      inputRef.current.focus();
    }
  }, [item.id, isCompleted, content.answer]);
  
  // 提交答案
  const handleSubmit = () => {
    if (!userAnswer.trim()) {
      setFeedback({
        score: 0,
        message: '请输入你的翻译',
        type: 'warning'
      });
      return;
    }
    
    // 计算答案相似度
    const correctAnswer = content.answer;
    const similarity = calculateSimilarity(userAnswer, correctAnswer);
    
    if (similarity >= 0.8) {
      // 答案非常接近
      setFeedback({
        score: similarity,
        message: '完美！你的回答非常准确。',
        type: 'success'
      });
      setShowAnswer(true);
      if (!isCompleted) onComplete();
    } else if (similarity >= 0.6) {
      // 答案基本正确，但有改进空间
      setFeedback({
        score: similarity,
        message: '答案基本正确，但可以进一步完善。',
        type: 'warning'
      });
      setShowAnswer(true);
    } else {
      // 答案不够准确
      setFeedback({
        score: similarity,
        message: '尝试再次翻译，或查看正确答案获取帮助。',
        type: 'error'
      });
      
      // 生成适当的提示
      generateHints(userAnswer, correctAnswer);
    }
  };
  
  // 生成提示
  const generateHints = (userAnswer: string, correctAnswer: string) => {
    const newHints: string[] = [];
    
    // 检查关键词是否被包含
    if (content.keywords && Array.isArray(content.keywords)) {
      const missingKeywords = content.keywords
        .filter((keyword: string | Keyword) => !userAnswer.toLowerCase().includes(
          typeof keyword === 'string' ? keyword.toLowerCase() : keyword.word.toLowerCase()
        ));
      
      if (missingKeywords.length > 0) {
        const keywordList = missingKeywords
          .slice(0, 2)
          .map((k: string | Keyword) => typeof k === 'string' ? k : k.word)
          .join(', ');
        
        newHints.push(`尝试使用这些关键词：${keywordList}${missingKeywords.length > 2 ? '...' : ''}`);
      }
    }
    
    // 检查句子长度
    const userWordCount = userAnswer.split(/\s+/).filter(Boolean).length;
    const correctWordCount = correctAnswer.split(/\s+/).filter(Boolean).length;
    
    if (Math.abs(userWordCount - correctWordCount) > 3) {
      newHints.push(`你的答案${userWordCount < correctWordCount ? '太短' : '太长'}了。正确答案包含大约 ${correctWordCount} 个单词。`);
    }
    
    // 检查句子结构
    if (!userAnswer.includes(',') && correctAnswer.includes(',')) {
      newHints.push('尝试使用逗号来分隔句子部分。');
    }
    
    // 如果没有生成提示，提供一个通用提示
    if (newHints.length === 0) {
      newHints.push('尝试重新组织你的句子，或考虑使用不同的表达方式。');
    }
    
    setHints(newHints);
  };
  
  // 播放音频
  const playAudio = () => {
    if (audioRef.current && content.audioUrl) {
      audioRef.current.play();
    }
  };
  
  // 重置答案
  const resetAnswer = () => {
    setUserAnswer('');
    setShowAnswer(false);
    setFeedback(null);
    setHints([]);
    if (inputRef.current) {
      inputRef.current.focus();
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
              <p className="text-sm text-gray-600 mt-1">
                匹配度: {Math.round(feedback.score * 100)}%
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  // 渲染提示信息
  const renderHints = () => {
    if (hints.length === 0) return null;
    
    return (
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mt-4 rounded">
        <div className="flex">
          <div className="flex-shrink-0">
            <FaLightbulb className="h-5 w-5 text-blue-500" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-blue-800">提示</p>
            <ul className="mt-1 text-sm text-blue-700 list-disc list-inside">
              {hints.map((hint, index) => (
                <li key={index}>{hint}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  };
  
  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Ctrl+Enter提交答案
    if (e.ctrlKey && e.key === 'Enter') {
      handleSubmit();
    }
  };
  
  // 渲染关键词提示
  const renderKeywords = () => {
    if (!showKeywords || !content.keywords || !Array.isArray(content.keywords) || content.keywords.length === 0) return null;
    
    return (
      <div className="bg-gray-50 p-3 rounded mt-3 border border-gray-200">
        <p className="text-sm font-medium text-gray-700 mb-1">关键词提示：</p>
        <div className="flex flex-wrap gap-2">
          {content.keywords.map((keyword: string | Keyword, index: number) => (
            <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
              {typeof keyword === 'string' ? keyword : keyword.word}
            </span>
          ))}
        </div>
      </div>
    );
  };
  
  // 渲染主要内容
  return (
    <div className="space-y-4">
      {/* 中文提示 */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-lg font-medium text-blue-800">
          {content.prompt}
        </p>
      </div>
      
      {/* 音频播放 */}
      {content.audioUrl && (
        <div className="mt-2">
          <audio ref={audioRef} src={content.audioUrl} preload="auto" />
          <button
            onClick={playAudio}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <FaVolumeUp className="mr-2" />
            <span>听发音</span>
          </button>
        </div>
      )}
      
      {/* 关键词切换 */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowKeywords(!showKeywords)}
          className="text-sm text-gray-600 hover:text-gray-800 flex items-center"
        >
          <FaLightbulb className="mr-1" size={14} />
          {showKeywords ? '隐藏关键词' : '显示关键词'}
        </button>
      </div>
      
      {/* 关键词提示 */}
      {renderKeywords()}
      
      {/* 用户输入 */}
      <div>
        <label htmlFor="translation" className="block text-sm font-medium text-gray-700 mb-1">
          请将上面的中文翻译成英文：
        </label>
        <textarea
          id="translation"
          ref={inputRef}
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={showAnswer && isCompleted}
          rows={4}
          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="在此输入你的英文翻译..."
        />
      </div>
      
      {/* 操作按钮 */}
      <div className="flex justify-between">
        <div>
          <button
            onClick={resetAnswer}
            disabled={isCompleted}
            className="mr-2 px-3 py-1 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <FaUndo className="mr-1" size={14} />
            重置
          </button>
        </div>
        
        <div>
          {!isFirst && (
            <button
              onClick={onPrevious}
              className="mr-2 px-3 py-1 bg-gray-100 text-gray-800 rounded hover:bg-gray-200"
            >
              上一题
            </button>
          )}
          
          {!showAnswer && (
            <button
              onClick={handleSubmit}
              className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              检查答案
            </button>
          )}
          
          {showAnswer && !isCompleted && (
            <button
              onClick={onComplete}
              className="px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700"
            >
              标记为完成
            </button>
          )}
          
          {isCompleted && !isLast && (
            <button
              onClick={onNext}
              className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              下一题
            </button>
          )}
        </div>
      </div>
      
      {/* 反馈信息 */}
      {renderFeedback()}
      
      {/* 提示信息 */}
      {renderHints()}
      
      {/* 正确答案 */}
      {showAnswer && (
        <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
          <p className="font-medium text-green-800 mb-1">参考答案：</p>
          <p className="text-green-900">{content.answer}</p>
        </div>
      )}
      
      {/* 用户参考选项 */}
      {userPreferences.showTranslation && !showAnswer && (
        <div className="mt-6 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-500 mb-2">参考翻译（启用了翻译辅助）：</p>
          <p className="text-gray-800">{content.answer}</p>
        </div>
      )}
    </div>
  );
}