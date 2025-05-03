import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

/**
 * 布局组件
 * 包含导航栏和页脚
 */
interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
} 