'use strict';
module.exports = function (grunt) {
  grunt.initConfig({
    opts: {
      jsName: 'gutenberg-block',
      cssName: 'style',
      companyName: 'ClassCube',
      companySite: 'https://classcube.com',
      langDomain: 'classcube-mathjax-block',
      bugsURL: 'https://github.com/classcube/'
    },
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';\r\n'
      },
      dist: {
        src: [
          'js/src/*.js',
          'js/src/**/*.js'
        ],
        dest: 'js/dist/<%= opts.jsName %>.js'
      }
    },
    uglify: {
      options: {
        banner: '/* (c) <%= grunt.template.today("yyyy") %> <%= opts.companyName %> - <%= opts.companySite %> */\n',
        report: 'min',
        compress: {
          drop_console: false,
          sequences: false
        }
      },
      dist: {
        files: {
          'js/dist/<%= opts.jsName %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },
    watch: {
      js: {
        files: ['<%= concat.dist.src %>'],
        tasks: ['concat', 'uglify', 'notify:done']
      },
      css: {
        files: ['**/*.scss', '!node_modules/**'],
        tasks: ['sass', 'notify:css']
      },
      php: {
        files: ['*.php', '**/*.php', '!node_modules/**'],
        tasks: ['makepot', 'notify:php']
      }
    },
    notify: {
      done: {
        options: {
          title: '"JavaScript"',
          message: '"JavaScript code combined and uglified"'
        }
      },
      php: {
        options: {
          title: '"PHP tasks complete"',
          message: '"All PHP tasks complete"'
        }
      },
      css: {
        options: {
          title: '"SCSS tasks complete"',
          message: '"SCSS files compressed"'
        }
      }
    },
    makepot: {
      target: {
        options: {
          cwd: '',
          domainPath: 'lang',
          exclude: [],
          include: [],
          mainFile: '',
          potComments: '',
          potFilename: '',
          potHeaders: {
            poedit: true,
            'x-poedit-keywordslist': true,
            'Report-Msgid-Bugs-To': '<%= opts.bugsURL %>'
          },
          processPot: null,
          type: 'wp-plugin',
          updateTimestamp: true,
          updatePoFiles: false
        }
      }
    },
    addtextdomain: {
      options: {
        textdomain: '<%= opts.langDomain %>',
        updateDomains: true
      },
      target: {
        files: {
          src: [
            '*.php',
            '**/*.php',
            '!node_modules/**',
            '!tests/**'
          ]
        }
      }
    },
    sass: {
      all: {
        options: {
          style: 'compressed'
        },
        files: {
          'css/dist/<%= opts.cssName %>.min.css': 'css/src/<%= opts.cssName %>.scss'
        }
      }
    },
    bump: {
      options: {
        files: ['package.json'],
        updateConfigs: [],
        commit: false,
        commitMessage: 'Release v%VERSION%',
        commitFiles: ['package.json'],
        createTag: false,
        tagName: 'v%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: false,
        pushTo: 'upstream',
        gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d',
        globalReplace: false,
        prereleaseName: false,
        metadata: '',
        regExp: false
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-notify');
  grunt.loadNpmTasks('grunt-wp-i18n');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-bump');
  grunt.registerTask('default', ['concat', 'uglify', 'watch', 'notify:done']);
  grunt.registerTask('watchJS', ['watch']);
  grunt.registerTask('lang', ['addtextdomain', 'makepot']);

  grunt.registerTask('version', 'Updates version for the plugin', function (step) {
    if (step === undefined) {
      step = 'patch';
    }
    if (!['patch', 'minor', 'major'].includes(step)) {
      grunt.log.writeln('Invalid step for version upgrade:' + step);
      grunt.log.writeln('\n');
      grunt.log.writeln('grunt version - updates patch version\ngrunt version:patch - updates patch version\ngrunt version:minor - updates to next minor version\ngrunt version:major - updates to next major version\n\n');
      return;
    }

    grunt.task.run(['bump:' + step]);
  });
};
