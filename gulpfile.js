var gulp = require('gulp'),
    del = require('del'),
    sass = require('gulp-sass'),
    ngAnnotate = require('gulp-ng-annotate'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    htmlReplace = require('gulp-html-replace'),
    globule = require('globule'),
    embedTemplates = require('gulp-angular-embed-templates'),
    imagemin = require('gulp-imagemin'),
    ftp = require('vinyl-ftp');


var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

var config = require('./config.json');

var conn = ftp.create({
    host: 'xxxxxxxxxxx.windows.net',
    user: 'xxxxxxxxxxxxx\$xxxxxxxxxxxxxx',
    password: 'xxxxxxxxxx',
    parallel: 1,
    log: function() {
        console.log(arguments);
    }
});



/* Tasks */

gulp.task('reConfig', function(cb) {
    delete require.cache[require.resolve('./config.json')];
    config = require('./config.json');
    return cb();
});

gulp.task('clean:JS', function(cb) {
    del([config.build_dir + '/js', config.build_dir + '/vendor'], function() {
        return cb();
    });
});

gulp.task('clean:CSS', function(cb) {
    del([config.build_dir + '/css'], function() {
        return cb();
    });
});

gulp.task('clean:HTML', function(cb) {
    del([config.build_dir + '/**/*.html'], function() {
        return cb();
    });
});

gulp.task('clean:Fonts', function(cb) {
    del([config.build_dir + '/fonts'], function() {
        return cb();
    });
});

gulp.task('clean:IMG', function(cb) {
    del([config.build_dir + '/img'], function() {
        return cb();
    });
});

gulp.task('sass', ['copyStaticCSS'], function(cb) {
    gulp.src('./src/sass/app.scss')
        .pipe(sass({ outputStyle: 'compressed' }))
        .pipe(gulp.dest('./' + config.build_dir + '/css'))
        .pipe(reload({ stream: true }))
        .on('finish', function() {
            return cb();
        });
});

gulp.task('lint', ['clean:JS'], function() {
    return gulp.src(['./src/js/**/*.js', '!src/js/vendor/**/*.js', '!src/js/theme/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});

gulp.task('copyStaticCSS', ['clean:CSS'], function(cb) {
    gulp.src(config.dependencies.css)
        .pipe(gulp.dest(config.build_dir + '/css/'))
        .on('finish', function() {
            cb();
        })
});

gulp.task('copyFonts', ['clean:Fonts'], function(cb) {
    gulp.src(['./src/fonts/**/*'])
        .pipe(gulp.dest(config.build_dir + '/fonts/'))
        .on('finish', function() {
            cb();
        })
});

gulp.task('copyStaticFiles', ['clean:IMG', 'copyFonts', 'sass'], function(cb) {
    gulp.src(['./src/img/**/*'])
        .pipe(imagemin({
            progressive: true
        }))
        .pipe(gulp.dest(config.build_dir + '/img/'))
        .on('finish', function() {
            return cb();
        });
});

gulp.task('deploy:jsDebug', ['lint', 'reConfig'], function(cb) {
    var done = 0;

    //copying vendor libraries
    //gulp.src(['src/js/vendor/**/*.js', '!src/js/vendor/Tx-Web/**/*'])
    gulp.src(config.dependencies.vendor)
        .pipe(gulp.dest(config.build_dir + '/js/vendor'))
        .on('finish', function() {
            if (done === 2) {
                return cb();
            }
            done++;
        });

    //copying src js files
    gulp.src(['./**/*.js', '!vendor/**/*.js'], { cwd: 'src/js' })
        .pipe(ngAnnotate())
        .pipe(embedTemplates())
        .pipe(gulp.dest(config.build_dir + '/js'))
        .on('finish', function() {
            if (done === 2) {
                return cb();
            }
            done++;
        });;

    //copying txDoc files
    gulp.src(config.dependencies.tx.map(function(n) { return n + '.js'; }), { cwd: 'src/js/vendor/Tx-Web/**/' })
        .pipe(gulp.dest(config.build_dir + '/js/vendor/tx'))
        .on('finish', function() {
            if (done === 2) {
                return cb();
            }
            done++;
        });
});

gulp.task('package:Debug', ['deploy:jsDebug', 'clean:HTML', 'copyStaticFiles'], function(cb) {

    gulp.src('index.html')
        .pipe(htmlReplace({
            appJs: globule.find(['js/**/*.js', '!js/vendor/**/*.js'], { srcBase: "src" }),
            txDoc: globule.find('js/vendor/tx/**/*.js', { srcBase: config.build_dir }),
            vendor: config.dependencies.vendor.map(function(path) { return 'js/vendor/' + path.substr(path.lastIndexOf('/') + 1); }),
            css: globule.find(['css/**/*.css', '!css/app.css'], { srcBase: config.build_dir })
        }))
        .pipe(gulp.dest(config.build_dir, { overwrite: true }))
        .on('finish', function() {
            return cb();
        });
});

gulp.task('upload', ['package:Debug'], function() {
    return gulp.src(['./build/**/*'])
        .pipe(conn.newer('/')) // only upload newer files
        .pipe(conn.dest('/TX.Admin'));
});

gulp.task('debug', ['package:Debug'], function() {

    browserSync.init({
        server: {
            baseDir: "./" + config.build_dir
        }
    });

    gulp.watch(["./src/*.html", "./src/**/*.html", "./src/**/*.js", "./src/css/**/*", './config.json'], ['package:Debug', reload]);
    gulp.watch("./src/**/*.scss", ['sass']);
});