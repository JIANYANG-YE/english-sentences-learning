import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { CoursePackageMetadata } from '@/types/courses/packageTypes';

// 模拟课程包数据
const mockPackages: CoursePackageMetadata[] = [
  {
    version: '1.0.0',
    createdAt: new Date().toISOString(),
    packageId: 'pkg-001',
    courseCount: 3,
    totalLessons: 25,
    totalContentBlocks: 120,
    totalSentencePairs: 350,
    format: 'standard',
    compression: 'none',
    encryption: false,
    checksum: '8f7d56a9c5e145b3a7f8c76d3fd3bce3',
  },
  {
    version: '1.0.0',
    createdAt: new Date().toISOString(),
    packageId: 'pkg-002',
    courseCount: 5,
    totalLessons: 42,
    totalContentBlocks: 210,
    totalSentencePairs: 620,
    format: 'standard',
    compression: 'gzip',
    encryption: true,
    checksum: '3a2b1c0d9e8f7g6h5i4j3k2l1m0n9o8p',
  },
];

// 查询参数验证
const querySchema = z.object({
  limit: z.string().optional().transform(val => (val ? parseInt(val, 10) : 10)),
  offset: z.string().optional().transform(val => (val ? parseInt(val, 10) : 0)),
  format: z.string().optional(),
});

/**
 * GET /api/courses/packages
 * 获取课程包列表
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // 验证查询参数
    const parsedQuery = querySchema.safeParse(Object.fromEntries(searchParams.entries()));
    
    if (!parsedQuery.success) {
      return NextResponse.json(
        { error: '无效的查询参数', details: parsedQuery.error.format() },
        { status: 400 }
      );
    }
    
    const { limit, offset, format } = parsedQuery.data;
    
    // 过滤课程包
    let filteredPackages = [...mockPackages];
    
    if (format) {
      filteredPackages = filteredPackages.filter(pkg => pkg.format === format);
    }
    
    // 分页
    const paginatedPackages = filteredPackages.slice(offset, offset + limit);
    
    return NextResponse.json({
      packages: paginatedPackages,
      total: filteredPackages.length,
      limit,
      offset
    });
  } catch (error) {
    console.error('获取课程包列表失败:', error);
    return NextResponse.json(
      { error: '获取课程包列表失败', details: (error as Error).message },
      { status: 500 }
    );
  }
} 