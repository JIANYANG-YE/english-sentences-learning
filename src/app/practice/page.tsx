'use client';

import { useState, useEffect } from 'react';
import { sentences } from '@/data/sampleData';
import { Sentence } from '@/types';

export default function PracticePage() {
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [randomSentences, setRandomSentences] = useState<Sentence[]>([]);
  const [practiceMode, setPracticeMode] = useState<'translation' | 'typing'>('translation');
  
  useEffect(() => {
    // 随机打乱句子顺序
    const shuffled = [...sentences].sort(() => 0.5 - Math.random());
    setRandomSentences(shuffled.slice(0, 10)); // 选择10个句子进行练习
  }, []);
  
  const currentSentence = randomSentences[currentSentenceIndex];
  
  const handleNextSentence = () => {
    if (currentSentenceIndex < randomSentences.length - 1) {
      setCurrentSentenceIndex(prevIndex => prevIndex + 1);
      setShowTranslation(false);
      setUserAnswer('');
      setIsChecked(false);
    } else {
      // 练习完成
      alert('恭喜你完成了练习！');
      // 重新开始
      const shuffled = [...sentences].sort(() => 0.5 - Math.random());
      setRandomSentences(shuffled.slice(0, 10));
      setCurrentSentenceIndex(0);
      setShowTranslation(false);
      setUserAnswer('');
      setIsChecked(false);
    }
  };
  
  const toggleTranslation = () => {
    setShowTranslation(!showTranslation);
  };
  
  const handleCheckAnswer = () => {
    const correctAnswer = currentSentence.english.toLowerCase().trim();
    const userAnswerCleaned = userAnswer.toLowerCase().trim();
    
    // 简单检查答案，在实际应用中可以使用更智能的比较方法
    const isAnswerCorrect = userAnswerCleaned === correctAnswer;
    setIsCorrect(isAnswerCorrect);
    setIsChecked(true);
  };
  
  const handleModeChange = (mode: 'translation' | 'typing') => {
    setPracticeMode(mode);
    setShowTranslation(false);
    setUserAnswer('');
    setIsChecked(false);
  };
  
  if (!currentSentence) {
    return <div className="text-center py-10">加载中...</div>;
  }
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">英语句子练习</h1>
        <p className="text-lg text-gray-600">
          通过练习巩固你的英语句子学习
        </p>
        
        <div className="flex justify-center mt-6 space-x-4">
          <button 
            onClick={() => handleModeChange('translation')}
            className={`px-4 py-2 rounded-lg ${
              practiceMode === 'translation' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-800'
            }`}
          >
            翻译练习
          </button>
          <button 
            onClick={() => handleModeChange('typing')}
            className={`px-4 py-2 rounded-lg ${
              practiceMode === 'typing' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-800'
            }`}
          >
            输入练习
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium text-gray-500">
            {currentSentenceIndex + 1} / {randomSentences.length}
          </span>
          <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${
            currentSentence.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
            currentSentence.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {currentSentence.difficulty}
          </span>
        </div>
        
        {practiceMode === 'translation' ? (
          <div>
            <div className="text-xl font-medium mb-6 text-center">
              {currentSentence.chinese}
            </div>
            
            {showTranslation ? (
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <p className="text-center text-lg">{currentSentence.english}</p>
              </div>
            ) : (
              <button 
                onClick={toggleTranslation}
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mb-4"
              >
                显示英文
              </button>
            )}
          </div>
        ) : (
          <div>
            <div className="text-xl font-medium mb-6 text-center">
              {currentSentence.chinese}
            </div>
            
            <textarea
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="请输入对应的英文句子..."
              className={`w-full p-3 border rounded-lg mb-4 min-h-24 ${
                isChecked ? (isCorrect ? 'border-green-500' : 'border-red-500') : 'border-gray-300'
              }`}
              disabled={isChecked}
            />
            
            {isChecked && (
              <div className={`p-4 rounded-lg mb-4 ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
                <p className="font-medium mb-2">{isCorrect ? '✓ 回答正确！' : '✗ 回答不正确'}</p>
                <p className="text-gray-700">正确答案：{currentSentence.english}</p>
              </div>
            )}
            
            {!isChecked && (
              <button 
                onClick={handleCheckAnswer}
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mb-4"
              >
                检查答案
              </button>
            )}
          </div>
        )}
        
        <div className="mt-6">
          <button 
            onClick={handleNextSentence}
            className="w-full py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
          >
            下一句
          </button>
        </div>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-medium mb-2">提示：</h3>
        <ul className="list-disc list-inside text-gray-600 text-sm">
          <li>在翻译练习模式下，尝试先自己翻译，然后再查看答案</li>
          <li>在输入练习模式下，仔细检查拼写和语法</li>
          <li>重复练习是提高的关键</li>
        </ul>
      </div>
    </div>
  );
} 