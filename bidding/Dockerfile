FROM node
#FROM node:alpine

COPY src /src/
WORKDIR /src/

RUN npm install -g truffle && npm install && truffle compile

ENTRYPOINT ["sh", "launch.sh"]
