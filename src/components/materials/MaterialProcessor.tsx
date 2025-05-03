'use client';

import React, { useState, useEffect } from 'react';
import { MaterialType } from '@/types/materials';
import { FiAlertCircle, FiCheckCircle, FiLoader, FiFileText, FiSettings, FiFilePlus } from 'react-icons/fi';

interface MaterialProcessorProps {
  materialId: string;
  title: string;
  type: string;
  onProcessComplete?: (courseId: string) => void;
}

const MaterialProcessor: React.FC<MaterialProcessorProps> = ({
  materialId,
  title,
  type,
  onProcessComplete
}) => {
  // 各阶段的状态
  const [stage, setStage] = useState<'analyzing' | 'processing' | 'creating' | 'complete' | 'error'>('analyzing');
  const [progress, setProgress] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<{
    paragraphs: number;
    sentences: number;
    english: string[];
    chinese: string[];
    vocabulary: { word: string; translation: string }[];
  } | null>(null);
  const [courseId, setCourseId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // 处理阶段的描述信息
  const stageDescriptions = {
    analyzing: '正在分析文本内容和结构...',
    processing: '正在处理和对齐中英文句子...',
    creating: '正在创建课程和学习内容...',
    complete: '处理完成！课程已成功创建。',
    error: '处理过程中出现错误。'
  };
  
  // 内容处理选项
  const [processingOptions, setProcessingOptions] = useState({
    alignmentMethod: 'hybrid',
    autoTranslate: false,
    generateAudio: false,
    createVocabularyList: true,
    minConfidence: 0.7
  });
  
  // 模拟处理过程
  useEffect(() => {
    const processStages = async () => {
      try {
        // 1. 分析阶段
        setStage('analyzing');
        await simulateProgress(0, 30);
        
        // 模拟分析结果
        const mockAnalysisResult = {
          paragraphs: 12,
          sentences: 65,
          english: ['This is an example sentence.', 'Another example for testing.'],
          chinese: ['这是一个示例句子。', '另一个用于测试的例子。'],
          vocabulary: [
            { word: 'example', translation: '示例' },
            { word: 'sentence', translation: '句子' },
            { word: 'testing', translation: '测试' }
          ]
        };
        setAnalysisResult(mockAnalysisResult);
        
        // 2. 处理阶段：句子对齐等
        setStage('processing');
        await simulateProgress(30, 70);
        
        // 3. 创建课程阶段
        setStage('creating');
        await simulateProgress(70, 100);
        
        // 4. 完成阶段
        setStage('complete');
        
        // 生成课程ID，实际情况下应当从API返回
        const newCourseId = `course-${Date.now()}`;
        setCourseId(newCourseId);
        
        // 处理完成回调
        if (onProcessComplete) {
          onProcessComplete(newCourseId);
        }
      } catch (error) {
        setStage('error');
        setError((error as Error).message || '处理过程中发生未知错误');
      }
    };
    
    processStages();
  }, [materialId, onProcessComplete, processingOptions]);
  
  // 模拟进度条更新
  const simulateProgress = async (from: number, to: number) => {
    const steps = 10;
    const increment = (to - from) / steps;
    
    for (let i = 0; i <= steps; i++) {
      await new Promise(r => setTimeout(r, 300));
      setProgress(Math.min(from + i * increment, 99.9)); // 最多到99.9%直到阶段完全结束
    }
  };
  
  // 实际应用中，这里应该调用API进行实际处理
  const handleProcessWithOptions = async () => {
    try {
      setStage('analyzing');
      setProgress(0);
      
      // 调用分析API
      const response = await fetch('/api/materials/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          materialId,
          options: processingOptions
        }),
      });
      
      if (!response.ok) {
        throw new Error('分析材料失败');
      }
      
      // 获取分析结果
      const result = await response.json();
      setAnalysisResult(result);
      
      // 继续处理阶段
      setStage('processing');
      // ...剩余处理逻辑
    } catch (error) {
      setStage('error');
      setError((error as Error).message || '处理过程中发生未知错误');
    }
  };
  
  // 根据状态渲染图标
  const renderStageIcon = (currentStage: string) => {
    switch (currentStage) {
      case 'analyzing':
      case 'processing':
      case 'creating':
        return <FiLoader className="animate-spin text-blue-500" size={24} />;
      case 'complete':
        return <FiCheckCircle className="text-green-500" size={24} />;
      case 'error':
        return <FiAlertCircle className="text-red-500" size={24} />;
      default:
        return <FiFileText className="text-gray-500" size={24} />;
    }
  };
  
  return (
    <div className="bg-white rounded-lg">
      <div className="mb-4">
        <h3 className="text-lg font-medium">处理材料: {title}</h3>
        <p className="text-sm text-gray-500">类型: {type}</p>
      </div>
      
      {/* 处理状态 */}
      <div className="mb-6">
        <div className="relative pt-1">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                处理进度
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold inline-block text-blue-600">
                {Math.round(progress)}%
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
            <div
              style={{ width: `${progress}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-300"
            ></div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 text-gray-700">
          {renderStageIcon(stage)}
          <span>{stageDescriptions[stage]}</span>
        </div>
        
        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
      </div>
      
      {/* 分析结果 */}
      {analysisResult && stage !== 'error' && (
        <div className="mb-6 p-4 bg-gray-50 rounded-md">
          <h4 className="font-medium mb-2">内容分析结果</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p><span className="font-medium">段落数:</span> {analysisResult.paragraphs}</p>
              <p><span className="font-medium">句子数:</span> {analysisResult.sentences}</p>
              <p><span className="font-medium">生词数:</span> {analysisResult.vocabulary.length}</p>
            </div>
            <div>
              <p><span className="font-medium">语言:</span> 英语 + 中文</p>
              <p><span className="font-medium">英文句子:</span> {analysisResult.english.length}</p>
              <p><span className="font-medium">中文句子:</span> {analysisResult.chinese.length}</p>
            </div>
          </div>
          
          {/* 示例句子预览 */}
          {stage !== 'analyzing' && (
            <div className="mt-4">
              <h5 className="font-medium mb-1">句子对齐预览</h5>
              <div className="bg-white p-3 rounded border border-gray-200 max-h-40 overflow-y-auto">
                {analysisResult.english.slice(0, 2).map((en, i) => (
                  <div key={i} className="mb-2 pb-2 border-b border-gray-100 last:border-0">
                    <p className="text-gray-800">{en}</p>
                    <p className="text-gray-600">{analysisResult.chinese[i] || '未找到对应中文'}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* 处理选项 */}
      {stage === 'analyzing' && (
        <div className="mb-6">
          <div className="flex items-center mb-3">
            <FiSettings className="mr-2" />
            <h4 className="font-medium">处理选项</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                句子对齐方法
              </label>
              <select
                value={processingOptions.alignmentMethod}
                onChange={(e) => setProcessingOptions({
                  ...processingOptions,
                  alignmentMethod: e.target.value
                })}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="length-based">基于长度 (快速)</option>
                <option value="semantic">语义对齐 (准确)</option>
                <option value="hybrid">混合方法 (推荐)</option>
                <option value="neural">神经网络 (高精度)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                最低匹配置信度
              </label>
              <select
                value={processingOptions.minConfidence}
                onChange={(e) => setProcessingOptions({
                  ...processingOptions,
                  minConfidence: parseFloat(e.target.value)
                })}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="0.5">低 (0.5)</option>
                <option value="0.7">中 (0.7)</option>
                <option value="0.9">高 (0.9)</option>
              </select>
            </div>
            
            <div className="flex items-center">
              <input
                id="auto-translate"
                type="checkbox"
                checked={processingOptions.autoTranslate}
                onChange={(e) => setProcessingOptions({
                  ...processingOptions,
                  autoTranslate: e.target.checked
                })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="auto-translate" className="ml-2 block text-sm text-gray-700">
                未匹配句子自动翻译
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                id="generate-audio"
                type="checkbox"
                checked={processingOptions.generateAudio}
                onChange={(e) => setProcessingOptions({
                  ...processingOptions,
                  generateAudio: e.target.checked
                })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="generate-audio" className="ml-2 block text-sm text-gray-700">
                生成语音文件
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                id="create-vocabulary"
                type="checkbox"
                checked={processingOptions.createVocabularyList}
                onChange={(e) => setProcessingOptions({
                  ...processingOptions,
                  createVocabularyList: e.target.checked
                })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="create-vocabulary" className="ml-2 block text-sm text-gray-700">
                创建词汇表
              </label>
            </div>
          </div>
        </div>
      )}
      
      {/* 完成状态 */}
      {stage === 'complete' && courseId && (
        <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-md">
          <div className="flex items-center mb-2">
            <FiCheckCircle className="mr-2" size={20} />
            <h4 className="font-medium">处理完成</h4>
          </div>
          <p>课程ID: {courseId}</p>
          <p>内容已准备就绪，可以开始学习了！</p>
        </div>
      )}
    </div>
  );
};

export default MaterialProcessor; 