# 英语学习平台 - 学习模式指南

本文档详细介绍了英语学习平台的不同学习模式及其实现。平台提供了多种学习模式，以适应不同的学习需求和偏好。

## 可用学习模式

平台支持以下五种主要学习模式：

1. **中译英模式** (Chinese-to-English)
2. **英译中模式** (English-to-Chinese)
3. **语法模式** (Grammar)
4. **听力模式** (Listening)
5. **笔记模式** (Notes)

## 学习模式组件

所有学习模式组件共享相似的接口，使得它们可以在不同的上下文中互换使用。

### 组件接口

```typescript
interface UserPreferences {
  showPinyin?: boolean;
  audioSpeed?: number;
  hintLevel?: number;
  maxAttempts?: number;
  // 其他特定于模式的首选项...
}

interface LearningModeProps {
  sentencePair: SentencePair;
  onComplete?: (success: boolean, attempts?: number) => void;
  preferences?: UserPreferences;
  onNext?: () => void;
  // 其他特定于模式的属性...
}
```

### 中译英模式 (ChineseToEnglishMode)

此模式展示中文句子，要求用户输入相应的英文翻译。

**主要特点**：
- 提供上下文中的中文句子
- 输入英文翻译
- 多级提示系统
- 正确/错误反馈
- 音频支持（如果可用）

**实现文件**：`src/components/learning/modes/ChineseToEnglishMode.tsx`

### 英译中模式 (EnglishToChineseMode)

此模式展示英文句子，要求用户输入相应的中文翻译。

**主要特点**：
- 提供上下文中的英文句子
- 输入中文翻译
- 多级提示系统
- 正确/错误反馈
- 音频支持（如果可用）

**实现文件**：`src/components/learning/modes/EnglishToChineseMode.tsx`

### 语法模式 (GrammarMode)

此模式专注于句子的语法分析，帮助用户理解句子结构和语法规则。

**主要特点**：
- 高亮显示句子中的语法点
- 提供详细的语法解释
- 可视化句法结构
- 交互式单词分析
- 音频支持（如果可用）

**实现文件**：`src/components/learning/modes/GrammarMode.tsx`

### 听力模式 (ListeningMode)

此模式重点培养听力技能，用户需要听懂音频并输入内容。

**主要特点**：
- 音频播放控制
- 可调整播放速度
- 听写练习
- 多级提示系统
- 正确/错误反馈

**实现文件**：`src/components/learning/modes/ListeningMode.tsx`

### 笔记模式 (NotesMode)

此模式允许用户为内容创建和管理笔记，增强学习记忆和理解。

**主要特点**：
- 选择文本并添加笔记
- 查看、编辑和删除笔记
- 笔记与句子关联
- 时间戳跟踪
- 音频支持（如果可用）

**实现文件**：`src/components/learning/modes/NotesMode.tsx`

## 学习模式导航

`ModeNavigation` 组件在不同学习模式间提供用户导航。

**实现文件**：`src/components/learning/ModeNavigation.tsx`

```tsx
<ModeNavigation
  currentMode="english-to-chinese"
  courseId="course-123"
  lessonId="lesson-456"
/>
```

## 类型定义

学习模式相关的类型定义位于：

```
src/types/learning/index.ts
```

主要类型包括：

```typescript
export type LearningMode = 'chinese-to-english' | 'english-to-chinese' | 'grammar' | 'listening' | 'notes';
```

## 如何使用

要在应用程序中使用这些学习模式组件，请按照以下示例使用：

```tsx
import { ChineseToEnglishMode } from '@/components/learning/modes/ChineseToEnglishMode';

// ...

<ChineseToEnglishMode
  sentencePair={{
    id: 'sentence-123',
    english: 'Hello, how are you?',
    chinese: '你好，你好吗？',
    audioUrl: '/audio/sentence-123.mp3'
  }}
  preferences={{
    showPinyin: false,
    audioSpeed: 1.0,
    hintLevel: 0,
    maxAttempts: 3
  }}
  onComplete={(success, attempts) => {
    console.log(`完成：${success ? '成功' : '失败'}，尝试次数：${attempts}`);
  }}
  onNext={() => {
    // 加载下一个句子
  }}
/>
```

## 自定义和扩展

创建新的学习模式时，请确保：

1. 遵循相同的组件接口
2. 放置在 `src/components/learning/modes/` 目录中
3. 更新 `LearningMode` 类型定义
4. 在 `ModeNavigation` 组件中添加新模式 