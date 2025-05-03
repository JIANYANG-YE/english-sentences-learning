/**
 * utils.ts 单元测试
 */
import { 
  formatDate, 
  debounce, 
  throttle, 
  deepClone,
  generateId,
  truncateString,
  calculateStringSimilarity
} from '../utils';

describe('formatDate', () => {
  test('应该正确格式化日期', () => {
    const date = new Date(2023, 0, 15, 10, 30, 45); // 2023-01-15 10:30:45
    expect(formatDate(date, 'YYYY-MM-DD')).toBe('2023-01-15');
    expect(formatDate(date, 'MM/DD/YYYY')).toBe('01/15/2023');
    expect(formatDate(date, 'YYYY-MM-DD HH:mm:ss')).toBe('2023-01-15 10:30:45');
  });

  test('应该处理字符串日期', () => {
    expect(formatDate('2023-01-15T10:30:45', 'YYYY-MM-DD')).toBe('2023-01-15');
  });

  test('应该使用默认格式', () => {
    const date = new Date(2023, 0, 15);
    expect(formatDate(date)).toBe('2023-01-15');
  });
});

describe('deepClone', () => {
  test('应该深度复制原始类型', () => {
    expect(deepClone(42)).toBe(42);
    expect(deepClone('hello')).toBe('hello');
    expect(deepClone(true)).toBe(true);
    expect(deepClone(null)).toBe(null);
    expect(deepClone(undefined)).toBe(undefined);
  });

  test('应该深度复制数组', () => {
    const original = [1, 2, [3, 4]];
    const cloned = deepClone(original);
    
    expect(cloned).toEqual(original);
    expect(cloned).not.toBe(original);
    expect(cloned[2]).not.toBe(original[2]);
  });

  test('应该深度复制对象', () => {
    const original = { 
      a: 1, 
      b: { c: 2 }, 
      d: [1, 2, 3] 
    };
    const cloned = deepClone(original);
    
    expect(cloned).toEqual(original);
    expect(cloned).not.toBe(original);
    expect(cloned.b).not.toBe(original.b);
    expect(cloned.d).not.toBe(original.d);
  });

  test('应该复制日期对象', () => {
    const original = new Date('2023-01-15');
    const cloned = deepClone(original);
    
    expect(cloned).toEqual(original);
    expect(cloned).not.toBe(original);
    expect(cloned.getTime()).toBe(original.getTime());
  });
});

describe('truncateString', () => {
  test('应该在超过最大长度时截断字符串', () => {
    expect(truncateString('Hello, world!', 5)).toBe('Hello...');
  });

  test('当长度小于等于最大长度时不应截断', () => {
    expect(truncateString('Hello', 5)).toBe('Hello');
    expect(truncateString('Hello', 10)).toBe('Hello');
  });
});

describe('calculateStringSimilarity', () => {
  test('完全相同的字符串相似度为1', () => {
    expect(calculateStringSimilarity('hello', 'hello')).toBe(1.0);
  });

  test('完全不同的字符串相似度接近0', () => {
    expect(calculateStringSimilarity('hello', 'xyz')).toBeLessThan(0.2);
  });

  test('部分相似的字符串有中等相似度', () => {
    const similarity = calculateStringSimilarity('hello world', 'hello there');
    expect(similarity).toBeGreaterThan(0.3);
    expect(similarity).toBeLessThan(0.8);
  });

  test('空字符串与任何字符串的相似度为0', () => {
    expect(calculateStringSimilarity('', 'hello')).toBe(0.0);
    expect(calculateStringSimilarity('hello', '')).toBe(0.0);
  });
});

describe('generateId', () => {
  test('应该生成非空字符串', () => {
    const id = generateId();
    expect(typeof id).toBe('string');
    expect(id.length).toBeGreaterThan(0);
  });

  test('应该生成唯一ID', () => {
    const ids = new Set();
    for (let i = 0; i < 100; i++) {
      ids.add(generateId());
    }
    expect(ids.size).toBe(100);
  });
});

// 测试异步函数
describe('debounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('应该在等待时间后调用函数', () => {
    const func = jest.fn();
    const debouncedFunc = debounce(func, 1000);

    debouncedFunc();
    expect(func).not.toBeCalled();

    jest.advanceTimersByTime(999);
    expect(func).not.toBeCalled();

    jest.advanceTimersByTime(1);
    expect(func).toBeCalledTimes(1);
  });

  test('应该只调用最后一次函数调用', () => {
    const func = jest.fn();
    const debouncedFunc = debounce(func, 1000);

    debouncedFunc('first');
    debouncedFunc('second');
    debouncedFunc('third');

    jest.advanceTimersByTime(1000);

    expect(func).toBeCalledTimes(1);
    expect(func).toBeCalledWith('third');
  });
});

describe('throttle', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('应该立即调用函数', () => {
    const func = jest.fn();
    const throttledFunc = throttle(func, 1000);

    throttledFunc();
    expect(func).toBeCalledTimes(1);
  });

  test('应该在等待时间内忽略额外的调用', () => {
    const func = jest.fn();
    const throttledFunc = throttle(func, 1000);

    throttledFunc();
    throttledFunc();
    throttledFunc();

    expect(func).toBeCalledTimes(1);
  });

  test('应该在等待时间后允许新的调用', () => {
    const func = jest.fn();
    const throttledFunc = throttle(func, 1000);

    throttledFunc();
    expect(func).toBeCalledTimes(1);

    jest.advanceTimersByTime(1000);

    throttledFunc();
    expect(func).toBeCalledTimes(2);
  });
}); 