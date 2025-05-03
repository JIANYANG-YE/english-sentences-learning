import { MetadataRoute } from 'next';

/**
 * 生成网站地图
 * @returns {MetadataRoute.Sitemap} 网站地图
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://english-sentences-learning.vercel.app';
  
  // 固定页面
  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/courses`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/pricing`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/login`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/register`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ] as MetadataRoute.Sitemap;
  
  // 动态页面 - 从数据库获取
  // 这里只是一个示例，实际需要从数据库或API获取
  const courseSlugs = [
    'beginner-english',
    'intermediate-english',
    'advanced-english',
    'business-english',
    'travel-english',
  ];
  
  const dynamicPages = courseSlugs.map(slug => ({
    url: `${baseUrl}/courses/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));
  
  return [...staticPages, ...dynamicPages];
} 