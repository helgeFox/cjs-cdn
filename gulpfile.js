var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var exec = require('child_process').exec;

var files = [
	'./node_modules/moment/min/moment.min.js', 
	'./node_modules/moment/locale/nb.js',
	'./src/nytid-script.js'
];
var scriptName = 'nytid-cjs-scripts.js';
var assets = [
	'./src/icons/*'
];
var destination = './dist/';

gulp.task('scripts', function() {
	gulp.src(files)
	.pipe(concat(scriptName))
	.pipe(rename({suffix: '.min'}))
	.pipe(uglify())
	.pipe(gulp.dest(destination));
});

gulp.task('assets', function () {
	gulp.src(assets)
	.pipe(gulp.dest(destination + '/icons'));
});

gulp.task('pkg', function () {
	// Wait... Deploying *with* the package file requires more setup. Read https://zeit.co/blog/now-static
	// gulp.src('./package.json')
	// .pipe(gulp.dest(destination));
});

gulp.task('deploy', function () {
	exec('now -n cjs-cdn --static', {cwd: './dist'}, function (err, stdout, stderr) {
		if (err) {
			console.error('Deploy failed... ', err);
			return;
		}
		console.log('Deploy to now.sh successful\nURL: ' + stdout);
		exec('now alias set ' + stdout + ' cjs-cdn.now.sh', {cwd: './dist'}, function (err, stdout, stderr) {
			if (err) {
				console.error('Now-alias failed!', err);
				return;
			}
			console.log('Now-alias successful');
		});
	});
});

gulp.task('default', ['scripts', 'assets']);
gulp.task('release', ['scripts', 'assets', 'pkg', 'deploy']);