import {
  Component,
  loadComponents,
  renderIntoBody
} from '@csereimarton/droplet';
import boxTemplate from './box.html';
import bulletTemplate from './bullet.html';
import template from './main.html';

class MainComponent extends Component {
  counter = 0;
  test = 0;
  secretValue = 'hmm';
  showDot = true;

  constructor() {
    super(template);
  }

  increase() {
    this.counter++;
  }

  changeTest(value) {
    this.test = value;
  }

  changeSecretValue(event) {
    this.secretValue = event.target.value;
  }

  updateShowDot(event) {
    this.showDot = event.target.checked;
  }
}

class BoxComponent extends Component {
  classlist = 'common';
  number = Math.floor(Math.random(100));

  constructor() {
    super(boxTemplate);
  }

  increase() {
    this.number++;
    if (this.number > 200) {
      this.classlist = 'special';
    }
  }

  changeTest() {
    if (this.inputs['change-test']) {
      this.inputs['change-test'](Math.floor(Math.random() * 100));
    }
  }
}

class BulletComponent extends Component {
  shoutText = 'NOPE!!!';

  constructor() {
    super(bulletTemplate);
  }

  shout() {
    if (this.shoutText === 'NOPE!!!') {
      this.shoutText = 'YAAAAY!';
    } else {
      this.shoutText = 'NOPE!!!';
    }
  }
}

loadComponents(MainComponent, BoxComponent, BulletComponent);
renderIntoBody(new MainComponent());

//hasOwnProperty
