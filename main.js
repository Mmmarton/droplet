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
  let mainNode = componentToNode(component.template);
  container.removeChild(container.firstChild);
  container.appendChild(mainNode);
}

function setUp(container, component) {
  mainComponent = component;
  mainContainer = container;
  isDirty = true;
}

// the application

class Component {
  counter = 1;

  constructor() {
    this.proxy = new Proxy(this, {
      set(target, name, value) {
        target[name] = value;
        isDirty = true;
        return true;
      }
    });
    this.increment = this.increment.bind(this.proxy);
    this.decrement = this.decrement.bind(this.proxy);
    return this.proxy;
  }

  get template() {
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
          children: ['count ', this.counter]
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
    this.counter++;
  }

  decrement() {
    this.counter--;
  }
}

const root = document.querySelectorAll('body')[0];
const component = new Component();
setUp(root, component);
