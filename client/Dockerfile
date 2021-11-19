FROM node:lts-alpine

WORKDIR /app
COPY package.json .
RUN yarn install
COPY . .

CMD ["npm", "run", "dev"]