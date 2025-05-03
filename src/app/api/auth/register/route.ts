import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 简单验证
    if (!body.email || !body.password || !body.name) {
      return NextResponse.json(
        { error: '请提供所有必要的注册信息' },
        { status: 400 }
      );
    }
    
    // 模拟成功响应
    return NextResponse.json({
      success: true,
      user: {
        id: 'user_' + Math.random().toString(36).substr(2, 9),
        name: body.name,
        email: body.email,
        role: 'user',
        createdAt: new Date().toISOString()
      },
      token: 'mock_token_' + Math.random().toString(36).substr(2, 16)
    });
    
  } catch (error) {
    console.error('注册处理错误:', error);
    return NextResponse.json(
      { error: '服务器处理请求时出错' },
      { status: 500 }
    );
  }
} 