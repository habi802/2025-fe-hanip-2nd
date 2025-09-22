# Build stage
FROM node:22.12.0 AS build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM nginx:stable-alpine

# Add our custom nginx config
COPY default.conf /etc/nginx/conf.d/

COPY --from=build-stage /app/dist /etc/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
