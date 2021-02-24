/* eslint-disable camelcase */
export default [
  {
    uuid: 'd36b3088-55b4-4360-8d10-c85acdc4fd0f',
    name: 'Insights administrator',
    display_name: 'Advisor administrator',
    description: 'Perform any available operation against any advisor resource.',
    created: '2021-01-07T20:37:46.550671Z',
    modified: '2021-01-07T20:37:46.557273Z',
    policyCount: 1,
    accessCount: 2,
    applications: [
      'inventory',
      'advisor'
    ],
    system: true,
    platform_default: true
  },
  {
    uuid: '2f567b6a-010a-403e-a529-d19346259d29',
    name: 'Approval Administrator',
    display_name: 'Approval Administrator',
    description: 'An approval administrator role that grants permissions to manage workflows, requests, actions, and templates.',
    created: '2021-01-07T20:37:45.804521Z',
    modified: '2021-01-07T20:37:45.805423Z',
    policyCount: 0,
    accessCount: 11,
    applications: [
      'approval'
    ],
    system: true,
    platform_default: false
  },
  {
    uuid: '243b26b3-fa51-482e-81e5-e561f6c39b58',
    name: 'Approval Approver',
    display_name: 'Approval Approver',
    description: 'An approval approver role that grants permissions to read and approve requests.',
    created: '2021-01-07T20:37:46.023017Z',
    modified: '2021-01-07T20:37:46.024004Z',
    policyCount: 0,
    accessCount: 3,
    applications: [
      'approval'
    ],
    system: true,
    platform_default: false
  },
  {
    uuid: 'ce6380bf-b6ee-4cbb-b373-7939b11c5bfc',
    name: 'Approval User',
    display_name: 'Approval User',
    description: 'An approval user role which grants permissions to create/read/cancel a request, and read workflows.',
    created: '2021-01-07T20:37:45.954546Z',
    modified: '2021-01-07T20:37:45.955495Z',
    policyCount: 1,
    accessCount: 5,
    applications: [
      'approval'
    ],
    system: true,
    platform_default: true
  },
  {
    uuid: 'f40ae207-8ad0-4c3b-a9a8-9f35507b6385',
    name: 'Catalog Administrator',
    display_name: 'Catalog Administrator',
    description: 'A catalog administrator roles grants create,read,update, delete and order permissions',
    created: '2021-01-07T20:37:46.068280Z',
    modified: '2021-01-07T20:37:46.069210Z',
    policyCount: 0,
    accessCount: 28,
    applications: [
      'catalog'
    ],
    system: true,
    platform_default: false
  },
  {
    uuid: '1afbbb3b-246e-4234-8be4-97a08fc08cf5',
    name: 'Catalog User',
    display_name: 'Catalog User',
    description: 'A catalog user roles grants read and order permissions',
    created: '2021-01-07T20:37:46.390765Z',
    modified: '2021-01-07T20:37:46.391763Z',
    policyCount: 1,
    accessCount: 15,
    applications: [
      'catalog'
    ],
    system: true,
    platform_default: true
  },
  {
    uuid: 'f0b212ed-1d3e-4498-b1ca-47b6743ac7d6',
    name: 'Compliance administrator',
    display_name: 'Compliance administrator',
    description: 'Perform any available operation against any Compliance resource.',
    created: '2021-01-07T20:37:46.668492Z',
    modified: '2021-01-07T20:37:46.669446Z',
    policyCount: 1,
    accessCount: 2,
    applications: [
      'compliance',
      'inventory'
    ],
    system: true,
    platform_default: true
  },
  {
    uuid: '23589904-25fb-4270-82f1-e48ccd117ead',
    name: 'Cost Administrator',
    display_name: 'Cost Administrator',
    description: 'A cost management administrator role that grants read and write permissions.',
    created: '2021-01-07T20:37:45.612640Z',
    modified: '2021-01-07T20:37:45.613553Z',
    policyCount: 0,
    accessCount: 1,
    applications: [
      'cost-management'
    ],
    system: true,
    platform_default: false
  },
  {
    uuid: '61c9395d-ed5b-4e47-9ad2-dd3e7e6b8d8a',
    name: 'Cost Cloud Viewer',
    display_name: 'Cost Cloud Viewer',
    description: 'A cost management role that grants read permissions on cost reports related to cloud sources.',
    created: '2021-01-07T20:37:45.668118Z',
    modified: '2021-01-07T20:37:45.669028Z',
    policyCount: 0,
    accessCount: 3,
    applications: [
      'cost-management'
    ],
    system: true,
    platform_default: false
  },
  {
    uuid: 'a7cac665-cb4a-4de6-8253-f7a78be9d535',
    name: 'Cost OpenShift Viewer',
    display_name: 'Cost OpenShift Viewer',
    description: 'A cost management role that grants read permissions on cost reports related to OpenShift sources.',
    created: '2021-01-07T20:37:45.698657Z',
    modified: '2021-01-07T20:37:45.699565Z',
    policyCount: 0,
    accessCount: 1,
    applications: [
      'cost-management'
    ],
    system: true,
    platform_default: false
  },
  {
    uuid: 'f85bf8e0-654c-4e82-b909-978c4a9ca579',
    name: 'Cost Price List Administrator',
    display_name: 'Cost Price List Administrator',
    description: 'A cost management role that grants read and write permissions on cost models.',
    created: '2021-01-07T20:37:45.629746Z',
    modified: '2021-01-07T20:37:45.630659Z',
    policyCount: 0,
    accessCount: 1,
    applications: [
      'cost-management'
    ],
    system: true,
    platform_default: false
  },
  {
    uuid: 'a8c63801-915f-4ae0-acfb-692c52c0b69a',
    name: 'Cost Price List Viewer',
    display_name: 'Cost Price List Viewer',
    description: 'A cost management role that grants read permissions on cost models.',
    created: '2021-01-07T20:37:45.646727Z',
    modified: '2021-01-07T20:37:45.647684Z',
    policyCount: 0,
    accessCount: 1,
    applications: [
      'cost-management'
    ],
    system: true,
    platform_default: false
  },
  {
    uuid: '0d12e4c2-b201-4527-952c-ba62764f4bad',
    name: 'Drift analysis administrator',
    display_name: 'Drift analysis administrator',
    description: 'Perform any available operation against any Drift Analysis resource.',
    created: '2021-01-07T20:37:45.780455Z',
    modified: '2021-01-07T20:37:45.781365Z',
    policyCount: 1,
    accessCount: 2,
    applications: [
      'inventory',
      'drift'
    ],
    system: true,
    platform_default: true
  },
  {
    uuid: '166c6515-6b41-4d7c-ac2a-ae7be15891d5',
    name: 'Inventory administrator',
    display_name: 'Inventory administrator',
    description: 'Perform any available operation against any Inventory resource.',
    created: '2021-01-07T20:37:46.692541Z',
    modified: '2021-01-07T20:37:46.693463Z',
    policyCount: 1,
    accessCount: 1,
    applications: [
      'inventory'
    ],
    system: true,
    platform_default: true
  },
  {
    uuid: '2c9faecf-d856-4cdf-8594-fe56d00d4cfc',
    name: 'Migration Analytics administrator',
    display_name: 'Migration Analytics administrator',
    description: 'Perform any available operation against any Migration Analytics resource.',
    created: '2021-01-07T20:37:46.603550Z',
    modified: '2021-01-07T20:37:46.604452Z',
    policyCount: 1,
    accessCount: 1,
    applications: [
      'migration-analytics'
    ],
    system: true,
    platform_default: true
  },
  {
    uuid: '4e1ac715-1695-4f58-a5ec-8fbbecdd4dd8',
    name: 'Notifications administrator',
    display_name: 'Notifications administrator',
    description: 'Perform any available operation against Notifications and Integrations applications.',
    created: '2021-01-25T13:57:57.029768Z',
    modified: '2021-01-25T13:57:57.030690Z',
    policyCount: 0,
    accessCount: 2,
    applications: [
      'notifications',
      'integrations'
    ],
    system: true,
    platform_default: false
  },
  {
    uuid: 'b152b4a3-eeb3-48b0-9ee5-77ec484d17de',
    name: 'Notifications viewer',
    display_name: 'Notifications viewer',
    description: 'Read only access to notifications and integrations applications.',
    created: '2021-01-25T13:57:57.045113Z',
    modified: '2021-01-25T13:57:57.045904Z',
    policyCount: 1,
    accessCount: 2,
    applications: [
      'notifications',
      'integrations'
    ],
    system: true,
    platform_default: true
  },
  {
    uuid: '01cb2ed0-7dc3-40ca-9bfa-5c7dec117a19',
    name: 'Patch administrator',
    display_name: 'Patch administrator',
    description: 'Perform any available operation against any Patch resource.',
    created: '2021-01-07T20:37:45.756506Z',
    modified: '2021-01-07T20:37:45.757410Z',
    policyCount: 1,
    accessCount: 2,
    applications: [
      'patch',
      'inventory'
    ],
    system: true,
    platform_default: true
  },
  {
    uuid: 'a3683158-0160-45d4-9314-4bd1979b2a71',
    name: 'Policies administrator',
    display_name: 'Policies administrator',
    description: 'Perform any available operation against any Policies resource.',
    created: '2021-01-07T20:37:45.587727Z',
    modified: '2021-01-07T20:37:45.588677Z',
    policyCount: 1,
    accessCount: 2,
    applications: [
      'policies',
      'inventory'
    ],
    system: true,
    platform_default: true
  },
  {
    uuid: 'dfadd29f-5141-4859-8f41-8059943e1f46',
    name: 'Remediations administrator',
    display_name: 'Remediations administrator',
    description: 'Perform any available operation against any Remediations resource',
    created: '2021-01-07T20:37:46.620751Z',
    modified: '2021-01-07T20:37:46.621737Z',
    policyCount: 0,
    accessCount: 2,
    applications: [
      'remediations',
      'inventory'
    ],
    system: true,
    platform_default: false
  },
  {
    uuid: 'f51b2a5e-2a44-4d0e-9287-0d872a3de3b7',
    name: 'Remediations user',
    display_name: 'Remediations user',
    description: 'Perform create, view, update, delete operations against any Remediations resource.',
    created: '2021-01-07T20:37:46.644599Z',
    modified: '2021-01-07T20:37:46.645536Z',
    policyCount: 1,
    accessCount: 2,
    applications: [
      'remediations'
    ],
    system: true,
    platform_default: true
  },
  {
    uuid: 'e6520b0f-40af-43ec-baae-804a3efddb09',
    name: 'Sources administrator',
    display_name: 'Sources administrator',
    description: 'Perform any available operation against any Source',
    created: '2021-01-07T20:37:45.715506Z',
    modified: '2021-01-07T20:37:45.716410Z',
    policyCount: 0,
    accessCount: 1,
    applications: [
      'sources'
    ],
    system: true,
    platform_default: false
  },
  {
    uuid: 'c4737d6f-734f-406c-bb38-a73d678caee4',
    name: 'Subscription Watch administrator',
    display_name: 'Subscription Watch administrator',
    description: 'Perform any available operation against any Subscription Watch resource.',
    created: '2021-01-07T20:37:46.579885Z',
    modified: '2021-01-07T20:37:46.580852Z',
    policyCount: 1,
    accessCount: 2,
    applications: [
      'inventory',
      'subscriptions'
    ],
    system: true,
    platform_default: true
  },
  {
    uuid: '97569ae7-be84-4f08-9165-b34d02e05d07',
    name: 'Vulnerability administrator',
    display_name: 'Vulnerability administrator',
    description: 'Perform any available operation against any Vulnerability resource.',
    created: '2021-01-07T20:37:45.732726Z',
    modified: '2021-01-07T20:37:45.733647Z',
    policyCount: 1,
    accessCount: 2,
    applications: [
      'inventory',
      'vulnerability'
    ],
    system: true,
    platform_default: true
  }
];
