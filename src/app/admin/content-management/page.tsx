'use client';

import { useState } from 'react';
import { Tabs, Tab } from '@mui/material';
import { FiUpload, FiList, FiTag, FiBarChart2, FiSettings } from 'react-icons/fi';
import { BatchImporter } from '@/components/content/BatchImporter';
import EnhancedContentEditor from '@/components/content/EnhancedContentEditor';
import ContentQualityAnalyzer from '@/components/admin/ContentQualityAnalyzer';
import ContentTagManager from '@/components/admin/ContentTagManager';
import ContentStatistics from '@/components/admin/ContentStatistics';
import { ImportJobStatus } from '@/types/courses/importTypes';

/**
 * 内容管理仪表板
 * 集成了内容导入、分析、标签管理等功能
 */
export default function ContentManagementDashboard() {
  const [activeTab, setActiveTab] = useState<string>('import');
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
  };
  
  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">内容管理系统</h1>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center">
            <FiSettings className="mr-2" />
            系统设置
          </button>
        </div>
      </div>
      
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        variant="fullWidth"
        className="mb-6"
      >
        <Tab 
          value="import" 
          label={
            <div className="flex items-center">
              <FiUpload className="mr-2" />
              <span>智能导入</span>
            </div>
          } 
        />
        <Tab 
          value="content" 
          label={
            <div className="flex items-center">
              <FiList className="mr-2" />
              <span>内容管理</span>
            </div>
          } 
        />
        <Tab 
          value="tags" 
          label={
            <div className="flex items-center">
              <FiTag className="mr-2" />
              <span>标签分类</span>
            </div>
          } 
        />
        <Tab 
          value="analytics" 
          label={
            <div className="flex items-center">
              <FiBarChart2 className="mr-2" />
              <span>内容分析</span>
            </div>
          } 
        />
      </Tabs>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        {activeTab === 'import' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">智能内容导入</h2>
            <p className="text-gray-600 mb-6">
              通过批量上传文件、URL或直接输入文本来导入学习内容。系统将自动处理、分析和标记内容。
            </p>
            <BatchImporter 
              onImportComplete={(status: ImportJobStatus) => {
                console.log('导入完成', status);
                // 可以在这里添加导入完成后的处理逻辑
              }}
              onCancel={() => {
                console.log('取消导入');
              }}
            />
          </div>
        )}
        
        {activeTab === 'content' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">内容管理</h2>
            <p className="text-gray-600 mb-6">
              编辑、组织和管理已导入的学习内容，调整内容结构和设置。
            </p>
            <EnhancedContentEditor />
          </div>
        )}
        
        {activeTab === 'tags' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">标签与分类管理</h2>
            <p className="text-gray-600 mb-6">
              创建和管理内容标签，设置分类层级，配置自动标记规则。
            </p>
            <ContentTagManager />
          </div>
        )}
        
        {activeTab === 'analytics' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">内容质量分析</h2>
            <p className="text-gray-600 mb-6">
              分析内容质量，查看学习效果数据，优化内容结构。
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ContentQualityAnalyzer />
              <ContentStatistics />
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 