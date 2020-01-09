'use strict';

import { Component, setEntryComponent } from './droplet';

class ManiComponent extends Component {
  name = 'Jake';

  constructor() {
    super();
    this.setTemplate('MainComponent.html');
  }
}

setEntryComponent(new ManiComponent());
