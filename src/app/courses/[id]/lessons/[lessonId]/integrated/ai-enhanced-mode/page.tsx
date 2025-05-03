'use client';

import React from 'react';
import AIEnhancedMixedLearningMode from '@/components/learning/AIEnhancedMixedLearningMode';
import { Box, Typography, Paper, Alert } from '@mui/material';
import { Info as InfoIcon } from '@mui/icons-material';

interface AIEnhancedModePageProps {
  params: {
    id: string;
    lessonId: string;
  };
}

/**
 * AI增强混合学习模式页面
 * 
 * 展示结合了真实AI功能的增强型混合学习体验，包括:
 * - 实时语音识别
 * - AI驱动的错误分析
 * - 个性化学习建议
 * - 离线学习支持
 */
export default function AIEnhancedModePage({ params }: AIEnhancedModePageProps) {
  const { id: courseId, lessonId } = params;
  
  // 模拟用户ID，实际应用中会从认证系统获取
  const userId = 'user123';
  
  // 处理学习进度保存
  const handleSaveProgress = (progressData: any) => {
    console.log('保存学习进度:', progressData);
    // 实际应用中，这里会将进度数据保存到后端
  };
  
  return (
    <Box className="container mx-auto p-4">
      <Box className="mb-6">
        <Typography variant="h4" component="h1" className="font-bold mb-2">
          AI增强混合学习模式
        </Typography>
        <Typography variant="body1" color="textSecondary" className="mb-4">
          体验融合了人工智能的全新学习方式，获得更个性化、更智能的语言学习体验
        </Typography>
        
        <Paper elevation={0} className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
          <Box display="flex" alignItems="center" className="mb-2">
            <InfoIcon color="primary" className="mr-2" />
            <Typography variant="h6" color="primary">功能说明</Typography>
          </Box>
          <Box>
            <Typography variant="body2" gutterBottom>
              • <strong>实时语音识别</strong> - 练习口语并获得即时反馈
            </Typography>
            <Typography variant="body2" gutterBottom>
              • <strong>AI错误分析</strong> - 识别学习中的常见错误模式
            </Typography>
            <Typography variant="body2" gutterBottom>
              • <strong>个性化建议</strong> - 获取AI提供的学习建议
            </Typography>
            <Typography variant="body2">
              • <strong>离线支持</strong> - 即使在无网络环境下也能继续学习
            </Typography>
          </Box>
        </Paper>
      </Box>
      
      <Box className="mb-6">
        <AIEnhancedMixedLearningMode
          userId={userId}
          courseId={courseId}
          lessonId={lessonId}
          onSaveProgress={handleSaveProgress}
          apiConfig={{
            openAiApiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
            azureSpeechKey: process.env.NEXT_PUBLIC_AZURE_SPEECH_KEY,
            azureSpeechRegion: process.env.NEXT_PUBLIC_AZURE_SPEECH_REGION
          }}
        />
      </Box>
      
      <Alert severity="info" className="mt-8">
        <Typography variant="subtitle2" gutterBottom>关于AI功能的说明</Typography>
        <Typography variant="body2">
          本页面展示的AI功能目前处于测试阶段。语音识别、错误分析和个性化建议等功能需要连接互联网才能使用。
          在离线模式下，将使用本地缓存的反馈和建议，部分高级功能可能不可用。
        </Typography>
      </Alert>
    </Box>
  );
} 