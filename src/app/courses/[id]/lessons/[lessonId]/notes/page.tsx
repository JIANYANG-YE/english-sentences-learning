'use client';

import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ModeNavigation from '@/components/learning/ModeNavigation';
import NoteSearch from '@/components/learning/NoteSearch';
import NoteStatsCard from '@/components/learning/NoteStatsCard';
import NoteExportDialog from '@/components/learning/NoteExportDialog';
import { Note, NoteStats, NoteType, noteTypes } from '@/types/notes';
import { notesService } from '@/services/notesService';
import { formatDate } from '@/lib/utils';

// 定义课程数据类型
type LessonDataType = {
  id: string;
  courseId: string;
  title: string;
  subtitle: string;
  order: number;
  duration: number;
  progress: number;
  lastStudied: null;
  content: {
    english: string;
    chinese: string;
  };
  notes?: Note[];
}

// 修改lessonData声明，使用Record<string, LessonData>类型
// 模拟课文数据
const lessonData: Record<string, LessonDataType> = {
  '1': {
    id: '1',
    courseId: '1',
    title: 'Fall in Love with English',
    subtitle: '爱上英语',
    order: 1,
    duration: 5,
    progress: 0,
    lastStudied: null,
    content: {
      english: `I hated English in middle school. I couldn't understand why I needed to learn a foreign language. It seemed so useless. My English teacher was very strict, and English class was boring. I always got poor grades in English tests.

Things changed when I went to high school. My new English teacher was amazing. She didn't just teach from textbooks; she taught us about English songs, movies, and culture. She told us interesting stories about her travel experiences in different countries.

I remember when she played an English song in class for the first time. It was "My Heart Will Go On" by Celine Dion, from the movie Titanic. I was surprised that I could understand some of the lyrics. The song was so beautiful, and I wanted to understand all of it.

After that, I started watching English movies with subtitles. I tried to read simple English books. Gradually, English was no longer a difficult subject for me. It became a tool that opened a door to a new world.

Now, I love English. It helps me make friends from different countries. I can enjoy original English songs, movies, and books. Most importantly, it gave me confidence. If I can learn English well, I can learn anything.

Learning a language is not just about memorizing grammar rules and vocabulary. It's about connecting with another culture and seeing the world from a different perspective. I'm so glad I fell in love with English.`,
      chinese: `我在中学时讨厌英语。我不理解为什么我需要学习一门外语。它似乎毫无用处。我的英语老师非常严格，英语课很无聊。我在英语考试中总是得低分。

当我上高中时，情况发生了变化。我的新英语老师很棒。她不只是照本宣科；她教我们英文歌曲、电影和文化。她给我们讲述了她在不同国家的旅行经历的有趣故事。

我记得她第一次在课堂上播放英文歌曲。那是席琳·迪翁演唱的《我心永恒》，电影《泰坦尼克号》的主题曲。我很惊讶我能理解一些歌词。这首歌太美了，我想完全理解它。

之后，我开始看带字幕的英文电影。我尝试阅读简单的英文书籍。渐渐地，英语不再是一门难学的科目。它成为了一个打开新世界的工具。

现在，我爱上了英语。它帮助我结交来自不同国家的朋友。我可以欣赏原版英文歌曲、电影和书籍。最重要的是，它给了我信心。如果我能学好英语，我就能学好任何东西。

学习一门语言不仅仅是记忆语法规则和词汇。这是关于与另一种文化联系，从不同角度看世界。我很高兴我爱上了英语。`
    },
    // 预设一些笔记
    notes: [
      {
        id: '1',
        lessonId: '1',
        timestamp: new Date('2024-03-15').toISOString(),
        highlight: "My new English teacher was amazing. She didn't just teach from textbooks; she taught us about English songs, movies, and culture.",
        note: "好老师的特质：不仅教授教科书知识，还融入文化元素",
        type: 'important',
        paragraphIndex: 1
      },
      {
        id: '2',
        lessonId: '1',
        timestamp: new Date('2024-03-16').toISOString(),
        highlight: "Gradually, English was no longer a difficult subject for me. It became a tool that opened a door to a new world.",
        note: "语言学习的转折点：从'学科'到'工具'的转变",
        type: 'insight',
        paragraphIndex: 3
      },
      {
        id: '3',
        lessonId: '1',
        timestamp: new Date('2024-03-17').toISOString(),
        highlight: "Learning a language is not just about memorizing grammar rules and vocabulary.",
        note: "语言学习的本质不是死记硬背",
        type: 'important',
        paragraphIndex: 5
      }
    ]
  }
  // 更多课文数据...
};

// 拆分文本为段落
function splitIntoParagraphs(text: string) {
  return text.split(/\n\n/).map(p => p.trim()).filter(p => p.length > 0);
}

// 根据笔记类型获取样式
function getNoteTypeStyle(type: string): string {
  const noteType = noteTypes.find(nt => nt.id === type);
  return noteType ? noteType.color : 'bg-gray-500/30 border-gray-500';
}

export default function NotesModePage() {
  const params = useParams();
  const router = useRouter();
  const { id: courseId, lessonId } = params;
  const [lesson, setLesson] = useState<LessonDataType | null>(null);
  const [loading, setLoading] = useState(true);
  const [paragraphs, setParagraphs] = useState<string[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [selectedText, setSelectedText] = useState('');
  const [highlightType, setHighlightType] = useState<NoteType>('important');
  const [noteText, setNoteText] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [currentParagraphIndex, setCurrentParagraphIndex] = useState<number | undefined>(undefined);
  const [activeNoteId, setActiveNoteId] = useState<string | undefined>(undefined);
  const [filterType, setFilterType] = useState<string | undefined>(undefined);
  const [filterParagraph, setFilterParagraph] = useState<number | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  const [noteStats, setNoteStats] = useState<NoteStats>({
    total: 0,
    byType: [],
    byParagraph: []
  });
  const [showStats, setShowStats] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const addNoteFormRef = useRef<HTMLDivElement>(null);
  
  // 加载课程数据和笔记
  useEffect(() => {
    // 在实际应用中，这里会从API获取课文数据
    const data = lessonData[lessonId as string];
    if (data && data.courseId === courseId) {
      setLesson(data);
      
      // 拆分段落
      if (data.content) {
        const allParagraphs = splitIntoParagraphs(data.content.english);
        setParagraphs(allParagraphs);
      }
      
      // 获取笔记
      if (data.notes) {
        setNotes(data.notes);
        setFilteredNotes(data.notes);
        
        // 生成笔记统计
        generateNoteStats(data.notes);
      }
    } else {
      // 未找到课文或课程不匹配时重定向
      router.push(`/courses/${courseId}`);
    }
    setLoading(false);
  }, [courseId, lessonId, router]);
  
  // 生成笔记统计
  const generateNoteStats = (notesList: Note[]) => {
    // 按类型统计
    const countByType: Record<string, number> = {};
    // 按段落统计
    const countByParagraph: Record<number, number> = {};
    
    notesList.forEach(note => {
      // 统计类型
      if (!countByType[note.type]) {
        countByType[note.type] = 0;
      }
      countByType[note.type]++;
      
      // 统计段落
      if (!countByParagraph[note.paragraphIndex]) {
        countByParagraph[note.paragraphIndex] = 0;
      }
      countByParagraph[note.paragraphIndex]++;
    });
    
    // 按类型统计，并添加中文名称
    const typeStats = Object.entries(countByType).map(([type, count]) => {
      const noteType = noteTypes.find(nt => nt.id === type);
      return {
        type,
        name: noteType?.name || '其他',
        emoji: noteType?.emoji || '📝',
        count
      };
    });
    
    // 按段落统计
    const paragraphStats = Object.entries(countByParagraph).map(([paragraphIndex, count]) => ({
      paragraphIndex: parseInt(paragraphIndex),
      count
    }));
    
    setNoteStats({
      total: notesList.length,
      byType: typeStats,
      byParagraph: paragraphStats
    });
  };
  
  // 处理文本选择
  const handleTextSelection = (paragraphIndex: number) => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 0) {
      setSelectedText(selection.toString().trim());
      setCurrentParagraphIndex(paragraphIndex);
      setIsAddingNote(true);
    }
  };
  
  // 添加笔记
  const addNote = () => {
    if (selectedText && noteText && currentParagraphIndex !== undefined) {
      const newNote: Note = {
        id: Date.now().toString(),
        lessonId: lessonId as string,
        timestamp: new Date().toISOString(),
        highlight: selectedText,
        note: noteText,
        type: highlightType,
        paragraphIndex: currentParagraphIndex
      };
      
      const updatedNotes = [...notes, newNote];
      setNotes(updatedNotes);
      setFilteredNotes(notesService.filterNotes(
        updatedNotes, 
        filterType, 
        filterParagraph
      ));
      
      // 更新统计
      generateNoteStats(updatedNotes);
      
      // 保存到本地存储作为备份
      notesService.saveToLocalStorage(lessonId as string, updatedNotes);
      
      // 重置表单
      resetNoteForm();
      
      // 在实际应用中，这里会调用API保存笔记
      // 示例：notesService.saveNotes(lessonId as string, updatedNotes);
    }
  };
  
  // 重置笔记表单
  const resetNoteForm = () => {
    setSelectedText('');
    setNoteText('');
    setIsAddingNote(false);
    setCurrentParagraphIndex(undefined);
  };
  
  // 删除笔记
  const deleteNote = (noteId: string) => {
    const updatedNotes = notes.filter(note => note.id !== noteId);
    setNotes(updatedNotes);
    setFilteredNotes(notesService.filterNotes(
      updatedNotes, 
      filterType, 
      filterParagraph
    ));
    
    // 更新统计
    generateNoteStats(updatedNotes);
    
    // 保存到本地存储作为备份
    notesService.saveToLocalStorage(lessonId as string, updatedNotes);
    
    if (activeNoteId === noteId) {
      setActiveNoteId(undefined);
    }
    
    // 在实际应用中，这里会调用API删除笔记
    // 示例：notesService.saveNotes(lessonId as string, updatedNotes);
  };
  
  // 编辑笔记
  const editNote = (noteId: string, newNoteText: string) => {
    const updatedNotes = notes.map(note => 
      note.id === noteId 
        ? { ...note, note: newNoteText, timestamp: new Date().toISOString() }
        : note
    );
    
    setNotes(updatedNotes);
    setFilteredNotes(notesService.filterNotes(
      updatedNotes, 
      filterType, 
      filterParagraph
    ));
    
    // 保存到本地存储作为备份
    notesService.saveToLocalStorage(lessonId as string, updatedNotes);
    
    // 在实际应用中，这里会调用API保存笔记
    // 示例：notesService.saveNotes(lessonId as string, updatedNotes);
  };
  
  // 切换笔记详情
  const toggleNoteDetails = (noteId: string) => {
    setActiveNoteId(activeNoteId === noteId ? undefined : noteId);
  };
  
  // 处理搜索结果
  const handleSearchResults = (results: Note[]) => {
    setFilteredNotes(results);
  };
  
  // 处理过滤器变更
  const handleTypeChange = (type: string | undefined, paragraphIndex: number | undefined) => {
    setFilterType(type);
    setFilterParagraph(paragraphIndex);
    
    const filtered = notesService.filterNotes(
      notes, 
      type, 
      paragraphIndex
    );
    setFilteredNotes(filtered);
  };
  
  // 渲染加载中状态
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-4 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white"></div>
      </div>
    );
  }
  
  // 未找到课程
  if (!lesson) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-4 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">课程未找到</h1>
        <Link 
          href="/courses"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
        >
          返回课程列表
        </Link>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-900 text-white pb-24">
      {/* 顶部标题栏 */}
      <div className="bg-gray-800 py-4 px-4 border-b border-gray-700 sticky top-0 z-10">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold">{lesson.title}</h1>
              <p className="text-gray-400 text-sm">{lesson.subtitle}</p>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowStats(!showStats)}
                className="flex items-center px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-md text-sm transition-colors"
              >
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                统计
              </button>
              
              <button
                onClick={() => setShowExport(true)}
                className="flex items-center px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-md text-sm transition-colors"
              >
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                导出
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧笔记栏 */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg overflow-hidden shadow-md">
              <div className="p-4 border-b border-gray-700">
                <h2 className="text-lg font-medium">笔记</h2>
                <p className="text-sm text-gray-400">
                  选择文本来添加笔记，或在这里搜索和浏览已有笔记
                </p>
              </div>
              
              {/* 搜索和过滤 */}
              <div className="p-4 border-b border-gray-700">
                <NoteSearch 
                  notes={notes}
                  onSearchResults={handleSearchResults}
                  onFilterChange={handleTypeChange}
                />
              </div>
              
              {/* 笔记列表 */}
              <div className="p-4 max-h-[calc(100vh-400px)] overflow-y-auto">
                {filteredNotes.length > 0 ? (
                  <div className="space-y-4">
                    {filteredNotes
                      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                      .map(note => (
                        <div 
                          key={note.id}
                          className={`bg-gray-750 rounded-lg p-3 ${
                            getNoteTypeStyle(note.type).split(' ')[0].replace('bg', 'border')
                          } border-l-4`}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <div className="flex items-center space-x-1 text-xs">
                              <span className="text-lg">
                                {noteTypes.find(nt => nt.id === note.type)?.emoji || '📝'}
                              </span>
                              <span className="bg-gray-700 px-2 py-0.5 rounded-md">
                                段落 {note.paragraphIndex + 1}
                              </span>
                            </div>
                            
                            <div className="flex gap-2">
                              <button 
                                onClick={() => toggleNoteDetails(note.id)}
                                className="text-gray-400 hover:text-white"
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              </button>
                              <button 
                                onClick={() => deleteNote(note.id)}
                                className="text-gray-400 hover:text-red-500"
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </div>
                          
                          <div className="text-sm text-gray-300 mb-2 italic border-l-2 border-gray-600 pl-2">
                            "{note.highlight}"
                          </div>
                          
                          {activeNoteId === note.id ? (
                            <div className="mt-2">
                              <textarea 
                                value={note.note}
                                onChange={(e) => editNote(note.id, e.target.value)}
                                className="w-full bg-gray-800 text-white rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows={3}
                              />
                            </div>
                          ) : (
                            <div className="text-white">{note.note}</div>
                          )}
                          
                          <div className="mt-2 text-xs text-gray-500">
                            {formatDate(note.timestamp)}
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <svg className="w-12 h-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p>暂无笔记</p>
                    <p className="mt-1 text-sm">选择文本并添加笔记</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* 统计面板 */}
            {showStats && (
              <div className="mt-4">
                <NoteStatsCard stats={noteStats} />
              </div>
            )}
          </div>
          
          {/* 右侧课文内容 */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg overflow-hidden shadow-md">
              <div className="p-4 border-b border-gray-700">
                <h2 className="text-lg font-medium">课文内容</h2>
                <p className="text-sm text-gray-400">选择文本添加笔记，点击高亮文字查看笔记详情</p>
              </div>
              
              <div className="p-6 space-y-6">
                {paragraphs.map((paragraph, index) => (
                  <div 
                    key={index}
                    className={`mb-4 leading-relaxed relative ${currentParagraphIndex === index ? 'bg-gray-700/50 rounded p-2' : ''}`}
                    onMouseUp={() => handleTextSelection(index)}
                  >
                    {/* 段落中的高亮 */}
                    {notes.filter(note => note.paragraphIndex === index).length > 0 ? 
                      notes.filter(note => note.paragraphIndex === index).map(note => {
                        // 检查段落中是否包含要高亮的文本
                        if (paragraph.includes(note.highlight)) {
                          const parts = paragraph.split(note.highlight);
                          return (
                            <div key={note.id}>
                              {parts.map((part, partIndex) => (
                                <React.Fragment key={partIndex}>
                                  {part}
                                  {partIndex < parts.length - 1 && (
                                    <span 
                                      className={`px-1 py-0.5 rounded border ${getNoteTypeStyle(note.type)} cursor-pointer`}
                                      onClick={() => toggleNoteDetails(note.id)}
                                    >
                                      {note.highlight}
                                    </span>
                                  )}
                                </React.Fragment>
                              ))}
                            </div>
                          );
                        }
                        return null;
                      })
                    : paragraph}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 添加笔记弹窗 */}
      {isAddingNote && selectedText && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-20 p-4">
          <div 
            ref={addNoteFormRef}
            className="bg-gray-800 rounded-lg p-6 max-w-lg w-full"
          >
            <h3 className="text-lg font-semibold mb-4">添加笔记</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                选中的文本:
              </label>
              <div className="bg-gray-700 p-3 rounded-md text-white">
                {selectedText}
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                笔记类型:
              </label>
              <div className="flex flex-wrap gap-2">
                {noteTypes.map(type => (
                  <button
                    key={type.id}
                    onClick={() => setHighlightType(type.id)}
                    className={`px-3 py-1.5 rounded-md text-sm flex items-center gap-1 ${
                      highlightType === type.id 
                        ? `${type.color} text-white` 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <span>{type.emoji}</span>
                    <span>{type.name}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                笔记内容:
              </label>
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                className="w-full bg-gray-700 text-white rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="在这里输入你的笔记内容..."
              />
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={resetNoteForm}
                className="px-4 py-2 rounded-md bg-gray-700 text-white hover:bg-gray-600"
              >
                取消
              </button>
              <button
                onClick={addNote}
                disabled={!noteText}
                className={`px-4 py-2 rounded-md ${
                  noteText ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                添加笔记
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* 导出笔记对话框 */}
      <NoteExportDialog 
        isOpen={showExport}
        onClose={() => setShowExport(false)}
        lessonId={lessonId as string}
      />
      
      {/* 底部导航 */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 py-3 px-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link
            href={`/courses/${courseId}`}
            className="flex items-center text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            课程目录
          </Link>
          
          <div>
            <span className="text-gray-400">笔记总数: </span>
            <span className="text-white font-medium">{notes.length}</span>
          </div>
          
          <Link
            href={`/courses/${courseId}/lessons/${lessonId}`}
            className="flex items-center text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            切换模式
          </Link>
        </div>
      </div>
      
      {/* 学习模式导航 */}
      <ModeNavigation className="pb-safe" />
    </div>
  );
} 