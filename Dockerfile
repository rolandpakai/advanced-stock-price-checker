FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm install

COPY . .
COPY .env .env

RUN npx prisma generate
RUN npx prisma db push
RUN npm run build

EXPOSE 9000

CMD ["node", "dist/index.js"]