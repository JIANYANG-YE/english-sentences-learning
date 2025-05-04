# API文档

本文档描述了英语句子学习平台的API端点。

## 认证

所有非公开API端点都需要在请求头中包含认证令牌：

```
Authorization: Bearer [your_token]
```

## 用户认证

### 注册

```
POST /api/auth/register
```

请求体:
```json
{
  "name": "用户名",
  "email": "user@example.com",
  "password": "your_password"
}
```

响应:
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "name": "用户名",
    "email": "user@example.com",
    "role": "user",
    "createdAt": "2023-01-01T00:00:00.000Z"
  },
  "message": "注册成功"
}
```

### 登录

```
POST /api/auth/login
```

请求体:
```json
{
  "email": "user@example.com",
  "password": "your_password"
}
```

响应:
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "name": "用户名",
    "email": "user@example.com",
    "role": "user",
    "createdAt": "2023-01-01T00:00:00.000Z"
  },
  "token": "jwt_token"
}
```

## 用户相关

### 获取当前用户信息

```
GET /api/user/me
```

响应:
```json
{
  "user": {
    "id": "user_id",
    "name": "用户名",
    "email": "user@example.com",
    "role": "user",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "profile": {
      "learningLevel": "beginner",
      "preferredLearningStyle": "visual",
      "learningGoals": ["基础会话", "旅游用语"]
    },
    "membership": {
      "type": "free",
      "status": "active",
      "startDate": "2023-01-01T00:00:00.000Z",
      "endDate": "2024-01-01T00:00:00.000Z"
    }
  },
  "learningData": {
    "progress": 0.3,
    "difficulty": 0.5,
    "performance": 0.7
  },
  "stats": {
    "enrolledCourses": 2,
    "completedCourses": 1,
    "completedLessons": 10,
    "totalLearningTime": 120
  },
  "recentCourses": [
    {
      "id": "course_id",
      "title": "英语基础入门",
      "progress": 0.4,
      "lastAccessed": "2023-01-10T00:00:00.000Z"
    }
  ]
}
```

### 更新用户信息

```
PUT /api/user/update
```

请求体:
```json
{
  "name": "新用户名",
  "image": "头像URL",
  "currentPassword": "当前密码",
  "newPassword": "新密码",
  "learningLevel": "intermediate",
  "preferredLearningStyle": "auditory",
  "learningGoals": ["商务会话", "学术英语"]
}
```

响应:
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "name": "新用户名",
    "email": "user@example.com",
    "image": "头像URL",
    "profile": {
      "learningLevel": "intermediate",
      "preferredLearningStyle": "auditory",
      "learningGoals": ["商务会话", "学术英语"]
    }
  },
  "message": "用户信息更新成功"
}
```

## 课程相关

### 获取课程列表

```
GET /api/courses?page=1&limit=10&category=基础课程&level=beginner&isFree=true
```

响应:
```json
{
  "courses": [
    {
      "id": "course_id",
      "title": "英语基础入门",
      "description": "适合零基础学习者的英语入门课程",
      "level": "beginner",
      "category": "基础课程",
      "tags": ["入门", "基础", "零基础"],
      "coverImage": "/course1.jpg",
      "isFree": true,
      "isFeatured": true,
      "totalLessons": 30,
      "publishStatus": "published",
      "sections": [
        {
          "id": "section_id",
          "title": "基础发音",
          "order": 1
        }
      ],
      "lessons": [
        {
          "id": "lesson_id",
          "title": "英语字母与发音",
          "subtitle": "学习26个英文字母的发音",
          "order": 1,
          "duration": 30
        }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### 获取课程详情

```
GET /api/courses/{course_id}
```

响应:
```json
{
  "id": "course_id",
  "title": "英语基础入门",
  "description": "适合零基础学习者的英语入门课程",
  "level": "beginner",
  "category": "基础课程",
  "tags": ["入门", "基础", "零基础"],
  "coverImage": "/course1.jpg",
  "isFree": true,
  "isFeatured": true,
  "totalLessons": 30,
  "publishStatus": "published",
  "sections": [
    {
      "id": "section_id",
      "title": "基础发音",
      "description": "学习英语基本发音规则",
      "order": 1
    }
  ],
  "lessons": [
    {
      "id": "lesson_id",
      "title": "英语字母与发音",
      "subtitle": "学习26个英文字母的发音",
      "description": "本课时将介绍英语字母表及其发音规则",
      "order": 1,
      "duration": 30,
      "sectionId": "section_id"
    }
  ],
  "isLocked": false,
  "userProgress": {
    "completedLessons": 5,
    "totalLessons": 30,
    "progressPercentage": 17
  }
}
```

### 获取课时详情

```
GET /api/lessons/{lesson_id}
```

响应:
```json
{
  "id": "lesson_id",
  "title": "英语字母与发音",
  "subtitle": "学习26个英文字母的发音",
  "description": "本课时将介绍英语字母表及其发音规则",
  "content": "{...}",
  "order": 1,
  "duration": 30,
  "videoUrl": "/videos/lesson1.mp4",
  "course": {
    "id": "course_id",
    "title": "英语基础入门",
    "level": "beginner",
    "isFree": true
  },
  "section": {
    "id": "section_id",
    "title": "基础发音"
  },
  "sentences": [
    {
      "id": "sentence_id",
      "english": "Hello, how are you?",
      "chinese": "你好，你好吗？",
      "order": 1,
      "difficulty": 1,
      "keywords": ["hello", "how", "you"],
      "grammarPoints": ["简单问候语", "疑问句"],
      "tags": ["greetings", "beginner"],
      "audioUrl": "/audio/hello.mp3"
    }
  ],
  "otherLessons": [
    {
      "id": "lesson_id2",
      "title": "简单对话",
      "order": 2,
      "sectionId": "section_id"
    }
  ],
  "userProgress": {
    "progress": 0.5,
    "accuracy": 0.8,
    "completionTime": 15,
    "completed": false
  },
  "isLocked": false
}
```

## 学习进度相关

### 记录学习进度

```
POST /api/learning/progress
```

请求体:
```json
{
  "lessonId": "lesson_id",
  "sentenceId": "sentence_id", // 可选
  "progress": 0.7,
  "accuracy": 0.85,
  "completionTime": 20,
  "completed": true,
  "notes": "记得不太清楚"
}
```

响应:
```json
{
  "success": true,
  "progress": {
    "id": "progress_id",
    "userId": "user_id",
    "lessonId": "lesson_id",
    "sentenceId": "sentence_id",
    "progress": 0.7,
    "accuracy": 0.85,
    "completionTime": 20,
    "completed": true,
    "notes": "记得不太清楚",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

### 获取个性化推荐

```
GET /api/learning/recommendations?count=3
```

响应:
```json
{
  "recommendations": [
    {
      "lessonId": "lesson_id",
      "title": "英语字母与发音",
      "description": "本课时将介绍英语字母表及其发音规则",
      "courseTitle": "英语基础入门",
      "confidence": 0.9,
      "reason": "继续完成已开始的学习"
    }
  ]
}
``` 