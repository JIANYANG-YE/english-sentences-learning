import React from 'react';
import { ModeContentItem } from '@/types/courses/packageTypes';
import { FaCheck, FaLock, FaClock } from 'react-icons/fa';

interface ProgressTrackerProps {
  total: number;
  completed: number;
  currentIndex: number;
  onNavigate: (index: number) => void;
  items: ModeContentItem[];
  completedItems: Set<string>;
}

export default function ProgressTracker({
  total,
  completed,
  currentIndex,
  onNavigate,
  items,
  completedItems
}: ProgressTrackerProps) {
  // 计算完成百分比
  const progressPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  // 剩余时间估算（假设每个项目平均需要30秒）
  const remainingItems = total - completed;
  const estimatedTimeMinutes = Math.ceil(remainingItems * 0.5);
  
  // 检查是否可以导航到特定项目
  const canNavigateToItem = (index: number): boolean => {
    // 已完成的项目或当前项目及之前的项目可以导航
    return index <= currentIndex || (items[index] && completedItems.has(items[index].id));
  };
  
  return (
    <div className="mb-6">
      {/* 进度条 */}
      <div className="flex items-center mb-2">
        <div className="flex-1 bg-gray-200 rounded-full h-4 dark:bg-gray-700">
          <div 
            className="bg-blue-600 h-4 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <span className="ml-4 text-sm font-medium text-gray-900 dark:text-white">
          {completed}/{total} ({progressPercentage}%)
        </span>
      </div>
      
      {/* 估计剩余时间 */}
      {remainingItems > 0 && (
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-4">
          <FaClock className="mr-1" />
          <span>
            {estimatedTimeMinutes > 0 
              ? `预计剩余时间：约 ${estimatedTimeMinutes} 分钟` 
              : '即将完成！'}
          </span>
        </div>
      )}
      
      {/* 进度节点 */}
      <div className="flex flex-wrap gap-2 mt-3">
        {items.map((item, index) => (
          <button
            key={item.id}
            onClick={() => canNavigateToItem(index) && onNavigate(index)}
            disabled={!canNavigateToItem(index)}
            className={`
              w-8 h-8 rounded-full flex items-center justify-center text-sm
              ${index === currentIndex 
                ? 'bg-blue-600 text-white' 
                : completedItems.has(item.id)
                  ? 'bg-green-100 text-green-800 border border-green-600'
                  : 'bg-gray-100 text-gray-800 border border-gray-300'
              }
              ${canNavigateToItem(index) ? 'hover:bg-opacity-80' : 'cursor-not-allowed opacity-60'}
            `}
            title={`项目 ${index + 1}${completedItems.has(item.id) ? ' (已完成)' : ''}${!canNavigateToItem(index) ? ' (锁定)' : ''}`}
          >
            {completedItems.has(item.id) ? (
              <FaCheck size={12} />
            ) : !canNavigateToItem(index) ? (
              <FaLock size={10} />
            ) : (
              index + 1
            )}
          </button>
        ))}
      </div>
    </div>
  );
} 