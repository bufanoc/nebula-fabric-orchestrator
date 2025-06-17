
# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/0e25ace9-709e-46e7-b43c-2f6904650991

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/0e25ace9-709e-46e7-b43c-2f6904650991) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## Production Deployment on Ubuntu 22.04.5

### Quick Installation

For Ubuntu 22.04.5 server deployment, use the automated installation script:

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# Make the install script executable and run it
chmod +x install.sh
./install.sh
```

The installation script will:
- Install all prerequisites (Node.js, Nginx, etc.)
- Build the application for production
- Configure Nginx as a web server
- Set up proper security headers
- Run comprehensive tests to verify the installation
- Display the server IP address where the app is accessible

### Manual Installation

If you prefer manual installation:

```bash
# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs nginx

# Install dependencies and build
npm install
npm run build

# Configure Nginx (see install.sh for full configuration)
sudo cp dist/* /var/www/html/
sudo systemctl enable nginx
sudo systemctl start nginx
```

### Uninstallation

To completely remove the application:

```bash
# Run the uninstall script
sudo ./uninstall.sh
```

Or if installed to `/opt/nebula-fabric-orchestrator`:

```bash
sudo /opt/nebula-fabric-orchestrator/uninstall.sh
```

### Features of the Installation Scripts

**install.sh:**
- ✅ Automatic prerequisite checking and installation
- ✅ Secure user creation and file permissions
- ✅ Production-optimized Nginx configuration
- ✅ Comprehensive testing suite
- ✅ Error handling and rollback capabilities
- ✅ Network IP detection and accessibility confirmation

**uninstall.sh:**
- ✅ Complete application removal
- ✅ User account cleanup
- ✅ Nginx configuration restoration
- ✅ Verification of successful removal
- ✅ Preservation of system dependencies

### System Requirements

- Ubuntu 22.04.5 LTS
- 2GB RAM minimum
- 1GB free disk space
- Internet connection for package downloads
- sudo privileges

### Troubleshooting

If installation fails:
1. Check system logs: `sudo journalctl -u nginx`
2. Verify Node.js version: `node --version` (should be 16+)
3. Test Nginx configuration: `sudo nginx -t`
4. Check application accessibility: `curl http://localhost`

For support, check the installation logs or contact the development team.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/0e25ace9-709e-46e7-b43c-2f6904650991) and click on Share → Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

---
*Last updated: Synced to main branch*
