
#!/bin/bash

# Ubuntu 22.04.5 Installation Script for Nebula Fabric Orchestrator
# This script installs all prerequisites and configures the application

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="nebula-fabric-orchestrator"
APP_DIR="/opt/$APP_NAME"
NGINX_SITE="$APP_NAME"
SERVICE_USER="$APP_NAME"

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
    exit 1
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
    error "This script should not be run as root. Please run as a regular user with sudo privileges."
fi

# Check if sudo is available
if ! command -v sudo &> /dev/null; then
    error "sudo is required but not installed. Please install sudo first."
fi

log "Starting installation of $APP_NAME..."

# Update system packages
log "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install required system packages
log "Installing system prerequisites..."
sudo apt install -y curl wget gnupg2 software-properties-common apt-transport-https ca-certificates lsb-release nginx

# Install Node.js 18.x
log "Installing Node.js 18.x..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt install -y nodejs
fi

# Verify Node.js and npm versions
NODE_VERSION=$(node --version)
NPM_VERSION=$(npm --version)
log "Node.js version: $NODE_VERSION"
log "npm version: $NPM_VERSION"

# Check minimum versions
if ! node -e "process.exit(process.version.slice(1).split('.')[0] >= 16 ? 0 : 1)"; then
    error "Node.js version 16 or higher is required"
fi

# Create application user
log "Creating application user..."
if ! id "$SERVICE_USER" &>/dev/null; then
    sudo useradd --system --home-dir $APP_DIR --create-home --shell /bin/bash $SERVICE_USER
    log "Created user: $SERVICE_USER"
else
    log "User $SERVICE_USER already exists"
fi

# Create application directory and set permissions
log "Setting up application directory..."
sudo mkdir -p $APP_DIR
sudo chown $SERVICE_USER:$SERVICE_USER $APP_DIR

# Copy application files (excluding hidden files like .git to avoid permission issues)
log "Copying application files..."
sudo cp -r package*.json src/ public/ index.html vite.config.ts tsconfig*.json tailwind.config.ts postcss.config.js components.json $APP_DIR/ 2>/dev/null || true
sudo chown -R $SERVICE_USER:$SERVICE_USER $APP_DIR

# Install npm dependencies as the service user
log "Installing npm dependencies..."
sudo -u $SERVICE_USER bash -c "cd $APP_DIR && npm install"

# Build the application as the service user
log "Building the application..."
sudo -u $SERVICE_USER bash -c "cd $APP_DIR && npm run build"

# Verify build was successful
if [[ ! -d "$APP_DIR/dist" ]]; then
    error "Build failed - dist directory not created"
fi

if [[ ! -f "$APP_DIR/dist/index.html" ]]; then
    error "Build failed - index.html not found in dist directory"
fi

# Configure Nginx
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

# Test Nginx configuration
log "Testing Nginx configuration..."
sudo nginx -t

# Start and enable Nginx
log "Starting Nginx..."
sudo systemctl enable nginx
sudo systemctl restart nginx

# Get server IP address
SERVER_IP=$(ip route get 8.8.8.8 | grep -oP 'src \K[^ ]+')

log "Running installation tests..."

# Test 1: Check if build directory exists and has files
if [[ ! -d "$APP_DIR/dist" ]]; then
    error "Build directory not found at $APP_DIR/dist"
fi

if [[ ! -f "$APP_DIR/dist/index.html" ]]; then
    error "index.html not found in build directory at $APP_DIR/dist"
fi

log "✓ Build files exist"

# Test 2: Check if Nginx is running
if ! sudo systemctl is-active --quiet nginx; then
    error "Nginx is not running"
fi

log "✓ Nginx is running"

# Test 3: Check if the application is accessible
sleep 5  # Give Nginx a moment to start
if curl -f -s "http://localhost" > /dev/null; then
    log "✓ Application is accessible via HTTP"
else
    error "Application is not accessible via HTTP"
fi

# Test 4: Check if React app loads correctly
RESPONSE=$(curl -s "http://localhost")
if echo "$RESPONSE" | grep -q "Vite\|React\|<!DOCTYPE html>"; then
    log "✓ React application loads correctly"
else
    warn "React application response received but content verification failed"
fi

# Test 5: Check if static assets are served
if curl -f -s "http://localhost/assets/" > /dev/null 2>&1 || curl -f -s "http://localhost/static/" > /dev/null 2>&1; then
    log "✓ Static assets are being served"
else
    warn "Static assets directory not accessible (this may be normal if no assets exist yet)"
fi

# Create uninstall script
log "Creating uninstall script..."
sudo tee $APP_DIR/uninstall.sh > /dev/null <<'EOF'
#!/bin/bash

# Uninstallation script for Nebula Fabric Orchestrator

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

APP_NAME="nebula-fabric-orchestrator"
APP_DIR="/opt/$APP_NAME"
NGINX_SITE="$APP_NAME"
SERVICE_USER="$APP_NAME"

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
}

if [[ $EUID -eq 0 ]]; then
    error "This script should not be run as root. Please run as a regular user with sudo privileges."
fi

log "Starting uninstallation of $APP_NAME..."

# Stop and disable Nginx
log "Stopping Nginx..."
sudo systemctl stop nginx || true

# Remove Nginx configuration
log "Removing Nginx configuration..."
sudo rm -f /etc/nginx/sites-enabled/$NGINX_SITE
sudo rm -f /etc/nginx/sites-available/$NGINX_SITE

# Restart Nginx to apply changes
sudo systemctl start nginx || true

# Remove application directory
log "Removing application directory..."
sudo rm -rf $APP_DIR

# Remove application user
log "Removing application user..."
sudo userdel $SERVICE_USER 2>/dev/null || warn "User $SERVICE_USER not found or couldn't be removed"

log "Uninstallation completed successfully!"
log "Note: Node.js, npm, and Nginx were left installed as they may be used by other applications."
EOF

sudo chmod +x $APP_DIR/uninstall.sh

# Final success message
log ""
log "=========================================="
log "🎉 APPLICATION INSTALLED SUCCESSFULLY! 🎉"
log "=========================================="
log ""
log "Application Details:"
log "  Name: $APP_NAME"
log "  Location: $APP_DIR"
log "  User: $SERVICE_USER"
log ""
log "Access Information:"
log "  Local: http://localhost"
log "  Network: http://$SERVER_IP"
log ""
log "Management Commands:"
log "  View Nginx status: sudo systemctl status nginx"
log "  View Nginx logs: sudo journalctl -u nginx -f"
log "  Restart Nginx: sudo systemctl restart nginx"
log "  Uninstall: sudo $APP_DIR/uninstall.sh"
log ""
log "The application is now running and accessible!"
