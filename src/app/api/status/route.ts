import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // 收集环境信息，但不包含敏感数据
    const environmentInfo = {
      nodeEnv: process.env.NODE_ENV,
      nextAuthUrl: process.env.NEXTAUTH_URL ? 'Set' : 'Not set',
      databaseUrl: process.env.DATABASE_URL ? 'Set' : 'Not set',
      timestamp: new Date().toISOString(),
      vercel: process.env.VERCEL ? true : false,
      region: process.env.VERCEL_REGION || 'unknown'
    };

    return NextResponse.json({
      status: 'ok',
      message: 'API is running',
      environment: environmentInfo
    });
  } catch (error) {
    console.error('Status check error:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Error checking API status'
    }, { status: 500 });
  }
} 