import { Component } from '../droplet';
import template from './BoxComponent.html';

export class BoxComponent extends Component {
  number = 0;

  constructor() {
    super();
    this.setTemplate(template);
  }

  increase() {
    this.number++;
  }

  sendValue() {
    this.inputs.log(this.number);
  }

  remove() {
    this.inputs.remove(this.inputs.index);
  }

  isInput() {
    return this.inputs.index === 0 || this.inputs.index;
  }
}
