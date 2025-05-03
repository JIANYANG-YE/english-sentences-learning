import React, { useState, useEffect } from 'react';
import { Tab } from '@headlessui/react';
import { FaCog, FaChartBar, FaNetworkWired, FaBookOpen } from 'react-icons/fa';

import AdaptiveMultimodalLearningOptimizer from './AdaptiveMultimodalLearningOptimizer';
import MixedLearningMode from './modes/MixedLearningMode';
import ModeProficiencyTracker from './ModeProficiencyTracker';
import RelatedKnowledgeSystem from './RelatedKnowledgeSystem';

// 界面配置选项类型
interface InterfaceSettings {
  showStatistics: boolean;
  enableAnimations: boolean;
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
  interfaceLanguage: 'zh-CN' | 'en-US';
}

// 集成学习面板属性
interface IntegratedLearningModePanelProps {
  userId: string;
  currentLessonId?: string;
  initialActiveTab?: number;
  userPreferences?: {
    activityDistribution: Record<string, number>;
    difficultyLevel: Record<string, number>;
    rotationInterval: number;
    enableAdaptiveMode: boolean;
  };
  interfaceSettings?: InterfaceSettings;
  recentPerformance?: any[];
  onPreferencesUpdate?: (newPreferences: any) => void;
  onSettingsUpdate?: (newSettings: InterfaceSettings) => void;
}

export default function IntegratedLearningModePanel({
  userId,
  currentLessonId,
  initialActiveTab = 0,
  userPreferences = {
    activityDistribution: {
      chineseToEnglish: 30,
      englishToChinese: 25,
      grammar: 20,
      listening: 15,
      vocabulary: 10
    },
    difficultyLevel: {
      chineseToEnglish: 2,
      englishToChinese: 2,
      grammar: 1,
      listening: 2,
      vocabulary: 2
    },
    rotationInterval: 60,
    enableAdaptiveMode: true
  },
  interfaceSettings = {
    showStatistics: true,
    enableAnimations: true,
    darkMode: false,
    fontSize: 'medium',
    interfaceLanguage: 'zh-CN'
  },
  recentPerformance = [],
  onPreferencesUpdate = () => {},
  onSettingsUpdate = () => {}
}: IntegratedLearningModePanelProps) {
  const [selectedTab, setSelectedTab] = useState(initialActiveTab);
  const [currentMode, setCurrentMode] = useState<'mixed' | 'standard'>('mixed');
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [proficiencyData, setProficiencyData] = useState<any>(null);
  const [knowledgeItems, setKnowledgeItems] = useState<any[]>([]);

  // 加载熟练度数据
  useEffect(() => {
    const fetchProficiencyData = async () => {
      // 在实际应用中，这里应该从API获取数据
      // 模拟数据加载
      setTimeout(() => {
        setProficiencyData({
          modes: {
            chineseToEnglish: { level: 3.5, sessionsCompleted: 48, successRate: 0.78 },
            englishToChinese: { level: 3.2, sessionsCompleted: 42, successRate: 0.73 },
            grammar: { level: 2.8, sessionsCompleted: 35, successRate: 0.65 },
            listening: { level: 3.0, sessionsCompleted: 30, successRate: 0.70 },
            vocabulary: { level: 3.7, sessionsCompleted: 52, successRate: 0.82 }
          },
          recentProgress: [
            { date: '2023-06-01', averageScore: 75 },
            { date: '2023-06-08', averageScore: 78 },
            { date: '2023-06-15', averageScore: 80 },
            { date: '2023-06-22', averageScore: 82 },
            { date: '2023-06-29', averageScore: 85 }
          ]
        });
      }, 1000);
    };

    fetchProficiencyData();
  }, [userId]);

  // 加载相关知识项
  useEffect(() => {
    if (currentLessonId) {
      setIsLoadingContent(true);
      // 模拟API调用
      setTimeout(() => {
        setKnowledgeItems([
          {
            id: 'k1',
            title: '现在完成时态',
            type: 'grammar',
            relevanceScore: 0.95,
            description: '用于表示过去发生但与现在有联系的动作或状态'
          },
          {
            id: 'k2',
            title: '情态动词用法',
            type: 'grammar',
            relevanceScore: 0.82,
            description: '表示说话人对动作或状态的态度的词'
          },
          {
            id: 'k3',
            title: '常见介词搭配',
            type: 'vocabulary',
            relevanceScore: 0.75,
            description: '英语中常见的动词+介词搭配用法'
          }
        ]);
        setIsLoadingContent(false);
      }, 1500);
    }
  }, [currentLessonId]);

  // 处理用户偏好更新
  const handlePreferencesUpdate = (newPreferences: any) => {
    // 调用父组件传入的回调
    onPreferencesUpdate(newPreferences);
  };

  // 处理界面设置更新
  const handleSettingsUpdate = (newSettings: InterfaceSettings) => {
    // 调用父组件传入的回调
    onSettingsUpdate(newSettings);
  };

  // 渲染设置面板
  const renderSettingsPanel = () => {
    const [settings, setSettings] = useState(interfaceSettings);

    const updateSetting = (key: keyof InterfaceSettings, value: any) => {
      setSettings(prev => ({ ...prev, [key]: value }));
    };

    const saveSettings = () => {
      handleSettingsUpdate(settings);
    };

    return (
      <div className="space-y-6 p-4">
        <h3 className="text-lg font-medium text-gray-900">界面设置</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">显示统计信息</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={settings.showStatistics} 
                onChange={e => updateSetting('showStatistics', e.target.checked)}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">启用动画效果</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={settings.enableAnimations} 
                onChange={e => updateSetting('enableAnimations', e.target.checked)}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">深色模式</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={settings.darkMode} 
                onChange={e => updateSetting('darkMode', e.target.checked)}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">字体大小</label>
            <select 
              value={settings.fontSize}
              onChange={e => updateSetting('fontSize', e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            >
              <option value="small">小</option>
              <option value="medium">中</option>
              <option value="large">大</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">界面语言</label>
            <select 
              value={settings.interfaceLanguage}
              onChange={e => updateSetting('interfaceLanguage', e.target.value as 'zh-CN' | 'en-US')}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            >
              <option value="zh-CN">简体中文</option>
              <option value="en-US">English</option>
            </select>
          </div>
          
          <button
            onClick={saveSettings}
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            保存设置
          </button>
        </div>
      </div>
    );
  };

  // 渲染内容区域
  const renderContent = () => {
    switch (selectedTab) {
      case 0: // 学习模式
        return (
          <>
            <div className="mb-4 bg-gray-50 p-3 rounded-lg">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">当前模式：{currentMode === 'mixed' ? '混合学习' : '标准学习'}</h3>
                <button
                  onClick={() => setCurrentMode(prev => prev === 'mixed' ? 'standard' : 'mixed')}
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                >
                  切换模式
                </button>
              </div>
            </div>
            {currentMode === 'mixed' ? (
              <MixedLearningMode 
                userId={userId} 
                lessonId={currentLessonId || ''}
                userPreferences={userPreferences}
                onPreferencesUpdate={handlePreferencesUpdate}
              />
            ) : (
              <div className="p-8 text-center bg-gray-50 rounded-lg">
                <p className="text-gray-600">标准学习模式内容将在这里显示</p>
              </div>
            )}
          </>
        );
      case 1: // 优化器
        return (
          <AdaptiveMultimodalLearningOptimizer
            userId={userId}
            currentPreferences={userPreferences}
            recentPerformance={recentPerformance}
            onPreferencesUpdate={handlePreferencesUpdate}
          />
        );
      case 2: // 熟练度追踪
        return (
          <>
            {proficiencyData ? (
              <ModeProficiencyTracker
                userId={userId}
                proficiencyData={proficiencyData}
              />
            ) : (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">加载熟练度数据中...</p>
              </div>
            )}
          </>
        );
      case 3: // 相关知识
        return (
          <>
            {isLoadingContent ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">加载相关知识中...</p>
              </div>
            ) : (
              <RelatedKnowledgeSystem
                lessonId={currentLessonId || ''}
                userId={userId}
                knowledgeItems={knowledgeItems}
              />
            )}
          </>
        );
      case 4: // 设置
        return renderSettingsPanel();
      default:
        return <div>未知标签页</div>;
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${interfaceSettings.darkMode ? 'dark' : ''}`}>
      <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
        <div className="border-b border-gray-200">
          <Tab.List className="flex space-x-1 p-1">
            <Tab
              className={({ selected }) =>
                `py-2.5 px-3 text-sm font-medium flex items-center transition-colors ${
                  selected 
                    ? 'border-b-2 border-blue-500 text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`
              }
            >
              <FaBookOpen className="mr-2" />
              <span>学习模式</span>
            </Tab>
            <Tab
              className={({ selected }) =>
                `py-2.5 px-3 text-sm font-medium flex items-center transition-colors ${
                  selected 
                    ? 'border-b-2 border-blue-500 text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`
              }
            >
              <FaChartBar className="mr-2" />
              <span>学习优化器</span>
            </Tab>
            <Tab
              className={({ selected }) =>
                `py-2.5 px-3 text-sm font-medium flex items-center transition-colors ${
                  selected 
                    ? 'border-b-2 border-blue-500 text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`
              }
            >
              <FaChartBar className="mr-2" />
              <span>熟练度追踪</span>
            </Tab>
            <Tab
              className={({ selected }) =>
                `py-2.5 px-3 text-sm font-medium flex items-center transition-colors ${
                  selected 
                    ? 'border-b-2 border-blue-500 text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`
              }
            >
              <FaNetworkWired className="mr-2" />
              <span>相关知识</span>
            </Tab>
            <Tab
              className={({ selected }) =>
                `py-2.5 px-3 text-sm font-medium flex items-center transition-colors ${
                  selected 
                    ? 'border-b-2 border-blue-500 text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`
              }
            >
              <FaCog className="mr-2" />
              <span>设置</span>
            </Tab>
          </Tab.List>
        </div>
        <Tab.Panels>
          <Tab.Panel className="p-4">{renderContent()}</Tab.Panel>
          <Tab.Panel className="p-4">{renderContent()}</Tab.Panel>
          <Tab.Panel className="p-4">{renderContent()}</Tab.Panel>
          <Tab.Panel className="p-4">{renderContent()}</Tab.Panel>
          <Tab.Panel className="p-4">{renderContent()}</Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
} 