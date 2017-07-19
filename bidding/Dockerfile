FROM node
#FROM node:alpine

COPY src /src/
WORKDIR /src/

RUN npm install truffle -g && npm install

ENTRYPOINT ["sh", "launch.sh"]

