/**
 * 错误处理服务
 */

// 错误类型
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public status: number = 500,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

// 错误处理服务
export const errorService = {
  /**
   * 创建应用错误
   */
  createError: (message: string, code: string, status?: number, details?: Record<string, any>) => {
    return new AppError(message, code, status, details);
  },

  /**
   * 处理API错误
   */
  handleApiError: (error: unknown) => {
    if (error instanceof AppError) {
      return error;
    }

    if (error instanceof Error) {
      return new AppError(error.message, 'UNKNOWN_ERROR');
    }

    return new AppError('An unknown error occurred', 'UNKNOWN_ERROR');
  },

  /**
   * 格式化错误消息
   */
  formatErrorMessage: (error: AppError) => {
    const { message, code, details } = error;
    let formattedMessage = `${message} (${code})`;

    if (details) {
      formattedMessage += `\nDetails: ${JSON.stringify(details, null, 2)}`;
    }

    return formattedMessage;
  },

  /**
   * 记录错误
   */
  logError: (error: AppError) => {
    console.error(errorService.formatErrorMessage(error));
    // TODO: 实现错误日志记录到服务器
  },
}; 