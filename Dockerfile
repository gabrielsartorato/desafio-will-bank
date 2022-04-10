FROM node:14-alpine as development
ENV TZ="America/Sao_paulo"
RUN date

# Start as root
USER root

# Api path
WORKDIR /usr/src/app

# Development packages
COPY ./package*.json ./
RUN npm install

# Copy application
COPY ./ /usr/src/app

# Build application
RUN npm run build

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

EXPOSE 3000

# Start as non-root
# USER node

CMD ["npm", "run", "start:prod"]
