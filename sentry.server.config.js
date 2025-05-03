// 此文件配置了Sentry在服务端的行为
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  // 设置为10以触发服务端性能采样
  tracesSampleRate: 0.1,
  // 设置环境，便于在Sentry中区分
  environment: process.env.NODE_ENV,
  // ...其他设置
  enabled: process.env.NODE_ENV === 'production',
  release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || 'development',
  beforeSend(event) {
    // 在服务端排除特定类型的错误
    const ignoreErrors = [
      'document is not defined',
      'window is not defined',
      'ResizeObserver loop limit exceeded',
    ];
    
    if (event.exception && event.exception.values) {
      for (const exception of event.exception.values) {
        if (ignoreErrors.some(ignored => exception.value && exception.value.includes(ignored))) {
          return null;
        }
      }
    }
    
    if (process.env.NODE_ENV !== 'production') {
      return null; // 在开发环境中完全禁用
    }
    
    return event;
  },
  // 可以配置拦截器
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Sentry.Integrations.Express({ app: undefined }),
    new Sentry.Integrations.Postgres(),
  ],
}); 