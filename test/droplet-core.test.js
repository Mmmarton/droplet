const core = require('../app/js/droplet-core');

describe('Core tests', () => {
  it('it negates the boolean value', () => {
    let boolean = false;
    const result = core.negate(boolean);
    expect(result).toBe(true);
  });
});
