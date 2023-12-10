const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

const mode = process.env.NODE_ENV || 'development';
const devMode = mode === 'development';
const target = devMode ? 'web' : 'browserslist';
const devtool = devMode ? 'source-map' : undefined;

const pages = [
  { chunks: ['index'], page: 'index.html', template: path.resolve(__dirname, './src/pages/index.html'), },
  { chunks: ['home'], page: 'home.html', template: path.resolve(__dirname, './src/pages/home.html'), },
  { chunks: ['reviews'], page: 'reviews.html', template: path.resolve(__dirname, './src/pages/reviews.html'), },
  { chunks: ['services'], page: 'services.html', template: path.resolve(__dirname, './src/pages/services.html'), },
];

const htmlPlugins = pages.map((page) => {
  return new HtmlWebpackPlugin({
    inject: true,
    template: page.template,
    filename: page.page,
    chunks: [...page.chunks]
  })
});

module.exports = {
  mode,
  target,
  devtool,
  entry: {
    'index': path.resolve(__dirname, './src/pages/index.js'),
    'home': path.resolve(__dirname, './src/pages/home.js'),
    'reviews': path.resolve(__dirname, './src/pages/reviews.js'),
    'services': path.resolve(__dirname, './src/pages/services.js'),
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'js/[name].[hash].js',
  },
  devServer: {
    static: path.resolve(__dirname, './dist'),
    open: true,
    compress: true,
    port: 8080,
    hot: true
  },
  module: {
    rules: [
      {
        test: /\.html$/i,
        loader: 'html-loader'
      },
      {
        test: /\.(c|sa|sc)ss$/i,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.m?js$/i,
        use: 'babel-loader',
        exclude: '/node_modules/'
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name][ext]'
        }
      },
      {
        test: /\.(png|jpe?g|gif|webp)$/i,
        use: [
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
              },
              optipng: {
                enabled: false,
              },
              pngquant: {
                quality: [0.65, 0.90],
                speed: 4
              },
              gifsicle: {
                interlaced: false,
              },
              webp: {
                quality: 75
              }
            }
          }
        ],
        type: 'asset/resource',
        generator: {
          filename: 'images/[hash][ext]'
        }
      },
      {
        test: /\.svg$/i,
        type: 'asset/resource',
        generator: {
          filename: 'images/[hash][ext]'
        }
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'styles/[name].[hash].css',
    }),
    ...htmlPlugins,
    new FaviconsWebpackPlugin({
      logo: 'src/images/favicon/favicon.png',
      mode: 'webapp',
      devMode: 'webapp',
      prefix: 'images/favicons/',
      cache: true,
      inject: htmlPlugin => {
        return true
      },
      favicons: {
        background: '#fff',
        theme_color: '#333',
      },
    }),
  ],
  optimization: {
    splitChunks: {
      chunks: "all",
    },
    minimizer: [
      new CssMinimizerPlugin({
        minimizerOptions: {
          preset: [
            "default",
            {
              discardComments: { removeAll: true },
            },
          ],
        },
      }),
    ],
  }
}
