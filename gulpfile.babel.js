import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import path from 'path';
import del from 'del';
import runSequence from 'run-sequence';

const plugins = gulpLoadPlugins();

const paths = {
  js: ['./**/*.js', '!dist/**', '!docs/**', '!node_modules/**', '!coverage/**'],
  nonJs: ['./package.json', './.gitignore'],
  tests: './server/tests/*.js'
};

// Clean up dist and coverage directory
gulp.task('clean', () =>
  del(['dist/**', '!dist'])
);

// Copy non-js files to dist
gulp.task('copy', () =>
  gulp.src(paths.nonJs)
    .pipe(plugins.newer('dist'))
    .pipe(gulp.dest('dist'))
);

//copy static
gulp.task('copy:static', () => {
  gulp.src(['./src/static/**/**.**', './src/static/**/**/**.**'])
    .pipe(plugins.newer('dist/src/static'))
    .pipe(gulp.dest('dist/src/static'))
})

//copy view
gulp.task('copy:view', () => {
  gulp.src(['./src/views/**/**.**', './src/views/**/**/**.**'])
    .pipe(plugins.newer('dist/src/views'))
    .pipe(gulp.dest('dist/src/views'))
})

// Compile ES6 to ES5 and copy to dist
gulp.task('babel', () =>
  gulp.src([...paths.js, '!gulpfile.babel.js'], { base: '.' })
    .pipe(plugins.newer('dist'))
    .pipe(plugins.babel())
    .pipe(gulp.dest('dist'))
);

// Start server with restart on file changes
gulp.task('nodemon', ['copy', 'copy:static', 'copy:view', 'babel'], () =>
  plugins.nodemon({
    script: path.join('dist', 'server.js'),
    ext: 'js',
    ignore: ['node_modules/**/*.js', 'dist/**/*.js'],
    tasks: ['copy', 'copy:static', 'copy:view', 'babel']
  })
);

// gulp serve for development
gulp.task('serve', ['clean'], () => runSequence('nodemon'));

// default task: clean dist, compile js files and copy non-js files.
gulp.task('default', ['clean'], () => {
  runSequence(
    ['copy', 'babel']
  );
});
