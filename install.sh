
#!/bin/bash

# Ubuntu 22.04.5 Installation Script for Nebula Fabric Orchestrator
# This script installs all prerequisites and configures the application

set -e  # Exit on any error

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Source all the component scripts
source "$SCRIPT_DIR/scripts/common.sh"
source "$SCRIPT_DIR/scripts/system-setup.sh"
source "$SCRIPT_DIR/scripts/app-build.sh"
source "$SCRIPT_DIR/scripts/nginx-config.sh"
source "$SCRIPT_DIR/scripts/app-tests.sh"
source "$SCRIPT_DIR/scripts/create-uninstall.sh"

# Main installation flow
main() {
    # Initial checks
    check_root
    check_sudo

    log "Starting installation of $APP_NAME..."

    # System setup
    update_system
    install_prerequisites
    install_nodejs
    setup_user_and_directory

    # Application setup
    copy_app_files
    install_dependencies
    build_application

    # Web server setup
    configure_nginx
    start_nginx

    # Testing
    run_tests

    # Create uninstall script
    create_uninstall_script

    # Get server IP address
    SERVER_IP=$(ip route get 8.8.8.8 | grep -oP 'src \K[^ ]+')

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
}

# Run the main installation
main "$@"
