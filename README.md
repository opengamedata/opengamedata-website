# opengamedata-website

Website front-end to the OpenGameData archive.

## Building and Running for Local Debugging

### Dev Requirements

- Node - newer version; setup with LTS 18.14.1
- cURL
- Apache Server running localhost:8881 with vhosts pointing to `%project_dir%/site`
  - PHP - version 8.1
  - php_curl bindings

NOTE: a local install of PHP and the php_curl bindings are sufficient to test the site, though a full local Apache Server will provide the best emulation of the deploy environment.

### Build the Website

1. Create a copy of `AppConfig.php` from the `AppConfig.php.template` file in the `%project_dir%/site/config` folder.  
    NOTE: This approach ensures local config settings are not committed by mistake. Any desired changes to the default configuration can be copied back to the `.template` file and committed.
2. Run `npm install` in your `%project_dir%`
3. Run `gulp build` to build the site for deployment.  
    NOTE: Transpiled css and vendor js files are excluded from GIT

### Run the dev API backend

The API (opengamedata-website-api) should be running on <http://localhost:5000> in order to get Game Usage and Data Pipeline/Templates files list.

- See README in the [API repository](https://github.com/opengamedata/opengamedata-website-api) for further instructions.

Alternately, you may use an online instance of the File API.

- Comment out the following in the `site/config/AppConfig.php` file:

    ```php
    // If hostname starts with localhost
    if(!empty($_SERVER['HTTP_HOST']) && substr($_SERVER['HTTP_HOST'], 0, 9) === 'localhost')
    {
        // Assume we're in a development environment
        $APP_CONFIG['WEBSITE_API_URL_BASE'] = 'http://localhost:5000/';
    }
    ```

- Then make sure to set the `$APP_CONFIG['WEBSITE_API_URL_BASE']` line with a valid online path, such as the main instance hosted on `ogd-services`: <https://ogd-services.fielddaylab.wisc.edu/wsgi-bin/opengamedata/apis/files/app.wsgi/>

### Run the Website

There are a few options for running the website locally:

1. Run `gulp proxy` to start dev server, proxying <http://localhost:8881>

    - scss, js, php files are watched and will reload on change with Browser sync.
    - See gulpfile.js for other gulp functions if needed (i.e., clean, build).

2. Run `php -S 127.0.0.1:5000` to start PHP development server

    - Files are not watched, but changes will be reflected upon manually reloading the page.
    - Changes to scss are not automatically built to update the generated css files.

3. Run local Apache Server

    - TODO
