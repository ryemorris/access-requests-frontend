/* eslint-disable max-len */
const { resolve } = require('path');
const config = require('@redhat-cloud-services/frontend-components-config');
const commonPlugins = require('./plugins');

const { config: webpackConfig, plugins } = config({
  rootFolder: resolve(__dirname, '../'),
  debug: true,
});

plugins.push(...commonPlugins);

module.exports = {
  ...webpackConfig,
  plugins,
};
