import { Sentence, Book, Lesson } from '../types';

// 新概念英语第一册 - 句子数据
export const newConcept1Sentences: Sentence[] = [
  // Lesson 1: Excuse me!
  {
    id: 'nc1-1-1',
    english: 'Excuse me!',
    chinese: '对不起！',
    difficulty: 'beginner',
    tags: ['greeting', 'politeness'],
    source: {
      book: 'New Concept English 1',
      lesson: 1
    }
  },
  {
    id: 'nc1-1-2',
    english: 'Yes?',
    chinese: '什么事？',
    difficulty: 'beginner',
    tags: ['response', 'question'],
    source: {
      book: 'New Concept English 1',
      lesson: 1
    }
  },
  {
    id: 'nc1-1-3',
    english: 'Is this your handbag?',
    chinese: '这是您的手提包吗？',
    difficulty: 'beginner',
    tags: ['question', 'possession', 'object'],
    source: {
      book: 'New Concept English 1',
      lesson: 1
    }
  },
  {
    id: 'nc1-1-4',
    english: 'Pardon?',
    chinese: '对不起，请再说一遍？',
    difficulty: 'beginner',
    tags: ['politeness', 'clarification'],
    source: {
      book: 'New Concept English 1',
      lesson: 1
    }
  },
  {
    id: 'nc1-1-5',
    english: 'Is this your handbag?',
    chinese: '这是您的手提包吗？',
    difficulty: 'beginner',
    tags: ['question', 'possession', 'object', 'repetition'],
    source: {
      book: 'New Concept English 1',
      lesson: 1
    }
  },
  {
    id: 'nc1-1-6',
    english: 'Yes, it is.',
    chinese: '是的，是我的。',
    difficulty: 'beginner',
    tags: ['answer', 'confirmation', 'possession'],
    source: {
      book: 'New Concept English 1',
      lesson: 1
    }
  },
  {
    id: 'nc1-1-7',
    english: 'Thank you very much.',
    chinese: '非常感谢。',
    difficulty: 'beginner',
    tags: ['gratitude', 'politeness'],
    source: {
      book: 'New Concept English 1',
      lesson: 1
    }
  },
  
  // Lesson 2: Is this your...?
  {
    id: 'nc1-2-1',
    english: 'Is this your pen?',
    chinese: '这是你的钢笔吗？',
    difficulty: 'beginner',
    tags: ['question', 'possession', 'object'],
    source: {
      book: 'New Concept English 1',
      lesson: 2
    }
  },
  {
    id: 'nc1-2-2',
    english: 'No, it isn\'t.',
    chinese: '不，不是。',
    difficulty: 'beginner',
    tags: ['negation', 'response'],
    source: {
      book: 'New Concept English 1',
      lesson: 2
    }
  },
  {
    id: 'nc1-2-3',
    english: 'Is this your pencil?',
    chinese: '这是你的铅笔吗？',
    difficulty: 'beginner',
    tags: ['question', 'possession', 'object'],
    source: {
      book: 'New Concept English 1',
      lesson: 2
    }
  },
  {
    id: 'nc1-2-4',
    english: 'No, it isn\'t.',
    chinese: '不，不是。',
    difficulty: 'beginner',
    tags: ['negation', 'response'],
    source: {
      book: 'New Concept English 1',
      lesson: 2
    }
  },
  {
    id: 'nc1-2-5',
    english: 'Is this your book?',
    chinese: '这是你的书吗？',
    difficulty: 'beginner',
    tags: ['question', 'possession', 'object'],
    source: {
      book: 'New Concept English 1',
      lesson: 2
    }
  },
  {
    id: 'nc1-2-6',
    english: 'No, it isn\'t.',
    chinese: '不，不是。',
    difficulty: 'beginner',
    tags: ['negation', 'response'],
    source: {
      book: 'New Concept English 1',
      lesson: 2
    }
  },
  {
    id: 'nc1-2-7',
    english: 'Is this your watch?',
    chinese: '这是你的手表吗？',
    difficulty: 'beginner',
    tags: ['question', 'possession', 'object'],
    source: {
      book: 'New Concept English 1',
      lesson: 2
    }
  },
  {
    id: 'nc1-2-8',
    english: 'Yes, it is.',
    chinese: '是的，是我的。',
    difficulty: 'beginner',
    tags: ['affirmation', 'response', 'possession'],
    source: {
      book: 'New Concept English 1',
      lesson: 2
    }
  },
  {
    id: 'nc1-2-9',
    english: 'Thank you very much.',
    chinese: '非常感谢。',
    difficulty: 'beginner',
    tags: ['gratitude', 'politeness'],
    source: {
      book: 'New Concept English 1',
      lesson: 2
    }
  },
  
  // Lesson 3: Sorry, sir.
  {
    id: 'nc1-3-1',
    english: 'My coat and my umbrella please.',
    chinese: '请把我的外套和雨伞给我。',
    difficulty: 'beginner',
    tags: ['request', 'objects', 'possessions'],
    source: {
      book: 'New Concept English 1',
      lesson: 3
    }
  },
  {
    id: 'nc1-3-2',
    english: 'Here is my ticket.',
    chinese: '这是我的票。',
    difficulty: 'beginner',
    tags: ['presentation', 'possession'],
    source: {
      book: 'New Concept English 1',
      lesson: 3
    }
  },
  {
    id: 'nc1-3-3',
    english: 'Thank you, sir.',
    chinese: '谢谢您，先生。',
    difficulty: 'beginner',
    tags: ['gratitude', 'politeness', 'formal'],
    source: {
      book: 'New Concept English 1',
      lesson: 3
    }
  },
  {
    id: 'nc1-3-4',
    english: 'Number five.',
    chinese: '5号。',
    difficulty: 'beginner',
    tags: ['number', 'identification'],
    source: {
      book: 'New Concept English 1',
      lesson: 3
    }
  },
  {
    id: 'nc1-3-5',
    english: 'Here\'s your umbrella and your coat.',
    chinese: '这是您的雨伞和外套。',
    difficulty: 'beginner',
    tags: ['presentation', 'possession', 'objects'],
    source: {
      book: 'New Concept English 1',
      lesson: 3
    }
  },
  {
    id: 'nc1-3-6',
    english: 'This is not my umbrella.',
    chinese: '这不是我的雨伞。',
    difficulty: 'beginner',
    tags: ['negation', 'possession', 'object'],
    source: {
      book: 'New Concept English 1',
      lesson: 3
    }
  },
  {
    id: 'nc1-3-7',
    english: 'Sorry, sir.',
    chinese: '对不起，先生。',
    difficulty: 'beginner',
    tags: ['apology', 'politeness', 'formal'],
    source: {
      book: 'New Concept English 1',
      lesson: 3
    }
  },
  {
    id: 'nc1-3-8',
    english: 'Is this your umbrella?',
    chinese: '这是您的雨伞吗？',
    difficulty: 'beginner',
    tags: ['question', 'possession', 'object'],
    source: {
      book: 'New Concept English 1',
      lesson: 3
    }
  },
  {
    id: 'nc1-3-9',
    english: 'No, it isn\'t.',
    chinese: '不，不是。',
    difficulty: 'beginner',
    tags: ['negation', 'response'],
    source: {
      book: 'New Concept English 1',
      lesson: 3
    }
  },
  {
    id: 'nc1-3-10',
    english: 'Is this it?',
    chinese: '这把是吗？',
    difficulty: 'beginner',
    tags: ['question', 'identification'],
    source: {
      book: 'New Concept English 1',
      lesson: 3
    }
  },
  {
    id: 'nc1-3-11',
    english: 'Yes, it is.',
    chinese: '是的，是这把。',
    difficulty: 'beginner',
    tags: ['affirmation', 'confirmation'],
    source: {
      book: 'New Concept English 1',
      lesson: 3
    }
  },
  {
    id: 'nc1-3-12',
    english: 'Thank you very much.',
    chinese: '非常感谢。',
    difficulty: 'beginner',
    tags: ['gratitude', 'politeness'],
    source: {
      book: 'New Concept English 1',
      lesson: 3
    }
  }
];

// 新概念英语第一册 - 课程数据
export const newConcept1Lessons: Lesson[] = [
  {
    id: 'nc1-lesson-1',
    bookId: 'nc1',
    number: 1,
    title: 'Excuse me!',
    description: '询问是否是对方的物品',
    sentenceIds: ['nc1-1-1', 'nc1-1-2', 'nc1-1-3', 'nc1-1-4', 'nc1-1-5', 'nc1-1-6', 'nc1-1-7']
  },
  {
    id: 'nc1-lesson-2',
    bookId: 'nc1',
    number: 2,
    title: 'Is this your...?',
    description: '询问不同物品的所有权',
    sentenceIds: ['nc1-2-1', 'nc1-2-2', 'nc1-2-3', 'nc1-2-4', 'nc1-2-5', 'nc1-2-6', 'nc1-2-7', 'nc1-2-8', 'nc1-2-9']
  },
  {
    id: 'nc1-lesson-3',
    bookId: 'nc1',
    number: 3,
    title: 'Sorry, sir.',
    description: '物品认领和礼貌用语',
    sentenceIds: ['nc1-3-1', 'nc1-3-2', 'nc1-3-3', 'nc1-3-4', 'nc1-3-5', 'nc1-3-6', 'nc1-3-7', 'nc1-3-8', 'nc1-3-9', 'nc1-3-10', 'nc1-3-11', 'nc1-3-12']
  }
];

// 新概念英语第一册 - 教材数据
export const newConcept1Book: Book = {
  id: 'nc1',
  name: '新概念英语第一册',
  description: '初学者入门教材，适合零基础学习者',
  level: 'beginner',
  lessons: newConcept1Lessons
}; 