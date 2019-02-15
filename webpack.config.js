var path = require("path");

module.exports = {
  entry: {
    MediaRecorderS3Uploader: "./MediaRecorderS3Uploader.ts",
    index: "./index.ts"
  },
  output: {
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    extensions: [".webpack.js", ".ts"]
  },
  devtool: 'source-map',
  module: {
    noParse: [/aws-sdk/],
    rules: [{
      test: /\.ts?$/,
      use: 'awesome-typescript-loader',
      exclude: /node_modules/,
    }]
  },
}