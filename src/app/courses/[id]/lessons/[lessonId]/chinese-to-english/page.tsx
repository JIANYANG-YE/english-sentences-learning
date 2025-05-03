'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ModeNavigation from '@/components/learning/ModeNavigation';
import { Lesson } from '@/types/courses';
import EnhancedCustomLayoutManager from '@/components/learning/EnhancedCustomLayoutManager';
import EnhancedInteractiveFeedback from '@/components/learning/EnhancedInteractiveFeedback';

// 修改LessonWithContent接口定义，使其兼容模拟数据
interface LessonWithContent {
  id: string;
  courseId: string;
  title: string;
  subtitle: string;
  order: number;
  duration: number;
  progress: number;
  lastStudied: null | string;
  content: {
    english: string;
    chinese: string;
  };
  // 以下是可选属性，允许与Lesson类型部分兼容
  description?: string;
  exercises?: any[];
  sentenceIds?: string[];
  grammarPoints?: string[];
  isPreview?: boolean;
}

// 修改模拟数据类型
// 模拟课文数据
interface LessonDataType {
  [key: string]: {
    id: string;
    courseId: string;
    title: string;
    subtitle: string;
    order: number;
    duration: number;
    progress: number;
    lastStudied: null;
    content: {
      english: string;
      chinese: string;
    };
  };
}

const lessonData: LessonDataType = {
  '1': {
    id: '1',
    courseId: '1',
    title: '日常问候',
    subtitle: '学习常见英文问候语',
    order: 1,
    duration: 15,
    progress: 0,
    lastStudied: null,
    content: {
      english: 'Hello! How are you today? It\'s nice to meet you. My name is David. I am a student. I study English. English is very useful. I like learning languages. What about you? Do you like studying English?',
      chinese: '你好！今天怎么样？很高兴见到你。我叫大卫。我是一名学生。我学习英语。英语非常有用。我喜欢学习语言。你呢？你喜欢学习英语吗？'
    }
  }
};

// 拆分句子的函数
function splitIntoPairs(englishText: string, chineseText: string) {
  // 简单拆分，实际应用中需要更复杂的句子对齐算法
  const englishSentences = englishText.split(/(?<=[.!?])\s+/);
  const chineseSentences = chineseText.split(/(?<=[。！？])\s*/);
  
  const minLength = Math.min(englishSentences.length, chineseSentences.length);
  
  const pairs = [];
  for (let i = 0; i < minLength; i++) {
    pairs.push({
      english: englishSentences[i].trim(),
      chinese: chineseSentences[i].trim()
    });
  }
  
  return pairs;
}

export default function ChineseToEnglishPage() {
  const params = useParams();
  const router = useRouter();
  const { id: courseId, lessonId } = params;
  const [lesson, setLesson] = useState<LessonWithContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [sentencePairs, setSentencePairs] = useState<Array<{english: string, chinese: string}>>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isAnswerShown, setIsAnswerShown] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [completedSentences, setCompletedSentences] = useState<Set<number>>(new Set());
  const [layoutSettings, setLayoutSettings] = useState<any>({});
  const [feedbackData, setFeedbackData] = useState<any>(null);
  const [performanceStats, setPerformanceStats] = useState<any>({
    correct: 0,
    incorrect: 0,
    totalAnswered: 0,
    averageScore: 0,
    timePerQuestion: 0,
    accuracyTrend: [],
    streaks: { current: 0, longest: 0 }
  });
  const [isCheckingAnswer, setIsCheckingAnswer] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 在实际应用中，这里会从API获取课文数据
    const data = lessonData[lessonId as string];
    if (data && data.courseId === courseId) {
      setLesson(data);
      
      // 拆分句子
      if (data.content) {
        const pairs = splitIntoPairs(data.content.english, data.content.chinese);
        setSentencePairs(pairs);
      }
    } else {
      // 未找到课文或课程不匹配时重定向
      router.push(`/courses/${courseId}`);
    }
    setLoading(false);
  }, [courseId, lessonId, router]);
  
  // 更新布局设置
  const handleLayoutSettingsChange = (settings: any) => {
    setLayoutSettings(settings);
  };
  
  // 检查答案
  const checkAnswer = () => {
    // 简单实现，仅检查是否完全匹配
    // 实际应用中可以使用更智能的比较算法
    setIsCheckingAnswer(true);
    
    // 记录回答时间
    const endTime = Date.now();
    const timeSpent = startTime ? (endTime - startTime) / 1000 : 0;
    
    // 模拟答案检查延迟
    setTimeout(() => {
      const currentSentence = sentencePairs[currentIndex];
      const isMatch = userAnswer.trim().toLowerCase() === currentSentence.english.toLowerCase();
      
      // 更新统计数据
      const newStats = { ...performanceStats };
      if (isMatch) {
        newStats.correct += 1;
        newStats.streaks.current += 1;
        newStats.streaks.longest = Math.max(newStats.streaks.longest, newStats.streaks.current);
      } else {
        newStats.incorrect += 1;
        newStats.streaks.current = 0;
      }
      
      newStats.totalAnswered += 1;
      
      // 计算平均分
      const thisScore = isMatch ? 100 : calculateSimilarityScore(userAnswer, currentSentence.english);
      newStats.averageScore = ((newStats.averageScore * (newStats.totalAnswered - 1)) + thisScore) / newStats.totalAnswered;
      
      // 更新平均时间
      newStats.timePerQuestion = ((newStats.timePerQuestion * (newStats.totalAnswered - 1)) + timeSpent) / newStats.totalAnswered;
      
      // 更新准确率趋势
      const trendScore = isMatch ? 100 : calculateSimilarityScore(userAnswer, currentSentence.english);
      newStats.accuracyTrend.push(trendScore);
      if (newStats.accuracyTrend.length > 5) {
        newStats.accuracyTrend.shift();
      }
      
      setPerformanceStats(newStats);
      
      // 生成反馈数据
      const feedback = generateFeedback(
        isMatch,
        userAnswer,
        currentSentence.english,
        newStats.streaks
      );
      
      setFeedbackData(feedback);
      setIsAnswerShown(true);
      setIsCorrect(isMatch);
      
      if (isMatch) {
        // 添加到已完成句子列表
        const newCompleted = new Set(completedSentences);
        newCompleted.add(currentIndex);
        setCompletedSentences(newCompleted);
      }
      
      setIsCheckingAnswer(false);
    }, 1500);
  };
  
  // 计算相似度评分
  const calculateSimilarityScore = (userInput: string, correctAnswer: string): number => {
    // 简单实现，实际应用中可以使用更复杂的算法
    userInput = userInput.toLowerCase().trim();
    correctAnswer = correctAnswer.toLowerCase().trim();
    
    if (userInput === correctAnswer) return 100;
    if (userInput.length === 0) return 0;
    
    // 检查单词匹配
    const userWords = userInput.split(/\s+/);
    const correctWords = correctAnswer.split(/\s+/);
    
    let matchedWords = 0;
    for (const word of userWords) {
      if (correctWords.includes(word)) {
        matchedWords++;
      }
    }
    
    const wordScore = correctWords.length > 0 
      ? (matchedWords / correctWords.length) * 60 
      : 0;
    
    // 计算字符级别相似度
    let charMatches = 0;
    for (let i = 0; i < Math.min(userInput.length, correctAnswer.length); i++) {
      if (userInput[i] === correctAnswer[i]) {
        charMatches++;
      }
    }
    
    const charScore = correctAnswer.length > 0 
      ? (charMatches / correctAnswer.length) * 40 
      : 0;
    
    return Math.round(wordScore + charScore);
  };
  
  // 生成反馈数据
  const generateFeedback = (
    isCorrect: boolean,
    userInput: string,
    correctAnswer: string,
    streaks: { current: number, longest: number }
  ) => {
    const score = isCorrect ? 100 : calculateSimilarityScore(userInput, correctAnswer);
    
    // 检查语法问题
    const grammarIssues = [];
    if (!isCorrect) {
      // 简单示例，实际应用中需要更复杂的语法分析
      if (userInput.split(/\s+/).length < 3 && correctAnswer.split(/\s+/).length > 4) {
        grammarIssues.push('句子结构不完整');
      }
      
      if (!userInput.match(/[A-Z]/) && correctAnswer.match(/[A-Z]/)) {
        grammarIssues.push('缺少大写字母');
      }
      
      if (!userInput.match(/[.!?]$/) && correctAnswer.match(/[.!?]$/)) {
        grammarIssues.push('缺少标点符号');
      }
    }
    
    // 检查词汇问题
    const vocabIssues = [];
    if (!isCorrect) {
      const userWords = userInput.toLowerCase().split(/\s+/);
      const correctWords = correctAnswer.toLowerCase().split(/\s+/);
      
      const missingImportantWords = correctWords.filter(word => 
        word.length > 3 && !userWords.includes(word)
      );
      
      if (missingImportantWords.length > 0) {
        vocabIssues.push(`缺少关键词: ${missingImportantWords.slice(0, 3).join(', ')}${missingImportantWords.length > 3 ? '...' : ''}`);
      }
    }
    
    // 生成学习建议
    const suggestions = [];
    if (!isCorrect) {
      if (score < 50) {
        suggestions.push('尝试先理解中文句子的核心含义，再用英语表达');
      }
      
      if (grammarIssues.length > 0) {
        suggestions.push('注意英语句子的基本结构和标点符号用法');
      }
      
      if (vocabIssues.length > 0) {
        suggestions.push('复习句子中的关键词汇，确保能够准确使用');
      }
      
      // 添加一个通用的建议
      suggestions.push('多练习类似的句型，提高中译英的流畅度');
    } else if (streaks.current >= 3) {
      suggestions.push('你已经连续答对了多道题目，可以尝试更有挑战性的内容');
    }
    
    return {
      correct: isCorrect,
      score,
      message: isCorrect 
        ? ['太棒了！', '做得好！', '完全正确！', '非常优秀！'][Math.floor(Math.random() * 4)]
        : score > 70 
          ? '接近正确，还需要一点调整'
          : score > 40
            ? '有一些不错的部分，但还需要改进'
            : '需要更多练习，再试一次',
      detailedFeedback: {
        grammar: {
          score: isCorrect ? 100 : Math.max(0, 100 - grammarIssues.length * 25),
          issues: grammarIssues
        },
        vocabulary: {
          score: isCorrect ? 100 : Math.max(0, 100 - vocabIssues.length * 20),
          issues: vocabIssues
        },
        context: {
          score: isCorrect ? 100 : Math.min(100, score + 20),
          issues: isCorrect ? [] : ['确保你的翻译完整表达了原句的意思']
        }
      },
      suggestions,
      correctAnswer: isCorrect ? undefined : correctAnswer,
      learningStreaks: streaks
    };
  };
  
  // 下一句
  const nextSentence = () => {
    if (currentIndex < sentencePairs.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setUserAnswer('');
      setIsAnswerShown(false);
      setIsCorrect(null);
      setFeedbackData(null);
      setShowHint(false);
      setStartTime(Date.now());
    }
  };
  
  // 上一句
  const prevSentence = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setUserAnswer('');
      setIsAnswerShown(false);
      setIsCorrect(null);
      setFeedbackData(null);
      setShowHint(false);
      setStartTime(Date.now());
    }
  };
  
  // 显示答案
  const showAnswer = () => {
    setIsAnswerShown(true);
    
    // 更新统计数据以跟踪跳过的问题
    const newStats = { ...performanceStats };
    newStats.totalAnswered += 1;
    newStats.streaks.current = 0;
    
    setPerformanceStats(newStats);
    
    // 生成跳过的反馈
    setFeedbackData({
      correct: false,
      score: 0,
      message: '已显示答案，请尝试自己翻译下一句',
      detailedFeedback: {
        grammar: { score: 0, issues: [] },
        vocabulary: { score: 0, issues: [] },
        context: { score: 0, issues: [] }
      },
      suggestions: ['尝试在查看答案前先独立完成翻译', '注意分析答案中的句子结构和用词'],
      correctAnswer: sentencePairs[currentIndex].english,
      learningStreaks: { current: 0, longest: newStats.streaks.longest }
    });
  };
  
  // 显示提示
  const handleShowHint = () => {
    setShowHint(true);
  };
  
  // 设置开始时间
  useEffect(() => {
    if (sentencePairs.length > 0) {
      setStartTime(Date.now());
    }
  }, [sentencePairs]);

  if (loading || !lesson) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const isLastSentence = currentIndex === sentencePairs.length - 1;
  const isFirstSentence = currentIndex === 0;
  const progress = Math.round((completedSentences.size / sentencePairs.length) * 100);

  return (
    <div className="bg-gray-900 text-white min-h-screen pb-20" ref={contentRef}>
      {/* 顶部导航栏 */}
      <div className="bg-gradient-to-r from-orange-600 to-amber-600 shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link href={`/courses/${courseId}`} className="flex items-center text-white">
            <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>返回课程</span>
          </Link>
          <div className="text-lg font-semibold text-white">
            中译英模式
          </div>
          <div className="text-sm text-white">
            {completedSentences.size}/{sentencePairs.length} 句
          </div>
        </div>
        
        {/* 进度条 */}
        <div className="h-1 bg-orange-800">
          <div 
            className="h-1 bg-white transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      
      {/* 课文标题 */}
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">{lesson.title}</h1>
          <p className="text-gray-400">{lesson.subtitle}</p>
        </div>
        
        {/* 学习界面 */}
        <div className="max-w-2xl mx-auto content-container">
          {/* 当前句子 */}
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <div className="mb-6">
              <div className="text-sm text-gray-400 mb-1">中文句子:</div>
              <div className="text-xl">{sentencePairs[currentIndex].chinese}</div>
            </div>
            
            {/* 提示区域 */}
            {showHint && (
              <div className="mb-6 border-l-4 border-yellow-500 bg-yellow-900/20 pl-3 py-2">
                <p className="text-sm text-yellow-400 font-medium mb-1">提示:</p>
                <p className="text-sm text-gray-300">尝试使用以下关键词:</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {sentencePairs[currentIndex].english
                    .split(/\s+/)
                    .filter(word => word.length > 3)
                    .slice(0, 3)
                    .map((word, i) => (
                      <span key={i} className="px-2 py-0.5 bg-gray-700 rounded-full text-gray-300 text-xs">
                        {word.replace(/[,.?!]/g, '')}
                      </span>
                    ))}
                </div>
              </div>
            )}
            
            {/* 输入框 */}
            <div className="mb-4">
              <div className="text-sm text-gray-400 mb-1">你的翻译:</div>
              <textarea
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                rows={3}
                placeholder="输入英文翻译..."
                disabled={isAnswerShown}
              />
            </div>
            
            {/* 按钮组 */}
            {!isAnswerShown ? (
              <div className="flex space-x-3">
                <button
                  onClick={checkAnswer}
                  disabled={userAnswer.trim() === '' || isCheckingAnswer}
                  className={`px-4 py-2 bg-orange-600 text-white rounded-md flex items-center ${
                    userAnswer.trim() === '' || isCheckingAnswer ? 'opacity-50 cursor-not-allowed' : 'hover:bg-orange-700'
                  }`}
                >
                  {isCheckingAnswer ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      检查中...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      检查答案
                    </>
                  )}
                </button>
                <button
                  onClick={handleShowHint}
                  disabled={showHint}
                  className={`px-4 py-2 bg-gray-700 text-white rounded-md ${
                    showHint ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-600'
                  }`}
                >
                  提示
                </button>
                <button
                  onClick={showAnswer}
                  className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600"
                >
                  显示答案
                </button>
              </div>
            ) : (
              <div className="flex space-x-3">
                <button
                  onClick={prevSentence}
                  disabled={isFirstSentence}
                  className={`px-4 py-2 bg-gray-700 text-white rounded-md flex items-center ${
                    isFirstSentence ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-600'
                  }`}
                >
                  <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  上一句
                </button>
                <button
                  onClick={nextSentence}
                  disabled={isLastSentence}
                  className={`px-4 py-2 bg-orange-600 text-white rounded-md flex items-center ${
                    isLastSentence ? 'opacity-50 cursor-not-allowed' : 'hover:bg-orange-700'
                  }`}
                >
                  下一句
                  <svg className="w-5 h-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </div>
          
          {/* 反馈内容 */}
          {feedbackData && (
            <div className="mb-6">
              <EnhancedInteractiveFeedback
                feedbackData={feedbackData}
                performanceStats={performanceStats}
                isLoading={isCheckingAnswer}
                onNextQuestion={!isLastSentence ? nextSentence : undefined}
                onShowHint={!showHint ? handleShowHint : undefined}
              />
            </div>
          )}
          
          {/* 小节导航 */}
          <div className="flex justify-between text-sm text-gray-400 mt-8">
            <div>
              {isFirstSentence ? (
                <span className="opacity-50">已是第一句</span>
              ) : (
                <button
                  onClick={prevSentence}
                  className="text-orange-500 hover:text-orange-400 flex items-center"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  上一句
                </button>
              )}
            </div>
            <div>
              <span className="px-2 py-1 bg-gray-800 rounded-md">
                {currentIndex + 1} / {sentencePairs.length}
              </span>
            </div>
            <div>
              {isLastSentence ? (
                <span className="opacity-50">已是最后一句</span>
              ) : (
                <button
                  onClick={nextSentence}
                  className="text-orange-500 hover:text-orange-400 flex items-center"
                >
                  下一句
                  <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* 自定义布局管理器 */}
      <EnhancedCustomLayoutManager
        onSettingsChange={handleLayoutSettingsChange}
        containerRef={contentRef}
      />
    </div>
  );
} 