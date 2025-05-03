'use client';

import { Category } from '@/types';

interface CategoryNavProps {
  categories: Category[];
  selectedCategoryId: string | null;
  onSelectCategory: (categoryId: string) => void;
}

export default function CategoryNav({ 
  categories, 
  selectedCategoryId, 
  onSelectCategory 
}: CategoryNavProps) {
  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <h2 className="bg-blue-600 text-white p-4 font-bold text-lg">学习分类</h2>
      <ul>
        <li className="border-b">
          <button
            onClick={() => onSelectCategory('all')}
            className={`w-full text-left px-4 py-3 transition-colors hover:bg-blue-50 ${
              selectedCategoryId === 'all' ? 'bg-blue-100 font-medium' : ''
            }`}
          >
            所有句子
          </button>
        </li>
        {categories.map(category => (
          <li key={category.id} className="border-b last:border-b-0">
            <button
              onClick={() => onSelectCategory(category.id)}
              className={`w-full text-left px-4 py-3 transition-colors hover:bg-blue-50 ${
                selectedCategoryId === category.id ? 'bg-blue-100 font-medium' : ''
              }`}
            >
              <div className="font-medium">{category.name}</div>
              <div className="text-sm text-gray-500">{category.description}</div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
} 