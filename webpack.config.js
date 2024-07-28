const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const { RunScriptWebpackPlugin } = require('run-script-webpack-plugin');
// const { ESBuildMinifyPlugin } = require('esbuild-loader')

module.exports = {
  entry: ['webpack/hot/poll?100', './src/main.ts'],
  target: 'node',
  externals: [
    nodeExternals({
      allowlist: ['webpack/hot/poll?100'],
    }),
  ],
  module: {
    rules: [
      {
        test: /.ts$/,
        use: {
          loader: 'swc-loader',
          options: {
            sync: true,
            // module: {
            //   type: 'commonjs',
            //   noInterop: true,
            // },
            minify: false,
            jsc: {
              target: 'es2020',
              transform: {
                legacyDecorator: true,
                decoratorMetadata: true,
              },
              parser: {
                syntax: 'typescript',
                decorators: true,
                dynamicImport: true,
              },
            },
          },
        },
        exclude: /(node_modules|dist|generated|examples|scripts|test)/,
        // options: {
        //   loader: 'ts',
        //   target: 'es2020',
        // },
      },
    ],
  },
  mode: 'development',
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '~': path.resolve(__dirname, 'src/'),
    },
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new RunScriptWebpackPlugin({ name: 'server.js' }),
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'server.js',
  },
  // optimization: {
  //   minimizer: [
  //     new ESBuildMinifyPlugin({
  //       target: 'es2020',
  //     }),
  //   ],
  // },
};
