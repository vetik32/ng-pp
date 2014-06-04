// Karma configuration
// Generated on Thu Nov 21 2013 16:40:19 GMT+0200 (EET)

module.exports = function (config) {
  config.set({

// base path, that will be used to resolve files and exclude
    basePath: 'app',

// list of files / patterns to load in the browser
    frameworks: ['jasmine'],

    files: [
      'components/es5-shim/es5-shim.js',
      'components/d3/d3.js',
      'components/moment/moment.js',
      'components/jquery/dist/jquery.js',
      'components/underscore/underscore.js',
      'components/angular/angular.js',
      'components/angular-ui-router/release/angular-ui-router.js',
      'components/angular-mocks/angular-mocks.js',
      'components/angular-resource/angular-resource.js',
      'components/angular-bootstrap/ui-bootstrap.js',
      'components/angular-bootstrap/ui-bootstrap-tpls.js',
      'components/angular-ui-date/src/date.js',
      'components/angular-spinner/angular-spinner.js',
      'components/angular-promise-tracker/promise-tracker.js',
      'components/angular-busy/dist/angular-busy.js',
      'scripts/**/*.js',
      'scripts/utils/**/*tpl.html'
    ],

    preprocessors: {
      'scripts/**/!(*pec).js': 'coverage',
      'scripts/**/*tpl.html': 'ng-html2js'
    },
// list of files to exclude
    exclude: [
    ],

// test results reporter to use
// possible values: dots || progress || growl
    reporters: ['dots', 'coverage'],

    coverageReporter: {
      type: 'html',
      dir: '../coverage'
    },
// web server port
    port: 8080,

    proxies :  {
      '/views': 'http://localhost:8080/views'
    },

// cli runner port
    runnerPort: 9100,

// enable / disable colors in the output (reporters and logs)
    colors: true,

// level of logging
// possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,

// enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

// Start these browsers, currently available:
// - Chrome
// - ChromeCanary
// - Firefox
// - Opera
// - Safari (only Mac)
// - PhantomJS
// - IE (only Windows)
    browsers: ['Chrome'],

// If browser does not capture in given timeout [ms], kill it
    captureTimeout: 5000,

// Continuous Integration mode
// if true, it capture browsers, run tests and exit
    singleRun: false
  });
};
