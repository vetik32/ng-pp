'use strict';
var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;
var mountFolder = function(connect, dir) {
  return connect.static(require('path').resolve(dir));
};

module.exports = function(grunt) {
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  grunt.loadNpmTasks('grunt-protractor-runner');

  // configurable paths
  var yeomanConfig = {
    app: 'app',
    dist: 'dist',
    deploy: '../public'
  };

  try {
    yeomanConfig.app = require('./bower.json').appPath || yeomanConfig.app;
  } catch (e) {}
  var proxySnippet = require('grunt-connect-proxy/lib/utils').proxyRequest;

  grunt.initConfig({
    yeoman: yeomanConfig,
    protractor: {
      options: {
        keepAlive: false
      },

      run: {
        configFile: 'protractor.conf.js'
      }
    },


    shell: {
      options: {
        stdout: true
      },
      install_selenium: {
        command: 'node ./node_modules/protractor/bin/webdriver-manager update'
      },
      start_selenium: {
        command: 'node ./node_modules/protractor/bin/webdriver-manager start'
      }
    },

    watch: {
      compass: {
        files: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
        tasks: ['compass']
      },
      livereload: {
        files: [
          '<%= yeoman.app %>/{,*/}*.html',
          '{.tmp,<%= yeoman.app %>}/styles/{,*/}*.css',
          '{.tmp,<%= yeoman.app %>}/scripts/{,*/}*.js',
          '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ],
        tasks: ['livereload']
      }
    },
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        //hostname: 'localhost'
        hostname: '0.0.0.0'
      },
      proxies: [{
        context: '/api/reports',
        host: '0.0.0.0',
        port: 3000,
        https: false,
        changeOrigin: false
      }, {
        context: '/verifylogin',
        host: '0.0.0.0',
        port: 3000,
        https: false,
        changeOrigin: false
      }, {
        context: '/updatepartner',
        host: '0.0.0.0',
        port: 3000,
        https: false,
        changeOrigin: false
      }, {
        context: '/session',
        host: '0.0.0.0',
        port: 3000,
        https: false,
        changeOrigin: false
      }, {
        context: '/admin',
        host: '0.0.0.0',
        port: 3000,
        https: false,
        changeOrigin: false
      }],
      livereload: {
        options: {
          middleware: function(connect) {
            return [
              proxySnippet,
              lrSnippet,
              mountFolder(connect, '.tmp'),
              mountFolder(connect, yeomanConfig.app)
            ];
          }
        }
      },
      test: {
        options: {
          middleware: function(connect) {
            return [
              mountFolder(connect, '.tmp'),
              mountFolder(connect, 'test')
            ];
          }
        }
      }
    },
    open: {
      server: {
        url: 'http://localhost:<%= connect.options.port %>'
      }
    },
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/*',
            '!<%= yeoman.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp'
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        '<%= yeoman.app %>/scripts/{,*/}*.js'
      ]
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true
      }
    },
    compass: {
      options: {
        sassDir: '<%= yeoman.app %>/styles',
        cssDir: '.tmp/styles',
        imagesDir: '<%= yeoman.app %>/images',
        javascriptsDir: '<%= yeoman.app %>/scripts',
        fontsDir: '<%= yeoman.app %>/styles/fonts',
        importPath: '<%= yeoman.app %>/components',
        relativeAssets: true
      },
      dist: {},
      server: {
        options: {
          debugInfo: true
        }
      }
    },
    concat: {
      dist: {
        files: {
          '<%= yeoman.dist %>/scripts/scripts.js': [
            '.tmp/scripts/{,*/}*.js',
            '<%= yeoman.app %>/scripts/{,*/}*.js'
          ]
        }
      }
    },
    useminPrepare: {
      html: '<%= yeoman.app %>/index.html',
      options: {
        dest: '<%= yeoman.dist %>'
      }
    },
    usemin: {
      html: ['<%= yeoman.dist %>/{,*/}*.html'],
      css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
      options: {
        dirs: ['<%= yeoman.dist %>']
      }
    },
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.{png,jpg,jpeg}',
          dest: '<%= yeoman.dist %>/images'
        },{
          expand: true,
          cwd: '<%= yeoman.app %>/components/jquery-ui/themes/flick/images',
          src: '*',
          dest: '<%= yeoman.dist %>/styles/images'
        }, {
          expand : true,
          flatten : true,
          cwd : '<%= yeoman.app %>/styles',
          src : '**/*.{png,jpg,jpeg,gif}',
          dest : '<%= yeoman.dist %>/styles/images'
        }]
      }
    },
    cssmin: {
      dist: {
        files: {
          '<%= yeoman.dist %>/styles/main.css': [
            '.tmp/styles/{,*/}*.css',
            '<%= yeoman.app %>/styles/{,*/}*.css',
            '<%= yeoman.app %>/styles/*/*/{,*/}*.css'
          ]
        }
      }
    },
    htmlmin: {
      dist: {
        options: {
          /*removeCommentsFromCDATA: true,
              // https://github.com/yeoman/grunt-usemin/issues/44
              //collapseWhitespace: true,
              collapseBooleanAttributes: true,
              removeAttributeQuotes: true,
              removeRedundantAttributes: true,
              useShortDoctype: true,
              removeEmptyAttributes: true,
              removeOptionalTags: true*/
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>',
          src: [
            '*.html',
            'views/*.html',
            'views/*/*.html'
          ],
          dest: '<%= yeoman.dist %>'
        }]
      }
    },
    cdnify: {
      dist: {
        html: ['<%= yeoman.dist %>/*.html']
      }
    },
    ngmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.dist %>/scripts',
          src: '*.js',
          dest: '<%= yeoman.dist %>/scripts'
        }]
      }
    },
    uglify: {
      options: {
        report: 'min',
        mangle: false
      },
      dist: {
        files: {
          '<%= yeoman.dist %>/scripts/scripts.js': [
            '<%= yeoman.dist %>/scripts/scripts.js'
          ]
        }
      }
    },
    rev: {
      dist: {
        files: {
          src: [
            '<%= yeoman.dist %>/scripts/{,*/}*.js',
            '<%= yeoman.dist %>/styles/{,*/}*.css',
            '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp}',
            '<%= yeoman.dist %>/styles/fonts/*'
          ]
        }
      }
    },
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: [
            '*.{ico,txt}',
            '.htaccess',
            'components/**/*',
            'components/**/dist/*',
            'images/{,*/}*.{gif,webp}',
            'styles/*/*/*.min.css',
            'styles/images/*.png',
            'scripts/*/*.tpl.html',
            'scripts/utils/directives/*/*.html',
            'data/*.json'
          ]
        }]
      },
      deploy: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.dist %>',
          dest: '<%= yeoman.deploy %>',
          src: ['**']
        }]
      }
    }
  });

  grunt.renameTask('regarde', 'watch');

  grunt.registerTask('server', [
    'clean:server',
    'compass:server',
    'configureProxies',
    'livereload-start',
    'connect:livereload',
    'open',
    'watch'
  ]);

  grunt.registerTask('test', [
    'clean:server',
    'compass',
    'connect:test',
    'karma'
  ]);

  grunt.registerTask('install:selenium', [
    'shell:install_selenium'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'jshint',
    'test',
    'compass:dist',
    'useminPrepare',
    'concat',
    'imagemin',
    'cssmin',
    'htmlmin',
    'copy:dist',
    'cdnify',
    'ngmin',
    'uglify',
    'rev',
    'usemin'
  ]);

  grunt.registerTask('deploy', [
    'clean:dist',
    'jshint',
    'compass:dist',
    'useminPrepare',
    'concat',
    'imagemin',
    'cssmin',
    'htmlmin',
    'copy:dist',
    'cdnify',
    'ngmin',
    'uglify',
    'rev',
    'usemin',
    'copy:deploy'
  ]);

  grunt.registerTask('selenium:start', ['shell:start_selenium']);
  grunt.registerTask('test:e2e', ['protractor:run']);

  grunt.registerTask('default', ['build']);
};
