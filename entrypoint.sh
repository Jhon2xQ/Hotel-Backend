#!/bin/sh
set -e

echo "🔄 Running database migrations..."
bunx --bun prisma migrate deploy

echo "🚀 Starting server..."
exec bun run src/index.ts