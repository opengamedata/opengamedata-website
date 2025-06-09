# opengamedata-website

Website front-end to the OpenGameData archive.

## Building the site

### Dev Requirements

- Node - newer version; setup with LTS 18.14.1
- Apache Server running localhost:8881 with vhosts pointing to `%project_dir%/site`

Run `npm install` in your `%project_dir%`

Run `gulp proxy` to start dev server, proxying http://localhost:8881

- Scss, js, php files are watched and will reload on change with Browser sync.
- See gulpfile.js for other gulp functions if needed (i.e., clean, build).

Run `gulp build` to build the site for deployment.

Note: Transpiled css and vendor js files are excluded from GIT

### Run the dev API backend

The API (opengamedata-website-api) should be running on http://localhost:5000 in order to get Game Usage and Data Pipeline/Templates files list.

- See README in the [API repository](https://github.com/opengamedata/opengamedata-website-api) for further instructions.
