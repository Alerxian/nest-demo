#!/bin/bash

# 设置变量
DB_NAME="testdb"
BACKUP_DIR="/Users/mac/Desktop/WorkPro/nestjs/nest-demo/backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/${DB_NAME}_${DATE}.backup"

# 创建备份目录
mkdir -p "$BACKUP_DIR"

# 执行备份
pg_dump -U postgres -h localhost -F c -b -v -f "$BACKUP_FILE" "$DB_NAME"

# 保留最近7天的备份
find "$BACKUP_DIR" -type f -name "*.backup" -mtime +7 -delete