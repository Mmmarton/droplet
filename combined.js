const componentsList = {};

const handler = {
  set: (obj, prop, value) => {
    console.log({ prev: obj[prop], curr: value });
    obj[prop] = value;
    return true;
  },
  apply: (target, thisArg, argumentsList) => {
    console.log('asd');
    return thisArg[target].apply(this, argumentList);
  }
};

export function registerComponent(component, tag) {
  componentsList[tag] = component;

  const a = new Proxy(new componentsList['carrot'](), handler);
  a.update();
  a.update();
  a.field = 'bumm';
  a.array.push('mik');
}
export function buildTree(DOMnode) {
  const node = {
    type: DOMnode.nodeType,
    name: DOMnode.nodeName,
    data: DOMnode.data,
    style: getStyle(DOMnode.style),
    classes: DOMnode.classList ? DOMnode.classList.value : '',
    children: []
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



const body = document.querySelectorAll('body');
const bodyElements = buildTree(body[0]);
renderIntoElement(body[0], bodyElements);


export class Carrot {
  componentName = 'carrot';
  field = 'Something';
  array = ['pam'];

  update() {
    this.field += 'd';
  }
}

registerComponent(Carrot, 'carrot');
