'use strict';

function createDOMnodeFromHTML(htmlString) {
  let div = document.createElement('div');
  div.innerHTML = htmlString;
  return div.firstElementChild;
}

function createJSONfromDOMnode(node, componentsList) {
  let json = {
    elementName: node.nodeName,
    attributes: {},
    children: [],
    node,
    component: componentsList[node.nodeName]
  };

  Object.keys(node.attributes).forEach(key => {
    json.attributes[node.attributes[key].name] = node.attributes[key].value;
    if (node.attributes[key].name.startsWith('on')) {
      node[node.attributes[key].name] = null;
    }
  });

  if (json.component) {
    json.instance = new json.component();
    while (json.node.firstChild) {
      json.node.removeChild(json.node.firstChild);
    }
    json.node.appendChild(json.instance.template.node);
  } else {
    Object.keys(node.childNodes).forEach(key => {
      let child = DOMnodeToJSONChild(node.childNodes[key], componentsList);
      if (child) {
        json.children.push(child);
      }
    });
  }

  return json;
}

function DOMnodeToJSONChild(node, componentsList) {
  let nodeName = node.nodeName;
  if (nodeName === '#text') {
    let text = node.nodeValue.replace(/(\n|\r)/gm, '').trim();
    if (text) {
      return { text, node };
    }
  } else if (!nodeName.startsWith('#')) {
    return createJSONfromDOMnode(node, componentsList);
  }
}

function html2json(html, componentsList) {
  return createJSONfromDOMnode(createDOMnodeFromHTML(html), componentsList);
}

export { html2json };
