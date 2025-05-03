import { Note, NoteType, NoteStats } from '@/types/notes';
import { get, post, put, del } from '@/lib/api';
import { SentencePair } from '@/types/courses/contentTypes';
import { calculateStringSimilarity } from '@/lib/utils';

/**
 * 笔记服务
 * 提供笔记的创建、检索、分析和智能生成功能
 */
class NoteService {
  /**
   * 获取用户在指定课时的所有笔记
   * @param lessonId 课时ID
   * @param userId 用户ID
   */
  async getLessonNotes(lessonId: string, userId: string): Promise<Note[]> {
    try {
      return await get<Note[]>(`/api/notes?lessonId=${lessonId}&userId=${userId}`);
    } catch (error) {
      console.error('获取笔记失败:', error);
      throw new Error(`获取笔记失败: ${(error as Error).message}`);
    }
  }

  /**
   * 创建新笔记
   * @param note 笔记数据
   */
  async createNote(note: Omit<Note, 'id'>): Promise<Note> {
    try {
      return await post<Note>('/api/notes', note);
    } catch (error) {
      console.error('创建笔记失败:', error);
      throw new Error(`创建笔记失败: ${(error as Error).message}`);
    }
  }

  /**
   * 更新笔记
   * @param id 笔记ID
   * @param note 更新的笔记数据
   */
  async updateNote(id: string, note: Partial<Note>): Promise<Note> {
    try {
      return await put<Note>(`/api/notes/${id}`, note);
    } catch (error) {
      console.error('更新笔记失败:', error);
      throw new Error(`更新笔记失败: ${(error as Error).message}`);
    }
  }

  /**
   * 删除笔记
   * @param id 笔记ID
   */
  async deleteNote(id: string): Promise<void> {
    try {
      await del(`/api/notes/${id}`);
    } catch (error) {
      console.error('删除笔记失败:', error);
      throw new Error(`删除笔记失败: ${(error as Error).message}`);
    }
  }

  /**
   * 获取笔记统计数据
   * @param userId 用户ID
   */
  async getNoteStats(userId: string): Promise<NoteStats> {
    try {
      return await get<NoteStats>(`/api/notes/stats?userId=${userId}`);
    } catch (error) {
      console.error('获取笔记统计失败:', error);
      throw new Error(`获取笔记统计失败: ${(error as Error).message}`);
    }
  }
  
  /**
   * 导出笔记
   * @param userId 用户ID
   * @param format 导出格式 ('markdown' | 'json')
   * @param lessonId 可选的课时ID筛选
   */
  async exportNotes(userId: string, format: 'markdown' | 'json', lessonId?: string): Promise<Blob> {
    try {
      const url = `/api/notes/export?userId=${userId}&format=${format}${lessonId ? `&lessonId=${lessonId}` : ''}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`导出失败: ${response.statusText}`);
      }
      
      return await response.blob();
    } catch (error) {
      console.error('导出笔记失败:', error);
      throw new Error(`导出笔记失败: ${(error as Error).message}`);
    }
  }

  /**
   * 智能生成笔记 - 自动分析课程内容并创建笔记
   * @param lessonId 课时ID
   * @param userId 用户ID
   * @param options 生成选项
   */
  async generateSmartNotes(
    lessonId: string, 
    userId: string, 
    options: {
      includeVocabulary?: boolean;
      includeGrammar?: boolean;
      includeKeyPhrases?: boolean;
      difficulty?: 'all' | 'easy' | 'medium' | 'hard';
      maxNotes?: number;
    } = {}
  ): Promise<Note[]> {
    try {
      // 1. 获取课时内容
      const lessonContent = await this.fetchLessonContent(lessonId);
      
      // 2. 获取现有笔记以避免重复
      const existingNotes = await this.getLessonNotes(lessonId, userId);
      
      // 3. 分析内容并生成笔记
      const generatedNotes: Omit<Note, 'id'>[] = [];
      
      // 处理各种类型的笔记
      if (options.includeVocabulary !== false) {
        const vocabularyNotes = await this.generateVocabularyNotes(lessonContent, userId, lessonId, existingNotes);
        generatedNotes.push(...vocabularyNotes);
      }
      
      if (options.includeGrammar !== false) {
        const grammarNotes = await this.generateGrammarNotes(lessonContent, userId, lessonId, existingNotes);
        generatedNotes.push(...grammarNotes);
      }
      
      if (options.includeKeyPhrases !== false) {
        const phraseNotes = await this.generatePhraseNotes(lessonContent, userId, lessonId, existingNotes);
        generatedNotes.push(...phraseNotes);
      }
      
      // 根据选项过滤笔记
      let filteredNotes = generatedNotes;
      
      // 按难度过滤
      if (options.difficulty && options.difficulty !== 'all') {
        filteredNotes = filteredNotes.filter(note => {
          // 检查难度或根据内容长度/复杂度估计难度
          return this.estimateNoteDifficulty(note) === options.difficulty;
        });
      }
      
      // 限制笔记数量
      if (options.maxNotes && options.maxNotes > 0) {
        filteredNotes = filteredNotes.slice(0, options.maxNotes);
      }
      
      // 4. 保存生成的笔记
      const savedNotes: Note[] = [];
      
      for (const noteData of filteredNotes) {
        const savedNote = await this.createNote(noteData);
        savedNotes.push(savedNote);
      }
      
      return savedNotes;
    } catch (error) {
      console.error('生成智能笔记失败:', error);
      throw new Error(`生成智能笔记失败: ${(error as Error).message}`);
    }
  }
  
  /**
   * 为相似内容推荐笔记
   * @param content 当前内容
   * @param userId 用户ID
   */
  async recommendRelatedNotes(content: string, userId: string): Promise<Note[]> {
    try {
      // 获取用户所有笔记
      const allNotes = await get<Note[]>(`/api/notes?userId=${userId}`);
      
      // 计算笔记与当前内容的相似度
      const notesWithSimilarity = allNotes.map(note => {
        // 计算笔记与内容的相似度
        const similarity = calculateStringSimilarity(
          note.highlight || note.note, 
          content
        );
        
        return { note, similarity };
      });
      
      // 按相似度排序并返回前5个
      return notesWithSimilarity
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, 5)
        .map(item => item.note);
    } catch (error) {
      console.error('获取相关笔记推荐失败:', error);
      throw new Error(`获取相关笔记推荐失败: ${(error as Error).message}`);
    }
  }
  
  /**
   * 基于学习进度和笔记历史的智能回顾
   * @param userId 用户ID
   * @param count 推荐数量
   */
  async getSmartReviewNotes(userId: string, count: number = 5): Promise<Note[]> {
    try {
      // 获取需要回顾的笔记
      return await get<Note[]>(`/api/notes/review?userId=${userId}&count=${count}`);
    } catch (error) {
      console.error('获取智能回顾笔记失败:', error);
      throw new Error(`获取智能回顾笔记失败: ${(error as Error).message}`);
    }
  }
  
  // 私有方法
  
  /**
   * 获取课时内容
   */
  private async fetchLessonContent(lessonId: string): Promise<any> {
    try {
      return await get<any>(`/api/lessons/${lessonId}/content`);
    } catch (error) {
      console.error('获取课时内容失败:', error);
      throw new Error(`获取课时内容失败: ${(error as Error).message}`);
    }
  }
  
  /**
   * 生成词汇笔记
   */
  private async generateVocabularyNotes(
    lessonContent: any, 
    userId: string, 
    lessonId: string,
    existingNotes: Note[]
  ): Promise<Omit<Note, 'id'>[]> {
    const vocabularyNotes: Omit<Note, 'id'>[] = [];
    
    // 分析句子，找出重要词汇
    const sentencePairs = this.extractSentencePairs(lessonContent);
    const importantWords = await this.identifyImportantWords(sentencePairs);
    
    // 为每个重要词汇创建笔记
    for (const word of importantWords) {
      // 检查是否已有相同的笔记
      const isDuplicate = existingNotes.some(note => 
        note.type === 'vocabulary' && 
        note.highlight === word.word
      );
      
      if (!isDuplicate) {
        // 找到包含该词的句子作为上下文
        const contextSentence = sentencePairs.find(pair => 
          pair.english.includes(word.word)
        );
        
        // 创建笔记
        const paragraphIndex = this.findParagraphIndex(lessonContent, contextSentence);
        
        vocabularyNotes.push({
          lessonId,
          userId,
          timestamp: new Date().toISOString(),
          highlight: word.word,
          note: word.definition || '重要词汇',
          type: 'vocabulary',
          paragraphIndex: paragraphIndex >= 0 ? paragraphIndex : 0
        });
      }
    }
    
    return vocabularyNotes;
  }
  
  /**
   * 生成语法笔记
   */
  private async generateGrammarNotes(
    lessonContent: any, 
    userId: string, 
    lessonId: string,
    existingNotes: Note[]
  ): Promise<Omit<Note, 'id'>[]> {
    const grammarNotes: Omit<Note, 'id'>[] = [];
    
    // 分析句子，找出语法特点
    const sentencePairs = this.extractSentencePairs(lessonContent);
    const grammarPoints = await this.identifyGrammarPoints(sentencePairs);
    
    // 为每个语法点创建笔记
    for (const point of grammarPoints) {
      // 检查是否已有相同的笔记
      const isDuplicate = existingNotes.some(note => 
        note.type === 'insight' && 
        note.note.includes(point.description)
      );
      
      if (!isDuplicate) {
        // 找到展示该语法点的句子作为上下文
        const contextSentence = sentencePairs.find(pair => 
          point.exampleSentences.includes(pair.english)
        );
        
        // 创建笔记
        const paragraphIndex = this.findParagraphIndex(lessonContent, contextSentence);
        
        grammarNotes.push({
          lessonId,
          userId,
          timestamp: new Date().toISOString(),
          highlight: contextSentence ? contextSentence.english : point.exampleSentences[0],
          note: `${point.name}: ${point.description}`,
          type: 'insight',
          paragraphIndex: paragraphIndex >= 0 ? paragraphIndex : 0
        });
      }
    }
    
    return grammarNotes;
  }
  
  /**
   * 生成短语笔记
   */
  private async generatePhraseNotes(
    lessonContent: any, 
    userId: string, 
    lessonId: string,
    existingNotes: Note[]
  ): Promise<Omit<Note, 'id'>[]> {
    const phraseNotes: Omit<Note, 'id'>[] = [];
    
    // 分析句子，找出重要短语
    const sentencePairs = this.extractSentencePairs(lessonContent);
    const keyPhrases = await this.identifyKeyPhrases(sentencePairs);
    
    // 为每个重要短语创建笔记
    for (const phrase of keyPhrases) {
      // 检查是否已有相同的笔记
      const isDuplicate = existingNotes.some(note => 
        note.highlight === phrase.phrase
      );
      
      if (!isDuplicate) {
        // 找到包含该短语的句子作为上下文
        const contextSentence = sentencePairs.find(pair => 
          pair.english.includes(phrase.phrase)
        );
        
        // 创建笔记
        const paragraphIndex = this.findParagraphIndex(lessonContent, contextSentence);
        
        phraseNotes.push({
          lessonId,
          userId,
          timestamp: new Date().toISOString(),
          highlight: phrase.phrase,
          note: phrase.meaning,
          type: 'important',
          paragraphIndex: paragraphIndex >= 0 ? paragraphIndex : 0
        });
      }
    }
    
    return phraseNotes;
  }
  
  /**
   * 从课时内容中提取句子对
   */
  private extractSentencePairs(lessonContent: any): SentencePair[] {
    const sentencePairs: SentencePair[] = [];
    
    // 遍历内容块
    if (lessonContent.contentBlocks) {
      for (const block of lessonContent.contentBlocks) {
        // 检查是否为句子块
        if (block.type === 'sentences' && block.content && block.content.pairs) {
          sentencePairs.push(...block.content.pairs);
        }
      }
    }
    
    return sentencePairs;
  }
  
  /**
   * 查找句子所在的段落索引
   */
  private findParagraphIndex(lessonContent: any, sentence?: SentencePair): number {
    if (!sentence) return 0;
    
    // 遍历内容块
    if (lessonContent.contentBlocks) {
      for (let i = 0; i < lessonContent.contentBlocks.length; i++) {
        const block = lessonContent.contentBlocks[i];
        
        // 检查是否为句子块
        if (block.type === 'sentences' && block.content && block.content.pairs) {
          // 查找句子在该块中的索引
          const pairIndex = block.content.pairs.findIndex((pair: SentencePair) => 
            pair.id === sentence.id
          );
          
          if (pairIndex >= 0) {
            return i;
          }
        }
      }
    }
    
    return 0;
  }
  
  /**
   * 识别重要词汇
   */
  private async identifyImportantWords(sentencePairs: SentencePair[]): Promise<{ word: string; definition?: string }[]> {
    try {
      // 在实际应用中，这里应该调用NLP API或词汇分析服务
      // 现在使用模拟数据
      const words: { word: string; definition?: string }[] = [];
      
      // 简单地从句子中提取一些单词
      for (const pair of sentencePairs) {
        const englishWords = pair.english
          .toLowerCase()
          .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
          .split(' ')
          .filter(word => word.length > 4); // 只提取较长的单词
        
        // 取前几个单词
        for (let i = 0; i < Math.min(englishWords.length, 2); i++) {
          const word = englishWords[i];
          
          // 检查是否已添加
          if (!words.some(w => w.word === word)) {
            words.push({
              word,
              definition: `${word} 的定义`
            });
          }
          
          // 最多添加10个单词
          if (words.length >= 10) break;
        }
        
        if (words.length >= 10) break;
      }
      
      return words;
    } catch (error) {
      console.error('识别重要词汇失败:', error);
      return [];
    }
  }
  
  /**
   * 识别语法点
   */
  private async identifyGrammarPoints(sentencePairs: SentencePair[]): Promise<{
    name: string;
    description: string;
    exampleSentences: string[];
  }[]> {
    try {
      // 在实际应用中，这里应该调用NLP API或语法分析服务
      // 现在使用模拟数据
      // 模拟一些常见语法点
      const grammarPoints = [
        {
          name: '现在完成时',
          description: '用于表示过去发生且与现在有联系的动作或状态',
          exampleSentences: []
        },
        {
          name: '被动语态',
          description: '当动作的承受者是句子的主语时使用',
          exampleSentences: []
        },
        {
          name: '条件句',
          description: '用于表达假设情况及其结果',
          exampleSentences: []
        }
      ];
      
      // 简单匹配包含相关时态标记的句子
      for (const pair of sentencePairs) {
        const englishLower = pair.english.toLowerCase();
        
        // 检查现在完成时
        if (englishLower.includes('have ') || englishLower.includes('has ')) {
          grammarPoints[0].exampleSentences.push(pair.english);
        }
        
        // 检查被动语态
        if (englishLower.includes(' is ') && englishLower.includes(' by ') || 
            englishLower.includes(' are ') && englishLower.includes(' by ') ||
            englishLower.includes(' was ') && englishLower.includes(' by ') ||
            englishLower.includes(' were ') && englishLower.includes(' by ')) {
          grammarPoints[1].exampleSentences.push(pair.english);
        }
        
        // 检查条件句
        if (englishLower.includes('if ') || englishLower.includes(' would ')) {
          grammarPoints[2].exampleSentences.push(pair.english);
        }
      }
      
      // 只返回找到例句的语法点
      return grammarPoints.filter(point => point.exampleSentences.length > 0);
    } catch (error) {
      console.error('识别语法点失败:', error);
      return [];
    }
  }
  
  /**
   * 识别关键短语
   */
  private async identifyKeyPhrases(sentencePairs: SentencePair[]): Promise<{
    phrase: string;
    meaning: string;
  }[]> {
    try {
      // 在实际应用中，这里应该调用NLP API或短语分析服务
      // 现在使用模拟数据
      const phrases: { phrase: string; meaning: string }[] = [];
      
      // 简单匹配一些常见短语模式
      const phrasePatterns = [
        { pattern: /([a-z]+) (on|in|at|with|for|to) ([a-z]+)/g, type: '介词短语' },
        { pattern: /(make|take|do|have|give) ([a-z]+)/g, type: '动词短语' },
        { pattern: /(a lot of|plenty of|a number of)/g, type: '数量短语' }
      ];
      
      for (const pair of sentencePairs) {
        const englishLower = pair.english.toLowerCase();
        
        // 匹配不同类型的短语
        for (const { pattern, type } of phrasePatterns) {
          let match;
          pattern.lastIndex = 0; // 重置正则表达式
          
          while ((match = pattern.exec(englishLower)) !== null) {
            const phrase = match[0];
            
            // 检查是否已添加
            if (!phrases.some(p => p.phrase === phrase)) {
              phrases.push({
                phrase,
                meaning: `${type}: ${phrase} 的含义`
              });
            }
            
            // 最多添加10个短语
            if (phrases.length >= 10) break;
          }
          
          if (phrases.length >= 10) break;
        }
        
        if (phrases.length >= 10) break;
      }
      
      return phrases;
    } catch (error) {
      console.error('识别关键短语失败:', error);
      return [];
    }
  }
  
  /**
   * 估计笔记难度
   */
  private estimateNoteDifficulty(note: Omit<Note, 'id'>): 'easy' | 'medium' | 'hard' {
    // 基于内容长度和复杂度估计难度
    const content = note.highlight || note.note;
    
    if (!content) return 'easy';
    
    // 简单的难度估计逻辑
    if (content.length < 20) return 'easy';
    if (content.length > 50) return 'hard';
    
    // 检查是否包含复杂词汇或短语
    const complexWords = ['consequently', 'nevertheless', 'furthermore', 'accordingly'];
    if (complexWords.some(word => content.toLowerCase().includes(word))) {
      return 'hard';
    }
    
    return 'medium';
  }
}

// 导出服务实例
export const noteService = new NoteService();
export default noteService; 