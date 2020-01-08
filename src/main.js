'use strict';

import mainComponentTemplate from './MainComponent.html';

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

  render() {
    return '';
  }
}

// the application

class ManiComponent extends Component {
  person = {
    name: 'jake',
    age: 15,
    hobbies: []
  };

  constructor() {
    super();
  }

  render() {
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
          children: ['Some content']
        }
      ]
    };
  }
}

const root = document.querySelectorAll('body')[0];
const component = new ManiComponent();
setUp(root, component);

function setCharAt(string, character, index) {
  return string.substring(0, index) + character + string.substring(index + 1);
}

function html2jsonString(html = '') {
  let json = '';
  let lastClosingIndex = 0;
  for (let i = 0; i < html.length; i++) {
    if (html[i] === '<' && html[i + 1] !== '/') {
      if (i > lastClosingIndex + 1) {
        json += `"${html.substring(lastClosingIndex, i)}",`;
      }
      //get element
      let hasChildren = true;
      let endIndex = html.indexOf('>', i);
      let element = html.substring(i + 1, endIndex);
      if (element[element.length - 1] !== '/') {
        html = setCharAt(html, ' ', endIndex);
      } else {
        hasChildren = false;
      }
      let elementName = element.split(' ')[0];
      json += ` {"elementName":"${elementName}",`;

      //get props
      let props = element
        .substring(elementName.length)
        .replace(
          new RegExp(/([a-zA-Z0-9]+?)=['"](.+?)['"]((\/)|( \/))?/, 'g'),
          '"$1":"$2",'
        );
      if (props) {
        console.log('props', props);
        json += `"props":{${props}},`;
      }

      //get content
      if (hasChildren) {
        let startIndex = endIndex + 1;
        endIndex = html.indexOf(`</${elementName}>`, endIndex);
        let content = html.substring(startIndex, endIndex);
        json += `"children":[${html2jsonString(content)}]`;
        i = endIndex + 1;
      }
    } else if (html[i] === '>') {
      json += '},';
      lastClosingIndex = i + 1;
    }
  }
  if (lastClosingIndex !== html.length) {
    json += `"${html.substring(lastClosingIndex)}",`;
  }
  return json;
}

function html2json(html) {
  html = html.replace(new RegExp(/[\n\r\t]/, 'g'), ' ');
  html = html.replace(new RegExp(/ {2,}/, 'g'), ' ');
  html = html.replace(new RegExp(/> </, 'g'), '><');
  let jsonString = html2jsonString(html);
  jsonString = jsonString.replace(new RegExp(/(,([\]\}$]))|(,$)/, 'g'), '$1');
  jsonString = jsonString.replace(new RegExp(/,([\]\}$])/, 'g'), '$1');
  console.log(jsonString);
  return JSON.parse(jsonString);
}

console.log(html2json(mainComponentTemplate));
