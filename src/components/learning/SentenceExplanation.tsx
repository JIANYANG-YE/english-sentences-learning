'use client';

import { useState } from 'react';
import { ContentItem, WordDefinition } from '@/types/learning';
import WordDefinitionCard from './WordDefinitionCard';

interface SentenceExplanationProps {
  sentence: ContentItem;
  getWordDefinition: (word: string) => WordDefinition | null;
}

export default function SentenceExplanation({
  sentence,
  getWordDefinition
}: SentenceExplanationProps) {
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [wordDefinition, setWordDefinition] = useState<WordDefinition | null>(null);

  // 处理单词点击
  const handleWordClick = (word: string) => {
    // 移除可能的标点符号
    const cleanWord = word.replace(/[.,!?;:'"()]/g, '').toLowerCase();
    const definition = getWordDefinition(cleanWord);
    
    if (definition) {
      setSelectedWord(cleanWord);
      setWordDefinition(definition);
    }
  };
  
  // 关闭单词解释
  const handleCloseDefinition = () => {
    setSelectedWord(null);
    setWordDefinition(null);
  };

  return (
    <div className="p-4 space-y-8">
      {/* 当前句子 */}
      <div className="bg-gray-800 rounded-lg p-4 border-l-4 border-purple-500">
        <div 
          className="text-white text-lg mb-2"
        >
          {/* 将句子分割成单词，为每个单词添加点击事件 */}
          {sentence.english.split(' ').map((word, i) => (
            <span 
              key={i} 
              className="hover:bg-purple-500/30 hover:text-white cursor-pointer px-0.5 rounded"
              onClick={() => handleWordClick(word)}
            >
              {word}{' '}
            </span>
          ))}
        </div>
        <div className="text-gray-400 mt-2">{sentence.chinese}</div>
      </div>
      
      {/* 单词解释卡片 */}
      {wordDefinition && (
        <WordDefinitionCard 
          definition={wordDefinition} 
          onClose={handleCloseDefinition} 
        />
      )}
      
      {/* 语法解释区域（可以根据需要扩展） */}
      <div className="bg-gray-800/60 rounded-lg p-4">
        <h3 className="text-white font-medium mb-2">语法分析</h3>
        <p className="text-gray-300 text-sm">
          本句使用了现在进行时态，表示正在进行的动作。
          <br />
          句子结构：主语 + 谓语 + 宾语
        </p>
      </div>
      
      {/* 文化背景知识（可以根据需要扩展） */}
      <div className="bg-gray-800/60 rounded-lg p-4">
        <h3 className="text-white font-medium mb-2">文化背景</h3>
        <p className="text-gray-300 text-sm">
          了解相关的文化背景知识，可以帮助更好地理解句子的含义和使用场景。
        </p>
      </div>
    </div>
  );
} 