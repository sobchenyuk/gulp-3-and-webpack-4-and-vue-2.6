import gulp from 'gulp';
import browserSync from 'browser-sync';
import watch from 'gulp-watch';

import plumber from 'gulp-plumber';
import sourcemaps from 'gulp-sourcemaps';
import changed from 'gulp-changed';

import concat from 'gulp-concat';
import cssmin from 'gulp-cssmin';
import rename from 'gulp-rename';
import uglify from "gulp-uglify";

import webpack from "webpack";

import sass from 'gulp-sass';

import browserify from 'browserify';
import babelify from 'babelify';
import source from "vinyl-source-stream";

const liveReload = browserSync.create();
const reload     = liveReload.reload;

let webpackConfig = require('./webpack.config.js');
let statsLog     = {
    colors: true,
    reasons: true
};

const path = {
    app: {
        scss: './resources/sass/',
        js: './resources/js/',
    },
    lib: {
        css: [
            'node_modules/materialize-css/dist/css/materialize.css',
        ],
        js: [
            'node_modules/materialize-css/dist/js/materialize.js'
        ],
    },
    dist: {
        js: './public/js/',
        css: './public/css/',
    }
};

// name tasks
const BROWSER_SYNC = 'browser-sync';
const JAVA_SCRIPT = 'javascript';
const SCSS = 'scss';
const WATCHER = 'watcher';
const DEFAULT = 'default';
const LIBS = 'libs';

// name task javascript
const TYPE_FILE = '.js';
// array type file javascript
const ARRAY_TYPE_FILE = [...TYPE_FILE];

// error message
const errorAlert = err => {
    console.log(err.toString());
    this.emit("end");
};

// Static server
gulp.task(
    BROWSER_SYNC, () => {
        liveReload.init({
            proxy: "localhost:8000",
            logPrefix: "landing",
            reloadDelay: 1500
        });
    });

// script
gulp.task(
    JAVA_SCRIPT, () => {
        return browserify({
            entries: `${path.app.js}app${TYPE_FILE}`,
            extensions: ARRAY_TYPE_FILE,
            debug: true,
            sourcemaps: true
        }).transform(babelify, {
            presets: ['@babel/preset-env'],
            plugins: [
                "syntax-class-properties",
                "transform-class-properties"
            ]
        }).bundle()
            .on('error', (err) => errorAlert.bind(err))
            .pipe(source('bundle.js'))
            .pipe(gulp.dest(path.dist.js))
            .pipe(reload({stream: true}));
    });

gulp.task('scripts', (done) => {
    // run webpack
    webpack(webpackConfig, onComplete);
    function onComplete(error, stats) {
        if (error) {
            onError(error);
        } else if ( stats.hasErrors() ) {
            onError( stats.toString(statsLog) );
        } else {
            onSuccess( stats.toString(statsLog) );
        }
    }
    function onError(error) {
        errorAlert.bind(error)
        done();
    }
    function onSuccess(detailInfo) {
        console.log('[webpack]', detailInfo);
        done();
    }
});

// scss
gulp.task(
    SCSS, () => gulp.src(`${path.app.scss}all.scss`)
    .pipe(changed(path.dist.css))
    .pipe(plumber())
    .pipe(sourcemaps.init().on('error', (err) => errorAlert.bind(err) ))
    .pipe(sass.sync().on('error', (err) => errorAlert.bind(err) ))
    .pipe(sourcemaps.write('.').on('error', (err) => errorAlert.bind(err) ))
    .pipe(gulp.dest(path.dist.css))
    .pipe(reload({stream: true}))
);

// concat min rename lib css
gulp.task(
    'lib:css', ()=> gulp.src(path.lib.css)
        .pipe(concat("lib.css"))
        .pipe(cssmin())
        .pipe(rename( {
            suffix: ".min"
        }))
        .pipe(gulp.dest(path.dist.css))
);


// concat min rename lib js
gulp.task(
    'lib:js', ()=> gulp.src(path.lib.js)
        .pipe(concat("lib.js"))
        .pipe(uglify())
        .pipe(rename( {
            suffix: ".min"
        }))
        .pipe(gulp.dest(path.dist.js))
);

// libs initialization
gulp.task(LIBS, ['lib:js', 'lib:css']);

// WATCHER
gulp.task(
    WATCHER, () => {
        watch(`${path.app.scss}**/*.scss`, () => gulp.start(SCSS));
        watch([`${path.app.js}**/*.js`, `${path.app.js}**/*.vue`], () => gulp.start([ JAVA_SCRIPT, 'scripts' ]), reload );
        watch(['!./public/**/*.*', './resources/views/**/*.ejs', './favicon.*', '!node_modules/**/*'], reload );
    });

// DEFAULT
gulp.task(
    DEFAULT,
    [
        WATCHER,
        BROWSER_SYNC,
        SCSS,
        JAVA_SCRIPT,
        'scripts',
        LIBS,
    ]
);
