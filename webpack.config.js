const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  mode: 'production',
  entry: {
    background: './src/background.ts',
    content: './src/content.ts',
    popup: './src/popup.ts',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'src/manifest.json', to: 'manifest.json' },
        { from: 'src/icons', to: 'icons', noErrorOnMissing: true },
        { from: 'src/popup.html', to: 'popup.html' },
      ],
    }),
  ],
}
