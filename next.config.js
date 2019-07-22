const withBundleAnalyzer = require('@zeit/next-bundle-analyzer')

const withCss = require('@zeit/next-css')
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');
const withLess = require('@zeit/next-less')
// const withImages = require('next-images');
const withOptimizedImages = require('next-optimized-images');
const lessToJS = require('less-vars-to-js')
const TerserPlugin = require('terser-webpack-plugin')
const { DefinePlugin } = require('webpack')
const fs = require('fs')
const path = require('path')
const { parsed } = require('dotenv').config();
// require('dotenv')
// require('@babel/register');
const Dotenv = require('dotenv-webpack')
const { SERVER_URL } = parsed;

// fix: prevents error when .css files are required by node
if (typeof require !== 'undefined') {
  require.extensions['.less'] = (file) => {}
}
if (typeof require !== 'undefined') {
  require.extensions['.css'] = file => {}
}
const isDev = process.env.NODE_ENV !== 'production';

// Where your modifyVars.less file lives
const themeVariables = lessToJS(
  fs.readFileSync(path.resolve(__dirname, './assets/styles/modifyVars.less'), 'utf8')
)

// fix antd bug in dev development
const devAntd = '@import "~antd/dist/antd.less";\n';
const stylesData = fs.readFileSync(
  path.resolve(__dirname, './assets/styles/_style.less'),
  'utf-8'
);

fs.writeFileSync(
  path.resolve(__dirname, './assets/styles/system-style.less'),
  isDev ? `${devAntd}${stylesData}` : stylesData,
  'utf-8'
);

module.exports = withLess(
  withCss({
  // 禁用文件路由
  // useFileSystemPublicRoutes: false,
  // css模块导入
  // cssModules: true,
  // less配置参数
  lessLoaderOptions: {
    javascriptEnabled: true,
    modifyVars: themeVariables, // make your antd custom effective
    localIdentName: '[local]___[hash:base64:5]',
  },
  webpack: (config, { dev, isServer }) => {
    config.node = { fs: 'empty' }

    if (isServer) {
      config.plugins.push(
        ...[
          new TerserPlugin({
            terserOptions: {
              ecma: 6,
              warnings: false,
              extractComments: false, // remove comment
              compress: {
                drop_console: true // remove console
              },
              ie8: false
            }
          }),
          // new Dotenv({
          //   path: path.join(__dirname, '.env'),
          //   systemvars: true
          // }),
          new DefinePlugin({
            'process.env': {
              SERVER_URL: JSON.stringify(SERVER_URL)
            }
          }),
          new FilterWarningsPlugin({
            exclude: /mini-css-extract-plugin[^]*Conflicting order between:/,
          })

      ]);
      config.devtool = 'cheap-module-inline-source-map';
    }
    // 配置别名
    config.resolve.alias = {
      ...config.resolve.alias,
      ["@pages"]: path.resolve(__dirname, 'pages'),
      ["@stores"]: path.resolve(__dirname, 'stores'),
      ["@assets"]: path.resolve(__dirname, 'assets'),
      ["@components"]: path.resolve(__dirname, 'components'),
      ["@layouts"]: path.resolve(__dirname, 'layouts'),
      ["@utils"]: path.resolve(__dirname, 'utils'),
      ["@config"]: path.resolve(__dirname, 'config'),
    }

    config.module.rules = [
      ...config.module.rules,
      ...[
        // 支持图片导入
        {
          test: /\.(txt|jpg|png|svg|jpe?g|gif)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                context: '',
                outputPath: 'static',
                publicPath: '_next/static',
                name: '[path][name].[hash].[ext]'
              }
            }
          ]
        },
        // 支持文本导入
        {
          test: /\.(svg|eot|otf|ttf|woff|woff2)$/,
          use: {
            loader: 'url-loader',
            options: {
              limit: 100000,
              publicPath: './',
              outputPath: 'static/',
              name: '[name].[ext]'
            }
          }
        },
        // eslint检测&自动修复
        // {
        //   enforce: "pre",
        //   test: /\.js|jsx|ts$/,
        //   exclude: [
        //     path.resolve(__dirname, 'node_modules'),
        //     path.resolve(__dirname, '.eslintrc'),
        //   ],
        //   include: [
        //     path.resolve(__dirname, 'pages'),
        //     path.resolve(__dirname, 'components'),
        //     path.resolve(__dirname, 'assets'),
        //     path.resolve(__dirname, 'stores'),
        //     path.resolve(__dirname, 'layouts'),
        //   ],
        //   use: [
        //     { loader: "babel-loader" },
        //     {
        //       loader: "eslint-loader",
        //       options: {
        //         eslintPath: path.resolve(__dirname, '.eslintrc')
        //       }
        //     }
        //   ],
        // },
      ]
    ];
    // console.log(config.resolve, config.module.rules, '==config==');
    // throw(new Error('暂停'));
    return config
  }
}))
