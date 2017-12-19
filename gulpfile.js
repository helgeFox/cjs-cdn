'use strict';

var gulp = require('gulp');
var del = require('del');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var spawn = require('child_process').spawn;

var baseUrl;
var destination = './dist/';

var scriptPaths = {
	'nytid-script': {
		src: [
			'./node_modules/moment/min/moment.min.js', 
			'./node_modules/moment/locale/nb.js',
			'./src/nytid-script.js'
		],
		name: 'nytid-cjs-scripts.js',
		dest: destination
	},
	'nytid-script-test': {
		src: [
			'./node_modules/moment/min/moment.min.js', 
			'./node_modules/moment/locale/nb.js',
			'./src/nytid-script-test.js'
		],
		name: 'nytid-cjs-scripts-test.js',
		dest: destination
	},
	'show-modal-dialog-polyfill': {
		src: [
			'./node_modules/jquery/dist/jquery.min.js',
			'./node_modules/knockout/build/output/knockout-latest.debug.js',
			'./src/showModalDialogPolyfill.js'
		],
		name: 'showModalDialogPolyfill.js',
		dest: destination
	}
};

function clean () {
	return del([destination + '**/*']);
}

function scriptPart(obj) {
	return function() {
		return gulp.src(obj.src)
		.pipe(concat(obj.name))
		.pipe(rename({suffix: '.min'}))
		.pipe(uglify())
		.pipe(gulp.dest(obj.dest));
	}
}

function assets () {
	return gulp.src('./src/icons/*')
	.pipe(gulp.dest(destination + '/icons'));
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

let all = [];
for (let prop in scriptPaths) {
	let value = scriptPaths[prop];
	all.push(scriptPart(value));
}
all.push(assets);
var allScripts = gulp.parallel(all);

var build = gulp.series(clean, allScripts, assets);
var release = gulp.series(build, deploy);
gulp.task('build', build);
gulp.task('default', release);
gulp.task('release', release);