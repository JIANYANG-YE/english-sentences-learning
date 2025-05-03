/**
 * modeAdapters.ts 单元测试
 */
import { 
  extractSentencePairs, 
  getLessonContentForMode
} from '../modeAdapters';
import { ContentBlock, ContentBlockType } from '@/types/courses/contentTypes';
import { LearningMode } from '@/types/learning';

describe('modeAdapters', () => {
  // 模拟内容块
  const mockContentBlocks: ContentBlock[] = [
    {
      id: 'heading1',
      type: ContentBlockType.HEADING,
      order: 1,
      content: {
        text: '测试标题',
        level: 2
      }
    },
    {
      id: 'para1',
      type: ContentBlockType.PARAGRAPH,
      order: 2,
      content: {
        english: 'This is a test paragraph.',
        chinese: '这是一个测试段落。'
      }
    },
    {
      id: 'dialog1',
      type: ContentBlockType.DIALOG,
      order: 3,
      content: {
        speakers: [
          { id: 'speaker1', name: 'Alice' },
          { id: 'speaker2', name: 'Bob' }
        ],
        lines: [
          {
            speakerId: 'speaker1',
            english: 'How are you today?',
            chinese: '你今天好吗？'
          },
          {
            speakerId: 'speaker2',
            english: 'I am fine, thank you!',
            chinese: '我很好，谢谢！'
          }
        ]
      }
    }
  ];

  describe('extractSentencePairs', () => {
    it('应该从内容块中提取句子对', () => {
      const pairs = extractSentencePairs(mockContentBlocks);
      
      expect(pairs).toHaveLength(3); // 1个段落 + 2行对话
      
      // 验证段落的句子对
      expect(pairs[0]).toEqual({
        id: 'pair-para1',
        english: 'This is a test paragraph.',
        chinese: '这是一个测试段落。'
      });
      
      // 验证对话的句子对
      expect(pairs[1].english).toBe('How are you today?');
      expect(pairs[2].english).toBe('I am fine, thank you!');
    });
  });

  describe('getLessonContentForMode', () => {
    const lessonId = 'lesson1';
    const lessonTitle = '测试课程';
    const lessonDescription = '这是一个测试课程描述';
    
    it('应该为中译英模式格式化内容', () => {
      const result = getLessonContentForMode(
        lessonTitle,
        lessonDescription,
        lessonId,
        mockContentBlocks,
        'chinese-to-english' as LearningMode
      );
      
      expect(result).toEqual({
        lessonId,
        mode: 'chinese-to-english',
        title: lessonTitle,
        description: lessonDescription,
        contentItems: expect.arrayContaining([
          expect.objectContaining({
            type: 'translation-pair',
            content: expect.objectContaining({
              prompt: '这是一个测试段落。',
              answer: 'This is a test paragraph.'
            })
          })
        ])
      });
      
      expect(result.contentItems).toHaveLength(3);
    });
    
    it('应该为英译中模式格式化内容', () => {
      const result = getLessonContentForMode(
        lessonTitle,
        lessonDescription,
        lessonId,
        mockContentBlocks,
        'english-to-chinese' as LearningMode
      );
      
      expect(result.mode).toBe('english-to-chinese');
      expect(result.contentItems[0].content).toHaveProperty('prompt', 'This is a test paragraph.');
      expect(result.contentItems[0].content).toHaveProperty('answer', '这是一个测试段落。');
    });
    
    it('应该为听力模式格式化内容', () => {
      const result = getLessonContentForMode(
        lessonTitle,
        lessonDescription,
        lessonId,
        mockContentBlocks,
        'listening' as LearningMode
      );
      
      expect(result.mode).toBe('listening');
      expect(result.contentItems[0].content).toHaveProperty('transcript');
      expect(result.contentItems[0].content).toHaveProperty('translation');
      expect(result.contentItems[0].type).toBe('listening-exercise');
    });
    
    it('应该为语法模式格式化内容', () => {
      const result = getLessonContentForMode(
        lessonTitle,
        lessonDescription,
        lessonId,
        mockContentBlocks,
        'grammar' as LearningMode
      );
      
      expect(result.mode).toBe('grammar');
      expect(result.contentItems[0].content).toHaveProperty('explanation');
      expect(result.contentItems[0].content).toHaveProperty('sentence');
      expect(result.contentItems[0].content).toHaveProperty('grammarPoint');
    });
    
    it('应该为笔记模式格式化内容', () => {
      const result = getLessonContentForMode(
        lessonTitle,
        lessonDescription,
        lessonId,
        mockContentBlocks,
        'notes' as LearningMode
      );
      
      expect(result.mode).toBe('notes');
      expect(result.contentItems[0].content).toHaveProperty('title');
      expect(result.contentItems[0].content).toHaveProperty('content');
      expect(result.contentItems[0].content).toHaveProperty('sections');
    });
  });
}); 