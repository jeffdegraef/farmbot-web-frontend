var webpack = require('webpack');
var generateConfig = require("./webpack.config.base");
var exec = require("child_process").execSync;
var fs = require("fs");
var path = require("path");
var configPath = path.join(process.cwd(), "src/config.json");
global.WEBPACK_ENV = "development";

c = function() {
    var conf = generateConfig();

    conf
        .module
        .loaders
        .push({
            test: [/\.scss$/, /\.css$/],
            loader: 'style!css!sass'
        });

    conf.devtool = 'source-map';

    conf
        .plugins
        .push(new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development'),
            'process.env.REVISION': JSON.stringify(
                exec('git log --pretty=format:"%h%n%ad%n%f" -1').toString())
        }));

    if (fs.existsSync(configPath)) {
        var config = require(configPath);
        conf.plugins.push(new webpack.DefinePlugin({
            "process.env.CONFIG": JSON.stringify(config)
        }));
    }

    return conf;
};

module.exports = c();