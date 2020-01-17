import { html2json } from '@csereimarton/droplet';
// import template from './box.html';

function renderIntoBody(component) {
  let node = component.render().node;
  let container = document.querySelectorAll('body')[0];
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
  container.appendChild(node);
}

function update(node) {
  Object.keys(node.attributes).forEach(key => {
    if (node.node.attributes[key].value !== node.attributes[key]) {
      node.node.attributes[key].value = node.attributes[key];
    }
  });
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

function insertFieldsIntoNode(node, object) {
  let newNode = {
    attributes: {},
    children: [],
    node: node.node
  };

  if (node.text) {
    newNode.text = insertFieldsIntoString(node.text, object);
    newNode.node.nodeValue = newNode.text;
    return newNode;
  }

  Object.keys(node.attributes).forEach(key => {
    newNode.attributes[key] = insertFieldsIntoString(
      node.attributes[key],
      object
    );
    newNode.node.setAttribute(key, newNode.attributes[key]);
  });

  node.children.forEach(child => {
    newNode.children.push(insertFieldsIntoNode(child, object));
  });

  return newNode;
}

let componentLastUUID = 0;
let dirtyComponents = {};

class Component {
  constructor() {
    this.UUID = componentLastUUID++;

    this.proxy = new Proxy(this, {
      set(target, name, value) {
        target[name] = value;
        dirtyComponents[target.UUID] = target.proxy;
        return true;
      }
    });

    return this.proxy;
  }

  setTemplate(template) {
    this.template = html2json(template);
  }

  render() {
    return insertFieldsIntoNode(this.template, this);
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

a.f1 = 'LOOONG';
a.f2 = 'SHOORt';
a.a1 = 'green';

update(a.render());
