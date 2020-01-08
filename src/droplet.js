'use strict';

import { html2json } from './template-parser';

const isEvent = key => key.startsWith('on');
function componentToNode(component) {
  const { elementName, props, children } = component;
  let node;

  if (!elementName) {
    node = document.createTextNode(component);
  } else {
    node = document.createElement(elementName);
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
  let mainNode = componentToNode(component.render());
  container.removeChild(container.firstChild);
  container.appendChild(mainNode);
}

function setUp(container, component) {
  mainComponent = component;
  mainContainer = container;
  isDirty = true;
}

class Component {
  template = '';
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

  setTemplate(template) {
    this.template = template;
  }

  render() {
    return this.template ? html2json(this.template) : this.template;
  }
}

export { Component, setUp };
