FROM node:18

WORKDIR /use/src/app

COPY package*.json ./

# RUN npm install
RUN npm ci --omit=dev

COPY . .
EXPOSE 8081
CMD [ "node" , "server/server.js" ]