FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

FROM base AS build
RUN npm run build

FROM base AS api
EXPOSE 3000
CMD ["npx", "tsx", "api/main.ts"]

FROM base AS worker
ENV WORKER_MODE=true
CMD ["npx", "tsx", "api/main.ts"]
