const common = require("./webpack.common");
const merge = require("webpack-merge");
const HtmlPlugin = require('html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require("script-ext-html-webpack-plugin");
const XMLWebpackPlugin = require("xml-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const pkg = require("./package.json");
const path = require("path");


const xmlConfig = env => {
    return {
        files: [{
            template: path.join(__dirname, "tizen", "config.ejs"),
            filename: 'config.xml',
            data: {
                version: pkg.version,
                appId: pkg.tizen.appId,
                appName: pkg.tizen.appName,
                package: pkg.tizen.package,
                additionalPrivileges: (env && env.FILE_LOGGER) ? ["filesystem.read", "filesystem.write"] : []
            }
        }]
    }
};

const templateParameters = {
    appName: pkg.tizen.appName,
    devChrome: false
};

module.exports = env => {
    return merge(common(env), {
        devtool: "source-map",

        plugins: [
            new HtmlPlugin({
                filename: 'index.html',
                template: 'src/index.ejs',
                chunks: ['vendors', 'main'],
                templateParameters
            }),
            new ScriptExtHtmlWebpackPlugin({
                defaultAttribute: 'defer'
            }),
            new XMLWebpackPlugin(xmlConfig(env)),
            // new BundleAnalyzerPlugin({analyzerMode: 'server'})
        ]
    });
};
