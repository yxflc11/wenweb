# syntax=docker/dockerfile:1.7

FROM node:24-alpine@sha256:d32cdf619f63fe0471182d08996dd516c6275bb5fd31ae06e55a570bd9e1ad43 AS build

WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build:static \
    && test -d out \
    && test ! -e out/keystatic \
    && test ! -e out/api/keystatic \
    && test -f out/healthz

FROM nginxinc/nginx-unprivileged:1.28.1-alpine@sha256:4655ddff4704d6b6c85f5a5862b5d0840941fcc95a4f4668f04b1d6f85858e7c

COPY deploy/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/out /usr/share/nginx/html

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8080/healthz >/dev/null || exit 1
