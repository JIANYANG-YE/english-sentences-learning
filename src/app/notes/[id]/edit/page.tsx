'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// 定义笔记类型
interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

// 模拟标签数据
const allTags = ['语法', '单词', '时态', '介词', '新概念', '句型'];

// 模拟笔记数据 - 实际应用中这应该从 API 获取
const mockNotes: Note[] = [
  {
    id: '1',
    title: '动词的时态总结',
    content: '英语中共有16种时态，最常用的是一般现在时、现在进行时、一般过去时、现在完成时...',
    createdAt: '2024-04-15T09:30:00Z',
    updatedAt: '2024-04-15T10:15:00Z',
    tags: ['语法', '时态']
  },
  {
    id: '2',
    title: '常用介词搭配',
    content: 'at the beginning of, in the middle of, by the end of, on behalf of...',
    createdAt: '2024-04-10T14:20:00Z',
    updatedAt: '2024-04-12T16:45:00Z',
    tags: ['语法', '介词']
  },
  {
    id: '3',
    title: '新概念英语第一册生词表',
    content: 'lesson 1-10: apple, banana, cat, dog, elephant, fish, goat...',
    createdAt: '2024-04-05T11:10:00Z',
    updatedAt: '2024-04-05T11:10:00Z',
    tags: ['单词', '新概念']
  },
];

export default function NoteEditPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const noteId = params.id;
  
  const [note, setNote] = useState<Note>({
    id: '',
    title: '',
    content: '',
    createdAt: '',
    updatedAt: '',
    tags: []
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  
  // 加载笔记数据
  useEffect(() => {
    if (noteId && noteId !== 'new') {
      // 模拟 API 请求
      setTimeout(() => {
        const foundNote = mockNotes.find(n => n.id === noteId);
        if (foundNote) {
          setNote(foundNote);
        } else {
          // 笔记不存在，重定向到笔记列表
          router.push('/notes');
        }
        setIsLoading(false);
      }, 500);
    } else {
      // 创建新笔记
      setNote({
        id: '',
        title: '',
        content: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: []
      });
      setIsLoading(false);
    }
  }, [noteId, router]);
  
  // 处理表单提交
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 验证表单
    if (!note.title.trim()) {
      alert('请输入笔记标题');
      return;
    }
    
    setSaveStatus('saving');
    
    // 模拟 API 保存请求
    setTimeout(() => {
      // 在实际应用中，这里应该发送 API 请求保存数据
      setSaveStatus('success');
      
      // 保存成功后返回笔记列表页
      setTimeout(() => {
        router.push('/notes');
      }, 1000);
    }, 1000);
  };
  
  // 处理标签切换
  const handleTagToggle = (tag: string) => {
    if (note.tags.includes(tag)) {
      setNote({...note, tags: note.tags.filter(t => t !== tag)});
    } else {
      setNote({...note, tags: [...note.tags, tag]});
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {noteId && noteId !== 'new' ? '编辑笔记' : '创建新笔记'}
        </h1>
        <Link
          href="/notes"
          className="text-gray-600 hover:text-gray-900"
        >
          返回笔记列表
        </Link>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            标题 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            value={note.title}
            onChange={(e) => setNote({...note, title: e.target.value})}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="输入笔记标题..."
            required
          />
        </div>
        
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            内容
          </label>
          <textarea
            id="content"
            value={note.content}
            onChange={(e) => setNote({...note, content: e.target.value})}
            className="w-full border border-gray-300 rounded-md p-2 h-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="输入笔记内容..."
          />
        </div>
        
        <div>
          <p className="block text-sm font-medium text-gray-700 mb-3">
            标签
          </p>
          <div className="flex flex-wrap gap-3">
            {allTags.map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => handleTagToggle(tag)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  note.tags.includes(tag) 
                    ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
          <Link
            href="/notes"
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            取消
          </Link>
          <button
            type="submit"
            disabled={saveStatus === 'saving'}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              saveStatus === 'saving' 
                ? 'bg-gray-400 text-white cursor-not-allowed' 
                : saveStatus === 'success'
                  ? 'bg-green-600 text-white'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {saveStatus === 'saving' 
              ? '保存中...' 
              : saveStatus === 'success' 
                ? '已保存 ✓' 
                : '保存笔记'}
          </button>
        </div>
      </form>
    </div>
  );
} 