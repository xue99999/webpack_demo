const webpackMerge = require('webpack-merge')
const webpackCommonConfig = require('./webpack.common.config.js')
const webpack = require('webpack')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')

module.exports = webpackMerge(webpackCommonConfig, {
    mode: 'production',
    plugins: [
        new webpack.DefinePlugin({
            // 一定要在生产环境设置下面这个参数，打包会自动删除css sourceMap
            // 而不需要设置css-loader的option.sourceMap为false，
            // 这让我们可以只在common配置里面配置css相关loader，并只在dev环境有sourceMap，
            // 简化了我们的配置
            // 事实上所有插件都会检查这个参数，如果是production将会生成适用于生产环境的代码，精简是其中之一特点

            //注意，因为这个插件直接执行文本替换，给定的值必须包含字符串本身内的实际引号。
            // 通常，有两种方式来达到这个效果，使用 '"production"', 或者使用 JSON.stringify('production')。
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
    ],
    optimization: {
        // 配置了minimizer压缩选项后，webpack不会启用内置压缩插件
        // 所以一定要把JS和CSS压缩插件都配置一下
        minimizer: [
            // JS压缩 Terser支持转换es6语法，替换webpack内置的uglifyJS
            // https://github.com/webpack-contrib/terser-webpack-plugin
            // 如果不需要转换es6语法，也可以用uglifyJS压缩，但也要配置在下面
            new TerserWebpackPlugin({
                parallel: true,
                // 如果要使用terser的配置需要放在terserOptions里面
                // https://github.com/terser-js/terser
                terserOptions: {
                    compress: {
                        drop_console: true,
                        drop_debugger: true
                    }
                }
            }),
            new OptimizeCssAssetsPlugin()
        ]
    }
})