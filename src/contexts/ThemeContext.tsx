'use client';

import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useTheme as useNextTheme } from 'next-themes';
import { THEMES } from '@/lib/constants';

type ThemeContextType = {
  theme: string | undefined;
  setTheme: (theme: string) => void;
  resolvedTheme: string | undefined;
  systemTheme: string | undefined;
  toggleTheme: () => void;
  isDark: boolean;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * 主题上下文提供者
 * 基于next-themes，提供主题切换功能
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme, systemTheme } = useNextTheme();

  // 切换主题
  const toggleTheme = () => {
    setTheme(resolvedTheme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK);
  };

  // 防止服务端渲染水合不匹配
  useEffect(() => {
    setMounted(true);
  }, []);

  // 确保服务端和客户端渲染一致
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        resolvedTheme,
        systemTheme,
        toggleTheme,
        isDark: resolvedTheme === THEMES.DARK,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * 使用主题上下文的钩子
 */
export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
}

export default ThemeContext; 