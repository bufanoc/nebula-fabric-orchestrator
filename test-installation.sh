
#!/bin/bash

# Test Script for Nebula Fabric Orchestrator Installation
# This script validates that the installation completed successfully

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

APP_NAME="nebula-fabric-orchestrator"
APP_USER="nebula"
APP_PORT="8080"
NGINX_PORT="80"

print_test() {
    echo -e "${BLUE}[TEST]${NC} $1"
}

print_pass() {
    echo -e "${GREEN}[PASS]${NC} $1"
}

print_fail() {
    echo -e "${RED}[FAIL]${NC} $1"
}

print_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

test_count=0
pass_count=0
fail_count=0

run_test() {
    test_count=$((test_count + 1))
    if $1; then
        pass_count=$((pass_count + 1))
        return 0
    else
        fail_count=$((fail_count + 1))
        return 1
    fi
}

# Test 1: Check if application user exists
test_user_exists() {
    print_test "Checking if application user '$APP_USER' exists"
    if id "$APP_USER" &>/dev/null; then
        print_pass "User $APP_USER exists"
        return 0
    else
        print_fail "User $APP_USER does not exist"
        return 1
    fi
}

# Test 2: Check directory structure
test_directories() {
    print_test "Checking directory structure"
    local directories=(
        "/opt/$APP_NAME"
        "/var/log/$APP_NAME"
        "/etc/$APP_NAME"
    )
    
    local all_exist=true
    for dir in "${directories[@]}"; do
        if [ -d "$dir" ]; then
            print_pass "Directory exists: $dir"
        else
            print_fail "Directory missing: $dir"
            all_exist=false
        fi
    done
    
    return $([ "$all_exist" = true ])
}

# Test 3: Check if Node.js is installed
test_nodejs() {
    print_test "Checking Node.js installation"
    if command -v node &> /dev/null; then
        local version=$(node --version)
        print_pass "Node.js is installed: $version"
        return 0
    else
        print_fail "Node.js is not installed"
        return 1
    fi
}

# Test 4: Check if application files exist
test_app_files() {
    print_test "Checking application files"
    local files=(
        "/opt/$APP_NAME/package.json"
        "/opt/$APP_NAME/dist/index.html"
        "/opt/$APP_NAME/node_modules"
    )
    
    local all_exist=true
    for file in "${files[@]}"; do
        if [ -e "$file" ]; then
            print_pass "File/directory exists: $file"
        else
            print_fail "File/directory missing: $file"
            all_exist=false
        fi
    done
    
    return $([ "$all_exist" = true ])
}

# Test 5: Check systemd service
test_systemd_service() {
    print_test "Checking systemd service"
    if systemctl is-enabled $APP_NAME &>/dev/null; then
        print_pass "Service is enabled: $APP_NAME"
        if systemctl is-active $APP_NAME &>/dev/null; then
            print_pass "Service is running: $APP_NAME"
            return 0
        else
            print_fail "Service is not running: $APP_NAME"
            systemctl status $APP_NAME --no-pager -l
            return 1
        fi
    else
        print_fail "Service is not enabled: $APP_NAME"
        return 1
    fi
}

# Test 6: Check Nginx configuration
test_nginx() {
    print_test "Checking Nginx configuration"
    if systemctl is-active nginx &>/dev/null; then
        print_pass "Nginx is running"
        if [ -f "/etc/nginx/sites-available/$APP_NAME" ]; then
            print_pass "Nginx configuration exists"
            if nginx -t &>/dev/null; then
                print_pass "Nginx configuration is valid"
                return 0
            else
                print_fail "Nginx configuration is invalid"
                return 1
            fi
        else
            print_fail "Nginx configuration missing"
            return 1
        fi
    else
        print_fail "Nginx is not running"
        return 1
    fi
}

# Test 7: Check port accessibility
test_ports() {
    print_test "Checking port accessibility"
    local ports_ok=true
    
    # Test application port
    if nc -z localhost $APP_PORT 2>/dev/null; then
        print_pass "Application port $APP_PORT is accessible"
    else
        print_fail "Application port $APP_PORT is not accessible"
        ports_ok=false
    fi
    
    # Test Nginx port
    if nc -z localhost $NGINX_PORT 2>/dev/null; then
        print_pass "Nginx port $NGINX_PORT is accessible"
    else
        print_fail "Nginx port $NGINX_PORT is not accessible"
        ports_ok=false
    fi
    
    return $([ "$ports_ok" = true ])
}

# Test 8: Check HTTP response
test_http_response() {
    print_test "Checking HTTP response"
    local response_code=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:$NGINX_PORT 2>/dev/null || echo "000")
    
    if [ "$response_code" == "200" ]; then
        print_pass "HTTP response successful (200)"
        return 0
    elif [ "$response_code" == "000" ]; then
        print_fail "No HTTP response (connection failed)"
        return 1
    else
        print_warn "HTTP response code: $response_code"
        return 1
    fi
}

# Test 9: Check firewall configuration
test_firewall() {
    print_test "Checking firewall configuration"
    if command -v ufw &> /dev/null; then
        if ufw status | grep -q "Status: active"; then
            print_pass "UFW firewall is active"
            local ports_allowed=true
            
            if ufw status | grep -q "$NGINX_PORT"; then
                print_pass "Port $NGINX_PORT is allowed in firewall"
            else
                print_warn "Port $NGINX_PORT may not be allowed in firewall"
                ports_allowed=false
            fi
            
            return $([ "$ports_allowed" = true ])
        else
            print_warn "UFW firewall is not active"
            return 0
        fi
    elif command -v firewall-cmd &> /dev/null; then
        if firewall-cmd --state &>/dev/null; then
            print_pass "Firewalld is active"
            return 0
        else
            print_warn "Firewalld is not active"
            return 0
        fi
    else
        print_warn "No supported firewall found"
        return 0
    fi
}

# Test 10: Check log files
test_logs() {
    print_test "Checking log files"
    local logs_ok=true
    
    if [ -f "/var/log/$APP_NAME/app.log" ]; then
        print_pass "Application log file exists"
    else
        print_warn "Application log file not found"
        logs_ok=false
    fi
    
    if [ -f "/var/log/$APP_NAME/nginx_access.log" ]; then
        print_pass "Nginx access log exists"
    else
        print_warn "Nginx access log not found"
        logs_ok=false
    fi
    
    return $([ "$logs_ok" = true ])
}

# Main test execution
main() {
    echo "=============================================="
    echo -e "${BLUE}🧪 NEBULA FABRIC ORCHESTRATOR TEST SUITE${NC}"
    echo "=============================================="
    echo ""
    
    run_test test_user_exists
    run_test test_directories
    run_test test_nodejs
    run_test test_app_files
    run_test test_systemd_service
    run_test test_nginx
    run_test test_ports
    run_test test_http_response
    run_test test_firewall
    run_test test_logs
    
    echo ""
    echo "=============================================="
    echo -e "${BLUE}📊 TEST RESULTS${NC}"
    echo "=============================================="
    echo "Total Tests: $test_count"
    echo -e "Passed: ${GREEN}$pass_count${NC}"
    echo -e "Failed: ${RED}$fail_count${NC}"
    
    if [ $fail_count -eq 0 ]; then
        echo ""
        echo -e "${GREEN}🎉 ALL TESTS PASSED! Installation is successful.${NC}"
        
        # Get server IP
        SERVER_IP=$(ip route get 1.1.1.1 | grep -oP 'src \K\S+' 2>/dev/null || hostname -I | awk '{print $1}')
        echo ""
        echo -e "${BLUE}🌐 Access your application at:${NC}"
        echo "   http://$SERVER_IP"
        echo ""
        exit 0
    else
        echo ""
        echo -e "${RED}❌ Some tests failed. Please check the installation.${NC}"
        echo ""
        echo -e "${YELLOW}💡 Troubleshooting tips:${NC}"
        echo "1. Check service logs: sudo journalctl -u $APP_NAME -n 20"
        echo "2. Verify Nginx status: sudo systemctl status nginx"
        echo "3. Check firewall rules: sudo ufw status"
        echo "4. Review installation logs in /var/log/"
        echo ""
        exit 1
    fi
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
    print_warn "Running tests as root. Some tests may not reflect actual user permissions."
fi

# Install netcat if not available (for port testing)
if ! command -v nc &> /dev/null; then
    print_test "Installing netcat for port testing..."
    if command -v apt &> /dev/null; then
        sudo apt install -y netcat-openbsd &>/dev/null
    elif command -v yum &> /dev/null; then
        sudo yum install -y nc &>/dev/null
    fi
fi

main "$@"
