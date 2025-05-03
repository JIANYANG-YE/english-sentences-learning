'use client';

import { useState, useEffect } from 'react';
import BooksNav from '@/components/BooksNav';
import SentenceCard from '@/components/SentenceCard';
import { books, getSentencesByLesson } from '@/data';
import { Sentence } from '@/types';

export default function BooksPage() {
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [lessonSentences, setLessonSentences] = useState<Sentence[]>([]);
  
  // 处理选择课程
  const handleSelectLesson = (bookId: string, lessonId: string) => {
    setSelectedBookId(bookId);
    setSelectedLessonId(lessonId);
    
    // 找到对应的课程
    const selectedBook = books.find(b => b.id === bookId);
    const selectedLesson = selectedBook?.lessons.find(l => l.id === lessonId);
    
    if (selectedBook && selectedLesson) {
      // 根据课程编号获取句子
      const sentences = getSentencesByLesson(bookId, selectedLesson.number);
      setLessonSentences(sentences);
    }
  };
  
  // 初始化时选择第一本书的第一课
  useEffect(() => {
    if (books.length > 0 && books[0].lessons.length > 0) {
      const firstBook = books[0];
      const firstLesson = firstBook.lessons[0];
      handleSelectLesson(firstBook.id, firstLesson.id);
    }
  }, []);
  
  // 处理掌握状态变化
  const handleMastered = (id: string, mastered: boolean) => {
    console.log(`句子 ${id} 被标记为 ${mastered ? '已掌握' : '未掌握'}`);
    // 在实际应用中，这里会保存用户进度
  };
  
  // 获取当前选中的课程信息
  const selectedBook = books.find(b => b.id === selectedBookId);
  const selectedLesson = selectedBook?.lessons.find(l => l.id === selectedLessonId);
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">英语教材学习</h1>
        <p className="text-lg text-gray-600">
          通过新概念英语教材系统地学习英语，从初级到高级逐步提升
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <div className="sticky top-6">
            <BooksNav 
              books={books} 
              onSelectLesson={handleSelectLesson}
            />
          </div>
        </div>
        
        <div className="md:col-span-3">
          {selectedBook && selectedLesson && (
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedBook.name}</h2>
                  <h3 className="text-xl font-semibold text-gray-700 mt-1">
                    第{selectedLesson.number}课：{selectedLesson.title}
                  </h3>
                  {selectedLesson.description && (
                    <p className="text-gray-600 mt-2">{selectedLesson.description}</p>
                  )}
                </div>
                <span className={`text-sm px-2.5 py-1 rounded ${
                  selectedBook.level === 'beginner' ? 'bg-green-100 text-green-800' :
                  selectedBook.level === 'elementary' ? 'bg-blue-100 text-blue-800' :
                  selectedBook.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {selectedBook.level}
                </span>
              </div>
            </div>
          )}
          
          {lessonSentences.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {lessonSentences.map(sentence => (
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">没有找到句子</h3>
              <p className="text-gray-500">
                请选择一个课程开始学习
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 