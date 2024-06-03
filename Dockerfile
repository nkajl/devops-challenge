FROM node:21.2.0 AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:21.2.0

WORKDIR /app

COPY package*.json ./

RUN npm install --only=production

COPY --from=build /app/dist ./dist

COPY .env /app/

EXPOSE 3000

CMD ["node", "dist/index.js"]
