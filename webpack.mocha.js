const common = require("./webpack.common");
const merge = require("webpack-merge");
const nodeExternals = require('webpack-node-externals');

delete common.entry;

module.exports = env => merge(common(env), {
    mode: "development",
    devtool: "inline-source-map",
    externals: [nodeExternals()],
    output: {
        devtoolFallbackModuleFilenameTemplate: '[absolute-resource-path]?[hash]',
        devtoolModuleFilenameTemplate: '[absolute-resource-path]'
    }
});
