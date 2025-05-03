/**
 * 笔记服务类
 * 提供笔记的获取、保存、统计、导出等功能
 */

import { Note } from '@/types/notes';

class NotesService {
  /**
   * 获取指定课程的笔记
   * @param lessonId 课程ID
   * @returns 笔记列表
   */
  async getNotes(lessonId: string): Promise<Note[]> {
    try {
      const response = await fetch(`/api/lessons/${lessonId}/notes`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '获取笔记失败');
      }
      
      return data.notes || [];
    } catch (error) {
      console.error('获取笔记时出错:', error);
      return [];
    }
  }
  
  /**
   * 保存课程笔记
   * @param lessonId 课程ID
   * @param notes 笔记列表
   * @returns 是否保存成功
   */
  async saveNotes(lessonId: string, notes: Note[]): Promise<boolean> {
    try {
      const response = await fetch(`/api/lessons/${lessonId}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ notes })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '保存笔记失败');
      }
      
      return data.success || false;
    } catch (error) {
      console.error('保存笔记时出错:', error);
      return false;
    }
  }
  
  /**
   * 导出笔记
   * @param lessonId 课程ID
   * @param format 导出格式，支持 'markdown' 和 'json'
   * @returns 导出的笔记内容
   */
  async exportNotes(lessonId: string, format: 'markdown' | 'json' = 'markdown'): Promise<string> {
    try {
      const response = await fetch(`/api/lessons/${lessonId}/notes?format=${format}`, {
        method: 'PUT'
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '导出笔记失败');
      }
      
      return data.data || '';
    } catch (error) {
      console.error('导出笔记时出错:', error);
      return '';
    }
  }
  
  /**
   * 删除课程的所有笔记
   * @param lessonId 课程ID
   * @returns 是否删除成功
   */
  async deleteAllNotes(lessonId: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/lessons/${lessonId}/notes`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '删除笔记失败');
      }
      
      return data.success || false;
    } catch (error) {
      console.error('删除笔记时出错:', error);
      return false;
    }
  }
  
  /**
   * 获取笔记统计信息
   * @param lessonId 课程ID
   * @returns 笔记统计信息
   */
  async getNoteStats(lessonId: string): Promise<any> {
    try {
      const response = await fetch(`/api/lessons/${lessonId}/notes/stats`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '获取笔记统计失败');
      }
      
      return data;
    } catch (error) {
      console.error('获取笔记统计时出错:', error);
      return {
        total: 0,
        byType: [],
        byParagraph: []
      };
    }
  }
  
  /**
   * 将本地笔记保存到本地存储
   * 用于断网情况下的备份
   * @param lessonId 课程ID
   * @param notes 笔记列表
   */
  saveToLocalStorage(lessonId: string, notes: Note[]): void {
    try {
      localStorage.setItem(`notes_${lessonId}`, JSON.stringify(notes));
    } catch (error) {
      console.error('保存到本地存储时出错:', error);
    }
  }
  
  /**
   * 从本地存储获取笔记
   * @param lessonId 课程ID
   * @returns 笔记列表
   */
  getFromLocalStorage(lessonId: string): Note[] {
    try {
      const notesJson = localStorage.getItem(`notes_${lessonId}`);
      return notesJson ? JSON.parse(notesJson) : [];
    } catch (error) {
      console.error('从本地存储获取笔记时出错:', error);
      return [];
    }
  }
  
  /**
   * 搜索笔记
   * @param notes 笔记列表
   * @param query 搜索关键词
   * @returns 符合搜索条件的笔记
   */
  searchNotes(notes: Note[], query: string): Note[] {
    if (!query.trim()) {
      return notes;
    }
    
    const lowerQuery = query.toLowerCase();
    
    return notes.filter(note => 
      note.highlight.toLowerCase().includes(lowerQuery) || 
      note.note.toLowerCase().includes(lowerQuery)
    );
  }
  
  /**
   * 过滤笔记
   * @param notes 笔记列表
   * @param type 笔记类型
   * @param paragraphIndex 段落索引
   * @returns 过滤后的笔记
   */
  filterNotes(notes: Note[], type?: string, paragraphIndex?: number): Note[] {
    return notes.filter(note => {
      let match = true;
      
      if (type) {
        match = match && note.type === type;
      }
      
      if (paragraphIndex !== undefined) {
        match = match && note.paragraphIndex === paragraphIndex;
      }
      
      return match;
    });
  }
}

// 导出服务实例
export const notesService = new NotesService(); 