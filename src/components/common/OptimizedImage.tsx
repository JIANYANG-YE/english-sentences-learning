'use client';

import React from 'react';
import Image from 'next/image';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  onClick?: () => void;
}

/**
 * 优化的图像组件
 * 使用Next.js的Image组件进行图像优化
 */
const OptimizedImage = ({ 
  src, 
  alt, 
  width, 
  height, 
  className = '',
  priority = false,
  objectFit = 'cover',
  onClick
}: OptimizedImageProps) => {
  return (
    <div className={`relative w-full h-full ${className}`} onClick={onClick}>
      <Image 
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`object-${objectFit}`}
        style={{ width: '100%', height: '100%' }}
        priority={priority}
        unoptimized={src.includes('placehold.co') || src.endsWith('.svg')} // 对于placehold.co和svg图片不进行优化
      />
    </div>
  );
};

export default OptimizedImage; 