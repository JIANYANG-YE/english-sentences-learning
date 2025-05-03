import { NextResponse } from 'next/server';
import { BadgeRarity, BadgeType } from '@/services/badgeService';

// 模拟徽章数据库
const mockBadges = [
  {
    id: 'streak-7',
    name: '坚持不懈',
    description: '连续学习7天',
    type: BadgeType.STREAK,
    rarity: BadgeRarity.COMMON,
    iconUrl: '/images/badges/seven-day-streak.png',
    unlockCriteria: {
      type: 'streak_days',
      value: 7,
      description: '连续学习7天'
    },
    effects: [
      {
        type: 'boost' as const,
        value: 5,
        description: '学习经验获取+5%'
      }
    ]
  },
  {
    id: 'streak-30',
    name: '习惯养成',
    description: '连续学习30天',
    type: BadgeType.STREAK,
    rarity: BadgeRarity.RARE,
    iconUrl: '/images/badges/thirty-day-streak.png',
    unlockCriteria: {
      type: 'streak_days',
      value: 30,
      description: '连续学习30天'
    },
    effects: [
      {
        type: 'boost' as const,
        value: 10,
        description: '学习经验获取+10%'
      }
    ]
  },
  {
    id: 'streak-365',
    name: '年度学者',
    description: '连续学习365天',
    type: BadgeType.STREAK,
    rarity: BadgeRarity.LEGENDARY,
    iconUrl: '/images/badges/year-scholar.png',
    unlockCriteria: {
      type: 'streak_days',
      value: 365,
      description: '连续学习365天'
    },
    effects: [
      {
        type: 'boost' as const,
        value: 30,
        description: '学习经验获取+30%'
      },
      {
        type: 'unlock' as const,
        value: 'exclusive_content',
        description: '解锁专属学习内容'
      }
    ]
  },
  {
    id: 'milestone-100',
    name: '初窥门径',
    description: '学习100个句子',
    type: BadgeType.MILESTONE,
    rarity: BadgeRarity.COMMON,
    iconUrl: '/images/badges/hundred-sentences.png',
    unlockCriteria: {
      type: 'sentences_learned',
      value: 100,
      description: '学习100个句子'
    }
  },
  {
    id: 'milestone-500',
    name: '熟能生巧',
    description: '学习500个句子',
    type: BadgeType.MILESTONE,
    rarity: BadgeRarity.RARE,
    iconUrl: '/images/badges/five-hundred-sentences.png',
    unlockCriteria: {
      type: 'sentences_learned',
      value: 500,
      description: '学习500个句子'
    }
  },
  {
    id: 'milestone-1000',
    name: '句子大师',
    description: '学习1000个句子',
    type: BadgeType.MILESTONE,
    rarity: BadgeRarity.EPIC,
    iconUrl: '/images/badges/thousand-sentences.png',
    unlockCriteria: {
      type: 'sentences_learned',
      value: 1000,
      description: '学习1000个句子'
    },
    effects: [
      {
        type: 'visual' as const,
        value: 'special_profile_frame',
        description: '专属资料页框架'
      }
    ]
  },
  {
    id: 'skill-grammar',
    name: '语法通晓',
    description: '语法技能达到70分',
    type: BadgeType.SKILL,
    rarity: BadgeRarity.RARE,
    iconUrl: '/images/badges/grammar-master.png',
    unlockCriteria: {
      type: 'skill_grammar',
      value: 70,
      description: '语法技能达到70分'
    }
  },
  {
    id: 'skill-vocabulary',
    name: '词汇达人',
    description: '掌握超过1000个单词',
    type: BadgeType.SKILL,
    rarity: BadgeRarity.RARE,
    iconUrl: '/images/badges/vocabulary-expert.png',
    unlockCriteria: {
      type: 'skill_vocabulary',
      value: 1000,
      description: '掌握超过1000个单词'
    }
  },
  {
    id: 'challenge-speed',
    name: '疾如闪电',
    description: '在10分钟内完成50个翻译练习',
    type: BadgeType.CHALLENGE,
    rarity: BadgeRarity.EPIC,
    iconUrl: '/images/badges/speed-master.png',
    unlockCriteria: {
      type: 'challenge',
      value: 'speed_translation',
      description: '10分钟内完成50个翻译练习'
    }
  },
  {
    id: 'special-early',
    name: '早起鸟儿',
    description: '连续7天在早晨6点前开始学习',
    type: BadgeType.SPECIAL,
    rarity: BadgeRarity.RARE,
    iconUrl: '/images/badges/early-bird.png',
    unlockCriteria: {
      type: 'early_study',
      value: 7,
      description: '连续7天在早晨6点前开始学习'
    }
  },
  {
    id: 'event-new-year',
    name: '新春学霸',
    description: '春节期间每天完成学习目标',
    type: BadgeType.EVENT,
    rarity: BadgeRarity.EPIC,
    iconUrl: '/images/badges/new-year.png',
    unlockCriteria: {
      type: 'event_completion',
      value: 'new_year_2023',
      description: '春节期间每天完成学习目标'
    },
    isLimited: true
  },
  {
    id: 'community-helper',
    name: '乐于助人',
    description: '回答30个社区问题',
    type: BadgeType.COMMUNITY,
    rarity: BadgeRarity.RARE,
    iconUrl: '/images/badges/community-helper.png',
    unlockCriteria: {
      type: 'answer_questions',
      value: 30,
      description: '回答30个社区问题'
    }
  }
];

// 模拟用户徽章数据
const mockUserBadges = {
  'user123': {
    userId: 'user123',
    badges: [
      {
        ...mockBadges[0], // streak-7
        unlockedAt: '2023-10-15T08:30:00Z'
      },
      {
        ...mockBadges[3], // milestone-100
        unlockedAt: '2023-10-20T14:15:00Z'
      }
    ],
    featuredBadges: ['streak-7'],
    lastUpdated: '2023-10-20T14:15:00Z',
    totalCount: 2,
    stats: {
      byRarity: {
        [BadgeRarity.COMMON]: 2,
        [BadgeRarity.RARE]: 0,
        [BadgeRarity.EPIC]: 0,
        [BadgeRarity.LEGENDARY]: 0
      },
      byType: {
        [BadgeType.STREAK]: 1,
        [BadgeType.MILESTONE]: 1,
        [BadgeType.SKILL]: 0,
        [BadgeType.CHALLENGE]: 0,
        [BadgeType.SPECIAL]: 0,
        [BadgeType.EVENT]: 0,
        [BadgeType.COMMUNITY]: 0,
        [BadgeType.SEASONAL]: 0
      }
    }
  }
};

/**
 * 获取所有可用徽章
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const path = url.pathname;
  
  // 获取所有可用徽章
  if (path.endsWith('/available')) {
    return NextResponse.json(mockBadges);
  }
  
  // 获取用户徽章
  const userIdMatch = path.match(/\/users\/([^/]+)/);
  if (userIdMatch) {
    const userId = userIdMatch[1];
    
    // 如果用户存在于模拟数据中，返回其徽章
    if (mockUserBadges[userId]) {
      return NextResponse.json(mockUserBadges[userId]);
    }
    
    // 如果用户不存在，返回空集合
    return NextResponse.json({
      userId,
      badges: [],
      featuredBadges: [],
      lastUpdated: new Date().toISOString(),
      totalCount: 0,
      stats: {
        byRarity: {
          [BadgeRarity.COMMON]: 0,
          [BadgeRarity.RARE]: 0,
          [BadgeRarity.EPIC]: 0,
          [BadgeRarity.LEGENDARY]: 0
        },
        byType: {
          [BadgeType.STREAK]: 0,
          [BadgeType.MILESTONE]: 0,
          [BadgeType.SKILL]: 0,
          [BadgeType.CHALLENGE]: 0,
          [BadgeType.SPECIAL]: 0,
          [BadgeType.EVENT]: 0,
          [BadgeType.COMMUNITY]: 0,
          [BadgeType.SEASONAL]: 0
        }
      }
    });
  }
  
  // 默认返回所有可用徽章
  return NextResponse.json(mockBadges);
}

/**
 * 授予用户徽章或设置精选徽章
 */
export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const path = url.pathname;
    const body = await request.json();
    
    // 授予用户徽章
    if (path.includes('/award')) {
      const userIdMatch = path.match(/\/users\/([^/]+)/);
      if (!userIdMatch) {
        return NextResponse.json({ error: '无效的用户ID' }, { status: 400 });
      }
      
      const userId = userIdMatch[1];
      const { badgeId } = body;
      
      if (!badgeId) {
        return NextResponse.json({ error: '缺少徽章ID' }, { status: 400 });
      }
      
      // 查找徽章
      const badge = mockBadges.find(b => b.id === badgeId);
      if (!badge) {
        return NextResponse.json({ error: '徽章不存在' }, { status: 404 });
      }
      
      // 初始化用户徽章集合（如果不存在）
      if (!mockUserBadges[userId]) {
        mockUserBadges[userId] = {
          userId,
          badges: [],
          featuredBadges: [],
          lastUpdated: new Date().toISOString(),
          totalCount: 0,
          stats: {
            byRarity: {
              [BadgeRarity.COMMON]: 0,
              [BadgeRarity.RARE]: 0,
              [BadgeRarity.EPIC]: 0,
              [BadgeRarity.LEGENDARY]: 0
            },
            byType: {
              [BadgeType.STREAK]: 0,
              [BadgeType.MILESTONE]: 0,
              [BadgeType.SKILL]: 0,
              [BadgeType.CHALLENGE]: 0,
              [BadgeType.SPECIAL]: 0,
              [BadgeType.EVENT]: 0,
              [BadgeType.COMMUNITY]: 0,
              [BadgeType.SEASONAL]: 0
            }
          }
        };
      }
      
      // 检查用户是否已拥有该徽章
      if (mockUserBadges[userId].badges.some(b => b.id === badgeId)) {
        return NextResponse.json({ message: '用户已拥有该徽章' });
      }
      
      // 授予徽章
      const badgeWithUnlockTime = {
        ...badge,
        unlockedAt: new Date().toISOString()
      };
      
      mockUserBadges[userId].badges.push(badgeWithUnlockTime);
      mockUserBadges[userId].totalCount = mockUserBadges[userId].badges.length;
      mockUserBadges[userId].lastUpdated = new Date().toISOString();
      
      // 更新统计数据
      mockUserBadges[userId].stats.byRarity[badge.rarity]++;
      mockUserBadges[userId].stats.byType[badge.type]++;
      
      return NextResponse.json({ 
        success: true, 
        message: '徽章授予成功', 
        badge: badgeWithUnlockTime 
      });
    }
    
    // 设置精选徽章
    if (path.includes('/featured')) {
      const userIdMatch = path.match(/\/users\/([^/]+)/);
      if (!userIdMatch) {
        return NextResponse.json({ error: '无效的用户ID' }, { status: 400 });
      }
      
      const userId = userIdMatch[1];
      const { featuredBadges } = body;
      
      if (!Array.isArray(featuredBadges)) {
        return NextResponse.json({ error: '无效的精选徽章列表' }, { status: 400 });
      }
      
      // 如果用户不存在，返回错误
      if (!mockUserBadges[userId]) {
        return NextResponse.json({ error: '用户不存在' }, { status: 404 });
      }
      
      // 验证这些徽章用户都拥有
      const validBadgeIds = featuredBadges.filter(id => 
        mockUserBadges[userId].badges.some(b => b.id === id)
      );
      
      // 更新精选徽章
      mockUserBadges[userId].featuredBadges = validBadgeIds;
      mockUserBadges[userId].lastUpdated = new Date().toISOString();
      
      return NextResponse.json({ 
        success: true, 
        message: '精选徽章设置成功', 
        featuredBadges: validBadgeIds 
      });
    }
    
    return NextResponse.json({ error: '无效的请求路径' }, { status: 400 });
  } catch (error) {
    console.error('处理徽章请求失败:', error);
    return NextResponse.json({ error: '处理请求时出错' }, { status: 500 });
  }
} 