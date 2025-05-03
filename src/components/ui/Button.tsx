import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import cn from 'classnames';

// 按钮变体类型
export type ButtonVariant = 
  | 'primary' 
  | 'secondary' 
  | 'outline' 
  | 'ghost' 
  | 'link'
  | 'success'
  | 'error'
  | 'warning';

// 按钮尺寸类型
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// 按钮属性接口
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  isFullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

// 按钮变体样式映射
const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-white hover:bg-primary-dark focus:ring-primary/30',
  secondary: 'bg-secondary text-white hover:bg-secondary-dark focus:ring-secondary/30',
  outline: 'border border-border bg-transparent hover:bg-hover focus:ring-primary/20',
  ghost: 'bg-transparent hover:bg-hover focus:ring-primary/20',
  link: 'bg-transparent underline underline-offset-4 hover:text-primary focus:ring-primary/20 p-0',
  success: 'bg-success text-white hover:bg-success/90 focus:ring-success/30',
  error: 'bg-error text-white hover:bg-error/90 focus:ring-error/30',
  warning: 'bg-warning text-white hover:bg-warning/90 focus:ring-warning/30',
};

// 按钮尺寸样式映射
const sizeStyles: Record<ButtonSize, string> = {
  xs: 'text-xs px-2 py-1 h-6',
  sm: 'text-sm px-3 py-1.5 h-8',
  md: 'text-base px-4 py-2 h-10',
  lg: 'text-lg px-5 py-2.5 h-12',
  xl: 'text-xl px-6 py-3 h-14',
};

// 使用forwardRef创建Button组件
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      isFullWidth = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    // 组合按钮样式
    const buttonClasses = cn(
      // 基础样式
      'inline-flex items-center justify-center font-medium rounded transition-colors',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:opacity-50 disabled:pointer-events-none',
      
      // 变体样式
      variantStyles[variant],
      
      // 尺寸样式
      sizeStyles[size],
      
      // 全宽样式
      isFullWidth ? 'w-full' : '',
      
      // 加载状态样式
      isLoading ? 'relative text-transparent pointer-events-none' : '',
      
      // 自定义类名
      className
    );

    return (
      <button
        ref={ref}
        className={buttonClasses}
        disabled={disabled || isLoading}
        {...props}
      >
        {/* 左侧图标 */}
        {leftIcon && <span className="mr-2">{leftIcon}</span>}
        
        {/* 按钮内容 */}
        {children}
        
        {/* 右侧图标 */}
        {rightIcon && <span className="ml-2">{rightIcon}</span>}
        
        {/* 加载指示器 */}
        {isLoading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <svg
              className="animate-spin h-5 w-5 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button; 