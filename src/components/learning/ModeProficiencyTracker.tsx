import React, { useState } from 'react';
import { FaChartLine, FaTrophy, FaCalendarAlt, FaCheck, FaClipboardCheck } from 'react-icons/fa';

// 熟练度数据接口
export interface ModeProficiencyData {
  modes: {
    [key: string]: {
      level: number;
      sessionsCompleted: number;
      successRate: number;
    }
  };
  recentProgress: {
    date: string;
    averageScore: number;
  }[];
}

// 组件属性接口
export interface ModeProficiencyTrackerProps {
  proficiencyData: ModeProficiencyData;
  onToggleMode?: (mode: string) => void;
}

export default function ModeProficiencyTracker({
  proficiencyData,
  onToggleMode = () => {}
}: ModeProficiencyTrackerProps) {
  const [activeMode, setActiveMode] = useState<string | null>(null);
  const [showAllModes, setShowAllModes] = useState(true);

  // 处理模式切换
  const handleModeClick = (mode: string) => {
    if (activeMode === mode) {
      setActiveMode(null);
      setShowAllModes(true);
    } else {
      setActiveMode(mode);
      setShowAllModes(false);
      onToggleMode(mode);
    }
  };

  // 获取熟练度级别标签
  const getProficiencyLabel = (level: number): string => {
    if (level >= 4.5) return '精通';
    if (level >= 3.5) return '高级';
    if (level >= 2.5) return '中级';
    if (level >= 1.5) return '初级';
    return '入门';
  };

  // 获取熟练度级别对应的颜色类
  const getProficiencyColorClass = (level: number): string => {
    if (level >= 4.5) return 'bg-purple-500';
    if (level >= 3.5) return 'bg-blue-500';
    if (level >= 2.5) return 'bg-green-500';
    if (level >= 1.5) return 'bg-yellow-500';
    return 'bg-gray-500';
  };

  // 模式名称映射
  const modeNameMap: { [key: string]: string } = {
    chineseToEnglish: '中译英',
    englishToChinese: '英译中',
    grammar: '语法',
    listening: '听力',
    vocabulary: '词汇'
  };

  // 渲染进度图表
  const renderProgressChart = () => {
    // 检查proficiencyData.recentProgress是否存在
    if (!proficiencyData || !proficiencyData.recentProgress || proficiencyData.recentProgress.length === 0) {
      return (
        <div className="bg-white rounded-lg shadow p-4 mt-4">
          <div className="flex items-center mb-4">
            <FaChartLine className="text-blue-500 mr-2" />
            <h3 className="text-lg font-medium">最近学习进度</h3>
          </div>
          <div className="h-64 flex items-center justify-center text-gray-500">
            暂无学习进度数据
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg shadow p-4 mt-4">
        <div className="flex items-center mb-4">
          <FaChartLine className="text-blue-500 mr-2" />
          <h3 className="text-lg font-medium">最近学习进度</h3>
        </div>
        <div className="h-64 relative">
          {proficiencyData.recentProgress.map((entry, index) => {
            const height = (entry.averageScore / 100) * 100;
            const width = `${100 / proficiencyData.recentProgress.length}%`;
            return (
              <div 
                key={index}
                className="absolute bottom-0 flex flex-col items-center justify-end"
                style={{ 
                  height: '100%', 
                  width: width, 
                  left: `${(index / proficiencyData.recentProgress.length) * 100}%` 
                }}
              >
                <div 
                  className="w-full bg-blue-500 rounded-t-sm opacity-80 hover:opacity-100 transition-opacity cursor-pointer relative group"
                  style={{ height: `${height}%` }}
                >
                  <div className="hidden group-hover:block absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded mb-1 whitespace-nowrap">
                    {entry.date}: {entry.averageScore}分
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-1 w-full text-center overflow-hidden text-ellipsis whitespace-nowrap">
                  {entry.date.split('-').pop()}
                </div>
              </div>
            );
          })}
          
          {/* Y轴刻度 */}
          <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500">
            <div>100</div>
            <div>75</div>
            <div>50</div>
            <div>25</div>
            <div>0</div>
          </div>
          
          {/* X轴标签 - 日期 */}
          <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-200"></div>
        </div>
      </div>
    );
  };

  // 渲染模式卡片
  const renderModeCard = (mode: string, data: { level: number; sessionsCompleted: number; successRate: number }) => {
    const progressWidth = `${data.level * 20}%`; // 5个级别，每级20%
    
    return (
      <div 
        key={mode}
        className={`bg-white rounded-lg shadow p-4 cursor-pointer transition-all transform hover:scale-105 ${activeMode === mode ? 'ring-2 ring-blue-500' : ''}`}
        onClick={() => handleModeClick(mode)}
      >
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-medium">{modeNameMap[mode] || mode}</h3>
          <div className={`px-2 py-1 text-xs text-white rounded-full ${getProficiencyColorClass(data.level)}`}>
            {getProficiencyLabel(data.level)}
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>熟练度</span>
            <span>{data.level.toFixed(1)}/5.0</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className={`${getProficiencyColorClass(data.level)} h-2.5 rounded-full`}
              style={{ width: progressWidth }}
            ></div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center">
            <FaCalendarAlt className="text-gray-400 mr-2" />
            <span>{data.sessionsCompleted} 次练习</span>
          </div>
          <div className="flex items-center">
            <FaCheck className="text-gray-400 mr-2" />
            <span>{(data.successRate * 100).toFixed(0)}% 正确率</span>
          </div>
        </div>
      </div>
    );
  };

  // 渲染总体统计
  const renderOverallStats = () => {
    // 检查proficiencyData.modes是否存在
    if (!proficiencyData || !proficiencyData.modes) {
      return (
        <div className="bg-white rounded-lg shadow p-4 mb-4">
          <div className="flex items-center mb-4">
            <FaTrophy className="text-yellow-500 mr-2" />
            <h3 className="text-lg font-medium">总体熟练度</h3>
          </div>
          <div className="p-4 text-center text-gray-500">
            暂无模式熟练度数据
          </div>
        </div>
      );
    }
    
    const modes = Object.keys(proficiencyData.modes);
    // 检查是否有至少一个模式
    if (modes.length === 0) {
      return (
        <div className="bg-white rounded-lg shadow p-4 mb-4">
          <div className="flex items-center mb-4">
            <FaTrophy className="text-yellow-500 mr-2" />
            <h3 className="text-lg font-medium">总体熟练度</h3>
          </div>
          <div className="p-4 text-center text-gray-500">
            暂无学习模式数据
          </div>
        </div>
      );
    }
    
    const avgLevel = modes.reduce((sum, mode) => sum + proficiencyData.modes[mode].level, 0) / modes.length;
    const totalSessions = modes.reduce((sum, mode) => sum + proficiencyData.modes[mode].sessionsCompleted, 0);
    const avgSuccessRate = modes.reduce((sum, mode) => sum + proficiencyData.modes[mode].successRate, 0) / modes.length;
    
    // 找出最强和最弱的模式
    const strongest = modes.reduce((prev, curr) => 
      proficiencyData.modes[curr].level > proficiencyData.modes[prev].level ? curr : prev, modes[0]);
      
    const weakest = modes.reduce((prev, curr) => 
      proficiencyData.modes[curr].level < proficiencyData.modes[prev].level ? curr : prev, modes[0]);
    
    return (
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <div className="flex items-center mb-4">
          <FaTrophy className="text-yellow-500 mr-2" />
          <h3 className="text-lg font-medium">总体熟练度</h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{avgLevel.toFixed(1)}</div>
            <div className="text-sm text-gray-600">平均熟练度</div>
          </div>
          
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{totalSessions}</div>
            <div className="text-sm text-gray-600">总练习次数</div>
          </div>
          
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{(avgSuccessRate * 100).toFixed(0)}%</div>
            <div className="text-sm text-gray-600">平均正确率</div>
          </div>
          
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{modes.length}</div>
            <div className="text-sm text-gray-600">学习模式数</div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 bg-emerald-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">最强模式</div>
            <div className="flex justify-between items-center">
              <div className="font-medium text-emerald-700">{modeNameMap[strongest] || strongest}</div>
              <div className={`px-2 py-0.5 text-xs text-white rounded-full ${getProficiencyColorClass(proficiencyData.modes[strongest].level)}`}>
                {proficiencyData.modes[strongest].level.toFixed(1)}
              </div>
            </div>
          </div>
          
          <div className="p-3 bg-red-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">待提升模式</div>
            <div className="flex justify-between items-center">
              <div className="font-medium text-red-700">{modeNameMap[weakest] || weakest}</div>
              <div className={`px-2 py-0.5 text-xs text-white rounded-full ${getProficiencyColorClass(proficiencyData.modes[weakest].level)}`}>
                {proficiencyData.modes[weakest].level.toFixed(1)}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 渲染改进建议
  const renderImprovementSuggestions = () => {
    // 检查proficiencyData.modes是否存在
    if (!proficiencyData || !proficiencyData.modes) {
      return (
        <div className="bg-white rounded-lg shadow p-4 mt-4">
          <div className="flex items-center mb-4">
            <FaClipboardCheck className="text-green-500 mr-2" />
            <h3 className="text-lg font-medium">改进建议</h3>
          </div>
          <div className="p-4 text-center text-gray-500">
            暂无模式数据，无法生成改进建议
          </div>
        </div>
      );
    }
    
    const modes = Object.keys(proficiencyData.modes);
    if (modes.length === 0) {
      return (
        <div className="bg-white rounded-lg shadow p-4 mt-4">
          <div className="flex items-center mb-4">
            <FaClipboardCheck className="text-green-500 mr-2" />
            <h3 className="text-lg font-medium">改进建议</h3>
          </div>
          <div className="p-4 text-center text-gray-500">
            暂无学习模式数据，无法生成建议
          </div>
        </div>
      );
    }
    
    const weakestMode = modes.reduce((prev, curr) => 
      proficiencyData.modes[curr].level < proficiencyData.modes[prev].level ? curr : prev, modes[0]);
    
    // 根据弱项模式生成建议
    const suggestions = [
      {
        mode: weakestMode,
        title: `增加${modeNameMap[weakestMode] || weakestMode}练习`,
        description: `您在${modeNameMap[weakestMode] || weakestMode}方面的熟练度相对较低，建议每天增加至少15分钟的练习。`
      },
      {
        mode: 'general',
        title: '多元化学习方式',
        description: '尝试结合多种学习模式进行练习，有助于全面提升语言能力。'
      },
      {
        mode: 'review',
        title: '定期复习',
        description: '每周安排一次全面复习，巩固已学知识点，提高记忆效果。'
      }
    ];
    
    return (
      <div className="bg-white rounded-lg shadow p-4 mt-4">
        <div className="flex items-center mb-4">
          <FaClipboardCheck className="text-green-500 mr-2" />
          <h3 className="text-lg font-medium">改进建议</h3>
        </div>
        
        <div className="space-y-3">
          {suggestions.map((suggestion, index) => (
            <div key={index} className="p-3 bg-gray-50 rounded-lg">
              <div className="font-medium text-gray-800 mb-1">{suggestion.title}</div>
              <div className="text-sm text-gray-600">{suggestion.description}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* 总体统计 */}
      {renderOverallStats()}
      
      {/* 模式熟练度卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {showAllModes && proficiencyData && proficiencyData.modes && 
          Object.entries(proficiencyData.modes).map(([mode, data]) => renderModeCard(mode, data))
        }
        
        {!showAllModes && activeMode && proficiencyData && proficiencyData.modes && proficiencyData.modes[activeMode] && 
          renderModeCard(activeMode, proficiencyData.modes[activeMode])
        }
      </div>
      
      {/* 进度图表 */}
      {renderProgressChart()}
      
      {/* 改进建议 */}
      {renderImprovementSuggestions()}
    </div>
  );
} 