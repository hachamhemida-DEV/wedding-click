#!/bin/bash
set -e

echo "🚀 Starting Wedding Click Update..."

PROJECT_DIR="/var/www/wedding-click"
cd "$PROJECT_DIR"

echo "📥 Pulling latest changes from GitHub..."
git pull origin main

echo "⚙️ Updating Laravel Backend..."
cd "$PROJECT_DIR/backend"
composer install --no-dev --optimize-autoloader
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache

echo "🔄 Restarting Reverb WebSockets..."
sudo supervisorctl restart reverb:*

echo "💻 Building and Restarting Next.js Frontend..."
cd "$PROJECT_DIR/frontend"
npm install --production=false
npm run build
pm2 restart wedding-frontend

echo "✅ Deployment updated successfully!"
