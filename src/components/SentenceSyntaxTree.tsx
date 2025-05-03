'use client';

import { useEffect, useRef, useState } from 'react';

interface SyntaxTreeNode {
  id: string;
  text: string;
  type: string;
  children?: SyntaxTreeNode[];
}

interface SentenceSyntaxTreeProps {
  sentence: string;
  treeData?: SyntaxTreeNode;
  title?: string;
  showReset?: boolean;
}

// 模拟语法节点数据
const mockTreeData: SyntaxTreeNode = {
  id: '1',
  text: 'enjoy',
  type: '谓语',
  children: [
    {
      id: '2',
      text: 'I',
      type: '主语',
      children: []
    },
    {
      id: '3',
      text: 'reading',
      type: '宾语',
      children: []
    },
    {
      id: '4',
      text: '.',
      type: '标点',
      children: []
    }
  ]
};

// 节点类型及其对应的颜色
const nodeColors: Record<string, string> = {
  '主语': 'border-red-500 bg-red-500/20 text-red-200',
  '谓语': 'border-green-500 bg-green-500/20 text-green-200',
  '宾语': 'border-blue-500 bg-blue-500/20 text-blue-200',
  '定语': 'border-yellow-500 bg-yellow-500/20 text-yellow-200',
  '状语': 'border-purple-500 bg-purple-500/20 text-purple-200',
  '补语': 'border-indigo-500 bg-indigo-500/20 text-indigo-200',
  '连词': 'border-pink-500 bg-pink-500/20 text-pink-200',
  '介词': 'border-teal-500 bg-teal-500/20 text-teal-200',
  '标点': 'border-gray-500 bg-gray-500/20 text-gray-200',
  '冠词': 'border-amber-500 bg-amber-500/20 text-amber-200',
  '默认': 'border-gray-500 bg-gray-700/50 text-gray-300'
};

export default function SentenceSyntaxTree({
  sentence,
  treeData = mockTreeData,
  title = '句子依存树',
  showReset = true
}: SentenceSyntaxTreeProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [expanded, setExpanded] = useState(true);
  
  // 重置视图
  const resetView = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };
  
  // 处理缩放
  const handleZoom = (factor: number) => {
    setScale(prevScale => {
      const newScale = prevScale * factor;
      return Math.min(Math.max(newScale, 0.5), 3); // 限制缩放范围
    });
  };
  
  // 处理拖动开始
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };
  
  // 处理拖动中
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    
    setPosition(prev => ({
      x: prev.x + dx,
      y: prev.y + dy
    }));
    
    setDragStart({ x: e.clientX, y: e.clientY });
  };
  
  // 处理拖动结束
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  // 处理滚轮缩放
  const handleWheel = (e: React.WheelEvent) => {
    if (e.deltaY < 0) {
      handleZoom(1.1); // 放大
    } else {
      handleZoom(0.9); // 缩小
    }
  };
  
  // 递归绘制树节点
  const renderTreeNode = (node: SyntaxTreeNode, x: number, y: number, nodeWidth: number, level: number, totalWidth: number) => {
    const nodeHeight = 30;
    const verticalGap = 60;
    const childrenCount = node.children?.length || 0;
    const nodeColor = nodeColors[node.type] || nodeColors['默认'];
    
    // 绘制当前节点
    const elements = [];
    elements.push(
      <g key={node.id} transform={`translate(${x}, ${y})`}>
        <rect
          x={-nodeWidth / 2}
          y={-nodeHeight / 2}
          width={nodeWidth}
          height={nodeHeight}
          rx="6"
          className={`fill-gray-800 stroke-2 ${nodeColor.split(' ')[0]}`}
        />
        <text
          x="0"
          y="0"
          textAnchor="middle"
          dominantBaseline="middle"
          className={`text-xs font-medium ${nodeColor.split(' ')[2]}`}
        >
          {node.text}
        </text>
        <text
          x="0"
          y={-nodeHeight / 2 - 3}
          textAnchor="middle"
          dominantBaseline="auto"
          className="text-[10px] fill-gray-400"
        >
          {node.type}
        </text>
      </g>
    );
    
    // 如果有子节点，递归绘制
    if (childrenCount > 0 && node.children) {
      const childWidth = totalWidth / childrenCount;
      let childX = x - (totalWidth / 2) + (childWidth / 2);
      
      node.children.forEach((child, index) => {
        // 绘制连接线
        elements.push(
          <line
            key={`line-${node.id}-${child.id}`}
            x1={x}
            y1={y + nodeHeight / 2}
            x2={childX}
            y2={y + verticalGap - nodeHeight / 2}
            stroke="#4B5563"
            strokeWidth="1.5"
            strokeDasharray={child.type === '标点' ? "4" : "0"}
          />
        );
        
        // 递归绘制子节点
        elements.push(
          ...renderTreeNode(
            child,
            childX,
            y + verticalGap,
            nodeWidth,
            level + 1,
            childWidth
          )
        );
        
        childX += childWidth;
      });
    }
    
    return elements;
  };
  
  return (
    <div className="bg-gray-900 rounded-lg p-4 h-full">
      <div className="flex justify-between items-center mb-3">
        <div>
          <h3 className="text-white font-medium text-lg">{title}</h3>
          <p className="text-gray-400 text-sm">{sentence}</p>
        </div>
        <div className="flex space-x-2">
          {showReset && (
            <button
              onClick={resetView}
              className="text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 p-1 rounded"
              title="重置视图"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          )}
          <button
            onClick={() => handleZoom(1.2)}
            className="text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 p-1 rounded"
            title="放大"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m4-3h-6" />
            </svg>
          </button>
          <button
            onClick={() => handleZoom(0.8)}
            className="text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 p-1 rounded"
            title="缩小"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
            </svg>
          </button>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 p-1 rounded"
            title={expanded ? "折叠" : "展开"}
          >
            <svg 
              className={`w-5 h-5 transform ${expanded ? 'rotate-0' : 'rotate-180'}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
      
      {expanded && (
        <div 
          className="w-full overflow-hidden rounded-lg bg-gray-800 border border-gray-700 cursor-grab active:cursor-grabbing"
          style={{ height: 250 }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
        >
          <svg
            ref={svgRef}
            width="100%"
            height="100%"
            viewBox="0 0 800 300"
            preserveAspectRatio="xMidYMid meet"
          >
            <g transform={`translate(${400 + position.x}, ${80 + position.y}) scale(${scale})`}>
              {renderTreeNode(treeData, 0, 0, 80, 0, 600)}
            </g>
          </svg>
        </div>
      )}
      
      {/* 图例 */}
      <div className="mt-4 flex flex-wrap gap-2">
        {Object.entries(nodeColors).filter(([key]) => key !== '默认').map(([type, colorClass]) => (
          <div key={type} className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-1 ${colorClass.split(' ')[0].replace('border', 'bg')}`}></div>
            <span className="text-xs text-gray-400">{type}</span>
          </div>
        ))}
      </div>
    </div>
  );
} 