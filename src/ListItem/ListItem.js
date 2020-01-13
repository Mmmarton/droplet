import { Component } from '../droplet';
import template from './ListItem.html';

export class ListItem extends Component {
  constructor() {
    super();
    this.setTemplate(template);
  }

  remove() {
    this.inputs.remove(this.inputs.index);
  }
}
