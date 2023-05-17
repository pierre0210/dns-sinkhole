FROM node:18-alpine AS builder

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

FROM node:18-alpine

WORKDIR /app
COPY --from=builder /app/prod ./prod
COPY package* .
RUN npm install --production
EXPOSE 53
CMD [ "npm", "start" ]
