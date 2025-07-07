# ----------------- STAGE 1: DEPENDENCIES -----------------
# This stage installs all dependencies, including devDependencies,
# needed for the build process. It's a separate stage to leverage
# Docker's layer caching. It only re-runs if package.json or
# pnpm-lock.yaml change.
FROM node:20-alpine AS deps

# Some Next.js dependencies require this for native binaries.
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Install pnpm globally.
RUN npm install -g pnpm

# Copy package manager files.
COPY package.json pnpm-lock.yaml ./

# Install all dependencies.
RUN pnpm install --frozen-lockfile

# ----------------- STAGE 2: BUILDER -----------------
# This stage builds the Next.js application. It inherits from the 'deps'
# stage, so it has access to pnpm and all the installed node_modules.
FROM deps AS builder

# Copy the rest of the source code.
COPY . .

# Disable Next.js telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED=1

# Run the build command from your package.json.
RUN pnpm build

# ----------------- STAGE 3: RUNNER -----------------
# This is the final, minimal production image. It starts from a clean
# Node.js base image to keep it small and secure.
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1

# Create a non-root user for security purposes.
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy only the necessary production files from the 'builder' stage.
# This is enabled by `output: 'standalone'` in next.config.mjs.
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to the non-root user.
USER nextjs

# Expose the port the app will run on.
EXPOSE 3000

# Set the port environment variable.
ENV PORT=3000

# The command to start the Next.js server.
CMD ["node", "server.js"]