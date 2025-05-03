import Image from 'next/image';
import Link from 'next/link';

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
  },
  {
    id: '2',
    title: '新概念英语第二册',
    description: '巩固语法基础，提高阅读和听力理解能力',
    imageUrl: '/hero-image.svg',
    level: '中级',
    lessonsCount: 96,
    price: '¥99',
  },
  {
    id: '3',
    title: '新概念英语第三册',
    description: '深入学习复杂语法，提高英语应用能力',
    imageUrl: '/hero-image.svg',
    level: '中高级',
    lessonsCount: 60,
    price: '¥129',
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

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
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
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">我们的特色</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div key={feature.id} className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
                <div className="w-16 h-16 mb-4 relative">
                  <Image
                    src={feature.icon}
                    alt={feature.title}
                    width={64}
                    height={64}
                  />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
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
            <Link href="/shop" className="text-blue-600 hover:text-blue-800 font-medium">
              查看全部 &rarr;
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses.map((course) => (
              <div key={course.id} className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-200 flex flex-col">
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
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      {course.level}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4 flex-1">{course.description}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                    <span>{course.lessonsCount} 课时</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-blue-700">{course.price}</span>
                    <Link
                      href={`/courses/${course.id}`}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
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

      {/* 简单页脚 */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>© 2025 英语句子学习平台. 保留所有权利.</p>
        </div>
      </footer>
    </div>
  );
}
