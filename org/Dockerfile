# Stage 1: Build the Angular app using Node
FROM node:18-alpine AS builder

# Create app directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy the entire workspace
COPY . .

# Build the specific Angular app (replace `source` with your app name if different)
RUN npx nx build source --configuration=production

# Stage 2: Serve using NGINX
FROM nginx:alpine

# Remove default nginx index page
RUN rm -rf /usr/share/nginx/html/*

# Copy built Angular app from builder
COPY --from=builder /app/dist/apps/source /usr/share/nginx/html

# Copy custom nginx config (optional)
# COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]
