var gulp = require('gulp'),
livereload = require('gulp-livereload'),
connect = require('gulp-connect'),
imagemin = require('gulp-imagemin'),
pngquant = require('imagemin-pngquant'),
postcss = require('gulp-postcss'),
sourcemaps = require('gulp-sourcemaps'),
rename = require('gulp-rename'),
autoprefixer = require('autoprefixer'),
cssnano = require('cssnano'),
short = require('postcss-short'),
cssnext = require('cssnext'),
precss = require('precss'),
stylelint = require('stylelint'),
config = require('./stylelint.config.js'),
notify = require('gulp-notify'),
gutil = require('gutil'),
concat = require('gulp-concat'),
uglify = require('gulp-uglify'),
retinize = require('gulp-retinize'),
fontmin = require('gulp-fontmin'),
pug = require('gulp-pug');

// server connect
gulp.task('connect', function () {
	connect.server({
		root: './', //path to project
		livereload: true,
	});
});

// styles
gulp.task('styles', function () {
	var processors = [
	stylelint(config),
		cssnano,
		short,
		cssnext,
		precss
		];

		gulp.src('src/fonts/**/*').pipe(gulp.dest('dist/fonts'));

		return gulp.src('src/styles/main.css')
		.pipe(postcss(processors).on('error', function (err) {
			gutil.log(err);
			this.emit('end');
		}))
		.pipe(postcss([autoprefixer({browsers: ['last 3 versions']})]))
		.pipe(sourcemaps.write('.'))
		.pipe(rename('style.min.css'))
		.pipe(gulp.dest('dist/css'))
		.pipe(connect.reload());
	});

var retinizeOpts = {
	/// Your options here.
};

// html
gulp.task('html', function() {
	gulp.src('*.html')
	.pipe(connect.reload());
});

function swallowError (error) {
  // If you want details of the error in the console
  console.log(error.toString())
  this.emit('end')
}

gulp.task('pug', function buildHTML() {
	return gulp.src([
		'src/views/**/*.pug',
		'!src/views/template/_*.pug',
	])

    .pipe(pug({
		pretty: true,
		data: {
			foo: 'bar'
		}
	}))
	.on('error', swallowError)
	.pipe(gulp.dest('./'))
});


gulp.on('err', function(err){
  console.log(err);
});

// imagemin
gulp.task('compressor', function () {
	gulp.src('src/favicon/**/*').pipe(gulp.dest('dist/favicon'));
	gulp.src('src/video/*').pipe(gulp.dest('dist/video'));

	return gulp.src('src/img/**/*')
	.pipe(imagemin({
		progressive: true,
		svgoPlugins: [{removeViewBox: false}],
		use: [pngquant()]
	}))
	.pipe(retinize(retinizeOpts))
	.pipe(gulp.dest('dist/img/'))
	.pipe(connect.reload());
});

// minfy js
gulp.task('js', function () {
	return gulp.src(['src/js/**/*'])
		.pipe(uglify())
		.pipe(gulp.dest('dist/js'));
	});

// watch
gulp.task('watch', function () {
	gulp.watch('src/styles/**/*.css', ['styles']);
	gulp.watch('src/img/**/*', ['compressor']);
	gulp.watch('src/**/*.js', ['js']);
	gulp.watch('*.html', ['html']);
	gulp.watch('src/views/**/*.pug', ['pug']);
});

gulp.task('default', ['html', 'styles', 'pug', 'connect','compressor', 'js', 'watch']);
