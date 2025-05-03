/**
 * 句子分析工具
 * 提供句子难度分析和特征提取功能
 */

/**
 * 分析句子难度
 * @param sentence 英文句子
 * @returns 难度系数 (1-5)，1为最简单，5为最难
 */
export async function analyzeSentenceDifficulty(sentence: string): Promise<number> {
  // 在实际应用中，这里应该使用更复杂的算法或者调用API
  // 这里使用简单的因素作为示例

  // 1. 句子长度
  const wordCount = sentence.split(/\s+/).length;
  let lengthScore = 1;
  
  if (wordCount <= 5) lengthScore = 1;
  else if (wordCount <= 10) lengthScore = 2;
  else if (wordCount <= 15) lengthScore = 3;
  else if (wordCount <= 20) lengthScore = 4;
  else lengthScore = 5;

  // 2. 词汇复杂度（这里简单使用单词平均长度作为指标）
  const words = sentence.split(/\s+/);
  const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;
  let vocabularyScore = 1;
  
  if (avgWordLength <= 3) vocabularyScore = 1;
  else if (avgWordLength <= 4) vocabularyScore = 2;
  else if (avgWordLength <= 5) vocabularyScore = 3;
  else if (avgWordLength <= 6) vocabularyScore = 4;
  else vocabularyScore = 5;

  // 3. 句法复杂度（简单检测从句和连词数量）
  const conjunctionCount = countOccurrences(sentence.toLowerCase(), [
    'and', 'but', 'or', 'so', 'because', 'if', 'when', 'while', 'although',
    'that', 'which', 'who', 'whom', 'whose'
  ]);
  
  let syntaxScore = 1;
  if (conjunctionCount <= 0) syntaxScore = 1;
  else if (conjunctionCount <= 1) syntaxScore = 2;
  else if (conjunctionCount <= 2) syntaxScore = 3;
  else if (conjunctionCount <= 3) syntaxScore = 4;
  else syntaxScore = 5;

  // 4. 时态复杂度
  const pastTenseCount = countOccurrences(sentence.toLowerCase(), ['ed ', ' was ', ' were ', ' had ']);
  const perfectTenseCount = countOccurrences(sentence.toLowerCase(), [' has ', ' have ', ' had ']);
  const continuousTenseCount = countOccurrences(sentence.toLowerCase(), ['ing ']);
  
  let tenseScore = 1;
  const tenseComplexity = pastTenseCount + perfectTenseCount * 1.5 + continuousTenseCount;
  
  if (tenseComplexity <= 0) tenseScore = 1;
  else if (tenseComplexity <= 1) tenseScore = 2;
  else if (tenseComplexity <= 2) tenseScore = 3;
  else if (tenseComplexity <= 3) tenseScore = 4;
  else tenseScore = 5;

  // 计算加权平均难度
  const overallDifficulty = (
    lengthScore * 0.25 +
    vocabularyScore * 0.3 +
    syntaxScore * 0.25 +
    tenseScore * 0.2
  );

  // 返回1-5范围内的难度值
  return Math.max(1, Math.min(5, Math.round(overallDifficulty)));
}

/**
 * 计算文本中指定词组出现的次数
 */
function countOccurrences(text: string, patterns: string[]): number {
  return patterns.reduce((count, pattern) => {
    const regex = new RegExp(pattern, 'gi');
    const matches = text.match(regex);
    return count + (matches ? matches.length : 0);
  }, 0);
}

/**
 * 分析句子结构
 * @param sentence 英文句子
 * @returns 句子结构分析结果
 */
export function analyzeSentenceStructure(sentence: string): {
  type: 'simple' | 'compound' | 'complex' | 'compound-complex',
  clauses: number,
  subjects: string[],
  verbs: string[],
  objects: string[]
} {
  // 在实际应用中，这里应该使用NLP库进行更准确的句法分析
  // 这里使用简化的逻辑作为示例
  
  const clauses = estimateClauseCount(sentence);
  
  let type: 'simple' | 'compound' | 'complex' | 'compound-complex' = 'simple';
  
  if (clauses === 1) {
    type = 'simple';
  } else if (sentence.match(/\band\b|\bbut\b|\bor\b|\bso\b/i) && !sentence.match(/\bwho\b|\bwhich\b|\bthat\b|\bwhen\b|\bwhere\b|\bwhy\b|\bhow\b/i)) {
    type = 'compound';
  } else if (!sentence.match(/\band\b|\bbut\b|\bor\b|\bso\b/i) && sentence.match(/\bwho\b|\bwhich\b|\bthat\b|\bwhen\b|\bwhere\b|\bwhy\b|\bhow\b/i)) {
    type = 'complex';
  } else if (clauses > 1) {
    type = 'compound-complex';
  }
  
  // 这里使用简化的主语、谓语、宾语提取逻辑
  // 在实际应用中应该使用NLP工具
  return {
    type,
    clauses,
    subjects: ['(简化版分析无法准确提取)'],
    verbs: ['(简化版分析无法准确提取)'],
    objects: ['(简化版分析无法准确提取)']
  };
}

/**
 * 估计句子中的从句数量
 */
function estimateClauseCount(sentence: string): number {
  const conjunctions = [
    'and', 'but', 'or', 'so', 'for', 'nor', 'yet',
    'who', 'which', 'that', 'when', 'where', 'why', 'how',
    'because', 'although', 'since', 'unless', 'if', 'while'
  ];
  
  // 计算可能的从句数量（通过连词和标点）
  let count = 1; // 主句
  
  for (const conj of conjunctions) {
    const regex = new RegExp(`\\b${conj}\\b`, 'gi');
    const matches = sentence.match(regex);
    if (matches) {
      count += matches.length;
    }
  }
  
  // 通过逗号和分号估计可能的从句
  const commas = (sentence.match(/,/g) || []).length;
  const semicolons = (sentence.match(/;/g) || []).length;
  
  // 调整计数，避免重复计算
  count = Math.min(count, 1 + commas + semicolons + 1);
  
  return count;
} 