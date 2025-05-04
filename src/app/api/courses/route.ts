import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // 分页参数
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 10;
    const offset = (page - 1) * limit;
    
    // 过滤参数
    const category = searchParams.get('category');
    const level = searchParams.get('level');
    const isFree = searchParams.get('isFree') === 'true';
    const featured = searchParams.get('featured') === 'true';
    const search = searchParams.get('search');
    
    // 构建过滤条件
    const where: any = {
      publishStatus: 'published'
    };
    
    if (category) {
      where.category = category;
    }
    
    if (level) {
      where.level = level;
    }
    
    if (searchParams.has('isFree')) {
      where.isFree = isFree;
    }
    
    if (featured) {
      where.isFeatured = featured;
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } }
      ];
    }
    
    // 获取总记录数
    const total = await prisma.course.count({ where });
    
    // 获取课程数据
    const courses = await prisma.course.findMany({
      where,
      include: {
        sections: {
          select: {
            id: true,
            title: true,
            order: true
          },
          orderBy: {
            order: 'asc'
          }
        },
        lessons: {
          select: {
            id: true,
            title: true,
            subtitle: true,
            order: true,
            duration: true
          },
          take: 3,
          orderBy: {
            order: 'asc'
          }
        }
      },
      orderBy: featured 
        ? { isFeatured: 'desc' } 
        : { createdAt: 'desc' },
      skip: offset,
      take: limit
    });
    
    // 计算分页信息
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;
    
    return NextResponse.json({
      courses,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext,
        hasPrev
      }
    });
    
  } catch (error) {
    console.error('获取课程列表失败:', error);
    return NextResponse.json(
      { error: '获取课程列表失败' },
      { status: 500 }
    );
  }
} 