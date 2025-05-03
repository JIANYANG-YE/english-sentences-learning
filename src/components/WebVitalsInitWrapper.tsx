"use client";

import React, { Suspense, useEffect } from 'react';
import { initWebVitals } from '@/lib/web-vitals';

// Web Vitals 初始化组件
function WebVitalsInit() {
  useEffect(() => {
    // 仅在客户端初始化
    try {
      initWebVitals();
    } catch (error) {
      console.error('[WebVitalsInit] Error initializing web vitals:', error);
    }
  }, []);
  
  return null;
}

// Web Vitals 初始化包装组件 - 客户端组件
export default function WebVitalsInitWrapper() {
  return (
    <Suspense fallback={null}>
      <WebVitalsInit />
    </Suspense>
  );
} 