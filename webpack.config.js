var path = require("path");

module.exports = {
    entry: "./src",
    output: {
        path: path.resolve(__dirname, "public"),
        filename: "bundle.js"
    },
    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader?modules=true&localIdentName=[name]__[local]___[hash:base64:5]'
            },
            {
                test: /\.html$/,
                loader: "html"
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: "babel"
            }
        ]
    },
    devtool: "source-map",
    resolve: {
        root: [
            path.resolve("./src/")
        ],
        alias: {
            components: path.resolve(__dirname, "src", "components"),
        },
        extensions: ["", ".js"]
    },
    devServer: {
        hot: true,
        historyApiFallback: true,
        contentBase: "./public"
    }
};