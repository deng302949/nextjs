/* eslint-disable */
const withCss = require('@zeit/next-css')
const withLess = require('@zeit/next-less')
const withOptimizedImages = require('next-optimized-images');
const lessToJS = require('less-vars-to-js')
const TerserPlugin = require('terser-webpack-plugin')
const { DefinePlugin } = require('webpack')
const fs = require('fs')
const path = require('path')
const { parsed } = require('dotenv').config();
const { SERVER_URL } = parsed;

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

// fix: prevents error when .css files are required by node
if (typeof require !== 'undefined') {
  require.extensions['.less'] = (file) => {}
}

module.exports = withOptimizedImages(
  withLess(
  withCss({
  lessLoaderOptions: {
    javascriptEnabled: true,
    modifyVars: themeVariables, // make your antd custom effective
    localIdentName: '[local]___[hash:base64:5]',
  },
  webpack: (config, { dev, isServer }) => {
    if (isServer) {
      config.plugins.push(
        ...[
          // 代替uglyJsPlugin
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
          new DefinePlugin({
            'process.env': {
              SERVER_URL: JSON.stringify(SERVER_URL)
            }

          })

      ]);
      // config.resolve.alias = {
      //   ...config.resolve.alias,
      //   "@pages": path.resolve(__dirname, 'pages'),
      //   "@stores": path.resolve(__dirname, 'stores'),
      //   "@assets": path.resolve(__dirname, 'assets'),
      //   "@components": path.resolve(__dirname, 'components'),
      // }
      // config.module.rules = [
      //   ...config.module.rules,
      //   ...[
      //     {
      //       test: /\.(png|jpe?g|gif)$/i,
      //       use: "file-loader"
      //     },
      //     {
      //       test: /\.(png|jpe?g|gif)$/i,
      //       use: "url-loader"
      //     }
      //   ]
      // ];
      config.devtool = 'source-map';
    }
    // console.log(config.resolve, config.module.rules, '==config==');
    // throw(new Error('暂停'));
    return config
  },
})))
