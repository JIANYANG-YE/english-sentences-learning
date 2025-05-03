import { Sentence, Category } from '../types';

export const sentences: Sentence[] = [
  {
    id: '1',
    english: 'The weather is beautiful today.',
    chinese: '今天天气很好。',
    difficulty: 'beginner',
    tags: ['weather', 'daily conversation'],
    notes: 'Common expression for small talk.'
  },
  {
    id: '2',
    english: 'Could you please tell me how to get to the nearest subway station?',
    chinese: '请问最近的地铁站怎么走？',
    difficulty: 'beginner',
    tags: ['directions', 'travel', 'questions']
  },
  {
    id: '3',
    english: "I've been learning English for about three years now.",
    chinese: '我学习英语已经三年了。',
    difficulty: 'intermediate',
    tags: ['learning', 'time expressions', 'present perfect']
  },
  {
    id: '4',
    english: 'Although he had prepared thoroughly, he was still nervous about the presentation.',
    chinese: '尽管他已经做了充分的准备，但他对演讲仍然感到紧张。',
    difficulty: 'advanced',
    tags: ['business', 'emotions', 'conjunctions']
  },
  {
    id: '5',
    english: 'If I had known about the traffic, I would have left earlier.',
    chinese: '如果我知道有交通堵塞，我就会早点出发。',
    difficulty: 'advanced',
    tags: ['conditionals', 'past perfect', 'time expressions']
  },
  {
    id: '6',
    english: 'What time does the movie start?',
    chinese: '电影什么时候开始？',
    difficulty: 'beginner',
    tags: ['questions', 'entertainment', 'time expressions']
  },
  {
    id: '7',
    english: "I'm really looking forward to seeing you next week.",
    chinese: '我真的很期待下周见到你。',
    difficulty: 'intermediate',
    tags: ['future expressions', 'emotions', 'social']
  },
  {
    id: '8',
    english: 'Would you mind if I opened the window?',
    chinese: '你介意我打开窗户吗？',
    difficulty: 'intermediate',
    tags: ['requests', 'politeness', 'modals']
  }
];

export const categories: Category[] = [
  {
    id: '1',
    name: '日常对话',
    description: '学习日常生活中常用的英语表达',
    sentenceIds: ['1', '2', '6']
  },
  {
    id: '2',
    name: '商务英语',
    description: '职场和商业环境中使用的英语表达',
    sentenceIds: ['4']
  },
  {
    id: '3',
    name: '语法进阶',
    description: '学习更复杂的英语语法结构',
    sentenceIds: ['3', '5', '8']
  },
  {
    id: '4',
    name: '社交英语',
    description: '在社交场合中使用的英语表达',
    sentenceIds: ['7']
  }
]; 