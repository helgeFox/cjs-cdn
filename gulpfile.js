var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var pump = require('pump');

var files = [
	'./node_modules/moment/min/moment.min.js', 
	'./node_modules/moment/locale/nb.js',
	'./src/nytid-script.js'
];
var scriptName = 'nytid-cjs-scripts.js';
var destination = './dist/';
 
gulp.task('scripts', function() {
  gulp.src(files)
  	.pipe(concat(scriptName))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
  	.pipe(gulp.dest(destination))
});


gulp.task('default', ['scripts']);
