FROM php:8.2-apache

WORKDIR /var/www/project

# install dependencies
RUN apt-get update \
    && apt-get install -y curl apt-transport-https ca-certificates gnupg \
    && curl -1sLf 'https://dl.cloudsmith.io/public/symfony/stable/setup.deb.sh' | bash \
    && apt-get update \
    && apt-get install -y symfony-cli git zip libicu-dev zlib1g-dev g++

# install php extensions
RUN docker-php-ext-install pdo pdo_mysql bcmath \
    && docker-php-ext-configure intl && docker-php-ext-install intl

# install composer
COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer

# enable apache2 modules
RUN a2enmod rewrite
