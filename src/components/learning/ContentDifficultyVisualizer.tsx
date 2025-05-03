import React, { useState } from 'react';
import { 
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Treemap, 
} from 'recharts';
import { FaChartPie, FaChartBar, FaSquare, FaInfoCircle, FaBullseye } from 'react-icons/fa';

// 内容难度数据结构
export interface DifficultyLevelData {
  name: string;         // 难度级别名称
  value: number;        // 该难度内容的数量
  color: string;        // 显示颜色
  description?: string; // 难度级别描述
  examples?: string[];  // 内容示例
}

// 内容类型的难度分布
export interface ContentTypeDistribution {
  name: string;           // 内容类型名称（如词汇、语法、听力等）
  beginner: number;       // 入门级内容数量
  elementary: number;     // 初级内容数量
  intermediate: number;   // 中级内容数量
  advanced: number;       // 高级内容数量
  proficient: number;     // 专业级内容数量
  total: number;          // 该类型总内容数量
}

// 学习进度数据
export interface ProgressData {
  difficultyLevel: string;  // 难度级别
  completed: number;        // 已完成的内容数量
  total: number;            // 该难度级别的总内容数量
}

interface ContentDifficultyVisualizerProps {
  difficultyData: DifficultyLevelData[];
  contentTypeDistribution?: ContentTypeDistribution[];
  progressData?: ProgressData[];
  userLevel?: 'beginner' | 'elementary' | 'intermediate' | 'advanced' | 'proficient';
  onDifficultySelect?: (difficulty: string) => void;
  className?: string;
}

export default function ContentDifficultyVisualizer({
  difficultyData,
  contentTypeDistribution = [],
  progressData = [],
  userLevel = 'intermediate',
  onDifficultySelect,
  className = ''
}: ContentDifficultyVisualizerProps) {
  const [chartType, setChartType] = useState<'pie' | 'bar' | 'treemap'>('pie');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [showDistributionByType, setShowDistributionByType] = useState(false);
  const [showProgress, setShowProgress] = useState(false);

  // 处理难度选择
  const handleDifficultySelect = (difficulty: string) => {
    setSelectedDifficulty(difficulty === selectedDifficulty ? null : difficulty);
    if (onDifficultySelect && difficulty !== selectedDifficulty) {
      onDifficultySelect(difficulty);
    }
  };

  // 获取用户推荐的难度区间
  const getRecommendedDifficulties = (): string[] => {
    const levels = ['beginner', 'elementary', 'intermediate', 'advanced', 'proficient'];
    const userLevelIndex = levels.indexOf(userLevel);
    
    // 为用户推荐当前级别和相邻级别的内容
    const recommendedLevels = [
      levels[Math.max(0, userLevelIndex - 1)], 
      userLevel,
      levels[Math.min(levels.length - 1, userLevelIndex + 1)]
    ];
    
    return [...new Set(recommendedLevels)]; // 去重，防止边界情况
  };

  // 计算总内容量
  const getTotalContent = (): number => {
    return difficultyData.reduce((sum, item) => sum + item.value, 0);
  };

  // 渲染图表
  const renderChart = () => {
    switch (chartType) {
      case 'pie':
        return (
          <div className="h-72 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={difficultyData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {difficultyData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color} 
                      onClick={() => handleDifficultySelect(entry.name)}
                      style={{ cursor: 'pointer', opacity: selectedDifficulty && selectedDifficulty !== entry.name ? 0.5 : 1 }}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`${value} 项内容`, '数量']}
                  labelFormatter={(name) => `难度: ${name}`}
                />
                <Legend onClick={(e) => handleDifficultySelect(e.value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        );
      
      case 'bar':
        return (
          <div className="h-72 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              {showDistributionByType ? (
                <BarChart
                  data={contentTypeDistribution}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="beginner" name="入门级" fill="#8884d8" onClick={(data) => handleDifficultySelect('beginner')} />
                  <Bar dataKey="elementary" name="初级" fill="#82ca9d" onClick={(data) => handleDifficultySelect('elementary')} />
                  <Bar dataKey="intermediate" name="中级" fill="#ffc658" onClick={(data) => handleDifficultySelect('intermediate')} />
                  <Bar dataKey="advanced" name="高级" fill="#ff8042" onClick={(data) => handleDifficultySelect('advanced')} />
                  <Bar dataKey="proficient" name="专业级" fill="#e94430" onClick={(data) => handleDifficultySelect('proficient')} />
                </BarChart>
              ) : (
                <BarChart
                  data={difficultyData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => [`${value} 项内容`, '数量']} />
                  <Bar 
                    dataKey="value" 
                    fill="#8884d8" 
                    onClick={(data) => handleDifficultySelect(data.name)}
                  >
                    {difficultyData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color}
                        style={{ opacity: selectedDifficulty && selectedDifficulty !== entry.name ? 0.5 : 1 }}
                      />
                    ))}
                  </Bar>
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        );
      
      case 'treemap':
        return (
          <div className="h-72 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <Treemap
                data={difficultyData}
                dataKey="value"
                aspectRatio={4/3}
                stroke="#fff"
                fill="#8884d8"
              >
                {difficultyData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    onClick={() => handleDifficultySelect(entry.name)}
                    style={{ cursor: 'pointer', opacity: selectedDifficulty && selectedDifficulty !== entry.name ? 0.5 : 1 }}
                  />
                ))}
              </Treemap>
            </ResponsiveContainer>
          </div>
        );
    }
  };

  // 渲染进度图表
  const renderProgressChart = () => {
    if (!showProgress || progressData.length === 0) return null;
    
    return (
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-2 text-gray-800">难度级别完成进度</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={progressData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="difficultyLevel" />
              <YAxis />
              <Tooltip formatter={(value: number, name) => {
                if (name === 'completed') return [`${value} 项内容`, '已完成'];
                return [`${value} 项内容`, '总数'];
              }} />
              <Legend />
              <Bar dataKey="total" name="总内容数" fill="#8884d8" />
              <Bar dataKey="completed" name="已完成" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  // 渲染选中难度的详细信息
  const renderDifficultyDetails = () => {
    if (!selectedDifficulty) return null;
    
    const difficultyInfo = difficultyData.find(d => d.name === selectedDifficulty);
    if (!difficultyInfo) return null;
    
    return (
      <div className="mt-6 bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium mb-2" style={{ color: difficultyInfo.color }}>{difficultyInfo.name}</h3>
        
        {difficultyInfo.description && (
          <p className="text-gray-700 mb-3">{difficultyInfo.description}</p>
        )}
        
        <div className="flex items-center mb-3">
          <span className="text-gray-600 mr-2">内容数量:</span>
          <span className="font-medium">{difficultyInfo.value} 项</span>
          <span className="text-gray-500 ml-2 text-sm">
            ({((difficultyInfo.value / getTotalContent()) * 100).toFixed(1)}% 的总内容)
          </span>
        </div>
        
        {difficultyInfo.examples && difficultyInfo.examples.length > 0 && (
          <div>
            <h4 className="text-md font-medium mb-2 text-gray-700">内容示例:</h4>
            <ul className="bg-white p-3 rounded-lg list-disc list-inside text-gray-700">
              {difficultyInfo.examples.slice(0, 3).map((example, idx) => (
                <li key={idx} className="mb-1">{example}</li>
              ))}
            </ul>
          </div>
        )}
        
        {getRecommendedDifficulties().includes(selectedDifficulty.toLowerCase()) && (
          <div className="mt-4 bg-blue-50 border-l-4 border-blue-500 p-3">
            <div className="flex">
              <FaBullseye className="text-blue-500 mt-1 mr-2" />
              <div>
                <h4 className="font-medium text-blue-700">推荐级别</h4>
                <p className="text-sm text-blue-600">
                  基于您当前的水平({userLevel})，此难度的内容非常适合您学习。
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // 渲染学习建议
  const renderLearningRecommendations = () => {
    const recommendedLevels = getRecommendedDifficulties();
    const totalRecommendedContent = difficultyData
      .filter(d => recommendedLevels.includes(d.name.toLowerCase()))
      .reduce((sum, item) => sum + item.value, 0);
    
    return (
      <div className="mt-6 bg-indigo-50 p-4 rounded-lg">
        <div className="flex items-center mb-2">
          <FaInfoCircle className="text-indigo-600 mr-2" />
          <h3 className="text-lg font-medium text-indigo-800">学习建议</h3>
        </div>
        
        <p className="text-indigo-700 mb-3">
          基于您当前的水平 <span className="font-medium">{userLevel}</span>，我们推荐您学习以下难度的内容:
        </p>
        
        <div className="bg-white p-3 rounded">
          <div className="flex flex-wrap mb-2">
            {recommendedLevels.map(level => {
              const difficultyInfo = difficultyData.find(d => d.name.toLowerCase() === level);
              return difficultyInfo ? (
                <span 
                  key={level}
                  className="mr-2 mb-2 px-3 py-1 rounded-full text-sm font-medium"
                  style={{ backgroundColor: difficultyInfo.color, color: '#fff' }}
                >
                  {difficultyInfo.name}
                </span>
              ) : null;
            })}
          </div>
          
          <p className="text-gray-700 text-sm">
            这些级别包含了 <span className="font-medium">{totalRecommendedContent}</span> 项内容
            ({((totalRecommendedContent / getTotalContent()) * 100).toFixed(1)}% 的总内容)
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className={`${className}`}>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">内容难度分布</h2>
        
        <div className="flex items-center space-x-3">
          {contentTypeDistribution.length > 0 && (
            <button
              onClick={() => setShowDistributionByType(!showDistributionByType)}
              className={`text-sm px-3 py-1 rounded ${
                showDistributionByType 
                  ? 'bg-indigo-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {showDistributionByType ? '按难度查看' : '按内容类型查看'}
            </button>
          )}
          
          {progressData.length > 0 && (
            <button
              onClick={() => setShowProgress(!showProgress)}
              className={`text-sm px-3 py-1 rounded ${
                showProgress 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {showProgress ? '隐藏进度' : '显示进度'}
            </button>
          )}
          
          <div className="flex border border-gray-300 rounded">
            <button 
              onClick={() => setChartType('pie')}
              className={`px-2 py-1 text-sm ${chartType === 'pie' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
              title="饼图"
            >
              <FaChartPie />
            </button>
            <button 
              onClick={() => setChartType('bar')}
              className={`px-2 py-1 text-sm ${chartType === 'bar' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
              title="柱状图"
            >
              <FaChartBar />
            </button>
            <button 
              onClick={() => setChartType('treemap')}
              className={`px-2 py-1 text-sm ${chartType === 'treemap' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
              title="矩形树图"
            >
              <FaSquare />
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-4 flex items-center justify-between bg-gray-50 p-3 rounded-lg">
        <div className="text-gray-700">
          <span className="font-medium">总内容数量:</span> {getTotalContent()} 项
        </div>
        <div className="text-gray-700">
          <span className="font-medium">您的当前水平:</span> 
          <span className="ml-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
            {userLevel === 'beginner' ? '入门级' : 
             userLevel === 'elementary' ? '初级' :
             userLevel === 'intermediate' ? '中级' :
             userLevel === 'advanced' ? '高级' : '专业级'}
          </span>
        </div>
      </div>
      
      {renderChart()}
      {renderProgressChart()}
      {renderDifficultyDetails()}
      {renderLearningRecommendations()}
    </div>
  );
} 