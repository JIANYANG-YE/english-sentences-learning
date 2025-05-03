import React from 'react';
import { render, screen, fireEvent } from '@/utils/test-utils';
import Button from '../Button';

describe('Button组件', () => {
  test('渲染按钮文本', () => {
    render(<Button>点击我</Button>);
    expect(screen.getByText('点击我')).toBeInTheDocument();
  });

  test('点击按钮触发onClick事件', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>点击我</Button>);
    fireEvent.click(screen.getByText('点击我'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('禁用按钮不触发点击事件', () => {
    const handleClick = jest.fn();
    render(<Button disabled onClick={handleClick}>点击我</Button>);
    fireEvent.click(screen.getByText('点击我'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  test('应用自定义className', () => {
    render(<Button className="custom-class">点击我</Button>);
    expect(screen.getByText('点击我')).toHaveClass('custom-class');
  });

  test('渲染不同的变体', () => {
    const { rerender } = render(<Button variant="primary">主要按钮</Button>);
    expect(screen.getByText('主要按钮')).toHaveClass('bg-primary');

    rerender(<Button variant="secondary">次要按钮</Button>);
    expect(screen.getByText('次要按钮')).toHaveClass('bg-secondary');

    rerender(<Button variant="outline">轮廓按钮</Button>);
    expect(screen.getByText('轮廓按钮')).toHaveClass('border');
  });

  test('渲染不同的尺寸', () => {
    const { rerender } = render(<Button size="sm">小按钮</Button>);
    expect(screen.getByText('小按钮')).toHaveClass('px-3 py-1 text-sm');

    rerender(<Button size="md">中按钮</Button>);
    expect(screen.getByText('中按钮')).toHaveClass('px-4 py-2 text-base');

    rerender(<Button size="lg">大按钮</Button>);
    expect(screen.getByText('大按钮')).toHaveClass('px-6 py-3 text-lg');
  });

  test('渲染loading状态', () => {
    render(<Button loading>加载中</Button>);
    expect(screen.getByText('加载中')).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  test('渲染带图标的按钮', () => {
    render(
      <Button 
        startIcon={<span data-testid="start-icon">&#x1F514;</span>}
        endIcon={<span data-testid="end-icon">&#x1F514;</span>}
      >
        带图标按钮
      </Button>
    );
    
    expect(screen.getByText('带图标按钮')).toBeInTheDocument();
    expect(screen.getByTestId('start-icon')).toBeInTheDocument();
    expect(screen.getByTestId('end-icon')).toBeInTheDocument();
  });
}); 