/**
 * API客户端
 * 提供统一的API请求封装
 */

// 请求选项类型
type RequestOptions = {
  headers?: Record<string, string>;
  params?: Record<string, string>;
};

// API错误类型
interface ApiError extends Error {
  status?: number;
  statusText?: string;
  url?: string;
  data?: unknown;
}

// API响应类型
type APIResponse<T> = T;

/**
 * API基础URL
 * 在生产环境中，这应该指向实际的API服务地址
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

/**
 * 创建请求URL
 * @param path API路径
 * @param params 查询参数
 */
const createUrl = (path: string, params?: Record<string, string>): string => {
  // 确保在浏览器环境中运行
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const url = new URL(`${API_BASE_URL}${path}`, origin);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }
  
  return url.toString();
};

/**
 * 获取请求头
 * 包括认证信息等
 */
const getHeaders = (customHeaders?: Record<string, string>): HeadersInit => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...customHeaders,
  };
  
  // 如果有认证令牌，添加到请求头
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  return headers;
};

/**
 * 处理API响应
 */
const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const contentType = response.headers.get('content-type');
    let errorData: unknown;
    
    // 尝试解析错误响应
    if (contentType && contentType.includes('application/json')) {
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: 'Failed to parse error response' };
      }
    } else {
      try {
        errorData = await response.text();
      } catch {
        errorData = { message: 'Failed to read error response' };
      }
    }
    
    // 创建并抛出API错误
    const apiError: ApiError = new Error(`API请求失败: ${response.status} ${response.statusText}`);
    apiError.status = response.status;
    apiError.statusText = response.statusText;
    apiError.url = response.url;
    apiError.data = errorData;
    
    throw apiError;
  }
  
  const contentType = response.headers.get('content-type');
  
  // 处理JSON响应
  if (contentType && contentType.includes('application/json')) {
    const json = await response.json();
    return json as T;
  }
  
  // 处理非JSON响应
  return {} as T;
};

/**
 * 处理API错误
 */
const handleError = (error: unknown): never => {
  if (error instanceof Error) {
    console.error('API请求错误:', error);
    
    // 记录额外的错误信息，如果有的话
    if ('status' in error && typeof error.status === 'number') {
      console.error(`状态码: ${error.status}`);
    }
    
    if ('data' in error && error.data) {
      console.error('错误数据:', error.data);
    }
  } else {
    console.error('未知错误:', error);
  }
  
  throw error;
};

/**
 * 发起GET请求
 */
const get = async <T>(
  path: string,
  options?: RequestOptions
): Promise<T> => {
  try {
    const url = createUrl(path, options?.params);
    const headers = getHeaders(options?.headers);
    
    const response = await fetch(url, {
      method: 'GET',
      headers,
    });
    
    return handleResponse<T>(response);
  } catch (error) {
    return handleError(error);
  }
};

/**
 * 发起POST请求
 */
const post = async <T>(
  path: string,
  data?: unknown,
  options?: RequestOptions
): Promise<T> => {
  try {
    const url = createUrl(path, options?.params);
    const headers = getHeaders(options?.headers);
    
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: data ? JSON.stringify(data) : null,
    });
    
    return handleResponse<T>(response);
  } catch (error) {
    return handleError(error);
  }
};

/**
 * 发起PUT请求
 */
const put = async <T>(
  path: string,
  data?: unknown,
  options?: RequestOptions
): Promise<T> => {
  try {
    const url = createUrl(path, options?.params);
    const headers = getHeaders(options?.headers);
    
    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body: data ? JSON.stringify(data) : null,
    });
    
    return handleResponse<T>(response);
  } catch (error) {
    return handleError(error);
  }
};

/**
 * 发起DELETE请求
 */
const del = async <T>(
  path: string,
  options?: RequestOptions
): Promise<T> => {
  try {
    const url = createUrl(path, options?.params);
    const headers = getHeaders(options?.headers);
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers,
    });
    
    return handleResponse<T>(response);
  } catch (error) {
    return handleError(error);
  }
};

const apiClient = {
  get,
  post,
  put,
  delete: del,
};

export default apiClient; 