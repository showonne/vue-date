var webpack = require('webpack')
var htmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry: {
        bundle: './index.js',
        vendors: ['vue']
    },
    output: {
        path: './dist/webpack/',
        filename: '[name].js',
    },
    module: {
        loaders: [
            {test: /\.vue$/, loaders: ['vue']},
            {test: /\.js$/, exclude: /node_modules/, loaders: ['babel']}
        ]
    },
    resolve: {
        alias: {
            'vue': 'vue/dist/vue.js'
        }
    },
    plugins: [
            // new htmlWebpackPlugin({
            //     template: './index.html'
            // }),
            // new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js'),
            // new webpack.optimize.UglifyJsPlugin({minimize: true})
        ]
}