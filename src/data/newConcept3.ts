import { Sentence, Book, Lesson } from '../types';

// 新概念英语第三册 - 句子数据
export const newConcept3Sentences: Sentence[] = [
  // Lesson 1: A puma at large
  {
    id: 'nc3-1-1',
    english: 'Pumas are large, cat-like animals which are found in America.',
    chinese: '美洲狮是一种体形似猫的大动物，产于美洲。',
    difficulty: 'advanced',
    tags: ['present tense', 'description', 'animals', 'location'],
    source: {
      book: 'New Concept English 3',
      lesson: 1
    }
  },
  {
    id: 'nc3-1-2',
    english: 'When reports came into London Zoo that a wild puma had been spotted forty-five miles south of London, they were not taken seriously.',
    chinese: '当伦敦动物园接到报告说，在伦敦以南45英里处发现一只野美洲狮时，这些报告并没有受到重视。',
    difficulty: 'advanced',
    tags: ['past tense', 'passive voice', 'reported speech'],
    source: {
      book: 'New Concept English 3',
      lesson: 1
    }
  },
  {
    id: 'nc3-1-3',
    english: 'However, as the evidence began to accumulate, experts from the Zoo felt obliged to investigate, for the descriptions given by people who claimed to have seen the puma were extraordinarily similar.',
    chinese: '然而，随着证据的不断积累，动物园的专家们感到有必要进行一番调查，因为凡是声称见到过美洲狮的人们所描述的情况竟是出奇地相似。',
    difficulty: 'advanced',
    tags: ['past tense', 'causality', 'description'],
    source: {
      book: 'New Concept English 3',
      lesson: 1
    }
  },
  {
    id: 'nc3-1-4',
    english: 'The hunt for the puma began in a small village where a woman picking blackberries saw \'a large cat\' only five yards away from her.',
    chinese: '对美洲狮的搜寻工作是从一个小村庄开始的。那里的一位妇女在采摘黑莓时，发现在离她只有5码远的地方有一只"大猫"。',
    difficulty: 'advanced',
    tags: ['past tense', 'location', 'distance'],
    source: {
      book: 'New Concept English 3',
      lesson: 1
    }
  },
  {
    id: 'nc3-1-5',
    english: 'It immediately ran away when she saw it, and experts confirmed that a puma will not attack a human being unless it is cornered.',
    chinese: '她刚看到它，它就立刻逃走了。专家证实，美洲狮如果不是被逼得走投无路，是决不会伤人的。',
    difficulty: 'advanced',
    tags: ['past tense', 'conditional', 'animal behavior'],
    source: {
      book: 'New Concept English 3',
      lesson: 1
    }
  },
  {
    id: 'nc3-1-6',
    english: 'The search proved difficult, for the puma was often observed at one place in the morning and at another place twenty miles away in the evening.',
    chinese: '事实证明这种搜寻工作是困难的，因为常常是早晨人们在一个地方发现那只美洲狮，晚上却又有人在20英里外的另一个地方发现它。',
    difficulty: 'advanced',
    tags: ['past tense', 'passive voice', 'distance', 'time'],
    source: {
      book: 'New Concept English 3',
      lesson: 1
    }
  },
  {
    id: 'nc3-1-7',
    english: 'Wherever it went, it left behind it a trail of dead deer and small animals like rabbits.',
    chinese: '无论它走哪儿，都会留下一串死鹿和死兔子之类的小动物的尸体。',
    difficulty: 'advanced',
    tags: ['past tense', 'cause and effect', 'animals'],
    source: {
      book: 'New Concept English 3',
      lesson: 1
    }
  },
  {
    id: 'nc3-1-8',
    english: 'Paw prints were seen in a number of places and puma fur was found clinging to bushes.',
    chinese: '在许多地方都发现了爪印，在灌木丛中发现了粘在上面的美洲狮毛。',
    difficulty: 'advanced',
    tags: ['past tense', 'passive voice', 'evidence'],
    source: {
      book: 'New Concept English 3',
      lesson: 1
    }
  },
  {
    id: 'nc3-1-9',
    english: 'Several people complained of \'cat-like noises\' at night and a businessman on a fishing trip saw the puma up a tree.',
    chinese: '有几个人抱怨说夜里听见"像猫一样的叫声"；一位去钓鱼的商人看见那只美洲狮在树上。',
    difficulty: 'advanced',
    tags: ['past tense', 'complaints', 'observation'],
    source: {
      book: 'New Concept English 3',
      lesson: 1
    }
  },
  {
    id: 'nc3-1-10',
    english: 'The experts were now fully convinced that the animal was a puma, but where had it come from?',
    chinese: '专家们现在完全相信那只动物确实是美洲狮，但它是从哪儿来的呢？',
    difficulty: 'advanced',
    tags: ['past tense', 'passive voice', 'question'],
    source: {
      book: 'New Concept English 3',
      lesson: 1
    }
  }
];

// 新概念英语第三册 - 课程数据
export const newConcept3Lessons: Lesson[] = [
  {
    id: 'nc3-lesson-1',
    bookId: 'nc3',
    number: 1,
    title: 'A puma at large',
    description: '关于一只在伦敦郊外出没的美洲狮的故事',
    sentenceIds: ['nc3-1-1', 'nc3-1-2', 'nc3-1-3', 'nc3-1-4', 'nc3-1-5', 'nc3-1-6', 'nc3-1-7', 'nc3-1-8', 'nc3-1-9', 'nc3-1-10']
  }
];

// 新概念英语第三册 - 教材数据
export const newConcept3Book: Book = {
  id: 'nc3',
  name: '新概念英语第三册',
  description: '中级到高级水平的学习者，提升语言表达能力和语法掌握',
  level: 'intermediate',
  lessons: newConcept3Lessons
}; 