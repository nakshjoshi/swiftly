# -----Stage-1-Get Rid with Dev Dependencies work-----
FROM oven/bun:1 AS deps
WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY prisma/ ./prisma/
COPY prisma.config.ts ./
RUN bunx prisma generate

# ---- Production stage ----
FROM oven/bun:1
WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

COPY --from=deps /app/generated ./generated

COPY tsconfig.json ./
COPY prisma/ ./prisma/
COPY prisma.config.ts ./
COPY src/ ./src/

ENV NODE_ENV=production
EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD bun -e "fetch('http://localhost:3001/health').then(r=>{if(!r.ok)process.exit(1)}).catch(()=>process.exit(1))"

CMD ["bun", "src/index.ts"]
