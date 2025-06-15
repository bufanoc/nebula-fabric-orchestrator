
# Nebula Fabric Orchestrator - Deployment README

## 🚀 Quick Deploy

```bash
curl -fsSL https://raw.githubusercontent.com/bufanoc/nebula-fabric-orchestrator/main/install.sh | bash
```

## 📋 What This Repository Contains

This is a **React-based web application** for managing XenServer hosts and VXLAN networks. The application provides a comprehensive dashboard for:

- **XenServer Host Management** - Connect and manage multiple XenServer hosts
- **VXLAN Network Orchestration** - Create and manage overlay networks  
- **Virtual Machine Management** - Control VM lifecycle and configurations
- **Multi-Tenant Support** - Isolated environments with resource quotas
- **Network Topology Visualization** - Visual network mapping and monitoring

## 🏗️ Architecture

**Frontend:** React + TypeScript + Vite + Tailwind CSS + shadcn/ui  
**Backend:** Currently simulated (ready for Supabase integration)  
**Deployment:** Nginx reverse proxy + systemd service  
**Security:** Dedicated user, firewall rules, service isolation  

## 📦 Installation Files

### Core Installation
- `install.sh` - Main installation script with full automation
- `test-installation.sh` - Comprehensive test suite to validate deployment
- `uninstall.sh` - Complete removal script

### Documentation
- `docs/AI_DEVELOPMENT_NOTES.md` - Comprehensive technical documentation for AI developers
- `docs/DEPLOYMENT_GUIDE.md` - Detailed deployment and maintenance guide

## 🎯 Installation Process

The automated installer will:

1. **System Setup**
   - Install Node.js 20.x LTS
   - Install and configure Nginx
   - Set up security tools (firewall, fail2ban)

2. **Application Deployment**
   - Create dedicated `nebula` user
   - Clone and build the application
   - Configure systemd service for auto-start

3. **Security Configuration**
   - Configure firewall (ports 22, 80, 8080)
   - Set up service isolation and permissions
   - Enable security headers in Nginx

4. **Validation**
   - Run comprehensive tests
   - Verify all services are running
   - Display access information

## 🔧 Post-Installation

### Access URLs
- **Primary:** `http://YOUR_SERVER_IP` (via Nginx)
- **Direct:** `http://YOUR_SERVER_IP:8080` (application port)

### Service Management
```bash
# Check status
sudo systemctl status nebula-fabric-orchestrator

# View logs  
sudo journalctl -u nebula-fabric-orchestrator -f

# Restart service
sudo systemctl restart nebula-fabric-orchestrator
```

### File Locations
- **Application:** `/opt/nebula-fabric-orchestrator`
- **Logs:** `/var/log/nebula-fabric-orchestrator`
- **Config:** `/etc/nebula-fabric-orchestrator`

## ⚠️ Important Notes

### Current Status
- **Frontend:** Fully functional with complete UI/UX
- **Backend:** All operations are **simulated** (no real XenServer connections)
- **Authentication:** None (open access)
- **Data:** No persistence (resets on refresh)

### For Production Use
To connect to real XenServer infrastructure, you need:
1. **Supabase Integration** - For backend services and database
2. **XenServer API Implementation** - Replace simulated calls with real API
3. **Authentication System** - User management and access control
4. **SSL Certificate** - HTTPS encryption for production

## 🧪 Testing

Run the test suite after installation:
```bash
curl -fsSL https://raw.githubusercontent.com/bufanoc/nebula-fabric-orchestrator/main/test-installation.sh | bash
```

Tests verify:
- ✅ System prerequisites
- ✅ Application files and build
- ✅ Services running (app + nginx)
- ✅ Port accessibility
- ✅ HTTP response codes
- ✅ Security configuration

## 📚 Documentation

### For Users
- `docs/DEPLOYMENT_GUIDE.md` - Complete deployment and maintenance guide
- Built-in help system in the web application

### For Developers  
- `docs/AI_DEVELOPMENT_NOTES.md` - Comprehensive technical documentation
- Includes architecture, component structure, and future development roadmap
- Perfect for AI agents continuing development

## 🔄 Updates

```bash
cd /opt/nebula-fabric-orchestrator
sudo -u nebula git pull origin main
sudo -u nebula npm install
sudo -u nebula npm run build
sudo systemctl restart nebula-fabric-orchestrator
```

## 🗑️ Removal

```bash
curl -fsSL https://raw.githubusercontent.com/bufanoc/nebula-fabric-orchestrator/main/uninstall.sh | bash
```

## 🆘 Troubleshooting

### Common Issues
- **Port conflicts:** Check if ports 80/8080 are in use
- **Permission errors:** Ensure sudo privileges
- **Build failures:** Verify Node.js installation and internet connectivity
- **Service issues:** Check logs with `sudo journalctl -u nebula-fabric-orchestrator`

### Getting Help
1. Check the deployment guide: `docs/DEPLOYMENT_GUIDE.md`
2. Run the test suite: `test-installation.sh`
3. Review service logs
4. Create an issue in the GitHub repository

---

**Ready to deploy?** Run the one-line installer above and access your XenServer management dashboard in minutes! 🚀
