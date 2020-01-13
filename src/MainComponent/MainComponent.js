import { Component } from '../droplet';
import template from './MainComponent.html';

export class MainComponent extends Component {
  listItems = [];
  lastIndex = 0;
  text = { content: '' };

  constructor() {
    super();
    this.setTemplate(template);
  }

  addIem() {
    this.listItems = [
      ...this.listItems,
      { index: this.lastIndex++, content: this.text.content }
    ];
  }

  removeItem(index) {
    this.listItems = this.listItems.filter(item => item.index !== index);
  }

  updateText(event) {
    this.text.content = event.target.value;
  }
}
