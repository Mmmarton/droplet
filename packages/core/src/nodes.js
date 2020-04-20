import { processQueue, renderQueue } from './definitions';

function updateNode({ node, object }) {
  if (node.elementName === '*if') {
    updateIfNode(node, object);
  }

  if (node.elementName === '*for') {
    updateForNode(node, object);
  }

  if (node.text) {
    updateTextNode(node, object);
    return;
  }

  if (node.attributes) {
    object = updateNodeAttributes(node, object);
  }

  if (node.children) {
    node.children.forEach((child) => {
      processQueue.add({
        node: child,
        object,
      });
    });
  }
}

function updateNodeAttributes(node, object) {
  Object.keys(node.attributes).forEach((attribute) => {
    let value = node.attributes[attribute];
    if (value[0] === '{') {
      value = value.substring(1, value.length - 1);
      value = getObjectAttribute(object, value);

      if (attribute.startsWith('on')) {
        if (!node.DOMNode[attribute]) {
          node.newDOMNode = node.DOMNode.cloneNode(false);
          node.newDOMNode.removeAttribute(attribute);
          node.newDOMNode[attribute] = value;
          renderQueue.add(node);
        }
      } else if (getObjectAttribute(node.DOMNode, attribute) !== value) {
        node.newDOMNode = node.DOMNode.cloneNode(false);
        node.newDOMNode.setAttribute(attribute, value);
        renderQueue.add(node);
      }

      if (node.component) {
        node.instance.inputs[attribute] = value;
      }
    }
  });

  if (node.component) {
    object = node.instance;
  }
  return object;
}

function getObjectAttribute(object, attribute) {
  if (!attribute) {
    return null;
  }

  let value = object;
  let properties = attribute.split('.');

  for (let property of properties) {
    if (property[property.length - 1] === ')') {
      let [methodName, parameters] = property.split('(');
      parameters = parameters.substring(0, parameters.length - 1).split(',');
      parameters = parameters.map((parameter) =>
        getObjectAttribute(object, parameter.trim())
      );
      value = value[methodName];
      if (value) {
        value = value(...parameters);
      }
    } else {
      if (value) {
        value = value[property];
      }
    }
  }

  return value;
}

function updateForNode(node, object) {
  let [iterator, listName] = node.expression.split(' of ');

  let objectAttribute = getObjectAttribute(object, listName);
  const list =
    typeof objectAttribute == 'function' ? objectAttribute() : objectAttribute;
  node.list = list;

  if (!list) {
    return;
  } else if (!(list instanceof Array)) {
    console.warn(
      `${object.constructor.name}.${listName} is not an array. Please supply an array.`
    );
    return;
  }

  let { updates, deletions, additions } = updateForLoopElements(
    node.elements,
    list
  );

  for (let i = additions.length - 1; i >= 0; i--) {
    if (additions[i].content.insertAfterNode) {
      additions[i].content.insertAfterNode =
        additions[i].content.insertAfterNode.DOMNode;
    } else {
      additions[i].content.insertAfterNode = node.placeholder;
    }
    if (!additions[i].content.DOMNode) {
      additions[i].content = {
        ...additions[i].content,
        ...duplicateNode(node.content),
      };
      updates.push(additions[i]);
    }
    renderQueue.add(additions[i].content);
  }

  for (let i = 0; i < deletions.length; i++) {
    deletions[i].content.toBeDeleted = true;
    renderQueue.add(deletions[i].content);
  }

  for (let i = 0; i < updates.length; i++) {
    updateNode({
      node: updates[i].content,
      object: { ...object, ...node.content, [iterator]: updates[i].key },
    });
  }
}

function duplicateNode(content, parentNode) {
  let newContent = {
    ...content,
    children: [],
    DOMNode: content.DOMNode.cloneNode(false),
    newDOMNode: content.DOMNode.cloneNode(false),
  };
  if (parentNode) {
    parentNode.appendChild(newContent.DOMNode);
  }
  if (content.children) {
    newContent.children = content.children.map((child) =>
      duplicateNode(child, newContent.DOMNode)
    );
  }
  return newContent;
}

function updateForLoopElements(elementPointer, list) {
  let i = 0;
  let updates = [];
  let deletions = [];
  let additions = [];
  let lastExistingElement = elementPointer;
  while (i < list.length) {
    let inBetween = [elementPointer];
    let searchPointer = elementPointer.next;
    while (searchPointer && searchPointer.key !== list[i]) {
      inBetween.push(searchPointer);
      searchPointer = searchPointer.next;
    }
    if (searchPointer) {
      if (inBetween.length > 1) {
        deletions.push(...inBetween.slice(1, inBetween.length));
      }
      elementPointer.next = searchPointer;
      elementPointer = searchPointer;
      lastExistingElement = searchPointer;
      updates.push(searchPointer);
    } else {
      let newElement = {
        key: list[i],
        next: elementPointer.next,
        content: { insertAfterNode: lastExistingElement.content },
      };

      let alreadyExistingElementIndex = deletions.findIndex(
        (element) => element.key === list[i]
      );
      if (alreadyExistingElementIndex > -1) {
        newElement.content = {
          ...deletions.splice(alreadyExistingElementIndex, 1)[0].content,
          ...newElement.content,
        };
      }
      elementPointer.next = newElement;
      elementPointer = newElement;
      additions.push(newElement);
    }
    i++;
  }

  let inBetween = [elementPointer];
  let searchPointer = elementPointer.next;
  while (searchPointer && searchPointer.key !== list[i]) {
    inBetween.push(searchPointer);
    searchPointer = searchPointer.next;
  }
  if (inBetween.length > 1) {
    deletions.push(...inBetween.slice(1, inBetween.length));
  }
  elementPointer.next = null;

  return { updates, deletions, additions };
}

function updateIfNode(node, object) {
  let field = node.expression;
  let directLogic = true;

  if (field[0] === '!') {
    directLogic = false;
    field = field.substring(1);
  }

  let objectAttribute = getObjectAttribute(object, field);
  let isTrue =
    typeof objectAttribute == 'function' ? objectAttribute() : objectAttribute;
  if (isTrue && directLogic) {
    if (node.oldDOMNode && node.active !== true) {
      node.active = true;
      node.content.newDOMNode = node.oldDOMNode;
      node.content.skipChildren = false;
      renderQueue.add(node.content);
    }
  } else if (node.active !== false) {
    node.active = false;
    node.oldDOMNode = node.content.DOMNode;
    node.content.newDOMNode = node.placeholder;
    node.content.skipChildren = true;
    renderQueue.add(node.content);
  }

  if (node.active || node.active === null) {
    updateNode({ node: node.content, object });
  }
}

function updateTextNode(node, object) {
  let text = insertFieldsIntoString(node.text, object);
  if (node.DOMNode.nodeValue !== text) {
    node.newDOMNode = node.DOMNode.cloneNode(false);
    node.newDOMNode.nodeValue = text;
    renderQueue.add(node);
  }
}

function insertFieldsIntoString(string = '', object = {}) {
  let sections = string.split('}');
  let fields = {};

  for (let section of sections) {
    let field = section.split('{')[1];

    if (field) {
      fields[field] = getObjectAttribute(object, field);
    }
  }

  Object.keys(fields).forEach((key) => {
    string = string.replace(
      new RegExp(`{${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}}`, 'g'),
      getObjectAttribute(object, key)
    );
  });

  return string;
}

export { updateNode };
