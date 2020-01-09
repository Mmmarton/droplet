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
}
