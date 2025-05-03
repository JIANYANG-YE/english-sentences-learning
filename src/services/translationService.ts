import { SupportedLanguage } from '../components/i18n/LocalizationProvider';

// 默认翻译，作为后备数据
const DEFAULT_TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    'app.title': 'English Sentences Learning Platform',
    'app.description': 'Learn English sentences effectively',
    'nav.home': 'Home',
    'nav.courses': 'Courses',
    'nav.practice': 'Practice',
    'nav.profile': 'Profile',
    'nav.settings': 'Settings',
    'common.loading': 'Loading...',
    'common.error': 'An error occurred',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.confirm': 'Confirm',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.view': 'View',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.sort': 'Sort',
    'auth.login': 'Login',
    'auth.logout': 'Logout',
    'auth.register': 'Register',
    'auth.forgotPassword': 'Forgot Password',
    'learning.continue': 'Continue Learning',
    'learning.start': 'Start Learning',
    'learning.complete': 'Complete',
    'learning.next': 'Next',
    'learning.previous': 'Previous',
    'learning.correct': 'Correct',
    'learning.incorrect': 'Incorrect',
    'learning.progress': 'Progress',
    'learning.score': 'Score',
    'learning.time': 'Time',
    'learning.difficulty': 'Difficulty',
    'learning.beginner': 'Beginner',
    'learning.intermediate': 'Intermediate',
    'learning.advanced': 'Advanced',
    'learning.expert': 'Expert',
    'settings.theme': 'Theme',
    'settings.language': 'Language',
    'settings.notifications': 'Notifications',
    'settings.privacy': 'Privacy',
    'settings.account': 'Account',
    'settings.help': 'Help & Support',
    'settings.about': 'About',
    'profile.activity': 'Activity',
    'profile.achievements': 'Achievements',
    'profile.statistics': 'Statistics',
    'profile.settings': 'Settings'
  },
  zh: {
    'app.title': '英语句子学习平台',
    'app.description': '高效学习英语句子',
    'nav.home': '首页',
    'nav.courses': '课程',
    'nav.practice': '练习',
    'nav.profile': '个人资料',
    'nav.settings': '设置',
    'common.loading': '加载中...',
    'common.error': '发生错误',
    'common.save': '保存',
    'common.cancel': '取消',
    'common.confirm': '确认',
    'common.delete': '删除',
    'common.edit': '编辑',
    'common.view': '查看',
    'common.search': '搜索',
    'common.filter': '筛选',
    'common.sort': '排序',
    'auth.login': '登录',
    'auth.logout': '退出登录',
    'auth.register': '注册',
    'auth.forgotPassword': '忘记密码',
    'learning.continue': '继续学习',
    'learning.start': '开始学习',
    'learning.complete': '完成',
    'learning.next': '下一个',
    'learning.previous': '上一个',
    'learning.correct': '正确',
    'learning.incorrect': '错误',
    'learning.progress': '进度',
    'learning.score': '得分',
    'learning.time': '时间',
    'learning.difficulty': '难度',
    'learning.beginner': '初级',
    'learning.intermediate': '中级',
    'learning.advanced': '高级',
    'learning.expert': '专家',
    'settings.theme': '主题',
    'settings.language': '语言',
    'settings.notifications': '通知',
    'settings.privacy': '隐私',
    'settings.account': '账户',
    'settings.help': '帮助与支持',
    'settings.about': '关于',
    'profile.activity': '活动',
    'profile.achievements': '成就',
    'profile.statistics': '统计',
    'profile.settings': '设置'
  }
};

// 缓存已加载的翻译数据
let translationCache: Record<string, Record<string, string>> = { ...DEFAULT_TRANSLATIONS };

/**
 * 翻译服务，用于管理和加载多语言翻译资源
 */
export class TranslationService {
  /**
   * 加载指定语言的翻译资源
   * @param language 目标语言
   * @returns 翻译键值对
   */
  static async loadTranslations(language: SupportedLanguage): Promise<Record<string, string>> {
    try {
      // 如果已缓存，直接返回
      if (translationCache[language]) {
        return translationCache[language];
      }

      // 尝试从API加载翻译文件
      // 注意：实际实现中应替换为真实的API调用
      const response = await fetch(`/api/translations/${language}.json`);
      
      if (!response.ok) {
        throw new Error(`Failed to load translations for ${language}`);
      }
      
      const translations = await response.json();
      
      // 缓存翻译数据
      translationCache[language] = translations;
      
      return translations;
    } catch (error) {
      console.warn(`Error loading translations for ${language}:`, error);
      
      // 使用默认翻译作为后备
      return DEFAULT_TRANSLATIONS[language] || DEFAULT_TRANSLATIONS.en;
    }
  }

  /**
   * 清除翻译缓存，通常在语言包更新后调用
   * @param language 指定语言，不指定则清除所有缓存
   */
  static clearCache(language?: SupportedLanguage): void {
    if (language) {
      delete translationCache[language];
    } else {
      // 保留默认翻译
      translationCache = { ...DEFAULT_TRANSLATIONS };
    }
  }

  /**
   * 批量为多个元素添加翻译属性
   * 用于优化不使用React组件的场景
   * @param elements 要翻译的元素列表
   * @param attributeName 存储翻译键的属性名
   */
  static translateElements(
    elements: HTMLElement[], 
    attributeName: string = 'data-i18n'
  ): void {
    const currentLang = document.documentElement.lang as SupportedLanguage || 'en';
    const translations = translationCache[currentLang] || DEFAULT_TRANSLATIONS.en;
    
    elements.forEach(element => {
      const key = element.getAttribute(attributeName);
      if (key && translations[key]) {
        element.textContent = translations[key];
      }
    });
  }

  /**
   * 获取当前可用的所有翻译语言
   */
  static getAvailableLanguages(): SupportedLanguage[] {
    return Object.keys(DEFAULT_TRANSLATIONS) as SupportedLanguage[];
  }

  /**
   * 添加新的翻译数据
   * @param language 目标语言
   * @param translations 翻译键值对
   */
  static addTranslations(
    language: SupportedLanguage, 
    translations: Record<string, string>
  ): void {
    if (!translationCache[language]) {
      translationCache[language] = {};
    }
    
    translationCache[language] = {
      ...translationCache[language],
      ...translations
    };
  }
}

export default TranslationService; 