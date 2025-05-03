import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

// 学习瓶颈类型枚举
export enum BottleneckType {
  VOCABULARY = 'vocabulary',
  GRAMMAR = 'grammar',
  LISTENING = 'listening',
  SPEAKING = 'speaking',
  READING = 'reading',
  WRITING = 'writing',
  TIME_MANAGEMENT = 'time_management',
  LEARNING_PATTERN = 'learning_pattern',
  RETENTION = 'retention',
  MOTIVATION = 'motivation'
}

// 瓶颈严重程度枚举
export enum SeverityLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

// 瓶颈数据验证模式
const bottleneckSchema = z.object({
  id: z.string().optional(),
  userId: z.string(),
  type: z.nativeEnum(BottleneckType),
  severity: z.nativeEnum(SeverityLevel),
  description: z.string(),
  details: z.object({
    specificIssues: z.array(z.string()),
    relatedItems: z.array(z.object({
      itemId: z.string(),
      itemType: z.string(),
      errorCount: z.number().optional(),
      timeSpent: z.number().optional()
    })).optional(),
    timeFrameStart: z.string().optional(),
    timeFrameEnd: z.string().optional()
  }),
  suggestions: z.array(z.object({
    title: z.string(),
    description: z.string(),
    resources: z.array(z.object({
      title: z.string(),
      type: z.string(),
      url: z.string().optional(),
      id: z.string().optional()
    })).optional()
  })),
  detectedAt: z.string().optional(),
  resolvedAt: z.string().optional(),
  status: z.enum(['active', 'in_progress', 'resolved']).optional()
});

// 数据存储（未来可替换为实际数据库）
type BottleneckData = z.infer<typeof bottleneckSchema>;
let bottlenecksData: BottleneckData[] = [];

/**
 * GET /api/analytics/bottlenecks
 * 获取学习瓶颈列表
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const type = searchParams.get('type') as BottleneckType | null;
    const severity = searchParams.get('severity') as SeverityLevel | null;
    const status = searchParams.get('status') as 'active' | 'in_progress' | 'resolved' | null;
    
    let filteredBottlenecks = bottlenecksData;
    
    // 按用户ID筛选
    if (userId) {
      filteredBottlenecks = filteredBottlenecks.filter(item => item.userId === userId);
    }
    
    // 按类型筛选
    if (type) {
      filteredBottlenecks = filteredBottlenecks.filter(item => item.type === type);
    }
    
    // 按严重程度筛选
    if (severity) {
      filteredBottlenecks = filteredBottlenecks.filter(item => item.severity === severity);
    }
    
    // 按状态筛选
    if (status) {
      filteredBottlenecks = filteredBottlenecks.filter(item => item.status === status);
    }
    
    // 按严重程度排序（从高到低）
    filteredBottlenecks.sort((a, b) => {
      const severityOrder = {
        [SeverityLevel.CRITICAL]: 4,
        [SeverityLevel.HIGH]: 3,
        [SeverityLevel.MEDIUM]: 2,
        [SeverityLevel.LOW]: 1
      };
      
      return severityOrder[b.severity] - severityOrder[a.severity];
    });
    
    return NextResponse.json(filteredBottlenecks, { status: 200 });
  } catch (error) {
    console.error('获取学习瓶颈失败:', error);
    return NextResponse.json(
      { error: '获取学习瓶颈失败' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/analytics/bottlenecks
 * 记录新的学习瓶颈或更新现有瓶颈
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 验证请求数据
    const validationResult = bottleneckSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: '无效的瓶颈数据', details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    const newBottleneck = validationResult.data;
    
    // 添加ID和时间戳（如果未提供）
    if (!newBottleneck.id) {
      newBottleneck.id = uuidv4();
    }
    
    if (!newBottleneck.detectedAt) {
      newBottleneck.detectedAt = new Date().toISOString();
    }
    
    if (!newBottleneck.status) {
      newBottleneck.status = 'active';
    }
    
    // 检查是否存在相同ID的瓶颈
    const existingIndex = bottlenecksData.findIndex(item => item.id === newBottleneck.id);
    
    if (existingIndex !== -1) {
      // 更新现有瓶颈
      bottlenecksData[existingIndex] = newBottleneck;
    } else {
      // 添加新瓶颈
      bottlenecksData.push(newBottleneck);
    }
    
    return NextResponse.json(newBottleneck, { status: 201 });
  } catch (error) {
    console.error('保存学习瓶颈失败:', error);
    return NextResponse.json(
      { error: '保存学习瓶颈失败' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/analytics/bottlenecks/[id]
 * 更新学习瓶颈状态
 */
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const bottleneckId = searchParams.get('id');
    
    if (!bottleneckId) {
      return NextResponse.json(
        { error: '必须提供瓶颈ID' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    
    // 找到要更新的瓶颈
    const existingIndex = bottlenecksData.findIndex(item => item.id === bottleneckId);
    
    if (existingIndex === -1) {
      return NextResponse.json(
        { error: '瓶颈不存在' },
        { status: 404 }
      );
    }
    
    // 当状态变更为已解决时，添加解决时间
    if (body.status === 'resolved' && bottlenecksData[existingIndex].status !== 'resolved') {
      body.resolvedAt = new Date().toISOString();
    }
    
    // 更新瓶颈
    bottlenecksData[existingIndex] = {
      ...bottlenecksData[existingIndex],
      ...body,
    };
    
    return NextResponse.json(bottlenecksData[existingIndex], { status: 200 });
  } catch (error) {
    console.error('更新学习瓶颈失败:', error);
    return NextResponse.json(
      { error: '更新学习瓶颈失败' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/analytics/bottlenecks/[id]
 * 删除学习瓶颈
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const bottleneckId = searchParams.get('id');
    
    if (!bottleneckId) {
      return NextResponse.json(
        { error: '必须提供瓶颈ID' },
        { status: 400 }
      );
    }
    
    // 过滤掉要删除的瓶颈
    const initialLength = bottlenecksData.length;
    bottlenecksData = bottlenecksData.filter(item => item.id !== bottleneckId);
    
    if (bottlenecksData.length === initialLength) {
      return NextResponse.json(
        { error: '瓶颈不存在' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { success: true, message: '瓶颈已删除' },
      { status: 200 }
    );
  } catch (error) {
    console.error('删除学习瓶颈失败:', error);
    return NextResponse.json(
      { error: '删除学习瓶颈失败' },
      { status: 500 }
    );
  }
}

/**
 * 分析用户数据并自动检测学习瓶颈
 * @param userId 用户ID
 */
export async function analyzeUserBottlenecks(userId: string): Promise<BottleneckData[]> {
  try {
    // 此函数将在实际项目中连接到用户学习数据，
    // 分析学习模式、错误类型、学习时间分布等，
    // 自动检测可能的学习瓶颈。
    
    // 获取用户学习会话数据
    // 这里仅使用模拟数据，实际项目中应该从数据库获取
    const userSessions = [
      { 
        userId, 
        errorRate: 0.35, 
        timeSpent: 120, 
        wordErrorTypes: ['pronunciation', 'meaning'],
        grammarErrorTypes: ['tense', 'conditionals', 'articles'],
        timeOfDay: 22, 
        dayOfWeek: 6, 
        completionRate: 0.7,
        focusLevel: 5
      },
      { 
        userId, 
        errorRate: 0.42, 
        timeSpent: 90, 
        wordErrorTypes: ['spelling', 'collocation'],
        grammarErrorTypes: ['tense', 'prepositions'],
        timeOfDay: 21, 
        dayOfWeek: 0, 
        completionRate: 0.6,
        focusLevel: 4
      }
    ];
    
    // 提取学习模式指标
    const averageErrorRate = userSessions.reduce((sum, session) => sum + session.errorRate, 0) / userSessions.length;
    const lateNightSessions = userSessions.filter(session => session.timeOfDay >= 22 || session.timeOfDay <= 5).length;
    const weekendSessions = userSessions.filter(session => session.dayOfWeek === 0 || session.dayOfWeek === 6).length;
    const averageCompletionRate = userSessions.reduce((sum, session) => sum + session.completionRate, 0) / userSessions.length;
    const averageFocusLevel = userSessions.reduce((sum, session) => sum + session.focusLevel, 0) / userSessions.length;
    
    // 统计错误类型
    const wordErrorCounts: Record<string, number> = {};
    const grammarErrorCounts: Record<string, number> = {};
    
    userSessions.forEach(session => {
      session.wordErrorTypes.forEach(type => {
        wordErrorCounts[type] = (wordErrorCounts[type] || 0) + 1;
      });
      
      session.grammarErrorTypes.forEach(type => {
        grammarErrorCounts[type] = (grammarErrorCounts[type] || 0) + 1;
      });
    });
    
    // 识别常见词汇错误
    const commonWordErrors = Object.entries(wordErrorCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([type]) => type);
    
    // 识别常见语法错误
    const commonGrammarErrors = Object.entries(grammarErrorCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([type]) => type);
    
    // 基于分析结果识别瓶颈
    const detectedBottlenecks: BottleneckData[] = [];
    
    // 检测词汇瓶颈
    if (averageErrorRate > 0.3 && commonWordErrors.length > 0) {
      const wordBottleneck: BottleneckData = {
        id: uuidv4(),
        userId,
        type: BottleneckType.VOCABULARY,
        severity: averageErrorRate > 0.4 ? SeverityLevel.HIGH : SeverityLevel.MEDIUM,
        description: '词汇掌握障碍',
        details: {
          specificIssues: [
            `在${commonWordErrors.join('和')}方面存在持续错误`,
            '单词记忆保留率低于预期',
            '应用词汇到实际语境的能力有限'
          ],
          relatedItems: [
            {
              itemId: 'vocab-mastery-101',
              itemType: 'course',
              errorCount: Math.round(averageErrorRate * 100)
            }
          ]
        },
        suggestions: [
          {
            title: '词汇学习策略调整',
            description: '建议改变当前的词汇学习方法，尝试情景记忆和词根词缀分析法',
            resources: [
              {
                title: '高效词汇记忆技巧',
                type: 'article',
                id: 'vocab-mem-techniques'
              },
              {
                title: '词根词缀速记课程',
                type: 'course',
                id: 'roots-affixes-course'
              }
            ]
          },
          {
            title: '间隔重复练习',
            description: '使用科学的间隔重复系统，提高词汇的长期记忆效果',
            resources: [
              {
                title: '词汇间隔复习工具',
                type: 'tool',
                id: 'spaced-repetition-tool'
              }
            ]
          }
        ],
        detectedAt: new Date().toISOString(),
        status: 'active'
      };
      
      detectedBottlenecks.push(wordBottleneck);
    }
    
    // 检测语法瓶颈
    if (commonGrammarErrors.length > 0) {
      const grammarDescription = commonGrammarErrors.includes('tense') 
        ? '时态使用困难' 
        : commonGrammarErrors.includes('conditionals')
          ? '条件句使用困难'
          : '语法结构应用障碍';
          
      const grammarBottleneck: BottleneckData = {
        id: uuidv4(),
        userId,
        type: BottleneckType.GRAMMAR,
        severity: commonGrammarErrors.length > 1 ? SeverityLevel.HIGH : SeverityLevel.MEDIUM,
        description: grammarDescription,
        details: {
          specificIssues: commonGrammarErrors.map(error => {
            switch(error) {
              case 'tense': return '混淆过去时和现在完成时的使用场景';
              case 'conditionals': return '在虚拟语气中使用错误的时态';
              case 'articles': return '不确定何时使用定冠词和不定冠词';
              case 'prepositions': return '介词选择错误，特别是时间和地点介词';
              default: return `${error}使用困难`;
            }
          }),
          relatedItems: [
            {
              itemId: 'grammar-essentials',
              itemType: 'lesson',
              errorCount: Object.values(grammarErrorCounts).reduce((sum, count) => sum + count, 0)
            }
          ]
        },
        suggestions: [
          {
            title: '针对性语法练习',
            description: `集中练习${commonGrammarErrors.join('和')}的使用规则和例外情况`,
            resources: [
              {
                title: '语法专项训练',
                type: 'exercise',
                id: 'grammar-focused-ex'
              }
            ]
          }
        ],
        detectedAt: new Date().toISOString(),
        status: 'active'
      };
      
      detectedBottlenecks.push(grammarBottleneck);
    }
    
    // 检测时间管理瓶颈
    if (lateNightSessions > userSessions.length * 0.5 || weekendSessions > userSessions.length * 0.7) {
      const timeManagementBottleneck: BottleneckData = {
        id: uuidv4(),
        userId,
        type: BottleneckType.TIME_MANAGEMENT,
        severity: SeverityLevel.MEDIUM,
        description: '学习时间分布不均',
        details: {
          specificIssues: [
            lateNightSessions > userSessions.length * 0.5 ? '过多深夜学习可能影响记忆效果' : '',
            weekendSessions > userSessions.length * 0.7 ? '学习过于集中在周末，缺乏日常持续性' : '',
            '工作日学习时间不足，影响知识巩固'
          ].filter(issue => issue !== ''),
          timeFrameStart: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          timeFrameEnd: new Date().toISOString()
        },
        suggestions: [
          {
            title: '建立均衡学习计划',
            description: '制定更均衡的学习时间表，将学习分散到每天的高效时间段',
            resources: [
              {
                title: '高效学习时间规划',
                type: 'article',
                id: 'time-management-guide'
              }
            ]
          },
          {
            title: '使用微学习技巧',
            description: '利用碎片时间进行短时高效学习，保持学习连续性',
            resources: [
              {
                title: '微学习方法与工具',
                type: 'video',
                id: 'microlearning-methods'
              }
            ]
          }
        ],
        detectedAt: new Date().toISOString(),
        status: 'active'
      };
      
      detectedBottlenecks.push(timeManagementBottleneck);
    }
    
    // 检测学习模式瓶颈
    if (averageFocusLevel < 6 || averageCompletionRate < 0.75) {
      const learningPatternBottleneck: BottleneckData = {
        id: uuidv4(),
        userId,
        type: BottleneckType.LEARNING_PATTERN,
        severity: averageFocusLevel < 4 ? SeverityLevel.HIGH : SeverityLevel.MEDIUM,
        description: '学习专注度和完成率低',
        details: {
          specificIssues: [
            averageFocusLevel < 6 ? `平均专注度评分为${averageFocusLevel}/10，低于理想水平` : '',
            averageCompletionRate < 0.75 ? `学习活动平均完成率为${Math.round(averageCompletionRate * 100)}%，影响学习效果` : '',
            '学习中断频繁，影响知识连贯性理解'
          ].filter(issue => issue !== '')
        },
        suggestions: [
          {
            title: '专注力训练',
            description: '使用番茄工作法等技巧提高学习专注度',
            resources: [
              {
                title: '提升学习专注力的方法',
                type: 'course',
                id: 'focus-improvement'
              }
            ]
          },
          {
            title: '学习目标设定',
            description: '设置明确、可实现的短期学习目标，增强学习动力',
            resources: [
              {
                title: '有效目标设定指南',
                type: 'worksheet',
                id: 'goal-setting-guide'
              }
            ]
          }
        ],
        detectedAt: new Date().toISOString(),
        status: 'active'
      };
      
      detectedBottlenecks.push(learningPatternBottleneck);
    }
    
    // 存储检测到的瓶颈
    detectedBottlenecks.forEach(bottleneck => {
      const existingIndex = bottlenecksData.findIndex(
        item => item.userId === bottleneck.userId && item.type === bottleneck.type
      );
      
      if (existingIndex !== -1) {
        // 更新现有瓶颈
        bottlenecksData[existingIndex] = bottleneck;
      } else {
        // 添加新瓶颈
        bottlenecksData.push(bottleneck);
      }
    });
    
    return detectedBottlenecks;
  } catch (error) {
    console.error('分析用户瓶颈失败:', error);
    return [];
  }
} 