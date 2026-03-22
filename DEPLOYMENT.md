# Production Deployment Guide

## Domain: app.godeepafricasafari.com

### 1. Backend Setup (Laravel)

#### Environment Variables (.env)
Update your `.env` file on the server with these values:

```env
APP_NAME="Deep Africa Safari"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://app.godeepafricasafari.com

# Database (Use your cPanel MySQL credentials)
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database_name
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password

# Session (Important for cross-origin)
SESSION_DRIVER=database
SESSION_SECURE_COOKIE=true
SESSION_SAME_SITE=none
SESSION_DOMAIN=.godeepafricasafari.com

# Sanctum
SANCTUM_STATEFUL_DOMAINS=app.godeepafricasafari.com
```

#### Commands to Run on Server
```bash
# Navigate to backend directory
cd /path/to/backend

# Install dependencies
composer install --no-dev --optimize-autoloader

# Generate app key
php artisan key:generate

# Run migrations
php artisan migrate --force

# Create storage link
php artisan storage:link

# Clear and cache config
php artisan config:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Set permissions
chmod -R 775 storage
chmod -R 775 bootstrap/cache
```

### 2. Frontend Setup (React/Vite)

#### Build for Production
```bash
# Navigate to project root
cd /path/to/savanna-bloom

# Install dependencies
npm install

# Build production bundle
npm run build
```

The built files will be in the `out` directory.

### 3. cPanel Configuration

#### Subdomain Setup
1. Create subdomain `app` in cPanel
2. Document root should point to `out` directory (or serve via Node.js)

#### API Proxy (if using Apache)
Create `.htaccess` in the frontend root:

```apache
# Proxy API requests to backend
RewriteEngine On
RewriteRule ^api/(.*)$ https://app.godeepafricasafari.com/api/$1 [P,L]
RewriteRule ^storage/(.*)$ https://app.godeepafricasafari.com/storage/$1 [P,L]
RewriteRule ^sanctum/(.*)$ https://app.godeepafricasafari.com/sanctum/$1 [P,L]
```

### 4. SSL Certificate
- Enable HTTPS in cPanel
- Use Let's Encrypt for free SSL certificate
- Ensure all requests use HTTPS

### 5. File Structure on Server

```
public_html/
├── app/                    # Frontend (React build output)
│   ├── index.html
│   ├── assets/
│   └── ...
├── backend/                # Laravel Backend
│   ├── app/
│   ├── bootstrap/
│   ├── config/
│   ├── database/
│   ├── public/
│   ├── storage/
│   │   └── app/public/     # Uploaded images
│   └── ...
└── .htaccess
```

### 6. Storage Paths

Images are served from:
- `/storage/hero/hero-safari.jpg`
- `/storage/gallery/elephant.jpg`
- `/storage/safaris/serengeti.jpg`
- etc.

### 7. Troubleshooting

#### CORS Issues
- Verify `cors.php` includes your domain
- Check `SANCTUM_STATEFUL_DOMAINS` in `.env`

#### Session Issues
- Ensure `SESSION_SECURE_COOKIE=true` for HTTPS
- Check `SESSION_DOMAIN=.godeepafricasafari.com`

#### Images Not Loading
- Run `php artisan storage:link`
- Check storage permissions (775)
- Verify images exist in `storage/app/public/`
