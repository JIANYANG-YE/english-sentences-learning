import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeToggle from '@/components/ThemeToggle';
import { useTheme } from '@/hooks/useTheme';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { isDark } = useTheme();

  // 导航菜单项
  const navItems = [
    { name: '首页', href: '/' },
    { name: '课程', href: '/courses' },
    { name: '学习', href: '/study' },
    { name: '练习', href: '/practice' },
    { name: '关于', href: '/about' },
  ];

  return (
    <header className={`${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} shadow-sm transition-colors`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo 和 桌面菜单 */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className={`${isDark ? 'text-blue-400' : 'text-blue-600'} font-bold text-xl transition-colors`}>
                英语学习
              </Link>
            </div>
            
            {/* 桌面导航 */}
            <nav className="hidden md:ml-6 md:flex md:space-x-8">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                      isActive
                        ? `border-blue-500 ${isDark ? 'text-white' : 'text-gray-900'}`
                        : `border-transparent ${isDark ? 'text-gray-300' : 'text-gray-500'} ${isDark ? 'hover:border-gray-600 hover:text-gray-100' : 'hover:border-gray-300 hover:text-gray-700'}`
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* 右侧功能区 */}
          <div className="hidden md:ml-6 md:flex md:items-center">
            {/* 主题切换按钮 */}
            <ThemeToggle className="mr-4" />
            
            <div className="flex-shrink-0">
              <Link 
                href="/login" 
                className={`relative inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md ${isDark ? 'text-gray-900 bg-blue-400 hover:bg-blue-300' : 'text-white bg-blue-600 hover:bg-blue-700'} shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-2 transition-colors`}
              >
                登录
              </Link>
              <Link 
                href="/register" 
                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md ${isDark ? 'border-gray-600 text-gray-200 bg-gray-700 hover:bg-gray-600' : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors`}
              >
                注册
              </Link>
            </div>
          </div>

          {/* 移动端菜单按钮 */}
          <div className="flex items-center md:hidden">
            {/* 主题切换按钮（移动端） */}
            <ThemeToggle className="mr-2" />
            
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`inline-flex items-center justify-center p-2 rounded-md ${isDark ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' : 'text-gray-400 hover:text-gray-500 hover:bg-gray-100'} focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors`}
            >
              <span className="sr-only">打开菜单</span>
              {/* 菜单图标 */}
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* 关闭图标 */}
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 移动端菜单 */}
      {isMenuOpen && (
        <div className={`md:hidden ${isDark ? 'bg-gray-800' : 'bg-white'} transition-colors`}>
          <div className="pt-2 pb-3 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors ${
                    isActive
                      ? `${isDark ? 'bg-gray-700 border-blue-400 text-blue-400' : 'bg-indigo-50 border-blue-500 text-blue-700'}`
                      : `border-transparent ${isDark ? 'text-gray-300 hover:bg-gray-700 hover:border-gray-500' : 'text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'}`
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
          <div className={`pt-4 pb-3 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'} transition-colors`}>
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <Link 
                  href="/login" 
                  className={`relative inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md ${isDark ? 'text-gray-900 bg-blue-400 hover:bg-blue-300' : 'text-white bg-blue-600 hover:bg-blue-700'} shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-2 transition-colors`}
                >
                  登录
                </Link>
                <Link 
                  href="/register" 
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md ${isDark ? 'border-gray-600 text-gray-200 bg-gray-700 hover:bg-gray-600' : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors`}
                >
                  注册
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header; 