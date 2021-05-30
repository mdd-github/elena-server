FROM node:14
ENV NODE_ENV production
WORKDIR ./app
COPY package*.json ./
RUN npm install --production

COPY ./dist ./dist
CMD ["npm", "run", "start:prod"]
