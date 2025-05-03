import axios from 'axios';

// OpenAI API配置
interface OpenAIConfig {
  apiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
  organization?: string;
}

// OpenAI聊天消息类型
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// OpenAI响应类型
export interface AIResponse {
  text: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  raw?: any; // 原始响应数据，用于高级场景
}

// 学习反馈请求类型
export interface LearningFeedbackRequest {
  userInput: string;
  correctAnswer: string;
  context?: string;
  language?: string;
  requestType: 'grammar' | 'pronunciation' | 'vocabulary' | 'sentence' | 'comprehensive';
}

// 学习建议请求类型
export interface LearningSuggestionRequest {
  userHistory: {
    strengths: string[];
    weaknesses: string[];
    recentActivities: string[];
    proficiency: string;
  };
  learningGoal: string;
  preferredLearningStyle?: string;
  timeAvailable?: string;
}

/**
 * OpenAI服务类，提供与OpenAI API的集成功能
 */
export class OpenAIService {
  private config: OpenAIConfig;
  private baseUrl = 'https://api.openai.com/v1';
  
  constructor(config: Partial<OpenAIConfig> = {}) {
    // 默认配置
    this.config = {
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || '',
      model: 'gpt-4',
      temperature: 0.7,
      maxTokens: 1000,
      ...config
    };
  }
  
  /**
   * 设置API密钥
   * @param apiKey OpenAI API密钥
   */
  setApiKey(apiKey: string): void {
    this.config.apiKey = apiKey;
  }
  
  /**
   * 设置模型
   * @param model 模型名称，如gpt-4、gpt-3.5-turbo等
   */
  setModel(model: string): void {
    this.config.model = model;
  }
  
  /**
   * 创建聊天完成请求
   * @param messages 聊天消息数组
   * @param options 可选参数
   * @returns AI响应
   */
  async createChatCompletion(
    messages: ChatMessage[],
    options: Partial<OpenAIConfig> = {}
  ): Promise<AIResponse> {
    try {
      const requestConfig = {
        ...this.config,
        ...options
      };
      
      const response = await axios.post(
        `${this.baseUrl}/chat/completions`,
        {
          model: requestConfig.model,
          messages,
          temperature: requestConfig.temperature,
          max_tokens: requestConfig.maxTokens
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${requestConfig.apiKey}`,
            ...(requestConfig.organization ? { 'OpenAI-Organization': requestConfig.organization } : {})
          }
        }
      );
      
      const data = response.data;
      
      return {
        text: data.choices[0].message.content,
        usage: {
          promptTokens: data.usage.prompt_tokens,
          completionTokens: data.usage.completion_tokens,
          totalTokens: data.usage.total_tokens
        },
        raw: data
      };
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      throw new Error(`OpenAI API error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * 获取学习反馈
   * @param request 学习反馈请求
   * @returns AI反馈响应
   */
  async getLearningFeedback(request: LearningFeedbackRequest): Promise<AIResponse> {
    const { userInput, correctAnswer, context, language, requestType } = request;
    
    // 构建系统提示
    let systemPrompt = '你是一位专业的英语教师，提供详细和有建设性的反馈。';
    
    switch (requestType) {
      case 'grammar':
        systemPrompt += '专注于语法错误的识别和纠正，提供清晰的语法规则解释。';
        break;
      case 'pronunciation':
        systemPrompt += '专注于发音问题的识别，提供标准音标和发音技巧。';
        break;
      case 'vocabulary':
        systemPrompt += '专注于词汇使用的准确性，提供更贴切的词汇选择和同义词建议。';
        break;
      case 'sentence':
        systemPrompt += '专注于句子结构和表达的自然度，提供更地道的表达方式。';
        break;
      case 'comprehensive':
        systemPrompt += '提供全面的语言评估，包括语法、词汇、句式和表达的自然度。';
        break;
    }
    
    // 添加语言偏好
    if (language) {
      systemPrompt += `请用${language}回答。`;
    }
    
    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      { 
        role: 'user', 
        content: `
我的回答: ${userInput}
正确答案: ${correctAnswer}
${context ? `上下文: ${context}` : ''}

请提供详细的反馈，指出我的错误并给出改进建议。
`
      }
    ];
    
    return this.createChatCompletion(messages, { temperature: 0.5 });
  }
  
  /**
   * 获取个性化学习建议
   * @param request 学习建议请求
   * @returns AI建议响应
   */
  async getLearningSuggestions(request: LearningSuggestionRequest): Promise<AIResponse> {
    const { userHistory, learningGoal, preferredLearningStyle, timeAvailable } = request;
    
    const messages: ChatMessage[] = [
      { 
        role: 'system', 
        content: '你是一位专业的英语学习顾问，根据学习者的情况提供个性化的学习建议和资源推荐。请提供具体的、可操作的学习计划。'
      },
      { 
        role: 'user', 
        content: `
请根据以下信息为我制定个性化英语学习计划:

学习目标: ${learningGoal}

我的优势:
${userHistory.strengths.map(s => `- ${s}`).join('\n')}

我的弱点:
${userHistory.weaknesses.map(w => `- ${w}`).join('\n')}

最近学习活动:
${userHistory.recentActivities.map(a => `- ${a}`).join('\n')}

当前英语水平: ${userHistory.proficiency}
${preferredLearningStyle ? `学习风格偏好: ${preferredLearningStyle}` : ''}
${timeAvailable ? `可用学习时间: ${timeAvailable}` : ''}

请提供详细的学习计划，包括:
1. 针对我弱点的具体练习建议
2. 适合我水平的学习资源
3. 合理的学习时间分配
4. 短期和长期目标设置
`
      }
    ];
    
    return this.createChatCompletion(messages, { temperature: 0.7 });
  }
  
  /**
   * 生成针对性练习内容
   * @param topic 主题
   * @param difficulty 难度级别
   * @param language 响应语言
   * @returns AI生成的练习内容
   */
  async generatePracticeContent(
    topic: string,
    difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert',
    language: string = '中文'
  ): Promise<AIResponse> {
    // 构建难度描述
    let difficultyDescription = '';
    switch (difficulty) {
      case 'beginner':
        difficultyDescription = '初级水平，使用基础词汇和简单句型';
        break;
      case 'intermediate':
        difficultyDescription = '中级水平，使用常见词汇和基本复合句';
        break;
      case 'advanced':
        difficultyDescription = '高级水平，使用丰富词汇和复杂句型';
        break;
      case 'expert':
        difficultyDescription = '专家水平，使用专业词汇和高级语言结构';
        break;
    }
    
    const messages: ChatMessage[] = [
      { 
        role: 'system', 
        content: `你是一位专业的英语教育内容创作者，擅长创建针对性的英语学习材料。请用${language}提供练习说明和英文内容。`
      },
      { 
        role: 'user', 
        content: `
请生成一个关于"${topic}"的英语练习。难度要求：${difficultyDescription}。

练习内容需要包括：
1. 3-5个与主题相关的英文句子，注意体现合适的难度
2. 每个句子的关键词汇解释
3. 2-3个理解性问题
4. 1个开放性讨论问题
5. 实用场景应用建议

请确保内容有教育价值且与实际生活相关。
`
      }
    ];
    
    return this.createChatCompletion(messages, { temperature: 0.8 });
  }
  
  /**
   * 分析用户学习模式
   * @param learningData 学习数据
   * @param language 响应语言
   * @returns AI分析结果
   */
  async analyzeLearningPatterns(
    learningData: {
      completedLessons: number;
      correctAnswers: number;
      totalQuestions: number;
      timeSpent: number; // 分钟
      topErrors: string[];
      preferredTopics: string[];
      dailyActivity: { date: string; minutes: number }[];
    },
    language: string = '中文'
  ): Promise<AIResponse> {
    const messages: ChatMessage[] = [
      { 
        role: 'system', 
        content: `你是一位专业的学习分析师，能够从学习数据中找出模式和提供优化建议。请用${language}回答。`
      },
      { 
        role: 'user', 
        content: `
请分析以下学习数据，并提供深入见解和改进建议：

完成课程数: ${learningData.completedLessons}
正确答案数: ${learningData.correctAnswers}
总问题数: ${learningData.totalQuestions}
学习时间: ${learningData.timeSpent}分钟

最常见错误:
${learningData.topErrors.map((e, i) => `${i+1}. ${e}`).join('\n')}

偏好主题:
${learningData.preferredTopics.map((t, i) => `${i+1}. ${t}`).join('\n')}

日常活动:
${learningData.dailyActivity.map(d => `${d.date}: ${d.minutes}分钟`).join('\n')}

请提供:
1. 学习效率和表现分析
2. 发现的学习模式和习惯
3. 针对性的改进建议
4. 根据数据制定的最佳学习计划
`
      }
    ];
    
    return this.createChatCompletion(messages, { temperature: 0.5 });
  }
}

export default OpenAIService; 