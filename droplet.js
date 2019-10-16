const body = document.querySelectorAll('.first');
const bodyElements = buildTree(body[0]);

console.log(body[0].parentElement.childNodes);
console.log(body[0].children);
console.log(body[0].childNodes);
console.log(bodyElements);

const secondBody = document.querySelectorAll('.second');
renderIntoElement(secondBody[0], bodyElements);

function buildTree(DOMnode) {
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

function renderIntoElement(DOMelement, tree) {
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
