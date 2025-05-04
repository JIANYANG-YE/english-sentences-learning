import { prisma } from '@/lib/prisma';
import { User } from '@prisma/client';
import bcrypt from 'bcryptjs';

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
  image?: string;
}

export interface UserWithoutPassword {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 用户服务
 * 提供用户相关的 CRUD 操作
 */
export class UserService {
  /**
   * 创建新用户
   */
  async createUser(data: CreateUserData): Promise<UserWithoutPassword> {
    const { name, email, password, role = 'user' } = data;
    
    // 检查邮箱是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      throw new Error('用户邮箱已存在');
    }
    
    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // 创建用户
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role
      }
    });
    
    // 创建用户配置
    await prisma.userProfile.create({
      data: {
        userId: user.id,
        name: name || '',
        learningLevel: 'beginner',
        preferredLearningStyle: 'visual',
        learningGoals: ['提高口语', '扩大词汇量']
      }
    });
    
    // 创建免费会员资格
    await prisma.membership.create({
      data: {
        userId: user.id,
        type: 'free',
        status: 'active',
        startDate: new Date(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 一年后结束
      }
    });
    
    // 返回不包含密码的用户信息
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  
  /**
   * 通过ID查找用户
   */
  async findUserById(id: string): Promise<UserWithoutPassword | null> {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
        membership: true
      }
    });
    
    if (!user) return null;
    
    // 排除密码
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  
  /**
   * 通过邮箱查找用户
   */
  async findUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email }
    });
  }
  
  /**
   * 验证用户凭证
   */
  async validateCredentials(email: string, password: string): Promise<UserWithoutPassword | null> {
    const user = await this.findUserByEmail(email);
    
    if (!user) return null;
    
    const isValidPassword = await bcrypt.compare(password, user.password || '');
    
    if (!isValidPassword) return null;
    
    // 排除密码
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  
  /**
   * 更新用户信息
   */
  async updateUser(id: string, data: UpdateUserData): Promise<UserWithoutPassword> {
    let updateData = { ...data };
    
    // 如果提供了新密码，则加密
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }
    
    const user = await prisma.user.update({
      where: { id },
      data: updateData
    });
    
    // 排除密码
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  
  /**
   * 删除用户
   */
  async deleteUser(id: string): Promise<void> {
    await prisma.user.delete({
      where: { id }
    });
  }
  
  /**
   * 获取用户学习进度
   */
  async getUserLearningProgress(userId: string) {
    return prisma.userLearningProgress.findMany({
      where: { userId },
      include: {
        lesson: true
      }
    });
  }
  
  /**
   * 获取用户已注册的课程
   */
  async getUserCourses(userId: string) {
    return prisma.userCourse.findMany({
      where: { userId },
      include: {
        course: {
          include: {
            lessons: {
              select: {
                id: true,
                title: true,
                order: true
              }
            }
          }
        }
      }
    });
  }
} 