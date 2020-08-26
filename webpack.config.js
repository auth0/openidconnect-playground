module.exports = {
    entry: "./public/app.js",
    output: {
        path: __dirname + "/public",
        filename: "index.js",
    },
    module: {
        rules: [{
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                query: {
                    presets: ["@babel/preset-env", "@babel/preset-react"],
                },
            },
            {
                test: /\.(png|jpg|gif|svg)$/i,
                use: [{
                    loader: 'url-loader',
                }],
            }, {
                test: /\.styl$/,
                loader: "style-loader!css-loader!stylus-loader?resolve url",
            },
        ],
    },
};