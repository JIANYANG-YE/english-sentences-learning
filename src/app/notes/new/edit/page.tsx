'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NewNotePage() {
  const router = useRouter();
  
  useEffect(() => {
    // 重定向到编辑页面，使用 'new' 作为 ID 表示创建新笔记
    router.push('/notes/new');
  }, [router]);
  
  return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
} 