var path = require("path");

module.exports = {
  entry: "./MediaRecorderS3Uploader.ts",
  output: {
    filename: "MediaRecorderS3Uploader.js",
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    extensions: [ ".webpack.js", ".ts"]
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'awesome-typescript-loader',
        exclude: /node_modules/,
      }
    ]
  },
}
