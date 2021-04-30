const webpack = require('webpack');
const { resolve } = require('path');
const config = require('@redhat-cloud-services/frontend-components-config');
const { config: webpackConfig, plugins } = config({
  rootFolder: resolve(__dirname, '../'),
  debug: true,
  deployment: `${process.env.BETA ? 'beta/' : ''}apps`,
});

plugins.push(
  require('@redhat-cloud-services/frontend-components-config/federated-modules')(
    {
      root: resolve(__dirname, '../'),
      useFileHash: false,
      exposes: {
        './RootApp': resolve(__dirname, '../src/AppEntry'),
        './AccessRequestsPage': resolve(
          __dirname,
          '../src/Routes/AccessRequestsPage'
        ),
        './AccessRequestDetailsPage': resolve(
          __dirname,
          '../src/Routes/AccessRequestDetailsPage'
        ),
      },
    }
  )
);

plugins.push(
  new webpack.DefinePlugin({
    API_BASE: JSON.stringify('/api/rbac/v1'),
  })
);

module.exports = {
  ...webpackConfig,
  plugins,
};
