'use client';

import React from 'react';
import IntegratedLearningDashboard from '@/components/learning/IntegratedLearningDashboard';

interface IntegratedLearningPageProps {
  params: {
    id: string;
    lessonId: string;
  };
}

/**
 * 集成学习页面
 * 
 * 提供整合了混合学习模式、模式熟练度追踪、内容难度可视化和相关知识链接功能的完整学习体验
 */
export default function IntegratedLearningPage({ params }: IntegratedLearningPageProps) {
  const { id: courseId, lessonId } = params;
  
  // 模拟用户ID，实际应用中会从认证系统获取
  const userId = 'user123';
  
  // 处理学习进度保存
  const handleSaveProgress = (progressData: any) => {
    console.log('保存学习进度:', progressData);
    // 实际应用中，这里会将进度数据保存到后端
  };
  
  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">高级学习体验</h1>
        <p className="text-gray-600">
          这是我们的自适应多模态学习平台，提供个性化、全面的英语学习体验。自动根据你的表现调整学习内容和难度。
        </p>
      </div>
      
      <div className="mb-8">
        <IntegratedLearningDashboard
          userId={userId}
          courseId={courseId}
          lessonId={lessonId}
          onSaveProgress={handleSaveProgress}
        />
      </div>
      
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h2 className="text-lg font-semibold text-blue-800 mb-2">学习提示</h2>
        <ul className="list-disc list-inside text-blue-700 space-y-1">
          <li>使用混合学习模式可以更全面地提高你的英语能力</li>
          <li>查看学习统计来了解你的优势和需要提高的领域</li>
          <li>相关知识链接可以帮助你拓展学习内容</li>
          <li>在学习设置中调整学习偏好，获得个性化体验</li>
        </ul>
      </div>
    </div>
  );
} 