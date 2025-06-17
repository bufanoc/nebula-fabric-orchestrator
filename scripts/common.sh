
#!/bin/bash

# Common functions and configuration for Nebula Fabric Orchestrator

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

# Logging functions
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
check_root() {
    if [[ $EUID -eq 0 ]]; then
        error "This script should not be run as root. Please run as a regular user with sudo privileges."
    fi
}

# Check if sudo is available
check_sudo() {
    if ! command -v sudo &> /dev/null; then
        error "sudo is required but not installed. Please install sudo first."
    fi
}
