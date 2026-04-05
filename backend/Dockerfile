FROM node:20-alpine

RUN apk add --no-cache openssl mysql-client netcat-openbsd

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY prisma ./prisma
RUN npx prisma generate

COPY . .

EXPOSE 8080

CMD ["sh", "start.sh"]