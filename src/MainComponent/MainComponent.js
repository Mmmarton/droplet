import { Component } from '../droplet';
import template from './MainComponent.html';

export class MainComponent extends Component {
  name = 'Jake';
  age = 12;
  type = 'checkbox';
  lastChildValue = 0;
  hide1 = false;
  hide2 = true;
  childCount = 5;

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

  addChildren() {
    this.childCount++;
  }

  removeChildren() {
    this.childCount--;
  }
}
