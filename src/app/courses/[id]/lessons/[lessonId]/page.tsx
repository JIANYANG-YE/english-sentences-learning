'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import LearningModeSelector from '@/components/LearningModeSelector';

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

学习一门语言不仅仅是记忆语法规则和词汇。这是关于与另一种文化联系，从不同角度看世界。我很高兴我爱上了英语。`,
      vocabulary: [
        { word: 'hated', meaning: '讨厌的', example: 'I hated getting up early.' },
        { word: 'strict', meaning: '严格的', example: 'The school has strict rules about attendance.' },
        { word: 'useless', meaning: '无用的', example: 'These old tools are useless now.' },
        { word: 'boring', meaning: '无聊的', example: 'The lecture was so boring that I fell asleep.' },
        { word: 'amazing', meaning: '令人惊叹的', example: 'The view from the mountain was amazing.' },
        { word: 'experiences', meaning: '经历，体验', example: 'She has many interesting travel experiences.' },
        { word: 'surprised', meaning: '惊讶的', example: 'I was surprised by the unexpected gift.' },
        { word: 'lyrics', meaning: '歌词', example: 'I\'m trying to understand the lyrics of this song.' },
        { word: 'gradually', meaning: '逐渐地', example: 'She gradually improved her English.' },
        { word: 'confidence', meaning: '信心', example: 'Success gave him the confidence to try again.' },
        { word: 'memorizing', meaning: '记忆，背诵', example: 'Memorizing vocabulary is part of learning a language.' },
        { word: 'perspective', meaning: '视角，观点', example: 'Try to see things from a different perspective.' }
      ],
      grammarPoints: [
        { point: 'Past Tense', explanation: '表达过去发生的事情，例如 "I hated English"（我讨厌英语），"Things changed"（情况改变了）。' },
        { point: 'Present Tense', explanation: '表达现在的事实或习惯，例如 "Now, I love English"（现在，我爱英语）。' },
        { point: 'If 条件句', explanation: '"If I can learn English well, I can learn anything."（如果我能学好英语，我就能学好任何东西）是一个表示现在或将来可能情况的条件句。' }
      ],
      keyPhrases: [
        { phrase: 'fell in love with', meaning: '爱上', example: 'She fell in love with Paris during her vacation.' },
        { phrase: 'opened a door to', meaning: '开启了...的大门', example: 'Learning programming opened a door to new job opportunities.' },
        { phrase: 'not just about...but also', meaning: '不仅关于...而且', example: 'Success is not just about talent but also hard work.' }
      ]
    }
  },
  '2': {
    id: '2',
    courseId: '1',
    title: 'Different Countries Have Different English',
    subtitle: '不同的国家有不同的英语',
    order: 2,
    duration: 8,
    progress: 0,
    lastStudied: null,
    content: {
      english: `When people talk about learning English, they often think of it as one language. However, English is spoken differently in different countries. The main varieties are British English, American English, Australian English, and many others.

I discovered this when I traveled to the United States after studying British English for many years. I was confident in my English skills until I ordered "chips" at a restaurant and received potato crisps instead of french fries! In British English, "chips" means french fries, while in American English, "chips" refers to what the British call "crisps."

Vocabulary differences are just the beginning. Spelling can also be different. British English uses "colour," "centre," and "theatre," while American English prefers "color," "center," and "theater." Even the pronunciation can vary significantly. British people might say "schedule" with a "sh" sound, while Americans pronounce it with a "sk" sound.

Grammar can differ too. British English often uses the present perfect tense for recent actions: "I have just eaten." Americans might use the simple past: "I just ate."

When I visited Australia, I encountered yet another version of English. Australians have their own unique slang and expressions. They might say, "G'day mate" instead of "Hello," or "arvo" instead of "afternoon."

It's fascinating how one language can have so many variations. This doesn't mean that speakers from different English-speaking countries can't understand each other. Most of the time, they can communicate effectively, despite occasional confusion over certain words or expressions.

So, when you're learning English, it's good to be aware of these differences. The variety of English you choose to learn might depend on where you plan to use it, or which one you find most appealing. Personally, I enjoy learning about all the different versions. It makes the language richer and more interesting.`,
      chinese: `当人们谈论学习英语时，他们常常将其视为一种语言。然而，英语在不同国家的说法是不同的。主要的变种有英式英语、美式英语、澳大利亚英语和许多其他变种。

在学习了多年的英式英语后，我到美国旅行时发现了这一点。我对自己的英语技能很有信心，直到我在餐厅点"chips"时，收到的是薯片而不是薯条！在英式英语中，"chips"意味着薯条，而在美式英语中，"chips"指的是英国人称为"crisps"的东西。

词汇差异只是开始。拼写也可能不同。英式英语使用"colour"、"centre"和"theatre"，而美式英语更喜欢"color"、"center"和"theater"。甚至发音也可能有很大差异。英国人可能会说带"sh"音的"schedule"，而美国人则用"sk"音发音。

语法也可能不同。英式英语经常使用现在完成时表示最近的动作："I have just eaten"（我刚吃过了）。美国人可能会使用一般过去时："I just ate."（我刚吃过了）。

当我访问澳大利亚时，我遇到了另一个版本的英语。澳大利亚人有自己独特的俚语和表达方式。他们可能会说"G'day mate"而不是"Hello"，或者说"arvo"而不是"afternoon"。

一种语言可以有这么多变种，这很有趣。这并不意味着来自不同英语国家的说话者不能互相理解。大多数时候，他们可以有效地交流，尽管偶尔会对某些词或表达式感到困惑。

所以，当你学习英语时，了解这些差异是很好的。你选择学习的英语种类可能取决于你计划在哪里使用它，或者你发现哪种最吸引人。就我个人而言，我喜欢了解所有不同版本的英语。这使得语言更加丰富和有趣。`,
      vocabulary: [
        { word: 'varieties', meaning: '变种，类型', example: 'The store sells many varieties of cheese.' },
        { word: 'discovered', meaning: '发现', example: 'He discovered a new species of plant.' },
        { word: 'confident', meaning: '自信的', example: 'She feels confident about passing the exam.' },
        { word: 'received', meaning: '收到', example: 'I received a package in the mail yesterday.' },
        { word: 'refers to', meaning: '指的是', example: 'The term "annual" refers to something that happens once a year.' },
        { word: 'pronunciation', meaning: '发音', example: 'The pronunciation of some English words is difficult.' },
        { word: 'vary', meaning: '变化，不同', example: 'Prices vary from store to store.' },
        { word: 'significantly', meaning: '显著地', example: 'His health improved significantly after the surgery.' },
        { word: 'encountered', meaning: '遇到', example: 'We encountered some problems with the new software.' },
        { word: 'unique', meaning: '独特的', example: 'Each person has a unique fingerprint.' },
        { word: 'occasional', meaning: '偶尔的', example: 'He makes occasional mistakes in his writing.' },
        { word: 'appealing', meaning: '有吸引力的', example: 'The idea of traveling around the world is very appealing to me.' }
      ],
      grammarPoints: [
        { point: 'Present Simple', explanation: '表示一般事实，例如 "English is spoken differently in different countries."（英语在不同国家有不同的说法）。' },
        { point: 'Present Perfect vs. Simple Past', explanation: '英式英语更倾向于使用现在完成时表示刚刚完成的动作 "I have just eaten"，而美式英语更倾向于使用一般过去时 "I just ate"。' }
      ],
      keyPhrases: [
        { phrase: 'talk about', meaning: '谈论', example: 'Let\'s talk about your plans for the future.' },
        { phrase: 'be aware of', meaning: '意识到', example: 'You should be aware of the potential risks.' },
        { phrase: 'depend on', meaning: '取决于', example: 'The success of the project depends on everyone\'s cooperation.' }
      ]
    }
  },
  // 更多课文数据...
};

// 拆分文本为段落
function splitIntoParagraphs(text: string) {
  return text.split(/\n\n/).map(p => p.trim()).filter(p => p.length > 0);
}

// 创建段落的显示组件
function ParagraphView({ english, chinese }: { english: string, chinese: string }) {
  const [showTranslation, setShowTranslation] = useState(false);
  
  return (
    <div 
      className="mb-8 group"
      onMouseEnter={() => setShowTranslation(true)}
      onMouseLeave={() => setShowTranslation(false)}
    >
      <div className="text-white leading-relaxed mb-2">{english}</div>
      
      <div 
        className={`text-gray-400 leading-relaxed border-l-2 border-gray-700 pl-3 transition-all duration-300 ${
          showTranslation ? 'opacity-100 max-h-48' : 'opacity-0 max-h-0 overflow-hidden'
        }`}
      >
        {chinese}
      </div>
    </div>
  );
}

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const { id: courseId, lessonId } = params;
  const [lesson, setLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paragraphs, setParagraphs] = useState<Array<{english: string, chinese: string}>>([]);
  
  // 学习模式选择器状态
  const [isModeSelectOpen, setIsModeSelectOpen] = useState(false);

  useEffect(() => {
    // 在实际应用中，这里会从API获取课文数据
    const data = lessonData[lessonId as string];
    if (data && data.courseId === courseId) {
      setLesson(data);
      
      // 拆分段落
      if (data.content) {
        const englishParagraphs = splitIntoParagraphs(data.content.english);
        const chineseParagraphs = splitIntoParagraphs(data.content.chinese);
        
        const minLength = Math.min(englishParagraphs.length, chineseParagraphs.length);
        const pairs = [];
        
        for (let i = 0; i < minLength; i++) {
          pairs.push({
            english: englishParagraphs[i],
            chinese: chineseParagraphs[i]
          });
        }
        
        setParagraphs(pairs);
      }
    } else {
      // 未找到课文或课程不匹配时重定向
      router.push(`/courses/${courseId}`);
    }
    setLoading(false);
  }, [courseId, lessonId, router]);

  if (loading || !lesson) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {/* 顶部导航栏 */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link href={`/courses/${courseId}`} className="flex items-center text-white">
            <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>返回课程</span>
          </Link>
          <div className="text-lg font-semibold text-white">
            第 {lesson.order} 课
          </div>
          <button
            onClick={() => setIsModeSelectOpen(true)}
            className="flex items-center text-white bg-white/20 rounded-md px-3 py-1.5 hover:bg-white/30 transition-colors"
          >
            <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            <span>学习模式</span>
          </button>
        </div>
      </div>
      
      {/* 课文内容 */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* 课文标题 */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">{lesson.title}</h1>
            <p className="text-xl text-gray-400">{lesson.subtitle}</p>
          </div>
          
          {/* 学习按钮组 */}
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <Link
              href={`/courses/${courseId}/lessons/${lessonId}/chinese-to-english`}
              className="flex items-center bg-gradient-to-r from-orange-600 to-amber-600 text-white px-4 py-2 rounded-md hover:opacity-90 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
              中译英练习
            </Link>
            
            <Link
              href={`/courses/${courseId}/lessons/${lessonId}/grammar`}
              className="flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-md hover:opacity-90 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              语法分析
            </Link>
            
            <Link
              href={`/courses/${courseId}/lessons/${lessonId}/listening`}
              className="flex items-center bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-2 rounded-md hover:opacity-90 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.465a5 5 0 001.897-7.72m-3.732 10.535a9 9 0 0110.607-14.206" />
              </svg>
              听力练习
            </Link>
            
            <Link
              href={`/courses/${courseId}/lessons/${lessonId}/notes`}
              className="flex items-center bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 py-2 rounded-md hover:opacity-90 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              笔记模式
            </Link>
          </div>
          
          {/* 段落提示 */}
          <div className="mb-6 text-center text-gray-400 text-sm">
            鼠标悬停在段落上可查看中文翻译
          </div>
          
          {/* 课文段落 */}
          <div className="bg-gray-800 rounded-xl p-6 md:p-8">
            {paragraphs.map((paragraph, index) => (
              <ParagraphView 
                key={index}
                english={paragraph.english}
                chinese={paragraph.chinese}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* 学习模式选择器 */}
      <LearningModeSelector 
        isOpen={isModeSelectOpen}
        onClose={() => setIsModeSelectOpen(false)}
        courseId={courseId as string}
        lessonId={lessonId as string}
        lessonTitle={`${lesson.title} - ${lesson.subtitle}`}
      />
    </div>
  );
} 