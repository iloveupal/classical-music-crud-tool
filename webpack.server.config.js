const path = require("path");
const nodeExternals = require("webpack-node-externals");
const WebpackShellPlugin = require("webpack-shell-plugin");
const Dotenv = require("dotenv-webpack");

module.exports = (env, argv) => ({
  entry: {
    server: "./src/entry-points/server.js"
  },
  output: {
    path: path.join(__dirname, "dist"),
    publicPath: "/",
    filename: "[name].js"
  },
  watch: argv.mode === "development",
  target: "node",
  node: {
    // Need this when working with express, otherwise the build fails
    __dirname: false, // if you don't put this is, __dirname
    __filename: false // and __filename return blank or /
  },
  externals: [nodeExternals()], // Need this to avoid error when working with Express
  resolve: {
    alias: {
      server: path.resolve(__dirname, "src/server"),
      framework: path.resolve(__dirname, "src/framework"),
      domains: path.resolve(__dirname, "src/domains")
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env", { targets: { node: "current" } }]],
            plugins: ["@babel/plugin-syntax-dynamic-import"]
          }
        }
      }
    ]
  },
  plugins: [
    new WebpackShellPlugin({
      onBuildEnd: [
        argv.mode === "production" ? "echo Server built!" : "yarn start:dev"
      ]
    }),
    new Dotenv({
      path:
        argv.mode === "development"
          ? "./env/.development.env"
          : "./env/.production.env"
    })
  ]
});
