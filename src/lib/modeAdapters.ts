/**
 * 学习模式适配器
 * 用于将课程内容处理为适合不同学习模式的格式
 */
import { 
  ContentBlock, 
  SentencePair, 
  isParagraphBlock, 
  isDialogBlock, 
  isHeadingBlock, 
  DialogBlock,
  SentencesBlock,
  ContentBlockType,
  ParagraphBlock,
  ContentBlockBase
} from '@/types/courses/contentTypes';
import { 
  ModeContent, 
  ModeContentItem,
  ChineseToEnglishContent,
  EnglishToChineseContent,
  GrammarContent,
  ListeningContent,
  NotesContent
} from '@/types/courses/packageTypes';
import { LearningMode } from '@/types/learning';

// 修改SentencePair接口扩展，添加metadata属性
interface ExtendedSentencePair extends SentencePair {
  metadata?: {
    difficulty?: 'easy' | 'medium' | 'hard';
    aiAdjustedDifficulty?: 'beginner' | 'intermediate' | 'advanced';
    [key: string]: unknown;
  };
  calculatedDifficulty?: number;
}

// 定义对话对类型
interface DialogPair {
  speakerId: string;
  sentencePair: SentencePair;
}

// 用于课程内容的接口定义
interface LessonContent {
  id: string;
  title: string;
  description: string;
  contentBlocks: ContentBlock[];
  sentencePairs: SentencePair[];
}

// 用户学习偏好类型
interface UserPreferences {
  autoPlayAudio?: boolean;
  showTranslation?: boolean;
  fontSize?: 'small' | 'medium' | 'large';
  highlightStyle?: 'underline' | 'background' | 'both';
  speechRate?: number;
  preferredVoice?: string;
  [key: string]: unknown;
}

// 学习内容元数据类型
interface LearningContentMetadata {
  totalItems: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTimeMinutes: number;
  tags: string[];
  [key: string]: unknown;
}

// 添加扩展的内容块接口，用于模拟数据
interface ExtendedContentBlock {
  lessonId: string;
  createdAt: string;
  updatedAt: string;
}

// 扩展段落块接口
interface ExtendedParagraphBlock extends ParagraphBlock, ExtendedContentBlock {}

/**
 * 从内容块中提取所有句子对
 */
export function extractSentencePairs(contentBlocks: ContentBlock[]): SentencePair[] {
  const pairs: SentencePair[] = [];
  
  contentBlocks.forEach(block => {
    if (isParagraphBlock(block)) {
      // 这里我们可能需要从段落内容中提取句子
      // 简化处理：考虑每个段落为一个句子
      const pair: SentencePair = {
        id: `pair-${block.id}`,
        english: block.content.english,
        chinese: block.content.chinese,
        pinyin: block.content.pinyin
      };
      pairs.push(pair);
    } else if (isDialogBlock(block)) {
      // 从对话行中提取句子
      block.content.lines.forEach((line, index) => {
        const pair: SentencePair = {
          id: `dialog-${block.id}-line-${index}`,
          english: line.english,
          chinese: line.chinese,
          pinyin: line.pinyin,
          audioUrl: line.audioUrl
        };
        pairs.push(pair);
      });
    } else if (isHeadingBlock(block)) {
      // 标题不需要作为句子对处理
      // 可以根据需要添加逻辑
    } else if (block.type === ContentBlockType.SENTENCES) {
      // 处理句子块
      const sentencesBlock = block as SentencesBlock;
      pairs.push(...sentencesBlock.content.pairs);
    }
  });
  
  return pairs;
}

/**
 * 将课程内容处理为特定学习模式格式
 */
export function getLessonContentForMode(
  lessonTitle: string,
  lessonDescription: string,
  lessonId: string,
  contentBlocks: ContentBlock[],
  mode: LearningMode
): ModeContent {
  // 提取所有句子对
  const sentencePairs = extractSentencePairs(contentBlocks);
  
  // 创建内容块到句子对的映射
  const blockOrigins = createSentencePairMapping(contentBlocks);
  
  // 根据学习模式格式化内容（使用同步版本）
  let contentItems: ModeContentItem[] = [];
  
  switch (mode) {
    case 'chinese-to-english':
      contentItems = formatForChineseToEnglishSync(sentencePairs, blockOrigins);
      break;
    case 'english-to-chinese':
      contentItems = formatForEnglishToChineseSync(sentencePairs, blockOrigins);
      break;
    case 'listening':
      contentItems = formatForListeningSync(sentencePairs, blockOrigins);
      break;
    case 'grammar':
      contentItems = formatForGrammarSync(sentencePairs, blockOrigins);
      break;
    case 'notes':
      contentItems = formatForNotesSync(sentencePairs, blockOrigins);
      break;
    default:
      contentItems = formatForChineseToEnglishSync(sentencePairs, blockOrigins);
  }
  
  return {
    lessonId,
    mode,
    title: lessonTitle,
    description: lessonDescription,
    contentItems
  };
}

/**
 * 同步版本的中译英模式格式化
 */
function formatForChineseToEnglishSync(
  pairs: SentencePair[],
  blockOrigins?: Map<string, ContentBlock>
): ModeContentItem[] {
  return pairs.map((pair, index) => {
    const blockId = blockOrigins?.get(pair.id)?.id;
    const item: ModeContentItem = {
      id: pair.id,
      type: 'translation-pair',
      content: {
        prompt: pair.chinese,
        answer: pair.english,
        audioUrl: pair.audioUrl,
        keywords: extractKeywords(pair.english, 3)
      } as ChineseToEnglishContent,
      metadata: {
        order: index,
        blockOrigin: blockId
      }
    };
    return item;
  });
}

/**
 * 同步版本的英译中模式格式化
 */
function formatForEnglishToChineseSync(
  pairs: SentencePair[],
  blockOrigins?: Map<string, ContentBlock>
): ModeContentItem[] {
  return pairs.map((pair, index) => {
    const extendedPair = pair as ExtendedSentencePair;
    const item: ModeContentItem = {
      id: pair.id,
      type: 'translation-pair',
      content: {
        prompt: pair.english,
        answer: pair.chinese,
        audioUrl: pair.audioUrl,
        contextVocabulary: generateContextVocabulary(pair.english, 3)
      } as EnglishToChineseContent,
      metadata: {
        order: index,
        ...(extendedPair.metadata || {}),
        blockOrigin: blockOrigins?.get(pair.id)?.id
      }
    };
    return item;
  });
}

/**
 * 同步版本的听力模式格式化
 */
function formatForListeningSync(
  pairs: SentencePair[],
  blockOrigins?: Map<string, ContentBlock>
): ModeContentItem[] {
  // 为听力模式创建不同的单词选择
  return pairs.map((pair, index) => {
    const extendedPair = pair as ExtendedSentencePair;
    const words = pair.english.split(/\s+/).filter(word => word.length > 2);
    const blankWords = words.length > 3 
      ? [words[Math.floor(Math.random() * words.length)]] 
      : words.length > 0 ? [words[0]] : [];
    
    // 创建选项
    const options = generateOptions(blankWords[0], words, 3);
    
    const item: ModeContentItem = {
      id: pair.id,
      type: 'listening-exercise',
      content: {
        audioUrl: pair.audioUrl || '',
        transcript: pair.english,
        translation: pair.chinese,
        // 添加ListeningContent所需的其他属性
        questions: [
          {
            question: '填空题',
            options: options,
            answer: blankWords[0] || ''
          }
        ]
      } as ListeningContent,
      metadata: {
        order: index,
        ...(extendedPair.metadata || {}),
        blockOrigin: blockOrigins?.get(pair.id)?.id,
        blankWords,
        sentence: pair.english
      }
    };
    return item;
  });
}

/**
 * 同步版本的语法模式格式化
 */
function formatForGrammarSync(
  pairs: SentencePair[],
  blockOrigins?: Map<string, ContentBlock>
): ModeContentItem[] {
  return pairs.map((pair, index) => {
    const extendedPair = pair as ExtendedSentencePair;
    // 简单的语法分析示例
    const analysis = analyzeGrammarSync(pair.english);
    
    const item: ModeContentItem = {
      id: pair.id,
      type: 'grammar-analysis',
      content: {
        sentence: pair.english,
        translation: pair.chinese,
        explanation: analysis.explanation,
        grammarPoint: '基本句法结构',
        examples: [
          { english: pair.english, chinese: pair.chinese }
        ]
      } as GrammarContent,
      metadata: {
        order: index,
        ...(extendedPair.metadata || {}),
        blockOrigin: blockOrigins?.get(pair.id)?.id,
        structure: analysis.structure,
        parts: analysis.parts
      }
    };
    return item;
  });
}

/**
 * 同步版本的笔记模式格式化
 */
function formatForNotesSync(
  pairs: SentencePair[],
  blockOrigins?: Map<string, ContentBlock>
): ModeContentItem[] {
  return pairs.map((pair, index) => {
    const extendedPair = pair as ExtendedSentencePair;
    // 分析句子中的重要词汇和短语
    const keywords = extractKeywords(pair.english, 5);
    
    const item: ModeContentItem = {
      id: pair.id,
      type: 'note-content',
      content: {
        title: `笔记 #${index + 1}`,
        content: `${pair.english}\n${pair.chinese}`,
        sections: [
          {
            title: '关键词',
            content: keywords.map(k => k.word).join(', ')
          }
        ]
      } as NotesContent,
      metadata: {
        order: index,
        ...(extendedPair.metadata || {}),
        blockOrigin: blockOrigins?.get(pair.id)?.id,
        english: pair.english,
        chinese: pair.chinese,
        keywords,
        audioUrl: pair.audioUrl
      }
    };
    return item;
  });
}

/**
 * 生成听力模式的选项
 */
function generateOptions(word: string, wordPool: string[], count: number): string[] {
  // 实际应用中可能需要更智能的选项生成方法
  const options = [word]; 
  
  // 从词库添加选项或生成一些相似选项
  const filteredPool = wordPool.filter(w => w !== word && w.length > 2);
  
  while (options.length < count + 1 && filteredPool.length > 0) {
    const randomIndex = Math.floor(Math.random() * filteredPool.length);
    const randomWord = filteredPool[randomIndex];
    
    if (!options.includes(randomWord)) {
      options.push(randomWord);
    }
    
    filteredPool.splice(randomIndex, 1);
  }
  
  // 如果词库不够，添加一些随机字符
  while (options.length < count + 1) {
    const randomWord = word.split('').sort(() => 0.5 - Math.random()).join('');
    options.push(randomWord);
  }
  
  // 随机排序选项
  return options.sort(() => 0.5 - Math.random());
}

/**
 * 同步版本的语法分析
 */
function analyzeGrammarSync(sentence: string): {
  structure: string;
  parts: {type: string; text: string; explanation: string}[];
  explanation: string;
} {
  // 简单示例，实际应用需要更复杂的分析
  const cleanSentence = sentence.replace(/[.,!?;:]$/, '');
  const words = cleanSentence.split(/\s+/);
  
  const parts = words.map(word => {
    if (/^[A-Z]/.test(word) && words.indexOf(word) === 0) {
      return {
        type: 'subject',
        text: word,
        explanation: '主语'
      };
    } else if (/^(is|am|are|was|were|have|has|had|do|does|did)$/.test(word.toLowerCase())) {
      return {
        type: 'verb',
        text: word,
        explanation: '动词'
      };
    } else if (/^(in|on|at|by|with|from|to|for)$/.test(word.toLowerCase())) {
      return {
        type: 'preposition',
        text: word,
        explanation: '介词'
      };
    } else if (/^(a|an|the)$/.test(word.toLowerCase())) {
      return {
        type: 'article',
        text: word,
        explanation: '冠词'
      };
    } else {
      return {
        type: 'other',
        text: word,
        explanation: '其他'
      };
    }
  });
  
  return {
    structure: '主语 + 谓语 + 宾语',
    parts,
    explanation: '这是一个简单的句子结构，实际应用中需要更详细的分析。'
  };
}

/**
 * 提取句子中的关键词（带count参数的版本，用于生成上下文词汇）
 */
function extractKeywords(text: string, count?: number): {word: string; translation?: string}[] {
  // 简单示例，实际应用需要更复杂的算法
  const words = text.toLowerCase().split(/\s+/);
  const stopWords = ['the', 'a', 'an', 'and', 'is', 'are', 'in', 'on', 'at', 'to', 'for', 'with'];
  
  const filtered = words
    .filter(word => word.length > 3 && !stopWords.includes(word))
    .map(word => ({
      word: word.replace(/[.,!?;:]$/, ''),
      translation: undefined // 实际应用中可能需要翻译
    }));
  
  // 限制数量
  return filtered.slice(0, count || 3); // 默认返回3个关键词
}

/**
 * 生成上下文词汇
 */
function generateContextVocabulary(text: string, count: number): { word: string, definition: string }[] {
  // 简单实现，实际应用中会使用词典API
  const keywords = extractKeywords(text, count);
  
  return keywords.map(item => ({
    word: item.word,
    definition: `Definition for ${item.word}` // 实际应用中会查询真实定义
  }));
}

/**
 * 获取学习内容
 */
export async function getLearningContent(
  lessonId: string,
  mode: string,
  options: {
    userLevel?: 'beginner' | 'intermediate' | 'advanced',
    focusAreas?: string[],
    userPreferences?: UserPreferences,
    limit?: number,
    skipIds?: string[]
  } = {}
): Promise<{
  lessonId: string,
  mode: string,
  title: string,
  description: string,
  contentItems: ModeContentItem[],
  metadata: LearningContentMetadata
}> {
  // 设置默认选项
  const userLevel = options.userLevel || 'intermediate';
  
  try {
    // 获取课程内容
    const lesson = await fetchLessonContent(lessonId);
    
    // 根据学习模式获取适当的内容
    let contentItems = getLessonContentForMode(
      lesson.title,
      lesson.description,
      lessonId,
      lesson.contentBlocks,
      mode as LearningMode
    ).contentItems;
    
    // 根据用户级别过滤内容
    if (userLevel) {
      const filteredPairs = filterByDifficulty(
        extractSentencePairs(lesson.contentBlocks),
        userLevel
      );
      
      // 只保留匹配的句子对ID
      const filteredIds = new Set(filteredPairs.map(pair => pair.id));
      contentItems = contentItems.filter(item => filteredIds.has(item.id));
    }
    
    // 跳过指定的内容项
    if (options.skipIds && options.skipIds.length > 0) {
      const skipIdsSet = new Set(options.skipIds);
      contentItems = contentItems.filter(item => !skipIdsSet.has(item.id));
    }
    
    // 限制数量
    if (options.limit && options.limit > 0 && contentItems.length > options.limit) {
      contentItems = contentItems.slice(0, options.limit);
    }
    
    return {
      lessonId,
      mode,
      title: lesson.title,
      description: lesson.description,
      contentItems,
      metadata: {
        totalItems: contentItems.length,
        difficulty: userLevel,
        estimatedTimeMinutes: Math.ceil(contentItems.length * 0.5),
        tags: []
      }
    };
  } catch (error) {
    console.error('获取学习内容失败:', error);
    throw new Error(`无法获取学习内容: ${(error as Error).message}`);
  }
}

// 从数据库或API获取课程内容
async function fetchLessonContent(lessonId: string): Promise<LessonContent> {
  // 此处为模拟实现，实际应用中会从数据库或API获取
  // 创建一些示例数据，以便示范功能
  const mockSentencePairs: ExtendedSentencePair[] = [
    {
      id: 'sp1',
      english: 'Hello, how are you today?',
      chinese: '你好，今天怎么样？',
      audioUrl: '/audio/sentence1.mp3',
      metadata: { difficulty: 'easy' },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'sp2',
      english: 'I am learning English through this application.',
      chinese: '我正在通过这个应用学习英语。',
      audioUrl: '/audio/sentence2.mp3',
      metadata: { difficulty: 'medium' },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'sp3',
      english: 'The weather is quite pleasant for a walk in the park.',
      chinese: '天气很适合在公园散步。',
      audioUrl: '/audio/sentence3.mp3',
      metadata: { difficulty: 'medium' },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'sp4',
      english: 'Although I have studied for many years, I still struggle with advanced grammar concepts.',
      chinese: '虽然我已经学习了很多年，我仍然对高级语法概念感到困难。',
      audioUrl: '/audio/sentence4.mp3',
      metadata: { difficulty: 'hard' },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
  
  // 创建示例内容块
  const mockContentBlocks: ContentBlock[] = [
    {
      id: 'cb1',
      type: ContentBlockType.PARAGRAPH,
      content: {
        english: mockSentencePairs[0].english + ' ' + mockSentencePairs[1].english,
        chinese: mockSentencePairs[0].chinese + ' ' + mockSentencePairs[1].chinese
      },
      order: 1,
      lessonId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as unknown as ContentBlock,
    {
      id: 'cb2',
      type: ContentBlockType.PARAGRAPH,
      content: {
        english: mockSentencePairs[2].english + ' ' + mockSentencePairs[3].english,
        chinese: mockSentencePairs[2].chinese + ' ' + mockSentencePairs[3].chinese
      },
      order: 2,
      lessonId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as unknown as ContentBlock
  ];
  
  // 返回模拟的课程内容
  return {
    id: lessonId,
    title: '日常会话基础',
    description: '学习常见的日常英语会话和表达方式',
    contentBlocks: mockContentBlocks,
    sentencePairs: mockSentencePairs
  };
}

// 根据难度过滤句子对
function filterByDifficulty(
  pairs: SentencePair[],
  userLevel: 'beginner' | 'intermediate' | 'advanced'
): SentencePair[] {
  // 计算每个句子的难度
  const pairsWithDifficulty = pairs.map(pair => {
    const extendedPair = pair as ExtendedSentencePair;
    let difficulty: number;
    
    // 如果句子已有难度元数据，使用现有难度
    if (extendedPair.metadata?.difficulty) {
      difficulty = extendedPair.metadata.difficulty === 'easy' ? 1 :
                  extendedPair.metadata.difficulty === 'medium' ? 2 : 3;
    } else {
      // 否则根据句子长度、复杂性计算难度
      const englishWords = pair.english.split(/\s+/).length;
      const chineseLength = pair.chinese.length;
      
      // 计算英文句子复杂度指标
      const complexityMarkers = [
        /\b(if|unless|although|however|nevertheless|therefore|consequently)\b/i, // 复杂连接词
        /\b(would|could|should|might|may)\b/i, // 情态动词
        /\b(has been|have been|had been)\b/i, // 完成时
        /\b(while|when|as|since)\b.*,/i, // 从句
      ];
      
      let complexityScore = 0;
      complexityMarkers.forEach(marker => {
        if (marker.test(pair.english)) {
          complexityScore++;
        }
      });
      
      // 综合句子长度和复杂性确定难度
      difficulty = 1; // 默认初级
      
      if (englishWords > 15 || chineseLength > 30 || complexityScore >= 2) {
        difficulty = 3; // 高级
      } else if (englishWords > 8 || chineseLength > 20 || complexityScore >= 1) {
        difficulty = 2; // 中级
      }
    }
    
    return { ...pair, calculatedDifficulty: difficulty } as ExtendedSentencePair;
  });
  
  // 根据用户级别过滤
  let filteredPairs: ExtendedSentencePair[];
  
  switch (userLevel) {
    case 'beginner':
      // 初学者优先选择简单句子，允许部分中等难度句子
      filteredPairs = pairsWithDifficulty
        .filter(p => p.calculatedDifficulty && p.calculatedDifficulty <= 2)
        .sort((a, b) => (a.calculatedDifficulty || 0) - (b.calculatedDifficulty || 0))
        .map(p => ({ 
          ...p, 
          metadata: { 
            ...(p.metadata || {}), 
            aiAdjustedDifficulty: 'beginner' 
          } 
        }));
      break;
    case 'intermediate':
      // 中级学习者主要学习中等难度，允许部分简单和复杂句子
      filteredPairs = pairsWithDifficulty
        .filter(p => p.calculatedDifficulty && p.calculatedDifficulty >= 1 && p.calculatedDifficulty <= 3)
        .map(p => ({ 
          ...p, 
          metadata: { 
            ...(p.metadata || {}), 
            aiAdjustedDifficulty: 'intermediate' 
          } 
        }));
      break;
    case 'advanced':
      // 高级学习者优先学习复杂句子，适当保留中等难度句子
      filteredPairs = pairsWithDifficulty
        .filter(p => p.calculatedDifficulty && p.calculatedDifficulty >= 2)
        .sort((a, b) => (b.calculatedDifficulty || 0) - (a.calculatedDifficulty || 0))
        .map(p => ({ 
          ...p, 
          metadata: { 
            ...(p.metadata || {}), 
            aiAdjustedDifficulty: 'advanced' 
          } 
        }));
      break;
    default:
      filteredPairs = pairsWithDifficulty;
  }
  
  return filteredPairs;
}

/**
 * 创建句子对映射
 */
function createSentencePairMapping(contentBlocks: ContentBlock[]): Map<string, ContentBlock> {
  const blockOrigins = new Map<string, ContentBlock>();
  
  contentBlocks.forEach(block => {
    if (isParagraphBlock(block)) {
      // 为段落块创建一个合成的句子对ID
      const pairId = `pair-${block.id}`;
      blockOrigins.set(pairId, block);
    } else if (isDialogBlock(block)) {
      // 为对话中的每行创建一个句子对ID
      block.content.lines.forEach((line, index) => {
        const pairId = `dialog-${block.id}-line-${index}`;
        blockOrigins.set(pairId, block);
      });
    } else if (block.type === ContentBlockType.SENTENCES) {
      // 处理句子块
      const sentencesBlock = block as SentencesBlock;
      sentencesBlock.content.pairs.forEach(pair => {
        blockOrigins.set(pair.id, block);
      });
    }
  });
  
  return blockOrigins;
} 