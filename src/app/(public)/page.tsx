import React from 'react';
import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';
import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: '英语学习平台 - 首页',
  description: '提供优质的英语学习资源，帮助你提高英语水平。',
};

export default function HomePage() {
  return (
    <MainLayout>
      {/* 英雄区域 */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold sm:text-5xl md:text-6xl">
                <span className="block">让英语学习</span>
                <span className="block text-indigo-300">变得更有效率</span>
              </h1>
              <p className="mt-3 text-base text-gray-300 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                通过我们的平台，轻松掌握英语技能。我们提供针对各种水平的课程、练习和学习资源，
                帮助你在短时间内实现语言突破。
              </p>
              <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/courses"
                    className="rounded-md shadow px-5 py-3 bg-white text-gray-900 font-medium hover:bg-gray-50 text-center"
                  >
                    浏览课程
                  </Link>
                  <Link
                    href="/register"
                    className="rounded-md shadow px-5 py-3 bg-indigo-500 text-white font-medium hover:bg-indigo-600 text-center"
                  >
                    免费注册
                  </Link>
                </div>
              </div>
            </div>
            <div className="mt-12 lg:mt-0 lg:col-span-6">
              <div className="lg:relative lg:h-full">
                <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-full">
                  <Image
                    className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full rounded-lg shadow-xl"
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80"
                    alt="学生学习英语"
                    width={1000}
                    height={600}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 功能特点 */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              为什么选择我们的平台
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              我们提供全面的英语学习解决方案，满足不同学习者的需求。
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
              {/* 特点1 */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">丰富的课程资源</h3>
                  <p className="mt-2 text-base text-gray-500">
                    提供初级到高级的各类课程，涵盖听、说、读、写各个方面，满足不同学习需求。
                  </p>
                </div>
              </div>

              {/* 特点2 */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                    />
                  </svg>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">互动学习体验</h3>
                  <p className="mt-2 text-base text-gray-500">
                    通过互动练习和实时反馈，提高学习效果和参与度，让学习更加有趣高效。
                  </p>
                </div>
              </div>

              {/* 特点3 */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">个性化学习路径</h3>
                  <p className="mt-2 text-base text-gray-500">
                    根据学习者的水平和目标，定制个性化的学习计划，让学习更加高效有针对性。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 热门课程 */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center mb-12">
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              热门课程推荐
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              立即开始你的英语学习之旅。
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* 课程卡片示例 - 可根据实际数据循环生成 */}
            {[1, 2, 3].map((index) => (
              <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
                <Image
                  className="h-48 w-full object-cover"
                  src={`https://source.unsplash.com/random/800x600?english,study&sig=${index}`}
                  alt="课程封面"
                  width={800}
                  height={600}
                />
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      热门
                    </div>
                    <div className="ml-2 px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                      初级
                    </div>
                  </div>
                  <h3 className="mt-3 text-lg font-semibold text-gray-900">
                    {['日常英语会话', '商务英语进阶', '雅思备考专项'][index - 1]}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    {[
                      '掌握日常生活中最常用的英语表达，轻松应对各种场景对话。',
                      '提升商务沟通能力，学习专业术语和表达，助力职场发展。',
                      '针对雅思考试各项技能的专项训练，帮助你取得理想成绩。',
                    ][index - 1]}
                  </p>
                  <div className="mt-4">
                    <Link
                      href={`/courses/${index}`}
                      className="text-sm font-medium text-blue-600 hover:text-blue-500"
                    >
                      查看详情 &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/courses"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              查看全部课程
            </Link>
          </div>
        </div>
      </section>

      {/* 用户反馈 */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              学员心声
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              听听我们的学员怎么说。
            </p>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-3 lg:gap-x-8">
            {[1, 2, 3].map((index) => (
              <div
                key={index}
                className="p-6 border border-gray-200 rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow"
              >
                <div className="flex items-center mb-4">
                  <Image
                    className="h-12 w-12 rounded-full"
                    src={`https://randomuser.me/api/portraits/${index % 2 ? 'women' : 'men'}/${index + 10}.jpg`}
                    alt="用户头像"
                    width={48}
                    height={48}
                  />
                  <div className="ml-4">
                    <h4 className="text-lg font-semibold text-gray-900">
                      {['李明', '张华', '王芳'][index - 1]}
                    </h4>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className="h-5 w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600">
                  {[
                    '通过这个平台学习英语已经半年了，我的英语水平有了显著提高。课程内容生动有趣，老师讲解清晰，非常推荐！',
                    '作为一名职场人士，商务英语课程对我帮助很大。现在我可以更自信地用英语与国际客户沟通了。',
                    '备考雅思期间发现了这个平台，专项训练非常有针对性，最终我获得了理想的分数。感谢平台提供的优质资源！',
                  ][index - 1]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 注册号召 */}
      <section className="bg-indigo-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:items-center lg:justify-between">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              <span className="block">准备好开始你的英语学习之旅了吗？</span>
              <span className="block text-indigo-300">立即注册，获取免费学习资源。</span>
            </h2>
            <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
              <div className="inline-flex rounded-md shadow">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
                >
                  免费注册
                </Link>
              </div>
              <div className="ml-3 inline-flex rounded-md shadow">
                <Link
                  href="/courses"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  浏览课程
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
} 