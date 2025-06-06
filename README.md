# 英语句子学习平台

一个现代化的英语学习平台，通过智能内容处理、个性化学习计划和数据分析，为用户提供高效的语言学习体验。

## 项目概述

本项目是一个专注于英语句子学习的平台，通过结构化的课程内容、多种学习模式和智能分析功能，帮助用户有效地提高英语能力。平台支持多种课程类型，包括书籍、电影、教材、文章、对话和演讲，能够根据不同学习模式（如中译英、英译中、听力练习等）自动调整内容呈现方式。

## 核心功能

### 1. 内容管理系统

- **多类型课程支持**：支持书籍、电影、教材、文章、对话和演讲等多种课程类型
- **结构化内容**：组织课程、课时、内容块和句子对
- **内容导入导出**：支持JSON和ZIP格式的课程包导入导出，包含媒体文件处理
- **自动难度调整**：根据学习者级别（初级、中级、高级）自动调整课程内容

### 2. 多样化学习模式

- **中译英模式**：查看中文，练习英文表达
- **英译中模式**：阅读英文，练习中文翻译
- **听力模式**：听英文音频，提高听力理解能力
- **语法模式**：分析句子结构，学习语法要点
- **笔记模式**：记录学习笔记，标注重点

### 3. 智能笔记系统

- **自动内容分析**：智能分析课程内容，自动识别重点词汇、语法和短语
- **多类型笔记**：支持重要性、难点、见解、问题和词汇等多种笔记类型
- **智能推荐**：基于相似度自动推荐相关笔记
- **间隔复习**：基于记忆曲线安排笔记复习

### 4. 个性化学习计划

- **智能计划生成**：根据用户目标、可用时间和学习习惯自动生成学习计划
- **灵活计划模板**：支持标准、强化、周末和考试准备等多种计划模板
- **计划优化**：基于用户表现自动调整和优化学习计划
- **进度跟踪**：详细记录和展示学习进度和成果

### 5. 学习分析与洞察

- **数据跟踪**：记录学习会话、词汇掌握度、学习目标等数据
- **智能洞察**：生成关于生产力、词汇学习和学习习惯的洞察
- **个性化建议**：提供基于用户数据的学习建议和优化方案
- **学习效率分析**：分析时间分布、学习效率和最佳学习时段

### 6. 智能练习生成

- **个性化练习**：基于用户弱点和学习历史自动生成练习
- **多样题型**：支持选择题、填空题、排序题、匹配题和听写题
- **难度调整**：智能调整练习难度，保持学习挑战性
- **即时反馈**：提供详细解析和改进建议

## 技术架构

### 前端
- **框架**：React + Next.js
- **UI组件**：Material-UI
- **状态管理**：React Context API
- **网络请求**：Fetch API + 自定义API工具

### 后端
- **API路由**：Next.js API Routes
- **身份验证**：NextAuth.js
- **数据处理**：自定义服务和工具函数
- **内容分析**：自然语言处理工具

### 数据存储
- **用户数据**：数据库存储（MongoDB/MySQL/PostgreSQL）
- **课程内容**：JSON结构化数据
- **媒体文件**：云存储（如ALI OSS/AWS S3）

## 项目特点

1. **智能化**：利用数据分析和自然语言处理技术提供个性化学习体验
2. **结构化**：采用清晰的内容结构，便于组织和学习
3. **灵活性**：支持多种课程类型和学习模式，适应不同学习需求
4. **可扩展**：模块化设计，易于添加新功能和学习模式
5. **数据驱动**：基于用户数据不断优化学习体验

## 开发指南

### 环境设置
```bash
# 安装依赖
npm install

# 运行开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

### 项目结构
```
/src
  /app                 # Next.js 应用路由
  /components          # React 组件
  /services            # 业务服务层
  /types               # TypeScript 类型定义
  /lib                 # 工具库和辅助函数
  /hooks               # React 自定义钩子
  /contexts            # React Context
  /styles              # 全局样式
```

### 主要文件说明

- **课程类型定义**：`src/types/courses/packageTypes.ts`
- **学习模式组件**：`src/components/learning/modes/`
- **课程包服务**：`src/services/coursePackageService.ts`
- **笔记服务**：`src/services/noteService.ts`
- **学习计划服务**：`src/services/learningPlanService.ts`
- **学习分析服务**：`src/services/learningAnalyticsService.ts`

## 使用场景

1. **语言学习者**：希望系统化提高英语能力的学习者
2. **教育机构**：需要提供个性化英语教学的学校和培训机构
3. **自学者**：想要高效学习英语的自学人群
4. **教师**：需要为学生提供个性化学习资源的教师

## 未来计划

- 集成AI语音识别进行口语评估
- 添加社区功能，支持学习者之间的交流
- 开发移动应用，支持离线学习
- 拓展支持更多语言学习
- 添加游戏化元素，提高学习趣味性

## 贡献指南

我们欢迎社区贡献！如果您有兴趣参与项目开发，请查看以下步骤：

1. Fork 项目仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 许可证

本项目采用 MIT 许可证 - 详情请查看 LICENSE 文件

## 功能特点

- 用户账户管理和身份验证
- 自适应学习系统
- 课程和课时管理
- 进度跟踪与分析
- 会员订阅系统
- 移动端响应式设计

## 技术栈

- **前端**: Next.js, React, Tailwind CSS
- **后端**: Node.js, Next.js API Routes
- **数据库**: MySQL (通过Prisma ORM)
- **认证**: NextAuth.js / JWT
- **部署**: Docker, Vercel

## 本地开发

### 前提条件

- Node.js 18+
- MySQL 8.0+
- npm 或 yarn

### 安装步骤

1. 克隆仓库:
   ```
   git clone https://github.com/yourusername/english-sentences-learning.git
   cd english-sentences-learning
   ```

2. 安装依赖:
   ```
   npm install
   ```

3. 配置环境变量:
   ```
   cp .env.example .env.local
   ```
   编辑 `.env.local` 文件，设置数据库连接等信息。

4. 设置数据库:
   ```
   npx prisma migrate dev
   ```

5. 启动开发服务器:
   ```
   npm run dev
   ```

6. 访问应用程序:
   在浏览器中打开 [http://localhost:3000](http://localhost:3000)

## 生产环境部署

### 使用Docker

1. 确保已安装Docker和Docker Compose

2. 构建和启动容器:
   ```
   docker-compose up -d
   ```

3. 应用将在 [http://localhost:3000](http://localhost:3000) 运行

### 使用Vercel

1. 连接GitHub仓库到Vercel

2. 配置环境变量:
   - `DATABASE_URL`: 你的MySQL数据库URL
   - `NEXTAUTH_URL`: 你的应用URL (如 https://your-app.vercel.app)
   - `NEXTAUTH_SECRET`: 用于NextAuth的密钥

3. 部署应用程序

## 数据库初始化

首次启动应用时，可以运行示例数据脚本：

```
node scripts/deploy-db.js
```

## 后端API

API端点文档请参考 [API.md](API.md)
