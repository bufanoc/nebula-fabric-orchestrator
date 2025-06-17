
#!/bin/bash

# Application building functions for Nebula Fabric Orchestrator

source "$(dirname "$0")/common.sh"

# Copy application files
copy_app_files() {
    log "Copying application files..."
    sudo cp -r package*.json src/ public/ index.html vite.config.ts tsconfig*.json tailwind.config.ts postcss.config.js components.json $APP_DIR/ 2>/dev/null || true
    sudo chown -R $SERVICE_USER:$SERVICE_USER $APP_DIR
}

# Install npm dependencies
install_dependencies() {
    log "Installing npm dependencies..."
    sudo -u $SERVICE_USER bash -c "cd $APP_DIR && npm install"
}

# Build the application
build_application() {
    log "Building the application..."
    sudo -u $SERVICE_USER bash -c "cd $APP_DIR && npm run build"

    # Verify build was successful
    if [[ ! -d "$APP_DIR/dist" ]]; then
        error "Build failed - dist directory not created"
    fi

    if [[ ! -f "$APP_DIR/dist/index.html" ]]; then
        error "Build failed - index.html not found in dist directory"
    fi
}
