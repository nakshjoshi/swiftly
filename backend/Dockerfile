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
# The app listens on $PORT. Set a default here so the app, EXPOSE and the healthcheck agree; a platform that
# injects its own PORT overrides it, and the healthcheck follows because it reads the same variable.
ENV PORT=3001
EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD bun -e "fetch('http://localhost:' + (process.env.PORT || 3001) + '/health').then(r=>{if(!r.ok)process.exit(1)}).catch(()=>process.exit(1))"

# Run as the unprivileged user the bun image ships (uid 1000), not root. The app files stay owned by root, so a
# compromised process can read them but not rewrite them; nothing needs write access (uploads stay in memory).
USER bun
CMD ["bun", "src/index.ts"]
