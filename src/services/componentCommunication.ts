// 事件类型定义
export interface EventPayload {
  type: string;
  data?: any;
  source?: string;
  timestamp?: number;
}

// 事件处理器类型
export type EventHandler = (payload: EventPayload) => void;

// 事件范围
export type EventScope = 'global' | 'learning' | 'ai' | 'community' | 'analytics';

/**
 * 组件通信服务
 * 基于事件发布/订阅模式，提供组件间的松耦合通信能力
 */
class ComponentCommunication {
  // 存储所有注册的事件处理器
  private eventHandlers: Map<string, Set<EventHandler>> = new Map();
  
  // 记录事件历史，用于调试
  private eventHistory: EventPayload[] = [];
  private maxHistoryLength: number = 100;
  private isDebugMode: boolean = false;
  
  /**
   * 发布事件
   * @param type 事件类型
   * @param data 事件数据
   * @param source 事件来源（组件名）
   * @param scope 事件范围
   */
  public publish(
    type: string,
    data?: any,
    source?: string,
    scope: EventScope = 'global'
  ): void {
    // 构建完整事件类型（包含范围）
    const fullType = `${scope}:${type}`;
    
    // 构建事件负载
    const payload: EventPayload = {
      type: fullType,
      data,
      source,
      timestamp: Date.now()
    };
    
    // 记录事件历史
    this.addToHistory(payload);
    
    // 调试日志
    if (this.isDebugMode) {
      console.log(`Event published: ${fullType}`, payload);
    }
    
    // 获取该事件类型的所有处理器
    const handlers = this.eventHandlers.get(fullType);
    
    // 如果没有处理器，直接返回
    if (!handlers || handlers.size === 0) {
      if (this.isDebugMode) {
        console.warn(`No handlers for event: ${fullType}`);
      }
      return;
    }
    
    // 通知所有处理器
    // 使用setTimeout确保以异步方式执行，避免阻塞
    handlers.forEach(handler => {
      setTimeout(() => {
        try {
          handler(payload);
        } catch (error) {
          console.error(`Error in event handler for ${fullType}:`, error);
        }
      }, 0);
    });
  }
  
  /**
   * 订阅事件
   * @param type 事件类型
   * @param handler 事件处理器
   * @param scope 事件范围
   * @returns 取消订阅的函数
   */
  public subscribe(
    type: string,
    handler: EventHandler,
    scope: EventScope = 'global'
  ): () => void {
    // 构建完整事件类型
    const fullType = `${scope}:${type}`;
    
    // 获取该事件类型的处理器集合，如果不存在则创建
    let handlers = this.eventHandlers.get(fullType);
    if (!handlers) {
      handlers = new Set();
      this.eventHandlers.set(fullType, handlers);
    }
    
    // 添加处理器
    handlers.add(handler);
    
    if (this.isDebugMode) {
      console.log(`Subscribed to event: ${fullType}`);
    }
    
    // 返回取消订阅的函数
    return () => {
      this.unsubscribe(type, handler, scope);
    };
  }
  
  /**
   * 取消订阅事件
   * @param type 事件类型
   * @param handler 事件处理器
   * @param scope 事件范围
   */
  public unsubscribe(
    type: string,
    handler: EventHandler,
    scope: EventScope = 'global'
  ): void {
    const fullType = `${scope}:${type}`;
    const handlers = this.eventHandlers.get(fullType);
    
    if (handlers) {
      handlers.delete(handler);
      
      // 如果没有处理器了，删除该事件类型
      if (handlers.size === 0) {
        this.eventHandlers.delete(fullType);
      }
      
      if (this.isDebugMode) {
        console.log(`Unsubscribed from event: ${fullType}`);
      }
    }
  }
  
  /**
   * 一次性订阅事件，触发后自动取消订阅
   * @param type 事件类型
   * @param handler 事件处理器
   * @param scope 事件范围
   * @returns 取消订阅的函数
   */
  public subscribeOnce(
    type: string,
    handler: EventHandler,
    scope: EventScope = 'global'
  ): () => void {
    const fullType = `${scope}:${type}`;
    
    // 创建包装处理器，在触发后自动取消订阅
    const wrapperHandler: EventHandler = (payload: EventPayload) => {
      // 先取消订阅，再执行原始处理器
      this.unsubscribe(type, wrapperHandler, scope);
      handler(payload);
    };
    
    // 订阅事件
    return this.subscribe(type, wrapperHandler, scope);
  }
  
  /**
   * 添加事件到历史记录
   * @param payload 事件负载
   */
  private addToHistory(payload: EventPayload): void {
    // 添加到历史记录
    this.eventHistory.push(payload);
    
    // 如果超过最大长度，移除最早的事件
    if (this.eventHistory.length > this.maxHistoryLength) {
      this.eventHistory.shift();
    }
  }
  
  /**
   * 获取事件历史
   * @param limit 限制条数，默认返回所有
   * @returns 事件历史数组
   */
  public getEventHistory(limit?: number): EventPayload[] {
    if (limit && limit > 0) {
      return this.eventHistory.slice(-limit);
    }
    return [...this.eventHistory];
  }
  
  /**
   * 清空事件历史
   */
  public clearEventHistory(): void {
    this.eventHistory = [];
  }
  
  /**
   * 设置调试模式
   * @param enabled 是否启用调试模式
   */
  public setDebugMode(enabled: boolean): void {
    this.isDebugMode = enabled;
  }
  
  /**
   * 获取当前活跃的事件类型列表
   * @returns 事件类型数组
   */
  public getActiveEventTypes(): string[] {
    return Array.from(this.eventHandlers.keys());
  }
  
  /**
   * 获取特定事件类型的订阅者数量
   * @param type 事件类型
   * @param scope 事件范围
   * @returns 订阅者数量
   */
  public getSubscriberCount(type: string, scope: EventScope = 'global'): number {
    const fullType = `${scope}:${type}`;
    const handlers = this.eventHandlers.get(fullType);
    return handlers ? handlers.size : 0;
  }
}

// 创建单例实例
const communicationService = new ComponentCommunication();

// React Hooks 封装
export const useCommunication = () => {
  return {
    /**
     * 发布事件
     */
    publish: (type: string, data?: any, source?: string, scope: EventScope = 'global') => {
      communicationService.publish(type, data, source, scope);
    },
    
    /**
     * 获取订阅函数，适用于React组件中
     */
    useSubscribe: (
      type: string,
      handler: EventHandler,
      scope: EventScope = 'global',
      deps: any[] = []
    ) => {
      // 这个函数会在实际使用时与React的useEffect结合使用
      // 返回订阅函数，由调用方负责在useEffect中调用和清理
      return () => communicationService.subscribe(type, handler, scope);
    }
  };
};

export default communicationService; 