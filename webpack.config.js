const path = require("path");
const webpack = require("webpack");
const HtmlWebPackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: {
    main: "./src/entry-points/client.js"
  },
  output: {
    path: path.join(__dirname, "dist"),
    publicPath: "/",
    filename: "[name].js"
  },
  target: "web",
  mode: "development",
  devtool: "#source-map",
  watch: true,
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        // Loads the javacript into html template provided.
        // Entry point is set below in HtmlWebPackPlugin in Plugins
        test: /\.html$/,
        use: [
          {
            loader: "html-loader"
            //options: { minimize: true }
          }
        ]
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: "style-loader" // creates style nodes from JS strings
          },
          {
            loader: "css-loader" // translates CSS into CommonJS
          },
          {
            loader: "postcss-loader",
            options: {
              plugins: [require("postcss-preset-env")({})]
            }
          },
          {
            loader: "less-loader" // compiles Less to CSS
          }
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ["file-loader"]
      }
    ]
  },
  resolve: {
    alias: {
      framework: path.resolve(__dirname, "src/framework"),
      domains: path.resolve(__dirname, "src/domains")
    }
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./src/public/html/index.html",
      filename: "./index.html",
      excludeChunks: ["server"]
    })
  ]
};
