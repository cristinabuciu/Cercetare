
var webpack = require('webpack');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

module.exports = {
  entry: "./src/app.tsx",
  mode: "development",
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              "@babel/preset-react",
              "@babel/preset-typescript",
            ],
          },
        },
      },
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
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".json"],
    modules: ['node_modules'] // facut de Sergiu
  },
  devtool: "source-map",
  output: {
    path: __dirname + "/build",
    filename: "app.bundle.js",
  },
  devServer: {
    contentBase: __dirname + "/build",
    compress: true,
    port: 5500,
    allowedHosts: ['http://localhost:41338'],
    publicPath: '/',
    quiet: false, // for FriendlyErrorsWebpackPlugin quiet trebuie pe true
    hot: true,
    historyApiFallback: true,
    inline: true,
    watchOptions: {
      ignored: /node_modules/
    }
  },
  plugins: [
    new webpack.DefinePlugin({ // <-- key to reducing React's size
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    // new FriendlyErrorsWebpackPlugin(),
    new webpack.optimize.AggressiveMergingPlugin()//Merge chunks 
  ],
};

