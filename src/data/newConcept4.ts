import { Sentence, Book, Lesson } from '../types';

// 新概念英语第四册 - 句子数据
export const newConcept4Sentences: Sentence[] = [
  // Lesson 1: Finding fossil man
  {
    id: 'nc4-1-1',
    english: 'We can read of things that happened 5,000 years ago in the Near East, where people first learned to write.',
    chinese: '我们从书籍中可以了解到5000年前近东地区发生的事情，那里的人最早学会了写字。',
    difficulty: 'advanced',
    tags: ['present tense', 'history', 'ability'],
    source: {
      book: 'New Concept English 4',
      lesson: 1
    }
  },
  {
    id: 'nc4-1-2',
    english: 'But there are some parts of the world where even now people cannot write.',
    chinese: '但世界上有些地方，即使在今天，人们仍然不会书写。',
    difficulty: 'advanced',
    tags: ['present tense', 'contrast', 'ability'],
    source: {
      book: 'New Concept English 4',
      lesson: 1
    }
  },
  {
    id: 'nc4-1-3',
    english: 'The only way that they can preserve their history is to recount it as sagas -- legends handed down from one generation of storytellers to another.',
    chinese: '他们保存历史的唯一方法是以传说的形式讲述——由一代又一代的讲述人传承下来的传奇故事。',
    difficulty: 'advanced',
    tags: ['present tense', 'method', 'history', 'culture'],
    source: {
      book: 'New Concept English 4',
      lesson: 1
    }
  },
  {
    id: 'nc4-1-4',
    english: 'These legends are useful because they can tell us something about migrations of people who lived long ago, but none could write down what they did.',
    chinese: '这些传说是有用的，因为它们能告诉我们一些关于长期以前人类迁徙的事情，尽管那时候的人们不会记录下他们做过的事情。',
    difficulty: 'advanced',
    tags: ['present tense', 'function', 'history', 'ability'],
    source: {
      book: 'New Concept English 4',
      lesson: 1
    }
  },
  {
    id: 'nc4-1-5',
    english: 'Anthropologists wondered where the remote ancestors of the Polynesian peoples now living in the Pacific Islands came from.',
    chinese: '人类学家对如今生活在太平洋岛屿上的波利尼西亚人的远古祖先来自何方感到困惑。',
    difficulty: 'advanced',
    tags: ['past tense', 'question', 'origin', 'anthropology'],
    source: {
      book: 'New Concept English 4',
      lesson: 1
    }
  },
  {
    id: 'nc4-1-6',
    english: 'The sagas of these people explain that some of them came from Indonesia about 2,000 years ago.',
    chinese: '这些民族的传说表明，其中一部分是约2000年前从印度尼西亚迁来的。',
    difficulty: 'advanced',
    tags: ['present tense', 'explanation', 'history', 'migration'],
    source: {
      book: 'New Concept English 4',
      lesson: 1
    }
  },
  {
    id: 'nc4-1-7',
    english: 'But the first people who were like ourselves lived so long ago that even their sagas, if they had any, are forgotten.',
    chinese: '但是，与我们相似的人类生活在太久远的年代，以至于他们的传说，如果有的话，也已经被遗忘了。',
    difficulty: 'advanced',
    tags: ['past tense', 'condition', 'time', 'history'],
    source: {
      book: 'New Concept English 4',
      lesson: 1
    }
  },
  {
    id: 'nc4-1-8',
    english: 'So archaeologists have neither history nor legends to help them to find out where the first "modern men" came from.',
    chinese: '因此，考古学家们没有历史记载，也没有传说故事来帮助他们弄清最早的"现代人"是从哪里来的。',
    difficulty: 'advanced',
    tags: ['present tense', 'negation', 'purpose', 'archaeology'],
    source: {
      book: 'New Concept English 4',
      lesson: 1
    }
  },
  {
    id: 'nc4-1-9',
    english: 'Fortunately, however, ancient men made tools of stone, especially flint, because this is easier to shape than other kinds.',
    chinese: '然而，幸运的是，远古人类用石头制作工具，特别是用燧石，因为燧石比其他石头更容易成形。',
    difficulty: 'advanced',
    tags: ['past tense', 'reason', 'tools', 'archaeology'],
    source: {
      book: 'New Concept English 4',
      lesson: 1
    }
  },
  {
    id: 'nc4-1-10',
    english: 'They may also have used wood and skins, but these have rotted away.',
    chinese: '他们也可能用过木头和兽皮，但这些早已腐烂殆尽。',
    difficulty: 'advanced',
    tags: ['modal verb', 'past tense', 'possibility', 'archaeology'],
    source: {
      book: 'New Concept English 4',
      lesson: 1
    }
  }
];

// 新概念英语第四册 - 课程数据
export const newConcept4Lessons: Lesson[] = [
  {
    id: 'nc4-lesson-1',
    bookId: 'nc4',
    number: 1,
    title: 'Finding fossil man',
    description: '关于人类学家和考古学家如何研究古代人类的历史',
    sentenceIds: ['nc4-1-1', 'nc4-1-2', 'nc4-1-3', 'nc4-1-4', 'nc4-1-5', 'nc4-1-6', 'nc4-1-7', 'nc4-1-8', 'nc4-1-9', 'nc4-1-10']
  }
];

// 新概念英语第四册 - 教材数据
export const newConcept4Book: Book = {
  id: 'nc4',
  name: '新概念英语第四册',
  description: '高级水平的学习者，接近母语使用者的水平，掌握复杂表达和学术英语',
  level: 'advanced',
  lessons: newConcept4Lessons
}; 