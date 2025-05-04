/**
 * 课程相关服务
 */
import { get, post, put, del } from '@/lib/api';
import { Course as CourseType, Lesson as LessonType, PaginatedResponse, SearchParams } from '@/types';
import { prisma } from '@/lib/prisma';
import type { Course, Lesson, Section, User, UserCourseAccess } from '@/types/prisma';

/**
 * 转换对象为查询字符串
 */
function toQueryString(params: Record<string, any>): string {
  return '?' + Object.entries(params)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');
}

/**
 * 获取课程列表
 */
export async function getCourses(params?: SearchParams): Promise<PaginatedResponse<CourseType>> {
  const queryString = params ? toQueryString(params) : '';
  return get<PaginatedResponse<CourseType>>(`/courses${queryString}`);
}

/**
 * 获取课程详情
 */
export async function getCourse(id: string): Promise<CourseType> {
  return get<CourseType>(`/courses/${id}`);
}

/**
 * 获取课程章节
 */
export async function getCourseLessons(courseId: string): Promise<LessonType[]> {
  return get<LessonType[]>(`/courses/${courseId}/lessons`);
}

/**
 * 获取章节详情
 */
export async function getLesson(lessonId: string): Promise<LessonType> {
  return get<LessonType>(`/lessons/${lessonId}`);
}

/**
 * 创建课程
 */
export async function createCourse(courseData: Partial<CourseType>): Promise<CourseType> {
  return post<CourseType>('/courses', courseData);
}

/**
 * 更新课程
 */
export async function updateCourse(id: string, courseData: Partial<CourseType>): Promise<CourseType> {
  return put<CourseType>(`/courses/${id}`, courseData);
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
export async function addLessonToCourse(courseId: string, lessonData: Partial<LessonType>): Promise<LessonType> {
  return post<LessonType>(`/courses/${courseId}/lessons`, lessonData);
}

/**
 * 获取推荐课程
 */
export async function getRecommendedCourses(limit: number = 3): Promise<CourseType[]> {
  return get<CourseType[]>(`/courses/recommended?limit=${limit}`);
}

/**
 * 获取热门课程
 */
export async function getPopularCourses(limit: number = 3): Promise<CourseType[]> {
  return get<CourseType[]>(`/courses/popular?limit=${limit}`);
}

/**
 * 搜索课程
 */
export async function searchCourses(query: string, params?: SearchParams): Promise<PaginatedResponse<CourseType>> {
  const searchParams = params ? { ...params, query } : { query };
  const queryString = toQueryString(searchParams);
  return get<PaginatedResponse<CourseType>>(`/courses/search${queryString}`);
}

/**
 * 获取用户已购课程
 */
export async function getUserCourses(): Promise<CourseType[]> {
  return get<CourseType[]>('/user/courses');
}

/**
 * 获取用户最近学习的课程
 */
export async function getRecentCourses(): Promise<CourseType[]> {
  return get<CourseType[]>('/user/courses/recent');
}

export interface CreateCourseData {
  title: string;
  description: string;
  level: string;
  category: string;
  tags?: string; // JSON字符串
  coverImage?: string;
  price?: number;
  isFree?: boolean;
  requiresMembership?: boolean;
  authorId: string;
}

export interface UpdateCourseData {
  title?: string;
  description?: string;
  coverImage?: string;
  level?: string;
  category?: string;
  tags?: string[];
  price?: number;
  isFree?: boolean;
  requiresMembership?: boolean;
  publishStatus?: string;
}

export interface CreateSectionData {
  title: string;
  description?: string;
  order: number;
  courseId: string;
}

export interface CreateLessonData {
  title: string;
  subtitle?: string;
  description?: string;
  content: string; // JSON内容
  order: number;
  duration?: number;
  videoUrl?: string;
  audioUrl?: string;
  coverImage?: string;
  courseId: string;
  sectionId?: string;
}

export interface CourseWithDetails extends CourseType {
  sections: Section[];
  lessons: LessonType[];
  author?: User;
}

/**
 * 课程服务
 * 提供课程相关的CRUD操作
 */
export class CourseService {
  /**
   * 创建新课程
   */
  async createCourse(data: CreateCourseData): Promise<Course> {
    return prisma.course.create({
      data: {
        ...data,
        tags: data.tags || JSON.stringify([]),
        isFree: data.isFree || false,
        requiresMembership: data.requiresMembership || false,
        publishStatus: 'draft'
      }
    });
  }
  
  /**
   * 获取所有已发布课程
   */
  async getAllPublishedCourses() {
    return prisma.course.findMany({
      where: {
        publishStatus: 'published'
      },
      include: {
        sections: {
          orderBy: {
            order: 'asc'
          }
        },
        lessons: {
          orderBy: {
            order: 'asc'
          },
          take: 5 // 仅获取前5个课时作为预览
        }
      }
    });
  }
  
  /**
   * 根据ID获取课程
   */
  async getCourseById(id: string): Promise<CourseWithDetails | null> {
    return prisma.course.findUnique({
      where: { id },
      include: {
        sections: {
          orderBy: {
            order: 'asc'
          }
        },
        lessons: {
          orderBy: {
            order: 'asc'
          }
        }
      }
    });
  }
  
  /**
   * 获取用户有权访问的课程
   */
  async getAccessibleCourses(userId: string) {
    // 获取用户信息
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        membership: true
      }
    });
    
    if (!user) {
      throw new Error('用户不存在');
    }
    
    const isMember = user.membership && user.membership.status === 'active';
    
    // 构建查询条件
    const whereClause: any = {
      OR: [
        { isFree: true }, // 免费课程
      ]
    };
    
    // 如果是会员，添加会员专属课程
    if (isMember) {
      whereClause.OR.push({ requiresMembership: true });
    }
    
    // 查询用户购买的课程
    const userCourseAccess = await prisma.userCourseAccess.findMany({
      where: { userId }
    });
    
    const purchasedCourseIds = userCourseAccess.map((access: { courseId: string }) => access.courseId);
    
    if (purchasedCourseIds.length > 0) {
      whereClause.OR.push({ id: { in: purchasedCourseIds } });
    }
    
    // 查询符合条件的已发布课程
    return prisma.course.findMany({
      where: {
        AND: [
          { publishStatus: 'published' },
          whereClause
        ]
      },
      include: {
        sections: {
          orderBy: {
            order: 'asc'
          }
        },
        lessons: {
          orderBy: {
            order: 'asc'
          }
        }
      }
    });
  }
  
  /**
   * 更新课程信息
   */
  async updateCourse(id: string, data: UpdateCourseData): Promise<CourseType> {
    return prisma.course.update({
      where: { id },
      data
    });
  }
  
  /**
   * 发布课程
   */
  async publishCourse(id: string): Promise<CourseType> {
    return prisma.course.update({
      where: { id },
      data: {
        publishStatus: 'published'
      }
    });
  }
  
  /**
   * 取消发布课程
   */
  async unpublishCourse(id: string): Promise<CourseType> {
    return prisma.course.update({
      where: { id },
      data: {
        publishStatus: 'draft'
      }
    });
  }
  
  /**
   * 删除课程
   */
  async deleteCourse(id: string): Promise<void> {
    await prisma.course.delete({
      where: { id }
    });
  }
  
  /**
   * 创建课程小节
   */
  async createSection(data: CreateSectionData): Promise<Section> {
    return prisma.section.create({
      data
    });
  }
  
  /**
   * 创建课时
   */
  async createLesson(data: CreateLessonData): Promise<LessonType> {
    const lesson = await prisma.lesson.create({
      data
    });
    
    // 更新课程的总课时数
    await prisma.course.update({
      where: { id: data.courseId },
      data: {
        totalLessons: {
          increment: 1
        }
      }
    });
    
    return lesson;
  }
  
  /**
   * 获取课时及其句子
   */
  async getLessonWithSentences(lessonId: string) {
    return prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        sentences: {
          orderBy: {
            order: 'asc'
          }
        }
      }
    });
  }
  
  /**
   * 添加句子到课时
   */
  async addSentenceToLesson(lessonId: string, sentenceData: any) {
    return prisma.sentence.create({
      data: {
        ...sentenceData,
        lessonId
      }
    });
  }
} 