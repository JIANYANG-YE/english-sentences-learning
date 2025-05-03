'use client';

import { useState, useEffect } from 'react';
import { FiTag, FiPlus, FiEdit, FiTrash2, FiCheck, FiX, FiSearch } from 'react-icons/fi';

interface ContentTag {
  id: string;
  name: string;
  color: string;
  category: string;
  count: number;
  parentId?: string;
}

interface TagCategory {
  id: string;
  name: string;
  description: string;
  count: number;
}

/**
 * 内容标签管理器
 * 
 * 用于创建、编辑和管理内容标签与分类
 */
export default function ContentTagManager() {
  // 标签状态
  const [tags, setTags] = useState<ContentTag[]>([]);
  const [categories, setCategories] = useState<TagCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // 标签编辑状态
  const [editingTagId, setEditingTagId] = useState<string | null>(null);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#3b82f6');
  const [newTagCategory, setNewTagCategory] = useState('');
  
  // 新标签状态
  const [isAddingTag, setIsAddingTag] = useState(false);
  
  // 加载示例数据
  useEffect(() => {
    // 模拟API调用
    setLoading(true);
    
    // 模拟延迟
    setTimeout(() => {
      // 示例分类
      setCategories([
        { id: 'cat-1', name: '难度', description: '内容难度分类', count: 3 },
        { id: 'cat-2', name: '主题', description: '内容主题分类', count: 5 },
        { id: 'cat-3', name: '类型', description: '内容类型分类', count: 4 },
        { id: 'cat-4', name: '技能', description: '语言技能分类', count: 4 },
      ]);
      
      // 示例标签
      setTags([
        { id: 'tag-1', name: '初级', color: '#10b981', category: '难度', count: 28 },
        { id: 'tag-2', name: '中级', color: '#f59e0b', category: '难度', count: 42 },
        { id: 'tag-3', name: '高级', color: '#ef4444', category: '难度', count: 15 },
        { id: 'tag-4', name: '商务', color: '#6366f1', category: '主题', count: 23 },
        { id: 'tag-5', name: '旅游', color: '#8b5cf6', category: '主题', count: 18 },
        { id: 'tag-6', name: '科技', color: '#3b82f6', category: '主题', count: 31 },
        { id: 'tag-7', name: '日常生活', color: '#ec4899', category: '主题', count: 37 },
        { id: 'tag-8', name: '学术', color: '#06b6d4', category: '主题', count: 12 },
        { id: 'tag-9', name: '对话', color: '#14b8a6', category: '类型', count: 29 },
        { id: 'tag-10', name: '文章', color: '#f97316', category: '类型', count: 35 },
        { id: 'tag-11', name: '演讲', color: '#8b5cf6', category: '类型', count: 15 },
        { id: 'tag-12', name: '故事', color: '#06b6d4', category: '类型', count: 18 },
        { id: 'tag-13', name: '听力', color: '#22c55e', category: '技能', count: 47 },
        { id: 'tag-14', name: '阅读', color: '#3b82f6', category: '技能', count: 56 },
        { id: 'tag-15', name: '口语', color: '#ec4899', category: '技能', count: 38 },
        { id: 'tag-16', name: '写作', color: '#f97316', category: '技能', count: 29 },
      ]);
      
      setLoading(false);
    }, 800);
  }, []);
  
  // 过滤标签
  const filteredTags = tags.filter(tag => 
    tag.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    tag.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // 按分类分组标签
  const tagsByCategory = categories.map(category => ({
    category,
    tags: filteredTags.filter(tag => tag.category === category.name)
  }));
  
  // 添加新标签
  const handleAddTag = () => {
    if (!newTagName.trim() || !newTagCategory) {
      return;
    }
    
    const newTag: ContentTag = {
      id: `tag-${Date.now()}`,
      name: newTagName.trim(),
      color: newTagColor,
      category: newTagCategory,
      count: 0
    };
    
    setTags([...tags, newTag]);
    setNewTagName('');
    setNewTagColor('#3b82f6');
    setNewTagCategory('');
    setIsAddingTag(false);
  };
  
  // 更新标签
  const handleUpdateTag = (tagId: string) => {
    if (!newTagName.trim()) {
      return;
    }
    
    setTags(tags.map(tag => 
      tag.id === tagId 
        ? { ...tag, name: newTagName.trim(), color: newTagColor, category: newTagCategory } 
        : tag
    ));
    
    setEditingTagId(null);
    setNewTagName('');
    setNewTagColor('#3b82f6');
    setNewTagCategory('');
  };
  
  // 删除标签
  const handleDeleteTag = (tagId: string) => {
    if (confirm('确定要删除此标签吗？这将影响所有使用此标签的内容。')) {
      setTags(tags.filter(tag => tag.id !== tagId));
    }
  };
  
  // 开始编辑标签
  const startEditingTag = (tag: ContentTag) => {
    setEditingTagId(tag.id);
    setNewTagName(tag.name);
    setNewTagColor(tag.color);
    setNewTagCategory(tag.category);
  };
  
  // 取消编辑
  const cancelEditing = () => {
    setEditingTagId(null);
    setNewTagName('');
    setNewTagColor('#3b82f6');
    setNewTagCategory('');
  };
  
  // 渲染标签表单
  const renderTagForm = (isEdit: boolean, tagId?: string) => (
    <div className="p-4 bg-gray-50 rounded-md mb-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">标签名称</label>
          <input
            type="text"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="输入标签名称"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">标签颜色</label>
          <div className="flex items-center">
            <input
              type="color"
              value={newTagColor}
              onChange={(e) => setNewTagColor(e.target.value)}
              className="w-10 h-10 border-0 p-0 mr-2"
            />
            <input
              type="text"
              value={newTagColor}
              onChange={(e) => setNewTagColor(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="#RRGGBB"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">所属分类</label>
          <select
            value={newTagCategory}
            onChange={(e) => setNewTagCategory(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">选择分类</option>
            {categories.map(category => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="mt-4 flex justify-end space-x-2">
        <button
          onClick={isEdit ? cancelEditing : () => setIsAddingTag(false)}
          className="px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center"
        >
          <FiX className="mr-1" />
          取消
        </button>
        
        <button
          onClick={isEdit ? () => handleUpdateTag(tagId!) : handleAddTag}
          className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          disabled={!newTagName.trim() || !newTagCategory}
        >
          <FiCheck className="mr-1" />
          {isEdit ? '更新' : '添加'}
        </button>
      </div>
    </div>
  );
  
  return (
    <div className="content-tag-manager">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">标签管理</h3>
          
          <button
            onClick={() => setIsAddingTag(true)}
            className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
            disabled={isAddingTag}
          >
            <FiPlus className="mr-1" />
            添加标签
          </button>
        </div>
        
        <div className="mb-4">
          <div className="flex">
            <div className="relative flex-grow">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索标签..."
                className="w-full p-2 pl-10 border border-gray-300 rounded-md"
              />
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>
        </div>
        
        {isAddingTag && renderTagForm(false)}
        
        {loading ? (
          <div className="text-center p-8">
            <div className="inline-block animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            <p className="mt-2 text-gray-500">加载标签数据...</p>
          </div>
        ) : (
          <div>
            {tagsByCategory.map(({ category, tags }) => (
              <div key={category.id} className="mb-6">
                <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                  <span className="mr-2">{category.name}</span>
                  <span className="text-sm bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full">
                    {tags.length}
                  </span>
                </h4>
                
                <div className="bg-white border border-gray-200 rounded-md">
                  {tags.length === 0 ? (
                    <p className="text-gray-500 p-4 text-center">无标签</p>
                  ) : (
                    <ul className="divide-y divide-gray-200">
                      {tags.map(tag => (
                        <li 
                          key={tag.id} 
                          className={`p-3 flex justify-between items-center ${editingTagId === tag.id ? 'bg-blue-50' : ''}`}
                        >
                          {editingTagId === tag.id ? (
                            renderTagForm(true, tag.id)
                          ) : (
                            <>
                              <div className="flex items-center">
                                <span
                                  className="w-4 h-4 rounded-full mr-2"
                                  style={{ backgroundColor: tag.color }}
                                ></span>
                                <span>{tag.name}</span>
                                <span className="ml-2 text-xs bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full">
                                  {tag.count}
                                </span>
                              </div>
                              
                              <div className="flex space-x-1">
                                <button 
                                  onClick={() => startEditingTag(tag)}
                                  className="p-1 text-gray-500 hover:text-blue-500"
                                >
                                  <FiEdit size={16} />
                                </button>
                                <button 
                                  onClick={() => handleDeleteTag(tag.id)}
                                  className="p-1 text-gray-500 hover:text-red-500"
                                >
                                  <FiTrash2 size={16} />
                                </button>
                              </div>
                            </>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 