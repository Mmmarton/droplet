import { loadComponents, setEntryComponent, Component } from './droplet';

class MainComponent extends Component {
  constructor() {
    super();
    this.setTemplate('<div>HEY</div>');
  }
}

loadComponents(MainComponent);
setEntryComponent(new MainComponent());
