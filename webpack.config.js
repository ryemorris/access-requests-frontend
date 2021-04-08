const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlReplaceWebpackPlugin = require('html-replace-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const GitRevisionPlugin = require('git-revision-webpack-plugin');
const { getProxyPaths, getHtmlReplacements } = require('@redhat-cloud-services/insights-standalone');
const ChunkMapperPlugin = require('./config/chunk-mapper');
const { insights, dependencies } = require('./package.json');

const fileRegEx = /\.(png|woff|woff2|eot|ttf|svg|gif|jpe?g|png)(\?[a-z0-9=.]+)?$/;
const srcDir = path.resolve(__dirname, './src');
const gitRevisionPlugin = new GitRevisionPlugin({ branch: true });
const betaBranches = ['master', 'qa-beta', 'ci-beta', 'prod-beta'];
const singletonDeps = [
  'lodash',
  'redux',
  'react',
  'react-dom',
  'react-router-dom',
  'react-redux',
  'react-promise-middleware',
  '@patternfly/react-core',
  '@patternfly/react-charts',
  '@patternfly/react-table',
  '@patternfly/react-icons',
  '@patternfly/react-tokens',
  '@redhat-cloud-services/frontend-components',
  '@redhat-cloud-services/frontend-components-utilities',
  '@redhat-cloud-services/frontend-components-notifications',
];
const name = insights.appname;
const moduleName = name.replace(/-(\w)/g, (_, match) => match.toUpperCase());

module.exports = (_env, argv) => {
  const gitBranch = process.env.TRAVIS_BRANCH || process.env.BRANCH || gitRevisionPlugin.branch();
  const isProduction = argv.mode === 'production';
  const appDeployment = (isProduction && betaBranches.includes(gitBranch)) ? '/beta' : '';
  const publicPath = `${appDeployment}/apps/${name}/`;
  const entry = path.join(srcDir, 'entry.js');
  const port = 8002;

  console.log('~~~Using variables~~~');
  console.log(`isProduction: ${isProduction}`);
  console.log(`Current branch: ${gitBranch}`);
  console.log(`Beta branches: ${betaBranches}`);
  console.log(`Using deployments: ${appDeployment}`);
  console.log(`Public path: ${publicPath}`);
  console.log('~~~~~~~~~~~~~~~~~~~~~');

  return {
    stats: {
      excludeAssets: fileRegEx,
      colors: true,
      modules: false,
    },
    mode: isProduction ? 'production' : 'development',
    devtool: isProduction ? 'source-map' : 'inline-cheap-source-map',
    entry,
    output: {
      path: path.resolve(__dirname, './dist/'),
      filename: isProduction ? '[name].[chunkhash].js' : '[name].js',
      publicPath,
    },
    module: {
      rules: [
        {
          test: new RegExp(entry),
          loader: path.resolve(__dirname, './config/chrome-render-loader.js'),
          options: {
            appName: moduleName
          },
        },
        {
          test: /\.jsx?$/,
          include: srcDir,
          use: 'babel-loader'
        },
        {
          test: /\.css$/i,
          exclude: /@patternfly\/react-styles\/css/,
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
        {
          // Since we use Insights' upstream PatternFly, we're using null-loader to save about 1MB of CSS
          test: /\.css$/i,
          include: /@patternfly\/react-styles\/css/,
          use: 'null-loader',
        },
        {
          test: fileRegEx,
          type: 'asset/resource',
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        'API_BASE': JSON.stringify('/api/rbac/v1'),
        'process.env.NODE_ENV': JSON.stringify(isProduction ? 'production' : 'development') // Redux
      }),
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: path.join(srcDir, 'index.html'),
      }),
      new HtmlReplaceWebpackPlugin([
        {
          pattern: '@@env',
          replacement: appDeployment,
        },
        ...(isProduction ? [] : getHtmlReplacements())
      ]),
      new webpack.container.ModuleFederationPlugin({
        name: moduleName,
        filename: `${moduleName}.js`,
        exposes: {
          './RootApp': path.resolve(srcDir, 'AppEntry.js'),
        },
        shared: {
          ...dependencies,
          ...singletonDeps.reduce((acc, dep) => {
            acc[dep] = { singleton: true, requiredVersion: dependencies[dep] };
            return acc;
          }, {}),
        },
      }),
      new ChunkMapperPlugin({
        modules: [moduleName],
      }),
      new MiniCssExtractPlugin({
        filename: isProduction ? '[id].[contenthash].css' : '[name].css',
        chunkFilename: isProduction ? '[id].[contenthash].css' : '[id].css',
      }),
      new CopyWebpackPlugin({ patterns: [
        { from: path.join(__dirname, 'static'), to: '' }
      ]})
    ],
    resolve: {
      extensions: ['.js', '.jsx'],
    },
    devServer: {
      port,
      host: 'localhost',
      hot: false,
      historyApiFallback: {
        index: `${publicPath}index.html`
      },
      proxy: getProxyPaths({ publicPath, webpackPort: port }) 
    },
  };
};
