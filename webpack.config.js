var htmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry: './index.js',
    output: {
        path: './dist',
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {test: /\.vue$/, loaders: ['vue']},
            {test: /\.js$/, exclude: /node_modules/, loaders: ['babel']}
        ]
    },
    plugins: [new htmlWebpackPlugin({
        template: './index.html'
    })]
}