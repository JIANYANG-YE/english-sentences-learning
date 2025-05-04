import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJwtToken } from '@/lib/auth';

// 不需要认证的公开路由
const publicRoutes = [
  '/',
  '/login',
  '/register',
  '/api/auth/login',
  '/api/auth/register',
  '/courses',
  '/about',
  '/contact',
];

// 管理员路由
const adminRoutes = [
  '/admin',
  '/admin/users',
  '/admin/courses',
  '/admin/dashboard',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 检查是否为静态资源或公开路由
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/api/auth') ||
    pathname.includes('.') ||
    publicRoutes.some(route => pathname === route || pathname.startsWith(`${route}/`))
  ) {
    return NextResponse.next();
  }
  
  // 获取令牌
  const authHeader = request.headers.get('authorization');
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : request.cookies.get('token')?.value;
  
  if (!token) {
    // 如果请求是API路由，返回401响应
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      );
    }
    
    // 否则重定向到登录页面
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', encodeURI(pathname));
    return NextResponse.redirect(loginUrl);
  }
  
  // 验证令牌
  const payload = await verifyJwtToken(token);
  
  if (!payload) {
    // 令牌无效或已过期
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: '令牌无效或已过期' },
        { status: 401 }
      );
    }
    
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }
  
  // 检查管理员权限
  if (adminRoutes.some(route => pathname.startsWith(route)) && payload.role !== 'admin') {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: '您没有权限访问此资源' },
        { status: 403 }
      );
    }
    
    // 重定向到主页
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  // 继续请求
  return NextResponse.next();
}

// 配置中间件匹配的路由
export const config = {
  matcher: [
    /*
     * 匹配所有路径，除了:
     * 1. 公开路由（登录、注册等）
     * 2. 静态资源（_next、favicon.ico等）
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}; 