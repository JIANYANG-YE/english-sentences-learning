'use client';

import { useState } from 'react';
import { Sentence } from '@/types';

interface SentenceCardProps {
  sentence: Sentence;
  onMastered?: (id: string, mastered: boolean) => void;
}

export default function SentenceCard({ sentence, onMastered }: SentenceCardProps) {
  const [showTranslation, setShowTranslation] = useState(false);
  const [isMastered, setIsMastered] = useState(false);
  
  const toggleTranslation = () => {
    setShowTranslation(!showTranslation);
  };
  
  const handleMastered = () => {
    const newMasteredStatus = !isMastered;
    setIsMastered(newMasteredStatus);
    if (onMastered) {
      onMastered(sentence.id, newMasteredStatus);
    }
  };
  
  const difficultyColors = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-yellow-100 text-yellow-800',
    advanced: 'bg-red-100 text-red-800'
  };
  
  return (
    <div className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow bg-white">
      <div className="mb-4">
        <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${difficultyColors[sentence.difficulty]}`}>
          {sentence.difficulty}
        </span>
      </div>
      
      <h3 className="text-xl font-semibold mb-2">{sentence.english}</h3>
      
      {showTranslation ? (
        <p className="text-gray-700 mb-4">{sentence.chinese}</p>
      ) : (
        <button 
          onClick={toggleTranslation}
          className="text-blue-500 mb-4 hover:underline"
        >
          显示翻译
        </button>
      )}
      
      {showTranslation && (
        <button 
          onClick={toggleTranslation}
          className="text-blue-500 mb-4 hover:underline block"
        >
          隐藏翻译
        </button>
      )}
      
      {sentence.notes && (
        <div className="bg-gray-50 p-3 rounded-md mb-4">
          <span className="font-medium">笔记：</span> {sentence.notes}
        </div>
      )}
      
      <div className="flex flex-wrap gap-2 mb-4">
        {sentence.tags.map(tag => (
          <span key={tag} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
            {tag}
          </span>
        ))}
      </div>
      
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handleMastered}
          className={`px-4 py-2 rounded-md ${
            isMastered 
              ? 'bg-green-500 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {isMastered ? '已掌握' : '标记为已掌握'}
        </button>
        
        <button className="text-gray-500 hover:text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
          </svg>
        </button>
      </div>
    </div>
  );
} 