import gulp from 'gulp';
import plumber from 'gulp-plumber';
import less from 'gulp-less';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import browser from 'browser-sync';
import csso from 'postcss-csso';
import rename from 'gulp-rename';
import htmlmin from 'gulp-htmlmin';
import terser from 'gulp-terser';
import squoosh from 'gulp-libsquoosh';
import svgo from 'gulp-svgmin';
import svgstore from 'gulp-svgstore';
import del from 'del';

// Styles

export const styles = () => {
  return gulp.src('source/less/style.less', { sourcemaps: true })
    .pipe(plumber())
    .pipe(less())
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('build/css', { sourcemaps: '.' }))
    .pipe(browser.stream())
}

const html = () => {
  return gulp.src('source/*.html')
  .pipe(htmlmin({ collapseWhitespace: true }))
  .pipe(gulp.dest('build/'));
}

const scripts = () => {
  return gulp.src('source/js/*.js')
  .pipe(terser())
  .pipe(rename('main.min.js'))
  .pipe(gulp.dest('build/js'))
  .pipe(browser.stream());
}

const optimizeImages = () => {
  return gulp.src('source/img/**/*.{png,jpg}')
    .pipe(squoosh())
    .pipe(gulp.dest('build/img'))
}

const copyFonts = (done) => {
  gulp.src('source/fonts/*.{woff2,woff}', {
    base: 'source'
  })
    .pipe(gulp.dest('build'))
  done();
}

const copyImages = () => {
  return gulp.src('source/img/**/*.{png,jpg,ico}')
    .pipe(gulp.dest('build/img'))
}

 const createWebp = () => {
  return gulp.src('source/img/**/*.{png,jpg}')
    .pipe(squoosh({
      webp: {}
    }))
    .pipe(gulp.dest('build/img'))
}

const svg = () =>
  gulp.src(['source/img/*.svg', '!source/img/sprites/*.svg', '!source/img/sprites.svg'])
    .pipe(svgo())
    .pipe(gulp.dest('build/img'));

const sprites = () => {
  return gulp.src('source/img/sprites/*.svg')
    .pipe(svgo())
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename('sprite.svg'))
    .pipe(gulp.dest('build/img'));
}

// Clean

const clean = () => {
  return del('build');
};

// Server

const server = (done) => {
  browser.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

// Reload

const reload = (done) => {
  browser.reload();
  done();
}
// Watcher

export const watcher = () => {
  gulp.watch('source/less/**/*.less', gulp.series(styles));
  gulp.watch('source/js/*.js', gulp.series(scripts));
  gulp.watch('source/*.html', gulp.series(html, reload));
}

// Build

 export const build = gulp.series(
  clean,
  copyFonts,
  optimizeImages,
  gulp.parallel(
    styles,
    html,
    scripts,
    svg,
    sprites,
    createWebp
  ),
);

// Default

export default gulp.series(
  clean,
  copyFonts,
  copyImages,
  gulp.parallel(
    styles,
    html,
    scripts,
    svg,
    sprites,
    createWebp
  ),
  gulp.series(
    server,
    watcher
  )
);
