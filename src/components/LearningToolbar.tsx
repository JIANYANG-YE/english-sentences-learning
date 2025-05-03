'use client';

import { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

interface LearningToolbarProps {
  lessonTitle: string;
  currentIndex: number;
  totalItems: number;
  elapsedTime?: number; // 秒数
  onShowContent?: () => void;
  onPause?: () => void;
  onSettings?: () => void;
}

export default function LearningToolbar({
  lessonTitle,
  currentIndex,
  totalItems,
  elapsedTime = 0,
  onShowContent,
  onPause,
  onSettings
}: LearningToolbarProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showToolTip, setShowToolTip] = useState<string | null>(null);
  
  // 格式化时间
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hours > 0 ? `${String(hours).padStart(2, '0')}:` : ''}${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };
  
  // 切换全屏
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`全屏错误: ${err.message}`);
      });
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullScreen(false);
      }
    }
  };
  
  // 切换暂停状态
  const togglePause = () => {
    setIsPaused(!isPaused);
    if (onPause) onPause();
  };
  
  // 显示学习内容
  const handleShowContent = () => {
    if (onShowContent) onShowContent();
  };
  
  // 打开设置对话框
  const openSettings = () => {
    setIsSettingsOpen(true);
    if (onSettings) onSettings();
  };

  return (
    <div className="fixed top-0 right-0 left-0 z-30 bg-gray-900/90 backdrop-blur-sm text-white">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        {/* 左侧信息 */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => window.history.back()}
            className="p-2 rounded-full hover:bg-gray-800 transition-colors"
            onMouseEnter={() => setShowToolTip('返回')}
            onMouseLeave={() => setShowToolTip(null)}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="text-sm font-medium truncate max-w-xs">
            {lessonTitle} ({currentIndex}/{totalItems})
          </div>
        </div>
        
        {/* 右侧工具栏 */}
        <div className="flex items-center space-x-2">
          {/* 设置按钮 */}
          <button
            onClick={openSettings}
            className="p-2 rounded-full hover:bg-gray-800 transition-colors"
            onMouseEnter={() => setShowToolTip('设置')}
            onMouseLeave={() => setShowToolTip(null)}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          
          {/* 笔记按钮 */}
          <button
            className="p-2 rounded-full hover:bg-gray-800 transition-colors"
            onMouseEnter={() => setShowToolTip('笔记')}
            onMouseLeave={() => setShowToolTip(null)}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          
          {/* 分享按钮 */}
          <button
            className="p-2 rounded-full hover:bg-gray-800 transition-colors"
            onMouseEnter={() => setShowToolTip('分享')}
            onMouseLeave={() => setShowToolTip(null)}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>
          
          {/* 游戏按钮 */}
          <button
            className="p-2 rounded-full hover:bg-gray-800 transition-colors"
            onMouseEnter={() => setShowToolTip('游戏模式')}
            onMouseLeave={() => setShowToolTip(null)}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
            </svg>
          </button>
          
          {/* 暂停/继续按钮 */}
          <button
            onClick={togglePause}
            className="p-2 rounded-full hover:bg-gray-800 transition-colors"
            onMouseEnter={() => setShowToolTip(isPaused ? '继续' : '暂停')}
            onMouseLeave={() => setShowToolTip(null)}
          >
            {isPaused ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </button>
          
          {/* 显示内容按钮 */}
          <button
            onClick={handleShowContent}
            className="p-2 rounded-full hover:bg-gray-800 transition-colors"
            onMouseEnter={() => setShowToolTip('查看内容')}
            onMouseLeave={() => setShowToolTip(null)}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </button>
          
          {/* 帮助按钮 */}
          <button
            className="p-2 rounded-full hover:bg-gray-800 transition-colors"
            onMouseEnter={() => setShowToolTip('帮助')}
            onMouseLeave={() => setShowToolTip(null)}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          
          {/* 全屏按钮 */}
          <button
            onClick={toggleFullScreen}
            className="p-2 rounded-full hover:bg-gray-800 transition-colors"
            onMouseEnter={() => setShowToolTip(isFullScreen ? '退出全屏' : '全屏模式')}
            onMouseLeave={() => setShowToolTip(null)}
          >
            {isFullScreen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
              </svg>
            )}
          </button>
        </div>

        {/* 学习时间 */}
        <div className="fixed top-2 right-2">
          <div className="flex items-center bg-gray-800/70 px-2 py-1 rounded-full text-xs font-mono">
            <svg className="w-3 h-3 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {formatTime(elapsedTime)}
          </div>
        </div>
        
        {/* 工具提示 */}
        {showToolTip && (
          <div className="fixed top-12 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded shadow-lg z-50">
            {showToolTip}
          </div>
        )}
      </div>
      
      {/* 设置对话框 */}
      <Transition appear show={isSettingsOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsSettingsOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/80" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-gray-900 p-6 shadow-xl transition-all">
                  <div className="flex justify-between items-center mb-6">
                    <Dialog.Title className="text-xl font-semibold text-white">
                      设置
                    </Dialog.Title>
                    <button
                      type="button"
                      className="text-gray-400 hover:text-white"
                      onClick={() => setIsSettingsOpen(false)}
                    >
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="space-y-6">
                    {/* 设置分类 */}
                    <div className="flex bg-gray-800 rounded-lg overflow-hidden">
                      <button className="flex-1 py-3 px-4 bg-purple-600 text-white text-sm font-medium">
                        声音
                      </button>
                      <button className="flex-1 py-3 px-4 text-gray-300 hover:bg-gray-700 text-sm font-medium">
                        答题
                      </button>
                      <button className="flex-1 py-3 px-4 text-gray-300 hover:bg-gray-700 text-sm font-medium">
                        学习
                      </button>
                      <button className="flex-1 py-3 px-4 text-gray-300 hover:bg-gray-700 text-sm font-medium">
                        外观
                      </button>
                      <button className="flex-1 py-3 px-4 text-gray-300 hover:bg-gray-700 text-sm font-medium">
                        快捷键
                      </button>
                    </div>
                    
                    {/* 声音设置 */}
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-white">音源</h3>
                        <select className="bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                          <option>高级发声人</option>
                          <option>美式发音</option>
                          <option>英式发音</option>
                        </select>
                      </div>
                      
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-white">发音类型</h3>
                        <select className="bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                          <option>美音</option>
                          <option>英音</option>
                        </select>
                      </div>
                      
                      <div className="space-y-4 mt-8">
                        <h3 className="text-base font-medium text-gray-400">声音开关设置</h3>
                        <p className="text-xs text-gray-500">控制各种场景下的声音播放</p>
                        
                        {/* 声音开关选项 */}
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-300">答案页面自动播放声音</span>
                            <div className="relative inline-flex items-center">
                              <input type="checkbox" className="sr-only peer" defaultChecked />
                              <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-purple-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-300">答题时自动播放声音</span>
                            <div className="relative inline-flex items-center">
                              <input type="checkbox" className="sr-only peer" defaultChecked />
                              <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-purple-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-300">打字音效</span>
                            <div className="relative inline-flex items-center">
                              <input type="checkbox" className="sr-only peer" defaultChecked />
                              <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-purple-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-300">打字音效音量</span>
                              <span className="text-sm text-gray-300">100%</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              defaultValue="100"
                              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
                            />
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-300">操作反馈音效</span>
                            <div className="relative inline-flex items-center">
                              <input type="checkbox" className="sr-only peer" defaultChecked />
                              <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-purple-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
} 