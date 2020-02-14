const common = require("./webpack.common");
const merge = require("webpack-merge");
const HtmlPlugin = require('html-webpack-plugin');
const DefinePlugin = require("webpack").DefinePlugin;
const pkg = require("./package");

const templateParameters = {
    appName: pkg.tizen.appName,
    devChrome: true
};

module.exports = env => merge(common(env), {
    mode: "development",
    devtool: 'source-map',
    entry: {
        'debug': './src/debug/index.ts',
        'playground': './test/playground/playground.ts'
    },
    devServer: {
        // contentBase: common.output.path + "_dev",
        stats: "errors-warnings"
    },
    plugins: [
        new HtmlPlugin({
            filename: 'index.html',
            template: 'src/index.ejs',
            chunks: ['vendors', 'debug',  'main'],
            chunksSortMode: 'manual',
            templateParameters
        }),
        new HtmlPlugin({
            filename: 'playground.html',
            template: 'src/index.ejs',
            chunks: ['vendors', 'debug', 'playground'],
            chunksSortMode: 'manual',
            templateParameters
        }),
        new DefinePlugin({
            BROWSER_CONSOLE: JSON.stringify(true)
        })
    ]
});
