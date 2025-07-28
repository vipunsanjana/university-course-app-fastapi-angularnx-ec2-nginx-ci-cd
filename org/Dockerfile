# Stage 1: Build Angular app
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the source code
COPY . .

# Build the Angular app using NX (replace `my-angular-app` with actual name)
RUN npx nx build org --configuration production

# Stage 2: Serve Angular via NGINX
FROM nginx:alpine

# Copy built files to NGINX public folder
COPY --from=builder /app/dist/apps/my-angular-app /usr/share/nginx/html

# Use custom NGINX config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
