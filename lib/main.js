import './*.component.js';
import { buildTree, renderIntoElement } from './dom.js';

const body = document.querySelectorAll('body');
const bodyElements = buildTree(body[0]);
renderIntoElement(body[0], bodyElements);
