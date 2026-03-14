# Stage 1: Base
FROM oven/bun:1.3.4-alpine AS base
WORKDIR /app

# Stage 2: Dependencies de producción
FROM base AS deps
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

# Stage 3: Build / generate prisma client
FROM base AS build
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
RUN bunx --bun prisma generate

# Stage 4: Production
FROM base AS production

# Crear usuario no-root
RUN addgroup -g 1001 -S bunuser && \
    adduser -S bunuser -u 1001

# Copiar dependencias de producción
COPY --from=deps --chown=bunuser:bunuser /app/node_modules ./node_modules

# Copiar Prisma client generado (sobreescribe el de node_modules)
COPY --from=build --chown=bunuser:bunuser /app/node_modules/.prisma ./node_modules/.prisma

# Copiar código fuente y migraciones
COPY --chown=bunuser:bunuser . .

# Copiar y dar permisos al entrypoint
COPY --chown=bunuser:bunuser entrypoint.sh ./
RUN chmod +x entrypoint.sh

# Cambiar a usuario no-root
USER bunuser

# Exponer puerto
EXPOSE 3000

# Variables de entorno por defecto
ENV NODE_ENV=production
ENV PORT=3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=15s --retries=3 \
  CMD bun run -e "fetch('http://localhost:3000').then(r => r.ok ? process.exit(0) : process.exit(1))"

# Comando de inicio
CMD ["./entrypoint.sh"]