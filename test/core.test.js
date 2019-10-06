const expect = require('chai').expect;
const droplet = require('../app/droplet/core');

describe('core', function() {
  it('is initialized', function() {
    expect(droplet).to.not.be.undefined;
  });

  it('has a valid version', function() {
    expect(droplet.version).to.not.be.undefined;
    expect(droplet.version).to.match(/^([0-9]+.?)+$/);
  });
});
