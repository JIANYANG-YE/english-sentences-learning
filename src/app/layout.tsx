import React from 'react';
import { AppProviders } from '../contexts/AppProviders';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/global.css';
import { headers } from 'next/headers';
import Script from 'next/script';
import WebVitalsInitWrapper from '@/components/WebVitalsInitWrapper';

// 使用Inter字体
const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: '英语学习平台',
  description: '提供优质的英语学习资源，帮助你提高英语水平。',
};

/**
 * 根布局组件
 * 定义整个应用的全局布局框架
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="英语学习平台 - 提高英语水平的最佳选择" />
      </head>
      <body className={`${inter.variable} font-sans`}>
        <AppProviders>
          <WebVitalsInitWrapper />
          {children}
        </AppProviders>
        
        {/* Google Analytics 脚本 */}
        {process.env.NODE_ENV === 'production' && (
          <>
            <Script 
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
