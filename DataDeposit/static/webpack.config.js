const webpackMerge = require('webpack-merge');
var nodeExternals = require('webpack-node-externals');

module.exports = {
    entry: __dirname+'/src/app.tsx',
    output: {
      path: __dirname+'/dist',
      filename: 'app.bundle.js'
    },
    module: {
      rules: [
        { test: /\.(ts|tsx)$/, loader: 'awesome-typescript-loader' },
        {
          test: /\.s[ac]ss$/i,
          use: [
            // Creates `style` nodes from JS strings
            'style-loader',
            // Translates CSS into CommonJS
            'css-loader',
            // Compiles Sass to CSS
            'sass-loader',
          ]
        },
        {
          test: /\.css$/,
          use: ['to-string-loader', 'css-loader'],
        },
        {
          test: /\.(jpe?g|png|gif|svg|woff2?|ttf|eot)$/i,
          loader: 'file-loader',
          options: {
            digest: 'hex',
            hash: 'sha512',
            name: 'content/[hash].[ext]'
          }
        },
      ]
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.json'],
      modules: ['node_modules'] // facut de Sergiu
    }
  };
  