import axios from 'axios';
import { Course, LearningMetric, LearningMilestone } from '../types/progressTypes';

/**
 * 获取用户的学习进度数据
 * @param userId 用户ID
 * @returns 包含课程、学习指标和里程碑的完整学习进度数据
 */
export const getUserProgressData = async (userId: string) => {
  try {
    const response = await axios.get(`/api/learning-progress/${userId}`);
    return response.data;
  } catch (error) {
    console.error('获取学习进度数据失败:', error);
    throw error;
  }
};

/**
 * 获取用户的课程进度列表
 * @param userId 用户ID
 * @returns 用户正在学习的课程列表及进度信息
 */
export const getUserCourses = async (userId: string): Promise<Course[]> => {
  try {
    const response = await axios.get(`/api/learning-progress/${userId}/courses`);
    return response.data;
  } catch (error) {
    console.error('获取用户课程进度失败:', error);
    throw error;
  }
};

/**
 * 获取单个课程的详细进度信息
 * @param userId 用户ID
 * @param courseId 课程ID
 * @returns 特定课程的详细进度信息，包括模块和学习单元
 */
export const getCourseProgress = async (userId: string, courseId: string): Promise<Course> => {
  try {
    const response = await axios.get(`/api/learning-progress/${userId}/courses/${courseId}`);
    return response.data;
  } catch (error) {
    console.error('获取课程详细进度失败:', error);
    throw error;
  }
};

/**
 * 获取用户的学习指标数据
 * @param userId 用户ID
 * @param timeRange 时间范围，例如'week', 'month', 'year'
 * @returns 用户的学习指标数据
 */
export const getLearningMetrics = async (
  userId: string, 
  timeRange: 'week' | 'month' | 'year' = 'week'
): Promise<LearningMetric[]> => {
  try {
    const response = await axios.get(`/api/learning-progress/${userId}/metrics`, {
      params: { timeRange }
    });
    return response.data;
  } catch (error) {
    console.error('获取学习指标数据失败:', error);
    throw error;
  }
};

/**
 * 获取用户的学习里程碑
 * @param userId 用户ID
 * @param includeCompleted 是否包含已完成的里程碑
 * @returns 用户的学习里程碑列表
 */
export const getLearningMilestones = async (
  userId: string,
  includeCompleted: boolean = true
): Promise<LearningMilestone[]> => {
  try {
    const response = await axios.get(`/api/learning-progress/${userId}/milestones`, {
      params: { includeCompleted }
    });
    return response.data;
  } catch (error) {
    console.error('获取学习里程碑数据失败:', error);
    throw error;
  }
};

/**
 * 更新学习单元的进度
 * @param userId 用户ID
 * @param courseId 课程ID
 * @param moduleId 模块ID
 * @param unitId 学习单元ID
 * @param progress 进度百分比
 * @param score 可选得分
 * @returns 更新后的学习单元信息
 */
export const updateUnitProgress = async (
  userId: string,
  courseId: string,
  moduleId: string,
  unitId: string,
  progress: number,
  score?: number
) => {
  try {
    const response = await axios.post(`/api/learning-progress/${userId}/update-progress`, {
      courseId,
      moduleId,
      unitId,
      progress,
      score,
      completed: progress === 100,
      date: new Date().toISOString().split('T')[0]
    });
    return response.data;
  } catch (error) {
    console.error('更新学习进度失败:', error);
    throw error;
  }
};

/**
 * 获取学习统计数据
 * @param userId 用户ID
 * @param startDate 开始日期
 * @param endDate 结束日期
 * @returns 指定时间范围内的学习统计数据
 */
export const getLearningStatistics = async (
  userId: string,
  startDate: string,
  endDate: string
) => {
  try {
    const response = await axios.get(`/api/learning-progress/${userId}/statistics`, {
      params: { startDate, endDate }
    });
    return response.data;
  } catch (error) {
    console.error('获取学习统计数据失败:', error);
    throw error;
  }
};

/**
 * 生成学习进度报告
 * @param userId 用户ID
 * @param reportType 报告类型
 * @returns 生成的学习进度报告数据，可用于展示或下载
 */
export const generateProgressReport = async (
  userId: string,
  reportType: 'daily' | 'weekly' | 'monthly' = 'weekly'
) => {
  try {
    const response = await axios.get(`/api/learning-progress/${userId}/report`, {
      params: { reportType }
    });
    return response.data;
  } catch (error) {
    console.error('生成进度报告失败:', error);
    throw error;
  }
};

/**
 * 下载学习进度报告
 * @param userId 用户ID
 * @param format 报告格式
 * @param timeRange 时间范围
 */
export const downloadProgressReport = async (
  userId: string,
  format: 'pdf' | 'csv' | 'excel' = 'pdf',
  timeRange: 'week' | 'month' | 'year' = 'month'
) => {
  try {
    const response = await axios.get(`/api/learning-progress/${userId}/download-report`, {
      params: { format, timeRange },
      responseType: 'blob'
    });
    
    // 创建下载链接
    const blob = new Blob([response.data], { 
      type: format === 'pdf' ? 'application/pdf' : 
            format === 'csv' ? 'text/csv' : 
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `学习进度报告_${new Date().toISOString().split('T')[0]}.${format}`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    return true;
  } catch (error) {
    console.error('下载进度报告失败:', error);
    throw error;
  }
}; 