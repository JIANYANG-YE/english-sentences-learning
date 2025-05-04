#!/bin/bash

# 等待数据库启动
echo "等待数据库启动..."
sleep 10

# 运行数据库迁移
echo "运行数据库迁移..."
npx prisma migrate deploy

# 初始化数据库
echo "初始化数据库..."
node scripts/deploy-db.js

# 启动应用
echo "启动应用..."
node server.js 