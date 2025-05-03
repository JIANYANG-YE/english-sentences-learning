'use client';

import { useState, useEffect } from 'react';
import { 
  FiCheck, FiX, FiTrendingUp, FiTrendingDown, 
  FiAlertCircle, FiAward, FiBarChart2, FiClock,
  FiHelpCircle, FiStar, FiThumbsUp
} from 'react-icons/fi';
import { CircularProgress, LinearProgress } from '@mui/material';

interface FeedbackData {
  correct: boolean;
  score: number;
  message: string;
  detailedFeedback?: {
    pronunciation?: {
      score: number;
      issues?: string[];
    };
    grammar?: {
      score: number;
      issues?: string[];
    };
    vocabulary?: {
      score: number;
      issues?: string[];
    };
    context?: {
      score: number;
      issues?: string[];
    };
  };
  suggestions?: string[];
  correctAnswer?: string;
  learningStreaks?: {
    current: number;
    longest: number;
  };
}

interface PerformanceStats {
  correct: number;
  incorrect: number;
  totalAnswered: number;
  averageScore: number;
  timePerQuestion: number; // 秒
  accuracyTrend: number[]; // 最近5个问题的准确率趋势
  streaks: {
    current: number;
    longest: number;
  };
}

interface EnhancedInteractiveFeedbackProps {
  feedbackData?: FeedbackData;
  performanceStats?: PerformanceStats;
  isLoading?: boolean;
  showDetailed?: boolean;
  onClose?: () => void;
  onNextQuestion?: () => void;
  onShowHint?: () => void;
  onShowExplanation?: () => void;
}

export default function EnhancedInteractiveFeedback({
  feedbackData,
  performanceStats,
  isLoading = false,
  showDetailed = false,
  onClose,
  onNextQuestion,
  onShowHint,
  onShowExplanation
}: EnhancedInteractiveFeedbackProps) {
  const [expanded, setExpanded] = useState(showDetailed);
  const [showStats, setShowStats] = useState(false);
  const [animation, setAnimation] = useState(false);
  
  // 当反馈数据变更时添加动画效果
  useEffect(() => {
    if (feedbackData) {
      setAnimation(true);
      const timer = setTimeout(() => setAnimation(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [feedbackData]);
  
  // 如果没有数据且不在加载状态，则不显示组件
  if (!feedbackData && !isLoading) return null;
  
  // 获取表现等级
  const getPerformanceLevel = (score: number) => {
    if (score >= 90) return { label: '优秀', color: 'text-green-500' };
    if (score >= 80) return { label: '良好', color: 'text-blue-500' };
    if (score >= 70) return { label: '中等', color: 'text-yellow-500' };
    if (score >= 60) return { label: '及格', color: 'text-orange-500' };
    return { label: '需改进', color: 'text-red-500' };
  };
  
  // 获取进度条颜色
  const getProgressColor = (score: number) => {
    if (score >= 90) return 'success';
    if (score >= 70) return 'info';
    if (score >= 60) return 'warning';
    return 'error';
  };
  
  // 获取趋势方向
  const getTrend = (trend: number[] = []) => {
    if (trend.length < 2) return 'neutral';
    
    const lastTwo = trend.slice(-2);
    if (lastTwo[1] > lastTwo[0]) return 'up';
    if (lastTwo[1] < lastTwo[0]) return 'down';
    return 'neutral';
  };
  
  // 统计指标卡
  const StatCard = ({ label, value, icon, trend = 'neutral' }: { label: string, value: string | number, icon: React.ReactNode, trend?: 'up' | 'down' | 'neutral' }) => (
    <div className="bg-gray-800 rounded-lg p-3">
      <div className="flex items-center mb-1">
        <div className="text-blue-400 mr-2">{icon}</div>
        <div className="text-xs text-gray-400">{label}</div>
        
        {trend !== 'neutral' && (
          <div className={`ml-auto ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
            {trend === 'up' ? <FiTrendingUp size={14} /> : <FiTrendingDown size={14} />}
          </div>
        )}
      </div>
      <div className="text-lg font-semibold text-white">{value}</div>
    </div>
  );
  
  // 准确率图表
  const AccuracyTrendChart = ({ data = [] }: { data: number[] }) => {
    const maxHeight = 40;
    
    return (
      <div className="flex items-end h-10 mt-2 space-x-1">
        {data.map((value, index) => {
          const height = Math.max(4, (value / 100) * maxHeight);
          
          return (
            <div 
              key={index} 
              className="flex-1 bg-blue-600 rounded-t transition-all duration-300 animate-grow"
              style={{
                height: `${height}px`,
                opacity: 0.5 + (index / (data.length * 2))
              }}
              title={`${value}%`}
            />
          );
        })}
      </div>
    );
  };
  
  // 加载中状态
  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-lg p-4 text-white animate-pulse">
        <div className="flex justify-center items-center py-4">
          <CircularProgress size={40} />
          <span className="ml-4 text-lg">正在分析你的回答...</span>
        </div>
      </div>
    );
  }
  
  if (!feedbackData) return null;
  
  const {
    correct,
    score,
    message,
    detailedFeedback,
    suggestions,
    correctAnswer,
    learningStreaks
  } = feedbackData;
  
  // 获取表现等级信息
  const performanceLevel = getPerformanceLevel(score);
  
  return (
    <div
      className={`bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-all ${
        animation ? 'scale-102 ring-2 ring-blue-500' : ''
      }`}
    >
      {/* 顶部状态栏 */}
      <div className={`py-1 px-3 ${correct ? 'bg-green-600' : 'bg-red-600'} flex items-center justify-between`}>
        <div className="flex items-center">
          {correct ? (
            <FiCheck className="text-white mr-2" />
          ) : (
            <FiX className="text-white mr-2" />
          )}
          <span className="text-white text-sm font-medium">
            {correct ? '回答正确' : '回答错误'}
          </span>
        </div>
        <div className="flex text-white text-xs space-x-2">
          {learningStreaks && (
            <div className="flex items-center">
              <FiTrendingUp className="mr-1" />
              <span>连续: {learningStreaks.current}</span>
            </div>
          )}
          <div className={`px-2 py-0.5 rounded-full ${performanceLevel.color === 'text-green-500' ? 'bg-green-800' : performanceLevel.color === 'text-blue-500' ? 'bg-blue-800' : performanceLevel.color === 'text-yellow-500' ? 'bg-yellow-800' : performanceLevel.color === 'text-orange-500' ? 'bg-orange-800' : 'bg-red-800'}`}>
            {score}分
          </div>
        </div>
      </div>
      
      {/* 主要反馈内容 */}
      <div className="p-4">
        {/* 反馈消息 */}
        <div className="mb-4">
          <div className="flex items-start">
            <div className={`p-1.5 rounded-full ${correct ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'} mr-3`}>
              {correct ? (
                <FiCheck className="w-5 h-5" />
              ) : (
                <FiX className="w-5 h-5" />
              )}
            </div>
            <div>
              <p className="text-white font-medium">{message}</p>
              {!correct && correctAnswer && (
                <div className="mt-2 bg-gray-700 p-2 rounded text-gray-300">
                  <p className="text-xs text-gray-400 mb-1">正确答案:</p>
                  <p>{correctAnswer}</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* 评分条 */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-gray-400">综合评分</span>
            <div className="flex items-center">
              <span className={`text-sm font-medium ${performanceLevel.color}`}>
                {performanceLevel.label}
              </span>
              <span className="text-xs text-gray-400 ml-2">{score}/100</span>
            </div>
          </div>
          <LinearProgress
            variant="determinate"
            value={score}
            color={getProgressColor(score) as any}
            sx={{ height: 8, borderRadius: 4 }}
          />
        </div>
        
        {/* 切换详细反馈 */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center justify-between w-full py-2 px-3 bg-gray-700 hover:bg-gray-650 rounded text-gray-300 text-sm transition-colors mb-3"
        >
          <span>{expanded ? '隐藏详细反馈' : '查看详细反馈'}</span>
          <svg 
            className={`w-5 h-5 transition-transform ${expanded ? 'rotate-180' : ''}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {/* 详细反馈 */}
        {expanded && detailedFeedback && (
          <div className="my-4 space-y-4 animate-fadeIn">
            {/* 各项评分 */}
            <div className="grid grid-cols-2 gap-2">
              {detailedFeedback.pronunciation && (
                <div className="bg-gray-700 rounded p-3">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-300">发音</span>
                    <span className="text-sm font-medium text-white">{detailedFeedback.pronunciation.score}/100</span>
                  </div>
                  <LinearProgress
                    variant="determinate"
                    value={detailedFeedback.pronunciation.score}
                    color={getProgressColor(detailedFeedback.pronunciation.score) as any}
                    sx={{ height: 6, borderRadius: 3, mb: 1 }}
                  />
                  {detailedFeedback.pronunciation.issues && detailedFeedback.pronunciation.issues.length > 0 && (
                    <ul className="mt-2 text-xs text-gray-400 space-y-1">
                      {detailedFeedback.pronunciation.issues.map((issue, i) => (
                        <li key={i} className="flex items-start">
                          <FiAlertCircle className="text-yellow-500 mt-0.5 mr-1 flex-shrink-0" />
                          <span>{issue}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
              
              {detailedFeedback.grammar && (
                <div className="bg-gray-700 rounded p-3">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-300">语法</span>
                    <span className="text-sm font-medium text-white">{detailedFeedback.grammar.score}/100</span>
                  </div>
                  <LinearProgress
                    variant="determinate"
                    value={detailedFeedback.grammar.score}
                    color={getProgressColor(detailedFeedback.grammar.score) as any}
                    sx={{ height: 6, borderRadius: 3, mb: 1 }}
                  />
                  {detailedFeedback.grammar.issues && detailedFeedback.grammar.issues.length > 0 && (
                    <ul className="mt-2 text-xs text-gray-400 space-y-1">
                      {detailedFeedback.grammar.issues.map((issue, i) => (
                        <li key={i} className="flex items-start">
                          <FiAlertCircle className="text-yellow-500 mt-0.5 mr-1 flex-shrink-0" />
                          <span>{issue}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
              
              {detailedFeedback.vocabulary && (
                <div className="bg-gray-700 rounded p-3">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-300">词汇</span>
                    <span className="text-sm font-medium text-white">{detailedFeedback.vocabulary.score}/100</span>
                  </div>
                  <LinearProgress
                    variant="determinate"
                    value={detailedFeedback.vocabulary.score}
                    color={getProgressColor(detailedFeedback.vocabulary.score) as any}
                    sx={{ height: 6, borderRadius: 3, mb: 1 }}
                  />
                  {detailedFeedback.vocabulary.issues && detailedFeedback.vocabulary.issues.length > 0 && (
                    <ul className="mt-2 text-xs text-gray-400 space-y-1">
                      {detailedFeedback.vocabulary.issues.map((issue, i) => (
                        <li key={i} className="flex items-start">
                          <FiAlertCircle className="text-yellow-500 mt-0.5 mr-1 flex-shrink-0" />
                          <span>{issue}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
              
              {detailedFeedback.context && (
                <div className="bg-gray-700 rounded p-3">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-300">语境</span>
                    <span className="text-sm font-medium text-white">{detailedFeedback.context.score}/100</span>
                  </div>
                  <LinearProgress
                    variant="determinate"
                    value={detailedFeedback.context.score}
                    color={getProgressColor(detailedFeedback.context.score) as any}
                    sx={{ height: 6, borderRadius: 3, mb: 1 }}
                  />
                  {detailedFeedback.context.issues && detailedFeedback.context.issues.length > 0 && (
                    <ul className="mt-2 text-xs text-gray-400 space-y-1">
                      {detailedFeedback.context.issues.map((issue, i) => (
                        <li key={i} className="flex items-start">
                          <FiAlertCircle className="text-yellow-500 mt-0.5 mr-1 flex-shrink-0" />
                          <span>{issue}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
            
            {/* 建议 */}
            {suggestions && suggestions.length > 0 && (
              <div className="bg-blue-900/30 border border-blue-800 rounded-lg p-3">
                <h3 className="text-sm font-medium text-blue-400 mb-2 flex items-center">
                  <FiHelpCircle className="mr-2" />
                  学习建议
                </h3>
                <ul className="space-y-2">
                  {suggestions.map((suggestion, i) => (
                    <li key={i} className="flex items-start text-gray-300 text-sm">
                      <div className="text-blue-400 mr-2 pt-0.5">
                        <FiThumbsUp className="w-4 h-4" />
                      </div>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
        
        {/* 学习数据按钮 */}
        {performanceStats && (
          <button
            onClick={() => setShowStats(!showStats)}
            className="flex items-center justify-between w-full py-2 px-3 bg-gray-700 hover:bg-gray-650 rounded text-gray-300 text-sm transition-colors mb-4"
          >
            <span>{showStats ? '隐藏学习数据' : '查看学习数据'}</span>
            <svg 
              className={`w-5 h-5 transition-transform ${showStats ? 'rotate-180' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}
        
        {/* 统计数据 */}
        {showStats && performanceStats && (
          <div className="animate-fadeIn my-4">
            <div className="grid grid-cols-2 gap-3">
              <StatCard 
                label="正确率" 
                value={`${Math.round((performanceStats.correct / performanceStats.totalAnswered) * 100)}%`}
                icon={<FiBarChart2 />}
                trend={getTrend(performanceStats.accuracyTrend)}
              />
              <StatCard 
                label="平均得分" 
                value={performanceStats.averageScore.toFixed(1)}
                icon={<FiStar />}
              />
              <StatCard 
                label="连续正确" 
                value={performanceStats.streaks.current}
                icon={<FiAward />}
              />
              <StatCard 
                label="平均时间" 
                value={`${Math.round(performanceStats.timePerQuestion)}秒`}
                icon={<FiClock />}
              />
            </div>
            
            <div className="mt-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-400">准确率趋势</span>
                <span className="text-xs text-gray-400">最近{performanceStats.accuracyTrend.length}题</span>
              </div>
              <AccuracyTrendChart data={performanceStats.accuracyTrend} />
            </div>
          </div>
        )}
        
        {/* 按钮组 */}
        <div className="flex mt-4 space-x-2 justify-between">
          <div className="space-x-2">
            {onShowHint && (
              <button
                onClick={onShowHint}
                className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded text-sm transition-colors"
              >
                提示
              </button>
            )}
            {onShowExplanation && (
              <button
                onClick={onShowExplanation}
                className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded text-sm transition-colors"
              >
                详解
              </button>
            )}
          </div>
          <div className="space-x-2">
            {onClose && (
              <button
                onClick={onClose}
                className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded text-sm transition-colors"
              >
                关闭
              </button>
            )}
            {onNextQuestion && (
              <button
                onClick={onNextQuestion}
                className={`px-4 py-1.5 ${
                  correct ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
                } text-white rounded text-sm font-medium transition-colors flex items-center`}
              >
                <span>下一题</span>
                <svg className="ml-1 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// 添加必要的CSS动画
const animationStyles = `
  @keyframes grow {
    0% { transform: scaleY(0); }
    100% { transform: scaleY(1); }
  }
  
  @keyframes fadeIn {
    0% { opacity: 0; }
    100% { opacity: 1; }
  }
  
  .animate-grow {
    animation: grow 0.5s ease-out;
    transform-origin: bottom;
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-out;
  }
  
  .scale-102 {
    transform: scale(1.02);
  }
`; 