const webpackMerge = require('webpack-merge')
const webpackCommonConfig = require('./webpack.common.config.js')
const webpack = require('webpack')

module.exports = webpackMerge(webpackCommonConfig, {
    mode: 'development',
    plugins: [
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ],
    devtool: 'inline-source-map',
    devServer: {
        contentBase: false,
        hot: true
    }
})