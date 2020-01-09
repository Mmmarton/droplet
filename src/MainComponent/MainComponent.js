import { Component } from '../droplet';
import template from './MainComponent.html';

export class MainComponent extends Component {
  name = 'Jake';
  age = 12;
  type = 'checkbox';

  constructor() {
    super();
    this.setTemplate(template);
    
  }

  increment() {
    console.log('aaa');
    this.age++;
  }
}
