const { resolve } = require('path');
const config = require('@redhat-cloud-services/frontend-components-config');
const { getProxyPaths, getHtmlReplacements } = require('@redhat-cloud-services/insights-standalone');
const chromePath = require.resolve('@redhat-cloud-services/insights-standalone/package.json').replace('package.json', 'repos/insights-chrome-build');
const { config: webpackConfig, plugins } = config({
  rootFolder: resolve(__dirname, '../'),
  debug: true,
  replacePlugin: getHtmlReplacements(chromePath)
});

plugins.push(
  require('@redhat-cloud-services/frontend-components-config/federated-modules')(
    {
      root: resolve(__dirname, '../'),
      moduleName: 'accessRequests',
      useFileHash: false
    }
  )
);
//console.log('plugins', plugins);
plugins.splice(6, 1); // Eslint

webpackConfig.devServer.proxy = getProxyPaths(3101, webpackConfig.output.publicPath, webpackConfig.devServer.port);
webpackConfig.devServer.hot = false;

module.exports = {
  ...webpackConfig,
  plugins
};
