
#!/bin/bash

# Nebula Fabric Orchestrator - Uninstall Script
# This script removes the application and all its components

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

APP_NAME="nebula-fabric-orchestrator"
APP_USER="nebula"
APP_DIR="/opt/$APP_NAME"
LOG_DIR="/var/log/$APP_NAME"

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

confirm_uninstall() {
    echo ""
    echo -e "${YELLOW}⚠️  WARNING: This will completely remove Nebula Fabric Orchestrator${NC}"
    echo ""
    echo "This will remove:"
    echo "  • Application files from $APP_DIR"
    echo "  • User account: $APP_USER"
    echo "  • System service: $APP_NAME"
    echo "  • Nginx configuration"
    echo "  • Log files from $LOG_DIR"
    echo ""
    
    read -p "Are you sure you want to continue? (yes/no): " confirm
    if [ "$confirm" != "yes" ]; then
        print_status "Uninstall cancelled."
        exit 0
    fi
}

stop_services() {
    print_status "Stopping services..."
    
    # Stop application service
    if systemctl is-active $APP_NAME &>/dev/null; then
        sudo systemctl stop $APP_NAME
        print_success "Stopped $APP_NAME service"
    fi
    
    # Disable service
    if systemctl is-enabled $APP_NAME &>/dev/null; then
        sudo systemctl disable $APP_NAME
        print_success "Disabled $APP_NAME service"
    fi
}

remove_systemd_service() {
    print_status "Removing systemd service..."
    
    if [ -f "/etc/systemd/system/$APP_NAME.service" ]; then
        sudo rm -f "/etc/systemd/system/$APP_NAME.service"
        sudo systemctl daemon-reload
        print_success "Removed systemd service file"
    fi
}

remove_nginx_config() {
    print_status "Removing Nginx configuration..."
    
    # Remove site configuration
    if [ -f "/etc/nginx/sites-available/$APP_NAME" ]; then
        sudo rm -f "/etc/nginx/sites-available/$APP_NAME"
        print_success "Removed Nginx site configuration"
    fi
    
    # Remove site link
    if [ -L "/etc/nginx/sites-enabled/$APP_NAME" ]; then
        sudo rm -f "/etc/nginx/sites-enabled/$APP_NAME"
        print_success "Removed Nginx site link"
    fi
    
    # Restore default site if no other sites exist
    if [ ! -f "/etc/nginx/sites-enabled/default" ] && [ -f "/etc/nginx/sites-available/default" ]; then
        sudo ln -sf /etc/nginx/sites-available/default /etc/nginx/sites-enabled/
        print_status "Restored default Nginx site"
    fi
    
    # Test and reload Nginx
    if sudo nginx -t &>/dev/null; then
        sudo systemctl reload nginx
        print_success "Reloaded Nginx configuration"
    fi
}

remove_application_files() {
    print_status "Removing application files..."
    
    if [ -d "$APP_DIR" ]; then
        sudo rm -rf "$APP_DIR"
        print_success "Removed application directory: $APP_DIR"
    fi
    
    if [ -d "$LOG_DIR" ]; then
        sudo rm -rf "$LOG_DIR"
        print_success "Removed log directory: $LOG_DIR"
    fi
    
    if [ -d "/etc/$APP_NAME" ]; then
        sudo rm -rf "/etc/$APP_NAME"
        print_success "Removed configuration directory: /etc/$APP_NAME"
    fi
}

remove_user() {
    print_status "Removing application user..."
    
    if id "$APP_USER" &>/dev/null; then
        sudo userdel -r "$APP_USER" 2>/dev/null || sudo userdel "$APP_USER"
        print_success "Removed user: $APP_USER"
    fi
}

cleanup_firewall() {
    print_status "Cleaning up firewall rules..."
    
    # This is optional - only remove app-specific rules
    if command -v ufw &>/dev/null; then
        # Note: We don't remove SSH or HTTP rules as they might be used by other services
        print_status "Firewall rules left intact (may be used by other services)"
    fi
}

final_cleanup() {
    print_status "Performing final cleanup..."
    
    # Remove any temporary files
    sudo rm -f /tmp/$APP_NAME-*
    
    # Clear any cached npm packages if they exist
    if [ -d "/home/$APP_USER/.npm" ]; then
        sudo rm -rf "/home/$APP_USER/.npm"
    fi
    
    print_success "Final cleanup completed"
}

main() {
    print_status "Starting Nebula Fabric Orchestrator uninstall..."
    
    confirm_uninstall
    stop_services
    remove_systemd_service
    remove_nginx_config
    remove_application_files
    remove_user
    cleanup_firewall
    final_cleanup
    
    echo ""
    echo "=============================================="
    echo -e "${GREEN}✅ UNINSTALL COMPLETED SUCCESSFULLY${NC}"
    echo "=============================================="
    echo ""
    echo -e "${BLUE}📋 What was removed:${NC}"
    echo "  ✓ Application files and directories"
    echo "  ✓ System service ($APP_NAME)"
    echo "  ✓ Application user ($APP_USER)"
    echo "  ✓ Nginx configuration"
    echo "  ✓ Log files"
    echo ""
    echo -e "${BLUE}📋 What was preserved:${NC}"
    echo "  • System packages (Node.js, Nginx, etc.)"
    echo "  • Firewall rules (SSH, HTTP)"
    echo "  • Other Nginx sites"
    echo ""
    echo -e "${YELLOW}💡 Note:${NC} If you want to remove Node.js and other system packages,"
    echo "   you can do so manually with your package manager."
    echo ""
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
    print_error "This script should not be run as root for security reasons"
    print_status "Please run as a regular user with sudo privileges"
    exit 1
fi

main "$@"
