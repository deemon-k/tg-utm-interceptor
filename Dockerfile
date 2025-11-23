FROM node:25.2-alpine

WORKDIR /app

RUN apk add --no-cache python3 make g++

COPY . .
RUN npm install
RUN npm run build

ENV TZ=Europe/Kiev

EXPOSE 3010

CMD ["npm", "run", "start"]