# ----------------- STAGE 1: DEPENDENCIES -----------------
# Install production dependencies using pnpm.
FROM node:20-alpine AS dependencies
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy dependency definition files
COPY package.json pnpm-lock.yaml ./

# Install only production dependencies using the lockfile
RUN pnpm install --prod --frozen-lockfile

# ----------------- STAGE 2: PRODUCTION -----------------
# This is the final, lean image for running the application.
FROM node:20-alpine AS production
WORKDIR /app
ENV NODE_ENV=production

# Install pnpm globally in the production image
RUN npm install -g pnpm

COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
EXPOSE 3001
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser
CMD [ "pnpm", "start" ]
