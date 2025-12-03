# Etapa de build
FROM node:20-alpine AS build
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml* ./
RUN --mount=type=cache,target=/pnpm/store pnpm install --frozen-lockfile

COPY . .
ENV MONGODB_URI="mongodb://build_mock_uri"
ENV NEXTAUTH_SECRET="build_mock_secret"
ENV NEXTAUTH_URL="http://localhost:3000"
RUN pnpm build

# Etapa de runtime
FROM node:20-alpine AS runtime
WORKDIR /app

RUN addgroup -g 1001 app && adduser -u 1001 -G app -s /bin/sh -D app
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY --from=build /app ./
USER app

EXPOSE 3000
CMD ["pnpm", "start"]
