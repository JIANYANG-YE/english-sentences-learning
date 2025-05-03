'use client';

import { WordDefinition } from '@/types/learning';

interface WordDefinitionCardProps {
  definition: WordDefinition;
  onClose: () => void;
}

export default function WordDefinitionCard({
  definition,
  onClose
}: WordDefinitionCardProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-purple-400/50 shadow-lg">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-xl font-bold text-white">{definition.word}</h3>
        <button 
          className="text-gray-400 hover:text-white" 
          onClick={onClose}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="text-purple-300 text-sm mb-2">{definition.phonetic}</div>
      <div className="text-gray-300 text-sm mb-4">{definition.partOfSpeech}</div>
      
      <div className="mb-4">
        <h4 className="text-gray-400 text-sm mb-1">释义</h4>
        <p className="text-white">{definition.definition}</p>
      </div>
      
      {definition.examples.length > 0 && (
        <div className="mb-4">
          <h4 className="text-gray-400 text-sm mb-1">例句</h4>
          <ul className="space-y-1">
            {definition.examples.map((example, index) => (
              <li key={index} className="text-gray-300 text-sm">{example}</li>
            ))}
          </ul>
        </div>
      )}
      
      {definition.synonyms.length > 0 && (
        <div className="mb-4">
          <h4 className="text-gray-400 text-sm mb-1">同义词</h4>
          <div className="flex flex-wrap gap-2">
            {definition.synonyms.map((word, index) => (
              <span key={index} className="bg-gray-700 text-sm px-2 py-1 rounded text-gray-300">
                {word}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {definition.antonyms.length > 0 && (
        <div>
          <h4 className="text-gray-400 text-sm mb-1">反义词</h4>
          <div className="flex flex-wrap gap-2">
            {definition.antonyms.map((word, index) => (
              <span key={index} className="bg-gray-700 text-sm px-2 py-1 rounded text-gray-300">
                {word}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 