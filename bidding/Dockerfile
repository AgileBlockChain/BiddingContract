FROM node
#FROM node:alpine

COPY src /src/
WORKDIR /src/

RUN npm install -g truffle && npm install && npm install ipfs-api && truffle compile

ENTRYPOINT ["sh", "launch.sh"]
