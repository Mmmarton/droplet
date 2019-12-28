export const componentsList = {};

const handler = {
  set: (obj, prop, value) => {
    console.log({ prev: obj[prop], curr: value });
    obj[prop] = value;
    return true;
  }
};

export function registerComponent(component, tag) {
  componentsList[tag] = component;
}

export function createComponent(componentName) {
  const component = componentsList[componentName.toLowerCase()];
  if (component) {
    const instance = new Proxy(new component(), handler);
    return {
      component: instance,
      data: parseTemplate(instance)
    };
  } else {
    return null;
  }
}

function parseTemplate(component) {
  let template = component.template;
  template.match(/{{[a-zA-Z0-9]*}}/g).forEach(variable => {
    const name = variable.substring(2, variable.length - 2);
    template = template.replace(new RegExp(variable, 'g'), component[name]);
  });

  return template;
}


export function buildTree(DOMnode) {
  const node = {
    type: DOMnode.nodeType,
    name: DOMnode.nodeName,
    data: DOMnode.data,
    style: getStyle(DOMnode.style),
    classes: DOMnode.classList ? DOMnode.classList.value : '',
    children: [],
    ...createComponent(DOMnode.nodeName)
  };
  for (let i = 0; i < DOMnode.childNodes.length; i++) {
    node.children.push(buildTree(DOMnode.childNodes[i]));
  }
  return node;
}

export function renderIntoElement(DOMelement, tree) {
  const element = buildDOMFromNode(tree);
  DOMelement.parentNode.insertBefore(element, DOMelement);
  DOMelement.parentNode.removeChild(DOMelement);
}

function buildDOMFromNode(node) {
  let element;
  if (node.type === 1) {
    element = document.createElement(node.name);
    setStyle(element, node.style);
    element.className = node.classes;
    if (node.component) {
      element.innerHTML = node.data;
    }
  } else if (node.type === 3) {
    element = document.createTextNode(node.data);
  } else {
    console.error("Yikes. can't handle this node type yet.");
  }
  for (let i = 0; i < node.children.length; i++) {
    element.appendChild(buildDOMFromNode(node.children[i]));
  }
  return element;
}

function setStyle(DOMelement, style) {
  Object.keys(style).forEach(key => {
    DOMelement.style[key] = style[key];
  });
}

function getStyle(DOMstyle) {
  if (!DOMstyle) {
    return null;
  }
  const style = {};
  for (let i = 0; i < DOMstyle.length; i++) {
    style[DOMstyle[i]] = DOMstyle[DOMstyle[i]];
  }
  return style;
}


export class Carrot {
  template = `
  <span style="color: orange; border: 1px solid red">Carrot {{number}}</span>
  `;

  number = Math.floor(Math.random() * 100) / 100;
}

registerComponent(Carrot, 'carrot');



const body = document.querySelectorAll('body');
const bodyElements = buildTree(body[0]);
renderIntoElement(body[0], bodyElements);

console.log(bodyElements);
