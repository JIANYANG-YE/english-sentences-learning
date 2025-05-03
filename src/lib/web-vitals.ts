import { CLSMetric, FCPMetric, FIDMetric, LCPMetric, TTFBMetric, onCLS, onFCP, onFID, onLCP, onTTFB } from 'web-vitals';
import { logService } from '@/services/logService';

// 定义指标类型
type WebVitalName = 'CLS' | 'FCP' | 'FID' | 'LCP' | 'TTFB';
export type WebVitalMetric = CLSMetric | FCPMetric | FIDMetric | LCPMetric | TTFBMetric;

/**
 * 计算Web Vitals指标的满意、需要改进和糟糕的阈值
 * @see https://web.dev/vitals/
 */
export const getWebVitalRating = (name: WebVitalName, value: number): 'good' | 'needs-improvement' | 'poor' => {
  switch (name) {
    case 'CLS':
      return value <= 0.1 ? 'good' : value <= 0.25 ? 'needs-improvement' : 'poor';
    case 'FCP':
      return value <= 1800 ? 'good' : value <= 3000 ? 'needs-improvement' : 'poor';
    case 'FID':
      return value <= 100 ? 'good' : value <= 300 ? 'needs-improvement' : 'poor';
    case 'LCP':
      return value <= 2500 ? 'good' : value <= 4000 ? 'needs-improvement' : 'poor';
    case 'TTFB':
      return value <= 800 ? 'good' : value <= 1800 ? 'needs-improvement' : 'poor';
    default:
      return 'poor';
  }
};

/**
 * 汇报Web Vitals指标
 */
const reportWebVitals = (metric: WebVitalMetric): void => {
  const name = metric.name as WebVitalName;
  const value = metric.value;
  const id = metric.id;
  const rating = getWebVitalRating(name, value);
  
  // 在控制台上打印指标
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[Web Vitals] ${name}: ${value} (${rating})`);
  }

  // 使用日志服务记录
  logService.info(`Web Vitals: ${name}`, {
    metric: {
      name,
      value,
      id,
      rating,
      delta: metric.delta,
      navigationType: metric.navigationType
    }
  });

  // 如果使用Sentry，也可以发送到Sentry
  if ((window as any).Sentry) {
    (window as any).Sentry.captureMessage(`Web Vitals: ${name}`, {
      level: rating === 'poor' ? 'warning' : 'info',
      tags: {
        webVital: name,
        webVitalValue: Math.round(value),
        webVitalRating: rating,
      },
    });
  }

  // 如果使用Google Analytics，也可以发送到GA
  if ((window as any).gtag) {
    (window as any).gtag('event', name, {
      event_category: 'Web Vitals',
      event_label: id,
      value: Math.round(name === 'CLS' ? value * 1000 : value),
      non_interaction: true,
    });
  }
};

/**
 * 初始化Web Vitals检测
 */
export const initWebVitals = (): void => {
  try {
    onCLS(reportWebVitals);
    onFCP(reportWebVitals);
    onFID(reportWebVitals);
    onLCP(reportWebVitals);
    onTTFB(reportWebVitals);
  } catch (err) {
    console.error('[Web Vitals] Failed to initialize:', err);
  }
}; 