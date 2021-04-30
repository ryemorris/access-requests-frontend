# access-requests-frontend

This package is the source for internal access request page. Where users can request access to accounts in order to debug their data. Designs for this application can be found [here.](https://marvelapp.com/prototype/257je526/screens)

Since most components are only slightly tweaked between the requester (aka internal) and approver (aka external) views an `isInternal` flag is passed around to control visibility.

The  the list and details pages are exported in "lib.js" for use in [rbac-ui.](https://github.com/RedHatInsights/insights-rbac-ui)

## Developing
[Insights Proxy](https://github.com/RedHatInsights/insights-proxy) is required to run the access-requests frontend application.

```
SPANDX_CONFIG="$(pwd)/insights-inventory-frontend/config/spandx.config.js" bash insights-proxy/scripts/run.sh
```

### Running the app
1. ```npm install```

2. ```npm run start```

### Testing
We are using [jest](https://www.npmjs.com/package/jest) and [react-testing](https://www.npmjs.com/package/@testing-library/react)
