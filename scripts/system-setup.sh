
#!/bin/bash

# System setup functions for Nebula Fabric Orchestrator

source "$(dirname "$0")/common.sh"

# Update system packages
update_system() {
    log "Updating system packages..."
    sudo apt update && sudo apt upgrade -y
}

# Install required system packages
install_prerequisites() {
    log "Installing system prerequisites..."
    sudo apt install -y curl wget gnupg2 software-properties-common apt-transport-https ca-certificates lsb-release nginx
}

# Install Node.js 18.x
install_nodejs() {
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
}

# Create application user and directory
setup_user_and_directory() {
    log "Creating application user..."
    if ! id "$SERVICE_USER" &>/dev/null; then
        sudo useradd --system --home-dir $APP_DIR --create-home --shell /bin/bash $SERVICE_USER
        log "Created user: $SERVICE_USER"
    else
        log "User $SERVICE_USER already exists"
    fi

    log "Setting up application directory..."
    sudo mkdir -p $APP_DIR
    sudo chown $SERVICE_USER:$SERVICE_USER $APP_DIR
}
