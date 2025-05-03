import React, { useState } from 'react';
import Image from 'next/image';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  onClick?: () => void;
}

/**
 * 优化的图片组件
 * 
 * 使用Next.js的Image组件进行图片优化，支持懒加载、模糊占位符等功能
 */
const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  objectFit = 'cover',
  priority = false,
  quality = 75,
  placeholder = 'empty',
  blurDataURL,
  onClick,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  
  // 处理图片加载完成
  const handleLoadingComplete = () => {
    setIsLoading(false);
  };
  
  // 处理图片加载错误
  const handleError = () => {
    setIsLoading(false);
    setError(true);
  };
  
  // 如果图片加载失败，显示占位符
  if (error) {
    return (
      <div 
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <span className="text-gray-400 text-sm">图片加载失败</span>
      </div>
    );
  }
  
  // 为本地图片和远程图片使用不同的处理方式
  const isRemoteImage = src.startsWith('http') || src.startsWith('https') || src.startsWith('//');
  
  return (
    <div className={`relative ${isLoading ? 'bg-gray-100 animate-pulse' : ''} ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        quality={quality}
        priority={priority}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        style={{ 
          objectFit,
          opacity: isLoading ? 0 : 1,
          transition: 'opacity 0.3s'
        }}
        className={`transition-opacity duration-300 ${className}`}
        onLoadingComplete={handleLoadingComplete}
        onError={handleError}
        onClick={onClick}
        unoptimized={!isRemoteImage} // 本地图片不需要进行优化
      />
    </div>
  );
};

export default OptimizedImage; 