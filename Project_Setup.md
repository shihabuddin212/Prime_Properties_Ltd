# Prime Properties BD — Complete Project & Deployment Guide

## Tech Stack
- **Framework:** Next.js 16 (App Router, Turbopack)
- **Database:** SQLite via Prisma ORM
- **Auth:** NextAuth.js (Credentials Provider)
- **Styling:** Tailwind CSS v4
- **Language:** TypeScript
- **Server:** Ubuntu VPS (msonline@103.60.205.230)
- **Domain:** www.primepropertiesbd.com
- **GitHub:** https://github.com/shihabuddin212/Prime_Properties_Ltd

---

## ✅ Local Development Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Set up the database
```bash
npx prisma generate
npx prisma db push
node prisma/seed.js
```

### 3. Create `.env` file (in root directory)
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="primepropertiesbdsecretkeytoken123456"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_HERO_VIDEO_URL="/hero-building.mp4"
```

### 4. Run development server
```bash
npm run dev
```
➡ Opens at: **http://localhost:3000**

---

## 🔑 Admin Dashboard

| URL | Description |
|-----|-------------|
| `/admin/login` | Admin login page |
| `/admin` | Dashboard overview |
| `/admin/properties` | Manage properties |
| `/admin/leads` | View & manage leads |
| `/admin/messages` | Inbox (contact + newsletter + landowner) |
| `/admin/chatbot` | Manage chatbot FAQs |
| `/admin/gallery` | Gallery albums |
| `/admin/special-offers` | Special offers section |
| `/admin/construction` | Construction progress |
| `/admin/customer-say` | Testimonials |

**Default Admin Credentials:**
- Email: `arif@primepropertiesbd.com`
- Password: `admin@primeproperties`

---

## 🔁 Push Code Updates to GitHub

After making changes locally:
```bash
git add .
git commit -m "your commit message"
git push origin main
```

---

## 🚀 A-TO-Z VPS PRODUCTION DEPLOYMENT GUIDE
### Server: Ubuntu — SSH: msonline@103.60.205.230
### Domain: www.primepropertiesbd.com

---

### STEP 1 — SSH into Your VPS

```bash
ssh msonline@103.60.205.230
```

---

### STEP 2 — Install Required System Packages (First Time Only)

```bash
sudo apt update && sudo apt upgrade -y

# Install Node.js v20 (LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify Node.js and npm versions
node -v    # Should be v20+
npm -v

# Install PM2 (process manager to keep app alive)
sudo npm install -g pm2

# Install Git
sudo apt install -y git

# Install Nginx
sudo apt install -y nginx

# Install Certbot for SSL (Let's Encrypt)
sudo apt install -y certbot python3-certbot-nginx
```

---

### STEP 3 — Clone the Project from GitHub

```bash
# Navigate to your web projects folder
cd /var/www

# Clone the repository
sudo git clone https://github.com/shihabuddin212/Prime_Properties_Ltd.git primepropertiesbd

# Set proper ownership
sudo chown -R msonline:msonline /var/www/primepropertiesbd

# Enter the project folder
cd /var/www/primepropertiesbd
```

---

### STEP 4 — Create the Production `.env` File on Server

```bash
nano /var/www/primepropertiesbd/.env
```

Paste this inside (edit values as needed):
```env
DATABASE_URL="file:./prisma/prod.db"
NEXTAUTH_SECRET="YOUR_STRONG_RANDOM_SECRET_HERE_MIN_32_CHARS"
NEXTAUTH_URL="https://www.primepropertiesbd.com"
NEXT_PUBLIC_HERO_VIDEO_URL="/hero-building.mp4"
```

> ⚠️ **IMPORTANT:** Change `NEXTAUTH_SECRET` to a secure random string. Generate one with:
> ```bash
> openssl rand -base64 32
> ```

Save: `Ctrl+X → Y → Enter`

---

### STEP 5 — Install Dependencies & Build the App

```bash
cd /var/www/primepropertiesbd

# Install all npm packages
npm install

# Generate Prisma client
npx prisma generate

# Push the database schema (creates prod.db)
npx prisma db push

# Seed the database (creates admin user + demo data)
node prisma/seed.js

# Build the production bundle
npm run build
```

> 🕐 The build may take 1–3 minutes. Wait until you see "Exit code: 0".

---

### STEP 6 — Start the App with PM2

```bash
cd /var/www/primepropertiesbd

# Start app on port 3000
pm2 start npm --name "primepropertiesbd" -- start

# Save PM2 list so it auto-restarts on server reboot
pm2 save

# Enable PM2 startup on server boot
pm2 startup
# → Copy and run the command it shows you (starts with sudo env...)
```

**Verify the app is running:**
```bash
pm2 status
pm2 logs primepropertiesbd --lines 30
```

The app should be running on `http://localhost:3000` on the server.

---

### STEP 7 — Configure Nginx as Reverse Proxy

```bash
sudo nano /etc/nginx/sites-available/primepropertiesbd
```

Paste this full configuration:
```nginx
server {
    listen 80;
    listen [::]:80;
    server_name primepropertiesbd.com www.primepropertiesbd.com;

    # Max upload size (for image uploads in admin)
    client_max_body_size 50M;

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

Save: `Ctrl+X → Y → Enter`

```bash
# Enable the config (symlink to sites-enabled)
sudo ln -s /etc/nginx/sites-available/primepropertiesbd /etc/nginx/sites-enabled/

# Test nginx config syntax
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

---

### STEP 8 — Point Domain DNS to Your VPS (Namecheap / cPanel / Domain Registrar)

Go to your domain registrar's DNS settings and set:

| Type | Host | Value | TTL |
|------|------|-------|-----|
| A | `@` | `103.60.205.230` | 300 |
| A | `www` | `103.60.205.230` | 300 |
| CNAME | `www` | `primepropertiesbd.com` | 300 |

> ⏳ DNS changes take 5 minutes to 24 hours to propagate globally.
> Test with: `ping primepropertiesbd.com` from your local machine.

---

### STEP 9 — Install Free SSL Certificate (HTTPS) with Let's Encrypt

```bash
# Get SSL certificate for both www and non-www
sudo certbot --nginx -d primepropertiesbd.com -d www.primepropertiesbd.com
```

Follow the prompts:
- Enter your email address
- Agree to terms (type `Y`)
- Select `2` to redirect HTTP → HTTPS automatically

```bash
# Verify SSL auto-renewal works
sudo certbot renew --dry-run
```

After this, Certbot automatically updates your Nginx config. Verify:
```bash
sudo nginx -t
sudo systemctl reload nginx
```

✅ Your site is now live at: **https://www.primepropertiesbd.com**

---

### STEP 10 — Force www.primepropertiesbd.com (Redirect non-www to www)

After Certbot runs, open the Nginx config again:
```bash
sudo nano /etc/nginx/sites-available/primepropertiesbd
```

Make sure the final config looks like this (Certbot usually adds SSL blocks automatically):
```nginx
# Redirect HTTP → HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name primepropertiesbd.com www.primepropertiesbd.com;
    return 301 https://www.primepropertiesbd.com$request_uri;
}

# Redirect non-www HTTPS → www HTTPS
server {
    listen 443 ssl;
    server_name primepropertiesbd.com;
    ssl_certificate /etc/letsencrypt/live/primepropertiesbd.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/primepropertiesbd.com/privkey.pem;
    return 301 https://www.primepropertiesbd.com$request_uri;
}

# Main HTTPS server block (www)
server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name www.primepropertiesbd.com;

    ssl_certificate /etc/letsencrypt/live/primepropertiesbd.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/primepropertiesbd.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    client_max_body_size 50M;

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

Save and reload:
```bash
sudo nginx -t
sudo systemctl reload nginx
```

---

### STEP 11 — Firewall Rules (Allow Web Traffic)

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status
```

---

## 🔄 How to Update the Site (After Code Changes)

When you push new code to GitHub, pull and rebuild on the server:

```bash
ssh msonline@103.60.205.230

cd /var/www/primepropertiesbd

# Pull latest code
git pull origin main

# Install any new packages
npm install

# Regenerate Prisma client (if schema changed)
npx prisma generate
npx prisma db push

# Rebuild the Next.js app
npm run build

# Restart the PM2 process
pm2 restart primepropertiesbd

# Check it's running
pm2 status
```

---

## 🗄️ Database Commands

| Command | Description |
|---------|-------------|
| `npx prisma db push` | Sync schema to database |
| `npx prisma generate` | Regenerate Prisma client |
| `npx prisma studio` | Visual DB browser (localhost:5555) |
| `node prisma/seed.js` | Re-seed (creates admin + demo data) |

---

## 🔧 PM2 Useful Commands

| Command | Description |
|---------|-------------|
| `pm2 status` | Check running processes |
| `pm2 logs primepropertiesbd` | View live logs |
| `pm2 restart primepropertiesbd` | Restart the app |
| `pm2 stop primepropertiesbd` | Stop the app |
| `pm2 delete primepropertiesbd` | Remove from PM2 |

---

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| Site not loading after deploy | Run `pm2 status` — check if app is running |
| PM2 shows "errored" | Run `pm2 logs primepropertiesbd` to see the error |
| Nginx 502 Bad Gateway | App crashed — run `pm2 restart primepropertiesbd` |
| SSL not working | Run `sudo certbot renew` and reload nginx |
| Database errors on server | Run `npx prisma db push` then `node prisma/seed.js` |
| Admin login fails | Re-run `node prisma/seed.js` to reset credentials |
| 413 error (file too large) | Increase `client_max_body_size` in nginx config |
| DNS not resolving | Check A record points to `103.60.205.230`, wait up to 24hrs |
| Port 3000 in use | `pm2 delete all` then restart with `pm2 start npm --name "primepropertiesbd" -- start` |
