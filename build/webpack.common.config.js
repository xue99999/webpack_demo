const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

// 注意，这里使用process.env.NODE_ENV之前，需要在package.json的scripts命令里面
// 添加 NODE_ENV=development / production 才能获取到process.env.NODE_ENV的值
// 否则默认在webpack的配置文件里面是获取不到的
// 因为通过webpack.DefinePlugin设置的，在这里还没设置上
const devMod = process.env.NODE_ENV === "development"

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: '[name].bundle.js'
    },
    module: {
        rules: [{
            test: /\.(le|c)ss$/,
            use: [
                {
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        // 支持热更新
                        hmr: devMod,
                        // if hmr does not work, this is a forceful method.
                        reloadAll: true
                    }
                },
                'css-loader',
                {
                    // postcss依靠各种插件处理CSS，它基本是前端项目的必备CSS预处理模块
                    // 但这里只用到了它最简单的功能，对于它我们后面也许会深入的探索*
                    loader: 'postcss-loader',
                    options: {
                        ident: 'postcss',
                        plugins: [
                            // 添加厂商样式前缀插件
                            require('autoprefixer')()
                        ]
                    }
                },
                'less-loader',
            ]
        }, {
            test: /\.(png|gif|jpg)$/,
            use: ['file-loader']
        }, {
            test: /\.m?js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: [
                        [
                            '@babel/preset-env',
                            {
                                // useBuiltIns polyfill设置 使用内建？
                                // 将polyfill应用于@babel/preset-env中的方法
                                'useBuiltIns': 'entry',//"usage" | "entry" | false, defaults to false.
                                'corejs': 3 // 使用core-js不能缺少的配置
                            }
                        ]
                    ],
                    plugins: ['@babel/plugin-transform-runtime']
                },
            }
        }]
    },
    plugins: [
        // 没有从右向左的顺序, 插件实现机制是根据webpack生命周期来完成的
        new CleanWebpackPlugin(),
        // 打包后生成index.html
        new HtmlWebpackPlugin({
            title: 'lesson webpack',
            template: path.resolve(__dirname, '../src/index.html'),
            hash: true
        }),
        new MiniCssExtractPlugin({
            // 注意，在下面的配置*开发环境*的文件名应该使用[name].css，不要加hash
            // 加了hash不能热更新CSS，所以只在生产环境加hash
            filename: devMod ? '[name].css' : '[name].[hash].css',
            chunkFilename: devMod ? '[id].css' : '[id].[hash].css'
        })
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, '../src')
        }
    }
}