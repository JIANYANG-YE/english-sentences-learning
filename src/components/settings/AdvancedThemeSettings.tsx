'use client';

import React from 'react';
import { useTheme } from '@/hooks/useTheme';
import { PRIMARY, SECONDARY } from '@/styles/colors';
import { PresetColorPicker } from './ColorPicker';

/**
 * 高级主题设置组件
 * 允许用户自定义主题颜色
 */
export default function AdvancedThemeSettings() {
  const { isDark } = useTheme();
  
  // 保存设置到本地存储
  const saveSettings = (name: string, value: string) => {
    if (typeof window !== 'undefined') {
      const savedSettings = localStorage.getItem('themeSettings') || '{}';
      const settings = JSON.parse(savedSettings);
      settings[name] = value;
      localStorage.setItem('themeSettings', JSON.stringify(settings));
    }
  };
  
  // 加载存储的设置
  const loadSettings = React.useCallback(() => {
    if (typeof window !== 'undefined') {
      const savedSettings = localStorage.getItem('themeSettings');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        Object.entries(settings).forEach(([name, value]) => {
          if (typeof value === 'string') {
            document.documentElement.style.setProperty(`--${name}`, value as string);
          }
        });
      }
    }
  }, []);
  
  // 组件挂载时加载设置
  React.useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  return (
    <div className={`rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'} border ${isDark ? 'border-gray-700' : 'border-gray-200'} p-4`}>
      <h3 className="text-lg font-medium mb-4">高级主题设置</h3>
      
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-2">主色调</h4>
          <PresetColorPicker
            label="主要颜色"
            colorVariable="color-primary"
            defaultColor={PRIMARY.DEFAULT}
            presets={[
              '#4F46E5', // 靛蓝
              '#2563EB', // 蓝色
              '#0891B2', // 青色
              '#059669', // 绿色
              '#7C3AED', // 紫色
              '#DB2777', // 粉色
            ]}
            onChange={(color) => saveSettings('color-primary', color)}
          />
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-2">辅助色调</h4>
          <PresetColorPicker
            label="辅助颜色"
            colorVariable="color-secondary"
            defaultColor={SECONDARY.DEFAULT}
            presets={[
              '#10B981', // 绿色
              '#0EA5E9', // 天蓝色
              '#8B5CF6', // 紫色
              '#F59E0B', // 琥珀色
              '#EF4444', // 红色
              '#EC4899', // 粉色
            ]}
            onChange={(color) => saveSettings('color-secondary', color)}
          />
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-2">功能色调</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PresetColorPicker
              label="成功色调"
              colorVariable="color-success"
              defaultColor="#10B981"
              presets={[]}
              onChange={(color) => saveSettings('color-success', color)}
            />
            
            <PresetColorPicker
              label="错误色调"
              colorVariable="color-error"
              defaultColor="#EF4444"
              presets={[]}
              onChange={(color) => saveSettings('color-error', color)}
            />
            
            <PresetColorPicker
              label="警告色调"
              colorVariable="color-warning"
              defaultColor="#F59E0B"
              presets={[]}
              onChange={(color) => saveSettings('color-warning', color)}
            />
            
            <PresetColorPicker
              label="信息色调"
              colorVariable="color-info"
              defaultColor="#3B82F6"
              presets={[]}
              onChange={(color) => saveSettings('color-info', color)}
            />
          </div>
        </div>
        
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => {
              // 清除自定义主题设置
              localStorage.removeItem('themeSettings');
              // 重新加载页面以应用默认设置
              window.location.reload();
            }}
            className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md text-sm font-medium transition-colors"
          >
            重置所有颜色设置
          </button>
        </div>
      </div>
    </div>
  );
} 