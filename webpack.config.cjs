const path = require("path");

// console.log("__dirname="+__dirname);

module.exports = {
    mode: `${process.env.NODE_ENV}`,
    entry: "./src/index.ts",
    target: 'node',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.cjs'
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        alias: {
            'ignored-module': false,
            "@App": path.resolve(__dirname, "./src"),
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: [/node_modules/],
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.ts$/,
                exclude: [/node_modules/],
                use: {
                    loader: 'ts-loader',
                },
            },
        ],
    }
}
