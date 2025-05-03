'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import GrammarAnalysisCard from '@/components/GrammarAnalysisCard';
import ModeNavigation from '@/components/learning/ModeNavigation';

// 模拟的课程数据
const lessonData = {
  id: '101',
  title: '基础英语语法 - 简单句和复合句',
  content: {
    english: 'I enjoy reading books in my free time. When I have time, I often go to the library. The books I read are usually about science or history. English is an interesting language to learn.',
    chinese: '我在空闲时间喜欢阅读书籍。当我有时间时，我经常去图书馆。我阅读的书通常是关于科学或历史的。英语是一门有趣的学习语言。'
  },
  grammarAnalysis: [
    {
      sentence: 'I enjoy reading books in my free time.',
      translation: '我在空闲时间喜欢阅读书籍。',
      grammarPoints: [
        {
          title: '动名词作宾语',
          explanation: '动词"enjoy"后接动名词作宾语，表示"享受做某事"。',
          examples: [
            'She enjoys swimming in the sea.',
            'They enjoy traveling around the world.'
          ]
        },
        {
          title: '介词短语作时间状语',
          explanation: '"in my free time"是介词短语，在句中作时间状语，表示动作发生的时间。',
          examples: [
            'He works in the morning.',
            'We have meetings on Mondays.'
          ]
        }
      ],
      syntaxTree: {
        id: '1',
        text: 'enjoy',
        type: '谓语',
        children: [
          {
            id: '2',
            text: 'I',
            type: '主语',
            children: []
          },
          {
            id: '3',
            text: 'reading',
            type: '宾语',
            children: [
              {
                id: '4',
                text: 'books',
                type: '宾语',
                children: []
              },
              {
                id: '5',
                text: 'in',
                type: '介词',
                children: [
                  {
                    id: '6',
                    text: 'time',
                    type: '介词宾语',
                    children: [
                      {
                        id: '7',
                        text: 'my',
                        type: '定语',
                        children: []
                      },
                      {
                        id: '8',
                        text: 'free',
                        type: '定语',
                        children: []
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            id: '9',
            text: '.',
            type: '标点',
            children: []
          }
        ]
      }
    },
    {
      sentence: 'When I have time, I often go to the library.',
      translation: '当我有时间时，我经常去图书馆。',
      grammarPoints: [
        {
          title: '时间状语从句',
          explanation: '"When I have time"是时间状语从句，引导词when表示"当...时"，引导时间状语从句。',
          examples: [
            'When it rains, people usually stay at home.',
            'I will call you when I arrive.'
          ]
        },
        {
          title: '频率副词',
          explanation: '"often"是频率副词，表示动作发生的频率，通常放在行为动词前面，be动词和助动词后面。',
          examples: [
            'He always comes to class on time.',
            'She is usually busy on weekends.'
          ]
        }
      ],
      syntaxTree: {
        id: '1',
        text: 'go',
        type: '谓语',
        children: [
          {
            id: '2',
            text: 'I',
            type: '主语',
            children: []
          },
          {
            id: '3',
            text: 'often',
            type: '状语',
            children: []
          },
          {
            id: '4',
            text: 'to',
            type: '介词',
            children: [
              {
                id: '5',
                text: 'library',
                type: '介词宾语',
                children: [
                  {
                    id: '6',
                    text: 'the',
                    type: '冠词',
                    children: []
                  }
                ]
              }
            ]
          },
          {
            id: '7',
            text: 'When',
            type: '从属连词',
            children: [
              {
                id: '8',
                text: 'have',
                type: '谓语',
                children: [
                  {
                    id: '9',
                    text: 'I',
                    type: '主语',
                    children: []
                  },
                  {
                    id: '10',
                    text: 'time',
                    type: '宾语',
                    children: []
                  }
                ]
              }
            ]
          },
          {
            id: '11',
            text: ',',
            type: '标点',
            children: []
          },
          {
            id: '12',
            text: '.',
            type: '标点',
            children: []
          }
        ]
      }
    },
    {
      sentence: 'The books I read are usually about science or history.',
      translation: '我阅读的书通常是关于科学或历史的。',
      grammarPoints: [
        {
          title: '定语从句',
          explanation: '"I read"是定语从句，修饰先行词"books"。此处省略了关系代词"that/which"。',
          examples: [
            'The man (who/that) I met yesterday is a doctor.',
            'The movie (which/that) we watched last night was interesting.'
          ]
        },
        {
          title: '并列连词',
          explanation: '"or"是并列连词，连接"science"和"history"两个并列的名词。',
          examples: [
            'Would you like tea or coffee?',
            'She can speak French or German.'
          ]
        }
      ],
      syntaxTree: {
        id: '1',
        text: 'are',
        type: '谓语',
        children: [
          {
            id: '2',
            text: 'books',
            type: '主语',
            children: [
              {
                id: '3',
                text: 'The',
                type: '冠词',
                children: []
              },
              {
                id: '4',
                text: 'read',
                type: '定语',
                children: [
                  {
                    id: '5',
                    text: 'I',
                    type: '主语',
                    children: []
                  }
                ]
              }
            ]
          },
          {
            id: '6',
            text: 'usually',
            type: '状语',
            children: []
          },
          {
            id: '7',
            text: 'about',
            type: '表语',
            children: [
              {
                id: '8',
                text: 'science',
                type: '介词宾语',
                children: []
              },
              {
                id: '9',
                text: 'or',
                type: '连词',
                children: []
              },
              {
                id: '10',
                text: 'history',
                type: '介词宾语',
                children: []
              }
            ]
          },
          {
            id: '11',
            text: '.',
            type: '标点',
            children: []
          }
        ]
      }
    },
    {
      sentence: 'English is an interesting language to learn.',
      translation: '英语是一门有趣的学习语言。',
      grammarPoints: [
        {
          title: '不定式作目的状语',
          explanation: '"to learn"是不定式，在句中作目的状语，表示"用来学习"。',
          examples: [
            'She went to the store to buy some milk.',
            'They arrived early to get good seats.'
          ]
        },
        {
          title: '形容词修饰名词',
          explanation: '"interesting"是形容词，修饰名词"language"。',
          examples: [
            'She has a beautiful voice.',
            'That was a difficult question.'
          ]
        }
      ],
      syntaxTree: {
        id: '1',
        text: 'is',
        type: '谓语',
        children: [
          {
            id: '2',
            text: 'English',
            type: '主语',
            children: []
          },
          {
            id: '3',
            text: 'language',
            type: '表语',
            children: [
              {
                id: '4',
                text: 'an',
                type: '冠词',
                children: []
              },
              {
                id: '5',
                text: 'interesting',
                type: '定语',
                children: []
              },
              {
                id: '6',
                text: 'to',
                type: '定语',
                children: [
                  {
                    id: '7',
                    text: 'learn',
                    type: '动词',
                    children: []
                  }
                ]
              }
            ]
          },
          {
            id: '8',
            text: '.',
            type: '标点',
            children: []
          }
        ]
      }
    }
  ]
};

export default function GrammarModePage() {
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [lesson, setLesson] = useState<typeof lessonData | null>(null);

  useEffect(() => {
    // 模拟加载数据
    setTimeout(() => {
      setLesson(lessonData);
      setLoading(false);
    }, 500);
  }, [params]);

  // 切换到下一个句子
  const goToNextSentence = () => {
    if (lesson && currentSentenceIndex < lesson.grammarAnalysis.length - 1) {
      setCurrentSentenceIndex(currentSentenceIndex + 1);
    }
  };

  // 切换到上一个句子
  const goToPrevSentence = () => {
    if (currentSentenceIndex > 0) {
      setCurrentSentenceIndex(currentSentenceIndex - 1);
    }
  };

  // 计算当前进度百分比
  const progressPercentage = lesson 
    ? ((currentSentenceIndex + 1) / lesson.grammarAnalysis.length) * 100 
    : 0;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">未找到课程数据</h2>
          <p>抱歉，无法加载该课程的语法分析内容。</p>
        </div>
      </div>
    );
  }

  const currentSentence = lesson.grammarAnalysis[currentSentenceIndex];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{lesson.title} - 语法模式</h1>
      
      <div className="mb-8 bg-gray-800 p-4 rounded-lg">
        <h2 className="text-lg font-medium text-white mb-2">课文内容</h2>
        <p className="text-gray-300 mb-2">{lesson.content.english}</p>
        <p className="text-gray-500 text-sm">{lesson.content.chinese}</p>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-500">
            句子 {currentSentenceIndex + 1} / {lesson.grammarAnalysis.length}
          </span>
          <span className="text-sm text-gray-500">
            完成度 {Math.round(progressPercentage)}%
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <div 
            className="bg-blue-500 h-2.5 rounded-full" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
      
      <GrammarAnalysisCard
        sentence={currentSentence.sentence}
        translation={currentSentence.translation}
        grammarPoints={currentSentence.grammarPoints}
        syntaxTree={currentSentence.syntaxTree}
        className="mb-6"
      />
      
      <div className="flex justify-between mt-8">
        <button
          onClick={goToPrevSentence}
          disabled={currentSentenceIndex === 0}
          className={`px-4 py-2 rounded-md text-white font-medium ${
            currentSentenceIndex === 0
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          上一句
        </button>
        
        <button
          onClick={goToNextSentence}
          disabled={currentSentenceIndex === lesson.grammarAnalysis.length - 1}
          className={`px-4 py-2 rounded-md text-white font-medium ${
            currentSentenceIndex === lesson.grammarAnalysis.length - 1
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          下一句
        </button>
      </div>
      
      {/* 学习模式导航 */}
      <ModeNavigation className="pb-safe" />
    </div>
  );
} 