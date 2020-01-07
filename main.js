'use strict';

const isEvent = key => key.startsWith('on');
function componentToNode(component) {
  const { type, props, children } = component;
  let node;

  if (!type) {
    node = document.createTextNode(component);
  } else {
    node = document.createElement(type);
    if (props) {
      Object.keys(props).forEach(key => {
        if (isEvent(key)) {
          const eventType = key.toLowerCase().substring(2);
          node.addEventListener(eventType, props[key]);
        } else {
          node[key] = props[key];
        }
      });
    }

    if (children) {
      for (let i = 0; i < children.length; i++) {
        let child = children[i];
        node.appendChild(componentToNode(child));
      }
    }
  }

  return node;
}

let isDirty = false;
let mainComponent;
let mainContainer;

function reRender() {
  if (isDirty) {
    render(mainContainer, mainComponent);
    isDirty = false;
  }
  setTimeout(reRender, 30);
}
setTimeout(reRender, 30);

function render(container, component) {
  let mainNode = componentToNode(component.getTemplate());
  container.removeChild(container.firstChild);
  container.appendChild(mainNode);
}

function setUp(container, component) {
  mainComponent = component;
  mainContainer = container;
  isDirty = true;
}

class Component {
  constructor() {
    this.proxy = new Proxy(this, {
      set(target, name, value) {
        target[name] = value;
        isDirty = true;
        return true;
      }
    });

    let methods = Object.getOwnPropertyNames(Object.getPrototypeOf(this));
    for (let method of methods) {
      if (typeof this[method] === 'function' && method !== 'constructor') {
        this[method] = this[method].bind(this.proxy);
      }
    }

    return this.proxy;
  }

  getTemplate() {
    return '';
  }
}

// the application

class ManiComponent extends Component {
  person = {
    name: 'jake',
    age: 15
  };

  constructor() {
    super();
  }

  getTemplate() {
    return {
      type: 'div',
      children: [
        {
          type: 'h1',
          props: {
            className: 'main-title'
          },
          children: ['title']
        },
        {
          type: 'p',
          children: ['name: ', this.person.name]
        },
        {
          type: 'p',
          children: ['age: ', this.person.age]
        },
        {
          type: 'button',
          props: {
            onClick: this.increment
          },
          children: ['increment']
        },
        {
          type: 'button',
          props: {
            onClick: this.decrement
          },
          children: ['decrement']
        }
      ]
    };
  }

  increment() {
    this.person.age++;
  }

  decrement() {
    this.person.age--;
  }
}

const root = document.querySelectorAll('body')[0];
const component = new ManiComponent();
setUp(root, component);
