'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { FaChartLine, FaLightbulb, FaSyncAlt, FaArrowUp, FaArrowDown, FaEquals, FaCog } from 'react-icons/fa';
import { LearningActivityType } from '../../types/learning';

// 导入相关服务和工具
import { AdaptiveLearningService } from '../../services/adaptiveLearningService';

// 难度级别
type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

// 表现指标接口
interface PerformanceMetrics {
  activityType: LearningActivityType;
  timestamp: number;
  accuracyRate: number; // 0-100
  completionTime: number; // 秒
  expectedTime: number; // 秒
  mistakeCount: number;
  hintUsage: number;
  attemptCount: number;
}

// 优化建议接口
interface OptimizationSuggestion {
  activityType: LearningActivityType;
  difficultySuggestion: {
    current: DifficultyLevel;
    recommended: DifficultyLevel;
    reason: string;
  };
  focusAreas: string[];
  timeAllocationSuggestion: {
    activityType: LearningActivityType;
    currentPercentage: number;
    recommendedPercentage: number;
    reason: string;
  }[];
  learningPathSuggestion: string;
}

// 模式分布数据
interface ModeDistributionData {
  activityType: LearningActivityType;
  currentPercentage: number;
  recommendedPercentage: number;
  skillLevel: number;
}

// 组件属性
interface AdaptiveMultimodalLearningOptimizerProps {
  userId: string;
  currentPreferences: {
    activityDistribution: Record<LearningActivityType, number>; // 百分比分布
    difficultyLevel: Record<LearningActivityType, DifficultyLevel>;
    rotationInterval: number;
    enableAdaptiveMode: boolean;
  };
  recentPerformance: PerformanceMetrics[];
  onPreferencesUpdate: (newPreferences: any) => void;
  onRecommendationApply?: (data: any) => void;
}

/**
 * 自适应多模态混合学习模式优化器
 * 
 * 这个组件分析用户的学习数据和表现，提供智能建议来优化学习体验，
 * 包括学习模式分配、难度调整和学习路径建议。
 */
export default function AdaptiveMultimodalLearningOptimizer({
  userId,
  currentPreferences,
  recentPerformance,
  onPreferencesUpdate,
  onRecommendationApply
}: AdaptiveMultimodalLearningOptimizerProps) {
  // 创建学习服务实例
  const adaptiveService = new AdaptiveLearningService();
  
  // 状态
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState<boolean>(false);
  const [suggestions, setSuggestions] = useState<OptimizationSuggestion | null>(null);
  const [modeDistribution, setModeDistribution] = useState<ModeDistributionData[]>([]);
  const [isApplyingChanges, setIsApplyingChanges] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState<'suggestions' | 'distribution' | 'settings'>('suggestions');
  
  // 获取学习者档案和生成建议
  useEffect(() => {
    const generateSuggestions = async () => {
      setIsLoading(true);
      try {
        // 在实际应用中，这里会调用后端API来获取建议
        // 此处为模拟实现
        
        // 获取用户学习档案
        const learnerProfile = adaptiveService.getLearnerProfile(userId);
        
        // 分析最近表现并生成建议
        const suggestion: OptimizationSuggestion = {
          activityType: 'chineseToEnglish', // 当前主要活动类型
          difficultySuggestion: {
            current: currentPreferences.difficultyLevel['chineseToEnglish'],
            recommended: recommendDifficulty(learnerProfile.skillLevels['chineseToEnglish'] || 0),
            reason: '基于你的最近表现，适当提高难度将更有利于学习进步'
          },
          focusAreas: ['口语流利度', '高级词汇', '语法应用'],
          timeAllocationSuggestion: [
            {
              activityType: 'chineseToEnglish',
              currentPercentage: currentPreferences.activityDistribution['chineseToEnglish'] || 0,
              recommendedPercentage: 30,
              reason: '增加中译英的比例来加强表达能力'
            },
            {
              activityType: 'englishToChinese',
              currentPercentage: currentPreferences.activityDistribution['englishToChinese'] || 0,
              recommendedPercentage: 20,
              reason: '保持现有比例以维持理解能力'
            },
            {
              activityType: 'grammar',
              currentPercentage: currentPreferences.activityDistribution['grammar'] || 0,
              recommendedPercentage: 25,
              reason: '增加语法学习以提高准确性'
            },
            {
              activityType: 'listening',
              currentPercentage: currentPreferences.activityDistribution['listening'] || 0,
              recommendedPercentage: 25,
              reason: '听力能力表现良好，可以略微减少比例'
            }
          ],
          learningPathSuggestion: '建议先加强语法基础，然后逐步增加口语和听力练习的难度。'
        };
        
        // 准备模式分布数据
        const distribution: ModeDistributionData[] = Object.entries(currentPreferences.activityDistribution)
          .map(([type, percentage]) => ({
            activityType: type as LearningActivityType,
            currentPercentage: percentage,
            recommendedPercentage: suggestion.timeAllocationSuggestion.find(
              s => s.activityType === type
            )?.recommendedPercentage || percentage,
            skillLevel: learnerProfile.skillLevels[type as LearningActivityType] || 0
          }));
        
        setSuggestions(suggestion);
        setModeDistribution(distribution);
      } catch (error) {
        console.error('生成学习建议时出错:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    generateSuggestions();
  }, [userId, currentPreferences, recentPerformance]);
  
  // 应用建议的学习模式分布
  const applyRecommendedDistribution = useCallback(() => {
    if (!suggestions) return;
    
    setIsApplyingChanges(true);
    
    // 准备新的分布设置
    const newDistribution = { ...currentPreferences.activityDistribution };
    suggestions.timeAllocationSuggestion.forEach(suggestion => {
      newDistribution[suggestion.activityType] = suggestion.recommendedPercentage;
    });
    
    // 更新偏好
    onPreferencesUpdate({
      ...currentPreferences,
      activityDistribution: newDistribution,
      difficultyLevel: {
        ...currentPreferences.difficultyLevel,
        [suggestions.activityType]: suggestions.difficultySuggestion.recommended
      }
    });
    
    setTimeout(() => {
      setIsApplyingChanges(false);
    }, 1000);
  }, [suggestions, currentPreferences, onPreferencesUpdate]);
  
  // 应用自定义设置
  const applyCustomSettings = (settings: any) => {
    setIsApplyingChanges(true);
    onPreferencesUpdate({
      ...currentPreferences,
      ...settings
    });
    setTimeout(() => {
      setIsApplyingChanges(false);
    }, 1000);
  };
  
  // 根据技能水平推荐难度
  const recommendDifficulty = (skillLevel: number): DifficultyLevel => {
    if (skillLevel < 30) {
      return 'beginner';
    } else if (skillLevel < 60) {
      return 'intermediate';
    } else if (skillLevel < 85) {
      return 'advanced';
    } else {
      return 'expert';
    }
  };
  
  // 渲染建议标签页
  const renderSuggestionTab = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      );
    }
    
    if (!suggestions) {
      return (
        <div className="p-4 text-gray-600">
          暂无学习优化建议，请继续学习以获取更多数据。
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        {/* 难度建议 */}
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-medium text-blue-800 mb-2 flex items-center">
            <FaLightbulb className="mr-2" />
            难度调整建议
          </h3>
          <p className="text-blue-700 mb-2">
            {suggestions.difficultySuggestion.reason}
          </p>
          <div className="flex items-center mt-3">
            <span className="text-sm text-gray-600 mr-2">当前难度:</span>
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <div 
                  key={`current-${i}`}
                  className={`w-5 h-5 rounded-full mx-0.5 ${
                    i <= currentPreferences.difficultyLevel[suggestions.activityType] 
                      ? 'bg-blue-500' 
                      : 'bg-gray-200'
                  }`}
                ></div>
              ))}
            </div>
            <span className="mx-4">→</span>
            <span className="text-sm text-gray-600 mr-2">建议难度:</span>
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <div 
                  key={`recommended-${i}`}
                  className={`w-5 h-5 rounded-full mx-0.5 ${
                    i <= suggestions.difficultySuggestion.recommended 
                      ? 'bg-green-500' 
                      : 'bg-gray-200'
                  }`}
                ></div>
              ))}
            </div>
          </div>
        </div>
        
        {/* 重点领域 */}
        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
          <h3 className="font-medium text-purple-800 mb-2 flex items-center">
            <FaLightbulb className="mr-2" />
            建议重点领域
          </h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {suggestions.focusAreas.map((area, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
              >
                {area}
              </span>
            ))}
          </div>
        </div>
        
        {/* 模式分配建议 */}
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <h3 className="font-medium text-green-800 mb-2 flex items-center">
            <FaChartLine className="mr-2" />
            学习模式分配建议
          </h3>
          <div className="space-y-3 mt-3">
            {suggestions.timeAllocationSuggestion.map((allocation, index) => (
              <div key={index} className="flex items-center">
                <div className="w-24 text-sm">
                  {allocation.activityType === 'chineseToEnglish' && '中译英'}
                  {allocation.activityType === 'englishToChinese' && '英译中'}
                  {allocation.activityType === 'grammar' && '语法'}
                  {allocation.activityType === 'listening' && '听力'}
                  {allocation.activityType === 'vocabulary' && '词汇'}
                </div>
                <div className="flex-1 flex items-center">
                  <div className="text-sm w-8 text-right">{allocation.currentPercentage}%</div>
                  <div className="mx-2 flex-1 h-6 bg-gray-200 rounded">
                    <div 
                      className="h-full bg-blue-500 rounded"
                      style={{width: `${allocation.currentPercentage}%`}}
                    ></div>
                  </div>
                  {allocation.recommendedPercentage > allocation.currentPercentage && (
                    <FaArrowUp className="text-green-500 mx-1" />
                  )}
                  {allocation.recommendedPercentage < allocation.currentPercentage && (
                    <FaArrowDown className="text-red-500 mx-1" />
                  )}
                  {allocation.recommendedPercentage === allocation.currentPercentage && (
                    <FaEquals className="text-gray-500 mx-1" />
                  )}
                  <div className="text-sm w-8">{allocation.recommendedPercentage}%</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-sm text-gray-600">
            {suggestions.learningPathSuggestion}
          </div>
          <button
            onClick={applyRecommendedDistribution}
            disabled={isApplyingChanges}
            className={`mt-4 px-4 py-2 rounded ${
              isApplyingChanges 
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {isApplyingChanges ? (
              <span className="flex items-center">
                <FaSyncAlt className="animate-spin mr-1" /> 应用中...
              </span>
            ) : (
              '应用这些建议'
            )}
          </button>
        </div>
      </div>
    );
  };
  
  // 渲染分布标签页
  const renderDistributionTab = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      );
    }
    
    return (
      <div className="space-y-6 p-4">
        <h3 className="font-medium text-gray-700">学习模式分布</h3>
        
        <div className="flex h-64 items-end space-x-8 border-b border-l border-gray-300 relative pb-6 pl-6">
          {modeDistribution.map((mode, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="flex items-end space-x-1">
                {/* 当前分布柱状图 */}
                <div 
                  className="w-12 bg-blue-500 rounded-t"
                  style={{height: `${mode.currentPercentage * 2}px`}}
                ></div>
                
                {/* 推荐分布柱状图 */}
                <div 
                  className="w-12 bg-green-500 rounded-t border-2 border-dashed border-green-700"
                  style={{height: `${mode.recommendedPercentage * 2}px`}}
                ></div>
              </div>
              
              <div className="mt-2 text-sm text-center">
                {mode.activityType === 'chineseToEnglish' && '中译英'}
                {mode.activityType === 'englishToChinese' && '英译中'}
                {mode.activityType === 'grammar' && '语法'}
                {mode.activityType === 'listening' && '听力'}
                {mode.activityType === 'vocabulary' && '词汇'}
              </div>
              
              <div className="text-xs text-gray-500 mt-1">
                熟练度: {mode.skillLevel.toFixed(0)}%
              </div>
            </div>
          ))}
          
          {/* Y轴标签 */}
          <div className="absolute left-0 bottom-0 h-full flex flex-col justify-between">
            {[0, 25, 50, 75, 100].reverse().map((value) => (
              <div key={value} className="flex items-center">
                <span className="text-xs text-gray-500 mr-1">{value}%</span>
                <div className="w-2 h-px bg-gray-300"></div>
              </div>
            ))}
          </div>
          
          {/* 图例 */}
          <div className="absolute right-0 top-0 flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-500 mr-1"></div>
              <span className="text-xs text-gray-600">当前分布</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 border border-dashed border-green-700 mr-1"></div>
              <span className="text-xs text-gray-600">推荐分布</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-4">
            根据你的学习数据和表现，系统推荐的学习模式分布将能更好地提高你的整体英语能力。蓝色柱表示当前分布，绿色柱表示推荐分布。
          </p>
          
          <button
            onClick={applyRecommendedDistribution}
            disabled={isApplyingChanges}
            className={`px-4 py-2 rounded ${
              isApplyingChanges 
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {isApplyingChanges ? (
              <span className="flex items-center">
                <FaSyncAlt className="animate-spin mr-1" /> 应用中...
              </span>
            ) : (
              '应用推荐分布'
            )}
          </button>
        </div>
      </div>
    );
  };
  
  // 渲染设置标签页
  const renderSettingsTab = () => {
    const [rotationInterval, setRotationInterval] = useState(currentPreferences.rotationInterval);
    const [enableAdaptiveMode, setEnableAdaptiveMode] = useState(currentPreferences.enableAdaptiveMode);
    
    const handleSaveSettings = () => {
      applyCustomSettings({
        rotationInterval,
        enableAdaptiveMode
      });
    };
    
    return (
      <div className="space-y-6 p-4">
        <h3 className="font-medium text-gray-700 mb-4">学习模式高级设置</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              模式切换间隔（秒）
            </label>
            <input
              type="range"
              min="30"
              max="180"
              step="15"
              value={rotationInterval}
              onChange={(e) => setRotationInterval(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>30秒</span>
              <span>{rotationInterval}秒</span>
              <span>180秒</span>
            </div>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="adaptiveMode"
              checked={enableAdaptiveMode}
              onChange={(e) => setEnableAdaptiveMode(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="adaptiveMode" className="ml-2 block text-sm text-gray-700">
              启用自适应模式（根据表现自动调整难度和学习内容）
            </label>
          </div>
          
          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={handleSaveSettings}
              disabled={isApplyingChanges}
              className={`px-4 py-2 rounded ${
                isApplyingChanges 
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {isApplyingChanges ? (
                <span className="flex items-center">
                  <FaSyncAlt className="animate-spin mr-1" /> 保存中...
                </span>
              ) : (
                '保存设置'
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
        <h2 className="font-bold text-xl">自适应多模态学习优化器</h2>
        <p className="text-blue-100 text-sm mt-1">
          智能分析你的学习数据，提供个性化的学习模式建议
        </p>
      </div>
      
      {/* 标签页导航 */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setCurrentTab('suggestions')}
          className={`px-4 py-3 text-sm font-medium ${
            currentTab === 'suggestions'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          智能建议
        </button>
        <button
          onClick={() => setCurrentTab('distribution')}
          className={`px-4 py-3 text-sm font-medium ${
            currentTab === 'distribution'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          模式分布
        </button>
        <button
          onClick={() => setCurrentTab('settings')}
          className={`px-4 py-3 text-sm font-medium ${
            currentTab === 'settings'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          高级设置
        </button>
      </div>
      
      {/* 标签页内容 */}
      <div className="p-2">
        {currentTab === 'suggestions' && renderSuggestionTab()}
        {currentTab === 'distribution' && renderDistributionTab()}
        {currentTab === 'settings' && renderSettingsTab()}
      </div>
      
      <div className="bg-gray-50 p-3 text-xs text-gray-500 border-t border-gray-200">
        分析基于最近 {recentPerformance.length} 个学习活动的数据 · 最后更新: {new Date().toLocaleDateString()}
      </div>
    </div>
  );
} 