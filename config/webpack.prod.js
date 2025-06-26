const webpack = require("webpack");
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

const paths = require('./paths');
const publicUrl = paths.servedPath.slice(0, -1);
const getClientEnvironment = require('./env');
const env = getClientEnvironment(publicUrl);
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');

module.exports = merge(common, {
    output: {
        filename: '[name].js',
        path: paths.appPath + "/app/",
        publicPath: "/",
        chunkFilename: '[name].chunk.js'
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: Infinity,
      },
    },
    performance: false,
    mode: 'production',
    plugins: [
        new webpack.DefinePlugin(env.stringified),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new HtmlWebpackPlugin({
            inject: true,
            template: paths.appHtml,
            minify: {
              removeComments: true,
              collapseWhitespace: true,
              removeRedundantAttributes: true,
              useShortDoctype: true,
              removeEmptyAttributes: true,
              removeStyleLinkTypeAttributes: true,
              keepClosingSlash: true,
              minifyJS: true,
              minifyCSS: true,
              minifyURLs: true,
            }
        }),
        new InterpolateHtmlPlugin(HtmlWebpackPlugin, env.raw)
    ]
});