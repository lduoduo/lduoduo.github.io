/**
 * 
 * commond:
 *  less: 编译所有的less
 *
 */
'use strict';

var gulp = require('gulp');
var less = require('gulp-less');
var watch = require('gulp-watch');
var notify = require('gulp-notify');
var plumber = require('gulp-plumber');
var source = require('vinyl-source-stream');
var watchify = require('watchify');
var browserify = require('browserify');
var sourcemaps = require('gulp-sourcemaps');
var assign = require('lodash.assign');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var minifycss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var rev = require('gulp-rev');
var replace = require('gulp-replace');
var del = require('del');
var glob = require('glob');
var path = require('path');
var fs = require('fs');
var babel = require('gulp-babel');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var tinypng = require('gulp-tinypng-compress');

var browserSync = require('browser-sync').create();

// 报错抛出提示
var onError = function (err) {
    gutil.log('======= ERROR. ========\n');
    notify.onError("ERROR: " + err.message)(err); // for growl
    gutil.beep();
};

// 首次进来先获取缓存数据存起来
// var cacheJSON  = require('./cache.json'),
//     bUpload = {};

var _listen = function (obj, prop, fn) {

    return Object.defineProperty(obj, prop, {
        get: function () {
            return this['_' + prop];
        },
        set: function (newValue) {

            if (this['_' + prop] !== newValue) {
                this['_' + prop] = newValue;
                fn(newValue);
            }
        }
    });
};


function buildCss(styleSrc) {
    gulp.src(styleSrc, { client: './' })
        .pipe(plumber({ errorHandler: onError }))
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('../public/css'))
        .on('finish', function () { });
}

// require编译
function bundle(b, file) {
    return b.bundle()
        .on("error", notify.onError(function (error) {
            gutil.log('======= ERROR. ========\n', error);
            return "Message to the notifier: " + error.message;
        }))
        .pipe(source(file))
        .pipe(buffer())

        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('../public/js'));
}

// 根据变动生成css与js
function buildCssAndJs() {

    watch('src/**/!(_)*.less', function (event) {

        var path = event.path.replace(/\\/g, '/'),
            reg = path.match(/(\/src(\/\w+)*)?\/([\w]+.less)?$/),
            src = reg[0];

        buildCss(src.substring(1));
        gutil.log(gutil.colors.green("SUCCESS: " + src.substring(1) + '  finished!'));

    });

    watch(['src/**/!(_)*.js'], function (event) {

        var path = event.path.replace(/\\/g, '/');
        // console.log(path);
        var reg = path.match(/\/(src(\/\w+)*\/(\w+.js))$/),
            src = reg[1];
        // console.log(reg);

        var fileName = reg[3];

        var b = watchify(browserify(assign({}, watchify.args, {
            cache: {},
            packageCache: {},
            entries: [src]
        })));

        b.on('log', gutil.log);

        bundle(b, fileName);

        return;
    });

}

/*
 编译所有的less
 */
function Less(callback) {

    glob('src/**/!(_)*.less', {}, function (err, files) {

        files.forEach(function (file) {

            buildCss(file);

            gutil.log(gutil.colors.green("SUCCESS: " + file + '  finished!'));

        });

        callback();
    });
}


/*
 编译所有的js
 注：执行此命令的时候请注释掉下面的 [default]任务行
 */
function reset(callback) {

    glob('src/**/!(_)*.js', {}, function (err, files) {

        files.forEach(function (file) {

            var reg = file.match(/(src\/(\w+)*)?\/([\w]+.js)?$/);
            console.log(reg);
            
            var    fileName = reg[3];

            var b = watchify(browserify(assign({}, watchify.args, {
                cache: {},
                packageCache: {},
                entries: [file]
            })));

            bundle(b, fileName);

            gutil.log(gutil.colors.green("SUCCESS: " + file + '  finished!'));

        });
    });

    callback();
}


/**
 *  gulp build
 */

/*
 *
 * minCss
 *
 * */

function minCss(callback) {
    return gulp.src('../public/css/*.css')
        .pipe(minifycss())
        .pipe(gulp.dest('../public/css'))
        .on('finish', callback);
}

/*
 *
 * compress
 *
 * */
function compress(callback) {
    return gulp.src('../public/js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('../public/js'))
        .on('finish', callback);
}


/*
 *
 * read json
 *
 * */
function readJson(fileName) {
    var json = JSON.parse(fs.readFileSync(fileName));

    return json;
}

/*
 *
 * write json
 *
 * */
function writeJson(fileName, data) {

    fs.writeFileSync(fileName, JSON.stringify(data));
}

/** 图片压缩 
 * key值： https://tinypng.com/dashboard/developers
*/
function imgMin(callback) {
    return gulp.src('img/*.{png,jpg,gif,ico}')
        // .pipe(imagemin({
        //     optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
        //     progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
        //     interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
        //     multipass: true, //类型：Boolean 默认：false 多次优化svg直到完全优化
        //     svgoPlugins: [{removeViewBox: false}],//不要移除svg的viewbox属性
        //     use: [pngquant()] //使用pngquant深度压缩png图片的imagemin插件
        // }))
        .pipe(tinypng({
            key: 'MH_BK0nFV0smwLTz4iTXQvVDOzZXeTIf',
            sigFile: 'images/.tinypng-sigs',
            log: true
        }))
        .pipe(gulp.dest('../public/img'))
        .on('finish', callback);
}

// 静态服务器:browser-sync
gulp.task('browserSync', function() {
    browserSync.init({
        // proxy: "10.101.142.101",
        server: {
            baseDir: "../"
        }
    });
});

// 代理
// gulp.task('browser-sync', function() {
//     browserSync.init({
//         proxy: "你的域名或IP"
//     });
// });

gulp.task(browserSync);

//default task
gulp.task(buildCssAndJs);

//编译所有的less
gulp.task(Less);
//编译所有的js
gulp.task(reset);


gulp.task(minCss);
gulp.task(compress);

gulp.task(imgMin);

gulp.task('default', gulp.series('reset', 'Less', 'buildCssAndJs'));

gulp.task('server', gulp.series('browserSync'));

gulp.task('build', gulp.series('compress', 'minCss', 'imgMin'));