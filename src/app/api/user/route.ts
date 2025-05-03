import { NextResponse } from 'next/server';
import { UserDashboardData } from '@/types/user/dashboard';
import { RewardItem } from '@/types/user';

// 模拟用户数据
const mockUserData: UserDashboardData = {
  user: {
    id: 'user123',
    email: 'user@example.com',
    displayName: '学习达人',
    avatar: '/images/avatar.png',
    role: 'premium',
    createdAt: '2023-01-15T00:00:00Z',
    lastLogin: '2023-10-05T00:00:00Z',
    membership: {
      type: 'premium',
      startDate: '2023-01-15T00:00:00Z',
      endDate: '2024-01-15T00:00:00Z',
      autoRenewal: true,
    },
    stats: {
      level: 15,
      experience: 3720,
      totalPoints: 4850,
      streakDays: 12,
      lastStreak: new Date().toISOString(),
      lessonsCompleted: 67,
      sentencesMastered: 540,
      vocabularyMastered: 1250,
      totalExercises: 890,
      correctExercises: 780,
      totalLearningTime: 4520,
      totalWords: 5400,
      totalSentences: 850,
      totalHours: 75,
      monthlyWords: 1200,
      monthlySentences: 210,
      reviewDue: 24
    }
  },
  checkIns: generateCheckIns(),
  recentLearning: [
    {
      id: 'course1',
      title: '新概念英语第一册',
      coverImage: 'https://placehold.co/600x400/orange/white?text=新概念英语1',
      progress: 75,
      lastStudied: '2023-10-04T00:00:00Z',
      lastAccessed: '2023-10-04T00:00:00Z'
    },
    {
      id: 'course2',
      title: '新概念英语第二册',
      coverImage: 'https://placehold.co/600x400/blue/white?text=新概念英语2',
      progress: 45,
      lastStudied: '2023-10-02T00:00:00Z',
      lastAccessed: '2023-10-02T00:00:00Z'
    },
    {
      id: 'course3',
      title: '英语口语入门',
      coverImage: 'https://placehold.co/600x400/green/white?text=英语口语入门',
      progress: 30,
      lastStudied: '2023-09-28T00:00:00Z',
      lastAccessed: '2023-09-28T00:00:00Z'
    },
    {
      id: 'course4',
      title: '商务英语基础',
      coverImage: 'https://placehold.co/600x400/purple/white?text=商务英语基础',
      progress: 15,
      lastStudied: '2023-09-20T00:00:00Z',
      lastAccessed: '2023-09-20T00:00:00Z'
    }
  ],
  learningStats: {
    daily: {
      labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      data: [45, 60, 30, 80, 65, 90, 70]
    },
    weekly: {
      labels: ['第1周', '第2周', '第3周', '第4周'],
      data: [250, 320, 280, 350]
    },
    monthly: {
      labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      data: [500, 620, 750, 800, 950, 1100, 1000, 1200, 1300, 1450, 0, 0]
    }
  }
};

// 生成过去30天的签到记录
function generateCheckIns() {
  const checkIns = [];
  const today = new Date();
  
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    
    // 模拟大约80%的日期有签到记录
    const hasCheckedIn = i === 0 ? false : Math.random() < 0.8;
    
    if (hasCheckedIn || i === 0) {
      checkIns.push({
        userId: 'user123',
        date: date.toISOString(),
        streak: i === 0 ? 0 : i < 13 ? 12 - i : 0,
        completed: hasCheckedIn,
        rewards: {
          points: 50,
          experience: 20,
          items: i % 7 === 0 ? [
            {
              id: 'exp_boost',
              name: '经验加速卡',
              type: 'booster' as const,
              description: '使用后获得的经验值翻倍',
              value: 100,
              expiresAt: new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
              used: false
            }
          ] : undefined
        }
      });
    }
  }
  
  return checkIns;
}

export async function GET() {
  // 在实际应用中，这里会从数据库获取用户数据
  // 此处仅返回模拟数据
  return NextResponse.json(mockUserData);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 模拟签到操作
    if (body.action === 'checkIn') {
      const today = new Date();
      const todayStr = today.toISOString();
      const todayCheckIn = mockUserData.checkIns.find(
        checkIn => {
          const checkInDate = new Date(checkIn.date);
          return (
            checkInDate.getDate() === today.getDate() &&
            checkInDate.getMonth() === today.getMonth() &&
            checkInDate.getFullYear() === today.getFullYear()
          );
        }
      );
      
      if (todayCheckIn) {
        todayCheckIn.completed = true;
        todayCheckIn.streak = mockUserData.user.stats.streakDays + 1;
        
        // 更新用户统计信息
        mockUserData.user.stats.streakDays += 1;
        mockUserData.user.stats.totalPoints += todayCheckIn.rewards.points;
        mockUserData.user.stats.experience += todayCheckIn.rewards.experience;
      }
      
      return NextResponse.json({ 
        success: true, 
        message: '签到成功!', 
        userData: mockUserData 
      });
    }
    
    return NextResponse.json({ 
      success: false, 
      message: '未知操作' 
    }, { status: 400 });
  } catch (error) {
    console.error('处理请求时出错:', error);
    return NextResponse.json({ 
      success: false, 
      message: '处理请求时出错' 
    }, { status: 500 });
  }
} 