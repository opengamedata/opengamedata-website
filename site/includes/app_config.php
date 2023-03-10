<?php

class AppConfig
{
    public static function getConfig()
    {
        // Default to values for the production environment
        $APP_CONFIG = [];
        $APP_CONFIG['WEBSITE_API_URL_BASE'] = 'https://fieldday-web.wcer.wisc.edu/wsgi/website/production/';

        // If the hostname is localhost or 127.0.0.1
        if(!empty($_SERVER['HTTP_HOST']) && in_array($_SERVER['HTTP_HOST'], ['localhost','127.0.0.1']))
        {
            // Assume we're in a development environment
            $APP_CONFIG['WEBSITE_API_URL_BASE'] = 'http://localhost:5000/';
        }

        return $APP_CONFIG;

    }
}

