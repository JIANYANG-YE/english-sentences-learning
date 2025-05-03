import { Sentence, Book, Category } from '../types';
import { newConcept1Sentences, newConcept1Book } from './newConcept1';
import { newConcept2Sentences, newConcept2Book } from './newConcept2';
import { newConcept3Sentences, newConcept3Book } from './newConcept3';
import { newConcept4Sentences, newConcept4Book } from './newConcept4';

// 合并所有新概念英语句子
export const newConceptSentences: Sentence[] = [
  ...newConcept1Sentences,
  ...newConcept2Sentences,
  ...newConcept3Sentences,
  ...newConcept4Sentences
];

// 所有新概念英语教材
export const newConceptBooks: Book[] = [
  newConcept1Book,
  newConcept2Book,
  newConcept3Book,
  newConcept4Book
];

// 根据新概念英语创建分类
export const newConceptCategories: Category[] = [
  {
    id: 'nc-beginner',
    name: '初级英语',
    description: '适合英语初学者的简单句子',
    sentenceIds: newConcept1Sentences.map(s => s.id)
  },
  {
    id: 'nc-elementary',
    name: '基础英语',
    description: '基础水平的英语句子，掌握日常交流',
    sentenceIds: newConcept2Sentences.map(s => s.id)
  },
  {
    id: 'nc-intermediate',
    name: '中级英语',
    description: '进阶水平的英语句子，提升表达能力',
    sentenceIds: newConcept3Sentences.map(s => s.id)
  },
  {
    id: 'nc-advanced',
    name: '高级英语',
    description: '高级水平的英语句子，接近母语表达',
    sentenceIds: newConcept4Sentences.map(s => s.id)
  },
  {
    id: 'nc-grammar-present',
    name: '现在时态',
    description: '现在时态相关的句子',
    sentenceIds: newConceptSentences
      .filter(s => s.tags.some(tag => tag.includes('present')))
      .map(s => s.id)
  },
  {
    id: 'nc-grammar-past',
    name: '过去时态',
    description: '过去时态相关的句子',
    sentenceIds: newConceptSentences
      .filter(s => s.tags.some(tag => tag.includes('past')))
      .map(s => s.id)
  },
  {
    id: 'nc-grammar-questions',
    name: '疑问句',
    description: '各种疑问句形式的句子',
    sentenceIds: newConceptSentences
      .filter(s => s.tags.some(tag => tag.includes('question')))
      .map(s => s.id)
  },
  {
    id: 'nc-daily-conversation',
    name: '日常对话',
    description: '日常生活中常用的对话句子',
    sentenceIds: newConceptSentences
      .filter(s => s.tags.some(tag => 
        tag.includes('greeting') || 
        tag.includes('politeness') || 
        tag.includes('daily') ||
        tag.includes('conversation')
      ))
      .map(s => s.id)
  }
]; 