const body = document.querySelectorAll('body');
const bodyElements = buildTree(body[0]);

console.log(body[0].children);
console.log(body[0].childNodes);
console.log(bodyElements);

function buildTree(DOMnode) {
  const node = {
    type: DOMnode.nodeType,
    name: DOMnode.nodeName,
    data: DOMnode.data,
    children: []
  };
  for (let i = 0; i < DOMnode.childNodes.length; i++) {
    node.children.push(buildTree(DOMnode.childNodes[i]));
  }
  return node;
}
