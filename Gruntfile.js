module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-ts');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        ts: {
            client: {
                src: ['src/client/_references.ts'],
                out: 'src/client/client.js'
            },
            server: {
                src: ['src/server/_references.ts'],
                out: 'src/server/server.js'
            },
            options: {
                target: 'es5',
                sourceMap: true,
                module: 'commonjs'
            }
        },
        watch: {
            client: {
                files: 'src/**/*.ts',
                tasks: ['ts:client', 'ts:server']
            }
        }
    });

    grunt.registerTask('default', ['watch']);
};