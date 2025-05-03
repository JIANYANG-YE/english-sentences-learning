import { NextRequest, NextResponse } from 'next/server';

// 模拟用户数据（实际环境中应该从数据库获取）
const DEMO_USER = {
  id: 'demo-user-1',
  name: '演示用户',
  email: 'demo@example.com',
  role: 'user',
  membershipStatus: 'free',
  createdAt: '2023-01-01T00:00:00.000Z',
  profilePicture: null,
  learningStreak: 7,
  totalLearningTime: 3600, // 单位：秒
  completedLessons: 12,
  language: 'zh-CN',
  preferredLearningMode: 'mixed',
  preferredDifficulty: 'intermediate'
};

export async function GET(request: NextRequest) {
  try {
    // 在实际应用中，这里应该验证用户会话和权限
    // 由于没有实际的身份验证系统，我们总是返回演示用户
    
    // 模拟一些随机性，让每次返回的数据略有不同
    const timeOffset = Math.floor(Math.random() * 1800); // 0-30分钟的随机偏移
    
    const user = {
      ...DEMO_USER,
      totalLearningTime: DEMO_USER.totalLearningTime + timeOffset,
      lastActive: new Date().toISOString()
    };
    
    return NextResponse.json({
      status: 'success',
      user
    });
  } catch (error) {
    console.error('获取用户信息错误:', error);
    return NextResponse.json({
      status: 'error',
      message: '获取用户信息失败'
    }, { status: 500 });
  }
} 