#!/bin/sh

set -e

if [ "$NODE_ENV" = "production" ]; then
  echo "执行数据库迁移..."
  npm run db:sync
  if [ $? -ne 0 ]; then
    echo "数据库迁移失败，请检查数据库连接和配置。"
    exit 1
  fi
  
  echo "启动生产服务器..."
  npm run start:prod
else
  echo "启动开发服务器..."
  npm run start:dev
fi