var srcDir = './src';
var distDir = './dist';

module.exports = {
  less: {
    all: srcDir + '/less/**/*.less',    // all less files
    src: srcDir + '/less/*.less',       // need to be compiled less files
    dist: distDir + '/css',
    setting: {}
  },
  image: {
    src: srcDir + '/images/**/*',
    dist: distDir + '/images'
  },
  js: {
    src: srcDir + '/js/**/*',
    dist: distDir + '/js'
  },
  css: {
    src: srcDir + '/css/**/*',
    dist: distDir + '/css'
  },
  font: {
    src: srcDir + '/font/**/*',
    dist: distDir + '/font'
  },
  html: {
    src: srcDir + '/*.html',
    dist: distDir
  },
  sprite: {
    src: srcDir + '/sprites/**/*.{png,jpg,jpeg}'
  }
};
