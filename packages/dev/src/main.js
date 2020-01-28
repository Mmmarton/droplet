import appleTemplate from './apple.html';
import { default as mainTemplate } from './main.html';
let body = document.querySelectorAll('body')[0];

//-----------------------------html parsing--------------------------------
function createDOMNodeFromHTML(htmlString) {
  let div = document.createElement('div');
  div.innerHTML = htmlString;
  return div.firstElementChild;
}

function createNodefromDOMNode(DOMNode, componentsList) {
  let node;
  if (DOMNode.attributes.hasOwnProperty('*if')) {
    node = buildIfNode(DOMNode, componentsList);
  } else if (DOMNode.attributes.hasOwnProperty('*for')) {
    node = buildForNode(DOMNode, componentsList);
  } else {
    node = buildNormalNode(DOMNode, componentsList);
  }

  return node;
}

function buildNormalNode(DOMNode, componentsList) {
  let node = {
    elementName: DOMNode.nodeName,
    attributes: {},
    children: [],
    DOMNode,
    component: componentsList[DOMNode.nodeName]
  };

  initializeNodeAttributes(node);

  if (node.component) {
    initializeNodeComponent(node);
  } else {
    initializeChildNodes(node, componentsList);
  }

  return node;
}

function buildIfNode(DOMNode, componentsList) {
  let expression = DOMNode.attributes['*if'].value;
  DOMNode.removeAttribute('*if');
  return {
    elementName: '*if',
    expression,
    active: false,
    content: createNodefromDOMNode(DOMNode, componentsList)
  };
}

function buildForNode(DOMNode, componentsList) {
  let expression = DOMNode.attributes['*for'].value;
  DOMNode.removeAttribute('*for');
  return {
    elementName: '*for',
    expression,
    content: createNodefromDOMNode(DOMNode, componentsList),
    elements: {}
  };
}

function initializeNodeAttributes(node) {
  Object.keys(node.DOMNode.attributes).forEach(key => {
    let attribute = node.DOMNode.attributes[key];
    node.attributes[attribute.name] = attribute.value;
    if (attribute.name.startsWith('on')) {
      node.DOMNode[attribute.name] = null;
    }
  });
}

function initializeNodeComponent(node) {
  node.instance = new node.component();
  while (node.DOMNode.firstChild) {
    node.DOMNode.removeChild(node.DOMNode.firstChild);
  }
  node.DOMNode.appendChild(node.instance.template.DOMNode);
}

function initializeChildNodes(node, componentsList) {
  Object.keys(node.DOMNode.childNodes).forEach(key => {
    let child = buildChildNode(node.DOMNode.childNodes[key], componentsList);
    if (child) {
      node.children.push(child);
    }
  });
}

function buildChildNode(DOMNode, componentsList) {
  let nodeName = DOMNode.nodeName;
  if (nodeName === '#text') {
    let text = DOMNode.nodeValue.replace(/(\n|\r)/gm, '').trim();
    if (text) {
      return { text, DOMNode };
    }
  } else if (!nodeName.startsWith('#')) {
    return createNodefromDOMNode(DOMNode, componentsList);
  }
  return null;
}

function html2json(html, componentsList) {
  return createNodefromDOMNode(createDOMNodeFromHTML(html), componentsList);
}

//-----------------------------update logic--------------------------------
let processQueue = new Set();
let renderQueue = new Set();

function updateNode({ node, object }) {
  if (node.text) {
    let text = insertFieldsIntoString(node.text, object);
    if (node.DOMNode.nodeValue !== text) {
      node.newDOMNode = node.DOMNode.cloneNode(false);
      node.newDOMNode.nodeValue = text;
      renderQueue.add(node);
    }
    return;
  }

  if (node.attributes) {
    Object.keys(node.attributes).forEach(attribute => {
      let value = node.attributes[attribute];
      if (value[0] === '{') {
        value = value.substring(1, value.length - 1);
        if (attribute.startsWith('on')) {
          if (!node.DOMNode[attribute]) {
            node.newDOMNode = node.DOMNode.cloneNode(false);
            node.newDOMNode.removeAttribute(attribute);
            node.newDOMNode[attribute] = object[value];
            renderQueue.add(node);
          }
        } else if (node.DOMNode.getAttribute(attribute) !== object[value]) {
          node.newDOMNode = node.DOMNode.cloneNode(false);
          node.newDOMNode.setAttribute(attribute, object[value]);
          renderQueue.add(node);
        }
      }
    });
  }

  if (node.children) {
    node.children.forEach(child => {
      processQueue.add({
        node: child,
        object
      });
    });
  }
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

function renderNode(node) {
  if (node.children) {
    node.children.forEach(child => {
      node.newDOMNode.appendChild(child.DOMNode);
    });
  }
  node.DOMNode.replaceWith(node.newDOMNode);
  node.DOMNode = node.newDOMNode;
}

function workLoop(deadline) {
  let thereIsStillTime = true;
  while (processQueue.size && thereIsStillTime) {
    let elementToProcess = processQueue.entries().next().value[0];
    processQueue.delete(elementToProcess);
    updateNode(elementToProcess);

    thereIsStillTime = deadline.timeRemaining() > 0;
  }
  while (renderQueue.size && thereIsStillTime) {
    let elementToRender = renderQueue.entries().next().value[0];
    renderQueue.delete(elementToRender);
    renderNode(elementToRender);

    thereIsStillTime = deadline.timeRemaining() > 0;
  }

  requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);

//----------------------------component logic------------------------------
let componentsList = {};

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
  components.forEach(component => {
    componentsList[toUpperKebabCase(component.name)] = component;
  });
}

function createProxy(object) {
  return new Proxy(object, {
    set(target, name, value) {
      target[name] = value;
      processQueue.add({
        node: object.template,
        object
      });
      return true;
    }
  });
}

function bindClassMethodsToProxy(object, proxy) {
  let methods = Object.getOwnPropertyNames(Object.getPrototypeOf(object));
  methods.forEach(method => {
    if (typeof object[method] === 'function' && method !== 'constructor') {
      object[method] = object[method].bind(proxy);
    }
  });
}

class Component {
  constructor(template) {
    this.template = html2json(template, componentsList);
    this.proxy = createProxy(this);
    bindClassMethodsToProxy(this, this.proxy);
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

class Apple extends Component {
  constructor() {
    super(appleTemplate);
  }
}

class Main extends Component {
  secretValue = 'Nope';

  constructor() {
    super(mainTemplate);
  }

  update(event) {
    console.log(event);
    this.secretValue += '!';
  }
}

loadComponents(Main, Apple);
let main = new Main();
body.appendChild(main.template.DOMNode);
updateNode({ node: main.template, object: main });
console.log(main);

//----------------------------------keep-----------------------------------
function getListDiffs(old, current) {
  let deleted = {};
  let created = {};
  if (old[0] instanceof Object) {
    for (let i = 0; i < old.length; i++) {
      deleted[JSON.stringify(old[i])] = old[i];
    }
    for (let i = 0; i < current.length; i++) {
      if (deleted[JSON.stringify(current[i])]) {
        delete deleted[JSON.stringify(current[i])];
      } else {
        created[JSON.stringify(current[i])] = current[i];
      }
    }
  } else {
    for (let i = 0; i < old.length; i++) {
      deleted[old[i]] = old[i];
    }
    for (let i = 0; i < current.length; i++) {
      if (deleted[current[i]]) {
        delete deleted[current[i]];
      } else {
        created[current[i]] = current[i];
      }
    }
  }
  return { deleted, created };
}

//--------------------------free stuff-----------------------
