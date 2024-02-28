FROM node:20-alpine3.19 AS base

WORKDIR /usr/src/app

COPY . .

RUN rm -rf node_modules

RUN yarn --frozen-lockfile --ignore-engines

# for production

FROM node:20-alpine3.19

WORKDIR /usr/src/app

COPY package*.json yarn.lock* ./

RUN yarn --frozen-lockfile --prod --ignore-engines

COPY --from=base /usr/src/app/ ./

EXPOSE 3000

ENTRYPOINT ["node","./app.js"]