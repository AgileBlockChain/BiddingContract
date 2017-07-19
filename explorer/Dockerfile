FROM node:alpine

WORKDIR /src/
ADD explorer /src/

RUN npm install 
ENTRYPOINT [ "npm", "start" ]

