import { Component } from '../droplet';
import template from './MainComponent.html';

export class MainComponent extends Component {
  name = 'Jake';

  constructor() {
    super();
    this.setTemplate(template);
  }
}
