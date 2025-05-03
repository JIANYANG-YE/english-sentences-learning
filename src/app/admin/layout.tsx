'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FiGrid, 
  FiUpload, 
  FiSettings, 
  FiUsers, 
  FiPackage, 
  FiBarChart2,
  FiMenu, 
  FiX 
} from 'react-icons/fi';

/**
 * 管理后台布局组件
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const navItems = [
    { 
      name: '仪表板', 
      href: '/admin', 
      icon: <FiGrid className="mr-3" /> 
    },
    { 
      name: '内容管理', 
      href: '/admin/content-management', 
      icon: <FiUpload className="mr-3" /> 
    },
    { 
      name: '课程包管理', 
      href: '/admin/course-packages', 
      icon: <FiPackage className="mr-3" /> 
    },
    { 
      name: '用户管理', 
      href: '/admin/users', 
      icon: <FiUsers className="mr-3" /> 
    },
    { 
      name: '统计分析', 
      href: '/admin/analytics', 
      icon: <FiBarChart2 className="mr-3" /> 
    },
    { 
      name: '系统设置', 
      href: '/admin/settings', 
      icon: <FiSettings className="mr-3" /> 
    },
  ];
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* 移动端侧边栏遮罩 */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* 侧边栏 */}
      <div 
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <div className="flex items-center">
            <Link href="/admin" className="text-xl font-bold text-blue-600">
              管理后台
            </Link>
          </div>
          <button
            className="p-2 rounded-md lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="px-4 py-6">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link 
                  href={item.href}
                  className={`flex items-center px-4 py-3 rounded-md text-sm font-medium ${
                    pathname === item.href
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                  }`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      
      {/* 主内容区 */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* 顶部导航栏 */}
        <header className="flex items-center justify-between h-16 px-6 bg-white border-b">
          <button
            className="p-2 rounded-md lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <FiMenu className="w-6 h-6" />
          </button>
          
          <div className="flex items-center ml-auto">
            <div className="relative">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">管理员</span>
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  A
                </div>
              </div>
            </div>
          </div>
        </header>
        
        {/* 页面内容 */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
} 