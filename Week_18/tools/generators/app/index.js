var Generator = require('yeoman-generator');

module.exports = class extends Generator {
    async installPackages() {

        const answers = await this.prompt([
            {
                type: "input",
                name: "name",
                message: "Your project name",
                default: this.appname // Default to current folder name
            }
        ]);
        const pkgJson = {
            "name": answers.name,
            "version": "0.1.0",
            "description": "",
            "main":"generators/app/index.js",
            "scripts":{
                "build":"webpack",
                "test":"mocha --require @babel/register",
                "coverage":"nyc mocha  --require @babel/register"
            },
            "files": [
                "generators"
            ],
            "keywords": [
                "yeoman-generator"
            ],
            "devDependencies": {
            },
            "dependencies": {
            }
        };

        // Extend or create package.json file in destination path
        this.fs.extendJSON(this.destinationPath('package.json'), pkgJson);
        this.npmInstall(['vue'], { 'save-dev': false });
        this.npmInstall([
            'webpack',
            'webpack-cli',
            'vue-loader',
            'vue-style-loader',
            'babel-loader',
            "babel-plugin-istanbul",
            "@istanbuljs/nyc-config-babel",
            "@babel/core",
            "@babel/preset-env",
            "@babel/register",
            "mocha",
            "nyc",
            'css-loader',
            'vue-template-compiler',
            'copy-webpack-plugin',
        ], { 'save-dev': true });
        this.fs.copyTpl(
            this.templatePath('sample-test.js'),
            this.destinationPath('test/sample-test.js'),
            {}
        );

        this.fs.copyTpl(
            this.templatePath('.babelrc'),
            this.destinationPath('.babelrc'),
            {}
        );

        this.fs.copyTpl(
            this.templatePath('.nycrc'),
            this.destinationPath('.nycrc'),
            {}
        );

        this.fs.copyTpl(
            this.templatePath('Hello.vue'),
            this.destinationPath('src/Hello.vue'),
            { title: 'Templating with Yeoman' }
        );

        this.fs.copyTpl(
            this.templatePath('webpack.config.js'),
            this.destinationPath('webpack.config.js'),
        );

        this.fs.copyTpl(
            this.templatePath('main.js'),
            this.destinationPath('src/main.js'),
        );

        this.fs.copyTpl(
            this.templatePath('index.html'),
            this.destinationPath('src/index.html'),
            { title: answers.name }
        );
    }
};