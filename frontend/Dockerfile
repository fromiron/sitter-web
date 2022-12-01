FROM node:18.12.1-alpine3.16

COPY ./ /frontend
WORKDIR /frontend
RUN npm install
EXPOSE 3000
ENTRYPOINT ["npm", "run", "dev"]