'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  LearningActivityType, 
  PerformanceMetrics,
  ModeProficiencyData,
  ContentDifficultyData,
  RelatedKnowledgeItem,
  DifficultyLevel
} from '@/types/learning';
import MixedLearningMode from './modes/MixedLearningMode';
import ModeProficiencyTracker from './ModeProficiencyTracker';
import ContentDifficultyVisualizer from './ContentDifficultyVisualizer';
import RelatedKnowledgeSystem from './RelatedKnowledgeSystem';
import AdaptiveMultimodalLearningOptimizer from './AdaptiveMultimodalLearningOptimizer';
import { AdaptiveLearningService } from '@/services/adaptiveLearningService';

// 组件属性接口
interface IntegratedLearningDashboardProps {
  userId: string;
  courseId?: string;
  lessonId?: string;
  initialContents?: any[]; // 根据实际数据结构调整
  onSaveProgress?: (data: any) => void;
}

/**
 * 集成学习面板
 * 
 * 整合了混合学习模式、模式熟练度追踪、内容难度可视化和相关知识链接功能，
 * 提供更丰富、更全面的学习体验
 */
export default function IntegratedLearningDashboard({
  userId,
  courseId,
  lessonId,
  initialContents = [],
  onSaveProgress
}: IntegratedLearningDashboardProps) {
  const router = useRouter();
  
  // 创建学习服务实例
  const adaptiveService = new AdaptiveLearningService();
  
  // 状态管理
  const [activeTab, setActiveTab] = useState<'learning' | 'stats' | 'knowledge' | 'settings'>('learning');
  const [userPreferences, setUserPreferences] = useState({
    activityDistribution: {
      chineseToEnglish: 30,
      englishToChinese: 25,
      grammar: 25,
      listening: 20,
      vocabulary: 0,
      speaking: 0,
      reading: 0,
      writing: 0
    },
    difficultyLevel: {
      chineseToEnglish: 'intermediate',
      englishToChinese: 'intermediate',
      grammar: 'beginner',
      listening: 'intermediate',
      vocabulary: 'beginner',
      speaking: 'beginner',
      reading: 'intermediate',
      writing: 'beginner'
    },
    rotationInterval: 60,
    enableAdaptiveMode: true
  });
  
  // 用户表现数据
  const [performanceData, setPerformanceData] = useState<PerformanceMetrics[]>([]);
  
  // 相关知识项
  const [relatedKnowledge, setRelatedKnowledge] = useState<RelatedKnowledgeItem[]>([]);
  
  // 学习内容
  const [learningContent, setLearningContent] = useState<any>(null);
  
  // 获取用户配置和表现数据
  useEffect(() => {
    // 获取用户学习档案
    const profile = adaptiveService.getLearnerProfile(userId);
    
    // 更新用户偏好设置
    setUserPreferences(prev => ({
      ...prev,
      difficultyLevel: Object.entries(profile.skillLevels).reduce(
        (obj, [key, value]) => {
          // 根据技能等级设置相应的难度
          let difficulty = 'intermediate'; // 默认intermediate
          if (value < 40) difficulty = 'beginner'; // beginner
          else if (value < 70) difficulty = 'intermediate'; // intermediate
          else difficulty = 'hard'; // hard
          
          return { ...obj, [key]: difficulty };
        }, 
        { ...prev.difficultyLevel }
      ),
      enableAdaptiveMode: profile.adaptiveMode
    }));
    
    // 模拟获取表现数据
    const mockPerformanceData: PerformanceMetrics[] = [
      {
        activityType: 'chineseToEnglish',
        timestamp: Date.now() - 24 * 60 * 60 * 1000,
        accuracyRate: 85,
        completionTime: 45,
        expectedTime: 60,
        mistakeCount: 2,
        hintUsage: 1,
        attemptCount: 1
      },
      {
        activityType: 'englishToChinese',
        timestamp: Date.now() - 48 * 60 * 60 * 1000,
        accuracyRate: 92,
        completionTime: 30,
        expectedTime: 60,
        mistakeCount: 1,
        hintUsage: 0,
        attemptCount: 1
      },
      {
        activityType: 'grammar',
        timestamp: Date.now() - 72 * 60 * 60 * 1000,
        accuracyRate: 78,
        completionTime: 50,
        expectedTime: 45,
        mistakeCount: 3,
        hintUsage: 2,
        attemptCount: 1
      },
      {
        activityType: 'listening',
        timestamp: Date.now() - 96 * 60 * 60 * 1000,
        accuracyRate: 80,
        completionTime: 55,
        expectedTime: 50,
        mistakeCount: 2,
        hintUsage: 1,
        attemptCount: 2
      }
    ];
    
    setPerformanceData(mockPerformanceData);
    
    // 模拟获取相关知识项
    const mockRelatedKnowledge: RelatedKnowledgeItem[] = [
      {
        id: '1',
        title: '基础英语语法规则',
        type: 'grammar',
        relevanceScore: 90,
        description: '英语语法的基本规则和结构',
        link: '/courses/grammar-basics'
      },
      {
        id: '2',
        title: '常用英语口语表达',
        type: 'speaking',
        relevanceScore: 85,
        description: '日常生活中常用的英语口语表达方式',
        link: '/courses/daily-conversations'
      },
      {
        id: '3',
        title: '英语听力技巧',
        type: 'listening',
        relevanceScore: 75,
        description: '提高英语听力理解能力的技巧和方法',
        link: '/courses/listening-skills'
      }
    ];
    
    setRelatedKnowledge(mockRelatedKnowledge);
    
    // 模拟获取学习内容
    if (courseId && lessonId) {
      // 在实际应用中，这里会从API获取课程内容
      setLearningContent({
        id: lessonId,
        title: '综合英语练习',
        sentencePairs: [
          {
            id: '1',
            chinese: '这是一个非常重要的问题。',
            english: 'This is a very important question.',
            grammar: {
              structure: 'Subject + Verb + Object',
              explanation: '这是一个简单的陈述句，使用了系动词"is"连接主语和表语。'
            },
            audioUrl: '/audio/sentence1.mp3'
          },
          {
            id: '2',
            chinese: '我们应该认真考虑这个问题。',
            english: 'We should consider this issue seriously.',
            grammar: {
              structure: 'Subject + Modal Verb + Main Verb + Object + Adverb',
              explanation: '这个句子使用了情态动词"should"表示建议或义务。'
            },
            audioUrl: '/audio/sentence2.mp3'
          },
          {
            id: '3',
            chinese: '如果你努力学习，你将会成功。',
            english: 'If you study hard, you will succeed.',
            grammar: {
              structure: 'Conditional Clause (If + Subject + Verb) + Main Clause (Subject + Will + Verb)',
              explanation: '这是一个条件句，使用"if"引导条件从句，主句使用"will"表示将来的结果。'
            },
            audioUrl: '/audio/sentence3.mp3'
          }
        ]
      });
    }
  }, [userId, courseId, lessonId]);
  
  // 处理用户设置更新
  const handlePreferencesUpdate = (newPreferences: any) => {
    setUserPreferences(prev => ({
      ...prev,
      ...newPreferences
    }));
    
    // 在实际应用中，这里会保存用户设置到后端
    console.log('保存用户设置:', newPreferences);
  };
  
  // 处理学习进度保存
  const handleSaveProgress = (progressData: any) => {
    if (onSaveProgress) {
      onSaveProgress(progressData);
    }
    
    // 转换为性能指标格式
    if (progressData.activityType && progressData.accuracyRate !== undefined) {
      const performanceMetric: PerformanceMetrics = {
        activityType: progressData.activityType,
        timestamp: Date.now(),
        accuracyRate: progressData.accuracyRate,
        completionTime: progressData.completionTime || 60,
        expectedTime: progressData.expectedTime || 60,
        mistakeCount: progressData.mistakeCount || 0,
        hintUsage: progressData.hintUsage || 0,
        attemptCount: progressData.attemptCount || 1
      };
      
      // 更新表现数据
      setPerformanceData(prev => [performanceMetric, ...prev]);
      
      // 更新技能等级
      adaptiveService.updateSkillLevel(
        userId, 
        progressData.activityType, 
        performanceMetric
      );
    }
  };
  
  // 准备模式熟练度数据
  const prepareProficiencyData = (): ModeProficiencyData[] => {
    const profile = adaptiveService.getLearnerProfile(userId);
    
    return [
      {
        modeName: 'chineseToEnglish',
        displayName: '中译英模式',
        currentScore: profile.skillLevels.chineseToEnglish || 0,
        historyScores: [65, 70, 75, 78, profile.skillLevels.chineseToEnglish || 0],
        completedSessions: 15,
        successRate: 78,
        lastPracticeDate: '2023-06-15',
        recommendedNextDate: '2023-06-18',
        color: '#3b82f6'
      },
      {
        modeName: 'englishToChinese',
        displayName: '英译中模式',
        currentScore: profile.skillLevels.englishToChinese || 0,
        historyScores: [70, 75, 80, 82, profile.skillLevels.englishToChinese || 0],
        completedSessions: 18,
        successRate: 85,
        lastPracticeDate: '2023-06-16',
        recommendedNextDate: '2023-06-19',
        color: '#10b981'
      },
      {
        modeName: 'grammar',
        displayName: '语法模式',
        currentScore: profile.skillLevels.grammar || 0,
        historyScores: [50, 55, 60, 62, profile.skillLevels.grammar || 0],
        completedSessions: 10,
        successRate: 65,
        lastPracticeDate: '2023-06-14',
        recommendedNextDate: '2023-06-17',
        color: '#8b5cf6'
      },
      {
        modeName: 'listening',
        displayName: '听力模式',
        currentScore: profile.skillLevels.listening || 0,
        historyScores: [60, 65, 70, 72, profile.skillLevels.listening || 0],
        completedSessions: 12,
        successRate: 70,
        lastPracticeDate: '2023-06-13',
        recommendedNextDate: '2023-06-16',
        color: '#f59e0b'
      }
    ];
  };
  
  // 准备难度分布数据
  const prepareDifficultyData = (): ContentDifficultyData[] => {
    return [
      { 
        name: '入门级', 
        value: 20, 
        color: '#60a5fa', 
        description: '适合初学者的基础内容', 
        examples: ['简单日常用语', '基础词汇'] 
      },
      { 
        name: '初级', 
        value: 30, 
        color: '#34d399', 
        description: '稍有难度的基础内容', 
        examples: ['简单句型', '常用表达'] 
      },
      { 
        name: '中级', 
        value: 25, 
        color: '#fbbf24', 
        description: '有一定挑战性的内容', 
        examples: ['复合句', '正式表达'] 
      },
      { 
        name: '高级', 
        value: 15, 
        color: '#f87171', 
        description: '较为复杂的高级内容', 
        examples: ['复杂句式', '专业词汇'] 
      },
      { 
        name: '专业级', 
        value: 10, 
        color: '#a78bfa', 
        description: '专业水平的高难度内容', 
        examples: ['学术语言', '地道表达'] 
      }
    ];
  };
  
  // 渲染当前活动标签页
  const renderActiveTab = () => {
    switch (activeTab) {
      case 'learning':
        return (
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">混合学习模式</h2>
            <p className="text-gray-600 mb-4">
              混合学习模式将多种学习方式结合在一起，根据你的表现和偏好动态调整内容和难度，为你提供最佳的学习体验。
            </p>
            {learningContent ? (
              <MixedLearningMode
                item={{
                  id: learningContent.id,
                  content: {
                    chineseToEnglish: {
                      prompt: learningContent.sentencePairs[0].chinese,
                      answer: learningContent.sentencePairs[0].english,
                      audioUrl: learningContent.sentencePairs[0].audioUrl
                    },
                    englishToChinese: {
                      prompt: learningContent.sentencePairs[1].english,
                      answer: learningContent.sentencePairs[1].chinese,
                      audioUrl: learningContent.sentencePairs[1].audioUrl
                    },
                    grammar: {
                      prompt: learningContent.sentencePairs[2].english,
                      answer: learningContent.sentencePairs[2].grammar.structure,
                      explanation: learningContent.sentencePairs[2].grammar.explanation
                    },
                    listening: {
                      instructions: "听音频并转写你听到的内容",
                      transcript: learningContent.sentencePairs[0].english,
                      audioUrl: learningContent.sentencePairs[0].audioUrl
                    },
                    activeMode: 'chineseToEnglish',
                    rotationSequence: ['chineseToEnglish', 'englishToChinese', 'grammar', 'listening']
                  }
                }}
                isCompleted={false}
                onComplete={() => handleSaveProgress({
                  activityType: 'chineseToEnglish',
                  accuracyRate: 85,
                  completionTime: 45,
                  expectedTime: 60,
                  mistakeCount: 2,
                  hintUsage: 1,
                  attemptCount: 1
                })}
                onNext={() => console.log('下一条')}
                onPrevious={() => console.log('上一条')}
                isLast={false}
                isFirst={true}
                userPreferences={{
                  autoPlayAudio: true,
                  showTranslation: true,
                  fontSize: 'medium',
                  highlightStyle: 'background',
                  speechRate: 1,
                  mixedModeSettings: {
                    rotationInterval: userPreferences.rotationInterval,
                    enableAutoRotation: userPreferences.enableAdaptiveMode,
                    modeProficiency: {
                      chineseToEnglish: 75,
                      englishToChinese: 80,
                      grammar: 60,
                      listening: 70
                    },
                    adaptiveDifficulty: true
                  }
                }}
                userLevel="intermediate"
              />
            ) : (
              <div className="p-10 text-center text-gray-500">
                加载学习内容中...
              </div>
            )}
          </div>
        );
        
      case 'stats':
        return (
          <div className="p-4 space-y-8">
            <div>
              <h2 className="text-xl font-bold mb-4">学习模式熟练度</h2>
              <p className="text-gray-600 mb-4">
                这里显示了你在各个学习模式下的熟练度水平，帮助你了解自己的学习进展和优势领域。
              </p>
              <ModeProficiencyTracker
                proficiencyData={prepareProficiencyData()}
              />
            </div>
            
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">内容难度分布</h2>
              <p className="text-gray-600 mb-4">
                这里展示了当前课程内容的难度分布情况，帮助你了解学习内容的挑战性。
              </p>
              <ContentDifficultyVisualizer
                difficultyData={prepareDifficultyData()}
                userLevel="intermediate"
              />
            </div>
          </div>
        );
        
      case 'knowledge':
        return (
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">相关知识链接</h2>
            <p className="text-gray-600 mb-4">
              这里展示了与当前学习内容相关的知识点和资源，帮助你拓展学习广度和深度。
            </p>
            <RelatedKnowledgeSystem
              currentKnowledge={{
                id: courseId || '1',
                title: '当前学习内容',
                type: 'lesson'
              }}
              relatedKnowledge={relatedKnowledge}
              onKnowledgeSelect={(item) => {
                console.log('选择了相关知识项:', item);
                if (item.link) {
                  router.push(item.link);
                }
              }}
            />
          </div>
        );
        
      case 'settings':
        return (
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">学习优化设置</h2>
            <p className="text-gray-600 mb-4">
              这里可以调整你的学习偏好设置，定制个性化的学习体验。
            </p>
            <AdaptiveMultimodalLearningOptimizer
              userId={userId}
              currentPreferences={{
                activityDistribution: userPreferences.activityDistribution,
                difficultyLevel: userPreferences.difficultyLevel,
                rotationInterval: userPreferences.rotationInterval,
                enableAdaptiveMode: userPreferences.enableAdaptiveMode
              }}
              recentPerformance={performanceData}
              onPreferencesUpdate={handlePreferencesUpdate}
            />
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* 标签导航 */}
      <div className="bg-gray-100 px-4 py-3 border-b flex flex-wrap">
        <button
          onClick={() => setActiveTab('learning')}
          className={`px-4 py-2 rounded-md mr-2 mb-2 ${
            activeTab === 'learning' 
              ? 'bg-blue-500 text-white' 
              : 'bg-white text-gray-700 hover:bg-gray-200'
          }`}
        >
          学习模式
        </button>
        <button
          onClick={() => setActiveTab('stats')}
          className={`px-4 py-2 rounded-md mr-2 mb-2 ${
            activeTab === 'stats' 
              ? 'bg-blue-500 text-white' 
              : 'bg-white text-gray-700 hover:bg-gray-200'
          }`}
        >
          学习统计
        </button>
        <button
          onClick={() => setActiveTab('knowledge')}
          className={`px-4 py-2 rounded-md mr-2 mb-2 ${
            activeTab === 'knowledge' 
              ? 'bg-blue-500 text-white' 
              : 'bg-white text-gray-700 hover:bg-gray-200'
          }`}
        >
          知识链接
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 rounded-md mb-2 ${
            activeTab === 'settings' 
              ? 'bg-blue-500 text-white' 
              : 'bg-white text-gray-700 hover:bg-gray-200'
          }`}
        >
          学习设置
        </button>
      </div>
      
      {/* 内容区域 */}
      <div className="min-h-[600px]">
        {renderActiveTab()}
      </div>
      
      {/* 页脚信息 */}
      <div className="bg-gray-50 p-3 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {courseId && lessonId ? (
              <span>课程ID: {courseId} | 课时ID: {lessonId}</span>
            ) : (
              <span>通用学习模式</span>
            )}
          </div>
          <div className="text-sm text-gray-500">
            用户ID: {userId} | 最近活动: {performanceData.length}
          </div>
        </div>
      </div>
    </div>
  );
} 