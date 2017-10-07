var path = require('path');

module.exports = {
    context:  path.join(__dirname, 'src'),
    entry: {
        'index': './index.js', 
        'comments': './comments/comments.js', 
    }, 
    module: {
        rules: [
            { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
            {
                test: /\.scss$/,
                use: [
                    {
                    loader: 'style-loader'
                    },
                    {
                    loader: 'css-loader'
                    },
                    {
                    loader: 'sass-loader'
                    }
                ]
            }
        ]
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].bundle.js'    
    },
    performance: {
        hints: false
    }
};
