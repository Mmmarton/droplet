import { html2json } from '@csereimarton/droplet';
import boxTemplate from './box.html';
import bulletTemplate from './bullet.html';
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
      fields[field] = object.getAttribute(field);
    }
  }

  Object.keys(fields).forEach(key => {
    string = string.replace(
      new RegExp(`{${key}}`, 'g'),
      object.getAttribute(key)
    );
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

  if (node.instance) {
    node.instance.inputs = newNode.attributes;
  }

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

  getAttribute(propertyPath = '') {
    let value = this;
    let properties = propertyPath.split('.');
    for (let property of properties) {
      value = value[property];
    }
    return value;
  }
}

/*----------------------------------------------------------------*/
/*-------------------------------APP------------------------------*/
/*----------------------------------------------------------------*/

class MainComponent extends Component {
  counter = 0;
  test = 0;

  constructor() {
    super(template);
  }

  increase() {
    this.counter++;
  }

  changeTest() {
    this.test = Math.floor(Math.random() * 10);
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
