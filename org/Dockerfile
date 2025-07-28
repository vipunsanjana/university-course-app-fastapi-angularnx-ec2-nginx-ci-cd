# Stage 1: Build Angular app
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code
COPY . .

# Build the Angular app using Nx
RUN npx nx build org --configuration production

# Stage 2: Serve Angular via NGINX
FROM nginx:alpine

# Copy the built browser files to NGINX html folder
COPY --from=builder /app/dist/org/browser /usr/share/nginx/html

# Use custom NGINX config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
