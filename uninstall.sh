
#!/bin/bash

# Uninstallation script for Nebula Fabric Orchestrator
# This script removes the application and cleans up all installed components

set -e

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
    error "sudo is required but not installed."
fi

log "Starting uninstallation of $APP_NAME..."

# Confirm uninstallation
read -p "Are you sure you want to uninstall $APP_NAME? This will remove all application data. (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    log "Uninstallation cancelled."
    exit 0
fi

# Stop Nginx if it's running
log "Stopping Nginx..."
if sudo systemctl is-active --quiet nginx; then
    sudo systemctl stop nginx
    log "Nginx stopped"
else
    log "Nginx was not running"
fi

# Remove Nginx site configuration
log "Removing Nginx configuration..."
if [[ -f "/etc/nginx/sites-enabled/$NGINX_SITE" ]]; then
    sudo rm -f /etc/nginx/sites-enabled/$NGINX_SITE
    log "Removed Nginx site symlink"
fi

if [[ -f "/etc/nginx/sites-available/$NGINX_SITE" ]]; then
    sudo rm -f /etc/nginx/sites-available/$NGINX_SITE
    log "Removed Nginx site configuration"
fi

# Restore default Nginx site if it was removed
if [[ ! -f "/etc/nginx/sites-enabled/default" ]] && [[ -f "/etc/nginx/sites-available/default" ]]; then
    sudo ln -s /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default
    log "Restored default Nginx site"
fi

# Test Nginx configuration and restart
log "Restarting Nginx..."
if sudo nginx -t; then
    sudo systemctl start nginx
    log "Nginx restarted successfully"
else
    warn "Nginx configuration test failed. You may need to fix the configuration manually."
fi

# Remove application directory
log "Removing application directory..."
if [[ -d "$APP_DIR" ]]; then
    sudo rm -rf $APP_DIR
    log "Application directory removed: $APP_DIR"
else
    log "Application directory not found: $APP_DIR"
fi

# Remove application user
log "Removing application user..."
if id "$SERVICE_USER" &>/dev/null; then
    sudo userdel $SERVICE_USER 2>/dev/null || warn "Could not remove user $SERVICE_USER (may have active processes)"
    log "Application user removed: $SERVICE_USER"
else
    log "Application user not found: $SERVICE_USER"
fi

# Clean up any remaining files
log "Cleaning up remaining files..."

# Remove any log files that might have been created
sudo rm -f /var/log/nginx/$APP_NAME*.log 2>/dev/null || true

# Verify removal
log "Verifying removal..."

# Check if application directory was removed
if [[ -d "$APP_DIR" ]]; then
    warn "Application directory still exists: $APP_DIR"
else
    log "✓ Application directory removed"
fi

# Check if user was removed
if id "$SERVICE_USER" &>/dev/null; then
    warn "Application user still exists: $SERVICE_USER"
else
    log "✓ Application user removed"
fi

# Check if Nginx configurations were removed
if [[ -f "/etc/nginx/sites-available/$NGINX_SITE" ]] || [[ -f "/etc/nginx/sites-enabled/$NGINX_SITE" ]]; then
    warn "Some Nginx configurations still exist"
else
    log "✓ Nginx configurations removed"
fi

# Check if application is no longer accessible
if curl -f -s "http://localhost" | grep -q "$APP_NAME" 2>/dev/null; then
    warn "Application may still be accessible via HTTP"
else
    log "✓ Application no longer accessible"
fi

log ""
log "=========================================="
log "🗑️  UNINSTALLATION COMPLETED! 🗑️"
log "=========================================="
log ""
log "What was removed:"
log "  ✓ Application files and directory"
log "  ✓ Application user account"
log "  ✓ Nginx site configuration"
log "  ✓ Application access via HTTP"
log ""
log "What was kept:"
log "  • Node.js and npm (may be used by other applications)"
log "  • Nginx web server (may be used by other applications)"
log "  • System packages and dependencies"
log ""
log "If you want to completely remove Node.js and Nginx:"
log "  sudo apt remove --purge nodejs npm nginx"
log "  sudo apt autoremove"
log ""
log "Thank you for using $APP_NAME!"
