import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // 检查授权头
    const authorization = request.headers.get('Authorization');
    
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      );
    }
    
    // 在实际应用中，这里会验证token并从数据库获取用户信息
    // 这里我们简单返回一个模拟用户
    return NextResponse.json({
      id: 'user_demo',
      name: '测试用户',
      email: 'test@example.com',
      role: 'user',
      avatarUrl: '/images/avatar-placeholder.png',
      createdAt: '2023-01-01T00:00:00Z',
      lastLogin: new Date().toISOString(),
      preferences: {
        theme: 'light',
        language: 'zh-CN',
        emailNotifications: true
      },
      statistics: {
        coursesCompleted: 5,
        lessonsCompleted: 48,
        totalStudyTime: 3600,
        streak: 7
      }
    });
    
  } catch (error) {
    console.error('获取用户信息错误:', error);
    return NextResponse.json(
      { error: '服务器处理请求时出错' },
      { status: 500 }
    );
  }
} 