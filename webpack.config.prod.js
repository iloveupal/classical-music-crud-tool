const path = require("path");
const webpack = require("webpack");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

module.exports = {
  entry: {
    main: "./src/entry-points/client.js"
  },
  output: {
    path: path.join(__dirname, "dist"),
    publicPath: "/",
    filename: "[name].js",
    chunkFilename: "[name].js"
  },
  target: "web",
  devtool: "#source-map",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: { minimize: true }
          }
        ]
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
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
  plugins: [
    new HtmlWebPackPlugin({
      template: "./src/public/html/index.html",
      filename: "./index.html"
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    })
  ],
  optimization: {
    splitChunks: {
      chunks: "all"
    },
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true // set to true if you want JS source maps
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  },
  resolve: {
    alias: {
      Framework: path.resolve(__dirname, "src/framework"),
      domains: path.resolve(__dirname, "src/domains")
    }
  }
};
