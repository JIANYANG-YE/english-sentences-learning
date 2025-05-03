import React from 'react';
import { BaseProps } from '@/types/components';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends BaseProps {
  /**
   * 按钮类型
   */
  type?: 'button' | 'submit' | 'reset';
  
  /**
   * 按钮变体
   */
  variant?: ButtonVariant;
  
  /**
   * 按钮尺寸
   */
  size?: ButtonSize;
  
  /**
   * 是否禁用
   */
  disabled?: boolean;
  
  /**
   * 是否加载中
   */
  loading?: boolean;
  
  /**
   * 前置图标
   */
  startIcon?: React.ReactNode;
  
  /**
   * 后置图标
   */
  endIcon?: React.ReactNode;
  
  /**
   * 点击事件处理
   */
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const Button = ({
  children,
  className = '',
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  startIcon,
  endIcon,
  onClick,
  ...rest
}: ButtonProps) => {
  
  // 尺寸样式映射
  const sizeClasses = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  // 变体样式映射
  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary-dark focus:ring-primary',
    secondary: 'bg-secondary text-white hover:bg-secondary-dark focus:ring-secondary',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-300',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-200',
    link: 'text-primary underline hover:text-primary-dark focus:ring-primary p-0',
  };
  
  // 生成样式类名
  const buttonClasses = [
    'font-medium',
    'rounded',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-2',
    'transition-colors',
    'inline-flex',
    'items-center',
    'justify-center',
    'disabled:opacity-50',
    'disabled:cursor-not-allowed',
    variant !== 'link' && sizeClasses[size],
    variantClasses[variant],
    className,
  ].filter(Boolean).join(' ');
  
  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={onClick}
      {...rest}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          role="status"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      
      {startIcon && !loading && (
        <span className="mr-2">{startIcon}</span>
      )}
      
      {children}
      
      {endIcon && (
        <span className="ml-2">{endIcon}</span>
      )}
    </button>
  );
};

export default Button; 