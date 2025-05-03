// 为缺少类型定义的模块添加声明
declare module 'next-themes' {
  import React from 'react';

  interface ThemeProviderProps {
    attribute?: string;
    defaultTheme?: string;
    children: React.ReactNode;
    forcedTheme?: string;
    disableTransitionOnChange?: boolean;
    enableSystem?: boolean;
    enableColorScheme?: boolean;
    storageKey?: string;
    themes?: string[];
    value?: Record<string, string>;
  }

  export interface UseThemeProps {
    themes: string[];
    forcedTheme?: string;
    setTheme: (theme: string) => void;
    theme?: string;
    resolvedTheme?: string;
    systemTheme?: 'dark' | 'light';
  }

  export const ThemeProvider: React.FC<ThemeProviderProps>;
  export function useTheme(): UseThemeProps;
}

declare module 'web-vitals' {
  type NextWebVitalsMetric = {
    id: string;
    name: string;
    startTime: number;
    value: number;
    label: 'web-vital' | 'custom';
    delta?: number;
    navigationType?: 'navigate' | 'reload' | 'back-forward' | 'prerender';
  };

  export type CLSMetric = NextWebVitalsMetric;
  export type FCPMetric = NextWebVitalsMetric;
  export type FIDMetric = NextWebVitalsMetric;
  export type LCPMetric = NextWebVitalsMetric;
  export type TTFBMetric = NextWebVitalsMetric;

  export function onCLS(callback: (metric: CLSMetric) => void): void;
  export function onFCP(callback: (metric: FCPMetric) => void): void;
  export function onFID(callback: (metric: FIDMetric) => void): void;
  export function onLCP(callback: (metric: LCPMetric) => void): void;
  export function onTTFB(callback: (metric: TTFBMetric) => void): void;
} 