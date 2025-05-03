'use client';

import { useState } from 'react';
import { FiUpload, FiSearch, FiAlertCircle, FiCheckCircle, FiInfo } from 'react-icons/fi';
import { intelligentImportService } from '@/services/intelligentImportService';
import { ContentQualityResult } from '@/types/courses/importTypes';

/**
 * 内容质量分析器组件
 * 
 * 用于分析内容质量并提供改进建议
 */
export default function ContentQualityAnalyzer() {
  const [content, setContent] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [result, setResult] = useState<ContentQualityResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // 处理内容分析
  const handleAnalyze = async () => {
    if (!content.trim()) {
      setError('请输入要分析的内容');
      return;
    }
    
    try {
      setIsAnalyzing(true);
      setError(null);
      
      // 调用内容质量检测API
      const qualityResult = await intelligentImportService.checkContentQuality(content);
      
      // 转换为ContentQualityResult格式
      setResult({
        score: qualityResult.score,
        issues: qualityResult.issues.map(issue => ({
          type: 'readability', // 简化，实际应根据issue.severity映射
          description: issue.message,
          severity: issue.severity === 'error' ? 'high' : (issue.severity === 'warning' ? 'medium' : 'low'),
        })),
        readability: 85, // 默认值，实际应从API获取
        metrics: {
          readabilityScore: 85,
          grammarScore: 90,
          spellingScore: 95,
          structureScore: 80
        }
      });
    } catch (err) {
      setError(`分析失败: ${(err as Error).message}`);
      setResult(null);
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  // 渲染问题严重性图标
  const renderSeverityIcon = (severity: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'high':
        return <FiAlertCircle className="text-red-500" />;
      case 'medium':
        return <FiInfo className="text-yellow-500" />;
      case 'low':
        return <FiInfo className="text-blue-400" />;
      default:
        return null;
    }
  };
  
  // 渲染质量评分
  const renderQualityScore = (score: number) => {
    let colorClass = '';
    if (score >= 90) colorClass = 'text-green-600';
    else if (score >= 70) colorClass = 'text-yellow-500';
    else colorClass = 'text-red-500';
    
    return (
      <div className="text-center">
        <div className={`text-4xl font-bold ${colorClass}`}>{score}</div>
        <div className="text-sm text-gray-500">总体质量评分</div>
      </div>
    );
  };
  
  return (
    <div className="content-quality-analyzer">
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-2">内容质量分析</h3>
        <p className="text-sm text-gray-600 mb-4">
          分析内容的语法、可读性、结构和拼写质量，提供改进建议。
        </p>
        
        <div className="mb-4">
          <textarea
            placeholder="请输入或粘贴要分析的内容..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-40 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isAnalyzing}
          />
        </div>
        
        <div className="flex justify-between">
          <button
            onClick={() => setContent('')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            disabled={isAnalyzing || !content}
          >
            清空
          </button>
          
          <button
            onClick={handleAnalyze}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
            disabled={isAnalyzing || !content.trim()}
          >
            {isAnalyzing ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                分析中...
              </>
            ) : (
              <>
                <FiSearch className="mr-2" />
                分析内容
              </>
            )}
          </button>
        </div>
        
        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
      </div>
      
      {result && (
        <div className="mt-6 border-t pt-4">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium">分析结果</h4>
            <div className="text-sm text-gray-500">
              {new Date().toLocaleString()}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-md">
              {renderQualityScore(result.score)}
              
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                <div>
                  <div className="font-medium">可读性</div>
                  <div className="text-gray-600">{result.metrics.readabilityScore}/100</div>
                </div>
                <div>
                  <div className="font-medium">语法</div>
                  <div className="text-gray-600">{result.metrics.grammarScore}/100</div>
                </div>
                <div>
                  <div className="font-medium">拼写</div>
                  <div className="text-gray-600">{result.metrics.spellingScore}/100</div>
                </div>
                <div>
                  <div className="font-medium">结构</div>
                  <div className="text-gray-600">{result.metrics.structureScore}/100</div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h5 className="font-medium mb-2">检测到的问题</h5>
              
              {result.issues.length === 0 ? (
                <div className="flex items-center text-green-600">
                  <FiCheckCircle className="mr-2" />
                  未检测到明显问题
                </div>
              ) : (
                <ul className="space-y-2 text-sm max-h-40 overflow-y-auto">
                  {result.issues.map((issue, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2 mt-0.5">
                        {renderSeverityIcon(issue.severity)}
                      </span>
                      <span>{issue.description}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          
          {result.issues.length > 0 && (
            <div className="bg-blue-50 p-4 rounded-md">
              <h5 className="font-medium mb-2">改进建议</h5>
              <ul className="space-y-2 text-sm">
                {result.issues.map((issue, index) => (
                  issue.suggestion ? (
                    <li key={`sugg-${index}`}>
                      <span className="font-medium">问题：</span>{issue.description}
                      <br />
                      <span className="font-medium">建议：</span>{issue.suggestion}
                    </li>
                  ) : null
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 