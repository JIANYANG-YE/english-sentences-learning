import { stateManager } from './stateManagementService';

// API配置
interface ApiConfig {
  baseUrl: string;
  timeout: number;
  headers: Record<string, string>;
  mockEnabled: boolean;
}

// 默认API配置
const defaultApiConfig: ApiConfig = {
  baseUrl: '/api',
  timeout: 30000, // 30秒
  headers: {
    'Content-Type': 'application/json'
  },
  mockEnabled: true // 默认启用模拟数据
};

// 请求选项
export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  params?: Record<string, string>;
  data?: any;
  timeout?: number;
  cache?: boolean;
  mockData?: any;
  mockDelay?: number;
  retries?: number;
  requiresAuth?: boolean;
}

// 响应类型
export interface ApiResponse<T = any> {
  status: number;
  data: T;
  headers: Record<string, string>;
  isMock?: boolean;
}

// 错误类型
export class ApiError extends Error {
  status: number;
  data: any;
  
  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// 拦截器类型
type RequestInterceptor = (config: RequestOptions) => RequestOptions | Promise<RequestOptions>;
type ResponseInterceptor<T = any> = (response: ApiResponse<T>) => ApiResponse<T> | Promise<ApiResponse<T>>;
type ErrorInterceptor = (error: ApiError) => ApiError | Promise<ApiError>;

/**
 * API服务类
 */
class ApiService {
  private config: ApiConfig;
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];
  private errorInterceptors: ErrorInterceptor[] = [];
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private cacheTTL: number = 5 * 60 * 1000; // 缓存生存时间（5分钟）
  
  constructor(config: Partial<ApiConfig> = {}) {
    this.config = { ...defaultApiConfig, ...config };
  }
  
  /**
   * 添加请求拦截器
   * @param interceptor 请求拦截器函数
   * @returns 用于移除拦截器的函数
   */
  public addRequestInterceptor(interceptor: RequestInterceptor): () => void {
    this.requestInterceptors.push(interceptor);
    return () => {
      const index = this.requestInterceptors.indexOf(interceptor);
      if (index !== -1) {
        this.requestInterceptors.splice(index, 1);
      }
    };
  }
  
  /**
   * 添加响应拦截器
   * @param interceptor 响应拦截器函数
   * @returns 用于移除拦截器的函数
   */
  public addResponseInterceptor(interceptor: ResponseInterceptor): () => void {
    this.responseInterceptors.push(interceptor);
    return () => {
      const index = this.responseInterceptors.indexOf(interceptor);
      if (index !== -1) {
        this.responseInterceptors.splice(index, 1);
      }
    };
  }
  
  /**
   * 添加错误拦截器
   * @param interceptor 错误拦截器函数
   * @returns 用于移除拦截器的函数
   */
  public addErrorInterceptor(interceptor: ErrorInterceptor): () => void {
    this.errorInterceptors.push(interceptor);
    return () => {
      const index = this.errorInterceptors.indexOf(interceptor);
      if (index !== -1) {
        this.errorInterceptors.splice(index, 1);
      }
    };
  }
  
  /**
   * 发起HTTP请求
   * @param endpoint API端点
   * @param options 请求选项
   * @returns Promise<ApiResponse<T>>
   */
  public async request<T = any>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    try {
      // 与默认选项合并
      const mergedOptions: RequestOptions = {
        method: 'GET',
        headers: { ...this.config.headers },
        timeout: this.config.timeout,
        cache: false,
        retries: 0,
        requiresAuth: true,
        ...options
      };
      
      // 应用请求拦截器
      const processedOptions = await this.applyRequestInterceptors(mergedOptions);
      
      // 检查是否使用模拟数据
      if (this.config.mockEnabled && processedOptions.mockData) {
        return this.handleMockResponse<T>(processedOptions);
      }
      
      // 构建缓存键
      const cacheKey = this.buildCacheKey(endpoint, processedOptions);
      
      // 如果启用缓存，检查缓存
      if (processedOptions.cache) {
        const cachedResponse = this.getFromCache<T>(cacheKey);
        if (cachedResponse) {
          return cachedResponse;
        }
      }
      
      // 添加认证头
      if (processedOptions.requiresAuth) {
        await this.addAuthHeader(processedOptions);
      }
      
      // 构建URL
      const url = this.buildUrl(endpoint, processedOptions.params);
      
      // 设置超时
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, processedOptions.timeout || this.config.timeout);
      
      // 准备fetch选项
      const fetchOptions: RequestInit = {
        method: processedOptions.method,
        headers: processedOptions.headers as HeadersInit,
        body: processedOptions.data ? JSON.stringify(processedOptions.data) : undefined,
        signal: controller.signal
      };
      
      // 发起请求
      const response = await fetch(url, fetchOptions);
      clearTimeout(timeoutId);
      
      // 解析响应内容
      let data: any;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }
      
      // 构建API响应对象
      const apiResponse: ApiResponse<T> = {
        status: response.status,
        data,
        headers: this.extractHeaders(response.headers)
      };
      
      // 如果响应不成功，抛出错误
      if (!response.ok) {
        throw new ApiError(
          `API请求失败: ${response.status} ${response.statusText}`,
          response.status,
          data
        );
      }
      
      // 应用响应拦截器
      const processedResponse = await this.applyResponseInterceptors(apiResponse);
      
      // 如果启用缓存，存储响应
      if (processedOptions.cache) {
        this.saveToCache(cacheKey, processedResponse);
      }
      
      return processedResponse;
    } catch (error) {
      // 处理错误
      if (error instanceof ApiError) {
        // 应用错误拦截器
        const processedError = await this.applyErrorInterceptors(error);
        
        // 重试逻辑
        if (options.retries && options.retries > 0) {
          return this.request<T>(endpoint, {
            ...options,
            retries: options.retries - 1
          });
        }
        
        throw processedError;
      } else if (error instanceof DOMException && error.name === 'AbortError') {
        // 处理超时错误
        const timeoutError = new ApiError(
          '请求超时',
          408,
          { endpoint, options }
        );
        
        // 应用错误拦截器
        const processedError = await this.applyErrorInterceptors(timeoutError);
        
        // 重试逻辑
        if (options.retries && options.retries > 0) {
          return this.request<T>(endpoint, {
            ...options,
            retries: options.retries - 1
          });
        }
        
        throw processedError;
      } else {
        // 处理其他错误
        const networkError = new ApiError(
          `网络错误: ${error instanceof Error ? error.message : String(error)}`,
          0,
          { endpoint, options }
        );
        
        // 应用错误拦截器
        const processedError = await this.applyErrorInterceptors(networkError);
        
        // 重试逻辑
        if (options.retries && options.retries > 0) {
          return this.request<T>(endpoint, {
            ...options,
            retries: options.retries - 1
          });
        }
        
        throw processedError;
      }
    }
  }
  
  /**
   * GET请求
   * @param endpoint API端点
   * @param params 查询参数
   * @param options 请求选项
   * @returns Promise<ApiResponse<T>>
   */
  public get<T = any>(
    endpoint: string,
    params?: Record<string, string>,
    options: Omit<RequestOptions, 'method' | 'params'> = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'GET',
      params
    });
  }
  
  /**
   * POST请求
   * @param endpoint API端点
   * @param data 请求数据
   * @param options 请求选项
   * @returns Promise<ApiResponse<T>>
   */
  public post<T = any>(
    endpoint: string,
    data?: any,
    options: Omit<RequestOptions, 'method' | 'data'> = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      data
    });
  }
  
  /**
   * PUT请求
   * @param endpoint API端点
   * @param data 请求数据
   * @param options 请求选项
   * @returns Promise<ApiResponse<T>>
   */
  public put<T = any>(
    endpoint: string,
    data?: any,
    options: Omit<RequestOptions, 'method' | 'data'> = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      data
    });
  }
  
  /**
   * DELETE请求
   * @param endpoint API端点
   * @param options 请求选项
   * @returns Promise<ApiResponse<T>>
   */
  public delete<T = any>(
    endpoint: string,
    options: Omit<RequestOptions, 'method'> = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'DELETE'
    });
  }
  
  /**
   * PATCH请求
   * @param endpoint API端点
   * @param data 请求数据
   * @param options 请求选项
   * @returns Promise<ApiResponse<T>>
   */
  public patch<T = any>(
    endpoint: string,
    data?: any,
    options: Omit<RequestOptions, 'method' | 'data'> = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      data
    });
  }
  
  /**
   * 设置是否启用模拟数据
   * @param enabled 是否启用
   */
  public setMockEnabled(enabled: boolean): void {
    this.config.mockEnabled = enabled;
  }
  
  /**
   * 清空缓存
   */
  public clearCache(): void {
    this.cache.clear();
  }
  
  /**
   * 设置缓存生存时间
   * @param ttl 生存时间（毫秒）
   */
  public setCacheTTL(ttl: number): void {
    this.cacheTTL = ttl;
  }
  
  /**
   * 构建完整URL
   * @param endpoint API端点
   * @param params 查询参数
   * @returns 完整URL
   */
  private buildUrl(endpoint: string, params?: Record<string, string>): string {
    // 确保endpoint以/开头
    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    
    // 构建基本URL
    let url = `${this.config.baseUrl}${normalizedEndpoint}`;
    
    // 添加查询参数
    if (params && Object.keys(params).length > 0) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        searchParams.append(key, value);
      });
      url += `?${searchParams.toString()}`;
    }
    
    return url;
  }
  
  /**
   * 提取响应头
   * @param headers 响应头
   * @returns 响应头对象
   */
  private extractHeaders(headers: Headers): Record<string, string> {
    const result: Record<string, string> = {};
    headers.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }
  
  /**
   * 处理模拟响应
   * @param options 请求选项
   * @returns 模拟响应
   */
  private async handleMockResponse<T = any>(options: RequestOptions): Promise<ApiResponse<T>> {
    // 模拟延迟
    await new Promise(resolve => setTimeout(resolve, options.mockDelay || 500));
    
    // 构建模拟响应
    const mockResponse: ApiResponse<T> = {
      status: 200,
      data: options.mockData as T,
      headers: { 'content-type': 'application/json' },
      isMock: true
    };
    
    // 应用响应拦截器
    return this.applyResponseInterceptors(mockResponse);
  }
  
  /**
   * 应用请求拦截器
   * @param options 请求选项
   * @returns 处理后的请求选项
   */
  private async applyRequestInterceptors(options: RequestOptions): Promise<RequestOptions> {
    let result = { ...options };
    
    for (const interceptor of this.requestInterceptors) {
      result = await interceptor(result);
    }
    
    return result;
  }
  
  /**
   * 应用响应拦截器
   * @param response API响应
   * @returns 处理后的API响应
   */
  private async applyResponseInterceptors<T = any>(response: ApiResponse<T>): Promise<ApiResponse<T>> {
    let result = { ...response };
    
    for (const interceptor of this.responseInterceptors) {
      result = await interceptor(result);
    }
    
    return result;
  }
  
  /**
   * 应用错误拦截器
   * @param error API错误
   * @returns 处理后的API错误
   */
  private async applyErrorInterceptors(error: ApiError): Promise<ApiError> {
    let result = error;
    
    for (const interceptor of this.errorInterceptors) {
      result = await interceptor(result);
    }
    
    return result;
  }
  
  /**
   * 添加认证头
   * @param options 请求选项
   */
  private async addAuthHeader(options: RequestOptions): Promise<void> {
    // 从状态管理器获取用户信息
    const state = stateManager.getState();
    const user = state.user;
    
    // 如果用户已登录，添加认证头
    if (user && user.id) {
      options.headers = options.headers || {};
      // 注意：实际项目中应该使用JWT或其他认证令牌
      options.headers['Authorization'] = `Bearer user-${user.id}`;
    }
  }
  
  /**
   * 构建缓存键
   * @param endpoint API端点
   * @param options 请求选项
   * @returns 缓存键
   */
  private buildCacheKey(endpoint: string, options: RequestOptions): string {
    return `${options.method}-${endpoint}-${JSON.stringify(options.params || {})}-${JSON.stringify(options.data || {})}`;
  }
  
  /**
   * 从缓存获取响应
   * @param key 缓存键
   * @returns 缓存的响应或undefined
   */
  private getFromCache<T = any>(key: string): ApiResponse<T> | undefined {
    const cached = this.cache.get(key);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      return {
        ...cached.data,
        headers: { ...cached.data.headers, 'x-from-cache': 'true' }
      };
    }
    
    return undefined;
  }
  
  /**
   * 保存响应到缓存
   * @param key 缓存键
   * @param response API响应
   */
  private saveToCache<T = any>(key: string, response: ApiResponse<T>): void {
    this.cache.set(key, {
      data: response,
      timestamp: Date.now()
    });
  }
}

// 创建单例实例
const apiService = new ApiService();

// 添加默认请求拦截器：记录请求信息
apiService.addRequestInterceptor(config => {
  console.log(`API请求: ${config.method} ${config.params || {}}`);
  return config;
});

// 添加默认响应拦截器：记录响应信息
apiService.addResponseInterceptor(response => {
  if (response.isMock) {
    console.log('收到模拟响应:', response.status, response.data);
  } else {
    console.log('收到API响应:', response.status);
  }
  return response;
});

// 添加默认错误拦截器：记录错误信息
apiService.addErrorInterceptor(error => {
  console.error('API错误:', error.status, error.message, error.data);
  return error;
});

export default apiService; 