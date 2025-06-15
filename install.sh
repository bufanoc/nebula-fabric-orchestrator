
#!/bin/bash

# Nebula Fabric Orchestrator - Automated Installation Script
# This script installs and configures the complete application stack
# Author: AI Assistant
# Date: 2025-06-15

set -e  # Exit on any error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration variables
APP_NAME="nebula-fabric-orchestrator"
APP_DIR="/opt/$APP_NAME"
APP_USER="nebula"
APP_PORT="8080"
NGINX_PORT="80"
LOG_DIR="/var/log/$APP_NAME"

# Function to print colored output
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

# Function to check if running as root
check_root() {
    if [[ $EUID -eq 0 ]]; then
        print_error "This script should not be run as root for security reasons"
        print_status "Please run as a regular user with sudo privileges"
        exit 1
    fi
}

# Function to detect OS
detect_os() {
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        if [ -f /etc/debian_version ]; then
            OS="debian"
            PACKAGE_MANAGER="apt"
        elif [ -f /etc/redhat-release ]; then
            OS="redhat"
            PACKAGE_MANAGER="yum"
        else
            print_error "Unsupported Linux distribution"
            exit 1
        fi
    else
        print_error "Unsupported operating system: $OSTYPE"
        exit 1
    fi
    print_success "Detected OS: $OS"
}

# Function to check and install system prerequisites
install_system_prerequisites() {
    print_status "Checking and installing system prerequisites..."
    
    case $PACKAGE_MANAGER in
        "apt")
            sudo apt update
            sudo apt install -y curl wget git nginx ufw fail2ban htop tree
            ;;
        "yum")
            sudo yum update -y
            sudo yum install -y curl wget git nginx firewalld htop tree
            ;;
    esac
    
    print_success "System prerequisites installed"
}

# Function to install Node.js and npm
install_nodejs() {
    print_status "Checking Node.js installation..."
    
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        print_status "Node.js already installed: $NODE_VERSION"
    else
        print_status "Installing Node.js via NodeSource repository..."
        curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
        sudo apt-get install -y nodejs
    fi
    
    # Verify installation
    node --version
    npm --version
    print_success "Node.js and npm are ready"
}

# Function to create application user
create_app_user() {
    print_status "Creating application user: $APP_USER"
    
    if id "$APP_USER" &>/dev/null; then
        print_warning "User $APP_USER already exists"
    else
        sudo useradd -r -s /bin/bash -d $APP_DIR $APP_USER
        print_success "Created user: $APP_USER"
    fi
}

# Function to create directory structure
create_directories() {
    print_status "Creating directory structure..."
    
    sudo mkdir -p $APP_DIR
    sudo mkdir -p $LOG_DIR
    sudo mkdir -p /etc/$APP_NAME
    
    sudo chown -R $APP_USER:$APP_USER $APP_DIR
    sudo chown -R $APP_USER:$APP_USER $LOG_DIR
    
    print_success "Directory structure created"
}

# Function to clone and build application
deploy_application() {
    print_status "Deploying application..."
    
    # Clone the repository
    cd $APP_DIR
    sudo -u $APP_USER git clone https://github.com/bufanoc/nebula-fabric-orchestrator.git .
    
    # Install dependencies
    print_status "Installing application dependencies..."
    sudo -u $APP_USER npm install
    
    # Build the application
    print_status "Building the application..."
    sudo -u $APP_USER npm run build
    
    print_success "Application deployed and built"
}

# Function to configure nginx
configure_nginx() {
    print_status "Configuring Nginx..."
    
    # Create nginx configuration
    sudo tee /etc/nginx/sites-available/$APP_NAME > /dev/null <<EOF
server {
    listen $NGINX_PORT;
    server_name _;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    
    # Root directory
    root $APP_DIR/dist;
    index index.html;
    
    # Main location
    location / {
        try_files \$uri \$uri/ /index.html;
    }
    
    # API proxy (for future backend integration)
    location /api/ {
        proxy_pass http://localhost:3001/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
    
    # Static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Logs
    access_log $LOG_DIR/nginx_access.log;
    error_log $LOG_DIR/nginx_error.log;
}
EOF
    
    # Enable the site
    sudo ln -sf /etc/nginx/sites-available/$APP_NAME /etc/nginx/sites-enabled/
    sudo rm -f /etc/nginx/sites-enabled/default
    
    # Test nginx configuration
    sudo nginx -t
    
    # Restart nginx
    sudo systemctl restart nginx
    sudo systemctl enable nginx
    
    print_success "Nginx configured and started"
}

# Function to configure firewall
configure_firewall() {
    print_status "Configuring firewall..."
    
    case $OS in
        "debian")
            sudo ufw --force enable
            sudo ufw allow ssh
            sudo ufw allow $NGINX_PORT
            sudo ufw allow $APP_PORT
            ;;
        "redhat")
            sudo systemctl start firewalld
            sudo systemctl enable firewalld
            sudo firewall-cmd --permanent --add-service=ssh
            sudo firewall-cmd --permanent --add-port=$NGINX_PORT/tcp
            sudo firewall-cmd --permanent --add-port=$APP_PORT/tcp
            sudo firewall-cmd --reload
            ;;
    esac
    
    print_success "Firewall configured"
}

# Function to create systemd service
create_systemd_service() {
    print_status "Creating systemd service..."
    
    sudo tee /etc/systemd/system/$APP_NAME.service > /dev/null <<EOF
[Unit]
Description=Nebula Fabric Orchestrator Web Application
After=network.target
Wants=network.target

[Service]
Type=simple
User=$APP_USER
Group=$APP_USER
WorkingDirectory=$APP_DIR
ExecStart=/usr/bin/npm run preview -- --host 0.0.0.0 --port $APP_PORT
Restart=always
RestartSec=10
StandardOutput=append:$LOG_DIR/app.log
StandardError=append:$LOG_DIR/app_error.log

# Security settings
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=$APP_DIR $LOG_DIR

[Install]
WantedBy=multi-user.target
EOF
    
    sudo systemctl daemon-reload
    sudo systemctl enable $APP_NAME
    sudo systemctl start $APP_NAME
    
    print_success "Systemd service created and started"
}

# Function to run post-installation tests
run_tests() {
    print_status "Running post-installation tests..."
    
    # Test if service is running
    if systemctl is-active --quiet $APP_NAME; then
        print_success "Application service is running"
    else
        print_error "Application service is not running"
        sudo systemctl status $APP_NAME
        return 1
    fi
    
    # Test if nginx is running
    if systemctl is-active --quiet nginx; then
        print_success "Nginx service is running"
    else
        print_error "Nginx service is not running"
        return 1
    fi
    
    # Test HTTP response
    sleep 5  # Give services time to start
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:$NGINX_PORT || echo "000")
    if [ "$HTTP_CODE" = "200" ]; then
        print_success "HTTP endpoint is responding (HTTP $HTTP_CODE)"
    else
        print_warning "HTTP endpoint returned code: $HTTP_CODE"
    fi
    
    print_success "All tests completed"
}

# Function to get server IP
get_server_info() {
    print_status "Gathering server information..."
    
    # Get primary IP address
    SERVER_IP=$(ip route get 1.1.1.1 | grep -oP 'src \K\S+' 2>/dev/null || hostname -I | awk '{print $1}')
    
    echo ""
    echo "=============================================="
    echo -e "${GREEN}🎉 INSTALLATION COMPLETED SUCCESSFULLY! 🎉${NC}"
    echo "=============================================="
    echo ""
    echo -e "${BLUE}📋 Server Information:${NC}"
    echo "  🌐 Web Application URL: http://$SERVER_IP"
    echo "  🔌 Direct App Port: http://$SERVER_IP:$APP_PORT"
    echo "  👤 Application User: $APP_USER"
    echo "  📁 Installation Directory: $APP_DIR"
    echo "  📝 Log Directory: $LOG_DIR"
    echo ""
    echo -e "${BLUE}🔧 Management Commands:${NC}"
    echo "  • View app logs: sudo journalctl -u $APP_NAME -f"
    echo "  • Restart app: sudo systemctl restart $APP_NAME"
    echo "  • Check app status: sudo systemctl status $APP_NAME"
    echo "  • Restart nginx: sudo systemctl restart nginx"
    echo ""
    echo -e "${BLUE}📚 Documentation:${NC}"
    echo "  • Application docs: $APP_DIR/docs/"
    echo "  • Configuration: /etc/$APP_NAME/"
    echo ""
    echo -e "${YELLOW}⚠️  Notes:${NC}"
    echo "  • No authentication is currently configured"
    echo "  • XenServer integration requires Supabase setup"
    echo "  • All XenServer features are currently simulated"
    echo ""
    echo "=============================================="
}

# Main installation function
main() {
    print_status "Starting Nebula Fabric Orchestrator installation..."
    
    check_root
    detect_os
    install_system_prerequisites
    install_nodejs
    create_app_user
    create_directories
    deploy_application
    configure_nginx
    configure_firewall
    create_systemd_service
    run_tests
    get_server_info
    
    print_success "Installation completed successfully!"
}

# Run main function
main "$@"
