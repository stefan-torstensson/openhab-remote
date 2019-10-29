const common = require("./webpack.common");
const merge = require("webpack-merge");
const HtmlPlugin = require('html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require("script-ext-html-webpack-plugin");
const XMLWebpackPlugin = require("xml-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const pkg = require("./package.json");
const path = require("path");

const xmlConfig = {
    files: [{
        template: path.join(__dirname, "tizen", "config.xml"),
        filename: 'config.xml',
        data: {
            version: pkg.version
        }
    }]
};

module.exports = merge(common, {
    devtool: "source-map",

    plugins: [
        new HtmlPlugin({
            filename: 'tizen.html',
            template: 'src/tizen.html',
            chunks: ['vendors', 'main']
        }),
        new ScriptExtHtmlWebpackPlugin({
            defaultAttribute: 'defer'
        }),
        new XMLWebpackPlugin(xmlConfig),
        // new BundleAnalyzerPlugin({analyzerMode: 'server'})
    ]
});
