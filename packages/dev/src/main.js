import { Component, loadComponents, setRoot } from '@csereimarton/droplet';
import appleTemplate from './apple.html';
import mainTemplate from './main.html';

class Main extends Component {
  value1 = 3;
  value2 = 33;
  names = ['Anne', 'Charlie'];
  constructor() {
    super(mainTemplate);
  }

  shout(name, a) {
    return 'dada(' + name + ',' + a + ')';
  }

  doubleValue(value) {
    return value * 2;
  }
}

class Apple extends Component {
  constructor() {
    super(appleTemplate);
  }
}

loadComponents(Main, Apple);
setRoot(Main);
