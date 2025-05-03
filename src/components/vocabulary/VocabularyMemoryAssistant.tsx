import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

interface Word {
  id: string;
  term: string;
  definition: string;
  example: string;
  pronunciation: string;
  partOfSpeech: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  mnemonics?: string;
  imageUrl?: string;
}

interface MemoryTechnique {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

interface VocabularyMemoryAssistantProps {
  wordList: Word[];
  onProgress: (progress: { wordId: string, status: 'remembered' | 'reviewing' | 'difficult' }) => void;
  initialTechnique?: string;
}

const VocabularyMemoryAssistant: React.FC<VocabularyMemoryAssistantProps> = ({
  wordList,
  onProgress,
  initialTechnique = 'spaced-repetition'
}) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showDefinition, setShowDefinition] = useState(false);
  const [showExample, setShowExample] = useState(false);
  const [activeTechnique, setActiveTechnique] = useState(initialTechnique);
  const [userMnemonics, setUserMnemonics] = useState<Record<string, string>>({});
  const [flashcardFlipped, setFlashcardFlipped] = useState(false);
  const [reviewQueue, setReviewQueue] = useState<number[]>([]);
  const [completedWords, setCompletedWords] = useState<Set<string>>(new Set());
  const [userConfidence, setUserConfidence] = useState<Record<string, number>>({});

  const currentWord = wordList[currentWordIndex];

  const memoryTechniques: MemoryTechnique[] = [
    {
      id: 'spaced-repetition',
      name: '间隔重复',
      description: '根据记忆曲线安排单词复习时间',
      icon: <span>⏱️</span>
    },
    {
      id: 'mnemonic',
      name: '记忆法助记',
      description: '创建联想助记来帮助记忆单词',
      icon: <span>🧠</span>
    },
    {
      id: 'flashcard',
      name: '抽认卡',
      description: '使用传统抽认卡方式记忆',
      icon: <span>🃏</span>
    },
    {
      id: 'chunking',
      name: '分块记忆',
      description: '将单词分组记忆',
      icon: <span>🧩</span>
    },
    {
      id: 'visualization',
      name: '图像联想',
      description: '使用图像增强记忆效果',
      icon: <span>🖼️</span>
    }
  ];

  // 初始化间隔重复队列
  useEffect(() => {
    if (activeTechnique === 'spaced-repetition') {
      const initialQueue = wordList.map((_, index) => index);
      setReviewQueue(initialQueue);
    }
  }, [wordList, activeTechnique]);

  const moveToNextWord = useCallback(() => {
    if (currentWordIndex < wordList.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
      setShowDefinition(false);
      setShowExample(false);
      setFlashcardFlipped(false);
    } else {
      // 完成一轮学习
      alert('恭喜！你已完成本组单词的学习。');
    }
  }, [currentWordIndex, wordList.length]);

  const handleWordStatus = (status: 'remembered' | 'reviewing' | 'difficult') => {
    if (!currentWord) return;
    
    onProgress({ wordId: currentWord.id, status });
    
    // 更新用户信心度
    setUserConfidence(prev => ({
      ...prev,
      [currentWord.id]: status === 'remembered' ? 5 : status === 'reviewing' ? 3 : 1
    }));
    
    // 对于间隔重复技术，更新队列
    if (activeTechnique === 'spaced-repetition') {
      let newQueue = [...reviewQueue];
      if (status === 'difficult') {
        // 困难的词汇很快再次出现
        newQueue.splice(Math.min(currentWordIndex + 3, newQueue.length), 0, currentWordIndex);
      } else if (status === 'reviewing') {
        // 需要复习的词汇稍后再次出现
        newQueue.splice(Math.min(currentWordIndex + 5, newQueue.length), 0, currentWordIndex);
      } else {
        // 已记住的单词加入已完成集合
        setCompletedWords(prev => new Set(prev).add(currentWord.id));
      }
      setReviewQueue(newQueue);
    }
    
    moveToNextWord();
  };

  const saveUserMnemonic = (wordId: string, mnemonic: string) => {
    setUserMnemonics(prev => ({
      ...prev,
      [wordId]: mnemonic
    }));
  };

  // 根据不同的记忆技术渲染不同的学习界面
  const renderLearningInterface = () => {
    if (!currentWord) return <div>没有可学习的单词</div>;

    switch (activeTechnique) {
      case 'spaced-repetition':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold">{currentWord.term}</h3>
            <p className="text-gray-600 italic">{currentWord.pronunciation} ({currentWord.partOfSpeech})</p>
            
            <button 
              onClick={() => setShowDefinition(true)} 
              className={`w-full p-3 rounded ${showDefinition ? 'bg-blue-100' : 'bg-blue-500 text-white'}`}
              disabled={showDefinition}
            >
              {showDefinition ? currentWord.definition : '查看释义'}
            </button>
            
            <button 
              onClick={() => setShowExample(true)} 
              className={`w-full p-3 rounded ${showExample ? 'bg-green-100' : 'bg-green-500 text-white'}`}
              disabled={showExample}
            >
              {showExample ? currentWord.example : '查看例句'}
            </button>
            
            {(showDefinition && showExample) && (
              <div className="flex justify-between mt-4">
                <button 
                  onClick={() => handleWordStatus('difficult')}
                  className="flex-1 mr-2 p-3 bg-red-500 text-white rounded"
                >
                  困难
                </button>
                <button 
                  onClick={() => handleWordStatus('reviewing')}
                  className="flex-1 mx-2 p-3 bg-yellow-500 text-white rounded"
                >
                  需要复习
                </button>
                <button 
                  onClick={() => handleWordStatus('remembered')}
                  className="flex-1 ml-2 p-3 bg-green-500 text-white rounded"
                >
                  已记住
                </button>
              </div>
            )}
          </div>
        );
        
      case 'mnemonic':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold">{currentWord.term}</h3>
            <p>{currentWord.definition}</p>
            <p className="italic">"{currentWord.example}"</p>
            
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h4 className="font-bold">创建记忆助记</h4>
              <p className="text-sm">为这个单词创建一个容易记忆的联想或故事</p>
              
              <textarea 
                className="w-full p-2 mt-2 border rounded"
                rows={3}
                placeholder="输入你的助记方法..."
                value={userMnemonics[currentWord.id] || ''}
                onChange={(e) => saveUserMnemonic(currentWord.id, e.target.value)}
              />
              
              {currentWord.mnemonics && (
                <div className="mt-3 p-2 bg-white rounded border">
                  <p className="text-sm font-bold">建议助记法:</p>
                  <p className="text-sm">{currentWord.mnemonics}</p>
                </div>
              )}
            </div>
            
            <div className="flex justify-between mt-4">
              <button 
                onClick={() => handleWordStatus('difficult')}
                className="flex-1 mr-2 p-3 bg-red-500 text-white rounded"
              >
                困难
              </button>
              <button 
                onClick={() => handleWordStatus('reviewing')}
                className="flex-1 mx-2 p-3 bg-yellow-500 text-white rounded"
              >
                需要复习
              </button>
              <button 
                onClick={() => handleWordStatus('remembered')}
                className="flex-1 ml-2 p-3 bg-green-500 text-white rounded"
              >
                已记住
              </button>
            </div>
          </div>
        );
        
      case 'flashcard':
        return (
          <motion.div 
            className="cursor-pointer w-full h-64 rounded-lg shadow-lg"
            animate={{ rotateY: flashcardFlipped ? 180 : 0 }}
            transition={{ duration: 0.5 }}
            onClick={() => setFlashcardFlipped(!flashcardFlipped)}
          >
            <div className="relative w-full h-full">
              <div 
                className={`absolute w-full h-full p-6 bg-white rounded-lg flex flex-col justify-center items-center backface-hidden ${flashcardFlipped ? 'hidden' : ''}`}
              >
                <h3 className="text-2xl font-bold">{currentWord.term}</h3>
                <p className="text-gray-600 mt-2">{currentWord.pronunciation}</p>
                <p className="text-sm mt-4">点击卡片查看释义</p>
              </div>
              
              <div 
                className={`absolute w-full h-full p-6 bg-blue-50 rounded-lg flex flex-col justify-center items-center backface-hidden ${!flashcardFlipped ? 'hidden' : ''}`}
                style={{ transform: 'rotateY(180deg)' }}
              >
                <p className="font-semibold">{currentWord.definition}</p>
                <p className="italic mt-2 text-sm">"{currentWord.example}"</p>
                <p className="text-sm mt-4">点击卡片返回</p>
              </div>
            </div>
            
            {flashcardFlipped && (
              <div className="mt-4 flex justify-between">
                <button 
                  onClick={(e) => { e.stopPropagation(); handleWordStatus('difficult');}}
                  className="flex-1 mr-2 p-3 bg-red-500 text-white rounded"
                >
                  困难
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleWordStatus('reviewing');}}
                  className="flex-1 mx-2 p-3 bg-yellow-500 text-white rounded"
                >
                  需要复习
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleWordStatus('remembered');}}
                  className="flex-1 ml-2 p-3 bg-green-500 text-white rounded"
                >
                  已记住
                </button>
              </div>
            )}
          </motion.div>
        );

      case 'visualization':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold">{currentWord.term}</h3>
            <p>{currentWord.definition}</p>
            
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-center">
                {currentWord.imageUrl ? (
                  <img 
                    src={currentWord.imageUrl} 
                    alt={currentWord.term} 
                    className="max-h-48 rounded"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 rounded flex items-center justify-center">
                    <p className="text-gray-500">无图像可用</p>
                  </div>
                )}
              </div>
              <p className="mt-3 text-sm">通过图像联想记忆单词: 尝试将这个图像与单词建立强连接。</p>
            </div>
            
            <p className="italic">"{currentWord.example}"</p>
            
            <div className="flex justify-between mt-4">
              <button 
                onClick={() => handleWordStatus('difficult')}
                className="flex-1 mr-2 p-3 bg-red-500 text-white rounded"
              >
                困难
              </button>
              <button 
                onClick={() => handleWordStatus('reviewing')}
                className="flex-1 mx-2 p-3 bg-yellow-500 text-white rounded"
              >
                需要复习
              </button>
              <button 
                onClick={() => handleWordStatus('remembered')}
                className="flex-1 ml-2 p-3 bg-green-500 text-white rounded"
              >
                已记住
              </button>
            </div>
          </div>
        );
        
      default:
        return <div>选择一种记忆技术开始学习</div>;
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">词汇记忆助手</h2>
        <div className="flex overflow-x-auto pb-2 mb-4 space-x-2">
          {memoryTechniques.map(technique => (
            <button
              key={technique.id}
              className={`px-4 py-2 rounded-full flex items-center whitespace-nowrap ${
                activeTechnique === technique.id 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
              onClick={() => setActiveTechnique(technique.id)}
            >
              <span className="mr-2">{technique.icon}</span>
              {technique.name}
            </button>
          ))}
        </div>
        
        <div className="mb-4 bg-gray-100 rounded-lg p-3">
          <div className="flex justify-between items-center">
            <span>进度: {completedWords.size}/{wordList.length}</span>
            <span>当前技术: {memoryTechniques.find(t => t.id === activeTechnique)?.name}</span>
          </div>
          <div className="w-full bg-gray-300 h-2 rounded-full mt-2">
            <div 
              className="bg-blue-500 h-2 rounded-full" 
              style={{ width: `${(completedWords.size / wordList.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        {renderLearningInterface()}
      </div>
    </div>
  );
};

export default VocabularyMemoryAssistant; 