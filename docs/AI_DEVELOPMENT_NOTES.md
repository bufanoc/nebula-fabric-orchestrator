
# Nebula Fabric Orchestrator - AI Development Notes

## 📋 Application Overview

**Application Name:** Nebula Fabric Orchestrator  
**Type:** React-based Web Application for XenServer VXLAN Network Management  
**Technology Stack:** React, TypeScript, Vite, Tailwind CSS, shadcn/ui  
**Current Status:** Frontend Complete with Simulated Backend  

## 🎯 Purpose & Functionality

The Nebula Fabric Orchestrator is a comprehensive web-based management platform designed to:

1. **XenServer Host Management**
   - Connect to multiple XenServer hosts
   - Monitor host status and resources
   - Configure host settings and networking

2. **VXLAN Network Orchestration**
   - Create and manage VXLAN overlay networks
   - Provision isolated network segments
   - Configure network policies and routing

3. **Virtual Machine Management**
   - Deploy and manage VMs across XenServer hosts
   - Control VM lifecycle (start, stop, pause, resume)
   - Configure VM networking and resources

4. **Multi-Tenant Support**
   - Isolated tenant environments
   - Quota management and resource allocation
   - Tenant-specific network configurations

5. **Network Topology Visualization**
   - Visual representation of network topology
   - Real-time status monitoring
   - Interactive network diagrams

## 🏗️ Architecture & Components

### Frontend Architecture
```
src/
├── components/
│   ├── dashboard/          # Main dashboard with metrics
│   ├── layout/            # Header, sidebar, navigation
│   ├── xenserver/         # XenServer host management
│   ├── networks/          # VXLAN network management
│   ├── vms/              # Virtual machine management
│   ├── tenants/          # Multi-tenant administration
│   ├── topology/         # Network topology visualization
│   ├── monitoring/       # System monitoring and alerts
│   ├── policies/         # Network policy management
│   └── ui/               # Reusable UI components (shadcn/ui)
├── pages/                # Main application pages
├── hooks/                # Custom React hooks
└── lib/                  # Utility functions
```

### Key Components Explained

**XenServerOnboarding.tsx**
- Handles connection to XenServer hosts
- Validates credentials and connectivity
- Manages host registration and configuration
- **Current State:** Simulated connections with mock data

**VirtualNetworkManagement.tsx**
- VXLAN network creation and management
- Network topology configuration
- VLAN tagging and segmentation
- **Current State:** Simulated VXLAN provisioning

**VMManagement.tsx**
- Virtual machine lifecycle management
- VM resource allocation and configuration
- Network interface management
- **Current State:** Mock VM operations

**TenantManagement.tsx**
- Multi-tenant environment management
- Resource quota enforcement
- Tenant isolation and security
- **Current State:** Simulated tenant operations

## 🔄 Current Implementation Status

### ✅ Completed Features
- Complete UI/UX implementation
- All component interactions functional
- Toast notifications for user feedback
- Responsive design for all screen sizes
- State management for all operations
- Simulated backend operations with realistic delays

### ⚠️ Simulated Components (No Real Backend)
- XenServer API connections (uses timeouts instead of real API calls)
- VXLAN network provisioning (generates mock network IDs)
- VM management operations (simulates power state changes)
- Host monitoring and metrics (displays mock data)
- Tenant resource allocation (calculates but doesn't enforce quotas)

### 🔧 Missing for Production
- **Backend Integration:** All XenServer operations need real API implementation
- **Authentication:** No user authentication system
- **Database:** No persistent data storage
- **Security:** No access controls or secure credential storage
- **Real-time Updates:** No WebSocket or real-time data streaming

## 🚀 Installation & Deployment

### Automated Installation
Run the provided `install.sh` script which:
1. Checks and installs all prerequisites (Node.js, Nginx, system tools)
2. Creates dedicated application user and directories
3. Clones and builds the application
4. Configures Nginx as reverse proxy
5. Sets up systemd service for auto-start
6. Configures firewall rules
7. Runs comprehensive tests

### System Requirements
- **OS:** Ubuntu 18.04+ or CentOS 7+
- **RAM:** Minimum 2GB, Recommended 4GB+
- **Storage:** Minimum 5GB free space
- **Network:** Internet access for package installation
- **Privileges:** Sudo access required

### Default Configuration
- **Web Port:** 80 (Nginx proxy)
- **App Port:** 8080 (Direct application access)
- **User:** `nebula` (dedicated application user)
- **Install Path:** `/opt/nebula-fabric-orchestrator`
- **Logs:** `/var/log/nebula-fabric-orchestrator`

## 🔮 Future Development Path

### Phase 1: Backend Integration
**Priority:** High  
**Effort:** 2-3 weeks  

1. **Supabase Integration**
   - Set up Supabase project for backend services
   - Implement authentication (email/password)
   - Create database schema for hosts, networks, VMs, tenants

2. **XenServer API Integration**
   - Replace mock API calls with real XenAPI connections
   - Implement secure credential storage
   - Add error handling for network failures

### Phase 2: Real Infrastructure Management
**Priority:** High  
**Effort:** 3-4 weeks  

1. **XenServer Host Management**
   - Real host discovery and registration
   - Live resource monitoring
   - Configuration management

2. **VXLAN Network Provisioning**
   - Actual VXLAN tunnel creation
   - Network policy enforcement
   - Cross-host network connectivity

### Phase 3: Enhanced Features
**Priority:** Medium  
**Effort:** 2-3 weeks  

1. **Advanced Monitoring**
   - Real-time metrics collection
   - Performance dashboards
   - Alerting system

2. **Backup & Recovery**
   - Configuration backup
   - Disaster recovery procedures
   - System restoration capabilities

## 🐛 Known Issues & Limitations

### Current Limitations
1. **No Real Backend:** All operations are simulated
2. **No Persistence:** Settings and configurations are lost on refresh
3. **No Authentication:** Open access to all features
4. **Mock Data:** All metrics and status information is generated
5. **No Validation:** XenServer credentials are not actually validated

### Potential Issues for AI Developers
1. **State Management:** Some state might not persist across page refreshes
2. **Error Handling:** Limited error scenarios are currently handled
3. **Performance:** Large datasets might impact UI performance
4. **Browser Compatibility:** Tested primarily on modern browsers

## 🔧 Development Guidelines for AI Agents

### Code Style & Standards
- **TypeScript:** Strict typing enabled, use proper interfaces
- **React:** Functional components with hooks, avoid class components
- **Styling:** Tailwind CSS only, utilize shadcn/ui components
- **State Management:** React useState and useContext, avoid external state libraries
- **Error Handling:** Use toast notifications for user feedback

### Component Development
1. **Keep Components Small:** Max 150 lines per component
2. **Single Responsibility:** Each component should have one clear purpose
3. **Proper TypeScript:** Always define interfaces for props and data
4. **Responsive Design:** All components must work on mobile and desktop
5. **Accessibility:** Include proper ARIA labels and keyboard navigation

### Testing Strategy
1. **UI Testing:** Verify all buttons and interactions work
2. **State Testing:** Confirm state changes reflect in UI
3. **Responsive Testing:** Check all screen sizes
4. **Error Testing:** Test error scenarios and user feedback

### File Organization
- **New Features:** Create dedicated component directories
- **Shared Logic:** Extract to custom hooks in `/hooks`
- **Utilities:** Place helper functions in `/lib`
- **Types:** Define interfaces in component files or separate `.types.ts` files

## 📚 Additional Resources

### XenServer API Documentation
- **XenAPI Reference:** https://docs.citrix.com/en-us/xencenter/current-release/sdk.html
- **XML-RPC Interface:** Primary method for XenServer communication
- **Authentication:** Session-based authentication required

### VXLAN Networking
- **RFC 7348:** VXLAN specification
- **Linux Bridge Configuration:** For host-level networking
- **Open vSwitch:** Advanced networking features

### Supabase Integration
- **Authentication:** https://supabase.com/docs/guides/auth
- **Database:** PostgreSQL with real-time subscriptions
- **Edge Functions:** For server-side XenServer API calls

---

**Last Updated:** 2025-06-15  
**Version:** 1.0.0  
**Maintainer:** AI Development Team  
**Status:** Ready for Backend Integration  
