const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';
const isProd = process.env.NODE_ENV === 'production';

const optimization = () => {
  const config = {};
  if (isProd) {
    config.minimizer = [
      new CssMinimizerPlugin(),
      new TerserWebpackPlugin(),
    ];
    config.minimize = true;
  }
  return config;
};

module.exports = {
  mode: isDev ? 'development' : 'production',
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.[hash].js',
  },
  resolve: {
    extensions: ['.ts', '.js', '.json', '.svg'],
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 3000,
    historyApiFallback: true,
    hot: isDev,
  },
  module: {
    rules: [{
      test: /\.(woff(2)?|eot|ttf|otf)$/,
      type: 'asset/resource',
    },
    {
      test: /\.css$/i,
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader',
        {
          loader: 'postcss-loader',
          options: {
            postcssOptions: {
              plugins: [
                [
                  'postcss-preset-env',
                  {
                    // Options
                  },
                ],
              ],
            },
          },
        },
      ],
    },
    {
      test: /\.ts?$/,
      use: [
        {
          loader: 'ts-loader',
          options: {
            configFile: path.resolve(__dirname, 'tsconfig.json'),
          },
        },
      ],
      exclude: /(node_modules)/,
    },
    {
      test: /\.(svg|png|jpg|gif)$/,
      use: ['file-loader?name=./images/template/[name].[ext]'],
    },
    ],
  },
  optimization: optimization(),
  plugins: [
    new HtmlWebpackPlugin({
      template: './static/index.html',
      favicon: './static/favicon.svg',
      minify: {
        collapseWhitespace: isProd,
      },
    }),
    new MiniCssExtractPlugin({
      filename: 'styles.[hash].css',
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: './static/images/',
          to: 'images/',
        },
      ],
    }),
    new CleanWebpackPlugin(),
  ],

};
