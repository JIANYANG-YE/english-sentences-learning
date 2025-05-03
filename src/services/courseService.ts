/**
 * 课程相关服务
 */
import { get, post, put, del } from '@/lib/api';
import { Course, Lesson, PaginatedResponse, SearchParams } from '@/types';

/**
 * 转换对象为查询字符串
 */
function toQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });
  
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

/**
 * 获取课程列表
 */
export async function getCourses(params?: SearchParams): Promise<PaginatedResponse<Course>> {
  const queryString = params ? toQueryString(params) : '';
  return get<PaginatedResponse<Course>>(`/courses${queryString}`);
}

/**
 * 获取课程详情
 */
export async function getCourse(id: string): Promise<Course> {
  return get<Course>(`/courses/${id}`);
}

/**
 * 获取课程章节
 */
export async function getCourseLessons(courseId: string): Promise<Lesson[]> {
  return get<Lesson[]>(`/courses/${courseId}/lessons`);
}

/**
 * 获取章节详情
 */
export async function getLesson(lessonId: string): Promise<Lesson> {
  return get<Lesson>(`/lessons/${lessonId}`);
}

/**
 * 创建课程
 */
export async function createCourse(courseData: Partial<Course>): Promise<Course> {
  return post<Course>('/courses', courseData);
}

/**
 * 更新课程
 */
export async function updateCourse(id: string, courseData: Partial<Course>): Promise<Course> {
  return put<Course>(`/courses/${id}`, courseData);
}

/**
 * 删除课程
 */
export async function deleteCourse(id: string): Promise<void> {
  return del(`/courses/${id}`);
}

/**
 * 添加章节到课程
 */
export async function addLessonToCourse(courseId: string, lessonData: Partial<Lesson>): Promise<Lesson> {
  return post<Lesson>(`/courses/${courseId}/lessons`, lessonData);
}

/**
 * 获取推荐课程
 */
export async function getRecommendedCourses(limit: number = 3): Promise<Course[]> {
  return get<Course[]>(`/courses/recommended?limit=${limit}`);
}

/**
 * 获取热门课程
 */
export async function getPopularCourses(limit: number = 3): Promise<Course[]> {
  return get<Course[]>(`/courses/popular?limit=${limit}`);
}

/**
 * 搜索课程
 */
export async function searchCourses(query: string, params?: SearchParams): Promise<PaginatedResponse<Course>> {
  const searchParams = params ? { ...params, query } : { query };
  const queryString = toQueryString(searchParams);
  return get<PaginatedResponse<Course>>(`/courses/search${queryString}`);
}

/**
 * 获取用户已购课程
 */
export async function getUserCourses(): Promise<Course[]> {
  return get<Course[]>('/user/courses');
}

/**
 * 获取用户最近学习的课程
 */
export async function getRecentCourses(): Promise<Course[]> {
  return get<Course[]>('/user/courses/recent');
} 