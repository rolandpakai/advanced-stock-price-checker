FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm install

COPY . .

RUN npx prisma generate
RUN npx prisma db push
RUN npm run build

CMD ["node", "dist/index.js"]