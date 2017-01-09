(function() {
	'use strict';

	var gulp       = require('gulp'),
		concat     = require('gulp-concat'),
		typescript = require('gulp-typescript'),
		livereload = require('gulp-livereload');


	var srcPath = {
        css : 'styles/',
        ts  : 'scripts/ts/',
        root: ''
    };

    var destPath = {
        js  : 'scripts/js/',
    };

	// ---------------------------------------------------------------------
    // | Maintains updated src changes in the browser.                     |
    // ---------------------------------------------------------------------

    /**
     * Reload on change.
     */
    gulp.task('reload', function() {
        gulp.src(srcPath.root)
            .pipe(livereload());
    });

    /**
     * Monitors changes in projects files and apply changes instantly.
     * Use with livereload chrome extension.
     * Reference: https://github.com/vohof/gulp-livereload
     */
    gulp.task('watch', function() {
        // Files to be watched.
        var files = [
            srcPath.ts   + '**/*.ts',
            srcPath.css  + '**/*.css',
            srcPath.root + '*.html'
        ];

        livereload.listen();

        gulp.watch(files, ['typescript', 'reload']);
    });


	// ---------------------------------------------------------------------
    // | Build production project.                                         |
    // ---------------------------------------------------------------------

    /**
     * Concatenate and compile typescript files.
     * Reference: https://www.npmjs.com/package/gulp-typescript/
     */
    gulp.task('typescript', function() {
        var opts = {
        	target: 'ES5',
        	removeComments: false,
        	noImplicitAny: false
        };

        // Source files.
        var srcFiles = [
            srcPath.ts + '**/*.ts'
        ];

        // Output file.
        var outputFile = 'pl-modal.ts';

        return gulp.src(srcFiles)
            .pipe(concat(outputFile))
            .pipe(typescript(opts))
            .pipe(gulp.dest(destPath.js));
    });

})();