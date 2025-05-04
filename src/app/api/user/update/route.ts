import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTokenFromRequest } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function PUT(request: NextRequest) {
  try {
    // 验证用户身份
    const payload = await getTokenFromRequest(request);
    
    if (!payload) {
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      );
    }
    
    // 获取更新数据
    const body = await request.json();
    const { name, image, currentPassword, newPassword, ...profileData } = body;
    
    // 验证用户存在
    const user = await prisma.user.findUnique({
      where: { id: payload.id }
    });
    
    if (!user) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      );
    }
    
    // 准备用户更新数据
    const userUpdateData: any = {};
    
    // 如果提供了名称，则更新
    if (name !== undefined) {
      userUpdateData.name = name;
    }
    
    // 如果提供了头像，则更新
    if (image !== undefined) {
      userUpdateData.image = image;
    }
    
    // 如果要更新密码，先验证当前密码
    if (newPassword && currentPassword) {
      if (!user.password) {
        return NextResponse.json(
          { error: '无法更新密码，当前账号未设置密码' },
          { status: 400 }
        );
      }
      
      const isCurrentPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password
      );
      
      if (!isCurrentPasswordValid) {
        return NextResponse.json(
          { error: '当前密码不正确' },
          { status: 400 }
        );
      }
      
      // 密码长度验证
      if (newPassword.length < 6) {
        return NextResponse.json(
          { error: '新密码至少需要6个字符' },
          { status: 400 }
        );
      }
      
      // 更新密码
      userUpdateData.password = await bcrypt.hash(newPassword, 10);
    }
    
    // 更新用户基本信息
    if (Object.keys(userUpdateData).length > 0) {
      await prisma.user.update({
        where: { id: payload.id },
        data: userUpdateData
      });
    }
    
    // 如果提供了配置文件数据，则更新
    if (Object.keys(profileData).length > 0) {
      // 确保学习目标被正确格式化为JSON字符串
      if (profileData.learningGoals && Array.isArray(profileData.learningGoals)) {
        profileData.learningGoals = JSON.stringify(profileData.learningGoals);
      }
      
      // 检查用户配置文件是否存在
      const userProfile = await prisma.userProfile.findUnique({
        where: { userId: payload.id }
      });
      
      if (userProfile) {
        // 更新现有配置文件
        await prisma.userProfile.update({
          where: { userId: payload.id },
          data: profileData
        });
      } else {
        // 创建新配置文件
        await prisma.userProfile.create({
          data: {
            userId: payload.id,
            name: user.name || '用户',
            ...profileData
          }
        });
      }
    }
    
    // 获取更新后的用户数据
    const updatedUser = await prisma.user.findUnique({
      where: { id: payload.id },
      include: {
        profile: true
      }
    });
    
    if (!updatedUser) {
      return NextResponse.json(
        { error: '获取更新后的用户信息失败' },
        { status: 500 }
      );
    }
    
    // 排除敏感信息
    const { password: _, ...userWithoutPassword } = updatedUser;
    
    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      message: '用户信息更新成功'
    });
    
  } catch (error) {
    console.error('更新用户信息失败:', error);
    return NextResponse.json(
      { error: '更新用户信息失败' },
      { status: 500 }
    );
  }
} 