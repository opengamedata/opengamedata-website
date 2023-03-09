const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const browserSync = require('browser-sync').create();

function styles () {
    // Transpile Scss to Css 
    // **Excludes partials preceeded with '_' e.g., _theme.scss
    return gulp.src('./site/assets/styles/scss/**/[!_]*.{scss,sass}')
        .pipe(sass({includePaths: ['./node_modules'],outputStyle: 'compressed'})
            .on('error', sass.logError))
        .pipe(gulp.dest('./site/assets/styles'));
};

function clean () {
    // Delete vendor files and generated css
    return delete(['./site/assets/scripts/vendor','./site/assets/styles/*.css']);
}

exports.clean = clean; 

// Copy third party libraries from node_modules into /vendor
gulp.task('vendor', function() {
    return gulp.src([
      './node_modules/bootstrap/dist/js/*',
      './node_modules/axios/dist/esm/*.js',
      './node_modules/chart.js/dist/*'
    ])
      .pipe(gulp.dest('./site/assets/scripts/vendor'));
});
// Copy third party libraries from /vendor (dev) to /scripts (prod)
gulp.task('vendor:build', function() {
    return gulp.src([
      './site/assets/scripts/vendor/bootstrap.bundle.min.js',
      './site/assets/scripts/vendor/axios.min.js',
      './site/assets/scripts/vendor/chart.umd.js'
    ])
    .pipe(gulp.dest('./site/assets/scripts'));
});

// Dev task: transpiles Scss, runs vendor:build task, initialize Browser Sync, watch for changes
gulp.task('proxy', gulp.series('vendor','vendor:build', styles, function () {
    browserSync.init({
      proxy: "localhost:8881"
    });
  
    gulp.watch('./site/assets/styles/scss/*scss', styles).on('change', browserSync.reload);
    gulp.watch('./**/*.php').on('change', browserSync.reload);
    gulp.watch('./**/*.html').on('change', browserSync.reload);
    gulp.watch('./**/*.js').on('change', browserSync.reload);
}));

// Build task
gulp.task('build', gulp.series('vendor','vendor:build', styles));

//gulp.task('default', 'build');