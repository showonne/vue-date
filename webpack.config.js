module.exports = {
    entry: './index.js',
    output: {
        path: './lib',
        library: 'datepicker',
        filename: 'vue-datepicker.js',
        libraryTarget: 'umd'
    },
    module: {
        loaders: [
            {test: /\.vue$/, loaders: ['vue']},
            {test: /\.js$/, exclude: /node_modules/, loaders: ['babel']}
        ]
    }
}