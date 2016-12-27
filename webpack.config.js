const path = require('path')

module.exports = {
    entry: './src/Datepicker.vue',
    output: {
        path: path.resolve(__dirname, './'),
        library: 'datepicker',
        filename: 'index.js',
        libraryTarget: 'umd'
    },
    module: {
        loaders: [
            {test: /\.vue$/, loaders: ['vue']},
            {test: /\.js$/, exclude: /node_modules/, loaders: ['babel']},
            {test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192'}
        ]
    }
}