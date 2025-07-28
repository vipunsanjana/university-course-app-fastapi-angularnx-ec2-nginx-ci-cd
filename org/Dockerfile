# Stage 1: Build Angular app
FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
RUN npx nx build your-angular-app --configuration production

# Stage 2: Serve Angular via NGINX
FROM nginx:alpine
COPY --from=builder /app/dist/apps/your-angular-app /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
