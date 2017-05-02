var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var webpackConfig = require('./webpack.config.js');
var opn = require('opn');
var gulp = require('gulp');
var clean = require('gulp-clean');
var gutil = require('gulp-util');
var less = require('gulp-less');
var notify = require('gulp-notify');
var plumber = require('gulp-plumber');
var gulpif = require('gulp-if');
var sprity = require('sprity');
var imagemin = require('gulp-imagemin');
var sourcemaps = require('gulp-sourcemaps');
var eslint = require('gulp-eslint');
var config = require('./config.js');
var htmlmin = require('gulp-htmlmin');
var cleanCss = require('gulp-clean-css');

gulp.task('default', ['webpack-dev-server']);

gulp.task('build-dev', ['minify', 'imagemin', 'less:build-dev', 'css:build', 'copy-lib', 'webpack:build-dev']);

// Production build
gulp.task('build', ['less:build', 'css:build', 'copy-lib', 'minify', 'imagemin', 'webpack:build']);

gulp.task('clean', function () {
  return gulp.src('dist/*')
    .pipe(clean());
});

gulp.task('webpack:build', function (callback) {
  // modify some webpack config options
  var myConfig = Object.create(webpackConfig);
  myConfig.plugins = myConfig.plugins.concat(
    new webpack.DefinePlugin({
      'process.env': {
        // This has effect on the react lib size
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.DedupePlugin()
  );

  // run webpack
  webpack(myConfig, function (err, stats) {
    if (err) throw new gutil.PluginError('webpack:build', err);
    gutil.log('[webpack:build]', stats.toString({
      colors: true
    }));
    callback();
  });
});

// modify some webpack config options
var myDevConfig = Object.create(webpackConfig);
myDevConfig.devtool = 'sourcemap';
myDevConfig.debug = true;

// create a single instance of the compiler to allow caching
var devCompiler = webpack(myDevConfig);

gulp.task('webpack:build-dev', function (callback) {
  // run webpack
  devCompiler.run(function (err, stats) {
    if (err) throw new gutil.PluginError('webpack:build-dev', err);
    gutil.log('[webpack:build-dev]', stats.toString({
      colors: true
    }));
    callback();
  });
});

gulp.task('watch', function () {
  gulp.watch(['src/lib/**/*',
    'src/fonts/**/*'], ['copy-lib']);
  gulp.watch('src/less/**/*.less', ['less:build-dev']);
  gulp.watch('src/css/**/*.css', ['css:build']);
  gulp.watch('src/js/**/*.js', ['webpack:build-dev']);
  gulp.watch('src/images/**/*', ['imagemin']);
  gulp.watch('src/**/*.html', ['minify']);
});

gulp.task('webpack-dev-server', ['build-dev', 'watch'], function (callback) {
  // modify some webpack config options
  var myConfig = Object.create(webpackConfig);
  myConfig.devtool = 'eval';
  myConfig.debug = true;

  // Start a webpack-dev-server
  new WebpackDevServer(webpack(myConfig), {
    publicPath: '/' + myConfig.output.publicPath,
    stats: {
      colors: true
    }
  }).listen(8080, '0.0.0.0', function (err) {
    if (err) throw new gutil.PluginError('webpack-dev-server', err);
    gutil.log('[webpack-dev-server]', 'http://localhost:8080/webpack-dev-server/dist/index.html');
    opn('http://localhost:8080/webpack-dev-server/dist/login.html');
  });
});

gulp.task('sprites', function () {
  return sprity.src({
    src: config.sprite.src,
    style: './sprite.css',
    prefix: 'sprite',
    cssPath: '../images'
    // ... other optional options
    // for example if you want to generate less instead of css
    // processor: 'less' // make sure you have installed sprity-less
  })
    .pipe(gulpif('*.png', gulp.dest('./src/images/'), gulp.dest('./src/css/')));
});

gulp.task('imagemin', function () {

  return gulp.src(config.image.src)
    .pipe(imagemin())
    .pipe(gulp.dest(config.image.dist));
});

gulp.task('copy-lib', function () {
  gulp.src('./src/lib/**/*')
    .pipe(gulp.dest('./dist/lib/'));

  gulp.src('./src/fonts/**/*')
    .pipe(gulp.dest('./dist/fonts/'));
});

gulp.task('css:build', function () {
  gulp.src(config.css.src)
    .pipe(cleanCss())
    .pipe(gulp.dest(config.css.dist));
});

gulp.task('less:build', function () {
  gulp.src(config.less.src)
    .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
    .pipe(less())
    .pipe(cleanCss())
    .pipe(gulp.dest(config.less.dist));
});

gulp.task('less:build-dev', function () {
  gulp.src(config.less.src)
    .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(config.less.dist));
});

gulp.task('lint', function () {
  // ESLint ignores files with 'node_modules' paths.
  // So, it's best to have gulp ignore the directory as well.
  // Also, Be sure to return the stream from the task;
  // Otherwise, the task may end before the stream has finished.
  return gulp.src([config.js.src, '!node_modules/**'])
    .pipe(eslint({
      extends: 'eslint:recommended',
      ecmaFeatures: {
        'modules': true
      },
      rules: {
        'strict': 2
      },
      globals: {
        'jQuery': false,
        '$': true
      },
      envs: [
        'browser'
      ]
    }))
    .pipe(eslint.formatEach('compact', process.stderr));
});

gulp.task('minify', function () {
  return gulp.src('src/*.html')
    .pipe(htmlmin({
      removeComments: true, // 清除HTML注释
      // collapseWhitespace: true, // 压缩HTML
      collapseBooleanAttributes: true, // 省略布尔属性的值 <input checked='true'/> ==> <input />
      removeEmptyAttributes: true, // 删除所有空格作属性值 <input id='' /> ==> <input />
      removeScriptTypeAttributes: true, // 删除<script>的type='text/javascript'
      removeStyleLinkTypeAttributes: true, // 删除<style>和<link>的type='text/css'
      minifyJS: true, // 压缩页面JS
      minifyCSS: true // 压缩页面CSS
    }))
    .pipe(gulp.dest('dist'));
});
