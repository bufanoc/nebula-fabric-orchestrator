
# Deployment Guide - Nebula Fabric Orchestrator

## 🚀 Quick Start Installation

### Prerequisites Check
Before running the installation script, ensure you have:
- Ubuntu 18.04+ or CentOS 7+ server
- Sudo privileges on the target system
- Internet connectivity for package downloads
- At least 2GB RAM and 5GB disk space

### One-Command Installation
```bash
curl -fsSL https://raw.githubusercontent.com/bufanoc/nebula-fabric-orchestrator/main/install.sh | bash
```

Or download and run manually:
```bash
wget https://raw.githubusercontent.com/bufanoc/nebula-fabric-orchestrator/main/install.sh
chmod +x install.sh
./install.sh
```

## 📋 What the Installation Script Does

### 1. System Prerequisites
- Updates system packages
- Installs Node.js 20.x LTS
- Installs Nginx web server
- Installs security tools (ufw/firewalld, fail2ban)
- Installs monitoring tools (htop, tree)

### 2. Application Setup  
- Creates dedicated `nebula` user for security
- Sets up directory structure in `/opt/nebula-fabric-orchestrator`
- Clones the application from GitHub
- Installs Node.js dependencies
- Builds the production application

### 3. Web Server Configuration
- Configures Nginx as reverse proxy
- Sets up SSL-ready configuration
- Implements security headers
- Configures static asset caching
- Sets up logging

### 4. System Service
- Creates systemd service for auto-start
- Configures service restart policies
- Sets up application logging
- Implements security restrictions

### 5. Security Configuration
- Configures firewall rules (ports 80, 22, 8080)
- Enables fail2ban for SSH protection
- Sets up proper file permissions
- Implements service isolation

## 🔧 Post-Installation Configuration

### Accessing the Application
After successful installation, access the application at:
- **Primary URL:** `http://YOUR_SERVER_IP`
- **Direct Access:** `http://YOUR_SERVER_IP:8080`

### Service Management
```bash
# Check application status
sudo systemctl status nebula-fabric-orchestrator

# Start/stop/restart the application
sudo systemctl start nebula-fabric-orchestrator
sudo systemctl stop nebula-fabric-orchestrator
sudo systemctl restart nebula-fabric-orchestrator

# View application logs
sudo journalctl -u nebula-fabric-orchestrator -f

# Check Nginx status
sudo systemctl status nginx
```

### Log Files
- **Application Logs:** `/var/log/nebula-fabric-orchestrator/app.log`
- **Error Logs:** `/var/log/nebula-fabric-orchestrator/app_error.log`
- **Nginx Logs:** `/var/log/nebula-fabric-orchestrator/nginx_access.log`

## 🔒 Security Considerations

### Default Security Settings
- Application runs as non-root user (`nebula`)
- Firewall configured with minimal required ports
- Nginx security headers enabled
- Service isolation and sandboxing
- No default authentication (requires setup)

### Recommended Security Enhancements

#### 1. SSL/TLS Certificate
```bash
# Install Certbot for Let's Encrypt
sudo apt install certbot python3-certbot-nginx

# Obtain SSL certificate (replace domain.com)
sudo certbot --nginx -d your-domain.com

# Auto-renewal (already configured by certbot)
sudo crontab -l | grep certbot
```

#### 2. Additional Firewall Rules
```bash
# Restrict SSH to specific IPs (replace with your IP)
sudo ufw delete allow ssh
sudo ufw allow from YOUR_IP_ADDRESS to any port 22

# Enable rate limiting
sudo ufw limit ssh
```

#### 3. Fail2Ban Configuration
```bash
# Check fail2ban status
sudo fail2ban-client status

# View banned IPs
sudo fail2ban-client status sshd
```

## 🐛 Troubleshooting

### Common Issues

#### Installation Fails
1. Check system requirements (RAM, disk space)
2. Verify internet connectivity
3. Ensure sudo privileges
4. Check for conflicting services on ports 80/8080

#### Application Won't Start
```bash
# Check service status
sudo systemctl status nebula-fabric-orchestrator

# View detailed logs
sudo journalctl -u nebula-fabric-orchestrator -n 50

# Check if port is in use
sudo netstat -tlnp | grep :8080

# Restart the service
sudo systemctl restart nebula-fabric-orchestrator
```

#### Nginx Issues
```bash
# Test nginx configuration
sudo nginx -t

# Check nginx status
sudo systemctl status nginx

# View nginx error logs
sudo tail -f /var/log/nginx/error.log
```

#### Firewall Problems
```bash
# Check firewall status
sudo ufw status verbose

# Reset firewall (if needed)
sudo ufw --force reset
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 80
```

### Performance Tuning

#### For High Traffic
```bash
# Increase Nginx worker processes
sudo nano /etc/nginx/nginx.conf
# Set worker_processes to number of CPU cores

# Optimize application
# In /opt/nebula-fabric-orchestrator
sudo -u nebula npm run build -- --mode production
```

#### For Limited Resources
```bash
# Reduce Nginx worker processes
sudo nano /etc/nginx/nginx.conf
# Set worker_processes 1

# Configure swap if needed
sudo fallocate -l 1G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

## 🔄 Updates and Maintenance

### Updating the Application
```bash
# Switch to application directory
cd /opt/nebula-fabric-orchestrator

# Pull latest changes (as nebula user)
sudo -u nebula git pull origin main

# Install any new dependencies
sudo -u nebula npm install

# Rebuild the application
sudo -u nebula npm run build

# Restart the service
sudo systemctl restart nebula-fabric-orchestrator
```

### System Maintenance
```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Clean old log files (keep last 30 days)
sudo find /var/log/nebula-fabric-orchestrator -name "*.log" -mtime +30 -delete

# Check disk usage
df -h
sudo du -sh /opt/nebula-fabric-orchestrator
```

### Backup Procedures
```bash
# Create backup directory
sudo mkdir -p /backup/nebula-fabric-orchestrator

# Backup application files
sudo tar -czf /backup/nebula-fabric-orchestrator/app-$(date +%Y%m%d).tar.gz \
  -C /opt nebula-fabric-orchestrator

# Backup configuration files
sudo tar -czf /backup/nebula-fabric-orchestrator/config-$(date +%Y%m%d).tar.gz \
  /etc/nginx/sites-available/nebula-fabric-orchestrator \
  /etc/systemd/system/nebula-fabric-orchestrator.service
```

## 📊 Monitoring and Health Checks

### Built-in Health Checks
The installation includes automated health monitoring:

```bash
# Manual health check
curl -f http://localhost || echo "Application not responding"

# Check all services
systemctl is-active nebula-fabric-orchestrator nginx
```

### Log Monitoring
```bash
# Real-time application logs
sudo journalctl -u nebula-fabric-orchestrator -f

# Search for errors
sudo journalctl -u nebula-fabric-orchestrator | grep -i error

# Check Nginx access patterns
sudo tail -f /var/log/nebula-fabric-orchestrator/nginx_access.log
```

---

**Need Help?** Check the `AI_DEVELOPMENT_NOTES.md` for technical details or create an issue in the GitHub repository.
