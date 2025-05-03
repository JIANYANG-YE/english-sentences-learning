import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 简单验证
    if (!body.email || !body.password) {
      return NextResponse.json(
        { error: '请提供邮箱和密码' },
        { status: 400 }
      );
    }
    
    // 模拟成功响应
    return NextResponse.json({
      success: true,
      user: {
        id: 'user_' + Math.random().toString(36).substr(2, 9),
        name: body.email.split('@')[0], // 使用邮箱前缀作为用户名
        email: body.email,
        role: 'user',
        lastLogin: new Date().toISOString()
      },
      token: 'mock_token_' + Math.random().toString(36).substr(2, 16)
    });
    
  } catch (error) {
    console.error('登录处理错误:', error);
    return NextResponse.json(
      { error: '服务器处理请求时出错' },
      { status: 500 }
    );
  }
} 