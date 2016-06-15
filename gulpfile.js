var gulp = require('gulp'),
		del = require('del'),
		sass = require('gulp-sass'),
		uglify = require('gulp-uglify'),
		rename = require('gulp-rename'),
		imagemin = require('gulp-imagemin'),
		autoprefixer = require('gulp-autoprefixer'),
		browserSync = require('browser-sync').create();

// this is an object which defines paths for the styles
var path = {
	content: {
		css: './Content/css/',
		js: './Content/js/',
		img: './Content/img/'
	},
	contentBuild: {
		scss: './ContentBuild/scss/**/*.scss',
		js: './ContentBuild/js/**/*.js',
		img: './ContentBuild/img/**/*.*'
	},
	watch: {
		//scss: 'src/style/**/*.scss',
		//js: 'src/js/**/*.js',
		//img: 'src/img/**/*.*'
	}
};

// reload page in real time
gulp.task('browser-sync', function () {
	browserSync.init({
		server: {
			proxy: "http://localhost:51034/"
		},
		tunnel: true, // allows show site to your customers
		//host: 'localhost',
		//port: 51034,
		logPrefix: "browser-sync"
	});
});

// clean
gulp.task('clean', function (cb) {
	del.sync([
		path.content.css,
		path.content.js,
		path.content.img
	], { force: true }, cb);
});

// sass compilation
gulp.task('sass', function () {
	return gulp.src(path.contentBuild.scss)
		.pipe(sass({
			// minify scss files
			outputStyle: 'compressed'
		}).on('error', sass.logError))
		// add css autoprefixer
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest(path.content.css))
		.pipe(browserSync.stream());
});

// sass watch
gulp.task('sass:watch', function () {
	gulp.watch(path.contentBuild.scss, ['sass']);
	gulp.watch(path.contentBuild.js, ['minify-js']);
	gulp.watch(path.contentBuild.img, ['compress-img']);
	// allows to reload html files in real time
	gulp.watch("*.html").on('change', browserSync.reload);

});

// minify JS files
gulp.task('minify-js', function () {
	return gulp.src(path.contentBuild.js)
		.pipe(rename({ suffix: '.min' }))
		.pipe(uglify())
		.pipe(gulp.dest(path.content.js))
		.pipe(browserSync.stream());
});

// compress images
gulp.task('compress-img', function () {
	return gulp.src(path.contentBuild.img)
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [{ removeViewBox: false }]
		}))
		.pipe(gulp.dest(path.content.img));
});

// default task
gulp.task('default', ['clean', 'sass', 'sass:watch', 'minify-js', 'compress-img', 'browser-sync']);