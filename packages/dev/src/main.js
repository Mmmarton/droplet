import {
  Component,
  loadComponents,
  setEntryComponent
} from '@csereimarton/droplet';
import template from './box.html';

class Box extends Component {
  number = 4;

  constructor() {
    super();
    this.setTemplate(template);
    setTimeout(() => this.increment(), 500);
  }

  increment() {
    this.number++;
  }
}

class Line extends Component {
  constructor() {
    super();
    this.setTemplate('<div>D</div>');
  }
}

loadComponents(Box, Line);
setEntryComponent(new Box());
