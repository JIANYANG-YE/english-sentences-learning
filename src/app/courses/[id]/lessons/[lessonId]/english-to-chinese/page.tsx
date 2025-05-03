'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ModeNavigation from '@/components/learning/ModeNavigation';

// 模拟课文数据
const lessonData = {
  '1': {
    id: '1',
    courseId: '1',
    title: 'Fall in Love with English',
    subtitle: '爱上英语',
    order: 1,
    duration: 5,
    progress: 0,
    lastStudied: null,
    content: {
      english: `I hated English in middle school. I couldn't understand why I needed to learn a foreign language. It seemed so useless. My English teacher was very strict, and English class was boring. I always got poor grades in English tests.

Things changed when I went to high school. My new English teacher was amazing. She didn't just teach from textbooks; she taught us about English songs, movies, and culture. She told us interesting stories about her travel experiences in different countries.

I remember when she played an English song in class for the first time. It was "My Heart Will Go On" by Celine Dion, from the movie Titanic. I was surprised that I could understand some of the lyrics. The song was so beautiful, and I wanted to understand all of it.

After that, I started watching English movies with subtitles. I tried to read simple English books. Gradually, English was no longer a difficult subject for me. It became a tool that opened a door to a new world.

Now, I love English. It helps me make friends from different countries. I can enjoy original English songs, movies, and books. Most importantly, it gave me confidence. If I can learn English well, I can learn anything.

Learning a language is not just about memorizing grammar rules and vocabulary. It's about connecting with another culture and seeing the world from a different perspective. I'm so glad I fell in love with English.`,
      chinese: `我在中学时讨厌英语。我不理解为什么我需要学习一门外语。它似乎毫无用处。我的英语老师非常严格，英语课很无聊。我在英语考试中总是得低分。

当我上高中时，情况发生了变化。我的新英语老师很棒。她不只是照本宣科；她教我们英文歌曲、电影和文化。她给我们讲述了她在不同国家的旅行经历的有趣故事。

我记得她第一次在课堂上播放英文歌曲。那是席琳·迪翁演唱的《我心永恒》，电影《泰坦尼克号》的主题曲。我很惊讶我能理解一些歌词。这首歌太美了，我想完全理解它。

之后，我开始看带字幕的英文电影。我尝试阅读简单的英文书籍。渐渐地，英语不再是一门难学的科目。它成为了一个打开新世界的工具。

现在，我爱上了英语。它帮助我结交来自不同国家的朋友。我可以欣赏原版英文歌曲、电影和书籍。最重要的是，它给了我信心。如果我能学好英语，我就能学好任何东西。

学习一门语言不仅仅是记忆语法规则和词汇。这是关于与另一种文化联系，从不同角度看世界。我很高兴我爱上了英语。`
    }
  },
  // 更多课文数据...
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

export default function EnglishToChinesePage() {
  const params = useParams();
  const router = useRouter();
  const { id: courseId, lessonId } = params;
  const [lesson, setLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sentencePairs, setSentencePairs] = useState<Array<{english: string, chinese: string}>>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isAnswerShown, setIsAnswerShown] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [completedSentences, setCompletedSentences] = useState<Set<number>>(new Set());

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
  
  // 检查答案
  const checkAnswer = () => {
    // 简单实现，仅检查是否完全匹配
    // 实际应用中可以使用更智能的比较算法
    const isMatch = userAnswer.trim() === sentencePairs[currentIndex].chinese;
    setIsCorrect(isMatch);
    setIsAnswerShown(true);
    
    if (isMatch) {
      // 添加到已完成句子列表
      const newCompleted = new Set(completedSentences);
      newCompleted.add(currentIndex);
      setCompletedSentences(newCompleted);
    }
  };
  
  // 下一句
  const nextSentence = () => {
    if (currentIndex < sentencePairs.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setUserAnswer('');
      setIsAnswerShown(false);
      setIsCorrect(null);
    }
  };
  
  // 上一句
  const prevSentence = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setUserAnswer('');
      setIsAnswerShown(false);
      setIsCorrect(null);
    }
  };
  
  // 显示答案
  const showAnswer = () => {
    setIsAnswerShown(true);
  };

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
    <div className="bg-gray-900 text-white min-h-screen pb-20">
      {/* 顶部导航栏 */}
      <div className="bg-gradient-to-r from-purple-600 to-violet-600 shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link href={`/courses/${courseId}`} className="flex items-center text-white">
            <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>返回课程</span>
          </Link>
          <div className="text-lg font-semibold text-white">
            英译中模式
          </div>
          <div className="text-sm text-white">
            {completedSentences.size}/{sentencePairs.length} 句
          </div>
        </div>
        
        {/* 进度条 */}
        <div className="h-1 bg-purple-800">
          <div 
            className="h-1 bg-white"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      
      {/* 课文标题 */}
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">{lesson.title}</h1>
          <p className="text-gray-400">{lesson.subtitle}</p>
        </div>
        
        {/* 学习界面 */}
        <div className="bg-gray-800 rounded-lg p-6 max-w-3xl mx-auto">
          {/* 句子进度 */}
          <div className="flex justify-between mb-6 text-sm text-gray-400">
            <span>句子 {currentIndex + 1} / {sentencePairs.length}</span>
            <span>{Math.round(((currentIndex + 1) / sentencePairs.length) * 100)}% 完成</span>
          </div>
          
          {/* 英文提示 */}
          <div className="mb-6">
            <h3 className="text-gray-400 text-sm mb-2">英文:</h3>
            <div className="text-xl bg-gray-700 p-4 rounded-lg">
              {sentencePairs[currentIndex]?.english || '加载中...'}
            </div>
          </div>
          
          {/* 用户输入 */}
          <div className="mb-6">
            <h3 className="text-gray-400 text-sm mb-2">你的中文翻译:</h3>
            <textarea
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="w-full bg-gray-700 p-4 rounded-lg text-white resize-none h-32 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="输入中文翻译..."
              disabled={isAnswerShown}
            />
          </div>
          
          {/* 正确答案 */}
          {isAnswerShown && (
            <div className="mb-6">
              <h3 className="text-gray-400 text-sm mb-2">参考答案:</h3>
              <div className={`text-lg p-4 rounded-lg ${isCorrect ? 'bg-green-900/30 text-green-400' : 'bg-gray-700'}`}>
                {sentencePairs[currentIndex]?.chinese || '加载中...'}
              </div>
            </div>
          )}
          
          {/* 按钮组 */}
          <div className="flex flex-wrap gap-3 justify-center mt-8">
            {/* 上一句 */}
            <button
              onClick={prevSentence}
              disabled={isFirstSentence}
              className={`px-4 py-2 rounded-lg flex items-center ${
                isFirstSentence
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
            >
              <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              上一句
            </button>
            
            {/* 检查答案 */}
            {!isAnswerShown && (
              <button
                onClick={checkAnswer}
                disabled={!userAnswer.trim()}
                className={`px-4 py-2 rounded-lg ${
                  !userAnswer.trim()
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-purple-600 text-white hover:bg-purple-700'
                }`}
              >
                检查答案
              </button>
            )}
            
            {/* 显示答案 */}
            {!isAnswerShown && (
              <button
                onClick={showAnswer}
                className="px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600"
              >
                显示答案
              </button>
            )}
            
            {/* 下一句 */}
            <button
              onClick={nextSentence}
              disabled={isLastSentence}
              className={`px-4 py-2 rounded-lg flex items-center ${
                isLastSentence
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : isAnswerShown
                    ? 'bg-purple-600 text-white hover:bg-purple-700'
                    : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
            >
              下一句
              <svg className="w-5 h-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* 模式导航 */}
        <div className="mt-8">
          <ModeNavigation 
            courseId={courseId as string} 
            lessonId={lessonId as string} 
            currentMode="english-to-chinese"
          />
        </div>
      </div>
    </div>
  );
} 