'use strict';

function createDOMnodeFromHTML(htmlString) {
  let div = document.createElement('div');
  div.innerHTML = htmlString;
  return div.firstElementChild;
}

function createJSONfromDOMnode(node) {
  let json = {
    elementName: node.nodeName,
    attributes: {},
    children: []
  };

  Object.keys(node.attributes).forEach(key => {
    json.attributes[node.attributes[key].name] = node.attributes[key].value;
  });

  Object.keys(node.childNodes).forEach(key => {
    let child = DOMnodeToJSONChild(node.childNodes[key]);
    if (child) {
      json.children.push(child);
    }
  });

  return json;
}

function DOMnodeToJSONChild(node) {
  let nodeName = node.nodeName;
  if (nodeName === '#text') {
    let text = node.nodeValue.replace(/(\n|\r)/gm, '').trim();
    if (text) {
      return text;
    }
  } else if (!nodeName.startsWith('#')) {
    return createJSONfromDOMnode(node);
  }
}

function html2json(html) {
  return createJSONfromDOMnode(createDOMnodeFromHTML(html));
}

export { html2json };
