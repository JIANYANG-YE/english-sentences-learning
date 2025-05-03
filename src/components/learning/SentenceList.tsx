'use client';

import { ContentItem } from '@/types/learning';

interface SentenceListProps {
  sentences: ContentItem[];
  activeSentenceId?: string;
  onSelectSentence: (sentence: ContentItem) => void;
}

export default function SentenceList({
  sentences,
  activeSentenceId,
  onSelectSentence
}: SentenceListProps) {
  return (
    <div className="p-4">
      {sentences.map((sentence) => (
        <div 
          key={sentence.id}
          className={`p-4 rounded-lg mb-2 cursor-pointer ${
            activeSentenceId === sentence.id 
              ? 'bg-purple-900/30 border border-purple-500/50' 
              : 'bg-gray-800 hover:bg-gray-700/70'
          }`}
          onClick={() => onSelectSentence(sentence)}
        >
          <div className="text-white mb-2">{sentence.english}</div>
          <div className="text-gray-400 text-sm">{sentence.chinese}</div>
        </div>
      ))}
    </div>
  );
} 