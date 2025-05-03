'use client';

import { useState } from 'react';
import { Book, Lesson } from '@/types';

interface BooksNavProps {
  books: Book[];
  onSelectLesson: (bookId: string, lessonId: string) => void;
}

export default function BooksNav({ books, onSelectLesson }: BooksNavProps) {
  const [expandedBookId, setExpandedBookId] = useState<string | null>(books[0]?.id || null);
  
  const toggleBookExpand = (bookId: string) => {
    setExpandedBookId(expandedBookId === bookId ? null : bookId);
  };
  
  const handleLessonSelect = (bookId: string, lessonId: string) => {
    onSelectLesson(bookId, lessonId);
  };
  
  // 书籍难度对应的颜色
  const levelColors = {
    beginner: 'bg-green-100 text-green-800',
    elementary: 'bg-blue-100 text-blue-800',
    intermediate: 'bg-yellow-100 text-yellow-800',
    advanced: 'bg-red-100 text-red-800'
  };
  
  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <h2 className="bg-blue-600 text-white p-4 font-bold text-lg">教材列表</h2>
      <div className="max-h-[calc(100vh-250px)] overflow-y-auto">
        {books.map(book => (
          <div key={book.id} className="border-b last:border-b-0">
            <button
              onClick={() => toggleBookExpand(book.id)}
              className="w-full text-left px-4 py-3 transition-colors hover:bg-blue-50 flex justify-between items-center"
            >
              <div>
                <div className="font-medium">{book.name}</div>
                <div className="text-sm text-gray-500 mt-1">{book.description}</div>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded ${levelColors[book.level]}`}>
                {book.level}
              </span>
              <svg
                className={`h-5 w-5 text-gray-500 transform transition-transform ${
                  expandedBookId === book.id ? 'rotate-180' : ''
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            
            {expandedBookId === book.id && (
              <div className="pl-6 pr-4 pb-3 bg-gray-50">
                <ul className="space-y-1">
                  {book.lessons.map(lesson => (
                    <li key={lesson.id}>
                      <button
                        onClick={() => handleLessonSelect(book.id, lesson.id)}
                        className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-blue-100 transition-colors"
                      >
                        <span className="font-medium">第{lesson.number}课：</span>
                        {lesson.title}
                        {lesson.description && (
                          <span className="block text-xs text-gray-500 mt-0.5">{lesson.description}</span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 