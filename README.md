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

Run `npm install` in your `%project_dir%`

Run `gulp build` to build the site for deployment.

Note: Transpiled css and vendor js files are excluded from GIT

### Run the dev API backend

The API (opengamedata-website-api) should be running on <http://localhost:5000> in order to get Game Usage and Data Pipeline/Templates files list.

- See README in the [API repository](https://github.com/opengamedata/opengamedata-website-api) for further instructions.

### Run the Website

There are a few options for running the website locally:

1. Run `gulp proxy` to start dev server, proxying <http://localhost:8881>

    - scss, js, php files are watched and will reload on change with Browser sync.
    - See gulpfile.js for other gulp functions if needed (i.e., clean, build).

2. Run `php -S 127.0.0.1:5000` to start PHP development server

    - Files are not watched, but changes will be reflected upon manually reloading the page.
    - Changes to scss are not automatically built to update the generated css files.
