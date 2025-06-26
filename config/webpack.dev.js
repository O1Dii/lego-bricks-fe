const webpack = require("webpack");
const merge = require('webpack-merge');
const common = require('./webpack.common');
const paths = require('./paths');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');

const getClientEnvironment = require('./env');
const env = getClientEnvironment("http://localhost:5000");

module.exports = merge(common, {
    output: {
        filename: 'bundle.js',
        path: paths.appPath + "/app/",
        publicPath: '/'
    },
    mode: 'development',
    devtool: 'source-map',
    watch: true,
    plugins: [
        new webpack.DefinePlugin(env.stringified),
        new HtmlWebpackPlugin({
            inject: true,
            template: paths.appHtml,
        }),
        new InterpolateHtmlPlugin(HtmlWebpackPlugin, env.raw),
    ]
});