# 🏥 企业级谵妄预测管理平台 - 患者端 Dockerfile
# Next.js 多阶段构建，生产级优化

# ==================== 基础镜像 ====================
FROM node:18-alpine AS base

# 安装必要的系统依赖
RUN apk add --no-cache libc6-compat curl dumb-init

# 设置工作目录
WORKDIR /app

# 创建非root用户
RUN addgroup -g 1001 -S nodejs \
    && adduser -S patient -u 1001 -G nodejs

# ==================== 依赖安装阶段 ====================
FROM base AS deps

# 复制包管理文件
COPY package*.json ./

# 安装依赖
RUN npm ci --no-audit --no-fund

# ==================== 源码准备阶段 ====================
FROM base AS builder

# 复制依赖
COPY --from=deps /app/node_modules ./node_modules

# 复制源代码和配置
COPY . .

# 设置构建环境变量
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# 构建Next.js应用
RUN npm run build

# ==================== 生产运行阶段 ====================
FROM base AS runner

# 设置环境变量
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# 复制构建产物和依赖
COPY --from=builder --chown=patient:nodejs /app/public ./public
COPY --from=builder --chown=patient:nodejs /app/.next/standalone ./
COPY --from=builder --chown=patient:nodejs /app/.next/static ./.next/static

# 创建日志目录
RUN mkdir -p /app/logs \
    && chown -R patient:nodejs /app

# 切换到非root用户
USER patient

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/api/health || curl -f http://localhost:3000/ || exit 1

# 暴露端口
EXPOSE 3000

# 启动命令
CMD ["dumb-init", "node", "server.js"]

# ==================== 元数据 ====================
LABEL maintainer="Medical AI Team" \
      version="2.0.0" \
      description="企业级谵妄预测管理平台患者端" \
      org.label-schema.name="delirium-platform-patient" \
      org.label-schema.description="AI-driven delirium prediction platform patient interface" \
      org.label-schema.version="2.0.0" \
      org.label-schema.schema-version="1.0"




