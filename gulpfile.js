'use strict';

var gulp = require('gulp');
var del = require('del');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var spawn = require('child_process').spawn;

var baseUrl;
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

function upload() {
	let cmd, args, options, child, output;
	return new Promise(function(resolve, reject) {
		cmd = 'now';
		args = ['-n', 'cjs-cdn', '--static', '--public'];
		options = {cwd: './dist'};
		child = spawn(cmd, args, options);
		child.stdout.on('data', function (data) {
			let str = data.toString();
			output += str;
			if (str.indexOf('https://') === 0) {
				baseUrl = str;
			}
			// console.log(str);
		});
		child.stdout.on('error', function (err) {
			reject(err);
		});
		child.stdout.on('close', function () {
			resolve(output);
		});
	});
}

function alias() {
	let cmd, args, options, child, output;
	return new Promise(function(resolve, reject) {
		if (!baseUrl) {
			reject('No domain name set for \'alias\' to use...');
			return;
		}
		cmd = 'now';
		args = ['alias', 'set', baseUrl.replace('https://', ''), 'cjs-cdn.now.sh'];
		options = {cwd: './dist'};
		child = spawn(cmd, args, options);
		child.stdout.on('data', function (data) {
			output += data.toString();
		});
		child.stdout.on('error', function (err) {
			reject(err);
		});
		child.stdout.on('close', function () {
			resolve(output);
		});
	});
}

function delay() {
	return new Promise(function (resolve/*, reject*/) {
		setTimeout(resolve, 2000);
	});
}

var deploy = gulp.series(upload, delay, alias);
gulp.task('deploy', deploy);

var build = gulp.series(clean, gulp.parallel(scripts, assets));
var release = gulp.series(build, deploy);
gulp.task('default', release);
gulp.task('release', release);