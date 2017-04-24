const gulp = require('gulp')
const livereload = require('gulp-livereload')
const connect = require('gulp-connect')
const imagemin = require('gulp-imagemin')
const pngquant = require('imagemin-pngquant')
const postcss = require('gulp-postcss')
const sourcemaps = require('gulp-sourcemaps')
const rename = require('gulp-rename')
const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')
const short = require('postcss-short')
const cssnext = require('cssnext')
const precss = require('precss')
const stylelint = require('stylelint')
const config = require('./stylelint.config.js')
const notify = require('gulp-notify')
const gutil = require('gutil')
const concat = require('gulp-concat')
const uglify = require('gulp-uglify')
const retinize = require('gulp-retinize')
const fontmin = require('gulp-fontmin')
const pug = require('gulp-pug')
const babel = require('gulp-babel')
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


// gulp.task('default', () => {
//     return gulp.src('src/js/**')
//         .pipe(gulp.dest('dist/js'));
// });
// minify
gulp.task('js', function () {
	return gulp.src(['src/js/**'])
    .pipe(babel({
      presets: [
        'es2015',
        'stage-2',
      ].map(require.resolve)
    }))
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
