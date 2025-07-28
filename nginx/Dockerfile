FROM nginx:alpine

# Remove default configs
RUN rm -rf /etc/nginx/conf.d/*

# Copy your custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy entrypoint script
COPY entrypoint.sh /entrypoint.sh

# Make entrypoint executable
RUN chmod +x /entrypoint.sh

# Set entrypoint
ENTRYPOINT ["/entrypoint.sh"]
