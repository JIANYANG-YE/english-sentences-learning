"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PlusIcon, MagnifyingGlassIcon, XMarkIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

// 模拟笔记数据
const mockNotes = [
  {
    id: '1',
    title: '英语学习计划',
    content: '每天学习10个新单词，阅读一篇英语文章，听15分钟英语播客...',
    tags: ['学习计划', '每日任务'],
    createdAt: '2023-05-10T10:00:00Z',
    updatedAt: '2023-05-12T14:30:00Z'
  },
  {
    id: '2',
    title: '新概念英语第二册重点',
    content: '第15课的语法重点包括现在完成时的用法，表示已经完成的动作...',
    tags: ['新概念英语', '语法'],
    createdAt: '2023-05-15T09:20:00Z',
    updatedAt: '2023-05-15T09:20:00Z'
  },
  {
    id: '3',
    title: '常用英语口语表达',
    content: '日常对话中的实用表达：1. Nice to meet you. 2. How\'s it going? 3. I couldn\'t agree more...',
    tags: ['口语', '日常用语'],
    createdAt: '2023-06-01T16:45:00Z',
    updatedAt: '2023-06-02T10:15:00Z'
  },
  {
    id: '4',
    title: 'IELTS备考笔记',
    content: '写作部分需要注意论点明确，论据充分，结构清晰。词汇方面避免重复使用相同的词...',
    tags: ['IELTS', '考试'],
    createdAt: '2023-06-10T14:30:00Z',
    updatedAt: '2023-06-10T14:30:00Z'
  }
];

// 获取所有标签
const getAllTags = (notes: typeof mockNotes) => {
  const tagsSet = new Set<string>();
  notes.forEach(note => {
    note.tags.forEach(tag => tagsSet.add(tag));
  });
  return Array.from(tagsSet);
};

export default function NotesPage() {
  const router = useRouter();
  const [notes, setNotes] = useState<typeof mockNotes>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // 加载笔记数据
  useEffect(() => {
    // 模拟API请求
    const loadNotes = () => {
      setIsLoading(true);
      setTimeout(() => {
        setNotes(mockNotes);
        setAvailableTags(getAllTags(mockNotes));
        setIsLoading(false);
      }, 800);
    };

    loadNotes();
  }, []);

  // 处理搜索和标签筛选
  const filteredNotes = notes.filter(note => {
    const matchesSearch = 
      searchQuery === '' || 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      note.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTags = 
      selectedTags.length === 0 || 
      selectedTags.every(tag => note.tags.includes(tag));
    
    return matchesSearch && matchesTags;
  });

  // 删除笔记
  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
    setShowDeleteConfirm(null);
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // 为显示准备笔记内容摘要
  const getSummary = (content: string, maxLength = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">我的笔记</h1>
        <Link 
          href="/notes/new/edit" 
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          新建笔记
        </Link>
      </div>

      {/* 搜索和筛选 */}
      <div className="mb-6">
        <div className="flex mb-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="搜索笔记..."
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5"
              >
                <XMarkIcon className="w-5 h-5 text-gray-400" />
              </button>
            )}
          </div>
        </div>

        {/* 标签筛选 */}
        <div className="flex flex-wrap gap-2">
          {availableTags.map(tag => (
            <button
              key={tag}
              onClick={() => {
                if (selectedTags.includes(tag)) {
                  setSelectedTags(selectedTags.filter(t => t !== tag));
                } else {
                  setSelectedTags([...selectedTags, tag]);
                }
              }}
              className={`px-3 py-1 text-sm rounded-full ${
                selectedTags.includes(tag)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* 笔记列表 */}
      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">没有找到符合条件的笔记</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map(note => (
            <div key={note.id} className="bg-white p-5 rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-gray-800">
                  <Link 
                    href={`/notes/${note.id}`}
                    className="hover:text-blue-600"
                  >
                    {note.title}
                  </Link>
                </h3>
                <div className="flex space-x-2">
                  <Link 
                    href={`/notes/${note.id}/edit`}
                    className="text-gray-500 hover:text-blue-600"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </Link>
                  <button
                    onClick={() => setShowDeleteConfirm(note.id)}
                    className="text-gray-500 hover:text-red-600"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <p className="text-gray-600 mb-4 line-clamp-3">
                {getSummary(note.content)}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-3">
                {note.tags.map(tag => (
                  <span 
                    key={tag} 
                    className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="text-xs text-gray-500">
                最后更新: {formatDate(note.updatedAt)}
              </div>
              
              {/* 删除确认对话框 */}
              {showDeleteConfirm === note.id && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white p-6 rounded-lg max-w-sm w-full">
                    <h3 className="text-lg font-semibold mb-4">确认删除</h3>
                    <p className="mb-6">确定要删除笔记 &ldquo;{note.title}&rdquo; 吗？此操作不可撤销。</p>
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => setShowDeleteConfirm(null)}
                        className="px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-100"
                      >
                        取消
                      </button>
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        删除
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 