import { html2json } from '@csereimarton/droplet';
import boxTemplate from './box.html';
import bulletTemplate from './bullet.html';
import template from './main.html';

let renderQueue = [];
let componentsList = [];
let firstRender;

function renderIntoBody(component) {
  let body = document.querySelectorAll('body')[0];
  while (body.firstChild) {
    body.removeChild(body.firstChild);
  }
  firstRender = () => {
    body.appendChild(component.template.node);
  };
  addNodeToRenderQueue(component.template, component, { node: body });
}

let isSimpleExpression = string =>
  string[0].startsWith('{') && string.endsWith('}');

function insertFieldsIntoString(string = '', object = {}) {
  if (isSimpleExpression(string)) {
    let field = string.substring(1, string.length - 1);
    if (field.endsWith('()')) {
      let key = field.substring(0, field.length - 2);
      if (typeof object.getAttribute(key) === 'function') {
        return object.getAttribute(key);
      }
    }
  }

  let sections = string.split('}');
  let fields = {};

  for (let section of sections) {
    let field = section.split('{')[1];
    if (field) {
      fields[field] = object.getAttribute(field);
    }
  }

  if (isSimpleExpression(string)) {
    return object.getAttribute(Object.keys(fields)[0]);
  } else {
    Object.keys(fields).forEach(key => {
      string = string.replace(
        new RegExp(`{${key}}`, 'g'),
        object.getAttribute(key)
      );
    });
  }

  return string;
}

function getMethodByName(name = '', object) {
  name = name.substring(1, name.length - 1);
  return object[name];
}

function insertFieldsIntoTextNode(node, object) {
  let text = insertFieldsIntoString(node.text, object);
  if (node.node.nodeValue !== text) {
    node.node.nodeValue = text;
  }
}

function insertFieldsIntoNodeAttribute(newNode, node, attribute, object) {
  if (attribute.startsWith('on')) {
    if (!node.node[attribute]) {
      newNode.node.removeAttribute(attribute);
      newNode.node[attribute] = getMethodByName(
        node.attributes[attribute],
        object
      );
    }
  } else {
    newNode.attributes[attribute] = insertFieldsIntoString(
      node.attributes[attribute],
      object
    );
    if (
      newNode.node.getAttribute(attribute) !== newNode.attributes[attribute]
    ) {
      if (attribute === '*if') {
        if (newNode.attributes[attribute]) {
          newNode.placeholder.replaceWith(newNode.node);
        } else {
          newNode.node.replaceWith(newNode.placeholder);
        }
      } else {
        newNode.node.setAttribute(attribute, newNode.attributes[attribute]);
      }
    }
  }
}

function insertFieldsIntoNode(node, object) {
  let newNode = {
    ...node,
    attributes: {},
    visible: true
  };

  if (node.text) {
    insertFieldsIntoTextNode(newNode, object);
    return;
  }

  if (node.instance) {
    newNode.instance.inputs = newNode.attributes;
  }

  Object.keys(node.attributes).forEach(attribute =>
    insertFieldsIntoNodeAttribute(newNode, node, attribute, object)
  );

  newNode.children.forEach(child => addNodeToRenderQueue(child, object));
}

function addNodeToRenderQueue(node, object) {
  if (!node) {
    return;
  }

  let index = renderQueue.findIndex(element => element.node === node);
  if (index > -1) {
    renderQueue[index] = { node, object };
  } else {
    renderQueue.push({ node, object });
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
  if (renderQueue.length) {
    while (renderQueue.length && thereIsStillTime) {
      let elementToRender = renderQueue.shift();
      insertFieldsIntoNode(elementToRender.node, elementToRender.object);

      thereIsStillTime = deadline.timeRemaining() > 0;
    }
  } else if (firstRender) {
    firstRender();
    firstRender = null;
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
  secretValue = 'hmm';
  showDot = true;

  constructor() {
    super(template);
  }

  increase() {
    this.counter++;
  }

  changeTest(value) {
    this.test = value;
  }

  changeSecretValue(event) {
    this.secretValue = event.target.value;
  }

  updateShowDot(event) {
    this.showDot = event.target.checked;
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

  changeTest() {
    if (this.inputs['change-test']) {
      this.inputs['change-test'](Math.floor(Math.random() * 100));
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
