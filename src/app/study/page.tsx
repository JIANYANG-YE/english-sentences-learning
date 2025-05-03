'use client';

import { useState, useEffect } from 'react';
import SentenceCard from '@/components/SentenceCard';
import CategoryNav from '@/components/CategoryNav';
import SentenceFilters from '@/components/SentenceFilters';
import { sentences, categories } from '@/data/sampleData';
import { Sentence } from '@/types';

export default function StudyPage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>('all');
  const [filteredSentences, setFilteredSentences] = useState<Sentence[]>(sentences);
  const [filters, setFilters] = useState({
    difficulty: ['beginner', 'intermediate', 'advanced'],
    search: ''
  });
  
  useEffect(() => {
    let result = [...sentences];
    
    // 按分类筛选
    if (selectedCategoryId && selectedCategoryId !== 'all') {
      const selectedCategory = categories.find(cat => cat.id === selectedCategoryId);
      if (selectedCategory) {
        result = sentences.filter(sentence => 
          selectedCategory.sentenceIds.includes(sentence.id)
        );
      }
    }
    
    // 按难度筛选
    if (filters.difficulty.length > 0) {
      result = result.filter(sentence => 
        filters.difficulty.includes(sentence.difficulty)
      );
    }
    
    // 按搜索关键词筛选
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(sentence => 
        sentence.english.toLowerCase().includes(searchLower) ||
        sentence.chinese.toLowerCase().includes(searchLower) ||
        sentence.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }
    
    setFilteredSentences(result);
  }, [selectedCategoryId, filters]);
  
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
  };
  
  const handleFilterChange = (newFilters: { difficulty: string[]; search: string }) => {
    setFilters(newFilters);
  };
  
  const handleMastered = (id: string, mastered: boolean) => {
    console.log(`句子 ${id} 被标记为 ${mastered ? '已掌握' : '未掌握'}`);
    // 在实际应用中，这里会保存用户进度
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">按句子学习英语</h1>
        <p className="text-lg text-gray-600">
          选择适合你水平的句子进行学习，掌握地道的英语表达
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <div className="sticky top-6">
            <CategoryNav 
              categories={categories} 
              selectedCategoryId={selectedCategoryId}
              onSelectCategory={handleCategorySelect}
            />
            
            <div className="mt-8">
              <SentenceFilters onFilterChange={handleFilterChange} />
            </div>
          </div>
        </div>
        
        <div className="md:col-span-3">
          {filteredSentences.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {filteredSentences.map(sentence => (
                <SentenceCard 
                  key={sentence.id} 
                  sentence={sentence} 
                  onMastered={handleMastered}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg p-10 text-center border border-gray-200">
              <svg className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 13a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">没有找到匹配的句子</h3>
              <p className="text-gray-500">
                尝试调整筛选条件或选择不同的分类
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 