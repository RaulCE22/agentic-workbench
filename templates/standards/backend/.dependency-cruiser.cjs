module.exports = {
  forbidden: [
    {
      name: 'no-circular-dependencies',
      severity: 'error',
      from: {},
      to: { circular: true },
    },
    {
      name: 'http-does-not-access-infrastructure',
      severity: 'error',
      from: { path: 'src/modules/[^/]+/http' },
      to: { path: 'src/modules/[^/]+/infrastructure' },
    },
  ],
  options: {
    doNotFollow: { path: 'node_modules' },
  },
};
