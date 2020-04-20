'use strict';
import { Component, loadComponents, setRoot } from './components';
import { processQueue, renderQueue } from './definitions';
import { updateNode } from './nodes';

function renderNode(node) {
  if (node.toBeDeleted) {
    node.DOMNode.remove();
    node.toBeDeleted = false;
  } else if (node.insertAfterNode) {
    node.insertAfterNode.after(node.DOMNode);
    node.insertAfterNode = null;
  } else {
    if (!node.skipChildren && node.children) {
      node.children.forEach((child) => {
        node.newDOMNode.appendChild(child.DOMNode);
      });
    }
    node.DOMNode.replaceWith(node.newDOMNode);
    node.DOMNode = node.newDOMNode;
  }
}

function workLoop(deadline) {
  let thereIsStillTime = true;
  while (processQueue.size && thereIsStillTime) {
    let elementToProcess = processQueue.pop();
    updateNode(elementToProcess);
    thereIsStillTime = deadline.timeRemaining() > 0;
  }
  while (renderQueue.size && thereIsStillTime) {
    let elementToRender = renderQueue.entries().next().value[0];
    renderQueue.delete(elementToRender);
    renderNode(elementToRender);

    thereIsStillTime = deadline.timeRemaining() > 0;
  }

  requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);

export { Component, loadComponents, setRoot };
