/**
 * 数据库部署脚本
 * 用于生产环境部署时初始化数据库
 * 执行方法：node scripts/deploy-db.js
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('开始部署数据库...');

  try {
    // 1. 创建管理员用户
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    console.log('创建管理员用户...');
    const admin = await prisma.user.upsert({
      where: { email: adminEmail },
      update: {},
      create: {
        email: adminEmail,
        name: '管理员',
        password: hashedPassword,
        role: 'admin'
      }
    });

    console.log(`管理员用户创建成功: ${admin.id}`);

    // 2. 创建用户配置文件
    console.log('创建管理员配置文件...');
    await prisma.userProfile.upsert({
      where: { userId: admin.id },
      update: {},
      create: {
        userId: admin.id,
        name: '管理员',
        learningLevel: 'advanced',
        preferredLearningStyle: 'visual',
        learningGoals: JSON.stringify(['系统管理', '内容创建'])
      }
    });

    // 3. 创建示例课程
    console.log('创建示例课程...');
    const beginnerCourse = await prisma.course.upsert({
      where: { id: 'course-beginner' },
      update: {},
      create: {
        id: 'course-beginner',
        title: '英语基础入门',
        description: '适合零基础学习者的英语入门课程，从字母和发音开始，循序渐进地学习基本词汇和简单句型。',
        level: 'beginner',
        category: '基础课程',
        tags: JSON.stringify(['入门', '基础', '零基础']),
        coverImage: '/globe.svg',
        isFree: true,
        isFeatured: true,
        totalLessons: 3,
        publishStatus: 'published',
        authorId: admin.id
      }
    });

    // 4. 创建示例课程小节
    console.log('创建示例课程小节...');
    const section1 = await prisma.section.upsert({
      where: { id: 'section-1' },
      update: {},
      create: {
        id: 'section-1',
        title: '基础发音',
        description: '学习英语基本发音规则',
        order: 1,
        courseId: beginnerCourse.id
      }
    });

    // 5. 创建示例课时
    console.log('创建示例课时...');
    const lesson1 = await prisma.lesson.upsert({
      where: { id: 'lesson-1' },
      update: {},
      create: {
        id: 'lesson-1',
        title: '英语字母与发音',
        subtitle: '学习26个英文字母的发音',
        description: '本课时将介绍英语字母表及其发音规则，帮助你打下良好的发音基础。',
        content: JSON.stringify({
          introduction: '英语字母是学习英语的基础，掌握正确的发音对学习英语至关重要。',
          sections: [
            {
              title: '英语字母表',
              content: '英语字母表由26个字母组成，包括元音字母(a, e, i, o, u)和辅音字母。'
            },
            {
              title: '元音发音',
              content: '元音字母在不同单词中有不同的发音方式。'
            }
          ]
        }),
        order: 1,
        duration: 30,
        courseId: beginnerCourse.id,
        sectionId: section1.id
      }
    });

    // 6. 创建示例句子
    console.log('创建示例句子...');
    await prisma.sentence.createMany({
      skipDuplicates: true,
      data: [
        {
          english: 'Hello, how are you?',
          chinese: '你好，你好吗？',
          lessonId: lesson1.id,
          order: 1,
          difficulty: 1,
          keywords: JSON.stringify(['hello', 'how', 'you']),
          grammarPoints: JSON.stringify(['简单问候语', '疑问句']),
          tags: JSON.stringify(['greetings', 'beginner'])
        },
        {
          english: 'My name is John. Nice to meet you.',
          chinese: '我的名字是约翰。很高兴认识你。',
          lessonId: lesson1.id,
          order: 2,
          difficulty: 1,
          keywords: JSON.stringify(['name', 'nice', 'meet']),
          grammarPoints: JSON.stringify(['自我介绍', '陈述句']),
          tags: JSON.stringify(['introduction', 'beginner'])
        },
        {
          english: 'I am a student. I study English.',
          chinese: '我是一名学生。我学习英语。',
          lessonId: lesson1.id,
          order: 3,
          difficulty: 2,
          keywords: JSON.stringify(['student', 'study', 'English']),
          grammarPoints: JSON.stringify(['简单现在时', '主语-谓语一致']),
          tags: JSON.stringify(['identity', 'beginner'])
        }
      ]
    });

    console.log('数据库部署完成！');
  } catch (error) {
    console.error('数据库部署失败:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 