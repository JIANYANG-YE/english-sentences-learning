import { Sentence, Category, Book, Lesson } from '../types';
import { sentences as originalSentences, categories as originalCategories } from './sampleData';
import { newConceptSentences, newConceptCategories, newConceptBooks } from './newConceptAll';

// 合并所有句子
export const sentences: Sentence[] = [
  ...originalSentences,
  ...newConceptSentences
];

// 合并所有分类
export const categories: Category[] = [
  ...originalCategories,
  ...newConceptCategories
];

// 所有教材
export const books: Book[] = [
  ...newConceptBooks
];

// 根据难度级别分类
export const beginnerSentences = sentences.filter(s => s.difficulty === 'beginner');
export const intermediateSentences = sentences.filter(s => s.difficulty === 'intermediate');
export const advancedSentences = sentences.filter(s => s.difficulty === 'advanced');

// 获取特定教材的所有句子
export const getSentencesByBook = (bookId: string): Sentence[] => {
  return sentences.filter(s => s.source?.book.includes(bookId));
};

// 获取特定课程的所有句子
export const getSentencesByLesson = (bookId: string, lessonNumber: number): Sentence[] => {
  return sentences.filter(
    s => s.source?.book.includes(bookId) && s.source.lesson === lessonNumber
  );
};

// 获取带有特定标签的所有句子
export const getSentencesByTag = (tag: string): Sentence[] => {
  return sentences.filter(s => s.tags.some(t => t.includes(tag)));
}; 