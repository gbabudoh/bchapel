# Battersea Chapel Website

A modern church website built with Next.js, featuring admin management, authentication, and dynamic content management.

## Features

- 🏛️ Church information and leadership pages
- 📅 Events management
- 💰 Giving/donations system
- 📧 Contact forms
- 👥 Admin dashboard with authentication
- 📱 Responsive design
- 🗄️ SQLite database
- 🔐 NextAuth.js authentication

## Tech Stack

- **Frontend**: Next.js 15, React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: SQLite
- **Authentication**: NextAuth.js
- **Icons**: Lucide React
- **Styling**: Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Local Development

1. Clone the repository:
```bash
git clone <repository-url>
cd bchapel3
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your configuration:
```env
# Database
DATABASE_URL=./database.sqlite

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Email Configuration (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# PayPal Configuration (optional)
NEXT_PUBLIC_PAYPAL_EMAIL=your-paypal@email.com
```

4. Initialize the database:
```bash
npm run reset-admin
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Deployment

### 1. Deploy on Vercel (Testing/Staging)

Vercel is perfect for testing and staging deployments.

#### Step 1: Prepare Your Repository
```bash
# Make sure your code is committed to Git
git add .
git commit -m "Ready for deployment"
git push origin main
```

#### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "New Project"
3. Import your repository
4. Configure environment variables in Vercel dashboard:
   - `NEXTAUTH_URL`: `https://your-app-name.vercel.app`
   - `NEXTAUTH_SECRET`: Generate a secure random string
   - Add other environment variables as needed

#### Step 3: Database Considerations for Vercel
⚠️ **Important**: Vercel's serverless environment doesn't support persistent SQLite files.

**Options for Vercel:**
- **Option A**: Use Vercel Postgres or another cloud database
- **Option B**: Use Turso (SQLite-compatible cloud database)
- **Option C**: Deploy to VPS for full SQLite support (recommended)

#### Step 4: Deploy
```bash
# Vercel will automatically deploy on git push
git push origin main
```

### 2. Deploy on Contabo VPS (Production)

This is the recommended approach for production with SQLite database.

#### Prerequisites on VPS
- Ubuntu server with CloudPanel installed
- Node.js 18+ installed
- PM2 process manager
- Nginx (usually included with CloudPanel)

#### Step 1: Server Setup

1. **SSH into your Contabo VPS:**
```bash
ssh root@your-server-ip
```

2. **Install Node.js 18+ (if not already installed):**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

3. **Install PM2 globally:**
```bash
npm install -g pm2
```

4. **Create application directory:**
```bash
mkdir -p /var/www/bchapel3
cd /var/www/bchapel3
```

#### Step 2: Deploy Application

1. **Clone your repository:**
```bash
git clone <your-repository-url> .
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create production environment file:**
```bash
cp .env.local.example .env.local
```

Edit the environment file:
```bash
nano .env.local
```

```env
# Database
DATABASE_URL=./database.sqlite

# NextAuth Configuration
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-production-secret-key

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# PayPal Configuration
NEXT_PUBLIC_PAYPAL_EMAIL=your-paypal@email.com
```

4. **Build the application:**
```bash
npm run build
```

5. **Initialize the database:**
```bash
npm run reset-admin
```

6. **Set proper permissions:**
```bash
chown -R www-data:www-data /var/www/bchapel3
chmod -R 755 /var/www/bchapel3
chmod 664 /var/www/bchapel3/database.sqlite
```

#### Step 3: Configure PM2

1. **Create PM2 ecosystem file:**
```bash
nano ecosystem.config.js
```

```javascript
module.exports = {
  apps: [{
    name: 'bchapel3',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/bchapel3',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
```

2. **Start the application with PM2:**
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

#### Step 4: Configure CloudPanel/Nginx

1. **Access CloudPanel dashboard** (usually at `https://your-server-ip:8443`)

2. **Create a new website:**
   - Domain: `your-domain.com`
   - Document Root: `/var/www/bchapel3`

3. **Configure reverse proxy in CloudPanel:**
   - Go to your website settings
   - Add reverse proxy rule:
     - Path: `/`
     - Proxy Pass: `http://localhost:3000`

4. **Alternative: Manual Nginx configuration:**
```bash
nano /etc/nginx/sites-available/bchapel3
```

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

5. **Enable the site and restart Nginx:**
```bash
ln -s /etc/nginx/sites-available/bchapel3 /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

#### Step 5: SSL Certificate (Let's Encrypt)

1. **Install Certbot:**
```bash
sudo apt install certbot python3-certbot-nginx
```

2. **Get SSL certificate:**
```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

#### Step 6: Database Backup Setup

1. **Create backup script:**
```bash
nano /var/www/bchapel3/backup-db.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
cp /var/www/bchapel3/database.sqlite /var/www/bchapel3/backups/database_$DATE.sqlite
# Keep only last 7 days of backups
find /var/www/bchapel3/backups -name "database_*.sqlite" -mtime +7 -delete
```

2. **Make executable and create backup directory:**
```bash
chmod +x /var/www/bchapel3/backup-db.sh
mkdir -p /var/www/bchapel3/backups
```

3. **Add to crontab for daily backups:**
```bash
crontab -e
```

Add this line:
