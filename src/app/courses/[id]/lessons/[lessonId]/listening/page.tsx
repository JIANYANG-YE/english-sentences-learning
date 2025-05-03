'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import LearningToolbar from '@/components/LearningToolbar';
import ModeNavigation from '@/components/learning/ModeNavigation';

// 模拟课文数据
const lessonData: Record<string, {
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
  notes?: any[];
}> = {
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
  }
  // 更多课文数据...
};

// 拆分句子的函数
function splitIntoPairs(englishText: string) {
  // 简单拆分，实际应用中需要更复杂的句子对齐算法
  return englishText.split(/(?<=[.!?])\s+/).map(sentence => sentence.trim()).filter(sentence => sentence.length > 0);
}

// 生成词组选项
function generateOptions(word: string, allWords: string[]): string[] {
  // 过滤掉标点符号
  const cleanWord = word.replace(/[.,!?;:"'()]/g, '').toLowerCase();
  
  // 如果单词太短，不生成选项
  if (cleanWord.length < 3) return [cleanWord];
  
  // 从所有单词中随机选择3个不同的单词作为干扰项
  const filteredWords = allWords
    .map(w => w.replace(/[.,!?;:"'()]/g, '').toLowerCase())
    .filter(w => w !== cleanWord && w.length >= 3);
  
  // 打乱数组并取前3个
  const shuffled = [...filteredWords].sort(() => 0.5 - Math.random()).slice(0, 3);
  
  // 加入正确答案并再次打乱
  return [...shuffled, cleanWord].sort(() => 0.5 - Math.random());
}

// 获取所有单词
function getAllWords(sentences: string[]): string[] {
  return sentences.join(' ').split(/\s+/).map(word => word.replace(/[.,!?;:"'()]/g, '').toLowerCase());
}

export default function ListeningModePage() {
  const params = useParams();
  const router = useRouter();
  const { id: courseId, lessonId } = params;
  const [lesson, setLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sentences, setSentences] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [completedCount, setCompletedCount] = useState(0);
  const [allWords, setAllWords] = useState<string[]>([]);
  const [missingWordIndex, setMissingWordIndex] = useState<number>(-1);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showHint, setShowHint] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const sentenceRef = useRef<HTMLDivElement>(null);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    // 在实际应用中，这里会从API获取课文数据
    const data = lessonData[lessonId as string];
    if (data && data.courseId === courseId) {
      setLesson(data);
      
      // 拆分句子
      if (data.content) {
        const allSentences = splitIntoPairs(data.content.english);
        setSentences(allSentences);
        setAllWords(getAllWords(allSentences));
      }
    } else {
      // 未找到课文或课程不匹配时重定向
      router.push(`/courses/${courseId}`);
    }
    setLoading(false);
  }, [courseId, lessonId, router]);
  
  useEffect(() => {
    // 如果有句子，为当前句子设置缺失单词和选项
    if (sentences.length > 0 && currentIndex < sentences.length) {
      const currentSentenceWords = sentences[currentIndex].split(/\s+/);
      if (currentSentenceWords.length > 1) {
        // 随机选择一个单词作为缺失单词
        const randomIndex = Math.floor(Math.random() * currentSentenceWords.length);
        setMissingWordIndex(randomIndex);
        
        // 生成选项
        const word = currentSentenceWords[randomIndex];
        setOptions(generateOptions(word, allWords));
      }
    }
  }, [sentences, currentIndex, allWords]);
  
  // 播放当前句子的音频
  const playAudio = () => {
    if (sentences.length === 0 || currentIndex >= sentences.length) return;
    
    setIsPlaying(true);
    
    // 使用 Web Speech API 播放文本
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(sentences[currentIndex]);
      utterance.lang = 'en-US';
      utterance.rate = playbackSpeed;
      
      // 存储引用以便后续可以停止
      speechSynthesisRef.current = utterance;
      
      utterance.onend = () => {
        setIsPlaying(false);
      };
      
      window.speechSynthesis.speak(utterance);
    }
  };
  
  // 停止播放
  const stopAudio = () => {
    if ('speechSynthesis' in window && speechSynthesisRef.current) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  };
  
  // 检查答案
  const checkAnswer = () => {
    const currentSentenceWords = sentences[currentIndex].split(/\s+/);
    const correctWord = currentSentenceWords[missingWordIndex].replace(/[.,!?;:"'()]/g, '').toLowerCase();
    
    // 检查选择的选项是否正确
    const isAnswerCorrect = selectedOption === correctWord;
    setIsCorrect(isAnswerCorrect);
    
    if (isAnswerCorrect) {
      setCompletedCount(prev => prev + 1);
    }
    
    setShowAnswer(true);
  };
  
  // 处理选项选择
  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
  };
  
  // 下一句
  const nextSentence = () => {
    if (currentIndex < sentences.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setUserInput('');
      setShowAnswer(false);
      setIsCorrect(null);
      setSelectedOption(null);
      setShowHint(false);
    }
  };
  
  // 上一句
  const prevSentence = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setUserInput('');
      setShowAnswer(false);
      setIsCorrect(null);
      setSelectedOption(null);
      setShowHint(false);
    }
  };
  
  // 切换播放速度
  const togglePlaybackSpeed = () => {
    const speeds = [0.75, 1, 1.25, 1.5];
    const currentIndex = speeds.indexOf(playbackSpeed);
    const nextIndex = (currentIndex + 1) % speeds.length;
    setPlaybackSpeed(speeds[nextIndex]);
  };
  
  // 使用提示
  const useHint = () => {
    setShowHint(true);
  };

  if (loading || !lesson) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  const progress = Math.round((completedCount / sentences.length) * 100);
  const currentSentence = sentences[currentIndex] || '';
  const sentenceWords = currentSentence.split(/\s+/);

  return (
    <div className="bg-gray-900 text-white min-h-screen pb-20">
      {/* 工具栏 */}
      <LearningToolbar
        lessonTitle={lesson.title}
        currentIndex={currentIndex + 1}
        totalItems={sentences.length}
        onShowContent={() => {}}
        onPause={() => {}}
      />
      
      {/* 顶部状态栏 */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link href={`/courses/${courseId}`} className="flex items-center text-white">
            <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>返回课程</span>
          </Link>
          <div className="text-lg font-semibold text-white">
            听力模式
          </div>
          <div className="text-sm text-white">
            {completedCount}/{sentences.length} 句
          </div>
        </div>
        
        {/* 进度条 */}
        <div className="h-1 bg-teal-800">
          <div 
            className="h-1 bg-white"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      
      {/* 主要内容区域 */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* 播放控制区 */}
          <div className="mb-8 bg-gray-800 rounded-lg p-6 flex flex-col items-center">
            <div className="mb-4 flex items-center gap-4">
              <button
                onClick={isPlaying ? stopAudio : playAudio}
                className="w-16 h-16 rounded-full bg-teal-600 hover:bg-teal-700 flex items-center justify-center"
              >
                {isPlaying ? (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </button>
              
              <button 
                onClick={togglePlaybackSpeed}
                className="px-3 py-1 bg-gray-700 rounded-md text-gray-300 hover:bg-gray-600"
              >
                {playbackSpeed}x
              </button>
            </div>
            
            <p className="text-gray-400 text-sm">点击播放按钮听句子，然后选择正确的单词</p>
          </div>
          
          {/* 句子展示区 */}
          <div ref={sentenceRef} className="mb-8 bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl mb-6 text-center">
              选择缺失的单词
            </h3>
            
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {sentenceWords.map((word, index) => (
                <span key={index} className={`inline-block px-3 py-2 ${
                  index === missingWordIndex
                    ? 'bg-teal-900 text-teal-200 border-2 border-dashed border-teal-500'
                    : 'bg-gray-700'
                } rounded`}>
                  {index === missingWordIndex ? (
                    showAnswer || showHint 
                      ? word 
                      : '______'
                  ) : word}
                </span>
              ))}
            </div>
            
            {/* 选项区域 */}
            <div className="grid grid-cols-2 gap-3">
              {options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleOptionSelect(option)}
                  disabled={showAnswer}
                  className={`py-3 px-4 rounded-lg text-center ${
                    selectedOption === option 
                      ? 'bg-teal-600 text-white' 
                      : 'bg-gray-700 hover:bg-gray-600'
                  } ${
                    showAnswer && option === sentenceWords[missingWordIndex].replace(/[.,!?;:"'()]/g, '').toLowerCase()
                      ? 'bg-green-600 text-white' 
                      : ''
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          
          {/* 操作按钮 */}
          <div className="flex justify-between items-center">
            <button
              onClick={prevSentence}
              disabled={currentIndex === 0}
              className={`px-4 py-2 rounded-lg ${
                currentIndex === 0 
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              }`}
            >
              上一句
            </button>
            
            <div className="flex gap-3">
              <button
                onClick={useHint}
                disabled={showHint || showAnswer}
                className={`px-4 py-2 rounded-lg ${
                  showHint || showAnswer
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-amber-600 hover:bg-amber-700 text-white'
                }`}
              >
                提示
              </button>
              
              <button
                onClick={checkAnswer}
                disabled={!selectedOption || showAnswer}
                className={`px-4 py-2 rounded-lg ${
                  !selectedOption || showAnswer
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                确认
              </button>
            </div>
            
            <button
              onClick={nextSentence}
              disabled={currentIndex === sentences.length - 1}
              className={`px-4 py-2 rounded-lg ${
                currentIndex === sentences.length - 1
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              }`}
            >
              下一句
            </button>
          </div>
        </div>
      </div>
      
      {/* 学习模式导航 */}
      <ModeNavigation className="pb-safe" />
    </div>
  );
} 