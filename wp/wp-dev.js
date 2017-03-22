/**
 * 开发模式下的webpack配置
 * 在整个项目开发过程中，几乎99%的时间都是在这个模式下进行的
 * 注意。两种模式的配置有较大差异！！
 */

const path = require('path');
const webpack = require('webpack');

const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

// const precss = require('precss');
// const autoprefixer = require('autoprefixer');
// const rucksackCss = require('rucksack-css');

module.exports = {
    context: path.resolve(__dirname),
    // more info:https://webpack.github.io/docs/build-performance.html#sourcemaps and https://webpack.github.io/docs/configuration.html#devtool
    devtool: 'cheap-eval-source-map',
    // set to false to see a list of every file being bundled.
    // noInfo: true, 
    entry: [
        // 服务器静态资源路径配置，保证首先载入????
        './src/webpack-public-path',
        'react-hot-loader/patch',
        'webpack-hot-middleware/client?reload=true',
        path.resolve(__dirname, 'src/index.js')
    ],
    // necessary per https://webpack.github.io/docs/testing.html#compile-and-test
    target: 'web',
    output: {
        path: `${__dirname}/dist`, // Note: Physical files are only output by the production build task `npm run build`.
        publicPath: '/', // 服务器静态资源路径配置
        filename: 'bundle.js'
    },
    plugins: [
        new webpack.NoErrorsPlugin(),
        // Tells React to build in either dev or prod modes. https://facebook.github.io/react/downloads.html (See bottom)
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development'),
            __DEV__: true
        }),
        new webpack.HotModuleReplacementPlugin(),
        new ExtractTextPlugin({
            filename: "[name].css",
            // filename: "[name]-[chunkhash].css",
            allChunks: true,
        }),
        // Create HTML file that includes references to bundled CSS and JS.
        new HtmlWebpackPlugin({
            template: 'src/template.html',
            title: '开发模式',
            // favicon: './src/favicon.ico',
            // minify: {
            //     removeComments: true,
            //     collapseWhitespace: true
            // },
            // hash: true,
            // 这样每次客户端页面就会根据这个hash来判断页面是否有必要刷新
            // 在项目后续过程中，经常需要做些改动更新什么的，一但有改动，客户端页面就会自动更新！
            inject: 'body'
        })
    ],
    resolve: {
        extensions: ['.js', '.jsx'],

        // 路径别名, 懒癌福音
        alias: {
            app: path.resolve(__dirname, 'src/components'),
            // 以前你可能这样引用 import { Nav } from '../../components'
            // 现在你可以这样引用 import { Nav } from 'app/components'

            style: path.resolve(__dirname, 'src/common/style')
            // 以前你可能这样引用 import "../../../styles/mixins.scss"
            // 现在你可以这样引用 import "style/mixins.scss"

            // 注意：别名只能在.js文件中使用。
        }
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                use: [{
                    loader: 'babel-loader',
                    options: { presets: ['es2015'] }
                }]
            },
            //目前下面这段加上会报错!!!
            // {
            //     test: /\.(sass|scss)$/,
            //     include: [path.resolve(__dirname, 'src/app'), path.resolve(__dirname, 'src/components')],
            //     use: [
            //         {
            //             loader: [
            //                 'style',
            //                 'postcss?parser=postcss-scss'
            //             ],
            //             options: {
            //                 modules: true,
            //                 localIdentName: '[local]___[hash:base64:5]'
            //             }
            //         }
            //     ]
            // },
            // 组件样式，需要私有化，单独配置
            {
                test: /\.less$/,
                // include: path.resolve(__dirname, 'src/common'),
                use: ["style-loader", "css-loader", "less-loader"]
            },
            {
                test: /\.scss$/,
                // include: path.resolve(__dirname, 'src/common'),
                use: ["style-loader", "css-loader", {
                    loader: 'postcss-loader?parser=postcss-scss',
                    options: {
                        plugins: function () {
                            return [
                                require('precss'),
                                require('autoprefixer'),
                                require('rucksack-css')
                            ];
                        }
                    }
                }]
            },
            // 公有样式，不需要私有化，单独配置
            {
                test: /\.(otf|eot|svg|ttf|woff|woff2).*$/,
                use: 'url?limit=10000'
            },
            {
                /** 用于js/css中引入的图片处理 
                 * https://webpack.js.org/loaders/url-loader/
                */
                test: /\.(png|jpe?g|gif)$/,
                use: ['url-loader?limit=8192&name=img/[name].[hash:8].[ext]']
            }
        ]
    },
    // postcss: () => [precss, autoprefixer, rucksackCss]
};
