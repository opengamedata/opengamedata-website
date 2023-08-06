<?php

class AppConfig
{
    public static function getConfig()
    {
        // Set Api Url base string (populated in Github actions)
        $APP_CONFIG = [];
        $APP_CONFIG['WEBSITE_API_URL_BASE'] = 'OGD_API_PATH_BASE';

        // If hostname starts with localhost
        if(!empty($_SERVER['HTTP_HOST']) && substr($_SERVER['HTTP_HOST'], 0, 9) === 'localhost')
        {
            // Assume we're in a development environment
            $APP_CONFIG['WEBSITE_API_URL_BASE'] = 'http://localhost:5000/';
        }

        return $APP_CONFIG;

    }
}

