import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * 生成用户学习洞察
 * GET /api/analytics/insights/[userId]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    // 验证用户权限
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      );
    }
    
    // 验证用户是否有权访问该数据
    // 只允许用户访问自己的数据或管理员访问任何用户数据
    if (
      session.user.id !== params.userId && 
      session.user.role !== 'admin'
    ) {
      return NextResponse.json(
        { error: '无权访问此用户数据' },
        { status: 403 }
      );
    }
    
    // 从数据库获取用户学习数据
    // 实际实现中，应该从数据库获取用户的学习记录
    const userData = await fetchUserLearningData(params.userId);
    
    // 生成学习洞察
    const insights = generateInsights(userData);
    
    return NextResponse.json(insights);
  } catch (error) {
    console.error('生成学习洞察失败:', error);
    return NextResponse.json(
      { error: '生成学习洞察失败', message: (error as Error).message },
      { status: 500 }
    );
  }
}

/**
 * 从数据库获取用户学习数据
 * 注：实际实现中，这里应该从数据库查询用户的学习记录
 */
async function fetchUserLearningData(userId: string) {
  // 模拟从数据库获取数据的延迟
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // 模拟数据
  // 实际实现中，这些数据应该从数据库获取
  return {
    id: userId,
    sessions: [
      { 
        date: new Date(Date.now() - 86400000), 
        duration: 45, 
        startTime: '19:30',
        correctCount: 18,
        totalCount: 20,
        focusScore: 8.5
      },
      { 
        date: new Date(Date.now() - 2 * 86400000), 
        duration: 30, 
        startTime: '20:15',
        correctCount: 12,
        totalCount: 15,
        focusScore: 7.2
      },
      { 
        date: new Date(Date.now() - 3 * 86400000), 
        duration: 60, 
        startTime: '08:45',
        correctCount: 25,
        totalCount: 30,
        focusScore: 9.1
      },
      { 
        date: new Date(Date.now() - 5 * 86400000), 
        duration: 20, 
        startTime: '21:30',
        correctCount: 8,
        totalCount: 12,
        focusScore: 6.8
      },
      { 
        date: new Date(Date.now() - 7 * 86400000), 
        duration: 40, 
        startTime: '18:00',
        correctCount: 16,
        totalCount: 20,
        focusScore: 8.0
      }
    ],
    vocabulary: {
      learned: 120,
      mastered: 85,
      weak: [
        { word: 'accommodate', attempts: 5, correct: 1 },
        { word: 'exacerbate', attempts: 4, correct: 1 },
        { word: 'paradigm', attempts: 3, correct: 0 }
      ],
      strong: [
        { word: 'facilitate', attempts: 5, correct: 5 },
        { word: 'demonstrate', attempts: 4, correct: 4 },
        { word: 'implement', attempts: 6, correct: 6 }
      ],
      recentlyLearned: [
        { word: 'implicit', date: new Date(Date.now() - 86400000) },
        { word: 'articulate', date: new Date(Date.now() - 2 * 86400000) },
        { word: 'consensus', date: new Date(Date.now() - 3 * 86400000) }
      ]
    },
    grammar: {
      strongPoints: ['simple present', 'present perfect'],
      weakPoints: ['past perfect', 'conditional'],
      recentlyPracticed: ['passive voice', 'reported speech']
    },
    courses: [
      { 
        id: 'course-1', 
        title: '商务英语基础', 
        progress: 68, 
        lastAccessed: new Date(Date.now() - 86400000)
      },
      { 
        id: 'course-2', 
        title: '旅游英语会话', 
        progress: 32, 
        lastAccessed: new Date(Date.now() - 10 * 86400000)
      }
    ],
    habits: {
      averageSessionDuration: 35,
      preferredTimeSlots: ['19:00-21:00'],
      consistencyScore: 0.72,
      weekdayFrequency: [2, 3, 1, 0, 2, 3, 1], // 周一到周日的学习频率
      streakDays: 3
    }
  };
}

/**
 * 生成学习洞察
 * 基于用户数据分析学习模式并生成洞察
 */
function generateInsights(userData: any) {
  // 生产力洞察
  const productivityInsights = analyzeProductivity(userData);
  
  // 词汇学习洞察
  const vocabularyInsights = analyzeVocabulary(userData);
  
  // 学习习惯洞察
  const habitInsights = analyzeHabits(userData);
  
  // 推荐行动
  const recommendedActions = generateRecommendedActions(
    userData, 
    productivityInsights,
    vocabularyInsights,
    habitInsights
  );
  
  return {
    productivityInsights,
    vocabularyInsights,
    habitInsights,
    recommendedActions
  };
}

/**
 * 分析用户生产力
 */
function analyzeProductivity(userData: any) {
  const insights: {insight: string, confidence: number}[] = [];
  
  // 分析学习会话
  const sessions = userData.sessions;
  
  // 计算平均专注度
  const avgFocusScore = sessions.reduce(
    (sum, session) => sum + session.focusScore, 
    0
  ) / sessions.length;
  
  // 计算平均正确率
  const totalCorrect = sessions.reduce(
    (sum, session) => sum + session.correctCount, 
    0
  );
  const totalQuestions = sessions.reduce(
    (sum, session) => sum + session.totalCount, 
    0
  );
  const avgAccuracy = (totalCorrect / totalQuestions) * 100;
  
  // 分析早上vs晚上的学习效果
  const morningSessions = sessions.filter(
    s => {
      const hour = parseInt(s.startTime.split(':')[0]);
      return hour >= 5 && hour < 12;
    }
  );
  const eveningSessions = sessions.filter(
    s => {
      const hour = parseInt(s.startTime.split(':')[0]);
      return hour >= 18 && hour < 24;
    }
  );
  
  // 计算早上和晚上的平均专注度
  let morningFocus = 0;
  let eveningFocus = 0;
  
  if (morningSessions.length > 0) {
    morningFocus = morningSessions.reduce(
      (sum, session) => sum + session.focusScore, 
      0
    ) / morningSessions.length;
  }
  
  if (eveningSessions.length > 0) {
    eveningFocus = eveningSessions.reduce(
      (sum, session) => sum + session.focusScore, 
      0
    ) / eveningSessions.length;
  }
  
  // 添加洞察
  if (avgFocusScore > 8) {
    insights.push({
      insight: '你的学习专注度很高，平均专注度得分为' + avgFocusScore.toFixed(1) + '（满分10分）',
      confidence: 0.9
    });
  } else if (avgFocusScore < 7) {
    insights.push({
      insight: '你的学习专注度有提升空间，尝试使用番茄工作法提高专注力',
      confidence: 0.85
    });
  }
  
  insights.push({
    insight: '你的平均答题正确率为' + avgAccuracy.toFixed(1) + '%',
    confidence: 0.95
  });
  
  // 比较早上和晚上的学习效果
  if (morningSessions.length > 0 && eveningSessions.length > 0) {
    if (morningFocus > eveningFocus + 1) {
      insights.push({
        insight: '早上学习时你的专注度比晚上高' + (morningFocus - eveningFocus).toFixed(1) + '分，考虑将更重要的学习安排在早上',
        confidence: 0.82
      });
    } else if (eveningFocus > morningFocus + 1) {
      insights.push({
        insight: '晚上学习时你的专注度比早上高' + (eveningFocus - morningFocus).toFixed(1) + '分，你似乎是一个"夜猫子"类型的学习者',
        confidence: 0.82
      });
    }
  }
  
  // 分析长短学习会话的效果
  const shortSessions = sessions.filter(s => s.duration < 30);
  const longSessions = sessions.filter(s => s.duration >= 45);
  
  if (shortSessions.length > 0 && longSessions.length > 0) {
    const shortSessionsAvgCorrect = shortSessions.reduce(
      (sum, session) => sum + (session.correctCount / session.totalCount), 
      0
    ) / shortSessions.length;
    
    const longSessionsAvgCorrect = longSessions.reduce(
      (sum, session) => sum + (session.correctCount / session.totalCount), 
      0
    ) / longSessions.length;
    
    if (shortSessionsAvgCorrect > longSessionsAvgCorrect + 0.1) {
      insights.push({
        insight: '短时间学习会话（<30分钟）的正确率高于长时间会话，考虑更频繁的短时学习而非长时间学习',
        confidence: 0.78
      });
    } else if (longSessionsAvgCorrect > shortSessionsAvgCorrect + 0.1) {
      insights.push({
        insight: '长时间学习会话（>=45分钟）的正确率高于短时间会话，你似乎需要更长的时间进入学习状态',
        confidence: 0.78
      });
    }
  }
  
  return insights;
}

/**
 * 分析用户词汇学习
 */
function analyzeVocabulary(userData: any) {
  const insights: {insight: string, confidence: number}[] = [];
  const vocabulary = userData.vocabulary;
  
  // 词汇掌握情况
  const masteryRate = (vocabulary.mastered / vocabulary.learned) * 100;
  insights.push({
    insight: `你已掌握${vocabulary.mastered}个单词，占学习单词总数的${masteryRate.toFixed(1)}%`,
    confidence: 0.95
  });
  
  // 分析弱点词汇
  if (vocabulary.weak.length > 0) {
    const weakWordsList = vocabulary.weak.map((w: any) => w.word).join('、');
    insights.push({
      insight: `你需要重点复习的词汇包括：${weakWordsList}`,
      confidence: 0.90
    });
  }
  
  // 分析强项词汇
  if (vocabulary.strong.length > 0) {
    insights.push({
      insight: `你在商务和学术类词汇方面表现最佳`,
      confidence: 0.85
    });
  }
  
  // 最近学习的词汇
  if (vocabulary.recentlyLearned.length > 0) {
    insights.push({
      insight: `你最近7天学习了${vocabulary.recentlyLearned.length}个新词汇，建议在48小时内进行复习以提高记忆效果`,
      confidence: 0.88
    });
  }
  
  return insights;
}

/**
 * 分析用户学习习惯
 */
function analyzeHabits(userData: any) {
  const insights: {insight: string, confidence: number}[] = [];
  const habits = userData.habits;
  
  // 分析学习时间偏好
  if (habits.preferredTimeSlots.length > 0) {
    insights.push({
      insight: `你最常在${habits.preferredTimeSlots.join('和')}时间段学习`,
      confidence: 0.92
    });
  }
  
  // 分析一致性
  if (habits.consistencyScore > 0.8) {
    insights.push({
      insight: `你的学习非常有规律，一致性得分为${(habits.consistencyScore * 10).toFixed(1)}/10，继续保持！`,
      confidence: 0.90
    });
  } else if (habits.consistencyScore < 0.5) {
    insights.push({
      insight: `你的学习缺乏规律性，一致性得分仅为${(habits.consistencyScore * 10).toFixed(1)}/10，尝试制定固定的学习计划`,
      confidence: 0.88
    });
  }
  
  // 分析连续学习天数
  if (habits.streakDays > 0) {
    insights.push({
      insight: `你已经连续学习${habits.streakDays}天，坚持就是胜利！`,
      confidence: 1.0
    });
  }
  
  // 分析每周学习模式
  const weekdayNames = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
  const maxLearningDayIndex = habits.weekdayFrequency.indexOf(
    Math.max(...habits.weekdayFrequency)
  );
  const minLearningDayIndex = habits.weekdayFrequency.indexOf(
    Math.min(...habits.weekdayFrequency)
  );
  
  insights.push({
    insight: `${weekdayNames[maxLearningDayIndex]}是你学习最活跃的日子，而${weekdayNames[minLearningDayIndex]}的学习频率最低`,
    confidence: 0.85
  });
  
  return insights;
}

/**
 * 生成推荐行动
 */
function generateRecommendedActions(
  userData: any,
  productivityInsights: any[],
  vocabularyInsights: any[],
  habitInsights: any[]
) {
  const actions: {action: string, reason: string, priority: number}[] = [];
  
  // 基于词汇弱点的推荐
  if (userData.vocabulary.weak.length > 0) {
    actions.push({
      action: '专项复习困难词汇',
      reason: `针对你的困难词汇（如"${userData.vocabulary.weak[0].word}"）创建专项复习计划`,
      priority: 9
    });
  }
  
  // 基于语法弱点的推荐
  if (userData.grammar.weakPoints.length > 0) {
    actions.push({
      action: '强化语法薄弱环节',
      reason: `专注练习${userData.grammar.weakPoints.join('和')}相关的句型`,
      priority: 8
    });
  }
  
  // 基于学习习惯的推荐
  if (userData.habits.consistencyScore < 0.7) {
    actions.push({
      action: '建立固定学习时间',
      reason: '规律的学习时间可以提高学习效率和保持长期记忆',
      priority: 7
    });
  }
  
  // 基于学习时间的推荐
  const avgDuration = userData.habits.averageSessionDuration;
  if (avgDuration < 25) {
    actions.push({
      action: '增加单次学习时长',
      reason: '当前平均学习时长偏短，尝试增加到30-45分钟以获得更好的学习效果',
      priority: 6
    });
  } else if (avgDuration > 60) {
    actions.push({
      action: '将长学习会话分成多个短会话',
      reason: '研究表明，间隔学习比一次长时间学习更有效',
      priority: 5
    });
  }
  
  // 基于课程进度的推荐
  const inactiveCoursesCount = userData.courses.filter(
    (c: any) => {
      const lastAccessDays = (Date.now() - c.lastAccessed.getTime()) / (1000 * 60 * 60 * 24);
      return lastAccessDays > 7 && c.progress < 90;
    }
  ).length;
  
  if (inactiveCoursesCount > 0) {
    actions.push({
      action: '重启搁置的课程',
      reason: '你有未完成的课程已超过7天未学习，建议重新规划学习计划',
      priority: 8
    });
  }
  
  // 基于学习时段的推荐
  const morningLearningDays = userData.habits.weekdayFrequency.filter((f: number) => f > 0).length;
  if (morningLearningDays < 3) {
    actions.push({
      action: '尝试早晨学习',
      reason: '早晨通常是记忆效率最高的时段，尝试在早上安排一些重点学习内容',
      priority: 4
    });
  }
  
  return actions;
}

/**
 * 响应OPTIONS请求
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
} 