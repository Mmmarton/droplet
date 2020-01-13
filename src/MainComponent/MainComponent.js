import { Component } from '../droplet';
import template from './MainComponent.html';

export class MainComponent extends Component {
  name = 'Jake';
  age = 12;
  type = 'checkbox';
  lastChildValue = 0;
  hide1 = true;
  hide2 = null;
  children = [];
  lastIndex = 0;

  constructor() {
    super();
    this.setTemplate(template);
  }

  get childCount() {
    return this.children ? this.children.length : 0;
  }

  increment() {
    this.age++;
  }

  log(value) {
    this.lastChildValue = value;
  }

  addChildren() {
    this.children = [...this.children, { index: this.lastIndex++ }];
  }

  removeChildren() {
    this.children = this.children.slice(0, this.children.length - 1);
  }

  remove(index) {
    this.children = this.children.filter(child => child.index !== index);
  }

  checkboxChange(event) {
    this.hide2 = event.target.checked;
  }
}
