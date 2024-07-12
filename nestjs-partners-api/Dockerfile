FROM node:21-slim as builder

WORKDIR /home/node/app

RUN apt update && apt install -y openssl

COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./

RUN npm install

COPY ./apps ./apps 
COPY ./libs ./libs
COPY ./prisma ./prisma

ARG DATABASE_URL
ARG PARTNER

RUN touch .env.${PARTNER}
RUN echo DATABASE_URL=${DATABASE_URL} > .env.${PARTNER}
RUN npm run migrate:${PARTNER}

RUN npm run start ${PARTNER}-fixture

RUN npm run build ${PARTNER}

FROM node:21-slim as prod

RUN apt update && apt install -y openssl

WORKDIR /home/node/app

COPY --from=builder /home/node/app/package*.json ./
COPY --from=builder /home/node/app/dist dist
COPY --from=builder /home/node/app/node_modules node_modules

EXPOSE 3000
