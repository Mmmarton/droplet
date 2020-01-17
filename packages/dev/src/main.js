import { html2json } from '@csereimarton/droplet';
// import template from './box.html';

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
    newNode.attributes[key] = insertFieldsIntoString(
      node.attributes[key],
      object
    );
    if (newNode.node.getAttribute(key) !== newNode.attributes[key]) {
      newNode.node.setAttribute(key, newNode.attributes[key]);
    }
  });

  node.children.forEach(child => {
    addNodeToRenderQueue(child, object, newNode);
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

function workLoop(deadline) {
  let thereIsStillTime = true;
  while (renderQueue.length && thereIsStillTime) {
    console.log('hop');
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

let componentLastUUID = 0;
let renderQueue = [];

class Component {
  constructor() {
    this.UUID = componentLastUUID++;

    this.proxy = new Proxy(this, {
      set(target, name, value) {
        target[name] = value;
        addNodeToRenderQueue(target.template, target);
        return true;
      }
    });

    return this.proxy;
  }

  setTemplate(template) {
    this.template = html2json(template);
  }
}

class A extends Component {
  constructor() {
    super();
    this.f1 = 1;
    this.f2 = 'HEY';
    this.a1 = 'blue';

    this.setTemplate('<div class="{a1}">{f1} + {f2}</div>');
  }
}

let a = new A();

renderIntoBody(a);

setTimeout(() => {
  a.f1 = 'HUHA';
}, 1000);

setTimeout(() => {
  a.f2 = 'YAHA';
}, 2000);

setTimeout(() => {
  a.a1 = 'green';
}, 3000);
