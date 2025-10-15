# Dockerfile

# STAGE 1: Build Frontend Assets
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Use the official PHP 8.2 FPM image on Alpine Linux for a smaller footprint
FROM php:8.2-fpm-alpine

# Set working directory
WORKDIR /var/www

# Install system dependencies needed for Laravel
# libzip, oniguruma for zip/mbstring; gd for image processing; postgresql/mysql clients for db access
RUN apk add --no-cache \
    curl \
    libzip-dev \
    zip \
    oniguruma-dev \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    gd \
    mysql-client

# Install PHP extensions required by Laravel
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip

# Install Composer globally
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy existing application directory contents
COPY . .

# Copy environment file for Docker, if it exists
# We will manage .env variables properly with docker-compose
COPY .env.example .env

# Set correct permissions for storage and bootstrap/cache directories
# The user 'www-data' is the default user for php-fpm
RUN chown -R www-data:www-data storage bootstrap/cache

# Expose port 9000 and start php-fpm server
EXPOSE 9000
CMD ["php-fpm"]