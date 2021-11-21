FROM node:16-alpine3.12 as base

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 8000

# Production build stage
FROM node:16-alpine3.12 as production-build
COPY package*.json ./
RUN npm install --only=production

COPY --from=0 /app/build/  ./build/

ENV NODE_ENV production
RUN npm ci --only=production

CMD ["npm", "run", "start"]