import { Component, loadComponents, setRoot } from '@csereimarton/droplet';
import { default as appleTemplate } from './apple.html';
import { default as mainTemplate } from './main.html';

class Main extends Component {
  names = ['Anne', 'Charlie'];
  constructor() {
    super(mainTemplate);
  }

  shout(name, a) {
    return 'dada(' + name + ',' + a + ')';
  }
}

class Apple extends Component {
  constructor() {
    super(appleTemplate);
  }
}

loadComponents(Main, Apple);
setRoot(Main);
