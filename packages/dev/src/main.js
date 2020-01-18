import { html2json } from '@csereimarton/droplet';
import boxTemplate from './box.html';
import template from './main.html';

let renderQueue = [];
let componentsList = [];

function renderIntoBody(component) {
  let body = document.querySelectorAll('body')[0];
  while (body.firstChild) {
    body.removeChild(body.firstChild);
  }
  addNodeToRenderQueue(component.template, component, body);
}

function insertFieldsIntoString(string = '', object = {}) {
  let sections = string.split('}');
  let fields = {};
  for (let section of sections) {
    let field = section.split('{')[1];
    if (field) {
      fields[field] = object[field];
    }
  }

  Object.keys(fields).forEach(key => {
    string = string.replace(new RegExp(`{${key}}`, 'g'), object[key]);
  });

  return string;
}

function getMethodByName(name = '', object) {
  name = name.substring(1, name.length - 1);
  return object[name];
}

function insertFieldsIntoNode(node, object, parent) {
  let newNode = {
    attributes: {},
    children: [],
    node: node.node
  };

  if (node.text) {
    newNode.text = insertFieldsIntoString(node.text, object);
    if (newNode.node.nodeValue !== newNode.text) {
      newNode.node.nodeValue = newNode.text;
    }
    return newNode;
  }

  Object.keys(node.attributes).forEach(key => {
    if (key.startsWith('on')) {
      if (!node.node[key]) {
        newNode.node.removeAttribute(key);
        newNode.node[key] = getMethodByName(node.attributes[key], object);
      }
    } else {
      newNode.attributes[key] = insertFieldsIntoString(
        node.attributes[key],
        object
      );
      if (newNode.node.getAttribute(key) !== newNode.attributes[key]) {
        newNode.node.setAttribute(key, newNode.attributes[key]);
      }
    }
  });

  node.children.forEach(child => {
    addNodeToRenderQueue(child, object, newNode.node);
  });

  if (parent) {
    parent.appendChild(newNode.node);
  }
}

function addNodeToRenderQueue(node, object, parent) {
  if (!node) {
    return;
  }

  let index = renderQueue.findIndex(element => element.node === node);
  if (index > -1) {
    renderQueue[index] = { node, object, parent };
  } else {
    renderQueue.push({ node, object, parent });
  }
}

function toUpperKebabCase(camelCase = '') {
  let nameArray = camelCase.split('');
  for (let i = 1; i < nameArray.length; i++) {
    if (nameArray[i] >= 'A' && nameArray[i] <= 'Z') {
      nameArray.splice(i, 1, '-' + nameArray[i]);
    }
  }
  return nameArray.join('').toUpperCase();
}

function loadComponents(...components) {
  componentsList = {};
  components.forEach(component => {
    componentsList[toUpperKebabCase(component.name)] = component;
  });
}

function workLoop(deadline) {
  let thereIsStillTime = true;
  while (renderQueue.length && thereIsStillTime) {
    let elementToRender = renderQueue.shift();
    insertFieldsIntoNode(
      elementToRender.node,
      elementToRender.object,
      elementToRender.parent
    );

    thereIsStillTime = deadline.timeRemaining() > 0;
  }

  requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);

class Component {
  constructor(template) {
    this.template = html2json(template, componentsList);

    this.proxy = new Proxy(this, {
      set(target, name, value) {
        target[name] = value;
        addNodeToRenderQueue(target.template, target);
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
}

/*----------------------------------------------------------------*/
/*-------------------------------APP------------------------------*/
/*----------------------------------------------------------------*/

class MainComponent extends Component {
  counter = 0;

  constructor() {
    super(template);
  }

  increase() {
    this.counter++;
  }
}

class BoxComponent extends Component {
  constructor() {
    super(boxTemplate);
  }
}

loadComponents(MainComponent, BoxComponent);
renderIntoBody(new MainComponent());

console.log(new MainComponent().template);

let a = {
  b: false,
  c: 0,
  d: undefined,
  e: null,
  f: {}
};

//hasOwnProperty
