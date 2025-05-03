import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { getSessionStats } from '../sessions/route';

// 学习报告的验证模式
const reportSchema = z.object({
  id: z.string().optional(),
  userId: z.string(),
  timeframe: z.enum(['day', 'week', 'month', 'year']),
  generatedAt: z.string().optional(),
  summary: z.object({
    timeSpent: z.number(),
    sessionsCompleted: z.number(),
    wordsLearned: z.number(),
    sentencesReviewed: z.number(),
    coursesProgressed: z.array(z.object({
      courseId: z.string(),
      title: z.string(),
      progress: z.number()
    })).optional()
  }),
  goals: z.object({
    achieved: z.array(z.object({
      goal: z.string(),
      achievedDate: z.string()
    })).optional(),
    inProgress: z.array(z.object({
      goal: z.string(),
      progress: z.number(),
      remaining: z.string()
    })).optional()
  }).optional(),
  strengths: z.array(z.string()).optional(),
  areasForImprovement: z.array(z.string()).optional(),
  nextSteps: z.array(z.string()).optional(),
  comparisonToPrevious: z.array(z.object({
    metric: z.string(),
    current: z.number(),
    previous: z.number(),
    change: z.number()
  })).optional()
});

// 数据存储（未来可替换为实际数据库）
type ReportData = z.infer<typeof reportSchema>;
let reportsData: ReportData[] = [];

/**
 * GET /api/analytics/reports
 * 获取学习报告列表或特定报告
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const reportId = searchParams.get('id');
    const timeframe = searchParams.get('timeframe') as 'day' | 'week' | 'month' | 'year' | null;
    
    // 如果提供了报告ID，返回特定报告
    if (reportId) {
      const report = reportsData.find(r => r.id === reportId);
      if (!report) {
        return NextResponse.json({ error: '报告未找到' }, { status: 404 });
      }
      return NextResponse.json(report, { status: 200 });
    }
    
    // 如果提供了用户ID，返回该用户的报告
    if (userId) {
      let userReports = reportsData.filter(r => r.userId === userId);
      
      // 如果还提供了时间范围，进一步筛选
      if (timeframe) {
        userReports = userReports.filter(r => r.timeframe === timeframe);
      }
      
      // 按生成时间排序
      userReports.sort((a, b) => {
        const dateA = a.generatedAt ? new Date(a.generatedAt).getTime() : 0;
        const dateB = b.generatedAt ? new Date(b.generatedAt).getTime() : 0;
        return dateB - dateA; // 降序，最新的在前
      });
      
      return NextResponse.json(userReports, { status: 200 });
    }
    
    // 如果没有提供任何参数，返回所有报告
    return NextResponse.json(reportsData, { status: 200 });
  } catch (error) {
    console.error('获取学习报告失败:', error);
    return NextResponse.json(
      { error: '获取学习报告失败' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/analytics/reports
 * 生成新的学习报告
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 验证或自动补充必要字段
    if (!body.userId) {
      return NextResponse.json(
        { error: '必须提供用户ID' },
        { status: 400 }
      );
    }
    
    const timeframe = body.timeframe || 'week';
    const userId = body.userId;
    
    // 生成报告ID和时间戳
    const reportId = body.id || uuidv4();
    const generatedAt = new Date().toISOString();
    
    // 获取会话统计数据
    const sessionStats = await getSessionStats(userId, timeframe);
    
    // 获取上一周期的报告（用于比较）
    const previousTimeframeData = await getPreviousTimeframeStats(userId, timeframe);
    
    // 计算与上一周期的变化
    const comparisonData = calculateComparison(sessionStats, previousTimeframeData);
    
    // 分析学习优势和弱点
    const strengthsAndWeaknesses = analyzeStrengthsAndWeaknesses(userId, sessionStats, comparisonData);
    
    // 获取用户的课程进度
    const coursesProgress = await getUserCoursesProgress(userId);
    
    // 生成学习目标数据
    const goalsData = await generateGoalsData(userId, sessionStats);
    
    // 生成报告内容
    const report: ReportData = {
      id: reportId,
      userId,
      timeframe: timeframe as 'day' | 'week' | 'month' | 'year',
      generatedAt,
      summary: {
        timeSpent: sessionStats.totalDuration,
        sessionsCompleted: sessionStats.totalSessions,
        wordsLearned: Math.floor(sessionStats.totalItemsCompleted * 0.6), // 估算
        sentencesReviewed: Math.floor(sessionStats.totalItemsCompleted * 0.4), // 估算
        coursesProgressed: coursesProgress
      },
      goals: goalsData,
      strengths: strengthsAndWeaknesses.strengths,
      areasForImprovement: strengthsAndWeaknesses.weaknesses,
      nextSteps: generateNextSteps(userId, strengthsAndWeaknesses.weaknesses),
      comparisonToPrevious: comparisonData
    };
    
    // 保存报告
    const existingIndex = reportsData.findIndex(r => r.id === reportId);
    if (existingIndex !== -1) {
      reportsData[existingIndex] = report;
    } else {
      reportsData.push(report);
    }
    
    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    console.error('生成学习报告失败:', error);
    return NextResponse.json(
      { error: '生成学习报告失败' },
      { status: 500 }
    );
  }
}

/**
 * 获取上一个时间周期的学习统计数据
 */
async function getPreviousTimeframeStats(userId: string, timeframe: string) {
  // 在实际项目中，这里应该查询数据库获取上一个时间周期的数据
  // 这里仅使用模拟数据
  const mockPreviousStats = {
    totalDuration: 320, // 上一周期总学习时间（分钟）
    totalSessions: 18,  // 上一周期总会话数
    totalItemsCompleted: 520, // 上一周期完成的项目数
    averageScore: 78, // 上一周期平均分数
    completionRate: 0.65 // 上一周期完成率
  };
  
  return mockPreviousStats;
}

/**
 * 计算当前数据与上一周期数据的比较
 */
function calculateComparison(currentStats: any, previousStats: any) {
  const comparisonData = [
    {
      metric: "学习时间",
      current: currentStats.totalDuration,
      previous: previousStats.totalDuration,
      change: calculatePercentChange(currentStats.totalDuration, previousStats.totalDuration)
    },
    {
      metric: "完成的会话",
      current: currentStats.totalSessions,
      previous: previousStats.totalSessions,
      change: calculatePercentChange(currentStats.totalSessions, previousStats.totalSessions)
    },
    {
      metric: "完成的项目",
      current: currentStats.totalItemsCompleted,
      previous: previousStats.totalItemsCompleted,
      change: calculatePercentChange(currentStats.totalItemsCompleted, previousStats.totalItemsCompleted)
    },
    {
      metric: "平均分数",
      current: currentStats.averageScore,
      previous: previousStats.averageScore,
      change: calculatePercentChange(currentStats.averageScore, previousStats.averageScore)
    },
    {
      metric: "完成率",
      current: Math.round(currentStats.completionRate * 100),
      previous: Math.round(previousStats.completionRate * 100),
      change: calculatePercentChange(currentStats.completionRate, previousStats.completionRate)
    }
  ];
  
  return comparisonData;
}

/**
 * 计算百分比变化
 */
function calculatePercentChange(current: number, previous: number) {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}

/**
 * 分析用户的优势和弱点
 */
function analyzeStrengthsAndWeaknesses(userId: string, currentStats: any, comparisonData: any) {
  // 在实际项目中，这里应该基于实际的学习数据分析
  // 这里仅使用模拟数据和简单逻辑
  
  const strengths = [];
  const weaknesses = [];
  
  // 基于比较数据分析优势
  comparisonData.forEach((item: any) => {
    if (item.change > 15) {
      switch (item.metric) {
        case "学习时间":
          strengths.push("学习投入时间显著增加，显示出较强的学习承诺");
          break;
        case "完成的会话":
          strengths.push("学习会话频率提高，表明学习习惯在逐步形成");
          break;
        case "完成的项目":
          strengths.push("学习内容完成量增加，学习效率有明显提升");
          break;
        case "平均分数":
          strengths.push("测试和练习的平均分数提高，表明掌握程度增强");
          break;
        case "完成率":
          strengths.push("学习任务完成率提升，显示出更强的执行力");
          break;
      }
    } else if (item.change < -15) {
      switch (item.metric) {
        case "学习时间":
          weaknesses.push("学习投入时间减少，可能需要调整学习计划");
          break;
        case "完成的会话":
          weaknesses.push("学习频率下降，需要重新养成规律学习习惯");
          break;
        case "完成的项目":
          weaknesses.push("学习内容完成量减少，效率可能存在问题");
          break;
        case "平均分数":
          weaknesses.push("测试和练习的平均分数下降，需要加强复习");
          break;
        case "完成率":
          weaknesses.push("学习任务完成率降低，执行力需要提升");
          break;
      }
    }
  });
  
  // 添加基于学习模式的分析
  const mockLearningPatterns = {
    morningLearningRate: 0.2, // 早上学习的比例
    eveningLearningRate: 0.7, // 晚上学习的比例
    grammarAccuracy: 0.65, // 语法准确率
    vocabularyRetention: 0.82, // 词汇记忆保留率
    listeningAccuracy: 0.70, // 听力理解准确率
    speakingPracticeRate: 0.30 // 口语练习频率
  };
  
  // 分析学习模式
  if (mockLearningPatterns.vocabularyRetention > 0.8) {
    strengths.push("词汇记忆保留率高，表明词汇学习方法有效");
  }
  
  if (mockLearningPatterns.grammarAccuracy < 0.7) {
    weaknesses.push("语法准确率有待提高，建议增加语法专项练习");
  }
  
  if (mockLearningPatterns.speakingPracticeRate < 0.35) {
    weaknesses.push("口语练习频率偏低，影响口语表达能力的提升");
  }
  
  if (mockLearningPatterns.listeningAccuracy > 0.65) {
    strengths.push("听力理解能力良好，能够理解大部分日常对话");
  }
  
  if (mockLearningPatterns.eveningLearningRate > 0.65) {
    weaknesses.push("学习时间过于集中在晚上，可以尝试在一天中分散学习时间");
  }
  
  // 确保返回至少一个优势和一个弱点
  if (strengths.length === 0) {
    strengths.push(generateStrengths(userId)[0]);
  }
  
  if (weaknesses.length === 0) {
    weaknesses.push(generateAreasForImprovement(userId)[0]);
  }
  
  // 限制返回的数量，避免过多
  return {
    strengths: strengths.slice(0, 4),
    weaknesses: weaknesses.slice(0, 4)
  };
}

/**
 * 获取用户的课程进度
 */
async function getUserCoursesProgress(userId: string) {
  // 在实际项目中，这里应该查询数据库获取用户的课程进度
  // 这里仅使用模拟数据
  return [
    {
      courseId: "course-1",
      title: "日常英语对话",
      progress: 68
    },
    {
      courseId: "course-2",
      title: "商务英语基础",
      progress: 42
    },
    {
      courseId: "course-3",
      title: "高级语法掌握",
      progress: 25
    }
  ];
}

/**
 * 生成学习目标数据
 */
async function generateGoalsData(userId: string, currentStats: any) {
  // 在实际项目中，这里应该查询数据库获取用户的目标数据
  // 这里仅使用模拟数据
  return {
    achieved: [
      {
        goal: "完成商务英语入门单元",
        achievedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        goal: "掌握100个核心商务词汇",
        achievedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
      }
    ],
    inProgress: [
      {
        goal: "完成中级语法课程",
        progress: 65,
        remaining: "预计还需2周"
      },
      {
        goal: "提高听力理解能力到B2水平",
        progress: 40,
        remaining: "预计还需1个月"
      },
      {
        goal: "掌握300个高频商务表达",
        progress: 30,
        remaining: "已学习90个，还剩210个"
      }
    ]
  };
}

/**
 * 生成用户的优势领域
 * 实际项目中应基于用户的学习数据生成
 */
function generateStrengths(userId: string): string[] {
  // 模拟数据，实际应该基于用户学习历史
  return [
    '词汇记忆能力较强，单词记忆效率高于平均水平',
    '听力理解能力稳步提升，能够理解中速英语对话',
    '学习持续性好，能够保持规律的学习频率'
  ];
}

/**
 * 生成用户的待改进领域
 * 实际项目中应基于用户的学习数据生成
 */
function generateAreasForImprovement(userId: string): string[] {
  // 模拟数据，实际应该基于用户学习历史
  return [
    '语法练习正确率较低，特别是在复杂时态使用方面',
    '口语练习频率不足，影响口语表达能力的提升',
    '学习时间分布不均，周末学习时间显著高于工作日'
  ];
}

/**
 * 生成用户的下一步行动建议
 * 实际项目中应基于用户的学习数据生成
 */
function generateNextSteps(userId: string, weaknesses: string[]): string[] {
  // 模拟数据，实际应该基于用户学习历史和改进领域
  const steps = [
    '增加语法练习频率，特别关注过去完成时和条件句的使用',
    '建议每天抽出15分钟进行口语练习，可以使用系统的口语模式',
    '尝试在工作日安排短时间的学习会话，保持学习的连续性'
  ];
  
  // 根据弱点调整建议
  const adjustedSteps = steps.map(step => {
    if (weaknesses.includes(step)) {
      return `（建议：${step}）`;
    }
    return step;
  });
  
  return adjustedSteps;
} 