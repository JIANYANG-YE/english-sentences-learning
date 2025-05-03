import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { MaterialType } from '@/types/materials';

// 验证请求体的schema
const presignRequestSchema = z.object({
  fileName: z.string().min(1, "文件名不能为空"),
  fileType: z.string().min(1, "文件类型不能为空"),
  fileSize: z.number().positive("文件大小必须大于0"),
  type: z.nativeEnum(MaterialType, {
    errorMap: () => ({ message: "无效的材料类型" })
  }),
  metadata: z.record(z.any()).optional(),
});

// 模拟创建预签名URL的函数
const createPresignedUrl = async (fileName: string, fileType: string, materialId: string) => {
  // 在实际项目中，这里应该调用云存储服务的SDK来生成预签名URL
  // 例如 AWS S3, Google Cloud Storage, 或阿里云OSS
  
  // 确保文件名安全
  const safeFileName = encodeURIComponent(fileName.replace(/[^a-zA-Z0-9.-]/g, '_'));
  
  // 为模拟目的，我们生成一个假的预签名URL
  const url = `https://storage.example.com/upload/${materialId}/${safeFileName}`;
  
  // 返回预签名URL
  return {
    url,
    materialId,
    fields: {
      'key': `uploads/${materialId}/${safeFileName}`,
      'Content-Type': fileType,
      'x-amz-algorithm': 'AWS4-HMAC-SHA256',
      'x-amz-credential': 'EXAMPLE-CREDENTIAL',
      'x-amz-date': new Date().toISOString().split('T')[0].replace(/-/g, ''),
      'policy': 'EXAMPLE-POLICY',
      'x-amz-signature': 'EXAMPLE-SIGNATURE',
    },
    expires: 3600  // URL有效期，单位秒
  };
};

// 验证文件类型是否允许上传
const isAllowedFileType = (fileType: string, materialType: MaterialType): boolean => {
  const allowedTypes: Record<MaterialType, string[]> = {
    [MaterialType.DOCUMENT]: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'],
    [MaterialType.VIDEO]: ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo'],
    [MaterialType.AUDIO]: ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/webm'],
    [MaterialType.IMAGE]: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
    [MaterialType.PDF]: ['application/pdf'],
    [MaterialType.TEXT]: ['text/plain', 'text/html', 'text/markdown'],
    [MaterialType.SUBTITLE]: ['text/vtt', 'application/x-subrip', 'text/plain'],
    [MaterialType.OTHER]: ['*/*'], // 允许任何类型，但在实际使用时应该被更严格地限制
  };

  if (!allowedTypes[materialType]) {
    return false;
  }

  // 如果materialType是OTHER，或者fileType在允许列表中
  return materialType === MaterialType.OTHER || allowedTypes[materialType].some(type => {
    if (type === '*/*') return true;
    if (type.endsWith('/*') && fileType.startsWith(type.slice(0, -2))) return true;
    return type === fileType;
  });
};

// 检查文件大小
const isAllowedFileSize = (fileSize: number): boolean => {
  // 限制文件大小为500MB
  const MAX_FILE_SIZE = 500 * 1024 * 1024;
  return fileSize > 0 && fileSize <= MAX_FILE_SIZE;
};

export async function POST(request: NextRequest) {
  try {
    // 1. 解析请求体
    const body = await request.json();
    
    // 2. 验证请求参数
    const validation = presignRequestSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: '无效的请求参数', details: validation.error.format() },
        { status: 400 }
      );
    }

    const { fileName, fileType, fileSize, type, metadata } = validation.data;
    
    // 3. 验证文件类型
    if (!isAllowedFileType(fileType, type)) {
      return NextResponse.json(
        { error: '不支持的文件类型' },
        { status: 400 }
      );
    }
    
    // 4. 验证文件大小
    if (!isAllowedFileSize(fileSize)) {
      return NextResponse.json(
        { error: '文件大小超出限制' },
        { status: 400 }
      );
    }
    
    // 5. 生成材料ID
    const materialId = uuidv4();
    
    // 6. 创建预签名URL
    const presignedUrl = await createPresignedUrl(fileName, fileType, materialId);
    
    // 7. 在数据库中创建材料记录（这里省略，实际项目中需要实现）
    
    // 8. 返回预签名URL
    return NextResponse.json(presignedUrl);
    
  } catch (error) {
    console.error('生成预签名URL错误:', error);
    return NextResponse.json(
      { error: '处理请求时发生错误' },
      { status: 500 }
    );
  }
} 