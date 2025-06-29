# ---- Base Stage ----
# Use an official Node.js runtime as a parent image.
# Using alpine for a smaller image size and better security.
# FROM node:18-alpine AS base
FROM node:18-slim AS base
WORKDIR /usr/src/app

# ---- Dependencies Stage ----
# Install dependencies before copying app source to leverage Docker cache.
# This layer is only rebuilt when package.json or package-lock.json changes.
FROM base AS dependencies
COPY package.json package-lock.json ./
RUN npm ci

# ---- Production Stage ----
# This is the final, lean image we'll use to run the application.
FROM base AS production
ENV NODE_ENV=production
# Copy installed dependencies from the 'dependencies' stage.
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
# Copy the rest of the application source code.
COPY . .
# The port that your app will run on.
EXPOSE 3001
# The command to run your app.
CMD ["node", "index.js"]