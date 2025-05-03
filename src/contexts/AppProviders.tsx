"use client";

import React, { ReactNode } from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { ThemeProvider } from './ThemeContext';
import { AuthProvider } from './AuthContext';
import { LoadingProvider } from './LoadingContext';
import { ToastProvider } from './ToastContext';

interface AppProvidersProps {
  children: ReactNode;
}

/**
 * 应用上下文提供者
 * 汇总所有应用全局上下文
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <NextThemesProvider attribute="data-theme" defaultTheme="light">
      <ThemeProvider>
        <LoadingProvider>
          <ToastProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </ToastProvider>
        </LoadingProvider>
      </ThemeProvider>
    </NextThemesProvider>
  );
}

export default AppProviders; 