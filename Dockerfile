FROM node:20.11.0-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm i -g pnpm@8.5.1
RUN yarn install

COPY . ./
RUN yarn build

ENV NODE_ENV=production
ENV HOST=0.0.0.0
EXPOSE 3008
ENTRYPOINT ["yarn", "start"]
