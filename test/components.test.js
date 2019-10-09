import { expect } from 'chai';
import droplet from '../app/droplet/core';
import '../app/droplet/components';

describe('components', () => {
  it('is initialized', () => {
    expect(droplet.components).to.not.be.undefined;
  });
});
