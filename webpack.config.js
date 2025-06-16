const path = require("path");

module.exports = {
  entry: "./src/app.js",
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "bundle.js",
    publicPath: '/'
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.jsx'],
    fallback: {
      crypto:false,
      path: false,
      stream: false
    }
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-env", "@babel/preset-react"],
        },
      },
      {
        test: /\.(png|jpg|gif|svg)$/i,
        type: "asset/inline",
      },
      {
        test: /\.styl$/,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "stylus-loader",
            options: {
              stylusOptions: {
                resolveURL: true,
              },
            },
          },
        ],
      },
    ],
  },
};
