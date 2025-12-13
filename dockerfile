FROM node:24-alpine AS builder

WORKDIR /app

COPY . .

RUN npm ci --omit=dev && \
    npx prisma generate && \
    npm run build

FROM node:24-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist

COPY --from=builder /app/node_modules ./node_modules

COPY --from=builder /app/prisma ./prisma

COPY package*.json ./

CMD ["node", "dist/src/main.js"]