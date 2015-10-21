webpack = require('webpack')

module.exports = {
    context: __dirname + "/src",
    entry : "./angular-module.coffee",
    output: {
        path: __dirname + "/dist",
        filename: "angular-gooii.js"
    },
    module: {
        loaders: [
            { test: /\.coffee$/, loader: "coffee-loader" }
        ]
    },
    resolve: {
        extensions: ['', '.js', '.json', '.coffee']
    },
    node: {
        fs: "empty"
    },
    plugins: [
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
            mangle: {
                except: ['require', 'export']
            },
            compress: {
                warnings: false,
            drop_console: true

            }
        })
    ]
};
