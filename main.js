'use strict';

const isEvent = key => key.startsWith('on');

function componentToNode(component) {
  const { type, props, children } = component.template || component;
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

// the application

const root = document.querySelectorAll('body')[0];

class Component {
  template = {
    type: 'div',
    children: [
      {
        type: 'h1',
        props: {
          className: 'main-title',
          onClick: this.handle
        },
        children: ['title']
      },
      {
        type: 'p',
        children: ['some content']
      }
    ]
  };

  handle() {
    console.log('BOO');
  }
}

let mainComponent = new Component();
let mainNode = componentToNode(mainComponent.template);
root.appendChild(mainNode);
