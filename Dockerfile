FROM node:10
WORKDIR /user/src/app
COPY  ./package.json ./
RUN npm install
COPY . .
EXPOSE 9090
CMD npm run docker-start 

