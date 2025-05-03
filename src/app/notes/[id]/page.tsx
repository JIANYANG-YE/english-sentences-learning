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

// 模拟笔记数据 - 实际应用中这应该从 API 获取
const mockNotes: Note[] = [
  {
    id: '1',
    title: '动词的时态总结',
    content: '英语中共有16种时态，最常用的是一般现在时、现在进行时、一般过去时、现在完成时...\n\n一般现在时：表示经常性、习惯性的动作或状态，以及客观事实。例如：I go to school every day.\n\n现在进行时：表示说话时正在进行的动作，或计划好要发生的动作。例如：I am studying English now.\n\n一般过去时：表示过去某个时间发生的动作或存在的状态。例如：I went to Beijing last year.\n\n现在完成时：表示过去发生的对现在仍有影响的动作，或从过去持续到现在的状态。例如：I have lived here for ten years.',
    createdAt: '2024-04-15T09:30:00Z',
    updatedAt: '2024-04-15T10:15:00Z',
    tags: ['语法', '时态']
  },
  {
    id: '2',
    title: '常用介词搭配',
    content: '英语中介词的正确使用往往是学习者的难点。以下是一些常见的介词搭配：\n\nat the beginning of：在...的开始\nin the middle of：在...的中间\nby the end of：到...结束时\non behalf of：代表...\n\n时间介词：\nat：用于具体时刻 (at 6 o\'clock, at noon)\nin：用于月份、年份、季节 (in May, in 2024, in summer)\non：用于具体日期和星期几 (on Monday, on July 1st)\n\n地点介词：\nat：表示特定位置或小地点 (at home, at the bus stop)\nin：表示在一个封闭空间内 (in the room, in China)\non：表示在一个平面上 (on the table, on the wall)',
    createdAt: '2024-04-10T14:20:00Z',
    updatedAt: '2024-04-12T16:45:00Z',
    tags: ['语法', '介词']
  },
  {
    id: '3',
    title: '新概念英语第一册生词表',
    content: '新概念英语第一册 Lesson 1-10 重要单词列表：\n\nLesson 1：excuse, me, thank, you, yes, no, goodbye\nLesson 2：pen, pencil, book, watch, coat, dress, skirt\nLesson 3：sorry, handbag, pardon, umbrella, ticket, passport\nLesson 4：suit, shirt, shoe, hat, school, classroom, house\nLesson 5：tea, coffee, milk, sugar, orange, water, soap\nLesson 6：this, that, these, those, chair, son, daughter\nLesson 7：teacher, engineer, policeman, actor, cook, waiter, student\nLesson 8：my, your, his, her, our, their, name\nLesson 9：car, table, train, boat, plane, bus, taxi\nLesson 10：newspaper, magazine, letter, postcard, window, door, key',
    createdAt: '2024-04-05T11:10:00Z',
    updatedAt: '2024-04-05T11:10:00Z',
    tags: ['单词', '新概念']
  },
];

export default function NoteDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const noteId = params.id;
  
  const [note, setNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // 加载笔记数据
  useEffect(() => {
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
  }, [noteId, router]);

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!note) {
    return (
      <div className="text-center py-10">
        <div className="text-xl text-gray-600">笔记不存在或已被删除</div>
        <Link href="/notes" className="text-blue-600 hover:underline mt-4 inline-block">
          返回笔记列表
        </Link>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {note.title}
          </h1>
          <div className="flex space-x-2 mt-2">
            {note.tags.map(tag => (
              <span 
                key={tag} 
                className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="flex space-x-2">
          <Link
            href={`/notes/${note.id}/edit`}
            className="px-3 py-1 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            编辑
          </Link>
          <Link
            href="/notes"
            className="px-3 py-1 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            返回列表
          </Link>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-sm text-gray-500 mb-4">
          <p>创建时间：{formatDate(note.createdAt)}</p>
          <p>更新时间：{formatDate(note.updatedAt)}</p>
        </div>
        
        <div className="prose max-w-none">
          {note.content.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-4">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
      
      <div className="mt-8 border-t border-gray-200 pt-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">相关笔记</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {mockNotes
            .filter(n => n.id !== note.id && n.tags.some(tag => note.tags.includes(tag)))
            .slice(0, 2)
            .map(relatedNote => (
              <Link 
                key={relatedNote.id} 
                href={`/notes/${relatedNote.id}`}
                className="block p-4 border border-gray-200 rounded-md hover:border-blue-300 hover:shadow-sm transition-all"
              >
                <h3 className="font-medium text-gray-900 mb-1">{relatedNote.title}</h3>
                <div className="flex space-x-1">
                  {relatedNote.tags.map(tag => (
                    <span key={tag} className="text-xs text-gray-500">#{tag}</span>
                  ))}
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
} 