exports.config = {
  chromeOnly: true,
  chromeDriver: './node_modules/protractor/selenium/chromedriver',

  suites: {
    'example': ['test/e2e/example.spec.js'],
    'login': ['test/e2e/login.spec.js'],
    'home': ['test/e2e/home.spec.js']
  },

  specs: 'test/e2e/**/*.spec.js',

  allScriptsTimeout: 20000
};
