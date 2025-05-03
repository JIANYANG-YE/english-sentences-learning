import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// 支持的语言列表
export type SupportedLanguage = 'zh' | 'en' | 'es' | 'fr' | 'ja' | 'ko' | 'ru' | 'de' | 'pt' | 'ar';

// 语言文本方向
export type TextDirection = 'ltr' | 'rtl';

// 语言配置
interface LanguageConfig {
  code: SupportedLanguage;
  name: string;
  localName: string;
  direction: TextDirection;
  enabled: boolean;
}

// 语言配置表
const LANGUAGES: Record<SupportedLanguage, LanguageConfig> = {
  zh: { code: 'zh', name: 'Chinese', localName: '中文', direction: 'ltr', enabled: true },
  en: { code: 'en', name: 'English', localName: 'English', direction: 'ltr', enabled: true },
  es: { code: 'es', name: 'Spanish', localName: 'Español', direction: 'ltr', enabled: true },
  fr: { code: 'fr', name: 'French', localName: 'Français', direction: 'ltr', enabled: true },
  ja: { code: 'ja', name: 'Japanese', localName: '日本語', direction: 'ltr', enabled: true },
  ko: { code: 'ko', name: 'Korean', localName: '한국어', direction: 'ltr', enabled: true },
  ru: { code: 'ru', name: 'Russian', localName: 'Русский', direction: 'ltr', enabled: true },
  de: { code: 'de', name: 'German', localName: 'Deutsch', direction: 'ltr', enabled: true },
  pt: { code: 'pt', name: 'Portuguese', localName: 'Português', direction: 'ltr', enabled: true },
  ar: { code: 'ar', name: 'Arabic', localName: 'العربية', direction: 'rtl', enabled: true },
};

// 本地化上下文类型
interface LocalizationContextType {
  currentLanguage: SupportedLanguage;
  changeLanguage: (lang: SupportedLanguage) => void;
  direction: TextDirection;
  translate: (key: string, params?: Record<string, string>) => string;
  getAvailableLanguages: () => LanguageConfig[];
  formatDate: (date: Date, options?: Intl.DateTimeFormatOptions) => string;
  formatNumber: (number: number, options?: Intl.NumberFormatOptions) => string;
}

// 创建本地化上下文
const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

// 检测浏览器默认语言
const detectBrowserLanguage = (): SupportedLanguage => {
  if (typeof window === 'undefined') return 'en'; // 默认英语

  // 获取浏览器语言设置
  const browserLang = navigator.language.split('-')[0];
  
  // 检查是否为支持的语言
  const isSupported = Object.keys(LANGUAGES).includes(browserLang);
  
  return isSupported ? browserLang as SupportedLanguage : 'en';
};

// 加载语言包
const loadTranslations = async (lang: SupportedLanguage) => {
  try {
    // 这里模拟API请求，实际项目中应该从服务器或本地文件加载
    // 实际实现应该基于实际项目结构调整
    const response = await fetch(`/api/translations/${lang}.json`);
    
    if (!response.ok) {
      throw new Error(`Failed to load translations for ${lang}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error loading translations for ${lang}:`, error);
    // 返回空对象作为后备方案
    return {};
  }
};

interface LocalizationProviderProps {
  children: ReactNode;
  defaultLanguage?: SupportedLanguage;
}

export const LocalizationProvider: React.FC<LocalizationProviderProps> = ({ 
  children, 
  defaultLanguage 
}) => {
  // 使用传入的默认语言，或检测浏览器语言，或使用英语作为后备
  const initialLanguage = defaultLanguage || detectBrowserLanguage();
  
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>(initialLanguage);
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  
  // 当前文本方向
  const direction = LANGUAGES[currentLanguage].direction;

  // 切换语言
  const changeLanguage = async (lang: SupportedLanguage) => {
    if (LANGUAGES[lang] && LANGUAGES[lang].enabled) {
      setIsLoading(true);
      const newTranslations = await loadTranslations(lang);
      setTranslations(newTranslations);
      setCurrentLanguage(lang);
      setIsLoading(false);
      
      // 保存用户语言偏好到本地存储
      localStorage.setItem('preferred_language', lang);
      
      // 更新HTML文档的方向和语言
      document.documentElement.dir = LANGUAGES[lang].direction;
      document.documentElement.lang = lang;
    }
  };

  // 翻译函数
  const translate = (key: string, params?: Record<string, string>): string => {
    if (!translations) return key;
    
    let text = translations[key] || key;
    
    // 参数替换
    if (params) {
      Object.entries(params).forEach(([paramKey, value]) => {
        text = text.replace(new RegExp(`{${paramKey}}`, 'g'), value);
      });
    }
    
    return text;
  };

  // 获取所有可用语言
  const getAvailableLanguages = (): LanguageConfig[] => {
    return Object.values(LANGUAGES).filter(lang => lang.enabled);
  };

  // 日期格式化
  const formatDate = (date: Date, options?: Intl.DateTimeFormatOptions): string => {
    return new Intl.DateTimeFormat(currentLanguage, options).format(date);
  };

  // 数字格式化
  const formatNumber = (number: number, options?: Intl.NumberFormatOptions): string => {
    return new Intl.NumberFormat(currentLanguage, options).format(number);
  };

  // 初始加载
  useEffect(() => {
    const loadInitialLanguage = async () => {
      // 检查本地存储中的语言偏好
      const storedLang = localStorage.getItem('preferred_language') as SupportedLanguage;
      
      // 使用存储的语言（如果有效），否则使用初始语言
      const langToLoad = storedLang && LANGUAGES[storedLang]?.enabled 
        ? storedLang 
        : initialLanguage;
      
      // 设置HTML文档的方向和语言
      document.documentElement.dir = LANGUAGES[langToLoad].direction;
      document.documentElement.lang = langToLoad;
      
      // 加载翻译
      const initialTranslations = await loadTranslations(langToLoad);
      setTranslations(initialTranslations);
      setCurrentLanguage(langToLoad);
      setIsLoading(false);
    };

    loadInitialLanguage();
  }, [initialLanguage]);

  const contextValue: LocalizationContextType = {
    currentLanguage,
    changeLanguage,
    direction,
    translate,
    getAvailableLanguages,
    formatDate,
    formatNumber
  };

  // 显示加载状态或提供本地化上下文
  return (
    <LocalizationContext.Provider value={contextValue}>
      {isLoading ? (
        // 加载指示器，可以用项目实际使用的加载组件替换
        <div>Loading translations...</div>
      ) : (
        children
      )}
    </LocalizationContext.Provider>
  );
};

// 自定义钩子，用于组件中使用本地化功能
export const useLocalization = (): LocalizationContextType => {
  const context = useContext(LocalizationContext);
  
  if (context === undefined) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  
  return context;
};

// 方便使用的翻译组件
interface TranslateProps {
  messageKey: string;
  params?: Record<string, string>;
}

export const Translate: React.FC<TranslateProps> = ({ messageKey, params }) => {
  const { translate } = useLocalization();
  return <>{translate(messageKey, params)}</>;
};

export default LocalizationProvider; 