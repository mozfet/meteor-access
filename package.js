Package.describe({
  name: 'mozfet:access',
  version: '0.0.9',
  summary: 'Common permissions, user management, access control and document ownership.',
  git: 'https://github.com/mozfet/meteor-access.git',
  documentation: 'README.md'
});

Npm.depends({
  moniker: '0.1.2'
});

Package.onUse(function(api) {

  // both
  api.versionsFrom('1.8.0.1');
  api.use([
    'ecmascript',
    'underscore',
    'dburles:mongo-collection-instances@0.3.5',
    'alanning:roles@1.2.16'
  ]);

  // server
  api.mainModule('./access-server.js', 'server');

  // client
  api.use([
    'templating@1.3.2',
  ], 'client')
  api.mainModule('./access-client.js', 'client', {lazy: true});
});

// Package.onTest(function(api) {
//   api.use('ecmascript');
//   api.use('tinytest');
//   api.use('mozfet:access');
//   api.addFiles('./imports/api/access/access.test.js');
//   api.addFiles('./imports/api/access/ownership.test.js');
// });
