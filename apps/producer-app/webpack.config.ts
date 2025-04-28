import webpack, { container, WebpackOptionsNormalized } from 'webpack'
import path from 'node:path'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin'

const config: webpack.Configuration & Pick<WebpackOptionsNormalized, 'devServer'> = {
  mode: 'development',
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: false,
    hot: true,
    port: 3002,
    host: 'localhost',
    historyApiFallback: true,
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
      progress: true,
    },
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  entry: path.resolve(__dirname, './src/main.ts'),
  output: {
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.(js|mjs|jsx|ts|tsx)$/,
        loader: 'babel-loader',
        include: path.resolve(__dirname, 'src'),
        options: {
          presets: [
            ["@babel/preset-env", {
              "targets": "> 0.25%, not dead",
              "useBuiltIns": "usage",
              "corejs": 3,
              "modules": false
            }],
            "@babel/preset-react",
            '@babel/preset-typescript'
          ]
        }
      }
    ]
  },
  plugins: [
    new webpack.container.ModuleFederationPlugin({
      name: "producer",
      filename: 'remoteEntry.js',
      exposes: {
        './App': './src/ProducerApp',
      },
      shared: {
        "react": {singleton: true}, 
        "react-dom": {singleton: true}
      },
    }),
    new HtmlWebpackPlugin({ // 新增插件配置
      template: path.resolve(__dirname, './index.html'), // 模板路径
      filename: 'index.html', // 输出文件名
      inject: true, // 自动注入脚本
      minify: {
        collapseWhitespace: false, // 开发环境保持格式
      },
    }),
    new ReactRefreshWebpackPlugin()
  ],
}

export default config