# access-requests-frontend

This package is the source for https://cloud.redhat.com/internal/access-requests (which this repo publishes) and https://cloud.redhat.com/settings/rbac/access-requests (this repo publishes the components to NPM which [rbac-ui](https://github.com/RedHatInsights/insights-rbac-ui) imports). It's designs are [here.](https://marvelapp.com/prototype/257je526/screens)

Since most components are only slightly tweaked between the requester (aka internal) and approver (aka external) views an `isInternal` flag is passed around to control visibility.

The  the list and details pages are exported in "lib.js" for use in [rbac-ui.](https://github.com/RedHatInsights/insights-rbac-ui)
