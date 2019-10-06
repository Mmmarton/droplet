const context = require('../app/js/droplet-core');

describe('Core', () => {
  it('should be defined', () => {
    expect(context.droplet).toBeDefined();
  });
  it('should have a valid version', () => {
    expect(context.droplet.version).toBeDefined();
    expect(context.droplet.version).toMatch('^([0-9]+.?)+$');
  });
});
