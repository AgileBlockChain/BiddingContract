FROM node
#FROM node:alpine

COPY src /src/
WORKDIR /src/

RUN npm install -g truffle && npm install

ENTRYPOINT ["sh", "launch.sh"]
