# 英语学习平台 - 课程内容管理系统

本文档介绍了英语学习平台的课程内容管理系统，包括类型定义、API接口和数据处理功能。

## 系统概述

课程内容管理系统支持多种课程类型（书籍、电影、教材等），并能将课程内容结构化为适合不同学习模式的格式。系统支持课程包的导入导出、句子对齐以及内容转换等功能。

## 主要功能

### 1. 多类型课程支持

系统支持以下类型的课程：

- 书籍（Book）
- 电影（Movie）
- 教材（Textbook）
- 文章（Article）
- 对话（Dialogue）
- 演讲（Speech）

每种类型都有特定的属性和元数据，例如书籍有作者、出版年份等信息，电影有导演、演员、上映年份等信息。

### 2. 结构化内容管理

系统将课程内容组织为结构化的数据：

- 课程（Course）：包含多个课时
- 课时（Lesson）：包含多个内容块
- 内容块（ContentBlock）：可以是段落、对话、标题等类型
- 句子对（SentencePair）：包含英文句子和对应的中文翻译

### 3. 内容适配多种学习模式

系统能够将相同的内容根据不同的学习模式进行处理，支持：

- 中译英模式
- 英译中模式
- 听力模式
- 语法分析模式
- 笔记模式

### 4. 课程包导入导出

系统支持课程包的导入和导出，方便不同用户之间共享和复用内容。导入导出功能支持：

- JSON和ZIP格式
- 选择性导入媒体文件
- 导入验证和错误处理
- 内容压缩和加密选项

### 5. 句子对齐工具

系统提供句子对齐工具，可以将英文文本和中文文本自动对齐，创建句子对。支持：

- 多种对齐方法（基于长度、语义等）
- 信心值评估
- 处理未匹配句子的多种策略

## API接口

### 课程包管理

- `GET /api/courses/packages`：获取课程包列表
- `POST /api/courses/import`：导入课程包
- `POST /api/courses/export`：导出课程包
- `POST /api/courses/transform/text`：从文本创建课程
- `POST /api/courses/transform/file`：从文件创建课程

### 内容处理

- `GET /api/lessons/[id]/content?mode=[mode]`：获取特定学习模式的课时内容
- `POST /api/courses/align`：对齐中英文句子
- `POST /api/lessons/[id]/generate-audio`：生成课时内容的音频

## 使用示例

### 导入课程包

```javascript
import { importCoursePackage } from '@/services/coursePackageService';

// 处理文件上传
const handleFileUpload = async (file) => {
  const options = {
    replaceExisting: false,
    importMedia: true,
    validateContent: true
  };
  
  try {
    const result = await importCoursePackage(file, options);
    console.log(`导入成功：${result.coursesImported} 个课程，${result.lessonsImported} 个课时`);
  } catch (error) {
    console.error('导入失败:', error);
  }
};
```

### 获取特定学习模式的内容

```javascript
import { getLessonContentForMode } from '@/services/coursePackageService';

// 获取中译英模式的内容
const fetchLessonContent = async (lessonId) => {
  try {
    const content = await getLessonContentForMode(lessonId, 'chinese-to-english');
    setLessonContent(content);
  } catch (error) {
    console.error('获取内容失败:', error);
  }
};
```

### 句子对齐

```javascript
import { alignSentences } from '@/services/coursePackageService';

// 对齐中英文文本
const handleTextAlignment = async (englishText, chineseText) => {
  try {
    const options = {
      method: 'hybrid',
      minConfidence: 0.7,
      fallbackStrategy: 'machine-translation'
    };
    
    const result = await alignSentences(englishText, chineseText, options);
    setSentencePairs(result.sentencePairs);
  } catch (error) {
    console.error('对齐失败:', error);
  }
};
```

## 开发者说明

### 1. 类型定义

课程类型和内容类型的定义位于：

- `src/types/courses/courseTypes.ts`：定义各种课程类型
- `src/types/courses/contentTypes.ts`：定义内容块和句子对
- `src/types/courses/packageTypes.ts`：定义课程包及导入导出相关类型

### 2. 内容处理

内容处理的核心逻辑位于：

- `src/lib/modeAdapters.ts`：将内容转换为适合不同学习模式的格式

### 3. API服务

API实现位于：

- `src/app/api/courses/*`：课程相关API
- `src/app/api/lessons/*`：课时内容相关API

### 4. 服务接口

服务接口位于：

- `src/services/coursePackageService.ts`：课程包相关服务接口
- `src/services/courseService.ts`：课程基本CRUD操作 