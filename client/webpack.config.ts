const path = require("path");

module.exports = {
  entry: "./src/main.tsx",
  output: {
    path: path.join(__dirname, "dist"),
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        exclude: /node_modules/,
        use: {
          loader: "ts-loader",
        },
      },
      {
        use: ['file-loader'],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
};