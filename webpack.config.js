const path = require('path');
module.exports = {

    mode: process.env.NODE_ENV,
    entry: "./client/index.js",

    output: {
        path: path.resolve(__dirname, 'build/'),
        filename: "bundle.js",
    },

    module: {
        rules: [
          {
            test: /\.jsx?$/,
            exclude: /(node_modules)/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env','@babel/preset-react']
              }
            }
          },
          {
            test: /\.css$/,
            use: [
              {
                loader: "style-loader" // creates style nodes from JS strings
              },
              {
                loader: "css-loader" // translates CSS into CommonJS
              },
              {
                loader: "sass-loader" // compiles Sass to CSS
              }
            ]
          },
        ]
      },
    devServer: {
      publicPath: '/build/',
      proxy: {
        '/api': 'http://[::1]:3000',  //added [::1] because voodoo https://github.com/saikat/react-apollo-starter-kit/issues/20
        secure: false
      },
      
    }
};
