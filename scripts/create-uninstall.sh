
#!/bin/bash

# Create uninstall script function

source "$(dirname "$0")/common.sh"

# Create uninstall script
create_uninstall_script() {
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
}
