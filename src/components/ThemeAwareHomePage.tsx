'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/hooks/useTheme';

// 模拟数据
const featuredCourses = [
  {
    id: '1',
    title: '新概念英语第一册',
    description: '从零基础开始，掌握基本英语语法和日常表达',
    imageUrl: '/hero-image.svg',
    level: '初级',
    lessonsCount: 144,
    price: '免费',
    rating: 4.8,
    reviewsCount: 2356
  },
  {
    id: '2',
    title: '新概念英语第二册',
    description: '巩固语法基础，提高阅读和听力理解能力',
    imageUrl: '/hero-image.svg',
    level: '中级',
    lessonsCount: 96,
    price: '¥99',
    rating: 4.9,
    reviewsCount: 1892
  },
  {
    id: '3',
    title: '新概念英语第三册',
    description: '深入学习复杂语法，提高英语应用能力',
    imageUrl: '/hero-image.svg',
    level: '中高级',
    lessonsCount: 60,
    price: '¥129',
    rating: 4.7,
    reviewsCount: 1245
  }
];

const features = [
  {
    id: '1',
    title: '科学的句子学习法',
    description: '通过分析句子结构，掌握语法规则和表达方式',
    icon: '/file.svg'
  },
  {
    id: '2',
    title: '智能复习系统',
    description: '基于艾宾浩斯遗忘曲线，科学安排复习计划',
    icon: '/window.svg'
  },
  {
    id: '3',
    title: '语法解析工具',
    description: '自动分析句子成分，帮助理解句子结构',
    icon: '/globe.svg'
  },
  {
    id: '4',
    title: '个性化学习路径',
    description: '根据学习进度和薄弱点，定制专属学习计划',
    icon: '/next.svg'
  }
];

const testimonials = [
  {
    id: '1',
    name: '张小明',
    avatar: '/icons/icon-72x72.png',
    content: '使用句乐部学习英语已经三个月了，我的英语水平提升很快，尤其是语法理解能力大大增强。',
    role: '大学生'
  },
  {
    id: '2',
    name: '李华',
    avatar: '/icons/icon-72x72.png',
    content: '句子学习法真的很有效，现在我不仅能看懂复杂的英语句子，还能模仿这些句子结构来表达自己的想法。',
    role: '上班族'
  },
  {
    id: '3',
    name: '王芳',
    avatar: '/icons/icon-72x72.png',
    content: '智能复习功能太棒了，我不用担心记不住学过的内容，系统会在合适的时间提醒我复习。',
    role: '英语爱好者'
  }
];

export default function ThemeAwareHomePage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  let isDark = false;
  
  try {
    // 尝试使用主题上下文，如果失败则使用默认值
    const { isDark: themeIsDark } = useTheme();
    isDark = themeIsDark;
  } catch (error) {
    console.error('主题上下文加载失败:', error);
    // 继续使用默认值 isDark = false
  }
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} transition-colors`}>
      {/* 英雄区域 */}
      <div className="relative bg-blue-700 text-white">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="/hero-image.svg"
            alt="英语学习背景"
            fill
            className="object-contain"
            priority
            sizes="100vw"
          />
        </div>
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">通过句子学习法，轻松掌握英语</h1>
            <p className="text-xl mb-8">
              句乐部采用创新的句子学习法，帮助你快速提升英语水平，从基础到高级一站式学习
            </p>
            <form onSubmit={handleSearch} className="mb-8 max-w-xl mx-auto">
              <div className="flex rounded-full overflow-hidden shadow-lg">
                <input
                  type="text"
                  placeholder="搜索课程、句子或语法知识"
                  className={`flex-1 px-6 py-4 ${isDark ? 'bg-gray-700 text-white placeholder-gray-400' : 'bg-white text-gray-800'} focus:outline-none transition-colors`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                  type="submit"
                  className="bg-blue-900 text-white px-6 py-4 hover:bg-blue-800 transition-colors"
                >
                  搜索
                </button>
              </div>
            </form>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/shop"
                className="px-8 py-3 rounded-full bg-white text-blue-700 font-medium hover:bg-gray-100 transition-colors"
              >
                浏览课程
              </Link>
              <Link
                href="/dashboard"
                className="px-8 py-3 rounded-full bg-transparent border-2 border-white font-medium hover:bg-white hover:text-blue-700 transition-colors"
              >
                免费试用
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 特色区域 */}
      <div className={`py-16 ${isDark ? 'bg-gray-800' : 'bg-gray-50'} transition-colors`}>
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">我们的特色</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div key={feature.id} className={`${isDark ? 'bg-gray-700' : 'bg-white'} p-6 rounded-lg shadow-md flex flex-col items-center text-center transition-colors`}>
                <div className="w-16 h-16 mb-4 relative">
                  <Image
                    src={feature.icon}
                    alt={feature.title}
                    width={64}
                    height={64}
                    className={isDark ? 'filter invert' : ''}
                  />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} transition-colors`}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 精选课程 */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">精选课程</h2>
            <Link href="/shop" className={`${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} font-medium transition-colors`}>
              查看全部 &rarr;
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses.map((course) => (
              <div key={course.id} className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg overflow-hidden shadow-md border flex flex-col transition-colors`}>
                <div className="relative h-48">
                  <Image
                    src={course.imageUrl}
                    alt={course.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold">{course.title}</h3>
                    <span className={`px-3 py-1 ${isDark ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800'} rounded-full text-xs font-medium transition-colors`}>
                      {course.level}
                    </span>
                  </div>
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-4 flex-1 transition-colors`}>{course.description}</p>
                  <div className={`flex justify-between items-center text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} mb-4 transition-colors`}>
                    <span>{course.lessonsCount} 课时</span>
                    <div className="flex items-center">
                      <span className="text-yellow-500 mr-1">★</span>
                      <span>{course.rating} ({course.reviewsCount})</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`text-lg font-bold ${isDark ? 'text-blue-400' : 'text-blue-700'} transition-colors`}>{course.price}</span>
                    <Link
                      href={`/courses/${course.id}`}
                      className={`px-4 py-2 ${isDark ? 'bg-blue-600 hover:bg-blue-500' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-md transition-colors`}
                    >
                      了解详情
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 用户评价 */}
      <div className={`py-16 ${isDark ? 'bg-gray-800' : 'bg-gray-50'} transition-colors`}>
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">用户评价</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className={`${isDark ? 'bg-gray-700' : 'bg-white'} p-6 rounded-lg shadow-md transition-colors`}>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4 relative">
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold">{testimonial.name}</h3>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} transition-colors`}>{testimonial.role}</p>
                  </div>
                </div>
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} transition-colors`}>"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 号召行动 */}
      <div className="py-16 bg-blue-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">开始你的英语学习之旅</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            加入句乐部，用科学的方法学习英语，让你的英语水平快速提升
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/register"
              className="px-8 py-3 rounded-full bg-white text-blue-700 font-medium hover:bg-gray-100 transition-colors"
            >
              免费注册
            </Link>
            <Link
              href="/about"
              className="px-8 py-3 rounded-full bg-transparent border-2 border-white font-medium hover:bg-white hover:text-blue-700 transition-colors"
            >
              了解更多
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 