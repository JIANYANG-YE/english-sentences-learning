/**
 * 语法分析工具
 * 提供语法点识别和分析功能
 */

// 常见语法点定义
interface GrammarPattern {
  name: string;
  pattern: RegExp;
  description: string;
  examples: string[];
}

// 常见语法模式列表
const GRAMMAR_PATTERNS: GrammarPattern[] = [
  {
    name: 'present_simple',
    pattern: /\b(?:do|does|don't|doesn't)\b.*?\b\w+\b|\b(?:am|is|are|'m|'s|'re)\s+not\b|\b\w+s\b(?!\w)/i,
    description: '一般现在时表达习惯性动作或事实',
    examples: ['I work every day.', 'She lives in London.']
  },
  {
    name: 'present_continuous',
    pattern: /\b(?:am|is|are|'m|'s|'re)\b\s+\w+ing\b/i,
    description: '现在进行时表达正在进行的动作',
    examples: ['I am working now.', 'They are playing football.']
  },
  {
    name: 'past_simple',
    pattern: /\b(?:did|didn't)\b.*?\b\w+\b|\b\w+(?:ed)\b(?!\w)/i,
    description: '一般过去时表达过去发生的动作或状态',
    examples: ['I worked yesterday.', 'She visited Paris last year.']
  },
  {
    name: 'past_continuous',
    pattern: /\b(?:was|were)\b\s+\w+ing\b/i,
    description: '过去进行时表达过去某个时间正在进行的动作',
    examples: ['I was working at 5 PM.', 'They were watching TV when I called.']
  },
  {
    name: 'present_perfect',
    pattern: /\b(?:have|has|'ve|'s)\b\s+\w+(?:ed|en|t)\b/i,
    description: '现在完成时表达过去发生并与现在有联系的动作',
    examples: ['I have worked here for 5 years.', 'She has visited many countries.']
  },
  {
    name: 'present_perfect_continuous',
    pattern: /\b(?:have|has|'ve|'s)\b\s+been\s+\w+ing\b/i,
    description: '现在完成进行时表达从过去持续到现在的动作',
    examples: ['I have been working all day.', 'She has been studying for hours.']
  },
  {
    name: 'future_simple',
    pattern: /\b(?:will|'ll|won't)\b\s+\w+\b/i,
    description: '一般将来时表达将来的动作或状态',
    examples: ['I will call you later.', 'They will arrive tomorrow.']
  },
  {
    name: 'be_going_to',
    pattern: /\b(?:am|is|are|'m|'s|'re)\b\s+going\s+to\s+\w+\b/i,
    description: 'be going to 结构表达计划或意图',
    examples: ['I am going to study tonight.', 'We are going to travel next month.']
  },
  {
    name: 'modal_verbs',
    pattern: /\b(?:can|could|may|might|must|should|would|ought\s+to)\b\s+\w+\b/i,
    description: '情态动词表达可能性、必要性、建议等',
    examples: ['You should exercise more.', 'He might come to the party.']
  },
  {
    name: 'passive_voice',
    pattern: /\b(?:am|is|are|was|were|been|be)\b\s+\w+(?:ed|en|t)\b\s+(?:by\b)?/i,
    description: '被动语态强调动作的接受者',
    examples: ['The book was written by her.', 'This building was constructed in 1990.']
  },
  {
    name: 'conditionals',
    pattern: /\bif\b.*?(?:,|then).*?\b(?:will|would|could|might|may)\b/i,
    description: '条件句表达假设情况及其结果',
    examples: ['If it rains, I will stay home.', 'If I had more time, I would travel more.']
  },
  {
    name: 'relative_clauses',
    pattern: /\b(?:who|whom|whose|which|that)\b.*?\b\w+\b/i,
    description: '定语从句提供额外信息',
    examples: ['The man who called is my teacher.', 'The book that you recommended is interesting.']
  },
  {
    name: 'reported_speech',
    pattern: /\b(?:said|told|asked|reported|announced)\b.*?\bthat\b/i,
    description: '间接引语报告他人所说的话',
    examples: ['She said that she was busy.', 'He told me that he would come.']
  },
  {
    name: 'gerunds',
    pattern: /\b\w+ing\b\s+(?:is|was|as|for)\b/i,
    description: '动名词作为名词使用',
    examples: ['Swimming is good exercise.', 'I enjoy reading books.']
  },
  {
    name: 'infinitives',
    pattern: /\bto\s+\w+\b/i,
    description: '不定式表达目的、原因等',
    examples: ['I want to learn English.', 'She went to the store to buy milk.']
  }
];

/**
 * 识别句子中的语法点
 * @param sentence 英文句子
 * @returns 识别到的语法点列表
 */
export async function identifyGrammarPoints(sentence: string): Promise<string[]> {
  // 在实际应用中，应该使用更高级的NLP工具或API进行更准确的分析
  // 这里使用简单的正则匹配作为示例
  
  const foundPatterns: string[] = [];
  
  // 检查每种语法模式
  for (const pattern of GRAMMAR_PATTERNS) {
    if (pattern.pattern.test(sentence)) {
      foundPatterns.push(pattern.name);
    }
  }
  
  return foundPatterns;
}

/**
 * 获取语法点的详细信息
 * @param grammarPoint 语法点名称
 * @returns 语法点详细信息
 */
export function getGrammarPointDetails(grammarPoint: string): GrammarPattern | null {
  return GRAMMAR_PATTERNS.find(pattern => pattern.name === grammarPoint) || null;
}

/**
 * 分析句子结构
 * @param sentence 英文句子
 * @returns 句子结构分析
 */
export function analyzeGrammaticalStructure(sentence: string): {
  structure: string,
  elements: Record<string, string[]>,
  complexityScore: number
} {
  // 在实际应用中，应该使用NLP工具进行句法分析
  // 这里使用简化的逻辑作为示例
  
  // 简单句型分类
  let structure = 'unknown';
  const elements: Record<string, string[]> = {
    subjects: [],
    verbs: [],
    objects: [],
    modifiers: []
  };
  
  // 简化的句型识别
  if (/\b(?:am|is|are|was|were)\b.*?\b(?:a|an|the)\b/i.test(sentence)) {
    structure = 'subject + be + complement';
  } else if (/\b(?:have|has|had)\b.*?\b(?:a|an|the)\b/i.test(sentence)) {
    structure = 'subject + have + object';
  } else if (/\b(?:can|could|will|would|shall|should|may|might|must)\b/i.test(sentence)) {
    structure = 'subject + modal + verb + object/complement';
  } else if (/\b(?:who|which|that|when|where|why|how)\b.*?\?$/i.test(sentence)) {
    structure = 'question (wh-)';
  } else if (/^(?:do|does|did|have|has|had|am|is|are|was|were|will|would|can|could|shall|should|may|might|must)\b/i.test(sentence)) {
    structure = 'question (yes/no)';
  } else if (/\b(?:if|unless|although|though|while|when)\b/i.test(sentence)) {
    structure = 'complex sentence (condition/time/concession)';
  } else if (/\b(?:and|but|or|nor|for|so|yet)\b/i.test(sentence)) {
    structure = 'compound sentence';
  } else if (/\b(?:who|which|that|whose|whom)\b/i.test(sentence) && !/\?$/.test(sentence)) {
    structure = 'complex sentence (relative clause)';
  } else if (/\b(?:tell|ask|know|think|believe|expect|hope|imagine|wish)\b.*?\bthat\b/i.test(sentence)) {
    structure = 'complex sentence (noun clause)';
  } else {
    structure = 'simple sentence (subject + verb + object)';
  }
  
  // 计算复杂度分数
  let complexityScore = 1;
  
  // 基于句子长度
  const wordCount = sentence.split(/\s+/).length;
  if (wordCount > 20) complexityScore += 2;
  else if (wordCount > 10) complexityScore += 1;
  
  // 基于从句数量
  const clauseCount = (sentence.match(/\b(?:who|which|that|when|where|why|how|if|unless|although|though|while)\b/gi) || []).length;
  complexityScore += clauseCount;
  
  // 基于连词数量
  const conjunctionCount = (sentence.match(/\b(?:and|but|or|nor|for|so|yet|because|since|as|therefore|thus|hence|however|nevertheless|still|otherwise|instead)\b/gi) || []).length;
  complexityScore += conjunctionCount * 0.5;
  
  // 最终复杂度（1-10）
  complexityScore = Math.min(10, Math.max(1, Math.round(complexityScore)));
  
  return {
    structure,
    elements,
    complexityScore
  };
} 