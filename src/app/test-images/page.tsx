'use client';

import React from 'react';
import Image from 'next/image';
import OptimizedImage from '@/components/OptimizedImage';

export default function TestImages() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">图片测试页面</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">普通img标签</h2>
          <div className="w-full h-64 relative">
            <img 
              src="https://placehold.co/400x300/blue/white?text=普通img标签" 
              alt="普通img测试"
              className="w-full h-full object-cover rounded-md"
            />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Next.js Image组件</h2>
          <div className="w-full h-64 relative">
            <Image 
              src="https://placehold.co/400x300/green/white?text=Next.js图片" 
              alt="Next.js图片测试"
              width={400}
              height={300}
              className="object-cover rounded-md"
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Next.js Image (unoptimized)</h2>
          <div className="w-full h-64 relative">
            <Image 
              src="https://placehold.co/400x300/purple/white?text=unoptimized图片" 
              alt="Unoptimized图片测试"
              width={400}
              height={300}
              className="object-cover rounded-md"
              style={{ width: '100%', height: '100%' }}
              unoptimized
            />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">自定义OptimizedImage组件</h2>
          <div className="w-full h-64 relative">
            <OptimizedImage 
              src="https://placehold.co/400x300/red/white?text=自定义组件" 
              alt="自定义组件测试"
              width={400}
              height={300}
              className="rounded-md"
            />
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">本地SVG图片测试</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="relative h-40">
            <Image 
              src="/hero-image.svg"
              alt="本地SVG图片"
              width={200}
              height={160}
              className="object-contain"
              style={{ width: '100%', height: '100%' }}
            />
          </div>
          <div className="relative h-40">
            <Image 
              src="/globe.svg"
              alt="本地SVG图片"
              width={200}
              height={160}
              className="object-contain"
              style={{ width: '100%', height: '100%' }}
            />
          </div>
          <div className="relative h-40">
            <Image 
              src="/file.svg"
              alt="本地SVG图片"
              width={200}
              height={160}
              className="object-contain"
              style={{ width: '100%', height: '100%' }}
            />
          </div>
          <div className="relative h-40">
            <Image 
              src="/window.svg"
              alt="本地SVG图片"
              width={200}
              height={160}
              className="object-contain"
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 