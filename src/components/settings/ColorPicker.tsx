'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { PRIMARY, SECONDARY } from '@/styles/colors';

interface ColorPickerProps {
  label: string;
  colorVariable: string;
  defaultColor: string;
  onChange?: (color: string) => void;
}

/**
 * 颜色选择器组件
 * 允许用户选择和预览颜色
 */
export default function ColorPicker({ 
  label, 
  colorVariable, 
  defaultColor, 
  onChange 
}: ColorPickerProps) {
  const { isDark, setCssVar } = useTheme();
  const [color, setColor] = useState<string>(defaultColor);
  
  // 处理颜色变化
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setColor(newColor);
    
    // 更新CSS变量
    setCssVar(colorVariable, newColor);
    
    // 调用onChange回调
    if (onChange) {
      onChange(newColor);
    }
  };
  
  // 重置为默认颜色
  const handleReset = () => {
    setColor(defaultColor);
    setCssVar(colorVariable, defaultColor);
    
    if (onChange) {
      onChange(defaultColor);
    }
  };
  
  // 组件挂载时设置初始颜色
  useEffect(() => {
    setColor(defaultColor);
  }, [defaultColor]);

  return (
    <div className={`mb-4 p-3 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'} border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium">{label}</label>
        <button
          onClick={handleReset}
          className="text-xs px-2 py-1 rounded text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          重置
        </button>
      </div>
      
      <div className="flex items-center space-x-3">
        <div 
          className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-600" 
          style={{ backgroundColor: color }}
        />
        
        <input
          type="color"
          value={color}
          onChange={handleColorChange}
          className="w-full h-8 cursor-pointer"
        />
      </div>
    </div>
  );
}

/**
 * 预设颜色选择器
 * 提供一组预定义的颜色供用户选择
 */
export function PresetColorPicker({ 
  label, 
  colorVariable, 
  defaultColor, 
  presets = [],
  onChange 
}: ColorPickerProps & { presets: string[] }) {
  const { isDark, setCssVar } = useTheme();
  const [color, setColor] = useState<string>(defaultColor);
  
  // 选择预设颜色
  const handlePresetSelect = (preset: string) => {
    setColor(preset);
    setCssVar(colorVariable, preset);
    
    if (onChange) {
      onChange(preset);
    }
  };
  
  // 处理颜色变化
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setColor(newColor);
    setCssVar(colorVariable, newColor);
    
    if (onChange) {
      onChange(newColor);
    }
  };
  
  // 组件挂载时设置初始颜色
  useEffect(() => {
    setColor(defaultColor);
  }, [defaultColor]);

  // 默认预设颜色
  const defaultPresets = presets.length > 0 ? presets : [
    PRIMARY.light,
    PRIMARY.DEFAULT,
    PRIMARY.dark,
    SECONDARY.light,
    SECONDARY.DEFAULT,
    SECONDARY.dark,
    '#EF4444', // 红色
    '#F59E0B', // 橙色
    '#10B981', // 绿色
    '#3B82F6', // 蓝色
    '#8B5CF6', // 紫色
    '#EC4899', // 粉色
  ];

  return (
    <div className={`mb-4 p-3 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'} border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
      <div className="mb-2">
        <label className="text-sm font-medium block mb-2">{label}</label>
        
        <div className="grid grid-cols-6 gap-2 mb-3">
          {defaultPresets.map((preset, index) => (
            <button
              key={index}
              onClick={() => handlePresetSelect(preset)}
              className={`w-8 h-8 rounded-full border-2 ${
                color === preset ? 'border-gray-400 dark:border-gray-300' : 'border-transparent'
              }`}
              style={{ backgroundColor: preset }}
              aria-label={`选择颜色 ${preset}`}
            />
          ))}
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <div 
          className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600" 
          style={{ backgroundColor: color }}
        />
        
        <input
          type="color"
          value={color}
          onChange={handleColorChange}
          className="w-full h-8 cursor-pointer"
        />
      </div>
    </div>
  );
} 