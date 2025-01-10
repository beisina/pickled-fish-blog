FROM node:20 as builder

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm

RUN pnpm install

COPY . .

RUN pnpm docs:build

FROM nginx:alpine

COPY --from=builder /app/src/.vuepress/dist /var/www/html

EXPOSE 10080

CMD ["nginx", "-g", "daemon off;"]
