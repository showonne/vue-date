const path = require('path')

module.exports = {
    mode: 'production',
    entry: './src/Datepicker.vue',
    output: {
        path: path.resolve(__dirname, './lib'),
        library: 'datepicker',
        filename: 'index.js',
        libraryTarget: 'umd',
        libraryExport: 'default'
    },
    module: {
        rules: [
            {test: /\.vue$/, use: ['vue-loader']},
            {test: /\.js$/, exclude: /node_modules/, use: ['babel-loader']},
            {test: /\.(png|jpg)$/, use: [
                {
                    loader: 'url-loader',
                    query: {
                        limit: 8192
                    }
                }
            ]}
        ]
    }
}