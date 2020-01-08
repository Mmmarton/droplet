'use strict';

import { Component, setUp } from './droplet';
import template from './MainComponent.html';

class ManiComponent extends Component {
  person = {
    name: 'jake',
    age: 15,
    hobbies: []
  };

  constructor() {
    super();
    this.setTemplate(template);
  }
}

const root = document.querySelectorAll('body')[0];
const component = new ManiComponent();
setUp(root, component);
