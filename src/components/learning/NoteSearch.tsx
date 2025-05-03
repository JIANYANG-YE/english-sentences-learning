import React, { useState, useEffect } from 'react';
import { Note, noteTypes } from '@/types/notes';

interface NoteSearchProps {
  notes: Note[];
  onSearchResults: (results: Note[]) => void;
  onFilterChange: (type: string | undefined, paragraphIndex: number | undefined) => void;
}

export default function NoteSearch({ notes, onSearchResults, onFilterChange }: NoteSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string | undefined>(undefined);
  const [selectedParagraph, setSelectedParagraph] = useState<number | undefined>(undefined);
  
  // 段落选项
  const paragraphOptions = React.useMemo(() => {
    const paragraphs = new Set<number>();
    notes.forEach(note => paragraphs.add(note.paragraphIndex));
    return Array.from(paragraphs).sort((a, b) => a - b);
  }, [notes]);
  
  // 搜索和过滤
  useEffect(() => {
    // 搜索
    let results = notes;
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter(note => 
        note.highlight.toLowerCase().includes(query) || 
        note.note.toLowerCase().includes(query)
      );
    }
    
    // 过滤类型
    if (selectedType) {
      results = results.filter(note => note.type === selectedType);
    }
    
    // 过滤段落
    if (selectedParagraph !== undefined) {
      results = results.filter(note => note.paragraphIndex === selectedParagraph);
    }
    
    onSearchResults(results);
  }, [searchQuery, selectedType, selectedParagraph, notes, onSearchResults]);
  
  // 处理类型变化
  const handleTypeChange = (type: string | undefined) => {
    setSelectedType(type);
    onFilterChange(type, selectedParagraph);
  };
  
  // 处理段落变化
  const handleParagraphChange = (paragraphIndex: number | undefined) => {
    setSelectedParagraph(paragraphIndex);
    onFilterChange(selectedType, paragraphIndex);
  };
  
  return (
    <div className="space-y-4">
      {/* 搜索框 */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="search"
          className="bg-gray-700 text-white pl-10 py-2 pr-4 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="搜索笔记..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {/* 过滤器 */}
      <div className="flex flex-col space-y-3">
        {/* 类型过滤 */}
        <div>
          <h3 className="text-sm font-medium text-gray-400 mb-2">笔记类型:</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleTypeChange(undefined)}
              className={`px-3 py-1.5 rounded-md text-sm ${
                selectedType === undefined
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              全部
            </button>
            
            {noteTypes.map(type => (
              <button
                key={type.id}
                onClick={() => handleTypeChange(type.id)}
                className={`px-3 py-1.5 rounded-md text-sm flex items-center gap-1 ${
                  selectedType === type.id
                    ? `${type.color.split(' ')[0]} text-white`
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <span>{type.emoji}</span>
                <span>{type.name}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* 段落过滤 */}
        {paragraphOptions.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-2">段落:</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleParagraphChange(undefined)}
                className={`px-3 py-1.5 rounded-md text-sm ${
                  selectedParagraph === undefined
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                全部
              </button>
              
              {paragraphOptions.map(paragraphIndex => (
                <button
                  key={paragraphIndex}
                  onClick={() => handleParagraphChange(paragraphIndex)}
                  className={`px-3 py-1.5 rounded-md text-sm ${
                    selectedParagraph === paragraphIndex
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  段落 {paragraphIndex + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 