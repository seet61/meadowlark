/**
 * Created by seet on 05.03.17.
 */

module.exports = function (grunt) {
    //Загрузка плагинов
    [
        'grunt-cafe-mocha',
        'grunt-contrib-jshint',
        'grunt-exec'
    ].forEach(function (task) {
        grunt.loadNpmTasks(task);
    });

    //Настраиваем плагины
    grunt.initConfig({
        cafemocha: {
            all: {src: 'qa/tests-*.js', options: {ui: 'tdd'}}
        },
        jshint: {
            app: ['meadowlark.js', 'public/js/**/*.js', 'lib/**/*.js'],
            qa: ['Gruntfile.js', 'public/qa/**/*.js', 'qa/**/*.js']
        },
        exec: {
            linkchek: {
                cmd: 'linkcheck http://localhost:3000'
            }
        }
    });

    //Регистрируем задания
    grunt.registerTask("default", ["cafemocha","jshint"/*,"exec"*/]);
};