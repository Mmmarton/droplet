const expect = require('chai').expect;
const JSDOM = require('jsdom').JSDOM;
import { find } from '../app/droplet/selectors';

describe('selectors', () => {
  describe('find', () => {
    it('is initialized', () => {
      expect(find).to.be.not.undefined;
    });
    it('returns null if the element was not found', () => {
      global.document = new JSDOM('<p>Something</p>').window.document;
      const foundElement = find('div');
      expect(foundElement).to.be.null;
    });
    it('returns null if the index is out of bounds', () => {
      global.document = new JSDOM('<p>Something</p>').window.document;
      const foundElement = find('p', 1);
      expect(foundElement).to.be.null;
    });
    it('finds an element', () => {
      global.document = new JSDOM('<p>Something</p>').window.document;
      const foundElement = find('p');
      expect(foundElement).to.be.not.undefined;
      expect(foundElement.innerHTML).to.equal('Something');
    });
    it('finds the nth element', () => {
      global.document = new JSDOM('<p>1</p><p>2</p>').window.document;
      const foundElement = find('p', 1);
      expect(foundElement).to.be.not.undefined;
      expect(foundElement.innerHTML).to.equal('2');
    });
    it('returns a view element', () => {
      global.document = new JSDOM('<p>Something</p>').window.document;
      const foundElement = find('p');
      expect(foundElement.setContent).to.be.not.undefined;
      foundElement.setContent('Something2');
      expect(foundElement.innerHTML).to.equal('Something2');
    });
  });
});
