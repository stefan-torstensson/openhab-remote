const common = require("./webpack.common");
const merge = require("webpack-merge");
const HtmlPlugin = require('html-webpack-plugin');

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
            template: 'src/index.html',
            chunks: ['vendors', 'main', 'debug']
        }),
        new HtmlPlugin({
            filename: 'playground.html',
            template: 'src/index.html',
            chunks: ['vendors', 'playground', 'debug']
        })
    ]
});
