import React, { useState } from 'react';
import { ExportFormat } from '@/types/notes';
import { notesService } from '@/services/notesService';

interface NoteExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  lessonId: string;
}

export default function NoteExportDialog({ 
  isOpen, 
  onClose, 
  lessonId 
}: NoteExportDialogProps) {
  const [format, setFormat] = useState<ExportFormat>('markdown');
  const [isExporting, setIsExporting] = useState(false);
  const [exportedContent, setExportedContent] = useState<string>('');
  const [error, setError] = useState<string>('');
  
  if (!isOpen) return null;
  
  // 处理导出
  const handleExport = async () => {
    try {
      setIsExporting(true);
      setError('');
      
      const content = await notesService.exportNotes(lessonId, format);
      
      if (!content) {
        throw new Error('导出内容为空');
      }
      
      setExportedContent(content);
    } catch (err) {
      setError(err instanceof Error ? err.message : '导出笔记时出错');
    } finally {
      setIsExporting(false);
    }
  };
  
  // 下载笔记
  const handleDownload = () => {
    if (!exportedContent) return;
    
    const extension = format === 'markdown' ? 'md' : 'json';
    const fileName = `笔记_${lessonId}_${new Date().toISOString().slice(0, 10)}.${extension}`;
    const blob = new Blob([exportedContent], { type: 'text/plain;charset=utf-8' });
    
    // 创建下载链接
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    
    // 清理
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-30 p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full">
        <div className="p-6">
          <h3 className="text-xl font-semibold text-white mb-4">导出笔记</h3>
          
          {/* 导出格式选择 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              导出格式:
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  className="form-radio text-blue-600 focus:ring-blue-500 h-4 w-4 bg-gray-700 border-gray-600"
                  checked={format === 'markdown'}
                  onChange={() => setFormat('markdown')}
                />
                <span className="ml-2 text-gray-300">Markdown (.md)</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="radio"
                  className="form-radio text-blue-600 focus:ring-blue-500 h-4 w-4 bg-gray-700 border-gray-600"
                  checked={format === 'json'}
                  onChange={() => setFormat('json')}
                />
                <span className="ml-2 text-gray-300">JSON (.json)</span>
              </label>
            </div>
          </div>
          
          {/* 操作按钮 */}
          <div className="flex gap-3">
            <button
              onClick={handleExport}
              disabled={isExporting}
              className={`px-4 py-2 rounded-md ${
                isExporting 
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isExporting ? '导出中...' : '生成预览'}
            </button>
            
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-gray-700 text-white hover:bg-gray-600"
            >
              关闭
            </button>
          </div>
          
          {/* 错误信息 */}
          {error && (
            <div className="mt-4 p-3 bg-red-900/30 border border-red-800 rounded-md text-red-300 text-sm">
              {error}
            </div>
          )}
          
          {/* 导出内容预览 */}
          {exportedContent && (
            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-lg font-medium text-white">预览</h4>
                <button
                  onClick={handleDownload}
                  className="px-3 py-1.5 rounded-md bg-green-600 hover:bg-green-700 text-white text-sm flex items-center"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  下载
                </button>
              </div>
              
              <div className="bg-gray-900 rounded-md p-4 max-h-96 overflow-auto">
                <pre className="text-gray-300 text-sm whitespace-pre-wrap break-words">
                  {exportedContent}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 