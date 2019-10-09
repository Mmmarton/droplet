import { expect } from 'chai';
import droplet from '../app/droplet/core';

describe('core', () => {
  it('is initialized', () => {
    expect(droplet).to.not.be.undefined;
  });

  it('is set in global context', () => {
    expect(global.droplet).to.not.be.undefined;
  });

  it('has a valid version', () => {
    expect(droplet.version).to.not.be.undefined;
    expect(droplet.version).to.match(/^([0-9]+.?)+$/);
  });
});
