# Базовый образ для всех стадий
FROM node:20-alpine AS base

# Install dependencies only when needed
# 1 стадия: установка зависимостей
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Копируем только файлы зависимостей (для кеширования слоя)
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./
# установка в зависимости от пакетного менеджера
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# 2 стадия: сборка приложения
# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
# копирование зависимостей с прошлой стадии
COPY --from=deps /app/node_modules ./node_modules
# копирование всего исходного кода
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED=1

# собираем приложение
RUN \
  if [ -f yarn.lock ]; then yarn run build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Стадия 3: финальный образ для запуска
# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
# Uncomment the following line in case you want to disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED=1

# Создаём непривилегерованного пользователя для безопасности
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# копируем статические файлы
COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
# копируем только результат сборки (самое важное)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# переключаемся на непривилегированного пользователя
USER nextjs

# открываем порт
EXPOSE 3000

ENV PORT=3000

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/config/next-config-js/output
# слушаем все интерфейсы 
ENV HOSTNAME="0.0.0.0"
# запускаем автономный сервер Next.js
CMD ["node", "server.js"]