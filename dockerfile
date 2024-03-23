
FROM useparagon/ts-node:latest

COPY ./node_modules ./node_modules
COPY ./src/config ./src/config
COPY ./src/dto ./src/dto
COPY ./src/gate ./src/gate
COPY ./src/model ./src/model
COPY ./src/route ./src/route
COPY ./src/util ./src/util
COPY ./src/view ./src/view
COPY ./src/service ./src/service
COPY ./src/.env ./src/.env
COPY ./src/index.ts ./src/index.ts
COPY ./src/Server.ts ./src/Server.ts
COPY ./package.json ./package.json
COPY ./tsconfig.json ./tsconfig.json



