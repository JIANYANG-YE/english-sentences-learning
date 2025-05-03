// 此文件配置了Sentry在前端的行为
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  // 设置为10以触发浏览器性能采样
  tracesSampleRate: 0.1,
  // 设置环境，便于在Sentry中区分
  environment: process.env.NODE_ENV,
  // ...其他设置
  // 注意：如果您使用自定义服务器，请确保将'server'设置为false
  enabled: process.env.NODE_ENV === 'production',
  release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || 'development',
  // 发送错误前允许过滤
  beforeSend(event) {
    if (process.env.NODE_ENV !== 'production') {
      return null; // 在开发环境中完全禁用
    }
    return event;
  },
  // 发送错误前允许添加对象
  beforeBreadcrumb(breadcrumb) {
    // 对页面URL进行处理，去除敏感信息
    if (breadcrumb.category === 'navigation' && breadcrumb.data && breadcrumb.data.to) {
      // 清除URL中的敏感参数（如token等）
      try {
        const url = new URL(breadcrumb.data.to);
        url.searchParams.delete('token');
        url.searchParams.delete('accessToken');
        breadcrumb.data.to = url.toString();
      } catch (e) {
        // 忽略URL解析错误
      }
    }
    return breadcrumb;
  },
  // 可以配置拦截器
  integrations: [
    new Sentry.BrowserTracing({
      tracePropagationTargets: ['localhost', /^https:\/\/yourdomain\.com/],
    }),
    new Sentry.Replay(),
  ],
  // 录制用户会话
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
}); 