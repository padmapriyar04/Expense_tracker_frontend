const path = require('path');

module.exports = {
  entry: './src/index.js', // Specify the entry point of your application
  output: {
    filename: 'bundle.js', // Specify the output file name
    path: path.resolve(__dirname, 'dist'), // Specify the output directory
  },
  resolve: {
    extensions: ['.js', '.jsx'], // Specify file extensions to resolve
    fallback: {
        "querystring": require.resolve("querystring-es3")
      }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader', // Specify the loader for JavaScript/React files
        },
      },
    ],
  },
};
