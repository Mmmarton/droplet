import { find } from './droplet/selectors.js';

const paragraph = find('p');
if (paragraph) {
  paragraph.setContent('Here');
}

const paragraph2 = find('p', 1);
if (paragraph2) {
  paragraph2.setContent('Second one');
}
