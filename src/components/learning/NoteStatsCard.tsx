import React from 'react';
import { NoteStats, noteTypes } from '@/types/notes';

interface NoteStatsCardProps {
  stats: NoteStats;
  className?: string;
}

export default function NoteStatsCard({ stats, className = '' }: NoteStatsCardProps) {
  return (
    <div className={`bg-gray-800 rounded-lg overflow-hidden shadow-md ${className}`}>
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-lg font-medium text-white">笔记统计</h3>
        <p className="text-gray-400 text-sm">总计 {stats.total} 条笔记</p>
      </div>
      
      <div className="p-4">
        <h4 className="text-sm font-medium text-gray-400 mb-3">按类型分布</h4>
        <div className="space-y-3">
          {/* 类型统计条形图 */}
          {noteTypes.map(type => {
            const typeStat = stats.byType.find(stat => stat.type === type.id);
            const count = typeStat?.count || 0;
            const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
            
            return (
              <div key={type.id} className="space-y-1">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{type.emoji}</span>
                    <span className="text-sm text-gray-300">{type.name}</span>
                  </div>
                  <span className="text-sm text-gray-400">{count}条</span>
                </div>
                
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${getBgColorByType(type.id)}`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {stats.byParagraph.length > 0 && (
        <div className="p-4 border-t border-gray-700">
          <h4 className="text-sm font-medium text-gray-400 mb-3">按段落分布</h4>
          <div className="grid grid-cols-2 gap-2">
            {stats.byParagraph
              .sort((a, b) => a.paragraphIndex - b.paragraphIndex)
              .map(paragraph => (
                <div 
                  key={paragraph.paragraphIndex}
                  className="bg-gray-700 rounded-md p-2 flex flex-col items-center justify-center"
                >
                  <span className="text-xs text-gray-400">段落 {paragraph.paragraphIndex + 1}</span>
                  <span className="text-lg font-medium text-white">{paragraph.count}</span>
                  <span className="text-xs text-gray-400">条笔记</span>
                </div>
              ))
            }
          </div>
        </div>
      )}
    </div>
  );
}

// 根据笔记类型获取背景色
function getBgColorByType(type: string): string {
  switch (type) {
    case 'important':
      return 'bg-yellow-500';
    case 'difficult':
      return 'bg-red-500';
    case 'insight':
      return 'bg-green-500';
    case 'question':
      return 'bg-blue-500';
    case 'vocabulary':
      return 'bg-purple-500';
    default:
      return 'bg-gray-500';
  }
} 