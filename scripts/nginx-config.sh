
#!/bin/bash

# Nginx configuration functions for Nebula Fabric Orchestrator

source "$(dirname "$0")/common.sh"

# Configure Nginx
configure_nginx() {
    log "Configuring Nginx..."
    sudo tee /etc/nginx/sites-available/$NGINX_SITE > /dev/null <<EOF
server {
    listen 80;
    server_name _;
    root $APP_DIR/dist;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Handle React Router
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security - hide nginx version
    server_tokens off;
}
EOF

    # Enable the site
    sudo ln -sf /etc/nginx/sites-available/$NGINX_SITE /etc/nginx/sites-enabled/
    sudo rm -f /etc/nginx/sites-enabled/default
}

# Start Nginx
start_nginx() {
    log "Testing Nginx configuration..."
    sudo nginx -t

    log "Starting Nginx..."
    sudo systemctl enable nginx
    sudo systemctl restart nginx
}
