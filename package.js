Package.describe({
  name: 'mozfet:access',
  version: '0.0.1',
  summary: 'Common permissions, user management, access control and document ownership.',
  git: '',
  documentation: 'README.md'
});

Npm.depends({
  moniker: '0.1.2'
});

Package.onUse(function(api) {
  api.versionsFrom('1.8.0.1');
  api.use('ecmascript');
  api.addFiles('./imports/api/access/index.js');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('mozfet:access');
  api.addFiles('./imports/api/access/access.test.js');
  api.addFiles('./imports/api/access/ownership.test.js');
});