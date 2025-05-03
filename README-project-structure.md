# 英语学习平台 - 项目结构文档

本文档详细描述了英语学习平台的项目结构，包括目录组织、主要文件和功能模块。

## 项目概述

该项目是一个基于Next.js框架开发的英语学习平台，采用TypeScript作为主要开发语言，提供了多种英语学习模式和功能。

## 目录结构

项目的主要目录结构如下：

```
english-sentences-learning/
├── src/                       # 源代码目录
│   ├── app/                   # Next.js应用程序路由
│   ├── components/            # React组件
│   ├── contexts/              # React上下文组件
│   ├── hooks/                 # 自定义React钩子
│   ├── lib/                   # 公共库和辅助函数
│   ├── services/              # 服务接口与实现
│   ├── styles/                # 样式文件
│   ├── types/                 # TypeScript类型定义
│   ├── utils/                 # 工具函数
│   ├── api/                   # API接口声明
│   └── data/                  # 模拟数据
├── public/                    # 静态资源
├── scripts/                   # 构建和开发脚本
└── .next/                     # Next.js编译输出
```

## 核心目录详解

### 1. `src/app/` - 应用程序路由

采用Next.js 13的App Router结构，每个文件夹对应一个路由，包含以下主要路由：

- `(auth)/` - 认证相关页面（登录、注册）
- `(dashboard)/` - 用户仪表板布局和组件
- `(public)/` - 公共页面
- `api/` - API路由
  - `courses/` - 课程相关API
  - `lessons/` - 课时相关API
  - `user/` - 用户相关API
- `courses/[id]/lessons/[lessonId]/` - 课程学习页面
  - `chinese-to-english/` - 中译英模式
  - `english-to-chinese/` - 英译中模式
  - `grammar/` - 语法模式
  - `listening/` - 听力模式
  - `notes/` - 笔记模式

### 2. `src/components/` - React组件

组件目录包含了所有可复用的React组件：

- `learning/` - 学习相关组件
  - `modes/` - 学习模式组件
    - `ChineseToEnglishMode.tsx` - 中译英模式
    - `EnglishToChineseMode.tsx` - 英译中模式
    - `GrammarMode.tsx` - 语法模式
    - `ListeningMode.tsx` - 听力模式
    - `NotesMode.tsx` - 笔记模式
  - `ModeNavigation.tsx` - 模式导航组件
  - `ProgressTracker.tsx` - 学习进度跟踪
- `ui/` - 通用UI组件
- `common/` - 通用功能组件
- `layout/` - 布局组件
- `grammar/` - 语法相关组件

### 3. `src/contexts/` - React上下文

管理全局状态的上下文组件：

- `AuthContext.tsx` - 认证状态管理
- `ThemeContext.tsx` - 主题设置管理
- `ToastContext.tsx` - 通知提示管理
- `LoadingContext.tsx` - 加载状态管理
- `AppProviders.tsx` - 上下文提供者组合

### 4. `src/types/` - TypeScript类型定义

定义了项目中使用的所有类型：

- `courses/` - 课程相关类型
  - `index.ts` - 主要课程类型定义
  - `contentTypes.ts` - 内容类型定义
  - `courseTypes.ts` - 课程结构类型
  - `packageTypes.ts` - 课程包类型
- `learning/` - 学习相关类型
- `user/` - 用户相关类型
- `auth/` - 认证相关类型
- `hooks.ts` - 钩子相关类型
- `utils.ts` - 工具相关类型
- `components.ts` - 组件相关类型

### 5. `src/lib/` - 公共库

包含核心功能实现和辅助函数：

- `api-client.ts` - API请求客户端
- `api.ts` - API接口定义
- `auth.ts` - 认证相关函数
- `constants.ts` - 常量定义
- `helpers.ts` - 辅助函数
- `utils.ts` - 通用工具函数
- `web-vitals.ts` - Web性能指标
- `modeAdapters.ts` - 学习模式适配器
- `progressTracker.ts` - 学习进度追踪实现

### 6. `src/services/` - 服务接口

服务层实现了与外部系统的交互：

- `courseService.ts` - 课程服务
- `authService.ts` - 认证服务
- `coursePackageService.ts` - 课程包服务
- `errorService.ts` - 错误处理服务
- `logService.ts` - 日志服务

## 学习模式实现

学习模式是平台的核心功能，包括：

1. **中译英模式**: 展示中文句子，用户输入英文翻译
2. **英译中模式**: 展示英文句子，用户输入中文翻译
3. **语法模式**: 分析句子语法结构
4. **听力模式**: 听音频，输入相应内容
5. **笔记模式**: 为学习内容添加笔记

详细说明请参见 [学习模式指南](./README-learning-modes.md)。

## 课程内容管理

课程内容管理功能包括：

1. **课程包导入/导出**: 支持JSON和ZIP格式
2. **课程内容适配**: 不同学习模式的内容转换
3. **句子对齐**: 中英文句子自动对齐

详细说明请参见 [课程管理指南](./README-course-management.md)。

## 配置文件

项目包含以下主要配置文件：

- `package.json` - 项目依赖和脚本
- `tsconfig.json` - TypeScript配置
- `next.config.mjs` - Next.js配置
- `.eslintrc.json` - ESLint配置
- `.prettierrc` - Prettier配置
- `tailwind.config.js` - Tailwind CSS配置
- `postcss.config.js` - PostCSS配置

## 改进和优化

在项目优化过程中，我们已完成以下改进：

1. **类型定义统一**: 解决了重复的类型定义，确保类型一致性
2. **学习模式完善**: 实现了所有五种学习模式的组件
3. **目录结构优化**: 按功能模块组织代码，提高可维护性
4. **配置更新**: 更新ESLint配置以兼容最新TypeScript版本
5. **类型安全提升**: 减少了any类型的使用

## 未来计划

项目计划的未来改进方向：

1. **清理未使用的变量和导入**: 解决linter检测到的未使用变量
2. **替换any类型**: 为代码中的any类型提供具体类型
3. **修复React警告**: 解决React相关的警告
4. **优化图片处理**: 使用Next.js的Image组件替代img标签
5. **完善错误处理**: 增强错误捕获和处理机制 