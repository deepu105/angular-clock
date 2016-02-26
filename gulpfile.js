(function() {
  'use strict';

  var gulp = require('gulp');
  var less = require('gulp-less');
  var sourcemaps = require('gulp-sourcemaps');
  var uglify = require('gulp-uglify');
  var csso = require('gulp-csso');
  var jshint = require('gulp-jshint');
  var stylish = require('jshint-stylish');
  var jscs = require('gulp-jscs');
  var mocha = require('gulp-spawn-mocha');
  var mochaPhantomJS = require('gulp-mocha-phantomjs');
  var tar = require('gulp-tar');
  var gzip = require('gulp-gzip');
  var bumper = require('gulp-bump');
  var git = require('gulp-git');
  var shell = require('gulp-shell');
  var rename = require('gulp-rename');
  var fs = require('fs');
  var sequence = require('gulp-sequence');
  var flatten = require('gulp-flatten');

  gulp.task('less', function() {
    return gulp.src('./*.less')
      .pipe(sourcemaps.init())
      .pipe(less())
      .pipe(csso())
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./dist'));
  });

  gulp.task('lint', function() {
    return gulp.src('**/*.js')
      .pipe(jshint())
      .pipe(jshint.reporter(stylish));
  });

  gulp.task('unit', function() {
    return gulp
      .src('test/index.html')
      .pipe(mochaPhantomJS());
  });

  gulp.task('bump-patch', bump('patch'));
  gulp.task('bump-minor', bump('minor'));
  gulp.task('bump-major', bump('major'));

  gulp.task('bower', function() {
    return gulp.src('./angular-clock.js')
      .pipe(gulp.dest('./dist'));
  });

  gulp.task('js', ['lint', 'bower'], function() {
    return gulp.src('./angular-clock.js')
      .pipe(rename('angular-clock.min.js'))
      .pipe(sourcemaps.init())
      .pipe(uglify())
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./dist'));
  });

  gulp.task('build', function() {
    return gulp.src(['dist/*', '!./dist/*.tar.gz'])
      .pipe(tar('angular-clock.js.tar'))
      .pipe(gzip({
        gzipOptions: {
          level: 9
        }
      }))
      .pipe(gulp.dest('dist/'));
  });

  gulp.task('copy-js', function() {
    gulp.src(['bower_components/**/*.min.js','!bower_components/**/jquery-*', '!bower_components/**/ui-bootstrap.min.js','bower_components/**/generic.js','bower_components/**/javascript.js','bower_components/**/html.js'])
      .pipe(flatten())
      .pipe(gulp.dest('demo/lib/js'));
  });

  gulp.task('copy-css', function() {
    gulp.src(['bower_components/**/*.min.css','bower_components/**/github.css'])
      .pipe(flatten())
      .pipe(gulp.dest('demo/lib/css'));
  });

  gulp.task('copy-font', function() {
    gulp.src(['bower_components/**/*.{eot,svg,ttf,woff}'])
      .pipe(flatten())
      .pipe(gulp.dest('demo/lib/fonts'));
  });

  gulp.task('demo', ['copy-js', 'copy-css', 'copy-font'], function(cb) {
    fs.readFile('./examples/index.template.html', 'utf8', function(err, file) {
      if (err) return cb(err);
      file = file.replace('<!-- version -->', version());
      fs.writeFile('./examples/index.html', file, cb);
    });
  });

  gulp.task('git-commit', function() {
    var v = 'update to version ' + version();
    gulp.src(['./dist/*', './examples/*', './test/*', './package.json', './bower.json', './angular-clock.js', './angular-clock.less'])
      .pipe(git.add())
      .pipe(git.commit(v));
  });

  gulp.task('git-push', function (cb) {
      var v = 'v' + version();
      git.push('origin', 'master', function (err) {
          if (err) return cb(err);
          git.tag(v, v, function (err) {
              if (err) return cb(err);
              git.push('origin', 'master', {
                  args: '--tags'
              }, function(err){
                  if (err) return cb(err);
                  git.checkout('gh-pages', function (err) {
                      if (err) return cb(err);
                      git.reset('master', {
                          args: '--hard'
                      }, function (err) {
                          if (err) return cb(err);
                          git.push('origin', 'gh-pages', function (err) {
                              if (err) return cb(err);
                              git.checkout('master', cb);
                          });
                      });
                  });
              });
          });
      });
  });

  gulp.task('git-demo', function (cb) {
      var v = 'v' + version();
      git.checkout('gh-pages', function (err) {
          if (err) return cb(err);
          git.reset('master', {
              args: '--hard'
          }, function (err) {
              if (err) return cb(err);
              git.push('origin', 'gh-pages', function (err) {
                  if (err) return cb(err);
                  git.checkout('master', cb);
              });
          });
      });
  });

  gulp.task('npm', shell.task([
    'npm publish'
  ]));

  gulp.task('watch', function() {
    gulp.watch('./*.js', ['js']);
    gulp.watch('./*.less', ['less']);
    return true;
  });

  function bump(level) {
    return function() {
      return gulp.src(['./package.json', './bower.json'])
        .pipe(bumper({
          type: level
        }))
        .pipe(gulp.dest('./'));
    };
  }

  function version() {
    return JSON.parse(fs.readFileSync('package.json', 'utf8')).version;
  }

  gulp.task('default', sequence('check', ['less', 'js'], 'build'));
  gulp.task('test', sequence('unit' /*, 'integration'*/ ));
  gulp.task('check', sequence(['lint' /*, 'style'*/ ], 'test'));
  gulp.task('deploy-patch', sequence('default', 'bump-patch', 'update', 'git-commit', 'git-push', 'npm'));
  gulp.task('deploy-minor', sequence('default', 'bump-minor', 'update', 'git-commit', 'git-push', 'npm'));
  gulp.task('deploy-major', sequence('default', 'bump-major', 'update', 'git-commit', 'git-push', 'npm'));

})();
