const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const DefinePlugin = require("webpack").DefinePlugin;

const SRC_PATH = path.resolve(__dirname, 'src');
const TEST_PATH = path.resolve(__dirname, 'test');
const TARGET_PATH = path.resolve(__dirname, 'build');

const INCLUDE_PATHS = [SRC_PATH, TEST_PATH];

const noop = () => {};
const isProduction = (process.env.NODE_ENV === "production");

function definitions(env) {
    const result = {
        "COPYRIGHT_YEARS": JSON.stringify([...new Set([2019, new Date().getFullYear()])].join("-")),
        "PRODUCTION_BUILD": JSON.stringify(isProduction)
    };
    if (env) {
        for (const key in env) {
            result[key] = JSON.stringify(env[key]);
        }
    }
    return result;
}

module.exports = env => ({
    target: 'web',
    mode: 'development',
    entry: {
        'main': './src/ui/main.ts'
    },
    optimization: {
        concatenateModules: false,
        splitChunks: {
            // chunks: 'initial',
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all',
                }
            }
        }
    },
    output: {
        path: TARGET_PATH,
        filename: '[name].js'
    },
    resolve: {
        extensions: ['.ts', '.js', '.json', '.vue'],
        alias: {
            // 'vue$': 'vue/dist/vue.esm.js',
            '@app': SRC_PATH,
            'settings': path.join(SRC_PATH, 'style/_settings.scss'),
            'theming': path.join(SRC_PATH, 'style/theming.scss'),
            'package.json': path.join(__dirname, 'package.json'),
            'test-env': path.join(TEST_PATH, 'test-env.ts')
        }
    },
    module: {
        rules: [
            {
                test: /\.(ts)$/,
                include: INCLUDE_PATHS,
                use: [{
                    loader: 'babel-loader'
                }, {
                    loader: 'tslint-loader',
                    options: {
                        formatter: "msbuild"
                    }
                }]
            },
            {
                test: /\.vue$/,
                include: INCLUDE_PATHS,
                use: {
                    loader: 'vue-loader'
                }
            },
            {
                test: /\.(css|scss)$/,
                include: INCLUDE_PATHS,
                use: [
                    isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            url: (url, _resourcePath) => !url.includes('openhab-logo')
                        }
                    }, 'sass-loader']
            },
            {
                test: /\.(png)$/,
                include: INCLUDE_PATHS,
                use: ['url-loader']
            },
            {
                test: /\.(svg)$/,
                include: INCLUDE_PATHS,
                oneOf: [
                    {
                        issuer: /\.(vue|ts)$/,
                        use: ['babel-loader', 'vue-svg-loader']
                    },
                    {
                        use: ['url-loader']
                    }
                ]
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        isProduction ? new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: "[name].css",
            chunkFilename: "[id].css"
        }) : noop,
        new DefinePlugin(definitions(env))
    ]
});
