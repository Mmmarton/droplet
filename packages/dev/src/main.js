import template from './main.html';
let body = document.querySelectorAll('body')[0];

//-----------------------------html parsing--------------------------------
function createDOMnodeFromHTML(htmlString) {
  let div = document.createElement('div');
  div.innerHTML = htmlString;
  return div.firstElementChild;
}

function createNodefromDOMnode(DOMnode, componentsList) {
  let node;
  if (DOMnode.attributes.hasOwnProperty('*if')) {
    node = buildIfNode(DOMnode, componentsList);
  } else if (DOMnode.attributes.hasOwnProperty('*for')) {
    node = buildForNode(DOMnode, componentsList);
  } else {
    node = {
      elementName: DOMnode.nodeName,
      attributes: {},
      children: [],
      DOMnode,
      component: componentsList[DOMnode.nodeName]
    };

    Object.keys(DOMnode.attributes).forEach(key => {
      let attribute = DOMnode.attributes[key];
      node.attributes[attribute.name] = attribute.value;
      if (attribute.name.startsWith('on')) {
        DOMnode[attribute.name] = null;
      }
    });

    if (node.component) {
      node.instance = new node.component();
      while (node.DOMnode.firstChild) {
        node.DOMnode.removeChild(node.DOMnode.firstChild);
      }
      node.DOMnode.appendChild(node.instance.template.DOMnode);
    } else {
      Object.keys(DOMnode.childNodes).forEach(key => {
        let child = buildChildNode(DOMnode.childNodes[key], componentsList);
        if (child) {
          node.children.push(child);
        }
      });
    }
  }

  return node;
}

function buildIfNode(DOMnode, componentsList) {
  let expression = DOMnode.attributes['*if'].value;
  DOMnode.removeAttribute('*if');
  return {
    elementName: '*if',
    expression,
    active: false,
    content: createNodefromDOMnode(DOMnode, componentsList)
  };
}

function buildForNode(DOMnode, componentsList) {
  let expression = DOMnode.attributes['*for'].value;
  DOMnode.removeAttribute('*for');
  return {
    elementName: '*for',
    expression,
    content: createNodefromDOMnode(DOMnode, componentsList),
    elements: {}
  };
}

function buildChildNode(node, componentsList) {
  let nodeName = node.nodeName;
  if (nodeName === '#text') {
    let text = node.nodeValue.replace(/(\n|\r)/gm, '').trim();
    if (text) {
      return { text, node };
    }
  } else if (!nodeName.startsWith('#')) {
    return createNodefromDOMnode(node, componentsList);
  }
  return null;
}

function html2json(html, componentsList) {
  return createNodefromDOMnode(createDOMnodeFromHTML(html), componentsList);
}

//----------------------------component logic------------------------------


console.log(html2json(template, []));

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
