/**
 * 文本处理工具
 * 提供关键词提取、文本分析等功能
 */

// 常用英语停用词列表（简化版）
const STOPWORDS = [
  'a', 'an', 'the', 'and', 'or', 'but', 'if', 'then', 'else', 'when',
  'at', 'from', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 'through',
  'during', 'before', 'after', 'above', 'below', 'to', 'of', 'in', 'on', 'off',
  'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'where',
  'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other',
  'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than',
  'too', 'very', 's', 't', 'can', 'will', 'just', 'don', 'should', 'now',
  'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your',
  'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', 'her',
  'hers', 'herself', 'it', 'its', 'itself', 'they', 'them', 'their', 'theirs',
  'themselves', 'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those',
  'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has',
  'had', 'having', 'do', 'does', 'did', 'doing', 'would', 'should', 'could',
  'ought', 'i\'m', 'you\'re', 'he\'s', 'she\'s', 'it\'s', 'we\'re', 'they\'re',
  'i\'ve', 'you\'ve', 'we\'ve', 'they\'ve', 'i\'d', 'you\'d', 'he\'d', 'she\'d',
  'we\'d', 'they\'d', 'i\'ll', 'you\'ll', 'he\'ll', 'she\'ll', 'we\'ll', 'they\'ll',
  'isn\'t', 'aren\'t', 'wasn\'t', 'weren\'t', 'hasn\'t', 'haven\'t', 'hadn\'t',
  'doesn\'t', 'don\'t', 'didn\'t', 'won\'t', 'wouldn\'t', 'shan\'t', 'shouldn\'t',
  'can\'t', 'cannot', 'couldn\'t', 'mustn\'t', 'let\'s', 'that\'s', 'who\'s',
  'what\'s', 'here\'s', 'there\'s', 'when\'s', 'where\'s', 'why\'s', 'how\'s',
];

/**
 * 从文本中提取关键词
 * @param text 文本内容
 * @param maxKeywords 最大关键词数量
 * @returns 关键词数组
 */
export async function extractKeywords(text: string, maxKeywords: number = 5): Promise<string[]> {
  // 在实际应用中，应该使用更高级的NLP或关键词提取API
  // 这里使用简单的词频统计方法作为示例
  
  // 1. 文本预处理
  const cleanText = text.toLowerCase()
    .replace(/[^\w\s]|_/g, ' ')  // 移除标点符号
    .replace(/\s+/g, ' ')        // 替换多个空格为单个空格
    .trim();
  
  // 2. 分词
  const words = cleanText.split(' ');
  
  // 3. 移除停用词
  const filteredWords = words.filter(word => !STOPWORDS.includes(word) && word.length > 1);
  
  // 4. 计算词频
  const wordFrequency: Record<string, number> = {};
  for (const word of filteredWords) {
    wordFrequency[word] = (wordFrequency[word] || 0) + 1;
  }
  
  // 5. 排序并返回前N个关键词
  const sortedWords = Object.entries(wordFrequency)
    .sort((a, b) => b[1] - a[1])
    .map(entry => entry[0]);
  
  return sortedWords.slice(0, maxKeywords);
}

/**
 * 计算文本的可读性指标
 * @param text 文本内容
 * @returns 可读性评分
 */
export function calculateReadabilityScores(text: string): {
  fleschReadingEase: number,
  fleschKincaidGrade: number,
  averageSentenceLength: number,
  averageWordLength: number
} {
  // 计算句子数量
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const sentenceCount = sentences.length;
  
  // 计算单词数量
  const words = text.split(/\s+/).filter(w => w.match(/[a-zA-Z0-9]+/));
  const wordCount = words.length;
  
  // 计算音节数量（简化版）
  const syllableCount = countSyllables(text);
  
  // 计算平均句子长度和单词长度
  const averageSentenceLength = sentenceCount > 0 ? wordCount / sentenceCount : 0;
  const averageWordLength = wordCount > 0 ? text.replace(/[^a-zA-Z0-9]/g, '').length / wordCount : 0;
  
  // 计算Flesch Reading Ease
  const fleschReadingEase = 206.835 - (1.015 * averageSentenceLength) - (84.6 * (syllableCount / wordCount));
  
  // 计算Flesch-Kincaid Grade Level
  const fleschKincaidGrade = (0.39 * averageSentenceLength) + (11.8 * (syllableCount / wordCount)) - 15.59;
  
  return {
    fleschReadingEase: Math.round(fleschReadingEase * 10) / 10,
    fleschKincaidGrade: Math.round(fleschKincaidGrade * 10) / 10,
    averageSentenceLength: Math.round(averageSentenceLength * 10) / 10,
    averageWordLength: Math.round(averageWordLength * 10) / 10
  };
}

/**
 * 粗略计算文本中的音节数量
 * @param text 文本内容
 * @returns 音节数量
 */
function countSyllables(text: string): number {
  // 简化的音节计数方法
  const words = text.toLowerCase().split(/\s+/);
  let count = 0;
  
  for (const word of words) {
    // 清理单词，只保留字母
    const cleanWord = word.replace(/[^a-z]/g, '');
    
    if (cleanWord.length <= 3) {
      // 短词通常只有一个音节
      count += 1;
      continue;
    }
    
    // 计算元音组
    const vowelGroups = cleanWord.replace(/[^aeiouy]+/g, ' ').trim().split(' ');
    let syllables = vowelGroups.length;
    
    // 调整常见的特例
    if (cleanWord.endsWith('e') && syllables > 1) {
      syllables -= 1; // 通常末尾的e是静音的
    }
    
    if (cleanWord.endsWith('le') && cleanWord.length > 2 && !isVowel(cleanWord[cleanWord.length - 3])) {
      syllables += 1; // 'le'在辅音后通常是一个单独的音节
    }
    
    if (cleanWord.endsWith('es') || cleanWord.endsWith('ed')) {
      // 'es'和'ed'结尾的单词通常不会增加音节
      if (syllables > 1) {
        syllables -= 1;
      }
    }
    
    // 确保每个单词至少有一个音节
    count += Math.max(1, syllables);
  }
  
  return count;
}

/**
 * 检查字符是否为元音
 */
function isVowel(char: string): boolean {
  return 'aeiouy'.includes(char);
}

/**
 * 从文本中提取常见短语
 * @param text 文本内容
 * @param minOccurrences 最小出现次数
 * @returns 常见短语列表
 */
export function extractCommonPhrases(text: string, minOccurrences: number = 2): string[] {
  // 这里使用一个简化的方法，在实际应用中应该使用更复杂的算法或API
  
  // 清理文本并分词
  const cleanText = text.toLowerCase()
    .replace(/[^\w\s]|_/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  const words = cleanText.split(' ');
  
  // 提取2-3个词的短语
  const phrases: Record<string, number> = {};
  
  for (let i = 0; i < words.length - 1; i++) {
    // 2个词的短语
    if (!STOPWORDS.includes(words[i])) {
      const phrase2 = words.slice(i, i + 2).join(' ');
      phrases[phrase2] = (phrases[phrase2] || 0) + 1;
      
      // 3个词的短语
      if (i < words.length - 2) {
        const phrase3 = words.slice(i, i + 3).join(' ');
        phrases[phrase3] = (phrases[phrase3] || 0) + 1;
      }
    }
  }
  
  // 过滤并排序短语
  return Object.entries(phrases)
    .filter(([phrase, count]) => count >= minOccurrences && !STOPWORDS.includes(phrase.split(' ')[0]))
    .sort((a, b) => b[1] - a[1])
    .map(entry => entry[0]);
} 