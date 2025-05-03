'use client';

import { useState, useEffect } from 'react';
import { FiBarChart2, FiPieChart, FiTrendingUp, FiCalendar, FiDownload } from 'react-icons/fi';

/**
 * 内容统计组件
 * 
 * 展示内容数据分析和统计信息
 */
export default function ContentStatistics() {
  // 统计数据
  const [statistics, setStatistics] = useState({
    totalContent: 0,
    categoriesCount: {},
    difficultyDistribution: {},
    popularTopics: [],
    contentCreationTrend: [],
    avgQualityScore: 0
  });
  
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');
  
  // 加载示例数据
  useEffect(() => {
    // 模拟API调用
    setLoading(true);
    
    // 模拟延迟
    setTimeout(() => {
      setStatistics({
        totalContent: 487,
        categoriesCount: {
          '对话': 156,
          '文章': 142,
          '故事': 89,
          '演讲': 72,
          '其他': 28
        },
        difficultyDistribution: {
          '初级': 198,
          '中级': 196,
          '高级': 93
        },
        popularTopics: [
          { name: '商务', count: 87, growth: 12 },
          { name: '日常生活', count: 122, growth: 5 },
          { name: '旅游', count: 76, growth: 8 },
          { name: '科技', count: 92, growth: 15 },
          { name: '学术', count: 52, growth: -3 }
        ],
        contentCreationTrend: [
          { date: '2023-01', count: 32 },
          { date: '2023-02', count: 28 },
          { date: '2023-03', count: 41 },
          { date: '2023-04', count: 35 },
          { date: '2023-05', count: 47 },
          { date: '2023-06', count: 52 },
        ],
        avgQualityScore: 87.4
      });
      
      setLoading(false);
    }, 800);
  }, []);
  
  // 格式化饼图数据
  const formatPieData = (data: Record<string, number>) => {
    return Object.entries(data).map(([name, value]) => ({
      name,
      value
    }));
  };
  
  // 渲染趋势图
  const renderTrendChart = () => {
    const trend = statistics.contentCreationTrend;
    const maxCount = Math.max(...trend.map(item => item.count));
    
    return (
      <div className="mt-2">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          {trend.map(item => (
            <div key={item.date}>{item.date.substring(5)}</div>
          ))}
        </div>
        <div className="flex items-end h-24 space-x-1">
          {trend.map(item => (
            <div 
              key={item.date} 
              className="flex-1 bg-blue-500 rounded-t"
              style={{ 
                height: `${(item.count / maxCount) * 100}%`,
                minHeight: '4px'
              }}
              title={`${item.date}: ${item.count}个内容`}
            ></div>
          ))}
        </div>
      </div>
    );
  };
  
  // 渲染饼图
  const renderPieChart = (data: Record<string, number>, colors: string[]) => {
    const total = Object.values(data).reduce((sum, value) => sum + value, 0);
    let startAngle = 0;
    
    return (
      <div className="relative w-32 h-32 mx-auto">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {Object.entries(data).map(([key, value], index) => {
            const percentage = value / total;
            const endAngle = startAngle + percentage * 360;
            
            // 计算SVG弧形路径
            const startRad = (startAngle - 90) * Math.PI / 180;
            const endRad = (endAngle - 90) * Math.PI / 180;
            
            const x1 = 50 + 50 * Math.cos(startRad);
            const y1 = 50 + 50 * Math.sin(startRad);
            const x2 = 50 + 50 * Math.cos(endRad);
            const y2 = 50 + 50 * Math.sin(endRad);
            
            const largeArcFlag = percentage > 0.5 ? 1 : 0;
            
            const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
            
            const result = (
              <path
                key={key}
                d={pathData}
                fill={colors[index % colors.length]}
                stroke="#fff"
                strokeWidth="1"
              >
                <title>{key}: {value} ({(percentage * 100).toFixed(1)}%)</title>
              </path>
            );
            
            startAngle = endAngle;
            return result;
          })}
        </svg>
      </div>
    );
  };
  
  // 渲染类别图例
  const renderLegend = (data: Record<string, number>, colors: string[]) => {
    return (
      <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
        {Object.entries(data).map(([key, value], index) => (
          <div key={key} className="flex items-center">
            <div 
              className="w-3 h-3 mr-1"
              style={{ backgroundColor: colors[index % colors.length] }}
            ></div>
            <span>{key}: {value}</span>
          </div>
        ))}
      </div>
    );
  };
  
  if (loading) {
    return (
      <div className="text-center p-8">
        <div className="inline-block animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        <p className="mt-2 text-gray-500">加载统计数据...</p>
      </div>
    );
  }
  
  const categoryColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
  const difficultyColors = ['#10b981', '#f59e0b', '#ef4444'];
  
  return (
    <div className="content-statistics">
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-lg font-medium">内容统计</h3>
        
        <button className="px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center">
          <FiDownload className="mr-1" />
          导出报告
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-md p-4">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium flex items-center">
              <FiPieChart className="mr-2 text-blue-500" />
              内容类型分布
            </h4>
            <div className="text-2xl font-bold text-gray-800">
              {statistics.totalContent}
            </div>
          </div>
          
          {renderPieChart(statistics.categoriesCount, categoryColors)}
          {renderLegend(statistics.categoriesCount, categoryColors)}
        </div>
        
        <div className="bg-white border border-gray-200 rounded-md p-4">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium flex items-center">
              <FiBarChart2 className="mr-2 text-green-500" />
              难度分布
            </h4>
            <div className="flex items-center text-sm">
              <div className="px-2 py-1 rounded bg-blue-100 text-blue-800">
                平均质量: {statistics.avgQualityScore}
              </div>
            </div>
          </div>
          
          {renderPieChart(statistics.difficultyDistribution, difficultyColors)}
          {renderLegend(statistics.difficultyDistribution, difficultyColors)}
        </div>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-md p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-medium flex items-center">
            <FiTrendingUp className="mr-2 text-purple-500" />
            内容创建趋势
          </h4>
          
          <div className="flex space-x-1">
            <button
              onClick={() => setPeriod('week')}
              className={`px-2 py-1 text-xs rounded ${
                period === 'week' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
              }`}
            >
              周
            </button>
            <button
              onClick={() => setPeriod('month')}
              className={`px-2 py-1 text-xs rounded ${
                period === 'month' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
              }`}
            >
              月
            </button>
            <button
              onClick={() => setPeriod('year')}
              className={`px-2 py-1 text-xs rounded ${
                period === 'year' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
              }`}
            >
              年
            </button>
          </div>
        </div>
        
        {renderTrendChart()}
      </div>
      
      <div className="bg-white border border-gray-200 rounded-md p-4">
        <h4 className="font-medium flex items-center mb-4">
          <FiCalendar className="mr-2 text-orange-500" />
          热门主题
        </h4>
        
        <div className="space-y-4">
          {statistics.popularTopics.map(topic => (
            <div key={topic.name} className="flex items-center">
              <div className="w-1/3 font-medium">{topic.name}</div>
              <div className="w-2/3">
                <div className="flex items-center">
                  <div className="flex-grow h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full"
                      style={{ 
                        width: `${(topic.count / Math.max(...statistics.popularTopics.map(t => t.count))) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <div className="ml-2 text-sm">
                    {topic.count}
                  </div>
                  <div className={`ml-2 text-xs ${topic.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {topic.growth >= 0 ? '+' : ''}{topic.growth}%
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 