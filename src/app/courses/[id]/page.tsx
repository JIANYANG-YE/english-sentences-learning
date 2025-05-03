'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import OptimizedImage from '@/components/OptimizedImage';
import { useParams, useRouter } from 'next/navigation';
import LearningModeSelector from '@/components/LearningModeSelector';
import EnhancedLessonCard, { LessonInfo } from '@/components/learning/EnhancedLessonCard';
import resumeLearningService from '@/services/resumeLearningService';
import CourseNoteEditor, { CourseNote } from '@/components/learning/CourseNoteEditor';
import CourseRatingForm from '@/components/learning/CourseRatingForm';
import courseInteractionService from '@/services/courseInteractionService';
import LearningHeatmap, { DailyLearningData, WeeklyHeatmapData } from '@/components/learning/LearningHeatmap';
import ContentRecommendationCard from '@/components/learning/ContentRecommendationCard';
import { learningTrackerService } from '@/services/learningTrackerService';
import { adaptiveLearningService, DifficultyLevel } from '@/services/adaptiveLearningService';
import LearningInterfaceManager from '@/components/learning/LearningInterfaceManager';

// 定义ContentKeyword接口以确保类型兼容
interface ContentKeyword {
  word: string;
  meaning?: string;
  example?: string;
}

// 定义课程类型接口
interface CourseLesson extends Omit<LessonInfo, 'keywords'> {
  id: string;
  courseId: string;
  title: string;
  subtitle: string;
  order: number;
  duration: number;
  progress: number;
  wordsCount: number;
  sentencesCount: number;
  keyPoints?: string[];
  description?: string;
  coverImage?: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  lastStudied: string | null;
  availableModes?: string[];
  keywords?: string[]; // 保持string[]类型，后面会转换为ContentKeyword[]
}

interface CourseData {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  totalLessons: number;
  completedLessons: number;
  progress: number;
  totalStudyTime: number;
  lastStudyTime: string;
  lastStudied: string | null;
  lessons: CourseLesson[];
}

interface CourseStats {
  totalMinutes: number;
  averageAccuracy: number;
  totalWordsLearned: number;
  studyStreak: number;
  totalWords?: number; // 添加可选属性
  totalSentences?: number; // 添加可选属性
}

interface LearningPosition {
  lessonId: string;
  mode: string;
  position: number;
  lastStudied: string;
  lessonTitle?: string; // 添加可选的lessonTitle属性
}

// 模拟课程数据
const coursesData: Record<string, CourseData> = {
  '1': {
    id: '1',
    title: '40篇范文搞定高考3500单词',
    description: '40篇精选范文搞定高考3500单词-来自英语兔',
    coverImage: 'https://placehold.co/600x400/3b82f6/white?text=范文3500',
    totalLessons: 40,
    completedLessons: 0,
    progress: 0,
    totalStudyTime: 0, // 分钟
    lastStudyTime: '5分钟',
    lastStudied: null,
    lessons: [
      {
        id: '1',
        courseId: '1',
        title: 'Fall in Love with English',
        subtitle: '爱上英语',
        order: 1,
        duration: 5, // 分钟
        progress: 0,
        wordsCount: 120,
        sentencesCount: 15,
        difficulty: 1,
        lastStudied: null,
        keyPoints: ['学习第一人称陈述句', '掌握表达爱好的词汇', '了解英语国家的文化背景'],
        availableModes: ['中译英', '英译中', '听力', '阅读'],
        keywords: ['hobby', 'interest', 'learn', 'English']
      },
      {
        id: '2',
        courseId: '1',
        title: 'Different Countries Have Different English',
        subtitle: '不同的国家有不同的英语',
        order: 2,
        duration: 8,
        progress: 0,
        wordsCount: 150,
        sentencesCount: 18,
        difficulty: 2,
        lastStudied: null,
        keyPoints: ['区分美式和英式英语', '掌握国家和地区名称', '了解英语的全球分布'],
        availableModes: ['中译英', '英译中', '听力', '阅读'],
        keywords: ['country', 'accent', 'American', 'British']
      },
      {
        id: '3',
        courseId: '1',
        title: 'A Hard Trip',
        subtitle: '一次辛苦的旅行',
        order: 3,
        duration: 6,
        progress: 0,
        wordsCount: 135,
        sentencesCount: 16,
        difficulty: 2,
        lastStudied: null,
        keyPoints: ['学习旅行相关词汇', '掌握过去时态', '了解表达困难的句型'],
        availableModes: ['中译英', '英译中', '听力', '阅读'],
        keywords: ['trip', 'travel', 'difficulty', 'experience']
      },
      {
        id: '4',
        courseId: '1',
        title: 'A Horrible Earthquake',
        subtitle: '可怕的地震',
        order: 4,
        duration: 7,
        progress: 0,
        wordsCount: 145,
        sentencesCount: 17,
        difficulty: 3,
        lastStudied: null,
        keyPoints: ['学习自然灾害词汇', '掌握表达情感的形容词', '了解新闻报道的语言特点'],
        availableModes: ['中译英', '英译中', '听力', '阅读'],
        keywords: ['earthquake', 'disaster', 'emergency', 'rescue']
      },
      {
        id: '5',
        courseId: '1',
        title: 'The Great President',
        subtitle: '伟大的总统',
        order: 5,
        duration: 5,
        progress: 0,
        wordsCount: 125,
        sentencesCount: 15,
        difficulty: 2,
        lastStudied: null,
        keyPoints: ['学习政治术语', '掌握表达赞美的词汇', '了解历史人物描述的语言特点'],
        availableModes: ['中译英', '英译中', '听力', '阅读'],
        keywords: ['president', 'leadership', 'history', 'achievement']
      },
      {
        id: '6',
        courseId: '1',
        title: 'A Brave Maid',
        subtitle: '勇敢的女仆',
        order: 6,
        duration: 6,
        progress: 0,
        wordsCount: 130,
        sentencesCount: 16,
        difficulty: 2,
        lastStudied: null,
        keyPoints: ['学习描述性格的词汇', '掌握故事叙述的时态', '了解英语故事的叙述方式'],
        availableModes: ['中译英', '英译中', '听力', '阅读'],
        keywords: ['brave', 'courage', 'story', 'character']
      },
      {
        id: '7',
        courseId: '1',
        title: 'A Fair Competition',
        subtitle: '公平的比赛',
        order: 7,
        duration: 7,
        progress: 0,
        wordsCount: 140,
        sentencesCount: 17,
        difficulty: 3,
        lastStudied: null,
        keyPoints: ['学习体育比赛词汇', '掌握表达公平和规则的语言', '了解描述竞争的句型'],
        availableModes: ['中译英', '英译中', '听力', '阅读'],
        keywords: ['competition', 'fair', 'rules', 'sports']
      },
      {
        id: '8',
        courseId: '1',
        title: 'Computers',
        subtitle: 'Computers电脑',
        order: 8,
        duration: 5,
        progress: 0,
        wordsCount: 125,
        sentencesCount: 15,
        difficulty: 3,
        lastStudied: null,
        keyPoints: ['学习科技词汇', '掌握描述功能的句型', '了解科技发展的表达方式'],
        availableModes: ['中译英', '英译中', '听力', '阅读'],
        keywords: ['computer', 'technology', 'device', 'digital']
      },
      {
        id: '9',
        courseId: '1',
        title: 'Wildlife Protection',
        subtitle: '保护野生动物',
        order: 9,
        duration: 8,
        progress: 0,
        wordsCount: 155,
        sentencesCount: 19,
        difficulty: 4,
        lastStudied: null,
        keyPoints: ['学习环保词汇', '掌握动物保护相关术语', '了解议论文的语言特点'],
        availableModes: ['中译英', '英译中', '听力', '阅读'],
        keywords: ['wildlife', 'protection', 'conservation', 'species']
      },
      {
        id: '10',
        courseId: '1',
        title: 'My First Band',
        subtitle: '我的第一支乐队',
        order: 10,
        duration: 6,
        progress: 0,
        wordsCount: 135,
        sentencesCount: 16,
        difficulty: 2,
        lastStudied: null,
        keyPoints: ['学习音乐相关词汇', '掌握表达兴趣和爱好的语言', '了解叙述个人经历的句型'],
        availableModes: ['中译英', '英译中', '听力', '阅读'],
        keywords: ['band', 'music', 'instrument', 'performance']
      },
      {
        id: '11',
        courseId: '1',
        title: 'An Interesting Festival',
        subtitle: '有趣的节日',
        order: 11,
        duration: 7,
        progress: 0,
        wordsCount: 140,
        sentencesCount: 17,
        difficulty: 3,
        lastStudied: null,
        keyPoints: ['学习文化和节日词汇', '掌握描述传统习俗的句型', '了解不同文化的表达方式'],
        availableModes: ['中译英', '英译中', '听力', '阅读'],
        keywords: ['festival', 'tradition', 'celebration', 'culture']
      },
      {
        id: '12',
        courseId: '1',
        title: 'Balanced Diet',
        subtitle: '平衡膳食',
        order: 12,
        duration: 8,
        progress: 0,
        wordsCount: 150,
        sentencesCount: 18,
        difficulty: 3,
        lastStudied: null,
        keyPoints: ['学习食物和营养词汇', '掌握健康生活的表达', '了解说明文的语言特点'],
        availableModes: ['中译英', '英译中', '听力', '阅读'],
        keywords: ['diet', 'nutrition', 'health', 'food']
      }
    ]
  },
  '2': {
    id: '2',
    title: '300个高频句型系列',
    description: '句乐部英语300个高频句型系列',
    coverImage: 'https://placehold.co/600x400/3b82f6/white?text=高频句型',
    totalLessons: 30,
    completedLessons: 2,
    progress: 7,
    totalStudyTime: 25, // 分钟
    lastStudyTime: '6分钟前',
    lastStudied: '2024-05-10',
    lessons: [
      // 类似的课文数据...
    ]
  },
  // 其他课程数据...
};

// 模拟用户数据
const currentUser = {
  id: 'user-123',
  name: '学习者'
};

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  const [course, setCourse] = useState<CourseData | null>(null);
  const [activeLesson, setActiveLesson] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [latestLearningPosition, setLatestLearningPosition] = useState<LearningPosition | null>(null);
  const [courseStats, setCourseStats] = useState<CourseStats | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'inProgress' | 'completed' | 'notStarted'>('all');
  const [showDetailedInfo, setShowDetailedInfo] = useState(false);
  const [showKeywords, setShowKeywords] = useState(false);
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [userRating, setUserRating] = useState<any>(null);
  const [courseRatingStats, setCourseRatingStats] = useState<{
    average: number;
    count: number;
    distribution: number[];
  }>({ average: 0, count: 0, distribution: [0, 0, 0, 0, 0] });
  
  // 学习模式选择器状态
  const [isModeSelectOpen, setIsModeSelectOpen] = useState(false);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [selectedLessonTitle, setSelectedLessonTitle] = useState<string>('');
  
  // 添加以下状态变量
  const [userId, setUserId] = useState<string>('user-1'); // 模拟用户ID
  const [learningData, setLearningData] = useState<DailyLearningData[]>([]);
  const [weeklyData, setWeeklyData] = useState<WeeklyHeatmapData>({});
  const [recommendations, setRecommendations] = useState<{
    lessons: any[];
    practices: any[];
  }>({
    lessons: [],
    practices: []
  });
  const [dataLoading, setDataLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // 在实际应用中，这里会从API获取课程数据
        const courseData = coursesData[courseId];
        
        if (courseData) {
          setCourse(courseData);
          
          // 获取上次学习位置
          try {
            const lastPosition = await resumeLearningService.getLastPosition(
              currentUser.id, 
              courseId
            );
            
            if (lastPosition) {
              // 找到对应课时信息
              const lessonInfo = courseData.lessons.find(l => l.id === lastPosition.lessonId);
              
              if (lessonInfo) {
                setLatestLearningPosition({
                  lessonId: lastPosition.lessonId,
                  mode: lastPosition.mode,
                  position: lastPosition.position,
                  lastStudied: lastPosition.timestamp,
                  lessonTitle: lessonInfo.title // 添加课程标题
                });
                
                setActiveLesson(lastPosition.lessonId);
              }
            }
          } catch (error) {
            console.error('获取学习位置失败:', error);
          }
          
          // 模拟获取学习统计数据
          const totalWords = courseData.lessons.reduce(
            (sum, lesson) => sum + lesson.wordsCount, 0
          );
          
          const totalSentences = courseData.lessons.reduce(
            (sum, lesson) => sum + lesson.sentencesCount, 0
          );
          
          setCourseStats({
            totalMinutes: courseData.totalStudyTime || 0,
            averageAccuracy: 85, // 假设的平均准确率数据
            totalWordsLearned: courseData.lessons.reduce((sum: number, lesson: CourseLesson) => 
              sum + (lesson.progress / 100 * lesson.wordsCount), 0),
            studyStreak: 3, // 假设的连续学习天数
            totalWords, // 添加总词数
            totalSentences // 添加总句子数
          });
          
          // 获取课程评分
          const userRatingData = courseInteractionService.getCourseRating(currentUser.id, courseId);
          setUserRating(userRatingData);
          
          const ratingStats = courseInteractionService.calculateAverageRating(courseId);
          setCourseRatingStats(ratingStats);
        } else {
          // 未找到课程时重定向
          router.push('/my-courses');
        }
      } catch (error) {
        console.error('获取课程数据失败:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [courseId, router]);

  // 添加一个新的useEffect来加载学习数据和推荐
  useEffect(() => {
    if (!course || !userId) return;
    
    const loadLearningData = async () => {
      setDataLoading(true);
      
      try {
        // 获取学习数据
        const dailyData = learningTrackerService.getDailyLearningData(userId, 30);
        const weekData = learningTrackerService.getWeeklyHeatmapData(userId);
        
        setLearningData(dailyData);
        setWeeklyData(weekData);
        
        // 模拟获取推荐内容
        // 在实际应用中，这里应该调用API或内容推荐服务
        
        // 模拟章节推荐
        const lessonRecommendations = course.lessons.map(lesson => ({
          lessonId: lesson.id,
          courseId: course.id,
          title: lesson.title,
          description: lesson.subtitle || `深入学习"${lesson.title}"的核心内容`,
          matchScore: Math.floor(70 + Math.random() * 30),
          tags: [
            { id: '1', name: '语法', category: 'grammar' },
            { id: '2', name: '词汇', category: 'vocabulary' }
          ],
          difficulty: (lesson.difficulty || 3) as DifficultyLevel,
          estimatedTimeMinutes: lesson.duration || 15,
          reasonForRecommendation: ['基于您最近的学习内容', '符合您的技能水平']
        })).slice(0, 3);
        
        // 模拟练习推荐
        const practiceRecommendations = [
          {
            id: 'p1',
            title: '核心词汇巩固练习',
            description: '巩固本课程中的重要词汇',
            activityType: 'vocabulary',
            difficulty: 3 as DifficultyLevel,
            estimatedTimeMinutes: 10,
            targetSkill: '词汇',
            reasonForRecommendation: ['针对您需要加强的词汇领域']
          },
          {
            id: 'p2',
            title: '语法结构练习',
            description: '掌握关键语法点',
            activityType: 'grammar',
            difficulty: 3 as DifficultyLevel,
            estimatedTimeMinutes: 15,
            targetSkill: '语法',
            reasonForRecommendation: ['符合您当前的学习进度']
          }
        ];
        
        setRecommendations({
          lessons: lessonRecommendations,
          practices: practiceRecommendations
        });
      } catch (error) {
        console.error('加载学习数据时出错:', error);
      } finally {
        setDataLoading(false);
      }
    };
    
    loadLearningData();
  }, [course, userId]);

  // 处理继续学习
  const handleContinueLearning = () => {
    if (!course) return;
    
    if (latestLearningPosition) {
      // 有上次学习位置，跳转到对应课时和模式
      const { lessonId, mode, position } = latestLearningPosition;
      router.push(`/courses/${courseId}/lessons/${lessonId}/${mode}?position=${position}`);
    } else {
      // 没有学习记录，跳转到第一课
      if (course.lessons.length > 0) {
        setSelectedLessonId(course.lessons[0].id);
        setSelectedLessonTitle(`${course.lessons[0].title} - ${course.lessons[0].subtitle}`);
        setIsModeSelectOpen(true);
      }
    }
  };
  
  // 处理课文点击事件
  const handleLessonClick = (lessonId: string, lessonTitle: string) => {
    setSelectedLessonId(lessonId);
    setSelectedLessonTitle(lessonTitle);
    setIsModeSelectOpen(true);
    setActiveLesson(lessonId);
  };
  
  // 关闭学习模式选择器
  const handleModeSelectClose = () => {
    setIsModeSelectOpen(false);
  };
  
  // 过滤课时列表
  const getFilteredLessons = () => {
    if (!course) return [];
    
    return course.lessons.filter(lesson => {
      switch (selectedFilter) {
        case 'inProgress':
          return lesson.progress > 0 && lesson.progress < 100;
        case 'completed':
          return lesson.progress === 100;
        case 'notStarted':
          return lesson.progress === 0;
        default:
          return true;
      }
    });
  };

  // 处理评分表单
  const handleToggleRatingForm = () => {
    setShowRatingForm(!showRatingForm);
  };
  
  const handleRatingSubmitted = (rating: any) => {
    setUserRating(rating);
    
    // 更新统计数据
    const ratingStats = courseInteractionService.calculateAverageRating(courseId);
    setCourseRatingStats(ratingStats);
    
    // 隐藏表单
    setTimeout(() => {
      setShowRatingForm(false);
    }, 1500);
  };
  
  // 渲染评分星星
  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, index) => (
      <span key={index} className={`text-xl ${index < Math.round(rating) ? 'text-yellow-500' : 'text-gray-300'}`}>
        ★
      </span>
    ));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!course) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-bold mb-2">未找到课程</h1>
          <p className="text-gray-400 mb-4">该课程不存在或已被删除</p>
          <Link href="/my-courses" className="px-4 py-2 bg-blue-600 rounded-md text-white hover:bg-blue-700 transition-colors">
            返回我的课程
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 学习界面管理器 */}
      <LearningInterfaceManager
        userId={userId}
        courseId={course?.id || ''}
        lessonId=""
        totalItems={course?.lessons?.length || 0}
        currentPosition={0}
      />
      
      {/* 主内容 */}
      <div className="container mx-auto px-4 py-8">
        {/* 课程标题和图片 */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="relative h-64">
            <img
              src={course?.coverImage || 'https://via.placeholder.com/800x400'}
              alt={course?.title || '课程封面'}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-70"></div>
            <div className="absolute bottom-0 left-0 p-6 text-white">
              <h1 className="text-3xl font-bold mb-2">{course?.title}</h1>
              <p className="text-lg">{course?.description}</p>
              
              <div className="flex flex-wrap gap-2 mt-4">
                {course?.tags?.map((tag, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-blue-600 bg-opacity-70 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：课程内容 */}
          <div className="lg:col-span-2">
            {/* 课程章节卡片 */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">课程章节</h2>
              
              {isLoading ? (
                <div className="animate-pulse space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-24 bg-gray-200 rounded"></div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {course?.lessons?.map((lesson) => (
                    <div 
                      key={lesson.id}
                      onClick={() => handleLessonClick(lesson.id)}
                      className="group bg-white border rounded-lg overflow-hidden transition duration-300 hover:shadow-lg cursor-pointer"
                    >
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-semibold group-hover:text-blue-600">
                              {lesson.title}
                            </h3>
                            {lesson.subtitle && (
                              <p className="text-gray-600 mt-1">{lesson.subtitle}</p>
                            )}
                          </div>
                          <div className="flex items-center">
                            <span className="text-gray-500 mr-2">
                              {lesson.duration}分钟
                            </span>
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                              <span className="text-lg">
                                {lesson.order}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {/* 进度条 */}
                        {lesson.progress !== undefined && (
                          <div className="mt-4">
                            <div className="flex justify-between text-sm text-gray-500 mb-1">
                              <span>学习进度</span>
                              <span>{lesson.progress}%</span>
                            </div>
                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-2 bg-blue-600 rounded-full"
                                style={{ width: `${lesson.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* 课程推荐 */}
            <ContentRecommendationCard
              title="推荐学习内容"
              lessons={recommendations.lessons}
              practices={recommendations.practices}
              loading={dataLoading}
              userId={userId}
            />
          </div>
          
          {/* 右侧：课程信息和学习统计 */}
          <div className="space-y-8">
            {/* 课程统计信息 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">课程信息</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">总章节数</span>
                  <span className="font-medium">{course?.lessons?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">总学时</span>
                  <span className="font-medium">
                    {course?.lessons?.reduce((total, lesson) => total + (lesson.duration || 0), 0) || 0}分钟
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">难度</span>
                  <span className="font-medium">
                    {course?.difficulty === 1 && '入门'}
                    {course?.difficulty === 2 && '初级'}
                    {course?.difficulty === 3 && '中级'}
                    {course?.difficulty === 4 && '进阶'}
                    {course?.difficulty === 5 && '高级'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">学习人数</span>
                  <span className="font-medium">{course?.studentsCount || 0}</span>
                </div>
                
                <hr className="my-4" />
                
                <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition duration-300">
                  继续学习
                </button>
              </div>
            </div>
            
            {/* 学习热力图 */}
            <LearningHeatmap
              dailyData={learningData}
              weeklyData={weeklyData}
              loading={dataLoading}
              userId={userId}
              compact={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 