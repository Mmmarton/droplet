const expect = require('chai').expect;
const droplet = require('../app/droplet/core');

describe('core', () => {
  it('is initialized', () => {
    expect(droplet).to.not.be.undefined;
  });

  it('has a valid version', () => {
    expect(droplet.version).to.not.be.undefined;
    expect(droplet.version).to.match(/^([0-9]+.?)+$/);
  });
});
