const { resolve } = require('path');
const config = require('@redhat-cloud-services/frontend-components-config');
const {
  defaultServices,
  rbac,
  backofficeProxy,
} = require('@redhat-cloud-services/frontend-components-config-utilities/standalone');
const commonPlugins = require('./plugins');

const { config: webpackConfig, plugins } = config({
  rootFolder: resolve(__dirname, '../'),
  debug: true,
  deployment: 'beta/apps',
  standalone: {
    rbac,
    backofficeProxy,
    ...defaultServices,
  },
  useProxy: true,
});
plugins.push(...commonPlugins);

console.log('double check', webpackConfig.devServer.proxy);
module.exports = {
  ...webpackConfig,
  plugins,
};
