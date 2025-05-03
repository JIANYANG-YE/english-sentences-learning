// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// 添加自定义匹配器
if (typeof expect !== 'undefined') {
  expect.extend({
    toBeInTheDocument(received) {
      const pass = received !== null;
      return {
        pass,
        message: () => pass
          ? `元素存在于文档中，但预期不存在`
          : `元素不存在于文档中，但预期存在`,
      };
    },
    toHaveClass(received, expectedClass) {
      const classList = received.className ? received.className.split(' ') : [];
      const pass = classList.includes(expectedClass);
      return {
        pass,
        message: () => pass
          ? `元素包含类 "${expectedClass}"，但预期不包含`
          : `元素不包含类 "${expectedClass}"，但预期包含`,
      };
    },
  });
}

// 解决Window.matchMedia问题
if (typeof window !== 'undefined') {
  window.matchMedia = window.matchMedia || function() {
    return {
      matches: false,
      addListener: function() {},
      removeListener: function() {},
      addEventListener: function() {},
      removeEventListener: function() {},
      dispatchEvent: function() {
        return true;
      },
    };
  };
}

// 模拟IntersectionObserver
class IntersectionObserverMock {
  constructor(callback) {
    this.callback = callback;
  }
  observe() { return null; }
  unobserve() { return null; }
  disconnect() { return null; }
}

if (typeof window !== 'undefined') {
  window.IntersectionObserver = window.IntersectionObserver || IntersectionObserverMock;
}

// 模拟localStorage
const localStorageMock = (function() {
  let store = {};
  return {
    getItem: function(key) {
      return store[key] || null;
    },
    setItem: function(key, value) {
      store[key] = String(value);
    },
    removeItem: function(key) {
      delete store[key];
    },
    clear: function() {
      store = {};
    },
    key: function(i) {
      const keys = Object.keys(store);
      return keys[i] || null;
    },
    get length() {
      return Object.keys(store).length;
    },
  };
})();

if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
  });
}

// 模拟fetch
global.fetch = jest.fn();

// 模拟ResizeObserver
class ResizeObserverMock {
  constructor(callback) {
    this.callback = callback;
  }
  observe() { return null; }
  unobserve() { return null; }
  disconnect() { return null; }
}

if (typeof window !== 'undefined') {
  window.ResizeObserver = window.ResizeObserver || ResizeObserverMock;
}

// 清除所有模拟
afterEach(() => {
  jest.clearAllMocks();
}); 