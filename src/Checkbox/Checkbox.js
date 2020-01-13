import { Component } from '../droplet';
import template from './Checkbox.html';

export class Checkbox extends Component {
  constructor() {
    super();
    this.setTemplate(template);
  }

  toggle() {
    this.inputs = { ...this.inputs, checked: !this.inputs.checked };
  }
}
