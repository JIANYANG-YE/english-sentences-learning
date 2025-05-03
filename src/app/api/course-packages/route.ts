import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * 获取课程包列表
 * GET /api/course-packages?type=free|member
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') || 'all';
    
    // 查询条件
    const whereClause: any = {
      publishStatus: 'published',
    };
    
    // 根据类型筛选
    if (type === 'free') {
      whereClause.isFree = true;
      whereClause.requiresMembership = false;
    } else if (type === 'member') {
      whereClause.requiresMembership = true;
    }

    // 查询课程包
    const coursePackages = await prisma.coursePackage.findMany({
      where: whereClause,
      include: {
        courses: {
          select: {
            id: true,
            title: true,
            description: true,
            coverImage: true,
            totalLessons: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // 如果用户已登录，添加用户访问信息
    if (session?.user) {
      const userId = session.user.id;
      
      // 查询用户当前的会员状态
      const userMembership = await prisma.membership.findUnique({
        where: { userId },
        select: { type: true, status: true, endDate: true },
      });
      
      const hasMembership = userMembership?.status === 'active' && 
        (userMembership.type === 'premium' || userMembership.type === 'basic') &&
        (!userMembership.endDate || new Date(userMembership.endDate) > new Date());
      
      // 获取用户已访问的课程包
      const userAccesses = await prisma.userCourseAccess.findMany({
        where: { 
          userId,
          isActive: true,
          packageId: { not: null },
        },
        select: { packageId: true },
      });
      
      const accessiblePackageIds = userAccesses.map(access => access.packageId);
      
      // 为每个课程包添加用户访问信息
      const packagesWithAccess = coursePackages.map(pkg => ({
        ...pkg,
        hasAccess: pkg.isFree || accessiblePackageIds.includes(pkg.id) || 
          (pkg.requiresMembership && hasMembership),
      }));
      
      return NextResponse.json(packagesWithAccess);
    }
    
    // 未登录用户只能看到访问状态
    const packagesWithAccess = coursePackages.map(pkg => ({
      ...pkg,
      hasAccess: pkg.isFree,
    }));
    
    return NextResponse.json(packagesWithAccess);
  } catch (error) {
    console.error('获取课程包失败:', error);
    return new NextResponse('服务器错误', { status: 500 });
  }
}

/**
 * 创建新课程包
 * POST /api/course-packages
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // 验证用户权限
    if (!session?.user || !['admin', 'teacher'].includes(session.user.role)) {
      return new NextResponse('无权限访问', { status: 403 });
    }

    const data = await request.json();
    
    // 基本验证
    if (!data.title || !data.description) {
      return new NextResponse('缺少必要字段', { status: 400 });
    }

    // 创建课程包
    const coursePackage = await prisma.coursePackage.create({
      data: {
        title: data.title,
        description: data.description,
        coverImage: data.coverImage,
        price: data.price,
        isFree: data.isFree !== undefined ? data.isFree : false,
        requiresMembership: data.requiresMembership !== undefined ? data.requiresMembership : false,
        level: data.level,
        publishStatus: data.publishStatus || 'draft',
      },
    });

    // 如果提供了课程ID，将它们关联到课程包
    if (data.courseIds && Array.isArray(data.courseIds) && data.courseIds.length > 0) {
      await prisma.course.updateMany({
        where: {
          id: {
            in: data.courseIds,
          },
        },
        data: {
          packageId: coursePackage.id,
        },
      });
    }

    return NextResponse.json({ id: coursePackage.id, success: true });
  } catch (error) {
    console.error('创建课程包失败:', error);
    return new NextResponse('服务器错误', { status: 500 });
  }
} 