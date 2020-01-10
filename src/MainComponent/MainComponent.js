import { Component } from '../droplet';
import template from './MainComponent.html';

export class MainComponent extends Component {
  name = 'Jake';
  age = 12;
  type = 'checkbox';
  lastChildValue = 0;

  constructor() {
    super();
    this.setTemplate(template);
  }

  increment() {
    this.age++;
  }

  log(value) {
    this.lastChildValue = value;
  }
}
