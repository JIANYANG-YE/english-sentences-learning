/**
 * 日志服务
 */

// 日志级别
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

// 日志条目
export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  data?: Record<string, any>;
}

// 日志服务
export const logService = {
  /**
   * 创建日志条目
   */
  createLogEntry: (level: LogLevel, message: string, data?: Record<string, any>): LogEntry => {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      data,
    };
  },

  /**
   * 记录调试日志
   */
  debug: (message: string, data?: Record<string, any>) => {
    const entry = logService.createLogEntry('debug', message, data);
    if (process.env.NODE_ENV === 'development') {
      console.debug(entry);
    }
    // TODO: 实现日志记录到服务器
  },

  /**
   * 记录信息日志
   */
  info: (message: string, data?: Record<string, any>) => {
    const entry = logService.createLogEntry('info', message, data);
    console.info(entry);
    // TODO: 实现日志记录到服务器
  },

  /**
   * 记录警告日志
   */
  warn: (message: string, data?: Record<string, any>) => {
    const entry = logService.createLogEntry('warn', message, data);
    console.warn(entry);
    // TODO: 实现日志记录到服务器
  },

  /**
   * 记录错误日志
   */
  error: (message: string, data?: Record<string, any>) => {
    const entry = logService.createLogEntry('error', message, data);
    console.error(entry);
    // TODO: 实现日志记录到服务器
  },

  /**
   * 格式化日志条目
   */
  formatLogEntry: (entry: LogEntry): string => {
    const { level, message, timestamp, data } = entry;
    let formattedMessage = `[${timestamp}] ${level.toUpperCase()}: ${message}`;

    if (data) {
      formattedMessage += `\nData: ${JSON.stringify(data, null, 2)}`;
    }

    return formattedMessage;
  },
}; 