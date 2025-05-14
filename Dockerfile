# 依赖阶段
FROM node:22-slim AS deps
WORKDIR /app

# 只复制依赖相关文件，利用缓存
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && \
  pnpm install --frozen-lockfile

# 构建阶段
FROM node:22-slim AS builder
WORKDIR /app

# 复制依赖
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm install -g pnpm && \
  pnpm build

# 运行阶段
FROM node:22-slim AS runner
WORKDIR /app

# 只复制必要文件
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/scripts ./scripts

# 使用非 root 用户(使用 node 而不是创建新用户)
USER node

EXPOSE 4000

CMD ["sh", "/app/scripts/start.sh"]