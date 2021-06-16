const { resolve } = require('path');
const webpack = require('webpack');

module.exports = [
  require('@redhat-cloud-services/frontend-components-config/federated-modules')(
    {
      root: resolve(__dirname, '../'),
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
  ),
  new webpack.DefinePlugin({
    API_BASE: JSON.stringify('/api/rbac/v1'),
  })
];

