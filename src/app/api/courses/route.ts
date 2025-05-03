import { NextResponse } from 'next/server';

// 模拟课程数据
const DEMO_COURSES = [
  {
    id: 'course-1',
    title: '英语基础入门',
    description: '适合零基础学习者的英语入门课程，从字母和发音开始，循序渐进地学习基本词汇和简单句型。',
    thumbnail: '/globe.svg',
    level: 'beginner',
    lessonsCount: 30,
    completedLessons: 12,
    estimatedTime: '60小时',
    learningProgress: 40,
    tags: ['入门', '基础', '零基础'],
    category: '基础课程',
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-05-15T00:00:00.000Z'
  },
  {
    id: 'course-2',
    title: '日常英语对话',
    description: '掌握日常生活中最常用的英语表达，包括问候、购物、就餐、旅行等场景的实用对话。',
    thumbnail: '/file.svg',
    level: 'beginner',
    lessonsCount: 24,
    completedLessons: 6,
    estimatedTime: '48小时',
    learningProgress: 25,
    tags: ['对话', '口语', '日常'],
    category: '口语课程',
    createdAt: '2023-02-01T00:00:00.000Z',
    updatedAt: '2023-06-01T00:00:00.000Z'
  },
  {
    id: 'course-3',
    title: '商务英语专业课',
    description: '针对职场人士的商务英语课程，包括商务会议、谈判、演讲、邮件写作等职场必备英语技能。',
    thumbnail: '/window.svg',
    level: 'intermediate',
    lessonsCount: 36,
    completedLessons: 2,
    estimatedTime: '72小时',
    learningProgress: 5,
    tags: ['商务', '职场', '专业'],
    category: '专业课程',
    createdAt: '2023-03-15T00:00:00.000Z',
    updatedAt: '2023-07-01T00:00:00.000Z'
  },
  {
    id: 'course-4',
    title: '英语语法精讲',
    description: '系统讲解英语语法规则，从简单句到复合句，从基础时态到复杂语态，全面提升语法应用能力。',
    thumbnail: '/file.svg',
    level: 'intermediate',
    lessonsCount: 40,
    completedLessons: 0,
    estimatedTime: '80小时',
    learningProgress: 0,
    tags: ['语法', '系统', '精讲'],
    category: '语法课程',
    createdAt: '2023-04-10T00:00:00.000Z',
    updatedAt: '2023-07-15T00:00:00.000Z'
  },
  {
    id: 'course-5',
    title: '托福备考专项',
    description: '针对托福考试的全面备考课程，包括听说读写四个部分的技巧讲解和模拟训练。',
    thumbnail: '/globe.svg',
    level: 'advanced',
    lessonsCount: 48,
    completedLessons: 0,
    estimatedTime: '96小时',
    learningProgress: 0,
    tags: ['托福', '考试', '备考'],
    category: '考试课程',
    createdAt: '2023-05-01T00:00:00.000Z',
    updatedAt: '2023-08-01T00:00:00.000Z'
  }
];

export async function GET() {
  try {
    // 在实际应用中，这里应该从数据库获取课程数据
    // 现在我们返回模拟数据
    
    return NextResponse.json({
      status: 'success',
      courses: DEMO_COURSES,
      total: DEMO_COURSES.length,
      page: 1,
      pageSize: 10,
      totalPages: 1
    });
  } catch (error) {
    console.error('获取课程列表错误:', error);
    return NextResponse.json({
      status: 'error',
      message: '获取课程列表失败'
    }, { status: 500 });
  }
} 