FROM node:20 AS builder

WORKDIR /app

COPY . .

RUN npm ci --only=production && \
    npx prisma generate && \
    npm run build

FROM node:20

WORKDIR /app

COPY --from=builder /app/dist ./dist

COPY --from=builder /app/node_modules ./node_modules

COPY --from=builder /app/prisma ./prisma

COPY package*.json ./

CMD ["node", "dist/src/main.js"]