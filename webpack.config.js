module.exports = {
  entry: "./public/app.js",
  output: {
    path: __dirname + "/public",
    filename: "index.js",
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
