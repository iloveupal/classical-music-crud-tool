const path = require('path');
const nodeExternals = require('webpack-node-externals');
const WebpackShellPlugin = require('webpack-shell-plugin');


module.exports = (env, argv) => ({
    entry: {
        server: './src/entry-points/server.js',
    },
    output: {
        path: path.join(__dirname, 'dist'),
        publicPath: '/',
        filename: '[name].js'
    },
    watch: argv.mode === 'development',
    target: 'node',
    node: {
        // Need this when working with express, otherwise the build fails
        __dirname: false,   // if you don't put this is, __dirname
        __filename: false,  // and __filename return blank or /
    },
    externals: [nodeExternals()], // Need this to avoid error when working with Express
    resolve: {
        alias: {
            Api: path.resolve(__dirname, 'src/api'),
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                },
            },
        ],
    },
    plugins: [
        new WebpackShellPlugin({
            onBuildEnd: [argv.mode === 'production' ? 'echo Server built!' : 'yarn start:dev'],
        })
    ],
});