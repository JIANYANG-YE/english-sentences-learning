'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';

export default function Sidebar() {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };
  
  return (
    <aside className={`${collapsed ? 'w-16' : 'w-64'} bg-white shadow-md h-screen fixed transition-all duration-300`}>
      {/* 应用Logo */}
      <div className="p-4 border-b flex items-center">
        <Link href="/" className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
          </svg>
          {!collapsed && <span className="font-bold text-xl text-gray-800 ml-2">句子学英语</span>}
        </Link>
        <button
          onClick={toggleSidebar}
          className="ml-auto text-gray-500 hover:text-gray-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {collapsed ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            )}
          </svg>
        </button>
      </div>
      
      {/* 用户区域 */}
      <div className="p-4 border-b">
        {isAuthenticated ? (
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 font-semibold">
              {user?.username?.charAt(0) || '用'}
            </div>
            {!collapsed && (
              <div className="ml-3">
                <p className="font-medium text-gray-700">{user?.username || '用户'}</p>
                <Link href="/dashboard" className="text-sm text-blue-600 hover:text-blue-800">
                  学习中心
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-semibold">
              游
            </div>
            {!collapsed && (
              <div className="ml-3">
                <p className="font-medium text-gray-700">你好，游客</p>
                <Link href="/login" className="text-sm text-blue-600 hover:text-blue-800">
                  登录/注册
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* 导航菜单 */}
      <nav className="p-2">
        <ul className="space-y-1">
          <MenuItem
            href="/"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            }
            label="首页"
            collapsed={collapsed}
            active={pathname === '/'}
          />
          <MenuItem
            href="/my-courses"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            }
            label="我的课程"
            collapsed={collapsed}
            active={pathname === '/my-courses'}
          />
          <MenuItem
            href="/shop"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            }
            label="课程商城"
            collapsed={collapsed}
            active={pathname === '/shop'}
          />
          <MenuItem
            href="/practice"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            }
            label="练习"
            collapsed={collapsed}
            active={pathname === '/practice'}
          />
          <MenuItem
            href="/notes"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            }
            label="笔记本"
            collapsed={collapsed}
            active={pathname === '/notes'}
          />
          <MenuItem
            href="/books"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            }
            label="教材"
            collapsed={collapsed}
            active={pathname === '/books'}
          />
        </ul>
      </nav>
      
      {/* 底部版本信息 */}
      {!collapsed && (
        <div className="absolute bottom-0 w-full p-4 text-xs text-gray-500 border-t">
          <p>句子学英语 v1.0.0</p>
          <p>&copy; 2023-2024</p>
        </div>
      )}
    </aside>
  );
}

// 菜单项组件
interface MenuItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
  collapsed: boolean;
}

function MenuItem({ href, icon, label, active, collapsed }: MenuItemProps) {
  return (
    <li>
      <Link
        href={href}
        className={`flex items-center p-3 rounded-lg ${
          active
            ? 'bg-blue-50 text-blue-700'
            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
        } group transition-all`}
        title={collapsed ? label : ''}
      >
        <span className={`${active ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'}`}>
          {icon}
        </span>
        {!collapsed && <span className="ml-3">{label}</span>}
      </Link>
    </li>
  );
} 