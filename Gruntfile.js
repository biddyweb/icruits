/**
 * Created by einjel on 4/22/17.
 */
/*global module:false*/
module.exports = function (grunt) {

    grunt.initConfig({
        // metadata

        pkg: grunt.file.readJSON('package.json'),

        concat: {
            dist: {
                src: ['web/static/js/**/*.js'],
                dest: ['web/static/dist/js/build/concated.js']
            },
            options: {
                separator: ';'
            }
        },

        uglify: {
            dist: {
                src: ['web/static/js/init/*.js'],
                dest: ['web/static/js/init/main.min.js']
            }
        },

        cssmin: {
            dist: {
                src: ['web/static/style/css/main.css'],
                dest: ['web/static/style/css/main.min.css']
            }
        },

        clean: ['web/static/dist/js/build'],

        copy: {
            dist: {
                cwd: ['web/static/img'],
                src: ['**/*'],
                dest: ['web/static/dist/img/'],
                expand: true
            }
        },

        hashres: {
            dist: {
                src: ['web/static/js/init/main.min.js',
                      'web/static/style/css/main.min.css'
                ],
                dest: ['templates/main.html']
            }
        },

        wiredep: {
            dist: {
                src: ['templates/main.html'],
                dependencies: true,
                ignorePath: '../../web/static/',
                fileTypes: {
                    html: {
                        replace: {
                            js: '<script src="{% static "{{filePath}}" %}"></script>',
                            css: '<link rel="stylesheet" href="{% static "{{filePath}}" %}" />'
                        }
                    }
                }
            }
        },

        // ZA herohu
        html_snapshots: {
            // options for all targets
            source: "https://icruits.herokuapp.com/robots.txt",
            options: {
                input: "sitemap",
                source: "https://icruits.herokuapp.com/sitemap.xml",
                hostname: "https://icruits.herokuapp.com",
                outputDirClean: "true"
            },
            // the debug target
            debug: {
                options: {
                    outputDir: "templates/snapshots/"
                }
            },
            // the release target
            release: {
                options: {
                    outputDir: "snapshots/release"
                }
            }
        }

        // za lokal host

    });

    // These plugins provide necessary tasks.

    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.loadNpmTasks('grunt-contrib-cssmin');

    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.loadNpmTasks('grunt-hashres');

    grunt.loadNpmTasks('grunt-wiredep');

    grunt.loadNpmTasks('grunt-html-snapshot');

    grunt.loadNpmTasks('grunt-html-snapshots');

    grunt.registerTask('debug', ['html_snapshots:debug']);

    grunt.registerTask('default', ['concat', 'uglify', 'clean', 'cssmin', 'copy', 'hashres', 'html_snapshots:debug']);

    grunt.registerTask('wiredep', ['wiredep']);

    grunt.registerTask('Snapshot', ['htmlSnapshot']);
};
