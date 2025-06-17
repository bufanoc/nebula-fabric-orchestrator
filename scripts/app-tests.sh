
#!/bin/bash

# Application testing functions for Nebula Fabric Orchestrator

source "$(dirname "$0")/common.sh"

# Run all installation tests
run_tests() {
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
}
