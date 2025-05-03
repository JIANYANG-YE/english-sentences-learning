import React, { useState, useEffect } from 'react';
import { FaLink, FaInfoCircle, FaPlus, FaLanguage, FaBookOpen, FaVolumeUp, FaExternalLinkAlt } from 'react-icons/fa';

// 知识点接口
export interface KnowledgeItem {
  id: string;
  type: 'grammar' | 'vocabulary' | 'expression' | 'pronunciation' | 'cultural';
  title: string;
  brief: string;
  content: string;
  examples: string[];
  relatedItems: string[]; // 相关知识点ID
  difficulty: number; // 1-5
  tags: string[];
}

// 组件属性接口
export interface RelatedKnowledgeSystemProps {
  initialKnowledgeItems?: KnowledgeItem[];
  currentItemId?: string;
  onItemSelect?: (itemId: string) => void;
}

export default function RelatedKnowledgeSystem({
  initialKnowledgeItems = [],
  currentItemId,
  onItemSelect = () => {}
}: RelatedKnowledgeSystemProps) {
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>(initialKnowledgeItems);
  const [selectedItemId, setSelectedItemId] = useState<string | undefined>(currentItemId);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'graph'>('list');
  const [isLoading, setIsLoading] = useState(initialKnowledgeItems.length === 0);

  // 加载知识点数据
  useEffect(() => {
    if (initialKnowledgeItems.length === 0) {
      // 模拟API调用加载知识点
      setIsLoading(true);
      setTimeout(() => {
        setKnowledgeItems(getMockKnowledgeItems());
        setIsLoading(false);
      }, 800);
    }
  }, [initialKnowledgeItems]);

  // 当前项ID更新时响应
  useEffect(() => {
    if (currentItemId && currentItemId !== selectedItemId) {
      setSelectedItemId(currentItemId);
    }
  }, [currentItemId]);

  // 处理知识点选择
  const handleItemSelect = (itemId: string) => {
    setSelectedItemId(itemId);
    onItemSelect(itemId);
  };

  // 知识点类型图标
  const getTypeIcon = (type: KnowledgeItem['type']) => {
    switch (type) {
      case 'grammar':
        return <FaBookOpen className="text-blue-500" />;
      case 'vocabulary':
        return <FaLanguage className="text-green-500" />;
      case 'expression':
        return <FaInfoCircle className="text-purple-500" />;
      case 'pronunciation':
        return <FaVolumeUp className="text-orange-500" />;
      case 'cultural':
        return <FaExternalLinkAlt className="text-red-500" />;
      default:
        return <FaInfoCircle className="text-gray-500" />;
    }
  };

  // 知识点类型名称
  const getTypeName = (type: KnowledgeItem['type']): string => {
    const typeMap: Record<KnowledgeItem['type'], string> = {
      grammar: '语法',
      vocabulary: '词汇',
      expression: '表达',
      pronunciation: '发音',
      cultural: '文化'
    };
    return typeMap[type] || '其他';
  };

  // 知识点难度标签
  const getDifficultyLabel = (difficulty: number): string => {
    const labels = ['入门', '简单', '中级', '高级', '专家'];
    return labels[Math.min(Math.max(0, difficulty - 1), 4)];
  };

  // 知识点难度颜色类
  const getDifficultyColorClass = (difficulty: number): string => {
    const colorClasses = [
      'bg-gray-200 text-gray-800', // 入门
      'bg-green-200 text-green-800', // 简单
      'bg-blue-200 text-blue-800', // 中级
      'bg-orange-200 text-orange-800', // 高级
      'bg-red-200 text-red-800' // 专家
    ];
    return colorClasses[Math.min(Math.max(0, difficulty - 1), 4)];
  };

  // 过滤和搜索知识点
  const getFilteredItems = (): KnowledgeItem[] => {
    if (!searchQuery.trim()) {
      return knowledgeItems;
    }
    
    const query = searchQuery.toLowerCase();
    return knowledgeItems.filter(item => 
      item.title.toLowerCase().includes(query) || 
      item.brief.toLowerCase().includes(query) ||
      item.tags.some(tag => tag.toLowerCase().includes(query))
    );
  };

  // 获取相关知识点
  const getRelatedItems = (itemId: string): KnowledgeItem[] => {
    const currentItem = knowledgeItems.find(item => item.id === itemId);
    if (!currentItem) return [];
    
    return knowledgeItems.filter(item => 
      currentItem.relatedItems.includes(item.id)
    );
  };

  // 渲染知识点列表项
  const renderKnowledgeItem = (item: KnowledgeItem) => {
    const isSelected = item.id === selectedItemId;
    
    return (
      <div 
        key={item.id}
        className={`bg-white rounded-lg shadow p-4 cursor-pointer transition-all ${
          isSelected ? 'ring-2 ring-blue-500' : 'hover:shadow-md'
        }`}
        onClick={() => handleItemSelect(item.id)}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            {getTypeIcon(item.type)}
            <span className="font-medium ml-2">{item.title}</span>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColorClass(item.difficulty)}`}>
            {getDifficultyLabel(item.difficulty)}
          </span>
        </div>
        
        <p className="text-sm text-gray-600 mb-3">{item.brief}</p>
        
        <div className="flex flex-wrap gap-1 mt-2">
          {item.tags.map(tag => (
            <span 
              key={tag} 
              className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    );
  };

  // 渲染知识点详情
  const renderKnowledgeDetail = () => {
    const selectedItem = knowledgeItems.find(item => item.id === selectedItemId);
    if (!selectedItem) return null;
    
    const relatedItems = getRelatedItems(selectedItem.id);
    
    return (
      <div className="bg-white rounded-lg shadow p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            {getTypeIcon(selectedItem.type)}
            <h2 className="text-xl font-bold ml-2">{selectedItem.title}</h2>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColorClass(selectedItem.difficulty)}`}>
            {getTypeName(selectedItem.type)} · {getDifficultyLabel(selectedItem.difficulty)}
          </span>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-700 leading-relaxed">{selectedItem.content}</p>
        </div>
        
        {selectedItem.examples.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">例句</h3>
            <div className="bg-gray-50 p-3 rounded-lg">
              <ul className="space-y-2">
                {selectedItem.examples.map((example, index) => (
                  <li key={index} className="text-gray-700">• {example}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
        
        {relatedItems.length > 0 && (
          <div>
            <h3 className="text-lg font-medium mb-2">相关知识点</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {relatedItems.map(item => (
                <div 
                  key={item.id}
                  className="flex items-center p-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                  onClick={() => handleItemSelect(item.id)}
                >
                  {getTypeIcon(item.type)}
                  <span className="ml-2 text-sm font-medium">{item.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex flex-wrap gap-1 mt-4">
          {selectedItem.tags.map(tag => (
            <span 
              key={tag} 
              className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    );
  };

  // 渲染知识网络图
  const renderKnowledgeGraph = () => {
    // 实际实现中可以使用D3.js或其他可视化库构建网络图
    return (
      <div className="bg-white rounded-lg shadow p-4 h-64 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <FaLink className="text-4xl mx-auto mb-2" />
          <p>知识网络图 - 建设中</p>
          <p className="text-xs mt-2">此功能将显示知识点之间的关联关系</p>
        </div>
      </div>
    );
  };

  // 渲染加载状态
  const renderLoading = () => (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-600">加载知识点中...</p>
    </div>
  );

  // 渲染空状态
  const renderEmpty = () => (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow">
      <FaInfoCircle className="text-4xl text-gray-400 mb-3" />
      <p className="text-gray-600 mb-4">没有找到相关知识点</p>
      <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg">
        <FaPlus className="mr-2" />
        添加知识点
      </button>
    </div>
  );

  // 模拟知识点数据
  const getMockKnowledgeItems = (): KnowledgeItem[] => {
    return [
      {
        id: 'k1',
        type: 'grammar',
        title: '现在完成时',
        brief: '表示过去发生并持续到现在的动作或状态',
        content: '现在完成时用于表示过去开始、持续到现在的动作，或过去发生的对现在有影响的事情。结构为：主语 + have/has + 过去分词。',
        examples: [
          'I have lived in Beijing for five years.',
          'She has already finished her homework.',
          'Have you ever visited Paris?'
        ],
        relatedItems: ['k2', 'k5'],
        difficulty: 2,
        tags: ['时态', '基础语法', '完成时']
      },
      {
        id: 'k2',
        type: 'grammar',
        title: '过去完成时',
        brief: '表示过去某一时刻之前已经完成的动作',
        content: '过去完成时用于表示在过去某一时间点之前已经发生或完成的动作。结构为：主语 + had + 过去分词。',
        examples: [
          'When I arrived, she had already left.',
          'He had studied English before he moved to the United States.',
          'They had never seen such a beautiful sunset before that day.'
        ],
        relatedItems: ['k1'],
        difficulty: 3,
        tags: ['时态', '中级语法', '完成时']
      },
      {
        id: 'k3',
        type: 'vocabulary',
        title: '情感表达词汇',
        brief: '描述各种情感状态的常用词汇',
        content: '英语中有丰富的词汇来描述不同的情感状态，从基本情感到复杂情感都有相应的表达方式。掌握这些词汇有助于更准确地表达自己的感受。',
        examples: [
          'I was elated when I heard the news. (我听到这个消息时欣喜若狂)',
          'She felt devastated after the breakup. (分手后她感到心碎)',
          'The movie left me melancholic. (这部电影让我感到忧郁)'
        ],
        relatedItems: ['k4'],
        difficulty: 4,
        tags: ['词汇', '情感', '表达']
      },
      {
        id: 'k4',
        type: 'expression',
        title: '情感习语表达',
        brief: '与情感相关的常用习语和表达方式',
        content: '英语中有许多习语和固定表达用于描述情感状态，这些表达往往更加生动形象，是提升语言表达能力的重要部分。',
        examples: [
          'I was over the moon when I passed the exam. (我通过考试时欣喜若狂)',
          'The news broke my heart. (这个消息让我心碎)',
          'She has been feeling under the weather lately. (她最近感觉不太舒服)'
        ],
        relatedItems: ['k3'],
        difficulty: 4,
        tags: ['习语', '情感', '表达', '高级用法']
      },
      {
        id: 'k5',
        type: 'pronunciation',
        title: 'ED结尾发音规则',
        brief: '过去式和过去分词中-ed结尾的发音变化',
        content: '英语中过去式和过去分词常以-ed结尾，其发音根据前面的辅音有三种不同情况：/t/（清辅音后）、/d/（浊辅音和元音后）和/ɪd/（t和d后）。',
        examples: [
          'worked /wɜːkt/ - 清辅音/k/后，-ed发/t/',
          'played /pleɪd/ - 浊辅音/eɪ/后，-ed发/d/',
          'needed /niːdɪd/ - /d/后，-ed发/ɪd/'
        ],
        relatedItems: ['k1', 'k2'],
        difficulty: 2,
        tags: ['发音', '语音规则', '过去式']
      },
      {
        id: 'k6',
        type: 'cultural',
        title: '英美文化差异',
        brief: '英国和美国文化在语言使用上的主要差异',
        content: '英国英语和美国英语虽然基础相同，但在词汇、拼写、发音甚至语法上都存在一些差异，这些差异反映了两国的文化特点和历史发展。',
        examples: [
          "英式：I'm going to university. / 美式：I'm going to college.",
          "英式：flat / 美式：apartment",
          "英式：queue / 美式：line"
        ],
        relatedItems: [],
        difficulty: 3,
        tags: ['文化', '英美差异', '用词区别']
      }
    ];
  };

  const filteredItems = getFilteredItems();

  return (
    <div className="space-y-4">
      {/* 顶部搜索和视图切换 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="搜索知识点..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FaInfoCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        
        <div className="flex items-center space-x-2">
          <button 
            className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
              viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
            onClick={() => setViewMode('list')}
          >
            列表视图
          </button>
          <button 
            className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
              viewMode === 'graph' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
            onClick={() => setViewMode('graph')}
          >
            网络视图
          </button>
        </div>
      </div>
      
      {isLoading ? (
        renderLoading()
      ) : filteredItems.length === 0 ? (
        renderEmpty()
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 知识点列表 */}
          <div className={`space-y-3 ${selectedItemId ? 'hidden md:block' : ''} ${viewMode === 'graph' ? 'md:col-span-3' : 'md:col-span-1'}`}>
            {viewMode === 'list' ? (
              filteredItems.map(item => renderKnowledgeItem(item))
            ) : (
              renderKnowledgeGraph()
            )}
          </div>
          
          {/* 知识点详情 */}
          {selectedItemId && viewMode === 'list' && (
            <div className="md:col-span-2">
              {renderKnowledgeDetail()}
            </div>
          )}
        </div>
      )}
    </div>
  );
} 