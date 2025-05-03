import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  footer?: ReactNode;
  headerAction?: ReactNode;
  hover?: boolean;
  bordered?: boolean;
  shadow?: 'none' | 'sm' | 'md' | 'lg';
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  title,
  subtitle,
  footer,
  headerAction,
  hover = false,
  bordered = false,
  shadow = 'md',
}) => {
  // 阴影样式
  const shadowStyles = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow',
    lg: 'shadow-lg',
  };

  // 组合样式
  const cardClassName = `
    bg-white rounded-lg overflow-hidden
    ${bordered ? 'border border-gray-200' : ''}
    ${hover ? 'transition-all duration-200 hover:translate-y-[-4px]' : ''}
    ${shadowStyles[shadow]}
    ${className}
  `;

  // 是否有头部内容
  const hasHeader = title || subtitle || headerAction;

  return (
    <div className={cardClassName}>
      {hasHeader && (
        <div className="p-4 border-b border-gray-100 flex justify-between items-start">
          <div>
            {title && <h3 className="text-lg font-medium text-gray-900">{title}</h3>}
            {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
          </div>
          {headerAction && <div className="ml-4">{headerAction}</div>}
        </div>
      )}
      
      <div className="p-4">{children}</div>
      
      {footer && (
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card; 