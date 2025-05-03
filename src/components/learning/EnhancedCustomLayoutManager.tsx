'use client';

import { useState, useEffect } from 'react';
import { Slider, Switch } from '@mui/material';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { 
  FiMonitor, FiMaximize, FiAlignLeft, FiAlignCenter, 
  FiType, FiSun, FiMoon, FiSliders, FiLayout, FiX,
  FiEye, FiEyeOff, FiVolume2, FiVolumeX
} from 'react-icons/fi';

export interface LayoutSettings {
  theme: 'light' | 'dark' | 'auto' | 'sepia';
  fontSize: number; // 12-24
  contentWidth: number; // 50-100%
  paragraphSpacing: number; // 1-3
  lineHeight: number; // 1-2.5
  fontFamily: string;
  enableTranslationToggle: boolean;
  showSidebar: boolean;
  showAnnotations: boolean;
  autoPronunciation: boolean;
  reduceAnimations: boolean;
  enableTextHighlight: boolean;
  sidebarPosition: 'left' | 'right';
  panelLayout: 'stack' | 'split' | 'grid';
  autoPlayAudio: boolean;
}

const defaultSettings: LayoutSettings = {
  theme: 'dark',
  fontSize: 16,
  contentWidth: 80,
  paragraphSpacing: 1.5,
  lineHeight: 1.8,
  fontFamily: 'system-ui',
  enableTranslationToggle: true,
  showSidebar: true,
  showAnnotations: true,
  autoPronunciation: false,
  reduceAnimations: false,
  enableTextHighlight: true,
  sidebarPosition: 'right',
  panelLayout: 'stack',
  autoPlayAudio: false
};

const fontOptions = [
  { value: 'system-ui', label: '系统默认' },
  { value: 'Georgia, serif', label: 'Georgia' },
  { value: "'Roboto', sans-serif", label: 'Roboto' },
  { value: "'Merriweather', serif", label: 'Merriweather' },
  { value: "'Open Sans', sans-serif", label: 'Open Sans' },
  { value: "'Noto Sans SC', sans-serif", label: '思源黑体' },
  { value: "'Noto Serif SC', serif", label: '思源宋体' }
];

const themeOptions = [
  { value: 'light', label: '浅色模式', icon: FiSun },
  { value: 'dark', label: '深色模式', icon: FiMoon },
  { value: 'sepia', label: '护眼模式', icon: FiEye },
  { value: 'auto', label: '跟随系统', icon: FiMonitor }
];

const layoutOptions = [
  { value: 'stack', label: '堆叠布局', description: '内容和功能区域垂直堆叠，适合高集中度阅读。' },
  { value: 'split', label: '分屏布局', description: '内容和功能区域水平分屏，适合同时查看参考资料。' },
  { value: 'grid', label: '网格布局', description: '多内容区域网格排列，适合比较和对照学习。' }
];

interface EnhancedCustomLayoutManagerProps {
  onSettingsChange?: (settings: LayoutSettings) => void;
  containerRef?: React.RefObject<HTMLElement>;
}

export default function EnhancedCustomLayoutManager({
  onSettingsChange,
  containerRef
}: EnhancedCustomLayoutManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'appearance' | 'layout' | 'interaction'>('appearance');
  const [settings, setSettings] = useLocalStorage<LayoutSettings>('learningLayoutSettings', defaultSettings);
  const [previewMode, setPreviewMode] = useState(false);
  const [showQuickSettings, setShowQuickSettings] = useState(false);

  // 监听设置变化并通知父组件
  useEffect(() => {
    if (onSettingsChange) {
      onSettingsChange(settings);
    }
    
    // 直接应用一些样式到容器元素
    if (containerRef?.current) {
      const container = containerRef.current;
      
      // 应用字体大小
      container.style.fontSize = `${settings.fontSize}px`;
      
      // 应用行高
      container.style.lineHeight = `${settings.lineHeight}`;
      
      // 应用字体
      container.style.fontFamily = settings.fontFamily;
      
      // 应用段落间距
      const paragraphs = container.querySelectorAll('p');
      paragraphs.forEach(p => {
        p.style.marginBottom = `${settings.paragraphSpacing}rem`;
      });
      
      // 应用内容宽度
      const contentElements = container.querySelectorAll('.content-container');
      contentElements.forEach(el => {
        (el as HTMLElement).style.maxWidth = `${settings.contentWidth}%`;
      });
    }
  }, [settings, onSettingsChange, containerRef]);
  
  // 应用主题设置
  useEffect(() => {
    const htmlElement = document.documentElement;
    
    // 移除所有主题类
    htmlElement.classList.remove('theme-light', 'theme-dark', 'theme-sepia');
    
    // 应用新主题
    if (settings.theme === 'auto') {
      // 基于系统偏好设置主题
      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      htmlElement.classList.add(prefersDarkMode ? 'theme-dark' : 'theme-light');
    } else {
      htmlElement.classList.add(`theme-${settings.theme}`);
    }
  }, [settings.theme]);

  // 更新单个设置
  const updateSetting = <K extends keyof LayoutSettings>(key: K, value: LayoutSettings[K]) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  // 重置为默认设置
  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  // 快捷设置按钮
  const QuickSettingsButton = () => (
    <button
      onClick={() => setShowQuickSettings(!showQuickSettings)}
      className="fixed bottom-16 right-4 z-40 rounded-full bg-blue-600 p-3 text-white shadow-lg hover:bg-blue-700 transition-colors"
      aria-label="快速设置"
      title="快速设置"
    >
      <FiSliders className="h-5 w-5" />
    </button>
  );

  // 快捷设置面板
  const QuickSettingsPanel = () => {
    if (!showQuickSettings) return null;
    
    return (
      <div className="fixed bottom-28 right-4 z-40 w-64 rounded-lg bg-gray-800 p-4 shadow-xl">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-medium text-white">快速设置</h3>
          <button 
            onClick={() => setShowQuickSettings(false)}
            className="text-gray-400 hover:text-white"
          >
            <FiX className="h-4 w-4" />
          </button>
        </div>
        
        <div className="space-y-3">
          {/* 字体大小 */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-300">字体大小</span>
            <div className="flex items-center">
              <button 
                onClick={() => updateSetting('fontSize', Math.max(12, settings.fontSize - 1))}
                className="p-1 text-gray-400 hover:text-white"
                disabled={settings.fontSize <= 12}
              >
                <span className="text-sm">A-</span>
              </button>
              <span className="mx-1 text-xs text-gray-300">{settings.fontSize}</span>
              <button 
                onClick={() => updateSetting('fontSize', Math.min(24, settings.fontSize + 1))}
                className="p-1 text-gray-400 hover:text-white"
                disabled={settings.fontSize >= 24}
              >
                <span className="text-sm">A+</span>
              </button>
            </div>
          </div>
          
          {/* 主题切换 */}
          <div className="grid grid-cols-4 gap-1">
            {themeOptions.map(option => (
              <button
                key={option.value}
                onClick={() => updateSetting('theme', option.value as any)}
                className={`p-2 rounded ${
                  settings.theme === option.value 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                } flex flex-col items-center justify-center`}
                title={option.label}
              >
                <option.icon className="h-4 w-4" />
                <span className="text-xs mt-1">{option.label.substring(0, 2)}</span>
              </button>
            ))}
          </div>
          
          {/* 翻译切换 */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-300">显示翻译</span>
            <Switch
              checked={settings.enableTranslationToggle}
              onChange={e => updateSetting('enableTranslationToggle', e.target.checked)}
              size="small"
            />
          </div>
          
          {/* 显示注释 */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-300">显示注释</span>
            <Switch
              checked={settings.showAnnotations}
              onChange={e => updateSetting('showAnnotations', e.target.checked)}
              size="small"
            />
          </div>
          
          {/* 更多设置按钮 */}
          <button
            onClick={() => {
              setIsOpen(true);
              setShowQuickSettings(false);
            }}
            className="w-full mt-2 text-center text-xs text-blue-400 hover:text-blue-300"
          >
            更多设置...
          </button>
        </div>
      </div>
    );
  };

  // 预览窗口
  const SettingsPreview = () => (
    <div className={`bg-${settings.theme === 'dark' ? 'gray-800' : settings.theme === 'sepia' ? 'yellow-50' : 'white'} rounded-lg p-4 mb-4`}>
      <h3 className={`font-${settings.fontFamily} text-${settings.fontSize}px font-medium ${settings.theme === 'dark' ? 'text-white' : 'text-gray-800'}`} style={{ lineHeight: `${settings.lineHeight}` }}>
        设置预览
      </h3>
      <p 
        className={`font-${settings.fontFamily} text-${settings.fontSize}px ${settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`} 
        style={{ 
          lineHeight: `${settings.lineHeight}`, 
          marginBottom: `${settings.paragraphSpacing}rem`
        }}
      >
        这是一段示例文本，用于预览您的布局和外观设置。您可以在这里看到字体大小、行距和段落间距的效果。
      </p>
      <p 
        className={`font-${settings.fontFamily} text-${settings.fontSize}px ${settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`} 
        style={{ 
          lineHeight: `${settings.lineHeight}`,
          marginBottom: `${settings.paragraphSpacing}rem`
        }}
      >
        This is a sample text to preview your layout and appearance settings. You can see the effect of font size, line height and paragraph spacing here.
      </p>
    </div>
  );

  return (
    <>
      <QuickSettingsButton />
      <QuickSettingsPanel />
      
      {/* 设置抽屉 */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-80 max-w-full bg-gray-900 shadow-xl transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          {/* 抽屉头部 */}
          <div className="flex items-center justify-between border-b border-gray-700 px-4 py-3">
            <h2 className="text-lg font-medium text-white">界面设置</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1 text-gray-400 hover:bg-gray-800 hover:text-white"
            >
              <FiX className="h-5 w-5" />
            </button>
          </div>
          
          {/* 标签页切换 */}
          <div className="border-b border-gray-700">
            <div className="flex">
              <button
                onClick={() => setActiveTab('appearance')}
                className={`flex-1 py-2 text-sm font-medium ${
                  activeTab === 'appearance'
                    ? 'border-b-2 border-blue-500 text-blue-500'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                外观
              </button>
              <button
                onClick={() => setActiveTab('layout')}
                className={`flex-1 py-2 text-sm font-medium ${
                  activeTab === 'layout'
                    ? 'border-b-2 border-blue-500 text-blue-500'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                布局
              </button>
              <button
                onClick={() => setActiveTab('interaction')}
                className={`flex-1 py-2 text-sm font-medium ${
                  activeTab === 'interaction'
                    ? 'border-b-2 border-blue-500 text-blue-500'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                交互
              </button>
            </div>
          </div>
          
          {/* 设置内容区 */}
          <div className="flex-grow overflow-y-auto p-4">
            {/* 预览切换 */}
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-gray-300">显示预览</span>
              <Switch
                checked={previewMode}
                onChange={e => setPreviewMode(e.target.checked)}
                size="small"
              />
            </div>
            
            {/* 预览窗口 */}
            {previewMode && <SettingsPreview />}
            
            {/* 外观设置 */}
            {activeTab === 'appearance' && (
              <div className="space-y-6">
                {/* 主题 */}
                <div>
                  <h3 className="mb-2 text-sm font-medium text-white">主题</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {themeOptions.map(option => (
                      <button
                        key={option.value}
                        onClick={() => updateSetting('theme', option.value as any)}
                        className={`flex items-center rounded-md p-2 ${
                          settings.theme === option.value
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        }`}
                      >
                        <option.icon className="mr-2 h-5 w-5" />
                        <span>{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* 字体大小 */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-sm font-medium text-white">字体大小</h3>
                    <span className="text-sm text-gray-400">{settings.fontSize}px</span>
                  </div>
                  <Slider
                    value={settings.fontSize}
                    onChange={(_, value) => updateSetting('fontSize', value as number)}
                    min={12}
                    max={24}
                    step={1}
                    marks
                  />
                  <div className="mt-1 flex justify-between">
                    <span className="text-xs text-gray-500">小</span>
                    <span className="text-xs text-gray-500">大</span>
                  </div>
                </div>
                
                {/* 行高 */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-sm font-medium text-white">行高</h3>
                    <span className="text-sm text-gray-400">{settings.lineHeight.toFixed(1)}</span>
                  </div>
                  <Slider
                    value={settings.lineHeight}
                    onChange={(_, value) => updateSetting('lineHeight', value as number)}
                    min={1}
                    max={2.5}
                    step={0.1}
                  />
                </div>
                
                {/* 段落间距 */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-sm font-medium text-white">段落间距</h3>
                    <span className="text-sm text-gray-400">{settings.paragraphSpacing.toFixed(1)}rem</span>
                  </div>
                  <Slider
                    value={settings.paragraphSpacing}
                    onChange={(_, value) => updateSetting('paragraphSpacing', value as number)}
                    min={1}
                    max={3}
                    step={0.1}
                  />
                </div>
                
                {/* 字体选择 */}
                <div>
                  <h3 className="mb-2 text-sm font-medium text-white">字体</h3>
                  <select
                    value={settings.fontFamily}
                    onChange={e => updateSetting('fontFamily', e.target.value)}
                    className="w-full rounded-md bg-gray-800 px-3 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {fontOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
            
            {/* 布局设置 */}
            {activeTab === 'layout' && (
              <div className="space-y-6">
                {/* 内容宽度 */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-sm font-medium text-white">内容宽度</h3>
                    <span className="text-sm text-gray-400">{settings.contentWidth}%</span>
                  </div>
                  <Slider
                    value={settings.contentWidth}
                    onChange={(_, value) => updateSetting('contentWidth', value as number)}
                    min={50}
                    max={100}
                    step={5}
                  />
                </div>
                
                {/* 布局模式 */}
                <div>
                  <h3 className="mb-2 text-sm font-medium text-white">面板布局</h3>
                  <div className="space-y-2">
                    {layoutOptions.map(option => (
                      <button
                        key={option.value}
                        onClick={() => updateSetting('panelLayout', option.value as any)}
                        className={`flex w-full items-start rounded-md p-2 text-left ${
                          settings.panelLayout === option.value
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        }`}
                      >
                        <FiLayout className="mt-0.5 mr-2 h-5 w-5 flex-shrink-0" />
                        <div>
                          <div className="font-medium">{option.label}</div>
                          <div className="text-xs mt-1">{option.description}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* 侧边栏位置 */}
                <div>
                  <h3 className="mb-2 text-sm font-medium text-white">侧边栏位置</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => updateSetting('sidebarPosition', 'left')}
                      className={`flex-1 rounded-md p-2 ${
                        settings.sidebarPosition === 'left'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      <div className="flex items-center justify-center">
                        <FiAlignLeft className="h-5 w-5" />
                        <span className="ml-2">左侧</span>
                      </div>
                    </button>
                    <button
                      onClick={() => updateSetting('sidebarPosition', 'right')}
                      className={`flex-1 rounded-md p-2 ${
                        settings.sidebarPosition === 'right'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      <div className="flex items-center justify-center">
                        <FiAlignRight className="h-5 w-5" />
                        <span className="ml-2">右侧</span>
                      </div>
                    </button>
                  </div>
                </div>
                
                {/* 显示侧边栏 */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-white">显示侧边栏</h3>
                    <p className="text-xs text-gray-400">切换侧边栏的显示状态</p>
                  </div>
                  <Switch
                    checked={settings.showSidebar}
                    onChange={e => updateSetting('showSidebar', e.target.checked)}
                  />
                </div>
              </div>
            )}
            
            {/* 交互设置 */}
            {activeTab === 'interaction' && (
              <div className="space-y-6">
                {/* 翻译切换 */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-white">启用翻译切换</h3>
                    <p className="text-xs text-gray-400">允许显示/隐藏翻译</p>
                  </div>
                  <Switch
                    checked={settings.enableTranslationToggle}
                    onChange={e => updateSetting('enableTranslationToggle', e.target.checked)}
                  />
                </div>
                
                {/* 显示注释 */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-white">显示注释</h3>
                    <p className="text-xs text-gray-400">显示单词和语法注释</p>
                  </div>
                  <Switch
                    checked={settings.showAnnotations}
                    onChange={e => updateSetting('showAnnotations', e.target.checked)}
                  />
                </div>
                
                {/* 自动发音 */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-white">自动发音</h3>
                    <p className="text-xs text-gray-400">自动朗读选中的单词或句子</p>
                  </div>
                  <Switch
                    checked={settings.autoPronunciation}
                    onChange={e => updateSetting('autoPronunciation', e.target.checked)}
                  />
                </div>
                
                {/* 启用文本高亮 */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-white">启用文本高亮</h3>
                    <p className="text-xs text-gray-400">允许高亮显示重点内容</p>
                  </div>
                  <Switch
                    checked={settings.enableTextHighlight}
                    onChange={e => updateSetting('enableTextHighlight', e.target.checked)}
                  />
                </div>
                
                {/* 减少动画 */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-white">减少动画</h3>
                    <p className="text-xs text-gray-400">减少界面动画效果</p>
                  </div>
                  <Switch
                    checked={settings.reduceAnimations}
                    onChange={e => updateSetting('reduceAnimations', e.target.checked)}
                  />
                </div>
                
                {/* 自动播放音频 */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-white">自动播放音频</h3>
                    <p className="text-xs text-gray-400">自动播放课程音频</p>
                  </div>
                  <Switch
                    checked={settings.autoPlayAudio}
                    onChange={e => updateSetting('autoPlayAudio', e.target.checked)}
                  />
                </div>
              </div>
            )}
          </div>
          
          {/* 底部操作按钮 */}
          <div className="border-t border-gray-700 px-4 py-3">
            <div className="flex justify-between">
              <button
                onClick={resetSettings}
                className="rounded-md bg-gray-700 px-4 py-2 text-sm text-white hover:bg-gray-600"
              >
                恢复默认
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
              >
                完成
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* 设置按钮 */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-40 rounded-full bg-gray-700 p-3 text-white shadow-lg hover:bg-gray-600 transition-colors"
        aria-label="界面设置"
        title="界面设置"
      >
        <FiLayout className="h-5 w-5" />
      </button>
    </>
  );
}

// 修复FiAlignRight未定义的错误
const FiAlignRight = (props: any) => (
  <svg
    stroke="currentColor"
    fill="none"
    strokeWidth="2"
    viewBox="0 0 24 24"
    strokeLinecap="round"
    strokeLinejoin="round"
    height="1em"
    width="1em"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <line x1="21" y1="6" x2="3" y2="6"></line>
    <line x1="21" y1="12" x2="9" y2="12"></line>
    <line x1="21" y1="18" x2="7" y2="18"></line>
  </svg>
); 