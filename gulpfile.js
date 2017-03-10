'use strict';

var gulp = require('gulp');
var del = require('del');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var exec = require('child_process').exec;

var destination = './dist/';
var paths = {
	scripts: {
		src: [
			'./node_modules/moment/min/moment.min.js', 
			'./node_modules/moment/locale/nb.js',
			'./src/nytid-script.js'
		],
		name: 'nytid-cjs-scripts.js',
		dest: destination
	},
	assets: {
		src: [
			'./src/icons/*'
		],
		dest: destination + '/icons'
	}
};

function clean () {
	return del([destination + '**/*']);
}

function scripts () {
	return gulp.src(paths.scripts.src)
	.pipe(concat(paths.scripts.name))
	.pipe(rename({suffix: '.min'}))
	.pipe(uglify())
	.pipe(gulp.dest(paths.scripts.dest));
}

function assets () {
	return gulp.src(paths.assets.src)
	.pipe(gulp.dest(paths.assets.dest));
}

function pkg () {
	// Wait... Deploying *with* the package file requires more setup. Read https://zeit.co/blog/now-static
	// gulp.src('./package.json')
	// .pipe(gulp.dest(destination));
}

function deploy() {
	return new Promise(function(resolve, reject) {
		exec('now -n cjs-cdn --static', {cwd: './dist'}, function (err, stdout, stderr) {
			if (err) {
				console.error('Deploy failed... ', err);
				reject(err);
				return;
			}
			console.log('Deploy to now.sh successful\nURL: ' + stdout);
			exec('now alias set ' + stdout.replace('https://', '') + ' cjs-cdn.now.sh', {cwd: './dist'}, function (err, stdout, stderr) {
				if (err) {
					console.error('Now-alias failed!', err);
					reject(err);
					return;
				}
				console.log('Now-alias successful');
				resolve();
			});
		});
	});
}
gulp.task('deploy', deploy);

var build = gulp.series(clean, gulp.parallel(scripts, assets));
var release = gulp.series(build, deploy);

gulp.task('default', release);
gulp.task('release', release);